const {ipcRenderer} = require('electron');

var doc_body = document.body;

ipcRenderer.send('set-rol');

ipcRenderer.on ('get-rol',(event,rol) => {
    console.log(rol);
    switch (rol) {
        case 1:
            doc_body.style.backgroundColor = 'red';
        break;
        case 2:
            doc_body.style.backgroundColor = 'blue';
        break;
        case 3:
            doc_body.style.backgroundColor = 'red';
        break;
        case 4:
            doc_body.style.backgroundColor = 'red';
    }
});