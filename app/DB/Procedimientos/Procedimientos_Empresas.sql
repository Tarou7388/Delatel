USE Delatel;
DELIMITER $$

DROP VIEW IF EXISTS vw_empresas_listar$$
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
    e.iduser_update,
    e.iduser_inactive
FROM
    tb_empresas e;
    
DROP PROCEDURE IF EXISTS spu_empresas_registrar$$
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

DROP PROCEDURE IF EXISTS spu_empresas_actualizar$$
CREATE PROCEDURE spu_empresas_actualizar(
    p_ruc                	VARCHAR(11),
    p_representante_legal 	VARCHAR(70),
    p_razon_social        	VARCHAR(100),
    p_nombre_comercial    	VARCHAR(100),
    p_telefono            	CHAR(9),
    p_email               	VARCHAR(100),
    p_iduser_update       	INT,
    p_id_empresa          	INT
)
BEGIN
    UPDATE tb_empresas
    SET 
        ruc = p_ruc,
        representante_legal = p_representante_legal,
        razon_social = p_razon_social,
        nombre_comercial = p_nombre_comercial,
        telefono = p_telefono,
        email = p_email,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_empresa = p_id_empresa;
END $$

DROP PROCEDURE IF EXISTS spu_empresas_eliminar$$
CREATE PROCEDURE spu_empresas_eliminar(
    p_id_empresa INT,
    p_iduser_inactive INT
)
BEGIN
    UPDATE tb_empresas
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_empresa = p_id_empresa;
END $$

DROP PROCEDURE IF EXISTS spu_empresa_cliente_existencia$$
CREATE PROCEDURE spu_empresa_cliente_existencia(
    IN p_ruc VARCHAR(15)
)
BEGIN
    SELECT e.id_empresa, c.id_cliente, e.ruc, e.razon_social FROM
    tb_empresas e LEFT JOIN tb_clientes c ON e.id_empresa = c.id_empresa
    WHERE e.ruc = p_ruc;
END $$