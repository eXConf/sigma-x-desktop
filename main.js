const { app, BrowserWindow, Menu, ipcMain, clipboard } = require('electron')
const path = require('path')
const robot = require('robotjs')
robot.setKeyboardDelay(30)

new Menu()
Menu.setApplicationMenu(null)

let win

function createWindow() {
   win = new BrowserWindow({
    width: 620,
    height: 800,
    minWidth: 400,
    minHeight: 450,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./public/index.html')
}

// require('electron-reload')(__dirname, {
//   electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// })

app.whenReady().then(createWindow)

ipcMain.on('to-chat', (e, message) => {
  clipboard.writeText(message)
  robot.keyToggle("alt", "down")
  robot.keyTap("tab")
  robot.keyToggle("alt", "up")
  robot.keyToggle("shift", "down")
  // SetTimeout - попытка исправить баг, когда текст из буфера по какой-то
  // причине не вставляется
  setTimeout(() => {
      robot.keyTap("insert")
      robot.keyToggle("shift", "up")
      robot.keyTap("enter")
      robot.keyToggle("alt", "down")
      robot.keyTap("tab")
      robot.keyToggle("alt", "up")
  }, 10)
})

// ipcMain.on('resize', (e, width) => {
//   const height = win.getSize()[1]
//   console.log(width, win.getSize()[0])
//   // win.setSize(width + 10, height)
// })