USE Delatel;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_responsables_registrar$$
CREATE PROCEDURE spu_responsables_registrar (
    IN p_id_usuario INT,
    IN p_id_rol INT,
    IN p_fecha_inicio DATETIME,
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_responsables (
        id_usuario, 
        id_rol, 
        fecha_inicio, 
        iduser_create
    )
    VALUES (
        p_id_usuario, 
        p_id_rol, 
        p_fecha_inicio, 
        p_iduser_create
    );
END $$

-- ACTUALIZAR PROCEDURE 
DROP PROCEDURE IF EXISTS spu_responsablesUsuarios_actualizar$$
CREATE PROCEDURE spu_responsablesUsuarios_actualizar(
    IN p_iduser_update INT,
    IN p_id_rol INT,
    IN p_id_responsable INT
)
BEGIN
    UPDATE tb_responsables
    SET 
        id_rol = p_id_rol,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE 
        p_id_responsable = id_responsable;
END $$

-- ELIMINAR PROCEDURE
DROP PROCEDURE IF EXISTS spu_responsables_eliminar$$
CREATE PROCEDURE spu_responsables_eliminar (
    IN p_iduser_inactive INT,
    IN p_id_responsable INT
)
BEGIN
    UPDATE tb_responsables
    SET 
        user_inactive = p_iduser_inactive,
        fecha_fin = NOW()
    WHERE 
        p_id_responsable = id_responsable;
END $$





