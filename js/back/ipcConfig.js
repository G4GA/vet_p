const {createWindow} = require('./gui');
const {ipcMain} = require('electron');
const {query} = require('./db');
const fs = require ('fs');

const ipcLogic = (initial_window) => {
    var rol = null;

    ipcMain.on('login-click',async (event,{username,password}) => {
        var query_str = `SELECT n_usuario,contrasena,id_tipo_empleado FROM empleado WHERE n_usuario='${username}'`;
        var result = await query(query_str);
        result = JSON.parse(result);
        if (result) {
            rol = result['id_tipo_empleado'];
            if (result['contrasena'] === password) {
                await event.sender.send('login-repply',true);
                await new Promise(r => setTimeout(r, 500));
                initial_window.close();
                initial_window = createWindow(600,1200,'html/index.html');
            } else {
                event.sender.send('login-repply',false);
            }
        }
        else {
            event.sender.send('login-repply',false);
        }
    });

    ipcMain.on('set-rol',(event) => {
    });
}


module.exports = {ipcLogic};