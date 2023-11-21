const { app } = require('electron')
const loginWindow = require ('./gui.js');

app.whenReady().then(() => {
    loginWindow();
  })

