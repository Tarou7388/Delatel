USE Delatel;

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_permisos_listar_id$$
CREATE PROCEDURE spu_permisos_listar_id(
    p_id_rol INT
)
BEGIN
    SELECT rol, permisos FROM tb_roles
    WHERE id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS spu_permisos_actualizar_id$$
CREATE PROCEDURE spu_permisos_actualizar_id(
    p_id_rol INT,
    p_permisos JSON,
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

