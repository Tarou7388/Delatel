USE Delatel;

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
    LEFT JOIN tb_usuarios u1 ON e.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON e.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON e.iduser_inactive = u3.id_usuario;
    
DELIMITER $$

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