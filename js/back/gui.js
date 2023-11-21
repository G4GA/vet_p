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

const loginWindow = () => {
  const win = new BrowserWindow ({
    width: 800,
    height: 450,
    maxWidth: 800,
    maxHeight: 450,
  })
  win.loadFile('html/login.html')
}

module.exports = loginWindow,createWindow;