const {createWindow} = require('./gui');
const {ipcMain} = require('electron');
const {query} = require('./db');

const ipcLogic = (initial_window) => {
    ipcMain.on('login-click',async (event,{username,password}) => {
        var query_str = `SELECT n_usuario,contrasena FROM empleado WHERE n_usuario='${username}'`;
        var result = await query(query_str);
        result = JSON.parse(result);
        if (result) {
            if (result['contrasena'] === password) {
                await event.sender.send('login-repply',true);
                await new Promise(r => setTimeout(r, 500));
                initial_window.close();
                initial_window = createWindow(900,1200,'./html/index.js');
            } else {
                event.sender.send('login-repply',false);
            }
        }
        else {
            event.sender.send('login-repply',false);
        }
    });
}


module.exports = {ipcLogic};