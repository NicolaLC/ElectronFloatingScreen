// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(Object.assign({
    /// definiamo larghezza e altezza per la window
    width: 200,
    height: 400,
    /// togliamo il frame in alto, ovvero rendiamola floating
    frame: false,
    /// e impostiamo la trasparenza, fondamentale per creare una loading screen floating
    transparent: true
  }));
  loadingScreen.setResizable(false);
  loadingScreen.loadURL('file://' + __dirname + '/windows/loading/loading.html');
  loadingScreen.on('closed', () => loadingScreen = null);
  loadingScreen.webContents.on('did-finish-load', () => {
      loadingScreen.show();
  });
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    /// aggiungiamo la proprietà **show** a false, in modo che la finestra venga creata ma non mostrata finchè il contenuto non ha terminato il suo caricamento
    show: false
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  mainWindow.webContents.on('did-finish-load', () => {
    /// quando il contenuto ha caricato, chiudiamo la loading screen e mostriamo la main window
    if (loadingScreen) {
      loadingScreen.close();
    }
    mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createLoadingScreen();
  /// aggiungiamo un timeout per simulare un caricamento piu lungo, questo non è necessario al fine del tutorial
  setTimeout(() => {
    createWindow();
  }, 2000);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
