const path = require('path');
const fs = require("fs");

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { setVibrancy } = require("electron-acrylic-window");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  setVibrancy(win, {
    theme: "dark",
    effect: "blur",
  });

  // listen for close event
  ipcMain.handle("close", () => {
    app.quit();
  });

  // listen for save event
  ipcMain.handle("save", (e, content) => {
    dialog.showSaveDialog(win, {defaultPath: "notes.md"}).then(result => {
      if (result !== undefined) {
        fs.writeFileSync(result.filePath, content);
      }
    });
  });

  // listen for open event
  ipcMain.handle("open", (e) => {
    let paths = dialog.showOpenDialogSync(win, {
      properties: ["openFile"]
    });
    if (paths === undefined) {return undefined;}
    return fs.readFileSync(paths[0]).toString();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});