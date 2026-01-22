document.addEventListener('DOMContentLoaded', () => {
    const statusEl = document.getElementById('status');
    const qrContainer = document.getElementById('qr-container');
    const qrImage = document.getElementById('qr-image');
    const apiKeyContainer = document.getElementById('api-key-container');
    const apiKeyEl = document.getElementById('api-key');
    const copyButton = document.getElementById('copy-button');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onopen = () => {
        statusEl.textContent = 'Connected to server. Waiting for status...';
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case 'qr':
                statusEl.parentElement.classList.add('hidden');
                apiKeyContainer.classList.add('hidden');
                qrContainer.classList.remove('hidden');
                qrImage.src = message.data;
                break;
            
            case 'ready':
                statusEl.parentElement.classList.add('hidden');
                qrContainer.classList.add('hidden');
                apiKeyContainer.classList.remove('hidden');
                apiKeyEl.textContent = message.apiKey;
                // Store the API key in session storage for other pages to use
                sessionStorage.setItem('whatsappApiKey', message.apiKey);
                // Auto-redirect to batch send page after 2 seconds
                setTimeout(() => {
                    window.location.href = '/schedule.html';
                }, 2000);
                break;

            case 'status':
                statusEl.textContent = message.data;
                break;
        }
    };

    ws.onclose = () => {
        statusEl.textContent = 'Disconnected from server. Please refresh the page to reconnect.';
        qrContainer.classList.add('hidden');
        apiKeyContainer.classList.add('hidden');
        statusEl.parentElement.classList.remove('hidden');
    };

    ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        statusEl.textContent = 'Error connecting to the server.';
    };

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(apiKeyEl.textContent).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });
});
