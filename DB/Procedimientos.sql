USE Delatel;

DELIMITER $$

CREATE PROCEDURE spu_productos_agregar(
    IN p_marca VARCHAR(30),
    IN p_tipo_producto VARCHAR(60),
    IN p_modelo VARCHAR(30),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_codigo_barra VARCHAR(120),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_productos (marca, tipo_producto, modelo, precio_actual, codigo_barra, create_at,iduser_create)
    VALUES (p_marca, p_tipo_producto, p_modelo, p_precio_actual, p_codigo_barra, NOW(),p_iduser_create);
END $$

CREATE PROCEDURE spu_kardex_registrar(
    IN p_id_producto INT,
    IN p_fecha DATE,
    IN p_tipo_operacion VARCHAR(20),
    IN p_motivo VARCHAR(90),
    IN p_cantidad INT,
    IN p_valor_unitario_historico DECIMAL(7,2),
    IN p_iduser_create INT
)
BEGIN
    DECLARE p_saldo_kardex_actual INT DEFAULT 0;
    
    SELECT saldo_total
    INTO p_saldo_kardex_actual
    FROM tb_kardex
    WHERE id_producto = p_id_producto
    ORDER BY fecha DESC
    LIMIT 1;

    IF p_saldo_kardex_actual IS NULL THEN
        SET p_saldo_kardex_actual = 0;
    END IF;

    IF p_tipo_operacion = 'SALIDA' THEN
        IF p_saldo_kardex_actual < p_cantidad THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficiente saldo para la salida.';
        END IF;
    END IF;

    IF p_tipo_operacion = 'ENTRADA' THEN
        SET p_saldo_kardex_actual = p_saldo_kardex_actual + p_cantidad;
    ELSEIF p_tipo_operacion = 'SALIDA' THEN
        SET p_saldo_kardex_actual = p_saldo_kardex_actual - p_cantidad;
    END IF;

    INSERT INTO tb_kardex (
        id_producto,
        fecha,
        tipo_operacion,
        motivo,
        cantidad,
        saldo_total,
        valor_unico_historico,
        create_at,
        iduser_create
    )
    VALUES (
        p_id_producto,
        p_fecha,
        p_tipo_operacion,
        p_motivo,
        p_cantidad,
        p_saldo_kardex_actual,
        p_valor_unitario_historico,
        NOW(),
        p_iduser_create
    );
END $$

CREATE PROCEDURE spu_kardex_filtrar(
	IN p_idproducto INT
)
BEGIN
	SELECT * FROM vw_kardex WHERE id_producto = p_idproducto ORDER BY id_producto DESC;
END $$

CREATE PROCEDURE spu_login_usuarios(
    p_nombre_user VARCHAR(100)
)
BEGIN
    SELECT 
        u.nombre_user,
        u.id_usuario,
        r.id_responsable as id_usuario,
        u.pass,
        r.id_rol
        
    FROM 
        tb_usuarios u
    JOIN 
        tb_responsables r ON u.id_usuario = r.id_usuario
    WHERE nombre_user = p_nombre_user and inactive_at IS NULL;
END $$ 

CREATE PROCEDURE spu_clientes_registrar(
    p_id_persona        INT,
    p_id_empresa        INT,
    p_direccion         VARCHAR(50),
    p_referencia        VARCHAR(150),
    p_estado            BIT,
	p_iduser_create INT
)
BEGIN
    IF p_id_empresa = '' THEN
        SET p_id_empresa = NULL;
    END IF;
    INSERT INTO tb_clientes(id_persona, id_empresa, direccion, referencia, estado,iduser_create) 
    VALUES (p_id_persona, p_id_empresa, p_direccion, p_referencia, p_estado,p_iduser_create);
END $$

CREATE PROCEDURE spu_usuarios_registrar(
    p_id_persona        INT,
    p_nombre_user       VARCHAR(100),
    p_pass              VARCHAR(60),
	p_iduser_create INT
)
BEGIN
    INSERT tb_usuarios(id_persona, nombre_user, pass,iduser_create) 
        VALUES
            (p_id_persona, p_nombre_user, p_pass,p_iduser_create);
    SELECT LAST_INSERT_ID() AS id_usuario;
END $$

CREATE PROCEDURE spu_listar_permisos_id(
    p_id_rol INT
)
BEGIN
    SELECT rol, permisos FROM tb_roles
    WHERE id_rol = p_id_rol;
END$$

CREATE PROCEDURE spu_actualizar_permisos_id(
    p_id_rol    INT,
    p_permisos  JSON,
    p_iduser_update INT
)
BEGIN
    UPDATE tb_roles
        SET
            permisos = p_permisos,
            iduser_update = p_iduser_update,
            update_at = NOW()
        WHERE id_rol = p_id_rol;
END$$

CREATE PROCEDURE spu_listar_permisos(
    p_id_rol INT
)
BEGIN
    SELECT 
        permisos
    FROM tb_roles r
    WHERE 
        r.id_rol = p_id_rol;
END $$

CREATE PROCEDURE spu_registrar_fichasoporte(
    IN p_id_contrato INT,
    IN p_id_tipo_soporte INT,
    IN p_id_tecnico INT,
    IN p_fecha_hora_solicitud DATETIME,
    IN p_fecha_hora_asistencia DATETIME,
    IN p_descripcion_problema TEXT,
    IN p_descripcion_solucion TEXT,
    IN p_prioridad VARCHAR(50),
    IN p_pagos JSON,
    IN p_soporte JSON,
	IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_soporte (
        id_contrato,
        id_tipo_soporte,
        id_tecnico,
        fecha_hora_solicitud,
        fecha_hora_asistencia,
        descripcion_problema,
        descripcion_solucion,
        prioridad,
        pagos,
        soporte,
        create_at,
        iduser_create
    )
    VALUES (
        p_id_contrato,
        p_id_tipo_soporte,
        p_id_tecnico,
        p_fecha_hora_solicitud,
        p_fecha_hora_asistencia,
        p_descripcion_problema,
        p_descripcion_solucion,
        p_prioridad,
        p_pagos,
        p_soporte,
        NOW(),
        p_iduser_create
    );
END $$

CREATE PROCEDURE spu_productos_actualizar(
  IN p_id_producto INT,
  IN p_marca VARCHAR(30),
  IN p_tipo_producto VARCHAR(60),
  IN p_modelo VARCHAR(30),
  IN p_precio_actual DECIMAL(7,2),
  IN p_codigo_barra VARCHAR(120),
  IN p_iduser_update INT
)
BEGIN
  UPDATE tb_productos 
  SET 
    marca = p_marca,
    tipo_producto = p_tipo_producto,
    modelo = p_modelo,
    iduser_update = p_iduser_update,
    precio_actual = p_precio_actual,
    codigo_barra = p_codigo_barra,
    update_at = NOW()
  WHERE id_producto = p_id_producto;
END $$

CREATE PROCEDURE spu_tipo_soporte_registrar(
    p_tipo_soporte   VARCHAR(50),
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_tipo_soporte (tipo_soporte, iduser_create)
    VALUES (p_tipo_soporte, p_iduser_create);
END $$

CREATE PROCEDURE spu_servicios_registrar(
    p_servicio       VARCHAR(50),
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_servicios (servicio, iduser_create)
    VALUES (p_servicio, p_iduser_create);
END $$

CREATE PROCEDURE spu_paquetes_registrar(
    p_id_servicio     INT,
    p_precio          DECIMAL(7,2),
    p_fecha_inicio    DATE,
    p_fecha_fin       DATE,
    p_iduser_create   INT
)
BEGIN
    INSERT INTO tb_paquetes (id_servicio, precio, fecha_inicio, fecha_fin, iduser_create)
    VALUES (p_id_servicio, p_precio, p_fecha_inicio, p_fecha_fin, p_iduser_create);
END $$

CREATE PROCEDURE spu_sectores_registrar(
    p_id_distrito    INT,
    p_sector         VARCHAR(60),
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_sectores (id_distrito, sector, iduser_create)
    VALUES (p_id_distrito, p_sector, p_iduser_create);
END $$

CREATE PROCEDURE spu_roles_registrar(
    p_rol            VARCHAR(30),
    p_permisos       JSON,
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_roles (rol, permisos, iduser_create)
    VALUES (p_rol, p_permisos, p_iduser_create);
END $$

CREATE PROCEDURE spu_personas_registrar(
    p_tipo_doc          CHAR(3),
    p_nro_doc           VARCHAR(15),
    p_apellidos         VARCHAR(30),
    p_nombres           VARCHAR(30),
    p_telefono 		    CHAR(9),
    p_email             VARCHAR(100),
    p_iduser_create		INT
    )
BEGIN
    INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, email,iduser_create) 
    VALUES (p_tipo_doc, p_nro_doc, p_apellidos, p_nombres, p_telefono, p_email,p_iduser_create);

    SELECT LAST_INSERT_ID() AS id_persona;
END $$

CREATE PROCEDURE spu_empresas_registrar(
    p_ruc                VARCHAR(11),
    p_representante_legal VARCHAR(70),
    p_razon_social        VARCHAR(100),
    p_nombre_comercial    VARCHAR(100),
    p_telefono            CHAR(9),
    p_email               VARCHAR(100),
    p_iduser_create       INT
)
BEGIN
    INSERT INTO tb_empresas (ruc, representante_legal, razon_social, nombre_comercial, telefono, email, iduser_create) 
    VALUES (p_ruc, p_representante_legal, p_razon_social, p_nombre_comercial, p_telefono, p_email, p_iduser_create);
    
    SELECT LAST_INSERT_ID() AS id_empresa;
END $$

CREATE PROCEDURE spu_registrar_roles(
    p_rol VARCHAR(30),
    p_permisos JSON,
	p_iduser_create INT
)
BEGIN
    INSERT INTO tb_roles (rol, permisos,iduser_create) VALUES (p_rol, p_permisos,p_iduser_create);
END $$

CREATE VIEW vw_kardex AS
SELECT
    k.id_kardex,
    p.id_producto,
    p.modelo,
    p.tipo_producto,
    p.marca,
    p.precio_actual,
    k.fecha,
    k.tipo_operacion,
    k.motivo,
    k.cantidad,
    k.saldo_total,
    k.valor_unico_historico,
    k.create_at AS fecha_creacion
FROM
    tb_productos p
JOIN
    tb_kardex k ON p.id_producto = k.id_producto
ORDER BY 
    k.create_at DESC;
    
CREATE VIEW vw_usuarios AS
SELECT
    pe.apellidos,
    pe.nombres,
    us.nombre_user,
    ro.rol as "Cargo",
    us.create_at,
    us.inactive_at
FROM
    tb_responsables res
INNER JOIN
    tb_usuarios us ON res.id_usuario = us.id_usuario
INNER JOIN
    tb_personas pe ON us.id_persona = pe.id_persona
INNER JOIN
    tb_roles ro ON res.id_rol = ro.id_rol;

CREATE VIEW vw_personas_listar AS
SELECT
    p.id_persona,
    p.tipo_doc,
    p.nro_doc,
    p.apellidos,
    p.nombres,
    p.telefono,
    p.email,
    p.create_at,
    p.update_at,
    p.inactive_at,
    
    p.iduser_create,
    u1.nombre_user AS usuario_creador,
    
    p.iduser_update,
    u2.nombre_user AS usuario_modificador,
    
    p.iduser_inactive,
    u3.nombre_user AS usuario_inactivador

FROM
    tb_personas p
LEFT JOIN
    tb_usuarios u1 ON p.iduser_create = u1.id_usuario
LEFT JOIN
    tb_usuarios u2 ON p.iduser_update = u2.id_usuario
LEFT JOIN
    tb_usuarios u3 ON p.iduser_inactive = u3.id_usuario;
    
    
CREATE VIEW vw_empresas_listar AS
SELECT
    e.id_empresa,
    e.ruc,
    e.representante_legal,
    e.razon_social,
    e.nombre_comercial,
    e.telefono,
    e.email,
    e.create_at,
    e.update_at,
    e.inactive_at,
    e.iduser_create,
    u1.nombre_user AS usuario_creador,
    e.iduser_update,
    u2.nombre_user AS usuario_modificador,
    e.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_empresas e
LEFT JOIN
    tb_usuarios u1 ON e.iduser_create = u1.id_usuario
LEFT JOIN
    tb_usuarios u2 ON e.iduser_update = u2.id_usuario
LEFT JOIN
    tb_usuarios u3 ON e.iduser_inactive = u3.id_usuario;


CREATE VIEW vw_tipo_soporte_listar AS
SELECT
    t.id_tipo_soporte,
    t.tipo_soporte,
    t.create_at,
    t.update_at,
    t.inactive_at,
    t.iduser_create,
    u1.nombre_user AS usuario_creador,
    t.iduser_update,
    u2.nombre_user AS usuario_modificador,
    t.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_tipo_soporte t
LEFT JOIN
    tb_usuarios u1 ON t.iduser_create = u1.id_usuario
LEFT JOIN
    tb_usuarios u2 ON t.iduser_update = u2.id_usuario
LEFT JOIN
    tb_usuarios u3 ON t.iduser_inactive = u3.id_usuario;


CREATE VIEW vw_servicios_listar AS
SELECT
    s.id_servicio,
    s.servicio,
    s.create_at,
    s.update_at,
    s.inactive_at,
    s.iduser_create,
    u1.nombre_user AS usuario_creador,
    s.iduser_update,
    u2.nombre_user AS usuario_modificador,
    s.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_servicios s
LEFT JOIN
    tb_usuarios u1 ON s.iduser_create = u1.id_usuario
LEFT JOIN
    tb_usuarios u2 ON s.iduser_update = u2.id_usuario
LEFT JOIN
    tb_usuarios u3 ON s.iduser_inactive = u3.id_usuario;


CREATE VIEW vw_paquetes_listar AS
SELECT
    p.id_paquete,
    p.id_servicio,
    s.servicio AS nombre_servicio,
    p.precio,
    p.fecha_inicio,
    p.fecha_fin,
    p.create_at,
    p.update_at,
    p.inactive_at,
    p.iduser_create,
    u1.nombre_user AS usuario_creador,
    p.iduser_update,
    u2.nombre_user AS usuario_modificador,
    p.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_paquetes p
LEFT JOIN
    tb_servicios s ON p.id_servicio = s.id_servicio
LEFT JOIN
    tb_usuarios u1 ON p.iduser_create = u1.id_usuario
LEFT JOIN
    tb_usuarios u2 ON p.iduser_update = u2.id_usuario
LEFT JOIN
    tb_usuarios u3 ON p.iduser_inactive = u3.id_usuario;


CREATE VIEW vw_roles_listar AS
SELECT
    r.id_rol,
    r.rol,
    r.permisos,
    r.create_at,
    r.update_at,
    r.inactive_at,
    r.iduser_create,
    u1.nombre_user AS usuario_creador,
    r.iduser_update,
    u2.nombre_user AS usuario_modificador,
    r.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_roles r
LEFT JOIN
    tb_usuarios u1 ON r.iduser_create = u1.id_usuario
LEFT JOIN
    tb_usuarios u2 ON r.iduser_update = u2.id_usuario
LEFT JOIN
    tb_usuarios u3 ON r.iduser_inactive = u3.id_usuario;

CREATE VIEW vw_sectores_listar AS
SELECT
    s.id_sector,
    s.sector,
    s.id_distrito,
    d.distrito AS nombre_distrito,
    s.create_at,
    s.update_at,
    s.inactive_at,
    s.iduser_create,
    u1.nombre_user AS usuario_creador,
    s.iduser_update,
    u2.nombre_user AS usuario_modificador,
    s.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_sectores s
LEFT JOIN
    tb_distritos d ON s.id_distrito = d.id_distrito
LEFT JOIN
    tb_usuarios u1 ON s.iduser_create = u1.id_usuario
LEFT JOIN
    tb_usuarios u2 ON s.iduser_update = u2.id_usuario
LEFT JOIN
    tb_usuarios u3 ON s.iduser_inactive = u3.id_usuario;
