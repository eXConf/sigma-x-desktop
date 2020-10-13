const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  sendToChatAPI: {
    sendToChat(message) {
      ipcRenderer.send('to-chat', message)
    }
  }
})