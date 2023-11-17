--Primero copien y peguen esto antes
CREATE USER vet_admin WITH PASSWORD 'v3t_4admin';

CREATE DATABASE veterinaria_db OWNER vet_admin;
--Corran el comando para conectarse a la base de datos
--Para conectarse a la base de datos es con \c vet_admin
--Después copien y peguen esto
CREATE TABLE cliente (
    id_cliente SERIAL NOT NULL,
    telefono INT NOT NULL,
    nombre VARCHAR (32) NOT NULL,
    direccion VARCHAR (64) NOT NULL,
    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE,
    PRIMARY KEY (id_cliente)
);

CREATE TABLE mascota (
    id_mascota SERIAL NOT NULL,
    id_cliente INT NOT NULL,
    nombre VARCHAR(32) NOT NULL,
    raza VARCHAR(16) NOT NULL,
    peso INT NOT NULL,
    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE,
    PRIMARY KEY (id_mascota),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE empleado (
    id_empleado SERIAL NOT NULL,
    nombre VARCHAR(32) NOT NULL,
    domiclio VARCHAR(64) NOT NULL,
    telefono INT NOT NULL,
    fecha_creadcion DATE NOT NULL,
    PRIMARY KEY (id_empleado)
);

CREATE TABLE cita (
    id_cita SERIAL NOT NULL,
    id_empleado INT NOT NULL,
    id_mascota INT NOT NULL,
    fecha DATE NOT NULL,
    fecha_creacion DATE NOT NULL,
    ultima_actualizacion DATE NOT NULL,
    razon_consulta VARCHAR(64) NOT NULL,
    PRIMARY KEY (id_cita),
    FOREIGN KEY (id_empleado) REFERENCES empleado (id_empleado),
    FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota)
);