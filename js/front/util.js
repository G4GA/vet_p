const getRol = (id,rol_list) => {
    console.log(rol_list.length);

    for (var i = 0;i < rol_list.length; i++) {
        console.log(i);
        if (id == rol_list[i]['id_tipo_empleado']) {
            return rol_list[i]['rol'];
        }
    }
    return null;
}

module.exports = getRol;