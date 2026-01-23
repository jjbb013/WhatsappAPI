const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const http = require('http');
const { Server } = require('ws');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const nodeCron = require('node-cron');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const mime = require('mime-types'); // 需在顶部引入

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

const PORT = process.env.PORT || 3000;
const SESSION_FILE_PATH = './.wwebjs_auth';
const TASKS_FILE = path.join(__dirname, 'scheduledTasks.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Multer configuration for file uploads
const upload = multer({
    dest: UPLOADS_DIR,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

let apiKey = null;
let qrCodeDataUrl = null;
let clientStatus = 'Initializing...';
let scheduledTasks = {}; // Store scheduled tasks

// Function to save tasks to file
function saveTasks() {
    const tasksToSave = {};
    for (const id in scheduledTasks) {
        const task = scheduledTasks[id];
        tasksToSave[id] = {
            id: task.id,
            cron: task.cron,
            number: task.number,
            message: task.message,
            isGroup: task.isGroup,
            imagePath: task.imagePath || null // Save image path
        };
    }
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasksToSave, null, 2));
}

// Function to load tasks from file and reschedule them
function loadTasks() {
    if (fs.existsSync(TASKS_FILE)) {
        const tasksData = JSON.parse(fs.readFileSync(TASKS_FILE));
        console.log('Loading tasks from file:', tasksData);
        for (const id in tasksData) {
            const taskData = tasksData[id];
            const task = nodeCron.schedule(taskData.cron, async () => {
                console.log(`Executing scheduled task ${taskData.id}: Sending message to ${taskData.number}`);
                const suffix = taskData.isGroup ? '@g.us' : '@c.us';
                const chatId = `${taskData.number.replace(/\+/g, '')}${suffix}`;

                try {
                    if (taskData.imagePath && fs.existsSync(taskData.imagePath)) {
                        const fileData = fs.readFileSync(taskData.imagePath, { encoding: 'base64' });
                        const mimeType = mime.lookup(taskData.imagePath) || 'image/png';
                        const fileName = path.basename(taskData.imagePath);
                        const media = new MessageMedia(mimeType, fileData, fileName);
                        await client.sendMessage(chatId, media, { caption: taskData.message });
                        // 不再删除图片，保证每次都能发送
                    } else {
                        await client.sendMessage(chatId, taskData.message);
                    }
                } catch (err) {
                    console.error(`Failed to send scheduled message for task ${taskData.id}:`, err);
                }
            });
            scheduledTasks[id] = { ...taskData, task };
            console.log(`Rescheduled task ${id}. Current scheduledTasks:`, scheduledTasks[id]);
        }
        console.log(`Loaded ${Object.keys(tasksData).length} scheduled tasks.`);
    }
}

// --- WhatsApp Client Setup ---
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'whatsapp-api-server',
        dataPath: './.wwebjs_auth'
    }), // Persist session
    puppeteer: {
        headless: 'new', // Use new headless mode for better compatibility
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined, // Use system-installed Chromium
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ], // Required for Docker and better stability
        defaultViewport: null, // Use default viewport
        timeout: 60000 // Increase timeout for better reliability
    },
    restartOnAuthFail: true, // Auto-restart on authentication failure
    qrMaxRetries: 5, // Maximum QR code retries
    takeoverOnConflict: true, // Handle session conflicts
    takeoverTimeoutMs: 30000 // Timeout for session takeover
});

client.on('qr', (qr) => {
    console.log('WhatsApp Client: QR Code received.');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('WhatsApp Client Error: Error generating QR code', err);
            clientStatus = 'Error generating QR code. Please try again.';
            broadcast({ type: 'status', data: clientStatus });
            return;
        }
        qrCodeDataUrl = url;
        clientStatus = 'Please scan the QR code with your WhatsApp mobile app.';
        broadcast({ type: 'qr', data: url });
        console.log('WhatsApp Client: QR Code broadcasted.');
    });
});

client.on('authenticated', () => {
    console.log('WhatsApp Client: Authenticated successfully.');
    clientStatus = 'Authenticated. Initializing client...';
    // Generate and store API key only once on first successful authentication
    if (!apiKey) {
        apiKey = uuidv4();
        console.log(`WhatsApp Client: API Key generated: ${apiKey}`);
    }
    broadcast({ type: 'status', data: clientStatus });
});

client.on('auth_failure', (msg) => {
    console.error('WhatsApp Client: Authentication failure:', msg);
    clientStatus = 'Authentication failed. Please scan QR code again.';
    apiKey = null; // Invalidate API key on auth failure
    broadcast({ type: 'status', data: clientStatus });
});

client.on('ready', () => {
    console.log('WhatsApp Client: Client is ready and connected.');
    qrCodeDataUrl = null; // QR code is no longer needed
    clientStatus = 'Client is ready and connected.';
    broadcast({ type: 'ready', apiKey: apiKey });
    loadTasks(); // Load and reschedule tasks when client is ready
    console.log('WhatsApp Client: Tasks loaded and rescheduled.');
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp Client: Client was disconnected. Reason:', reason);
    clientStatus = 'Client disconnected. Attempting to reconnect...';
    apiKey = null; // Invalidate API key
    broadcast({ type: 'status', data: clientStatus });
    
    // Wait a bit before attempting to re-initialize
    setTimeout(() => {
        console.log('WhatsApp Client: Attempting to re-initialize after disconnection.');
        try {
            client.initialize();
        } catch (error) {
            console.error('WhatsApp Client: Error re-initializing client:', error);
            clientStatus = 'Failed to reinitialize. Please restart the service.';
            broadcast({ type: 'status', data: clientStatus });
        }
    }, 5000);
});

client.on('loading_screen', (percent, message) => {
    console.log(`WhatsApp Client: Loading ${percent}% - ${message}`);
    clientStatus = `Loading WhatsApp... ${percent}%`;
    broadcast({ type: 'status', data: clientStatus });
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

// --- Session Middleware ---
app.use(session({
    secret: 'a-static-secret-key-that-is-not-easily-guessable', // A strong, unique secret for the session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// --- Authentication Middleware ---
const checkAuthForPages = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

const checkAuthForApi = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized. Please login again.' });
    }
};

// Login API
app.post('/login', (req, res) => {
    const { password } = req.body;
    const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || '984819';
    // 只校验密码
    if (password === LOGIN_PASSWORD) {
        req.session.loggedIn = true;
        res.status(200).json({ success: true, message: 'Logged in successfully.' });
    } else {
        res.status(401).json({ success: false, message: '密码错误。' });
    }
});

// Logout API
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Could not log out.' });
        }
        res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
});

// Serve login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- Protected Routes ---
app.get('/', checkAuthForPages, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/schedule.html', checkAuthForPages, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'schedule.html'));
});

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

    // Check if client is ready before attempting to send message
    if (!client.info) {
        return res.status(503).json({ error: 'WhatsApp client not ready. Please ensure it is connected.' });
    }

    const { number, message, isGroup } = req.body;
    if (!number || !message) {
        return res.status(400).json({ error: 'Missing "number" or "message" in request body.' });
    }
    
    const suffix = isGroup ? '@g.us' : '@c.us';
    const chatId = `${number.replace(/\+/g, '')}${suffix}`;

    try {
        await client.sendMessage(chatId, message);
        res.status(200).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message.', details: error.message });
    }
});

// Batch Send API
app.post('/batch-send', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid.' });
    }

    const providedKey = authHeader.split(' ')[1];
    if (!apiKey || providedKey !== apiKey) {
        return res.status(403).json({ error: 'Invalid API Key.' });
    }

    // Check if client is ready before attempting to send message
    if (!client.info) {
        return res.status(503).json({ error: 'WhatsApp client not ready. Please ensure it is connected.' });
    }

    const { numbers, message, isGroup = false } = req.body;

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0 || !message) {
        return res.status(400).json({ error: 'Invalid request. "numbers" must be a non-empty array and "message" must be provided.' });
    }

    res.status(202).json({ success: true, message: `Batch sending started for ${numbers.length} numbers. Check server logs for progress.` });

    // Start sending messages in the background
    (async () => {
        const suffix = isGroup ? '@g.us' : '@c.us';
        for (const number of numbers) {
            try {
                const delay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000; // Random delay between 5-10 seconds
                await new Promise(resolve => setTimeout(resolve, delay));

                const chatId = `${number.replace(/\+/g, '')}${suffix}`;
                console.log(`Sending message to ${number}`);
                await client.sendMessage(chatId, message);
                console.log(`Message sent to ${number}`);
            } catch (error) {
                console.error(`Failed to send message to ${number}:`, error.message);
            }
        }
        console.log('Batch sending complete.');
    })();
});

// Schedule Task API
app.post('/schedule', checkAuthForApi, upload.single('image'), (req, res) => {
    const { cron, number, message, isGroup } = req.body;
    const imagePath = req.file ? req.file.path : null; // Get path of uploaded image

    // Check if client is ready before attempting to schedule message
    if (!client.info) {
        if (imagePath) fs.unlinkSync(imagePath); // Clean up uploaded file if client not ready
        return res.status(503).json({ error: 'WhatsApp client not ready. Please ensure it is connected before scheduling.' });
    }

    if (!nodeCron.validate(cron)) {
        // If cron is invalid, delete the uploaded file if any
        if (imagePath) fs.unlinkSync(imagePath);
        return res.status(400).json({ error: 'Invalid Cron expression.' });
    }

    const taskId = uuidv4();
    const task = nodeCron.schedule(cron, async () => {
        console.log(`Executing scheduled task ${taskId}: Sending message to ${number}`);
        const suffix = isGroup ? '@g.us' : '@c.us';
        const chatId = `${number.replace(/\+/g, '')}${suffix}`;

        // Check if client is ready before sending the message within the scheduled task
        if (!client.info) {
            console.error(`WhatsApp client not ready for scheduled task ${taskId}. Skipping message send.`);
            return;
        }

        try {
            if (imagePath && fs.existsSync(imagePath)) {
                const fileData = fs.readFileSync(imagePath, { encoding: 'base64' });
                const mimeType = mime.lookup(imagePath) || 'image/png';
                const fileName = path.basename(imagePath);
                const media = new MessageMedia(mimeType, fileData, fileName);
                await client.sendMessage(chatId, media, { caption: message });
                // 不再删除图片，保证每次都能发送
            } else {
                await client.sendMessage(chatId, message);
            }
        } catch (err) {
            console.error(`Failed to send scheduled message for task ${taskId}:`, err);
        }
    });

    scheduledTasks[taskId] = { id: taskId, cron, number, message, isGroup, task, imagePath };
    saveTasks(); // Save tasks after a new one is scheduled
    res.status(201).json({ success: true, id: taskId });
});

// Get Active Tasks API
app.get('/tasks', checkAuthForApi, (req, res) => {
    const taskList = Object.values(scheduledTasks).map(t => ({
        id: t.id, cron: t.cron, number: t.number, message: t.message, isGroup: t.isGroup
    }));
    res.status(200).json(taskList);
});

// Cancel Task API
app.post('/cancel-task', checkAuthForApi, (req, res) => {
    const { id } = req.body;
    console.log(`Attempting to cancel task with ID: ${id}`);
    console.log('Current scheduledTasks object:', Object.keys(scheduledTasks));
    if (scheduledTasks[id]) {
        console.log(`Task ${id} found. Stopping and deleting.`);
        scheduledTasks[id].task.stop();
        delete scheduledTasks[id];
        saveTasks(); // Save tasks after one is cancelled
        res.status(200).json({ success: true, message: `Task ${id} cancelled.` });
    } else {
        console.log(`Task ${id} not found.`);
        res.status(404).json({ error: 'Task not found.' });
    }
});

// Health Check API
app.get('/health', (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        whatsapp: {
            connected: client.info ? true : false,
            status: clientStatus
        },
        memory: process.memoryUsage(),
        version: require('./package.json').version
    };
    
    const statusCode = client.info ? 200 : 503;
    res.status(statusCode).json(health);
});

// Get All Groups API
app.get('/groups', checkAuthForApi, async (req, res) => {
    try {
        // Check if client is ready before attempting to get chats
        if (!client.info) {
            console.error('Client not ready to fetch groups.');
            return res.status(503).json({ error: 'WhatsApp client not ready. Please ensure it is connected.' });
        }
        const chats = await client.getChats();
        const groups = chats
            .filter(chat => chat.isGroup)
            .map(chat => ({ id: chat.id._serialized, name: chat.name }));
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups.', details: error.message });
    }
});

// Temporary Test Send API (no auth, hardcoded message)
app.get('/test-send', async (req, res) => {
    if (!client.info) {
        return res.status(503).json({ error: 'WhatsApp client not ready for test send.' });
    }
    const testNumber = '8613764176027'; // REPLACE with a valid number for testing
    const testMessage = 'Hello from test API!';
    try {
        await client.sendMessage(testNumber, testMessage);
        res.status(200).json({ success: true, message: `Test message sent to ${testNumber}` });
    } catch (error) {
        console.error('Failed to send test message:', error);
        res.status(500).json({ success: false, error: 'Failed to send test message.', details: error.message });
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to scan the QR code.`);
});
