const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// Register a custom protocol to handle paths correctly
// This makes the app think it's running from a real root (app://)
const protocolName = 'app';

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
    win.loadURL(`${protocolName}://./index.html`);

    // Open DevTools for debugging
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    // Set up the custom protocol before creating the window
    // registerFileProtocol is deprecated in newer Electron, using registerFileProtocol (for now)
    // or handle it with handle() if using Electron 25+
    protocol.registerFileProtocol(protocolName, (request, callback) => {
        const url = request.url.substr(protocolName.length + 3);
        const filePath = path.join(__dirname, 'dist', url.split('?')[0]);
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
