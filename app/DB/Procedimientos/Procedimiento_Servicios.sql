USE Delatel;

DROP VIEW IF EXISTS vw_servicios_listar;
CREATE VIEW vw_servicios_listar AS
SELECT
    s.id_servicio,
    s.tipo_servicio,
    s.servicio,
    s.inactive_at
FROM
    tb_servicios s;

DROP VIEW IF EXISTS vw_servicios_listarTotal;
CREATE VIEW vw_servicios_listarTotal AS
SELECT
    s.id_servicio,
    s.servicio,
    s.create_at,
    s.update_at,
    s.inactive_at,
    s.iduser_create,
    s.iduser_update,
    s.iduser_inactive
FROM
    tb_servicios s;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_servicio_registrar$$
CREATE PROCEDURE spu_servicio_registrar(
    IN p_tipo_servicio CHAR(4),
    IN p_servicio VARCHAR(50), 
    IN p_iduser_create INT
) 
BEGIN 
    INSERT INTO tb_servicios (tipo_servicio, servicio, iduser_create) 
    VALUES (p_tipo_servicio, p_servicio, p_iduser_create); 
END $$

DROP PROCEDURE IF EXISTS spu_servicio_actualizar$$
CREATE PROCEDURE spu_servicio_actualizar(
    IN p_id_servicio INT,
    IN p_tipo_servicio CHAR(4),
    IN p_servicio VARCHAR(50),
    IN p_iduser_update INT 
)
BEGIN
    UPDATE tb_servicios 
    SET
        tipo_servicio = p_tipo_servicio,
        servicio = p_servicio,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE 
        id_servicio = p_id_servicio;
END $$

DROP PROCEDURE IF EXISTS spu_servicio_eliminar$$
CREATE PROCEDURE spu_servicio_eliminar(
    IN p_id_servicio INT,
    IN p_iduser_inactive INT
)
BEGIN
    UPDATE tb_servicios 
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE 
        id_servicio = p_id_servicio;
END $$


DROP PROCEDURE IF EXISTS spu_servicio_reactivar$$
CREATE PROCEDURE spu_servicio_reactivar(
    IN p_id_servicio INT,
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_servicios 
    SET
        inactive_at = NULL,
        iduser_inactive = NULL,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE 
        id_servicio = p_id_servicio;
END $$

DELIMITER ;
