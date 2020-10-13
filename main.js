const { app, BrowserWindow, Menu, ipcMain, clipboard } = require('electron')
const path = require('path')
const robot = require('robotjs')
robot.setKeyboardDelay(30)

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
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('./sigma-x-react/public/index.html')
}

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