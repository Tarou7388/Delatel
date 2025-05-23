USE Delatel;

DELIMITER $$
DROP VIEW IF EXISTS vw_usuarios_listar$$
CREATE VIEW vw_usuarios_listar AS
SELECT 
    res.id_responsable,
    us.id_usuario,
    ro.id_rol,
    COALESCE(CONCAT(pe.nombres, ", ", pe.apellidos)) AS nombre,
    us.nombre_user,
    ro.rol AS "Cargo",
    us.create_at,
    us.inactive_at
FROM
    tb_responsables res
    INNER JOIN tb_usuarios us ON res.id_usuario = us.id_usuario
    INNER JOIN tb_personas pe ON us.id_persona = pe.id_persona
    INNER JOIN tb_roles ro ON res.id_rol = ro.id_rol
WHERE 
    us.inactive_at IS NULL AND
    res.fecha_fin IS NULL
    AND us.id_usuario != 1;

DROP PROCEDURE IF EXISTS spu_usuarios_login$$
CREATE PROCEDURE spu_usuarios_login(
        p_nombre_user VARCHAR(100)
    )
    BEGIN
        SELECT 
            u.nombre_user,
            r.id_responsable AS id_usuario,
            u.pass,
            r.id_rol,
            ro.rol AS "Cargo"
        FROM 
            tb_usuarios u
        JOIN 
            tb_responsables r ON u.id_usuario = r.id_usuario
        JOIN 
            tb_roles ro ON r.id_rol = ro.id_rol
        WHERE 
            nombre_user = p_nombre_user AND r.fecha_fin IS NULL;
    END $$

DROP PROCEDURE IF EXISTS spu_usuarios_registrar$$
CREATE PROCEDURE spu_usuarios_registrar(
    p_id_persona        INT,
    p_nombre_user       VARCHAR(100),
    p_pass              VARCHAR(60),
    p_iduser_create     INT
)
BEGIN
    INSERT INTO tb_usuarios(id_persona, nombre_user, pass, iduser_create) 
    VALUES (p_id_persona, p_nombre_user, p_pass, p_iduser_create);
    
    SELECT LAST_INSERT_ID() AS id_usuario;
END $$

DROP PROCEDURE IF EXISTS spu_usuario_actualizar$$
CREATE PROCEDURE spu_usuario_actualizar (
    IN p_nombre_user VARCHAR(100),
    IN p_iduser_update INT,
	IN p_id_usuario INT
)
BEGIN
	UPDATE tb_usuarios
	SET nombre_user = p_nombre_user,
		update_at = NOW(),
		iduser_update = p_iduser_update
	WHERE id_usuario = p_id_usuario;
END$$

DROP PROCEDURE IF EXISTS sp_usuario_eliminar$$
CREATE PROCEDURE sp_usuario_eliminar (
    IN p_id_usuario INT,
    IN p_iduser_inactive INT
)
BEGIN
    UPDATE tb_usuarios
    SET inactive_at = NOW(), 
        iduser_inactive = p_iduser_inactive
    WHERE id_usuario = p_id_usuario;
END $$

DROP PROCEDURE IF EXISTS spu_usuario_buscar_username$$
CREATE PROCEDURE spu_usuario_buscar_username
(
	IN p_username VARCHAR(100)
)
BEGIN
	SELECT nombre_user FROM tb_usuarios 
    WHERE nombre_user = p_username;
END$$
