USE Delatel;

DELIMITER $$

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
