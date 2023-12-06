const { ipcRenderer } = require("electron");

ipcRenderer.send ('client-get-list');

ipcRenderer.on('client-set-list',(event,list) => {
    let button_list = [];
    for (let i = 0;i < list.length;i ++){
        let client_id_element = document.createElement('p');
        client_id_element.className = 'telement tcid';
        client_id_element.style = 'grid-column: 1;';
        client_id_element.innerHTML = list[i]['id_cliente'];

        let client_name_element = document.createElement('p');
        client_name_element.className = 'telement tcname';
        client_name_element.style = 'grid-column: 2;';
        client_name_element.innerHTML = list[i]['nombre'];

        let client_phone_element = document.createElement('p');
        client_phone_element.className = 'telement tcphone';
        client_phone_element.style = 'grid-column: 3;';
        client_phone_element.innerHTML = list[i]['telefono'];

        let select_button_element = document.createElement('button');
        select_button_element.style = 'grid-column: 4;';
        select_button_element.innerHTML = 'Seleccionar';
        select_button_element.id = `${list[i]['id_cliente']}`;
        button_list.push(select_button_element);

        document.getElementById('client_l_table').append(client_id_element,client_name_element,client_phone_element,select_button_element);
    }

    for (let i = 0;i < button_list.length; i ++) {
        button_list[i].addEventListener('click', () => {
            ipcRenderer.send('select-clicked-client',button_list[i].id);
        });
    }

});