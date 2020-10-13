const { app, BrowserWindow, Menu } = require('electron')

new Menu()
Menu.setApplicationMenu(null)

function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 800,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true
    }
  })

  win.loadFile('./sigma-x-react/public/index.html')
}

app.whenReady().then(createWindow)