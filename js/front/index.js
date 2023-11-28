const {ipcRenderer} = require('electron');
require('../js/front/venta.js');
require('../js/front/empleado.js')

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
        break;
        case 3:
            document.getElementById('compra').remove();
            document.getElementById('regCliente').remove();
            document.getElementById('regMascota').remove();
            document.getElementById('regEmpleado').remove();
            document.getElementById('venta').remove();
        break;
        case 4:
        break;
        default:
            throw Error('Rol does not exist!');
        }
});

ipcRenderer.on('set-venta', (event,html) => {
    document.getElementById('content').innerHTML = html;
});

ipcRenderer.on('set-empleado',(event,html) => {
    document.getElementById('content').innerHTML = html;
});