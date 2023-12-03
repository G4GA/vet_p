const { ipcRenderer } = require("electron");
const getRol = require('../js/front/util.js');


ipcRenderer.send ('get-list');

ipcRenderer.on('set-list', (event,list,role_list) => {
    let table = document.getElementById('l_table');
    let btn_array = [];
    for (let i = 0;i < list.length;i ++) {
        let id_element = document.createElement('p');
        id_element.innerHTML = list[i]['id_empleado'];
        id_element.className = 'telement tid';

        let rol_element = document.createElement('p');
        rol_element.innerHTML = getRol(list[i]['id_tipo_empleado'],role_list);
        rol_element.className = 'telement trole';

        let name_element = document.createElement('p');
        name_element.innerHTML = list[i]['nombre'];
        name_element.className = 'telement tname';

        let u_name_element = document.createElement('p');
        u_name_element.innerHTML = list[i]['n_usuario'];
        u_name_element.className = 'telement tu_name';

        let select_btn = document.createElement('button');
        select_btn.innerHTML = 'Seleccionar';
        select_btn.className = 'telement tbutton';
        btn_array.push(select_btn);
        select_btn.id = `${list[i]['id_empleado']}`;

        table.append(id_element,name_element,u_name_element,rol_element,select_btn);
    }
    for (let i = 0;i < btn_array.length;i ++) {
        btn_array[i].addEventListener('click',() => {
            ipcRenderer.send('select-clicked',btn_array[i].id);
        });
    }
});