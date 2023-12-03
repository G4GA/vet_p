const { BrowserWindow, app } = require('electron')

const createWindow = (win_h, win_w, html_path,parent) => {
  let win = new BrowserWindow({
    width:win_w,
    height:win_h,
    maximizable:false,
    resizable: false,
    parent: parent != null ? parent : undefined,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile(html_path);

  win.on('close',() => {
    win = null;
  });

  return win;
}

module.exports = {createWindow};