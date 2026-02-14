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
    // This handles Windows drive letters and variations in file URL formatting
    win.webContents.session.webRequest.onBeforeRequest((details, callback) => {
        let requestUrl = details.url;

        // Check if the URL is trying to access /_expo or /favicon.ico at the root of a drive
        // e.g., file:///D:/_expo/... or file:///_expo/...
        if (requestUrl.includes('/_expo/') || requestUrl.includes('/favicon.ico')) {
            const parts = requestUrl.split(/_expo\/|favicon\.ico/);
            const filename = requestUrl.includes('_expo') ? '_expo/' + parts[1] : 'favicon.ico';
            const newPath = path.join(__dirname, 'dist', filename);
            callback({ redirectURL: url.pathToFileURL(newPath).href });
        } else {
            callback({});
        }
    });

    win.loadFile(path.join(__dirname, 'dist/index.html'));

    // Enable DevTools so we can see the errors if it still fails
    win.webContents.openDevTools();
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
