const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// Register a custom protocol to handle paths correctly
// This makes the app think it's running from a real root (app://)
const protocolName = 'app';

// Register the scheme as privileged BEFORE app is ready
// This is CRITICAL to fix the SecurityError and origin 'null' issues
protocol.registerSchemesAsPrivileged([
    { scheme: protocolName, privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, 'assets/icon.png')
    });

    // Load via our custom protocol
    // Using a more "standard" looking URL to help expo-router
    win.loadURL(`${protocolName}://app/index.html`);

    // Open DevTools for debugging
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    // Set up the custom protocol before creating the window
    protocol.registerFileProtocol(protocolName, (request, callback) => {
        // request.url will be something like "app://app/index.html"
        // We want to extract "index.html"
        const urlPart = request.url.substr(protocolName.length + 3); // "app/index.html"
        const relativePath = urlPart.startsWith('app/') ? urlPart.substr(4) : urlPart;

        const filePath = path.join(__dirname, 'dist', relativePath.split('?')[0]);
        callback({ path: filePath });
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
