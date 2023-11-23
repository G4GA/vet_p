//Maybe an import goes here, need to understand NodeJs and electron first tho
const {ipcRenderer} = require('electron');
//HTML elements

var button = document.getElementById('logInB');

button.addEventListener('click', () => {
    const username = document.getElementById ('textName').value;
    const password = document.getElementById ('textPwd').value;
    ipcRenderer.send('login-click',{username,password});
});

ipcRenderer.on('login-repply', (event,result) => {
    if (result == false) {
        document.getElementById('result').innerHTML = 'Nombre de usuario o contraseña incorrectos.\nVuelve a intentar';
    }
});