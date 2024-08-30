USE Delatel;

DELIMITER $$

CREATE PROCEDURE spu_productos_agregar(
    IN p_marca VARCHAR(30),
    IN p_tipo_producto VARCHAR(60),
    IN p_modelo VARCHAR(30),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_codigo_barra VARCHAR(120)
)
BEGIN
    INSERT INTO tb_productos (marca, tipo_producto, modelo, precio_actual, codigo_barra, create_at)
    VALUES (p_marca, p_tipo_producto, p_modelo, p_precio_actual, p_codigo_barra, NOW());
END $$

CREATE PROCEDURE spu_kardex_registrar(
    IN p_id_producto INT,
    IN p_fecha DATE,
    IN p_tipo_operacion VARCHAR(20),
    IN p_motivo VARCHAR(90),
    IN p_cantidad INT,
    IN p_valor_unitario_historico DECIMAL(7,2)
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
        create_at
    )
    VALUES (
        p_id_producto,
        p_fecha,
        p_tipo_operacion,
        p_motivo,
        p_cantidad,
        p_saldo_kardex_actual,
        p_valor_unitario_historico,
        NOW()
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
    WHERE nombre_user = p_nombre_user;
END $$ 

CREATE PROCEDURE spu_personas_registrar(
    p_tipo_doc          CHAR(3),
    p_nro_doc           VARCHAR(15),
    p_apellidos         VARCHAR(30),
    p_nombres           VARCHAR(30),
    p_telefono 		    CHAR(9),
    p_email             VARCHAR(100)
)
BEGIN
    INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, email) 
    VALUES (p_tipo_doc, p_nro_doc, p_apellidos, p_nombres, p_telefono, p_email);

    SELECT LAST_INSERT_ID() AS id_persona;
END $$

CREATE PROCEDURE spu_empresas_registrar(
    p_ruc CHAR(11),
    p_representante_legal VARCHAR(70),
    p_razon_social VARCHAR(100),
    p_nombre_comercial VARCHAR(100),
    p_telefono CHAR(9),
    p_email VARCHAR(100)
)
BEGIN
    INSERT INTO tb_empresas (ruc, representante_legal, razon_social, nombre_comercial, telefono, email, create_at)
    VALUES (p_ruc, p_representante_legal, p_razon_social, p_nombre_comercial, p_telefono, p_email, NOW());
END $$

CREATE PROCEDURE spu_clientes_registrar(
    p_id_persona        INT,
    p_id_empresa        INT,
    p_direccion         VARCHAR(50),
    p_referencia        VARCHAR(150),
    p_estado            BIT
)
BEGIN
    IF p_id_empresa = '' THEN
        SET p_id_empresa = NULL;
    END IF;
    INSERT INTO tb_clientes(id_persona, id_empresa, direccion, referencia, estado) 
    VALUES (p_id_persona, p_id_empresa, p_direccion, p_referencia, p_estado);
END $$

CREATE PROCEDURE spu_usuarios_registrar(
    p_id_persona        INT,
    p_nombre_user       VARCHAR(100),
    p_pass              VARCHAR(60)
)
BEGIN
    INSERT tb_usuarios(id_persona, nombre_user, pass) 
        VALUES
            (p_id_persona, p_nombre_user, p_pass);
    SELECT LAST_INSERT_ID() AS id_usuario;
END $$

CREATE PROCEDURE spu_registrar_roles(
    p_rol VARCHAR(30),
    p_permisos JSON
)
BEGIN
    INSERT INTO tb_roles (rol, permisos) VALUES (p_rol, p_permisos);
END $$

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

    
CREATE PROCEDURE spu_registrar_fichasoporte(
  IN p_soporte JSON
)
BEGIN
  INSERT INTO tb_soporte (pagos) 
  VALUES (p_soporte);
END $$