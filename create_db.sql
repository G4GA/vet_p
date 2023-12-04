CREATE USER vet_admin WITH PASSWORD 'v3t_4dm1n';

CREATE DATABASE vet_db OWNER vet_admin;

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,

    nombre VARCHAR (32),
    telefono VARCHAR (13) NOT NULL,
    domicilio VARCHAR (64),

    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE
);

CREATE TABLE mascota (
    id_mascota SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,

    nombre VARCHAR (32) NOT NULL,
    raza VARCHAR (16) NOT NULL,
    peso INT NOT NULL,

    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE,

    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE tipo_empleado (
    id_tipo_empleado SERIAL PRIMARY KEY,

    rol VARCHAR (32) NOT NULL
);

INSERT INTO tipo_empleado VALUES (DEFAULT,'cajero');
INSERT INTO tipo_empleado VALUES (DEFAULT,'administrador');
INSERT INTO tipo_empleado VALUES (DEFAULT,'medico');
INSERT INTO tipo_empleado VALUES (DEFAULT,'gerente');
INSERT INTO tipo_empleado VALUES (DEFAULT,'suspendido');

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    id_tipo_empleado INT NOT NULL,

    nombre VARCHAR (32) NOT NULL,
    n_usuario VARCHAR (32) UNIQUE NOT NULL,
    contrasena VARCHAR (32) NOT NULL,
    domicilio VARCHAR (32) NOT NULL,
    fecha_creacion DATE NOT NULL,
    telefono VARCHAR(10) NOT NULL,

    FOREIGN KEY (id_tipo_empleado) REFERENCES tipo_empleado(id_tipo_empleado)
);

CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    id_empleado INT NOT NULL,
    id_mascota INT NOT NULL,

    razon_consulta VARCHAR (64),
    fecha_cita DATE NOT NULL,
    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE,

    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado),
    FOREIGN KEY (id_mascota) REFERENCES mascota (id_mascota)
);

CREATE TABLE servicio_catalogo (
    id_servicio_catalogo SERIAL PRIMARY KEY,

    descripcion VARCHAR (64),
    precio MONEY NOT NULL
);

CREATE TABLE servicio (
    id_servicio SERIAL PRIMARY KEY,
    id_cita INT NOT NULL,
    id_servicio_catalogo INT NOT NULL,

    FOREIGN KEY (id_cita) REFERENCES cita(id_cita),
    FOREIGN KEY (id_servicio_catalogo) REFERENCES servicio_catalogo(id_servicio_catalogo)
);

CREATE TABLE compra (
    id_compra SERIAL PRIMARY KEY,
    id_empleado INT NOT NULL,
    provedor VARCHAR(32),

    fecha DATE NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,

    nombre VARCHAR (32),
    precio_unitario MONEY NOT NULL,
    provedor VARCHAR(32) NOT NULL,
    unidades INT NOT NULL,
    stock_minimo INT NOT NULL,
    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE NOT NULL,
    activo BOOLEAN NOT NULL
);

CREATE TABLE detalle_compra (
    id_detalle_compra SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,
    id_compra INT NOT NULL,

    precio_compra MONEY NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra)
);

CREATE TABLE IVA (
    id_iva SERIAL PRIMARY KEY,

    fecha DATE NOT NULL,
    porcentaje FLOAT NOT NULL
);

CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    id_empleado INT NOT NULL,

    fecha_creacion DATE NOT NULL,

    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
);

CREATE TABLE detalle_venta (
    id_detalle_venta SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    id_iva INT NOT NULL,
    id_producto INT NOT NULL,

    unidades INT NOT NULL,

    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_iva) REFERENCES IVA(id_iva),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE receta (
    id_receta SERIAL PRIMARY KEY,

    prescripcion VARCHAR (64) NOT NULL,
    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE
);

CREATE TABLE medicamento (
    id_medicamento SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,

    formula VARCHAR (16) NOT NULL,

    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE receta_medicamento (
    id_receta_medicamento SERIAL PRIMARY KEY,
    id_receta INT NOT NULL,
    id_medicamento INT NOT NULL,

    FOREIGN KEY (id_receta) REFERENCES receta(id_receta),
    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento)
);

GRANT ALL ON cliente TO vet_admin;
GRANT ALL ON mascota TO vet_admin;
GRANT ALL ON tipo_empleado TO vet_admin;
GRANT ALL ON empleado TO vet_admin;
GRANT ALL ON cita TO vet_admin;
GRANT ALL ON servicio_catalogo TO vet_admin;
GRANT ALL ON servicio TO vet_admin;
GRANT ALL ON producto TO vet_admin;
GRANT ALL ON IVA TO vet_admin;
GRANT ALL ON venta TO vet_admin;
GRANT ALL ON detalle_venta TO vet_admin;
GRANT ALL ON receta TO vet_admin;
GRANT ALL ON medicamento TO vet_admin;
GRANT ALL ON receta_medicamento TO vet_admin;

GRANT USAGE, SELECT ON SEQUENCE empleado_id_empleado_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE cliente_id_cliente_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE mascota_id_mascota_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE tipo_empleado_id_tipo_empleado_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE receta_medicamento_id_receta_medicamento_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE medicamento_id_medicamento_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE receta_id_receta_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE detalle_venta_id_detalle_venta_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE venta_id_venta_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE IVA_id_IVA_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE producto_id_producto_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE servicio_id_servicio_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE servicio_catalogo_id_servicio_catalogo_seq TO vet_admin;
GRANT USAGE, SELECT ON SEQUENCE cita_id_cita_seq TO vet_admin;

INSERT INTO empleado VALUES (DEFAULT,2,'Damian Guevara','admin','4dm1n','Calle Jerecito 763',CURRENT_DATE,'3337870279');