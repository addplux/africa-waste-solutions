const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

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

    // Intercept absolute paths and map them to the dist folder
    // This fixes the white screen caused by Expo's absolute paths (/_expo/...)
    const filter = {
        urls: ['file:///_expo/*', 'file:///favicon.ico']
    };

    win.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) => {
        const relativePath = details.url.replace('file:///', '');
        callback({ redirectURL: url.pathToFileURL(path.join(__dirname, 'dist', relativePath)).href });
    });

    win.loadFile(path.join(__dirname, 'dist/index.html'));

    // Uncomment to debug if still showing white screen
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
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
