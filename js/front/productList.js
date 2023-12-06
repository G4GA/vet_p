const { ipcRenderer } = require("electron");

let window_to_send_to;


ipcRenderer.on ('set-window',(event,window) => {
    window_to_send_to = window;
    ipcRenderer.send('product-get-list');
});

ipcRenderer.on ('product-set-list', (event,products) => {
    let button_list = [];

    for (const product of products) {
        let p_id_element = document.createElement('p');
        p_id_element.className = 'telement tpid';
        p_id_element.innerHTML = product['id_producto'];
        p_id_element.style = 'grid-column: 1;'

        let p_name_element = document.createElement('p');
        p_name_element.className = 'telement tpname';
        p_name_element.innerHTML = product['nombre'];
        p_name_element.style = 'grid-column: 2;';

        let p_uprice_element = document.createElement('p');
        p_uprice_element.className = 'telement tpuprice';
        p_uprice_element.innerHTML = product['precio_unitario'];
        p_uprice_element.style = 'grid-column: 3;';

        let p_unit_element = document.createElement('p');
        p_unit_element.className = 'telement tpunits';
        p_unit_element.innerHTML = product['unidades'];
        p_unit_element.style = 'grid-column: 4;';

        let delete_button_element = document.createElement('button');
        delete_button_element.innerHTML = 'Seleccionar';
        delete_button_element.className = 'telement tpbutton';
        delete_button_element.style = 'grid-column: 5;';
        delete_button_element.id = `${product['id_producto']}`;
        delete_button_element.addEventListener('click', function() {
            ipcRenderer.send('select-clicked-product',this.id);
        });

        document.getElementById('product_l_table').append(p_id_element,p_name_element,p_uprice_element,p_unit_element,delete_button_element);
    }
});