const {ipcRenderer} = require('electron');
const getRol = require('../js/front/util.js');

var current_user;

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

        if (!isEmptyField) {
            ipcRenderer.send('update-enter-user',values,document.getElementById('id_val').innerHTML);
        }
        else {
            console.log('a');
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

const init_client = () => {

}
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