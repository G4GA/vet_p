const {createWindow} = require('./gui');
const {ipcMain} = require('electron');
const {query} = require('./db');
const fs = require ('fs');

const ipcLogic = (initial_window) => {
    var u_result;
    ipcMain.on('login-click',async (event,{username,password}) => {
        var query_str = `SELECT * FROM empleado WHERE n_usuario='${username}'`;
        var idSuspended = JSON.parse(await query("SELECT * FROM tipo_empleado WHERE rol='suspendido'"))[0]['id_tipo_empleado'];
        var result = await query(query_str);
        if (result != null) {
            var result = JSON.parse(result)[0];
            var iSuspended = idSuspended === result['id_tipo_empleado'];
            u_result = result;
        }
        if (result != null && result['id_tipo_empleado'] === idSuspended){
            event.sender.send('login-repply',false,iSuspended);
        }
        else if (result) {
            if (result['contrasena'] === password) {

                event.sender.send('login-repply',true,iSuspended);
                await new Promise(r => setTimeout(r, 500));

                initial_window.close();
                initial_window = createWindow(600,1200,'html/index.html');
            } else {
                event.sender.send('login-repply',false,iSuspended);
            }
        }
        else {
            event.sender.send('login-repply',false,iSuspended);
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

    ipcMain.on('get-emType',async (event) => {
        var type_str_query = 'SELECT * FROM tipo_empleado';
        var res = await query(type_str_query);
        event.sender.send('set-emType',JSON.parse(res));
    });

    ipcMain.on ('get-empleado',(event) => {
        fs.readFile ('./html/empleado.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-empleado',data);
        });
    });

    ipcMain.on ('update-enter-user',async (event,values) => {
        var roles = JSON.parse(await query("SELECT * FROM tipo_empleado"));
        var isNumber = values['tel_val'].match(/^\d+$/) != null && values['tel_val'].length == 10;

        for (var i in roles) {
            roles[i] = (roles[i]['rol']);
        }

        var isValidType = roles.includes(values['em_type_input'].toLowerCase());

        if (isValidType && isNumber) {
            var RolId = JSON.parse(await query(`SELECT id_tipo_empleado FROM tipo_empleado WHERE rol='${values['em_type_input'].toLowerCase()}'`))[0]['id_tipo_empleado'];

            var qry_result = await query(`INSERT INTO empleado VALUES (DEFAULT,${RolId},'${values['name_val']}','${values['uname_val']}','${values['pwd_val']}','${values['addr_val']}','${values['date_val']}','${values['tel_val']}')`);
            console.log(qry_result);
        }
        event.sender.send('update-enter-user-result',isNumber,isValidType);
    });
}


module.exports = {ipcLogic};