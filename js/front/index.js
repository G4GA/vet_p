const {ipcRenderer} = require('electron');

var current_user;

const showUser = (user) => {
    var userName = document.createElement('p');
    userName.id = 'user_name';
    userName.style.fontWeight = 'bold';
    userName.className = 'u_name';
    userName.innerHTML = user['nombre'];
    document.getElementById('u_log').appendChild(userName);
}

document.getElementById('venta').addEventListener('click', () => {
    ipcRenderer.send('get-venta');
});

document.getElementById('regEmpleado').addEventListener('click', () => {
    ipcRenderer.send('get-empleado');
})

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

ipcRenderer.on('set-empleado',async (evecleant,html) => {
    document.getElementById('content').innerHTML = await html;
    init_em();
});
//Empleado
const init_em = () => {
    document.getElementById('em_save').addEventListener('click', () => {
        var warning = document.createElement('h3');
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
            ipcRenderer.send('update-enter-user',values);
        }
        else {
            warning.style= 'color: #860A35; grid-row: 11; grid-column: 1 / span 2;';
            warning.innerHTML = '¡Hay campos vacíos!';
        }
    });

    document.getElementById ('clean').addEventListener('click', () => {

    });

    ipcRenderer.send('get-emType');
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
        warning.innerHTML = '¡Empleado Registrado!';
        var inputs = document.getElementsByClassName('em_input');
        for (let i = 0;i < inputs.length;i ++) {
            inputs[i].value = '';
        }
    }
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
//End Empleado