const {ipcRenderer} = require('electron');
const getRol = require('../js/front/util.js');

var current_user;
let i_button = 1;


const clean_values = () => {
    var warning = document.getElementById('warning_label');
    if (warning != null) {
        warning.innerHTML = '';
    }
    var inputs = document.getElementsByClassName('em_input');
    document.getElementById('id_val').innerHTML = '';
    for (let i = 0;i < inputs.length;i ++) {
        inputs[i].value = '';
    }
};

const clean_client = (html_list,id_element,date) => {
    let client_warning = document.getElementById('client_warning');
    if (client_warning) {
        client_warning.innerHTML = '';
    }
    for (let i = 0;i < html_list.length;i ++) {

        if (html_list[i].type !== 'date') {
            html_list[i].value = '';
        }
        else {
            html_list[i].disabled = false;
            html_list[i].value = date;
            html_list[i].disabled = true;
        }
    }
    id_element.innerHTML = '';
};

const showUser = (user) => {
    var userName = document.createElement('p');
    userName.id = 'user_name';
    userName.style.fontWeight = 'bold';
    userName.className = 'u_name';
    userName.innerHTML = user['nombre'];
    document.getElementById('u_log').appendChild(userName);
}

ipcRenderer.send('get-rol');

ipcRenderer.on ('set-rol',(event,user) => {
    current_user = user;
    console.log(current_user);
    showUser(current_user);
    switch (user['id_tipo_empleado']) {
        case 1:
            document.getElementById('regEmpleado').remove();
            document.getElementById('receta').remove();
        break;
        case 2:
        case 4:
        break;
        case 3:
            document.getElementById('compra').remove();
            document.getElementById('regCliente').remove();
            document.getElementById('regMascota').remove();
            document.getElementById('regEmpleado').remove();
            document.getElementById('venta').remove();
        break;
        default:
            throw Error('Rol does not exist!');
        }
});

ipcRenderer.on('set-venta', (event,html) => {
    document.getElementById('content').innerHTML = html;
});

//Empleado
ipcRenderer.on('set-empleado',async (event,html) => {
    document.getElementById('content').innerHTML = await html;
    init_em();
});

document.getElementById('regEmpleado').addEventListener('click', () => {
    ipcRenderer.send('get-empleado');
});

const init_em = () => {
    document.getElementById('em_save').addEventListener('click', () => {
        var warning = document.getElementById('warning_label') === null ? document.createElement('h3'): document.getElementById('warning_label');
        warning.id = 'warning_label';
        warning.style.textAlign = 'center';
        warning.style = 'grid-column: 1 / span 2;  grid-row: 11;';
        warning.fontWeight = 'bold';
        if (document.getElementById('warning_label') === null) {
            document.getElementById('content').appendChild(warning);
        }

        var values = {};
        var inputs = document.getElementsByClassName('em_input');
        var isEmptyField = false;

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === '') {
                isEmptyField = true;
            }
            values[inputs[i].id] = inputs[i].value;
        }
        values[document.getElementById('active_checkbox').id] = document.getElementById('active_checkbox').checked;
        if (!isEmptyField) {
            ipcRenderer.send('update-enter-user',values,document.getElementById('id_val').innerHTML);
        }
        else {
            warning.style= 'color: #860A35;';
            warning.innerHTML = '¡Hay campos vacíos!';
        }
    });

    document.getElementById ('clean').addEventListener('click', () => {
        clean_values();
    });

    ipcRenderer.send('get-emType');

    document.getElementById('search_em').addEventListener('click', () => {
        ipcRenderer.send('list-em');
    });
};

ipcRenderer.on('update-enter-user-result',(event,isNumber,isValidType) => {
    var warning = document.getElementById('warning_label');

    if (!isNumber || !isValidType) {
        warning.innerHTML = '';
        warning.style= 'color: #860A35;';
        if (!isNumber) {
            warning.innerHTML = '¡Número de teléfono inválido!';
        }
        if (!isValidType) {
            warning.innerHTML = warning.innerHTML + ' El tipo de empleado ingresado no existe';
        }
    }
    else {
        warning.style= 'color: #508D69;';
        clean_values();
        warning.innerHTML = '¡Listo!';
    }
});

ipcRenderer.on ('fill-em-info',(event,em_info,role_list) => {
    document.getElementById('id_val').innerHTML = em_info['id_empleado'];
    document.getElementById('name_val').value = em_info['nombre'];
    document.getElementById('uname_val').value = em_info['n_usuario'];
    document.getElementById('pwd_val').value = em_info['contrasena'];
    document.getElementById('addr_val').value = em_info['domicilio'];
    document.getElementById('date_val').value = em_info['fecha_creacion'].slice(0,10);
    document.getElementById('tel_val').value = em_info['telefono'];
    document.getElementById('em_type_input').value = getRol(em_info['id_tipo_empleado'],role_list).toUpperCase();
    document.getElementById('active_checkbox').checked = em_info['activo'];
});

ipcRenderer.on ('set-emType', (event,data_list) => {
    var html_list = document.createElement('datalist');
    html_list.id = 'em_type_list';
    data_list.forEach(element => {
        const opt = document.createElement('option');
        opt.value = element['rol'].toUpperCase();
        html_list.appendChild(opt);
    });

    document.getElementById('e_info').appendChild(html_list);
});

document.getElementById('logout').addEventListener('click',() => {
    ipcRenderer.send('exit');
});
//End Empleado
//Cliente
document.getElementById('regCliente').addEventListener('click',() => {
    ipcRenderer.send('get-cliente');
});

ipcRenderer.on('set-cliente',async (event,html) => {
    document.getElementById('content').innerHTML = await html;
    init_client();
});

ipcRenderer.on ('update-enter-client-result', (event,isValidNumber,current_date) => {
    let client_warning = document.getElementById('client_warning');
    clean_client (document.getElementsByClassName('client_input')
                     ,document.getElementById('client_id_val'),current_date);
    if (isValidNumber) {
        client_warning.innerHTML = '¡Listo!';
        client_warning.style.color = '#508D69';
    }
    else {
        client_warning.innerHTML = '¡Numero de teléfono inválido!';
        client_warning.style.color = '#860A35';
    }
});

const init_client = () => {
    let current_date;
    ipcRenderer.send ('get-date');

    ipcRenderer.on ('set-date',(event,date) => {
        current_date = date;
        document.getElementById('client_cdate_val').value = date;
        document.getElementById('client_cdate_val').disabled = true;
        document.getElementById('client_udate_val').value = date;
        document.getElementById('client_udate_val').disabled = true;
    });

    document.getElementById('client_clean').addEventListener('click',() => {
        let inputs = document.getElementsByClassName('client_input');
        clean_client (inputs,document.getElementById('client_id_val'),current_date);
    });

    document.getElementById('client_save').addEventListener('click',() => {
        var client_warning = document.getElementById('client_warning');
        var isEmptyField = false;
        let values = {};
        var inputs = document.getElementsByClassName ('client_input');

        if (client_warning === null) {
            client_warning = document.createElement('p');
            client_warning.id = 'client_warning';
            client_warning.style.fontWeight = 'bold';
            document.getElementById ('content').appendChild(client_warning);
        }

        for (let i = 0;i < inputs.length;i ++) {
            if (inputs[i].value == '') {
                isEmptyField = true;
            }
            values[inputs[i].id] = inputs[i].value;
        }
        if (isEmptyField) {
            client_warning.style.color = '#860A35';
            client_warning.innerHTML = '¡Hay campos vacíos!';
        }
        else {
            ipcRenderer.send('update-enter-client',values,document.getElementById('client_id_val').innerHTML);
        }
    });

    document.getElementById('search_client').addEventListener('click',() => {
        ipcRenderer.send('list-client');
    });
}

ipcRenderer.on('fill_client_info',(event,client) => {
    document.getElementById ('client_id_val').innerHTML = client['id_cliente'];
    document.getElementById('client_name_val').value = client['nombre'];
    document.getElementById('client_phone_val').value = client['telefono'];
    document.getElementById('client_addr_val').value = client['domicilio'];
    let cdate = document.getElementById('client_cdate_val');
    cdate.disabled = false;
    cdate.value = client['fecha_creacion'].slice(0,10);
    cdate.disabled = true;
    let udate = document.getElementById('client_udate_val')
    udate.disabled = false;
    udate.value = client['ultima_actualizacion'].slice(0,10);
    udate.disabled = true;
});

//End cliente
//Mascota
document.getElementById('regMascota').addEventListener('click', () => {
    ipcRenderer.send('get-mascota');
});

ipcRenderer.on('set-mascota',async (event,html) => {
    document.getElementById('content').innerHTML = await html;
    init_pet();
});

const init_pet = () => {

}
//End Mascota
//Venta
document.getElementById('venta').addEventListener('click',() => {
    ipcRenderer.send('get-venta');
});

ipcRenderer.on ('set-venta',async (event,html) => {
    document.getElementById('content').innerHTML = await html;
    init_venta();
});

const init_venta = () => {

};
//End venta
//Compra

document.getElementById('compra').addEventListener('click',() => {
    ipcRenderer.send('get-compra');
});

ipcRenderer.on('set-compra',async (event,html,current_date) => {
    document.getElementById('content').innerHTML = await html;
    init_compra (current_date);
});

const clean_compra = () => {
    let values = document.getElementsByClassName('compra_input_product');
    document.getElementById('id_producto_val').innerHTML = '';
    document.getElementById('nombre_producto_val').disabled = false;

    for (let i = 0;i < values.length;i ++) {
        values[i].value = '';
    }
}

const init_compra = (current_date) => {
    let product_info = [];

    document.getElementById('compra_date_val').value = current_date;
    document.getElementById('compra_date_val').disabled = true;

    document.getElementById('add_product_button_compra').addEventListener('click',() => {
        let product_val = {};
        let total = 0;

        let warning_compra = document.getElementById('warning_compra');
        if (warning_compra == null) {
            warning_compra = document.createElement('p');
            warning_compra.id = 'warning_compra';
            warning_compra.style.fontWeight = 'bold';
            document.getElementById('content').appendChild(warning_compra);
        }

        let values = document.getElementsByClassName('compra_input_product');
        let isEmptyField = false;

        for (let i = 0;i < values.length;i ++) {
            if (values[i].value === '') {
                isEmptyField = true;
            }
        }

        if (!isEmptyField) {
            let id = document.getElementById('id_producto_val').innerHTML;

            product_val[`id_${i_button}`] = id === '' ? 'Nueva entrada' : id;
            product_val[`name_${i_button}`] = document.getElementById('nombre_producto_val').value
            product_val[`min_stock_${i_button}`] = document.getElementById('mstock_producto_val').value
            product_val[`sell_price_${i_button}`] = document.getElementById('precio_unitario_val').value
            product_val[`cost_${i_button}`] = document.getElementById('coste_producto_val').value
            product_val[`qty_${i_button}`] = document.getElementById('cantidad_producto_val').value

            product_info.push(product_val);

            if (document.getElementById('empty_list_compra')) {
                document.getElementById('empty_list_compra').remove();
            }

            let id_element = document.createElement('p');
            id_element.id = `id_${i_button}`
            id_element.className = 'thelement_compra tcid';
            id_element.style = 'grid-column: 1;'
            id_element.innerHTML = id === '' ? 'Nueva entrada' : id;

            let name_element = document.createElement('p');
            name_element.id = `name_${i_button}`
            name_element.className = 'thelement_compra tcname';
            name_element.style = 'grid-column: 2;';
            name_element.innerHTML = document.getElementById('nombre_producto_val').value;

            let qty_element = document.createElement('p');
            qty_element.id = `qty_${i_button}`
            qty_element.className = 'thelement_compra table_quantity_compra';
            qty_element.style = 'grid-column: 3;';
            qty_element.innerHTML = document.getElementById('cantidad_producto_val').value;

            let cost_element = document.createElement('p');
            cost_element.id = `cost_${i_button}`
            cost_element.className = 'thelement_compra tcost';
            cost_element.style = 'grid-column: 4;';
            cost_element.innerHTML = document.getElementById('coste_producto_val').value;

            let unit_price_element = document.createElement('p');
            unit_price_element.id = `unit_price_${i_button}`
            unit_price_element.className = 'thelement_compra tcunit';
            unit_price_element.style = 'grid-column: 5;';
            unit_price_element.innerHTML = document.getElementById('precio_unitario_val').value;

            let delete_product_button = document.createElement('button');
            delete_product_button.id = `btn ${i_button}`;
            delete_product_button.className = 'thelement_button';
            delete_product_button.style = 'grid-column: 6;';
            delete_product_button.innerHTML = 'Eliminar';

            let total = document.getElementById('total_compra_val');

            total.disabled = false;
            total.value = `${parseFloat(total.value) + (parseFloat(qty_element.innerHTML)*parseFloat(cost_element.innerHTML))}`;
            total.disabled = true;

            delete_product_button.addEventListener ('click', function() {

                let identifier = parseInt(this.id.slice(-1));
                let qty = document.getElementById(`qty_${identifier}`);
                let cost = document.getElementById(`cost_${identifier}`);

                total.disabled = false;
                total.value = `${parseFloat(total.value) - (parseFloat(qty.innerHTML)*parseFloat(cost.innerHTML))}`;
                total.disabled = true;

                product_info = product_info.filter(e => !(`id_${identifier}` in e));

                document.getElementById(`id_${identifier}`).remove();
                document.getElementById(`name_${identifier}`).remove();
                qty.remove();
                cost.remove();
                document.getElementById(`unit_price_${identifier}`).remove();
                console.log(document.getElementsByClassName('tcid'));

                if (document.getElementsByClassName('tcid').length == 0) {
                    let for_empty_list = document.createElement('h2');
                    for_empty_list.innerHTML = 'Lista vacía';
                    for_empty_list.id = 'empty_list_compra';
                    for_empty_list.style = 'grid-row: 2 / span 6; grid-column: 1 / span 6; text-align: center; color: white;';
                    document.getElementById('table_compra').appendChild(for_empty_list);
                }

                this.remove();
            });


            document.getElementById('table_compra').append(id_element,name_element,
                                                           qty_element,cost_element,
                                                           unit_price_element,delete_product_button);

            warning_compra.innerHTML = 'Producto Agregado';
            warning_compra.style.color = '#508D69'
            i_button ++;

            clean_compra();
        }
        else {
            warning_compra.innerHTML = '¡Hay campos vacíos!';
            warning_compra.style.color = '#860A35'
        }
    });

    document.getElementById ('clean_compra').addEventListener('click',async () => {
        i_button = 1;
        let delete_buttons = document.getElementsByClassName('thelement_button');
        let click_event = new Event('click');

        while (delete_buttons.length > 0) {
            delete_buttons[0].dispatchEvent(click_event);
        }

        let warning_compra = document.getElementById('warning_compra');

        if (warning_compra) {
            warning_compra.innerHTML = '';
        }
        document.getElementById('supplier_val').value = '';
        clean_compra();
    });

    document.getElementById('save_compra').addEventListener ('click',() => {
        let isEmptyTable = document.getElementsByClassName('thelement_compra').length == 0;
        let isSupplierEmpty = document.getElementById('supplier_val').value === '';

        let warning_compra = document.getElementById('warning_compra');
        if (warning_compra == null) {
            warning_compra = document.createElement('p');
            warning_compra.id = 'warning_compra';
            warning_compra.style.fontWeight = 'bold';
            document.getElementById('content').appendChild(warning_compra);
        }
        warning_compra.innerHTML = '';
        if (isEmptyTable) {
            warning_compra.style.color = '#860A35';
            warning_compra.innerHTML = 'Lista Vacía. Agrega productos.';
        }
        if (isSupplierEmpty) {
            warning_compra.style.color = '#860A35';
            warning_compra.innerHTML = warning_compra.innerHTML + ' Falta ingresar proveedor';
        }
        if (!isEmptyTable && !isSupplierEmpty) {
            ipcRenderer.send ('register-compra',product_info,document.getElementById('supplier_val').value,current_user);
            document.getElementById('clean_compra').dispatchEvent(new Event('click'));
            warning_compra.style.color = '#508D69';
            warning_compra.innerHTML = '¡Listo!';
        }

    });

    document.getElementById('search_producto').addEventListener('click',() => {
        ipcRenderer.send('list-product','compra');
    });

    ipcRenderer.on ('select-clicked-product-result',(event,product_info,last_cost) => {
        document.getElementById('id_producto_val').innerHTML = product_info['id_producto'];
        document.getElementById('nombre_producto_val').value = product_info['nombre'];
        document.getElementById('nombre_producto_val').disabled = true;
        document.getElementById('coste_producto_val').value = parseFloat(last_cost.slice(1,-1));
        document.getElementById('precio_unitario_val').value = parseFloat(product_info['precio_unitario'].slice(1,-1));
        document.getElementById('mstock_producto_val').value = parseInt(product_info['stock_minimo']);
    });
};
//End compra