const { BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600
    })

    win.loadFile('html/index.html')
  }

module.exports = createWindow;