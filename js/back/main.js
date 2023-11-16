const { app } = require('electron')
const createWindow= require ('./gui.js');

app.whenReady().then(() => {
    createWindow();
  })

