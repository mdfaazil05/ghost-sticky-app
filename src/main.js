const { app, BrowserWindow,Tray, Menu } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let tray = null;

const getIconPath = () => {
  switch (process.platform) {
    case 'win32':
      return path.resolve(__dirname, '../../assets/icon.ico'); // Windows
    case 'darwin':
      return path.resolve(__dirname, '../../assets/icon.icns'); // macOS
    default:
      return path.resolve(__dirname, '../../assets/icon.png'); // Linux
  }
};


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 350,
    frame: false,          // Essential for "Sticky Note" look
    transparent: true,     // Makes it feel native
    icon: getIconPath(),   // Set the appropriate icon for each platform
    alwaysOnTop: true,     // Sticky notes stay on top
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // THE MAGIC LINE: Prevents capture in Teams/Zoom
  mainWindow.setContentProtection(true);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

// tray = new Tray(getIconPath());

  // 2. Create the right-click menu for the tray
  // const contextMenu = Menu.buildFromTemplate([
  //   { 
  //     label: 'Show Ghost Note', 
  //     click: () => {
  //       // Find the window and show it
  //       const win = BrowserWindow.getAllWindows()[0];
  //       if (win) {
  //         win.show();
  //         win.focus();
  //       } else {
  //         createWindow(); // Recreate it if they closed it completely
  //       }
  //     } 
  //   },
  //   { type: 'separator' }, // A visual dividing line
  //   { 
  //     label: 'Quit', 
  //     click: () => {
  //       app.quit(); // Fully closes the application
  //     } 
  //   }
  // ]);

  // // 3. Attach the menu and a hover tooltip to the tray
  // tray.setToolTip('Ghost Note');
  // tray.setContextMenu(contextMenu);

  // // 4. (Windows only) Allow them to just left-click the icon to toggle the note
  // tray.on('click', () => {
  //   const win = BrowserWindow.getAllWindows()[0];
  //   if (win) {
  //     win.isVisible() ? win.hide() : win.show();
  //   }
  // });

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
