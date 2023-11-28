const {createWindow} = require('./gui');
const {ipcMain} = require('electron');
const {query} = require('./db');
const fs = require ('fs');

const ipcLogic = (initial_window) => {
    var u_result;
    ipcMain.on('login-click',async (event,{username,password}) => {
        var query_str = `SELECT * FROM empleado WHERE n_usuario='${username}'`;
        var result = await query(query_str);
        var result = JSON.parse(result);
        u_result = result;
        if (result) {
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

    ipcMain.on ('get-rol', (event) => {
        event.sender.send('set-rol',u_result);
    });

    ipcMain.on ('get-venta',(event) => {
        fs.readFile ('./html/venta.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-venta',data);
        });
    });

    ipcMain.on ('get-empleado',(event) => {
        fs.readFile ('./html/empleado.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-empleado',data);
        });
    });
}


module.exports = {ipcLogic};