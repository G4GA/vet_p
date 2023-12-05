const {createWindow} = require('./gui');
const {ipcMain} = require('electron');
const {query} = require('./db');
const fs = require ('fs');

const close_wlist = (window) => {
    if (window != null) {
        window.close();
    }
}

const ipcLogic = (initial_window) => {
    var u_result;
    var list_win = null;
    ipcMain.on('login-click',async (event,{username,password}) => {
        var query_str = `SELECT * FROM empleado WHERE n_usuario='${username}'`;
        var result = await query(query_str);

        if(result) {
            result = JSON.parse(result)[0];
            u_result = result;
            if (result['contrasena'] === password) {
                event.sender.send('login-repply',true,!result['activo']);
                if (result['activo']) {
                    await new Promise(r => setTimeout(r, 500));

                    initial_window.close();
                    initial_window = createWindow(720,1440,'html/index.html',null);
                }
            }
            else {
                event.sender.send('login-repply',false,!result['activo']);
            }
        }
        else {
            event.sender.send('login-repply',false,false);
        }
    });

    ipcMain.on ('get-rol', (event) => {
        event.sender.send('set-rol',u_result);
    });

    ipcMain.on ('get-venta',(event) => {
        close_wlist(list_win);
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

    ipcMain.on ('update-enter-user',async (event,values,id_element) => {
        console.log(values);
        var roles = JSON.parse(await query("SELECT * FROM tipo_empleado"));
        var isNumber = values['tel_val'].match(/^\d+$/) != null && values['tel_val'].length == 10;

        for (var i in roles) {
            roles[i] = (roles[i]['rol']);
        }

        var isValidType = roles.includes(values['em_type_input'].toLowerCase());

        if (isValidType && isNumber) {
            var RolId = JSON.parse(await query(`SELECT id_tipo_empleado FROM tipo_empleado WHERE rol='${values['em_type_input'].toLowerCase()}'`))[0]['id_tipo_empleado'];
            var qry_result;
            console.log(id_element);
            if (id_element != ''){
                qry_result = await query(`UPDATE empleado SET (id_tipo_empleado,nombre,n_usuario,contrasena,domicilio,fecha_creacion,telefono,activo) = (${RolId},'${values['name_val']}','${values['uname_val']}','${values['pwd_val']}','${values['addr_val']}','${values['date_val']}','${values['tel_val']}',${values['active_checkbox']}) WHERE id_empleado=${id_element}`);
            }
            else {
                qry_result = await query(`INSERT INTO empleado VALUES (DEFAULT,${RolId},'${values['name_val']}','${values['uname_val']}','${values['pwd_val']}','${values['addr_val']}','${values['date_val']}','${values['tel_val']}',${values['active_checkbox']})`);
            }
        }
        event.sender.send('update-enter-user-result',isNumber,isValidType);
    });

    ipcMain.on ('list-em', () => {

        if (list_win == null){
            list_win = createWindow(300,1000,'./html/employeList.html',initial_window);

            list_win.addListener('closed',()=>{
                list_win = null;
            })
        }
    });

    ipcMain.on ('get-list',async event => {
        let employe_list = JSON.parse(await query('SELECT id_empleado,id_tipo_empleado,nombre,n_usuario FROM empleado'))
        let role_list = JSON.parse(await query('SELECT * FROM tipo_empleado'));
        event.sender.send('set-list',employe_list,role_list);
    });

    ipcMain.on('select-clicked', async (event,empleado_id) => {
        let em_info = JSON.parse (await query(`SELECT * FROM empleado WHERE id_empleado=${empleado_id}`))[0];
        let role_list = JSON.parse (await query('SELECT * FROM tipo_empleado'));
        initial_window.webContents.send('fill-em-info',em_info,role_list);
        list_win.close ();
    })

    ipcMain.on('exit',(event) => {
        initial_window.close ();
        initial_window = createWindow(450,800,'html/login.html',null);
    });

    ipcMain.on ('get-cliente',async (event) => {
        close_wlist(list_win);
        fs.readFile ('./html/cliente.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-cliente',data);
        });
    });

    ipcMain.on('get-mascota',(event) => {
        close_wlist(list_win);
        fs.readFile ('./html/mascota.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-mascota',data);
        });
    });

    ipcMain.on ('get-venta',(event) => {
        close_wlist(list_win);
        fs.readFile ('./html/venta.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-mascota',data);
        });
    });

    ipcMain.on('get-compra',event => {
        close_wlist(list_win);
        fs.readFile ('./html/compra.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-mascota',data);
        });
    });
}

module.exports = {ipcLogic};