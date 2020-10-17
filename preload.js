const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  bridge: {
    sendToChat(message) {
      ipcRenderer.send('to-chat', message)
    },
    // resize(width) {
    //   ipcRenderer.send('resize', width)
    // }
  }
})