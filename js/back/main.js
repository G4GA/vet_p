const {app} = require('electron');
const {createWindow} = require('./gui');
const {ipcLogic} = require('./ipcConfig');

const main = () => {
  win = createWindow(450,800,'html/login.html');

  ipcLogic(win);
}

const createApp = () => {
  app.whenReady().then(() =>{
    main ();
  })

  app.on('window-all-closed', () => {
    app.quit()
  })
}

createApp();