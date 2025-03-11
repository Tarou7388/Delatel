-- Active: 1733577930028@@127.0.0.1@3306@delatel

USE Delatel;

DELIMITER $$

DROP VIEW IF EXISTS vw_personas_listar$$
CREATE VIEW vw_personas_listar AS
SELECT
    p.id_persona,
    p.tipo_doc,
    p.nro_doc,
    CONCAT(p.apellidos, ', ', p.nombres) as Nombre_Completo,
    p.telefono,
    p.nacionalidad,
    p.email,
    cl.direccion as direccion_contacto
FROM
    tb_personas p
    LEFT JOIN tb_clientes cl ON p.id_persona = cl.id_persona WHERE p.id_persona != 1;

DROP PROCEDURE IF EXISTS spu_personas_registrar$$
CREATE PROCEDURE spu_personas_registrar(
    p_tipo_doc          CHAR(3),
    p_nro_doc           VARCHAR(15),
    p_apellidos         VARCHAR(80),
    p_nombres           VARCHAR(80),
    p_telefono          CHAR(9),
    p_nacionalidad      VARCHAR(40),
    p_email             VARCHAR(100),
    p_iduser_create     INT
)
BEGIN
    INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, nacionalidad, email, iduser_create) 
    VALUES (p_tipo_doc, p_nro_doc, p_apellidos, p_nombres, p_telefono, p_nacionalidad, NULLIF(p_email,''), p_iduser_create);

    SELECT LAST_INSERT_ID() AS id_persona;
END $$

DROP PROCEDURE IF EXISTS spu_personas_actualizar$$


DROP PROCEDURE IF EXISTS spu_personas_eliminar$$
CREATE PROCEDURE spu_personas_eliminar(
    p_id_persona INT,
    p_iduser_inactive INT
)
BEGIN
    UPDATE tb_personas
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_persona = p_id_persona;
END $$

DELIMITER $$
DROP PROCEDURE IF EXISTS `spu_personas_buscar_dni`$$
CREATE PROCEDURE spu_personas_buscar_dni(
    IN p_dni VARCHAR(15)
)
BEGIN
    SELECT 
        p.id_persona, 
        p.tipo_doc, 
        p.nro_doc, 
        p.apellidos, 
        p.nombres, 
        p.telefono, 
        p.nacionalidad, 
        p.email,
        u.id_usuario
    FROM tb_personas p
    LEFT JOIN tb_usuarios u ON p.id_persona = u.id_persona
    WHERE p.nro_doc = p_dni;
END $$

DROP PROCEDURE IF EXISTS spu_persona_cliente_existencia$$
CREATE PROCEDURE spu_persona_cliente_existencia(
    IN p_dni VARCHAR(15)
)
BEGIN
    SELECT p.id_persona, p.nombres, p.apellidos, c.id_cliente 
    FROM tb_personas p 
    LEFT JOIN tb_clientes c ON p.id_persona = c.id_persona
    WHERE p.nro_doc = p_dni;
END $$

DROP PROCEDURE IF EXISTS spu_personas_listar_por_id$$
CREATE PROCEDURE spu_personas_listar_por_id(
    IN p_id_persona INT
)
BEGIN
    SELECT * FROM tb_personas WHERE id_persona = p_id_persona;
END $$



DELIMITER $$
DROP PROCEDURE IF EXISTS spu_clientes_por_IdPersona$$
CREATE PROCEDURE spu_clientes_por_IdPersona (
    IN p_id_persona INT
)
BEGIN
    SELECT
        p.id_persona,
        p.nombres,
        p.apellidos,
        p.nro_doc AS identificador_cliente,
        p.telefono,
        p.email,
        c.direccion,
        c.referencia,
        c.coordenadas,
        c.id_cliente
    FROM tb_personas p
    LEFT JOIN tb_clientes c ON c.id_persona = p.id_persona
    WHERE p.id_persona = p_id_persona;
END$$

SELECT * FROM tb_personas;