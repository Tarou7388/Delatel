-- Active: 1740619856376@@127.0.0.1@3306@delatel
USE Delatel;

DROP VIEW IF EXISTS vw_clientes_obtener;
CREATE VIEW vw_clientes_obtener AS
SELECT
    c.id_cliente,
    COALESCE(CONCAT(p.nombres, ", ", p.apellidos), e.razon_social) AS nombre_cliente,
    COALESCE(p.nro_doc, e.ruc) AS codigo_cliente, 
    COALESCE(p.email, e.email) AS email_cliente,
    COALESCE(p.telefono, e.telefono) AS telefono_cliente,
    c.direccion AS direccion_cliente,
    c.referencia AS referencia_cliente,
    c.coordenadas AS coordenadas_cliente
FROM
    tb_clientes c
LEFT JOIN tb_personas p ON c.id_persona = p.id_persona AND p.inactive_at IS NULL
LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa AND e.inactive_at IS NULL
LEFT JOIN tb_contratos ct ON c.id_cliente = ct.id_cliente AND ct.inactive_at IS NULL
WHERE
    c.inactive_at IS NULL
    AND ct.ficha_instalacion IS NOT NULL
GROUP BY
    c.id_cliente,
    nombre_cliente,
    codigo_cliente,
    email_cliente,
    telefono_cliente,
    direccion_cliente,
    referencia_cliente,
    coordenadas_cliente;
DELIMITER $$

DROP PROCEDURE IF EXISTS spu_clientes_registrar$$
CREATE PROCEDURE spu_clientes_registrar(
    p_id_persona        INT,
    p_id_empresa        INT,
    p_direccion         VARCHAR(50),
    p_referencia        VARCHAR(150),
    p_iduser_create     INT,
    p_coordenadas       VARCHAR(50)
)
BEGIN
    IF p_id_empresa = '' THEN
        SET p_id_empresa = NULL;
    ELSEIF p_id_persona = '' THEN
        SET p_id_persona = NULL;
    END IF;
    INSERT INTO tb_clientes(id_persona, id_empresa, direccion, referencia, iduser_create, coordenadas) 
    VALUES (p_id_persona, p_id_empresa, p_direccion, p_referencia, p_iduser_create, p_coordenadas);
    SELECT LAST_INSERT_ID() AS id_cliente;
END $$

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_cliente_buscar_NombreApp;

CREATE PROCEDURE spu_cliente_buscar_NombreApp(
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50)
)
BEGIN
    IF p_apellido = '' THEN
        SELECT codigo_cliente, nombre_cliente, telefono_cliente
        FROM vw_clientes_obtener
        WHERE nombre_cliente LIKE CONCAT('%', p_nombre, '%');
    ELSE
        SELECT codigo_cliente, nombre_cliente, telefono_cliente
        FROM vw_clientes_obtener
        WHERE nombre_cliente LIKE CONCAT('%', p_nombre, '%')
          AND nombre_cliente LIKE CONCAT('%', p_apellido, '%');
    END IF;
END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_cliente_buscar_nrodoc$$
CREATE PROCEDURE spu_cliente_buscar_nrodoc(IN p_documento VARCHAR(15))
BEGIN
    IF LENGTH(p_documento) IN (8, 9, 12) THEN
        SELECT 
            c.id_cliente,
            c.direccion,
            p.nacionalidad,
            c.referencia,
            c.coordenadas,
            CONCAT(p.apellidos, ', ', p.nombres) AS nombre,
            p.email,
            p.telefono
        FROM 
            tb_clientes c
        LEFT JOIN 
            tb_personas p ON c.id_persona = p.id_persona
        WHERE 
            p.nro_doc = p_documento;

    ELSEIF LENGTH(p_documento) = 11 THEN
        SELECT 
            c.id_cliente,
            c.direccion,
            c.referencia,
            c.coordenadas,
            e.nombre_comercial AS nombre,
            e.email,
            e.telefono
        FROM 
            tb_clientes c
        LEFT JOIN 
            tb_empresas e ON e.id_empresa = c.id_empresa
        WHERE 
            e.ruc = p_documento;
    END IF;
END $$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_clientesPersonas_actualizar$$
CREATE PROCEDURE spu_clientesPersonas_actualizar(
    p_apellidos        VARCHAR(80),
    p_nombres          VARCHAR(80),
    p_telefono         CHAR(9),
    p_email            VARCHAR(100),
    p_direccion        VARCHAR(250),
    p_referencia       VARCHAR(150),
    p_coordenadas      VARCHAR(50),
    p_iduser_update    INT,
    p_id_persona       INT
)
BEGIN
    SET p_email = CASE WHEN p_email = '' THEN NULL ELSE p_email END;

    UPDATE tb_personas
    SET
        apellidos = p_apellidos,
        nombres = p_nombres,
        telefono = p_telefono,
        email = p_email,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_persona = p_id_persona;
    UPDATE tb_clientes tc
    INNER JOIN tb_personas tp ON tc.id_persona = tp.id_persona
    SET
        tc.direccion = p_direccion,
        tc.referencia = p_referencia,
        tc.coordenadas = p_coordenadas,
        tc.update_at = NOW(),
        tc.iduser_update = p_iduser_update
    WHERE tp.id_persona = p_id_persona;
END$$

DELIMITER $$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_clientes_eliminar$$
CREATE PROCEDURE spu_clientes_eliminar(
    p_identificador VARCHAR(15),
    p_iduser_inactive INT
)
BEGIN
    DECLARE v_tipo_doc CHAR(3);
    DECLARE v_nro_doc VARCHAR(15);

    IF LENGTH(p_identificador) = 8 THEN
        SET v_tipo_doc = 'DNI';
        SET v_nro_doc = p_identificador;

    ELSEIF LENGTH(p_identificador) = 11 THEN
        SET v_tipo_doc = 'RUC';
        SET v_nro_doc = p_identificador;
    END IF;

    UPDATE tb_clientes
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_cliente = (
        SELECT id_cliente
        FROM tb_clientes
        WHERE (id_persona IN (
                SELECT id_persona FROM tb_personas WHERE nro_doc = v_nro_doc AND tipo_doc = v_tipo_doc
            ) OR id_empresa IN (
                SELECT id_empresa FROM tb_empresas WHERE ruc = v_nro_doc
            )) AND inactive_at IS NULL
    );
END $$

DELIMITER $$


DROP VIEW IF EXISTS vw_clientes_contar_con_ficha_llena;

CREATE VIEW vw_clientes_contar_con_ficha_llena AS
SELECT
    COUNT(DISTINCT c.id_cliente) AS total_clientes_con_ficha_llena
FROM tb_contratos c
WHERE
    c.ficha_instalacion IS NOT NULL
    AND c.inactive_at IS NULL;

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_buscar_datos_cliente_id$$
CREATE PROCEDURE spu_buscar_datos_cliente_id  
(
    p_id_cliente INT
)
BEGIN
    SELECT
        c.id_cliente,
        COALESCE(
            CONCAT(p.nombres, ", ", p.apellidos),
            e.nombre_comercial
        ) AS nombre_cliente,
        COALESCE(p.nro_doc, e.ruc) AS identificador_cliente,
        p.nacionalidad,  
        CASE 
            WHEN p.nro_doc IS NOT NULL THEN p.tipo_doc
            ELSE 'RUC'
        END AS tipo_doc,
        COALESCE(p.telefono, e.telefono) AS telefono,
        COALESCE(p.email, e.email) AS email,
        c.direccion,
        c.referencia,
        c.coordenadas
    FROM
        tb_clientes c
        LEFT JOIN tb_personas p ON c.id_persona = p.id_persona
        LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa
    WHERE
        c.id_cliente = p_id_cliente;
END$$