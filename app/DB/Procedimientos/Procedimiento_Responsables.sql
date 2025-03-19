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

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_responsablesUsuarios_actualizar$$
CREATE PROCEDURE spu_responsablesUsuarios_actualizar(
    IN p_id_usuario INT,
    IN p_id_rol INT,
    IN p_id_create INT,
    IN p_id_responsable INT
)
BEGIN
    INSERT INTO tb_responsables (
        id_usuario, 
        id_rol, 
        fecha_inicio, 
        iduser_create
    ) VALUES (
        p_id_usuario, 
        p_id_rol, 
        NOW(), 
        p_id_create
    );

    UPDATE tb_responsables SET
        iduser_update = p_id_create,
        fecha_fin = NOW(),
        iduser_inactive = NOW()
    WHERE id_responsable = p_id_responsable;
END$$

DELIMITER ;


-- ELIMINAR PROCEDURE spu_responsables_eliminar
 
SELECT * FROM tb_responsables

