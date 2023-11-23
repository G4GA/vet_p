const { BrowserWindow, app } = require('electron')

const createWindow = (win_h, win_w, html_path) => {
  let win = new BrowserWindow({
    width:win_w,
    height:win_h,
    minHeight:win_h,
    maxWidth:win_w,
    maximizable:false,
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

const main = () => {
  win = createWindow(450,800,'html/login.html');
}

const createApp = () => {
  app.whenReady().then(() =>{
    main ();
  })
}

module.exports = {createApp};