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
}

createApp();