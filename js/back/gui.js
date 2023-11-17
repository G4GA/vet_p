const { BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1600,
      height: 900,
      maxHeight: 900,
      maxWidth: 1600
    })

    win.loadFile('html/index.html')
  }

module.exports = createWindow;