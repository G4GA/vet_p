const {app} = require('electron');
const {createWindow} = require('./gui');
const {ipcLogic} = require('./ipcConfig');

const main = () => {
  var win = {['value']:createWindow(450,800,'html/login.html',null)};

  ipcLogic(win.value);
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