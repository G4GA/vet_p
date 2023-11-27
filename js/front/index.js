const {ipcRenderer} = require('electron');

ipcRenderer.send

ipcRenderer.send('set-rol');


ipcRenderer.on ('get-rol',(event,html) => {
    console.log(html);
    document.getElementById('content').innerHTML = html;
});