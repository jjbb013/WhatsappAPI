const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const http = require('http');
const { Server } = require('ws');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

const PORT = process.env.PORT || 3000;
const SESSION_FILE_PATH = './.wwebjs_auth';

let apiKey = null;
let qrCodeDataUrl = null;
let clientStatus = 'Initializing...';

// --- WhatsApp Client Setup ---
const client = new Client({
    authStrategy: new LocalAuth(), // Persist session
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined, // Use system-installed Chromium
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for Docker
    }
});

client.on('qr', (qr) => {
    console.log('QR Code received, generating data URL.');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error generating QR code', err);
            return;
        }
        qrCodeDataUrl = url;
        clientStatus = 'Please scan the QR code.';
        broadcast({ type: 'qr', data: url });
    });
});

client.on('authenticated', () => {
    console.log('Client is authenticated!');
    clientStatus = 'Authenticated. Initializing client...';
    // Generate and store API key only once on first successful authentication
    if (!apiKey) {
        apiKey = uuidv4();
        console.log(`API Key generated: ${apiKey}`);
    }
    broadcast({ type: 'status', data: clientStatus });
});

client.on('ready', () => {
    console.log('Client is ready!');
    qrCodeDataUrl = null; // QR code is no longer needed
    clientStatus = 'Client is ready and connected.';
    broadcast({ type: 'ready', apiKey: apiKey });
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    clientStatus = 'Client disconnected. Please restart the service.';
    apiKey = null; // Invalidate API key
    // Optionally, you can try to re-initialize or clean up session files
    // fs.rmSync(SESSION_FILE_PATH, { recursive: true, force: true });
    broadcast({ type: 'status', data: clientStatus });
    client.initialize();
});

client.initialize();

// --- WebSocket Server for Real-time Frontend Updates ---
wss.on('connection', (ws) => {
    console.log('Frontend client connected.');
    // Send current state to newly connected client
    if (qrCodeDataUrl) {
        ws.send(JSON.stringify({ type: 'qr', data: qrCodeDataUrl }));
    } else {
        ws.send(JSON.stringify({ type: 'status', data: clientStatus }));
        if (client.info && apiKey) {
             ws.send(JSON.stringify({ type: 'ready', apiKey: apiKey }));
        }
    }
});

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify(data));
        }
    });
}

// --- Express API and Web Server ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to send messages
app.post('/send', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid.' });
    }

    const providedKey = authHeader.split(' ')[1];
    if (!apiKey || providedKey !== apiKey) {
        return res.status(403).json({ error: 'Invalid API Key.' });
    }

    const { number, message } = req.body;
    if (!number || !message) {
        return res.status(400).json({ error: 'Missing "number" or "message" in request body.' });
    }
    
    // Format number: 1234567890 -> 1234567890@c.us
    const chatId = `${number.replace(/\+/g, '')}@c.us`;

    try {
        await client.sendMessage(chatId, message);
        res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message.', details: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to scan the QR code.`);
});
