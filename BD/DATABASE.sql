CREATE DATABASE Delatel;

USE Delatel;

create table tb_tiposoporte (
    idTiposoporte INT AUTO_INCREMENT PRIMARY KEY,
    tipoSoporte VARCHAR(50) NOT NULL,
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL
) engine = innodb;

CREATE TABLE tb_departamentos(
    idDepartamento  INT PRIMARY KEY AUTO_INCREMENT,
    departamento    VARCHAR(50) NOT NULL
)ENGINE=INNODB;

CREATE TABLE tb_provincias(
    idProvincia     INT PRIMARY KEY AUTO_INCREMENT,
    provincia       VARCHAR(50) NOT NULL,
    idDepartamento  INT NOT NULL,
    CONSTRAINT provi_fk_idDepartamento FOREIGN KEY (idDepartamento) REFERENCES tb_departamentos (idDepartamento)
)ENGINE=INNODB;

CREATE TABLE tb_distritos(
    idDistrito      INT PRIMARY KEY AUTO_INCREMENT,
    distrito        VARCHAR(50) NOT NULL,
    idProvincia      INT NOT NULL,
    CONSTRAINT distr_fk_idProvincia FOREIGN KEY (idProvincia) REFERENCES tb_provincias (idProvincia)
)ENGINE=INNODB;

CREATE TABLE tb_roles (
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(30) NOT NULL,
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL
) engine = innodb;

CREATE TABLE tb_especificaciones (
    idEspecificacion INT AUTO_INCREMENT PRIMARY KEY,
    especificacion TEXT NOT NULL,
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL
) engine = innodb;

CREATE TABLE tb_servicios (
    idServicio INT PRIMARY KEY AUTO_INCREMENT,
    idEmpresa INT NOT NULL,
    servicio VARCHAR(50) NOT NULL,
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT servi_uk_servicio UNIQUE (servicio)
) ENGINE = INNODB;

CREATE TABLE tb_sectores (
    idSector INT PRIMARY KEY AUTO_INCREMENT,
    idDistrito INT NOT NULL,
    sector VARCHAR(60) NOT NULL,
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT secto_uk_sector UNIQUE (sector),
    CONSTRAINT secto_fk_idDistrito FOREIGN KEY (idDistrito) REFERENCES tb_distritos (idDistrito)
) ENGINE = INNODB;

CREATE TABLE tb_permisos (
    idPermiso INT PRIMARY KEY AUTO_INCREMENT,
    idRol INT NOT NULL,
    modulo VARCHAR(30) NOT NULL,
    permiso BIT NOT NULL DEFAULT 0,
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT permi_fk_idRol FOREIGN KEY (idRol) REFERENCES tb_roles (idRol)
) ENGINE = INNODB;

CREATE TABLE tb_personas (
    idPersona INT PRIMARY KEY AUTO_INCREMENT,
    tipoDoc CHAR(3) NOT NULL,
    nroDoc VARCHAR(15) NOT NULL,
    apellidos VARCHAR(30) NOT NULL,
    nombres VARCHAR(30) NOT NULL,
    telefono CHAR(9) NOT NULL,
    email VARCHAR(100) NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT perso_uk_nroDoc UNIQUE (nroDoc),
    CONSTRAINT perso_uk_telefono UNIQUE (telefono)
) ENGINE = INNODB;

CREATE TABLE tb_empresas(
    idempresa       INT PRIMARY KEY AUTO_INCREMENT,
    ruc             VARCHAR(11) NULL,
    representanteLegal VARCHAR(70) NULL,
    razonSocial     VARCHAR(100) NOT NULL,
    nombreComercial VARCHAR(100) NULL,
    telefono        CHAR(9) NOT NULL,
    email           VARCHAR(100) NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT empre_uk_ruc UNIQUE (ruc),
    CONSTRAINT empre_uk_telefono UNIQUE (telefono)
)ENGINE=INNODB;

CREATE TABLE tb_usuarios (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    idPersona INT NOT NULL,
    nombreUser VARCHAR(100),
    pass CHAR(60),
    create_at DATETIME DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT usuar_fk_idPersona FOREIGN KEY (idPersona) REFERENCES tb_personas (idPersona),
    CONSTRAINT usuar_uk_nombreUser UNIQUE (nombreUser)
) ENGINE = INNODB;

CREATE TABLE tb_responsables(
    idResponsable   INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario       INT NOT NULL,
    idRol           INT NOT NULL,
    fechaInicio     DATETIME NOT NULL,
    fechaFon        DATETIME NULL,
    CONSTRAINT respo_fk_idUsuario FOREIGN KEY (idUsuario) REFERENCES tb_usuarios (idUsuario),
    CONSTRAINT respo_fk_idRol FOREIGN KEY (idRol) REFERENCES tb_roles (idRol)
)ENGINE=INNODB;

CREATE TABLE tb_tarifarios (
    idTarifario INT PRIMARY KEY AUTO_INCREMENT,
    idServicio INT NOT NULL,
    idUsuario INT NOT NULL,
    precio DECIMAL(7, 2) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NULL,
    CONSTRAINT tarif_fk_idServicio FOREIGN KEY (idServicio) REFERENCES tb_servicios (idServicio),
    CONSTRAINT tarif_fk_idUsuario FOREIGN KEY (idUsuario) REFERENCES tb_responsables (idResponsable),
    CONSTRAINT tarif_ck_precio CHECK (precio > 0)
) ENGINE = INNODB;

CREATE TABLE tb_clientes (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    idPersona INT NULL,
    idEmpresa INT NULL,
    direccion VARCHAR(250) NOT NULL,
    referencia VARCHAR(150) NOT NULL,
    estado BIT NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT clien_fk_idPersona FOREIGN KEY (idPersona) REFERENCES tb_personas (idPersona),
    CONSTRAINT clien_fk_idEmpresa FOREIGN KEY (idEmpresa) REFERENCES tb_empresas (idEmpresa)
) ENGINE = INNODB;

CREATE TABLE tb_contratos (
    idContrato INT PRIMARY KEY AUTO_INCREMENT,
    idCliente INT NOT NULL,
    idTarifario INT NOT NULL,
    idSector INT NOT NULL,
    idUsuarioRegistro INT NOT NULL,
    idUsuarioTecnico INT NOT NULL,
    direccionServicio VARCHAR(200) NOT NULL,
    fechaInicio DATE NULL,
    fechaFin DATE NULL,
    fechaRegistro DATE NOT NULL,
    fichaInstalacion JSON NOT NULL,
    descuento DECIMAL(7,2) NULL,
    montopagado DECIMAL (7,2) NULL,
    nota TEXT NULL,
    estado BIT NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT contr_fk_idCliente FOREIGN KEY (idCliente) REFERENCES tb_clientes (idCliente),
    CONSTRAINT contr_fk_idTarifario FOREIGN KEY (idTarifario) REFERENCES tb_tarifarios (idTarifario),
    CONSTRAINT contr_fk_idSector FOREIGN KEY (idSector) REFERENCES tb_sectores (idSector),
    CONSTRAINT contr_fk_idUsuarioRegistro FOREIGN KEY (idUsuarioRegistro) REFERENCES tb_responsables (idResponsable),
    CONSTRAINT contr_fk_idUsuarioTecnico FOREIGN KEY (idUsuarioTecnico) REFERENCES tb_responsables (idResponsable)
) ENGINE = INNODB;

CREATE TABLE tb_parametros (
    idParametro INT PRIMARY KEY AUTO_INCREMENT,
    idContrato INT NOT NULL,
    idEspecificacion INT NOT NULL,
    valor JSON NOT NULL,
    CONSTRAINT param_fk_idContrato FOREIGN KEY (idContrato) REFERENCES tb_contratos (idContrato),
    CONSTRAINT param_fk_idEspecificacion FOREIGN KEY (idEspecificacion) REFERENCES tb_especificaciones (idEspecificacion)
) ENGINE = INNODB;

CREATE TABLE tb_contactabilidad (
    idContactabilidad INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    idPersona INT NOT NULL,
    idTarifario INT NOT NULL,
    fechaHoraContacto DATETIME NOT NULL,
    direccionServicio VARCHAR(250) NOT NULL,
    diasVigencia INT NOT NULL,
    nota TEXT NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    CONSTRAINT conta_fk_idUsuario FOREIGN KEY (idUsuario) REFERENCES tb_responsables (idResponsable),
    CONSTRAINT conta_fk_idPersona FOREIGN KEY (idPersona) REFERENCES tb_personas (idPersona),
    CONSTRAINT conta_fk_idTarifario FOREIGN KEY (idTarifario) REFERENCES tb_tarifarios (idTarifario)
) ENGINE = INNODB;

CREATE TABLE tb_soporte (
    idSoporte INT PRIMARY KEY AUTO_INCREMENT,
    idContrato INT NOT NULL,
    idTipoSoporte INT NOT NULL,
    idTecnico INT NOT NULL,
    fechaHoraSolicitud DATETIME NOT NULL,
    fechaHoraAsistencia DATETIME NOT NULL,
    descripcionProblema TEXT NOT NULL,
    descripcionSolucion TEXT NOT NULL,
    prioridad VARCHAR(50) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT sopor_fk_idContrato FOREIGN KEY (idContrato) REFERENCES tb_contratos (idContrato),
    CONSTRAINT sopor_fk_idTipoSoporte FOREIGN KEY (idTipoSoporte) REFERENCES tb_tiposoporte (idTipoSoporte),
    CONSTRAINT sopor_fk_idTecnico FOREIGN KEY (idTecnico) REFERENCES tb_responsables (idResponsable)
) ENGINE = INNODB;

CREATE TABLE tb_implementos (
    idImplemento INT PRIMARY KEY AUTO_INCREMENT,
    idSoporte INT NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(7, 2) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT NOW(),
    update_at DATETIME NULL,
    inactive_at DATETIME NULL,
    CONSTRAINT imple_fk_idSoporte FOREIGN KEY (idSoporte) REFERENCES tb_soporte (idSoporte)
) ENGINE = INNODB;