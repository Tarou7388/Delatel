-- Active: 1739285076596@@127.0.0.1@3306@delatel
USE Delatel;

DELIMITER $$

DROP VIEW IF EXISTS vw_empresas_listar$$

CREATE VIEW vw_empresas_listar AS
SELECT
    c.id_cliente,
    e.id_empresa,
    e.razon_social,
    e.nombre_comercial,
    e.telefono,
    e.email,
    c.coordenadas,
    c.direccion as direccion_contacto,
    e.ruc
FROM tb_empresas e
    LEFT JOIN tb_clientes c ON e.id_empresa = c.id_empresa;

DROP PROCEDURE IF EXISTS spu_clientesEmpresas_actualizar$$

CREATE PROCEDURE spu_clientesEmpresas_actualizar(
    p_razon_social     VARCHAR(100),
    p_nombre_comercial VARCHAR(100),
    p_telefono         CHAR(9),
    p_email            VARCHAR(100),
    p_direccion        VARCHAR(250),
    p_referencia       VARCHAR(150),
    p_coordenadas      VARCHAR(50),
    p_iduser_update    INT,
    p_id_empresa       INT
)
BEGIN
    SET p_email = CASE WHEN p_email = '' THEN NULL ELSE p_email END;

    UPDATE tb_empresas
    SET
        razon_social = p_razon_social,
        nombre_comercial = p_nombre_comercial,
        telefono = p_telefono,
        email = p_email,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_empresa = p_id_empresa;

    UPDATE tb_clientes tc
    INNER JOIN tb_empresas te ON tc.id_empresa = te.id_empresa
    SET
        tc.direccion = p_direccion,
        tc.referencia = p_referencia,
        tc.coordenadas = p_coordenadas,
        tc.update_at = NOW(),
        tc.iduser_update = p_iduser_update
    WHERE te.id_empresa = p_id_empresa;
END$$

DROP PROCEDURE IF EXISTS spu_empresa_cliente_idEmpresa$$

CREATE PROCEDURE spu_empresa_cliente_idEmpresa (
    IN p_id_empresa INT
)
BEGIN
SELECT
    c.id_cliente,
    e.id_empresa,
    e.razon_social,
    e.nombre_comercial,
    e.telefono,
    e.email,
    c.coordenadas,
    c.direccion as direccion_contacto,
    e.ruc
FROM
    tb_empresas e
    LEFT JOIN tb_clientes c ON e.id_empresa = c.id_empresa
    WHERE c.id_empresa = p_id_empresa;
END$$