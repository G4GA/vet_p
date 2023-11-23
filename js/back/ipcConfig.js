const {createWindow} = require('./gui');
const {ipcMain} = require('electron');

const ipcLogic = (initial_window) => {
    ipcMain.on('login-click',(event,{username,password}) => {
        console.log(username + " " + password);
        event.sender.send('login-repply',false);
    });
}


module.exports = {ipcLogic};