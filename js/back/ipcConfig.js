const {createWindow} = require('./gui');
const {ipcMain, ipcRenderer} = require('electron');
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
        close_wlist(list_win);
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

    ipcMain.on('get-compra',async event => {
        close_wlist(list_win);
        let current_date = JSON.parse(await query('SELECT CURRENT_DATE'))[0]['current_date'].slice(0,10);
        fs.readFile ('./html/compra.html','utf-8', (err,data) => {
            if (err) throw Error('Not able to open the file');

            event.sender.send('set-compra',data,current_date);
        });
    });

    ipcMain.on ('get-date', async (event) => {
        date = JSON.parse(await query ('SELECT CURRENT_DATE'))[0]['current_date'].slice(0,10);

        event.sender.send('set-date',date);
    });

    ipcMain.on ('update-enter-client', async (event,values,id_element) => {
        let isValidNumber =  values['client_phone_val'].match(/^\d+$/) != null && values['client_phone_val'].length == 10;
        let value_string = `DEFAULT,'${values['client_name_val']}','${values['client_phone_val']}','${values['client_addr_val']}','${values['client_cdate_val']}','${values['client_udate_val']}'`;
        let update_string = `${id_element},'${values['client_name_val']}','${values['client_phone_val']}','${values['client_addr_val']}','${values['client_cdate_val']}',CURRENT_DATE`;
        let current_date = JSON.parse(await query('SELECT CURRENT_DATE'))[0]['current_date'].slice(0,10);
        if (isValidNumber) {
            if (id_element === '') {
                let result = await query(`INSERT INTO cliente VALUES(${value_string})`)
                console.log(result);
            }
            else {
                let result = await query(`UPDATE cliente set (id_cliente,nombre,telefono,domicilio,fecha_creacion,ultima_actualizacion) = (${update_string}) WHERE id_cliente=${id_element}`);
            }
            event.sender.send('update-enter-client-result',isValidNumber,current_date);
        }
        else {
            event.sender.send ('update-enter-client-result',isValidNumber,current_date);
        }
    });

    ipcMain.on ('list-client', (event) => {
        if (list_win == null){
            list_win = createWindow(300,1000,'./html/clientList.html',initial_window);

            list_win.addListener('closed',()=>{
                list_win = null;
            })
        }
    });

    ipcMain.on ('client-get-list',async (event) => {
        let clients = JSON.parse(await query('SELECT id_cliente,nombre,telefono FROM cliente'));
        event.sender.send('client-set-list',clients);
    });

    ipcMain.on ('select-clicked-client',async (event,client_id) => {
        close_wlist(list_win);
        let client_info = JSON.parse(await query(`SELECT * FROM cliente WHERE id_cliente=${client_id}`))[0];
        initial_window.webContents.send('fill_client_info',client_info);
    });

    ipcMain.on ('register-compra',async (event,products,supplier,employe) => {
        console.log(employe);

        let q_compra = `(DEFAULT,${employe['id_empleado']},'${supplier}',CURRENT_DATE)`;
        q_compra = `INSERT INTO compra VALUES ${q_compra} RETURNING id_compra`;
        var compra_result = JSON.parse(await query(q_compra))[0]['id_compra'];

        for (var product of products) {
            const [id,pname,cost,price,qty,min_stock] = Object.values(product);
            product = {
                        ['id']:id,
                        ['pname']:pname,
                        ['cost']:cost,
                        ['price']:price,
                        ['qty']:qty,
                        ['min_stock']:min_stock
                    }
            let query_str = `(DEFAULT,'${product['pname']}',${product['price']},${product['qty']},${product['min_stock']},CURRENT_DATE,CURRENT_DATE)`;
            if (product['id'] === 'Nueva entrada') {
                query_str = `INSERT INTO producto VALUES ${query_str} RETURNING id_producto`;
                var p_result = JSON.parse(await query(query_str))[0]['id_producto'];
                console.log(p_result);
            }
            else {
                let current_qty = parseInt(JSON.parse(await query (`SELECT cantidad FROM producto WHERE id_producto=${product['id']}`))[0]['cantidad']);
                let query_str_update = query_str = `(${product['id']},'${product['pname']}',${product['price']},${parseInt(product['qty']) + current_qty},${product['min_stock']},CURRENT_DATE)`;
            }


            let q_detalle = `(DEFAULT,'${p_result}','${compra_result}',${product['cost']},${product['qty']})`;
            q_detalle = `INSERT INTO detalle_compra VALUES ${q_detalle} RETURNING id_detalle_compra`;
            let detalle_result = JSON.parse(await query(q_detalle))[0]['id_detalle_compra'];
        }
    });

    ipcMain.on ('list-product',async (event,window) => {
        list_win = createWindow(300,1000,'./html/productList.html',initial_window);
        list_win.webContents.on('did-finish-load',() => {
            list_win.webContents.send('set-window',window);
        });
    });

    ipcMain.on ('product-get-list',async (event) => {
        let product_qry_str = 'SELECT * FROM producto';
        let product_result = JSON.parse(await query(product_qry_str));
        event.sender.send ('product-set-list',product_result);
    });

    ipcMain.on ('select-clicked-product', async (event,id) => {
        let product_result = JSON.parse (await query(`SELECT * FROM producto WHERE id_producto=${id}`))[0];
        let last_purchase = JSON.parse (await query(`SELECT * FROM compra ORDER BY fecha`))[0];
        let last_cost = JSON.parse (await query(`SELECT * FROM detalle_compra WHERE (id_compra=${last_purchase['id_compra']} AND id_producto=${product_result['id_producto']})`))[0]['precio_compra'];

        initial_window.webContents.send ('select-clicked-product-result',product_result,last_cost);
        list_win.close();
    });
}

module.exports = {ipcLogic};