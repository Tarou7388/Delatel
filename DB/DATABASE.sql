CREATE DATABASE Delatel;

USE Delatel;

CREATE TABLE tb_tipo_soporte(
    id_tipo_soporte 	INT AUTO_INCREMENT PRIMARY KEY,
    tipo_soporte 		VARCHAR(50) NOT NULL,
    create_at 			DATETIME DEFAULT NOW(),
    update_at 			DATETIME NULL,
    inactive_at 		DATETIME NULL,
    CONSTRAINT tiposopor_uk_tipo_soporte UNIQUE(tipo_soporte)
) ENGINE = InnoDB;

CREATE TABLE tb_departamentos (
    id_departamento INT PRIMARY KEY AUTO_INCREMENT,
    departamento    VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE tb_provincias (
    id_provincia    INT PRIMARY KEY AUTO_INCREMENT,
    provincia       VARCHAR(50) NOT NULL,
    id_departamento INT NOT NULL,
    CONSTRAINT provi_fk_id_departamento FOREIGN KEY (id_departamento) REFERENCES tb_departamentos (id_departamento)
) ENGINE=InnoDB;

CREATE TABLE tb_distritos (
    id_distrito     INT PRIMARY KEY AUTO_INCREMENT,
    distrito        VARCHAR(50) NOT NULL,
    id_provincia    INT NOT NULL,
    CONSTRAINT distr_fk_id_provincia FOREIGN KEY (id_provincia) REFERENCES tb_provincias (id_provincia)
) ENGINE=InnoDB;

CREATE TABLE tb_roles (
    id_rol 		INT AUTO_INCREMENT PRIMARY KEY,
    rol 		VARCHAR(30) NOT NULL,
    permisos    JSON NOT NULL,
    create_at 	DATETIME DEFAULT NOW(),
    update_at 	DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT roles_uk_rol UNIQUE(rol)
) ENGINE = InnoDB;

CREATE TABLE tb_servicios (
    id_servicio 	INT PRIMARY KEY AUTO_INCREMENT,
    servicio 		VARCHAR(50) NOT NULL,
    create_at 		DATETIME DEFAULT NOW(),
    update_at 		DATETIME NULL,
    inactive_at 	DATETIME NULL,
    CONSTRAINT servi_uk_servicio UNIQUE (servicio)
) ENGINE = InnoDB;

CREATE TABLE tb_sectores (
    id_sector 		INT PRIMARY KEY AUTO_INCREMENT,
    id_distrito 	INT NOT NULL,
    sector 			VARCHAR(60) NOT NULL,
    create_at 		DATETIME DEFAULT NOW(),
    update_at 		DATETIME NULL,
    inactive_at 	DATETIME NULL,
    CONSTRAINT secto_uk_sector UNIQUE (sector),
    CONSTRAINT secto_fk_id_distrito FOREIGN KEY (id_distrito) REFERENCES tb_distritos (id_distrito)
) ENGINE = InnoDB;

CREATE TABLE tb_personas (
    id_persona       INT PRIMARY KEY AUTO_INCREMENT,
    tipo_doc         CHAR(3) NOT NULL,
    nro_doc          VARCHAR(15) NOT NULL,
    apellidos        VARCHAR(30) NOT NULL,
    nombres          VARCHAR(30) NOT NULL,
    telefono         CHAR(9) NOT NULL,
    email            VARCHAR(100) NULL,
    create_at        DATETIME NOT NULL DEFAULT NOW(),
    update_at        DATETIME NULL,
    inactive_at      DATETIME NULL,
    CONSTRAINT perso_uk_nro_doc UNIQUE (nro_doc, tipo_doc),
    CONSTRAINT perso_ck_tipo_doc CHECK (tipo_doc IN ('DNI', 'PAS', 'CAR'))
) ENGINE = InnoDB;

CREATE TABLE tb_empresas (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    ruc VARCHAR(11) NULL,
    representante_legal VARCHAR(70) NULL,
    razon_social VARCHAR(100) NOT NULL,
    nombre_comercial VARCHAR(100) NULL,
    telefono CHAR(9) NOT NULL,
    email VARCHAR(100) NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT empre_uk_ruc UNIQUE (ruc),
    CONSTRAINT empre_uk_telefono UNIQUE (telefono)
) ENGINE = InnoDB;

CREATE TABLE tb_usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NOT NULL,
    nombre_user VARCHAR(100),
    pass CHAR(60),
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT usuar_fk_id_persona FOREIGN KEY (id_persona) REFERENCES tb_personas (id_persona),
    CONSTRAINT usuar_uk_nombre_user UNIQUE (nombre_user)
) ENGINE = InnoDB;

CREATE TABLE tb_responsables(
    id_responsable   INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario       INT NOT NULL,
    id_rol           INT NOT NULL,
    fecha_inicio     DATETIME NOT NULL DEFAULT NOW(),
    fecha_fin        DATETIME NULL,
    CONSTRAINT respo_fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES tb_usuarios (id_usuario),
    CONSTRAINT respo_fk_id_rol FOREIGN KEY (id_rol) REFERENCES tb_roles (id_rol)
) ENGINE = InnoDB;

CREATE TABLE tb_tarifarios (
    id_tarifario INT PRIMARY KEY AUTO_INCREMENT,
    id_servicio INT NOT NULL,
    id_usuario INT NOT NULL,
    precio DECIMAL(7, 2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    CONSTRAINT tarif_fk_id_servicio FOREIGN KEY (id_servicio) REFERENCES tb_servicios (id_servicio),
    CONSTRAINT tarif_fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES tb_responsables (id_responsable),
    CONSTRAINT tarif_ck_precio CHECK (precio > 0)
) ENGINE = InnoDB;

CREATE TABLE tb_clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NULL,
    id_empresa INT NULL,
    direccion VARCHAR(250) NOT NULL,
    referencia VARCHAR(150) NOT NULL,
    estado BIT NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT clien_fk_id_persona FOREIGN KEY (id_persona) REFERENCES tb_personas (id_persona),
    CONSTRAINT clien_fk_id_empresa FOREIGN KEY (id_empresa) REFERENCES tb_empresas (id_empresa)
) ENGINE = InnoDB;

CREATE TABLE tb_contratos (
    id_contrato INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_tarifario INT NOT NULL,
    id_sector INT NOT NULL,
    id_usuario_registro INT NOT NULL,
    id_usuario_tecnico INT NULL,
    direccion_servicio VARCHAR(200) NOT NULL,
    referencia VARCHAR (200),
    coordenada VARCHAR (25),
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    fecha_registro DATE NOT NULL,
    ficha_instalacion JSON NOT NULL,
    pagos JSON NOT NULL,
    nota TEXT NULL,
    estado BIT NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT contr_fk_id_cliente FOREIGN KEY (id_cliente) REFERENCES tb_clientes (id_cliente),
    CONSTRAINT contr_fk_id_tarifario FOREIGN KEY (id_tarifario) REFERENCES tb_tarifarios (id_tarifario),
    CONSTRAINT contr_fk_id_sector FOREIGN KEY (id_sector) REFERENCES tb_sectores (id_sector),
    CONSTRAINT contr_fk_id_usuario_registro FOREIGN KEY (id_usuario_registro) REFERENCES tb_responsables (id_responsable),
    CONSTRAINT contr_fk_id_usuario_tecnico FOREIGN KEY (id_usuario_tecnico) REFERENCES tb_responsables (id_responsable)
) ENGINE = InnoDB;

CREATE TABLE tb_contactabilidad (
    id_contactabilidad INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT NOT NULL,
    id_tarifario INT NOT NULL,
    fecha_hora_contacto DATETIME NOT NULL,
    direccion_servicio VARCHAR(250) NOT NULL,
    dias_vigencia INT NOT NULL,
    nota TEXT NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    CONSTRAINT conta_fk_id_persona FOREIGN KEY (id_persona) REFERENCES tb_personas (id_persona),
    CONSTRAINT conta_fk_id_tarifario FOREIGN KEY (id_tarifario) REFERENCES tb_tarifarios (id_tarifario)
) ENGINE = InnoDB;

CREATE TABLE tb_soporte (
    id_soporte INT PRIMARY KEY AUTO_INCREMENT,
    id_contrato INT NOT NULL,
    id_tipo_soporte INT NOT NULL,
    id_tecnico INT NOT NULL,
    fecha_hora_solicitud DATETIME NOT NULL,
    fecha_hora_asistencia DATETIME NOT NULL,
    descripcion_problema TEXT NOT NULL,
    descripcion_solucion TEXT NOT NULL,
    prioridad VARCHAR(50) NOT NULL,
    pagos JSON NOT NULL,
    soporte JSON NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT sopor_fk_id_contrato FOREIGN KEY (id_contrato) REFERENCES tb_contratos (id_contrato),
    CONSTRAINT sopor_fk_id_tipo_soporte FOREIGN KEY (id_tipo_soporte) REFERENCES tb_tipo_soporte (id_tipo_soporte),
    CONSTRAINT sopor_fk_id_tecnico FOREIGN KEY (id_tecnico) REFERENCES tb_responsables (id_responsable)
) ENGINE = InnoDB;


CREATE TABLE tb_productos(
    id_producto      INT PRIMARY KEY AUTO_INCREMENT,
    marca           VARCHAR(30) NOT NULL,
    tipo_producto    VARCHAR(60) NOT NULL,
    modelo           VARCHAR(30) NOT NULL,
    precio_actual	DECIMAL(7,2) NOT NULL,
    codigo_barra    VARCHAR(120) NOT NULL,
	create_at 		DATETIME NOT NULL DEFAULT NOW(),
    update_at 		DATETIME NULL,
    inactive_at 	DATETIME NULL,
    CONSTRAINT produ_uk_codigo_barra UNIQUE(codigo_barra),
    CONSTRAINT produc_uk_tp_md_mc UNIQUE (marca,tipo_producto,modelo)
)ENGINE=INNODB;

CREATE TABLE tb_kardex (
	id_kardex 		INT PRIMARY KEY AUTO_INCREMENT,
    id_producto     INT NOT NULL,
    fecha			DATE NOT NULL,
    tipo_operacion	VARCHAR(20) NOT NULL,
    motivo			VARCHAR(30) NOT NULL,
    cantidad		INT NOT NULL,
    saldo_total		INT NOT NULL,
    valor_unico_historico	DECIMAL(7,2) NOT NULL,
	create_at 		DATETIME NOT NULL DEFAULT NOW(),
    update_at 		DATETIME NULL,
    inactive_at 	DATETIME NULL,
    CONSTRAINT kard_fk_id_producto FOREIGN KEY (id_producto) REFERENCES tb_productos (id_producto)
)ENGINE=INNODB;
