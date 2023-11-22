CREATE USER vet_admin WITH PASSWORD 'v3t_4dm1n';

CREATE DATABASE vet_db OWNER vet_admin;

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,

    nombre VARCHAR (32),
    telefono INT NOT NULL,
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

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,

    nombre VARCHAR (32) NOT NULL,
    n_usuario VARCHAR (32) UNIQUE NOT NULL,
    contrasena VARCHAR (32) NOT NULL,
    domicilio VARCHAR (32) NOT NULL,
    fecha_creacion DATE NOT NULL,
    telefono INT NOT NULL
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

CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,

    nombre VARCHAR (32),
    precio_unitario MONEY NOT NULL,
    unidades INT NOT NULL,
    stock_minimo INT NOT NULL,
    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE NOT NULL,
    activo BOOLEAN NOT NULL
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