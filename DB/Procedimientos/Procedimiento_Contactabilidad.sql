USE Delatel;

-- Procedimiento para registrar Contactabilidad -- 
DELIMITER $$
CREATE PROCEDURE spu_contactabilidad_registrar(
    p_id_persona INT,
    p_id_paquete INT,
    p_direccion_servicio VARCHAR(250),
    p_nota TEXT,
    p_iduser_create INT,
    p_fecha_limite DATETIME
)
BEGIN
	INSERT INTO tb_contactabilidad (id_persona, id_paquete, direccion_servicio, nota, iduser_create, fecha_limite)
	VALUES (p_id_persona, p_id_paquete, p_direccion_servicio, p_nota, p_iduser_create, p_fecha_limite);
	SELECT LAST_INSERT_ID() AS id_contactabilidad;
END $$


-- Procedimiento para inhabilitar registros cuando se supera la fecha límite --
DELIMITER $$
CREATE PROCEDURE spu_contactabilidad_inhabilitar()
BEGIN
        UPDATE tb_contactabilidad
        SET inactive_at = NOW(),
            iduser_inactive = iduser_create
        WHERE fecha_limite <= NOW() AND inactive_at IS NULL;
END $$

DELIMITER $$
CREATE EVENT ev_inhabilitar_contactos
ON SCHEDULE EVERY 10 SECOND 
DO
BEGIN
    CALL spu_contactabilidad_inhabilitar(); 
END $$

SET GLOBAL event_scheduler = ON;
SHOW VARIABLES LIKE 'event_scheduler';