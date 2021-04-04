const { app, BrowserWindow, Menu, ipcMain, clipboard } = require('electron')
const path = require('path')
const robot = require('robotjs')

robot.setKeyboardDelay(30)

new Menu()
Menu.setApplicationMenu(null)

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets')

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths)
}

let win

function createWindow() {
  win = new BrowserWindow({
    width: 620,
    height: 800,
    minWidth: 400,
    minHeight: 450,
    icon: getAssetPath('icon.png'),
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      // contextIsolation: true,
      devTools: false,
      // preload: path.join(__dirname, 'preload.js')
    },
  })

  win.loadFile('./public/index.html')
  // win.setTitle('SIGMA X v2.1.2')

  win.webContents.on('new-window', function (e, url) {
    e.preventDefault()
    require('electron').shell.openExternal(url)
  })
}

// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// })

app.whenReady().then(createWindow)

ipcMain.on('to-chat', (e, message) => {
  clipboard.writeText(message)
  // Without delay the clipboard is often empty
  setTimeout(() => {
    robot.keyToggle('alt', 'down')
    robot.keyTap('tab')
    robot.keyToggle('alt', 'up')
    robot.keyToggle('shift', 'down')
    robot.keyTap('insert')
    robot.keyToggle('shift', 'up')

    robot.keyTap('enter')
    robot.keyToggle('alt', 'down')
    robot.keyTap('tab')
    robot.keyToggle('alt', 'up')
  }, 90)
})
ipcMain.on('copy-to-buffer', (e, text) => {
  clipboard.writeText(text)
})
