-- SQLBook: Code
CREATE DATABASE Delatel;

USE Delatel;

CREATE TABLE tb_departamentos (
    id_departamento INT PRIMARY KEY NOT NULL,
    departamento VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tb_provincias (
    id_provincia INT PRIMARY KEY NOT NULL,
    provincia VARCHAR(45) NOT NULL,
    id_departamento INT NOT NULL,
    CONSTRAINT provi_fk_id_departamento FOREIGN KEY (id_departamento) REFERENCES tb_departamentos(id_departamento)
) ENGINE=InnoDB;

CREATE TABLE tb_distritos (
    id_distrito INT PRIMARY KEY NOT NULL,
    distrito VARCHAR(45) DEFAULT NULL,
    id_provincia INT DEFAULT NULL,
    id_departamento INT DEFAULT NULL,
    limites JSON NULL,
    CONSTRAINT distr_fk_id_provincia FOREIGN KEY (id_provincia) REFERENCES tb_provincias(id_provincia),
    CONSTRAINT distr_fk_id_departamento FOREIGN KEY (id_departamento) REFERENCES tb_departamentos(id_departamento)
) ENGINE=InnoDB;



CREATE TABLE tb_roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(30) NOT NULL,
    permisos JSON NOT NULL,
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT roles_uk_rol UNIQUE (rol)
) ENGINE = InnoDB;

CREATE TABLE tb_servicios (
	id_servicio INT PRIMARY KEY AUTO_INCREMENT, 
    tipo_servicio CHAR(4) NOT NULL,
    servicio VARCHAR(200) NOT NULL, 
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT servi_uk_servicio UNIQUE (servicio, tipo_servicio)
) ENGINE = InnoDB;

CREATE TABLE tb_sectores (
    id_sector INT PRIMARY KEY AUTO_INCREMENT,
    id_distrito INT NOT NULL,
    sector VARCHAR(60) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NULL,
    coordenadas VARCHAR(50) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT secto_uk_sector UNIQUE (sector),
    CONSTRAINT secto_fk_id_distrito FOREIGN KEY (id_distrito) REFERENCES tb_distritos (id_distrito)
) ENGINE = InnoDB;

CREATE TABLE tb_mufas(
    id_mufa INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    coordenadas VARCHAR(50) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT mufa_uk_mufa UNIQUE (nombre)
) ENGINE = InnoDB;

CREATE TABLE tb_cajas(
    id_caja INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    numero_entradas TINYINT NOT NULL,
    id_sector INT NOT NULL,
    coordenadas VARCHAR(50) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT caja_fk_id_sector FOREIGN KEY (id_sector) REFERENCES tb_sectores (id_sector)
) ENGINE = InnoDB;

CREATE TABLE tb_lineas (
    id_linea INT PRIMARY KEY AUTO_INCREMENT,
    id_mufa INT NULL,
    id_caja INT NULL,
    coordenadas JSON NOT NULL,
    tipo_linea CHAR(1) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT lineas_fk_id_mufa FOREIGN KEY (id_mufa) REFERENCES tb_mufas (id_mufa),
    CONSTRAINT lineas_fk_id_caja FOREIGN KEY (id_caja) REFERENCES tb_cajas (id_caja)
) ENGINE = InnoDB;

CREATE TABLE tb_personas (
    id_persona INT PRIMARY KEY AUTO_INCREMENT,
    tipo_doc CHAR(3) NOT NULL,
    nro_doc VARCHAR(15) NOT NULL,
    apellidos VARCHAR(30) NOT NULL,
    nombres VARCHAR(30) NOT NULL,
    telefono CHAR(9) NOT NULL,
	nacionalidad VARCHAR(40) NOT NULL,
    email VARCHAR(100) NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT perso_uk_nro_doc UNIQUE (nro_doc, tipo_doc),
    CONSTRAINT perso_ck_tipo_doc CHECK (
        tipo_doc IN ('DNI', 'PAS', 'CAR')
    )
) ENGINE = InnoDB;

CREATE TABLE tb_empresas (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    ruc VARCHAR(11) NOT NULL,
    representante_legal VARCHAR(70) NOT NULL,
    razon_social VARCHAR(100) NOT NULL,
    nombre_comercial VARCHAR(100) NOT NULL,
    telefono CHAR(9) NOT NULL,
    email VARCHAR(100) NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT empre_uk_ruc UNIQUE (ruc)
) ENGINE = InnoDB;

CREATE TABLE tb_usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NOT NULL,
    nombre_user VARCHAR(100),
    pass CHAR(60),
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT usuar_fk_id_persona FOREIGN KEY (id_persona) REFERENCES tb_personas (id_persona),
    CONSTRAINT usuar_uk_nombre_user UNIQUE (nombre_user),
    CONSTRAINT usuar_uk_id_persona UNIQUE (id_persona)
) ENGINE = InnoDB;

CREATE TABLE tb_responsables (
    id_responsable INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    fecha_inicio DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    fecha_fin DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT respo_fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES tb_usuarios (id_usuario),
    CONSTRAINT respo_fk_id_rol FOREIGN KEY (id_rol) REFERENCES tb_roles (id_rol)
) ENGINE = InnoDB;

CREATE TABLE tb_paquetes (
	id_paquete      INT PRIMARY KEY AUTO_INCREMENT,
    id_servicio     JSON NOT NULL,
    paquete         VARCHAR(250) NOT NULL,
    precio          DECIMAL(7,2) NOT NULL,
    velocidad       JSON NULL, 
    create_at       DATETIME NOT NULL DEFAULT NOW(),
    update_at       DATETIME NULL,
    inactive_at     DATETIME NULL,
    iduser_create   INT NOT NULL,
    iduser_update   INT NULL, 
    iduser_inactive INT NULL
) ENGINE = InnoDB;


CREATE TABLE tb_clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NULL,
    id_empresa INT NULL,
    direccion VARCHAR(250) NOT NULL,
    referencia VARCHAR(150) NOT NULL,
    coordenadas VARCHAR(50) NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT clien_fk_id_persona FOREIGN KEY (id_persona) REFERENCES tb_personas (id_persona),
    CONSTRAINT clien_fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES tb_empresas (id_empresa)
) ENGINE = InnoDB;

CREATE TABLE tb_contratos (
    id_contrato INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_paquete INT NOT NULL,
    id_sector INT NOT NULL,
    id_usuario_registro INT NOT NULL,
    id_usuario_tecnico INT NULL,
    direccion_servicio VARCHAR(200) NOT NULL,
    referencia VARCHAR(200),
    ficha_instalacion JSON NULL,
    coordenada VARCHAR(50),
    fecha_inicio DATE NULL,
    fecha_registro DATE NOT NULL,
    fecha_fin DATE NULL,
    nota TEXT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT contr_fk_id_cliente FOREIGN KEY (id_cliente) REFERENCES tb_clientes (id_cliente),
    CONSTRAINT contr_fk_id_tarifario FOREIGN KEY (id_paquete) REFERENCES tb_paquetes (id_paquete),
    CONSTRAINT contr_fk_id_sector FOREIGN KEY (id_sector) REFERENCES tb_sectores (id_sector),
    CONSTRAINT contr_fk_id_usuario_registro FOREIGN KEY (id_usuario_registro) REFERENCES tb_responsables (id_responsable),
    CONSTRAINT contr_fk_id_usuario_tecnico FOREIGN KEY (id_usuario_tecnico) REFERENCES tb_responsables (id_responsable)
) ENGINE = InnoDB;

CREATE TABLE tb_contactabilidad (
    id_contactabilidad INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NULL,
    id_empresa INT NULL,
    id_paquete INT NOT NULL,
    fecha_hora_contacto DATETIME NOT NULL DEFAULT NOW(),
    direccion_servicio VARCHAR(250) NOT NULL,
    nota TEXT NOT NULL,
    fecha_limite DATETIME NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT contac_fk_id_persona FOREIGN KEY (id_persona) REFERENCES tb_personas (id_persona),
    CONSTRAINT contac_fk_id_tarifario FOREIGN KEY (id_paquete) REFERENCES tb_paquetes (id_paquete),
    CONSTRAINT contac_fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES tb_empresas (id_empresa)
) ENGINE = InnoDB;

CREATE TABLE tb_soporte (
    id_soporte INT PRIMARY KEY AUTO_INCREMENT,
    id_contrato INT NOT NULL,
    id_tecnico INT NULL,
    fecha_hora_solicitud DATETIME NOT NULL,
    fecha_hora_asistencia DATETIME NULL,
    descripcion_problema TEXT NOT NULL,
    descripcion_solucion TEXT NULL,
    estaCompleto BOOLEAN NOT NULL DEFAULT FALSE,
    prioridad VARCHAR(50) NULL DEFAULT "Incidencia",
    soporte JSON NULL DEFAULT '{}',
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT sopor_fk_id_contrato FOREIGN KEY (id_contrato) REFERENCES tb_contratos (id_contrato),
    CONSTRAINT sopor_fk_id_tecnico FOREIGN KEY (id_tecnico) REFERENCES tb_responsables (id_responsable)
) ENGINE = InnoDB;

CREATE TABLE tb_almacen (
	id_almacen       INT PRIMARY KEY AUTO_INCREMENT,
	nombre_almacen   VARCHAR(65) NOT NULL,
	ubicacion        VARCHAR(120) NOT NULL,
	coordenada       VARCHAR(50) NOT NULL,
	inactive_at      DATETIME NULL,
	iduser_inactive  INT NULL,
	create_at        DATETIME NOT NULL DEFAULT NOW(),
	update_at        DATETIME NULL,
	iduser_create    INT NOT NULL,
	iduser_update    INT NULL,
    CONSTRAINT uk_almacen UNIQUE(nombre_almacen)
) ENGINE = INNODB;

CREATE TABLE tb_marca (
	id_marca         INT PRIMARY KEY AUTO_INCREMENT,
	marca     		 VARCHAR(30) NOT NULL,
	inactive_at      DATETIME NULL,
	iduser_inactive  INT NULL,
	create_at        DATETIME NOT NULL DEFAULT NOW(),
	update_at        DATETIME NULL,
	iduser_create    INT NOT NULL,
	iduser_update    INT NULL,
    CONSTRAINT uk_marca UNIQUE(marca)
) ENGINE = INNODB;

CREATE TABLE tb_tipoproducto (
	id_tipo          INT PRIMARY KEY AUTO_INCREMENT,
	tipo_nombre      VARCHAR(250) NOT NULL,
	create_at        DATETIME NOT NULL DEFAULT NOW(),
	update_at        DATETIME NULL,
	inactive_at      DATETIME NULL,
	iduser_inactive  INT NULL,
	iduser_create    INT NOT NULL,
	iduser_update    INT NULL,
    CONSTRAINT uk_tipopro UNIQUE(tipo_nombre)
) ENGINE = INNODB;

CREATE TABLE tb_unidadmedida (
	id_unidad        INT PRIMARY KEY AUTO_INCREMENT,
	unidad_nombre    VARCHAR(30) NOT NULL,
	create_at        DATETIME NOT NULL DEFAULT NOW(),
	update_at        DATETIME NULL,
	iduser_create    INT NOT NULL,
	iduser_update    INT NULL,
    CONSTRAINT uk_unidad UNIQUE(unidad_nombre)
) ENGINE = INNODB;

CREATE TABLE tb_productos (
	id_producto      INT PRIMARY KEY AUTO_INCREMENT,
	id_marca         INT NOT NULL,
	id_tipo          INT NOT NULL,
	id_unidad        INT NOT NULL,
	modelo           VARCHAR(70) NOT NULL,
	precio_actual    DECIMAL(7, 2) NOT NULL,
	codigo_barra     VARCHAR(120) NOT NULL,
    categoria        CHAR(4) NULL,
	create_at        DATETIME NOT NULL DEFAULT NOW(),
	update_at        DATETIME NULL,
	inactive_at      DATETIME NULL,
	iduser_create    INT NOT NULL,
	iduser_update    INT NULL,
	iduser_inactive  INT NULL,
	CONSTRAINT fk_marca FOREIGN KEY (id_marca) REFERENCES tb_marca(id_marca),
	CONSTRAINT fk_tipo_producto FOREIGN KEY (id_tipo) REFERENCES tb_tipoproducto(id_tipo),
	CONSTRAINT fk_unidad_medida FOREIGN KEY (id_unidad) REFERENCES tb_unidadmedida(id_unidad),
	CONSTRAINT producto_uk_modelo UNIQUE (id_marca, id_tipo, modelo),
    CONSTRAINT producto_uk_codigo UNIQUE (codigo_barra)
) ENGINE = INNODB;

CREATE TABLE tb_tipooperacion (
	id_tipooperacion INT PRIMARY KEY AUTO_INCREMENT,
	descripcion       VARCHAR(55) NOT NULL,
	movimiento        CHAR(1) NOT NULL,
	CONSTRAINT tipoop UNIQUE(descripcion)
) ENGINE = INNODB;

CREATE TABLE tb_kardex (
	id_kardex            INT PRIMARY KEY AUTO_INCREMENT,
	id_producto          INT NOT NULL,
	id_almacen           INT NOT NULL,
	id_tipooperacion     INT NOT NULL,
	fecha                DATE NOT NULL,
	cantidad             INT NOT NULL,
	saldo_total          INT NOT NULL,
	valor_unico_historico DECIMAL(7, 2) NOT NULL,
	create_at            DATETIME NOT NULL DEFAULT NOW(),
	update_at            DATETIME NULL,
	inactive_at          DATETIME NULL,
	iduser_create        INT NOT NULL,
	iduser_update        INT NULL,
	iduser_inactive      INT NULL,
	CONSTRAINT fk_id_producto FOREIGN KEY (id_producto) REFERENCES tb_productos(id_producto),
	CONSTRAINT fk_id_almacen FOREIGN KEY (id_almacen) REFERENCES tb_almacen(id_almacen),
	CONSTRAINT fk_id_tipooperacion FOREIGN KEY (id_tipooperacion) REFERENCES tb_tipooperacion(id_tipooperacion)
) ENGINE = INNODB;

CREATE TABLE tb_base (
    id_base         INT PRIMARY KEY AUTO_INCREMENT,
    nombre_base     VARCHAR(50) NOT NULL,
    create_at       DATETIME NOT NULL DEFAULT NOW(),
    update_at       DATETIME NULL,
    inactive_at     DATETIME NULL,
    iduser_create   INT NOT NULL,
    iduser_update   INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT uk_base UNIQUE (nombre_base)
) ENGINE = INNODB;

CREATE TABLE tb_subbase (
    id_sub_base     INT PRIMARY KEY AUTO_INCREMENT,
    id_base         INT NOT NULL,
    nombre_sub_base VARCHAR(50) NOT NULL,
    create_at       DATETIME NOT NULL DEFAULT NOW(),
    update_at       DATETIME NULL,
    inactive_at     DATETIME NULL,
    iduser_create   INT NOT NULL,
    iduser_update   INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT fk_id_base FOREIGN KEY (id_base) REFERENCES tb_base (id_base)
) ENGINE = INNODB;

CREATE TABLE tb_antenas(
    id_antena   INT PRIMARY KEY AUTO_INCREMENT,
    id_distrito   INT NOT NULL,
    nombre      VARCHAR(60) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    coordenadas VARCHAR(50) NOT NULL,
    direccion   VARCHAR(200) NOT NULL,
    create_at   DATETIME NOT NULL DEFAULT NOW(),
    update_at   DATETIME NULL,
    inactive_at DATETIME NULL,
    iduser_create INT NOT NULL,
    iduser_update INT NULL,
    iduser_inactive INT NULL,
    CONSTRAINT anten_uk_antena UNIQUE (nombre),
    CONSTRAINT fk_sector_antena FOREIGN KEY (id_distrito) REFERENCES tb_distritos (id_distrito)
) ENGINE = InnoDB;