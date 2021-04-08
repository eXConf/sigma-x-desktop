const { app, BrowserWindow, Menu, ipcMain, clipboard } = require('electron')
const path = require('path')
const robot = require('robotjs')
const fs = require('fs')

new Menu()
Menu.setApplicationMenu(null)

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../assets')

const getAssetPath = (...paths) => {
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

// Fix for windows portable build
const folder = process.env.PORTABLE_EXECUTABLE_DIR
const filePath = folder ? path.join(folder, 'sigma.state') : 'sigma.state'

app.whenReady().then(createWindow)

robot.setKeyboardDelay(60)

ipcMain.on('set-robot-delay', (e, delay) => {
  robot.setKeyboardDelay(delay)
})

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

ipcMain.on('save-state-to-file', (e, state) => {
  try {
    fs.writeFileSync(filePath, state)
  } catch (err) {
    console.log(err)
  }
})

ipcMain.on('read-state-from-file', e => {
  try {
    const state = fs.readFileSync(filePath, 'utf8')
    e.sender.send('send-loaded-state', state)
  } catch (err) {
    console.log(err)
  }
})
