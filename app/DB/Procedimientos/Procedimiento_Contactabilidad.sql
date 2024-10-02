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

DELIMITER $$
CREATE PROCEDURE spu_contactabilidad_inhabilitar()
BEGIN
        UPDATE tb_contactabilidad
        SET 
        inactive_at = NOW(),
        iduser_inactive = CASE 
            WHEN iduser_update IS NOT NULL THEN iduser_update 
            ELSE iduser_create 
        END
        WHERE fecha_limite <= NOW() AND inactive_at IS NULL;
END $$

DELIMITER $$
CREATE EVENT ev_inhabilitar_contactos
ON SCHEDULE EVERY 10 SECOND 
DO
BEGIN
    CALL spu_contactabilidad_inhabilitar(); 
END $$

-- Procedimiento para Actualizar -- 
DELIMITER $$
CREATE PROCEDURE spu_contactabilidad_actualizar(
	p_id_contactabilidad INT,
	p_id_persona INT,
    p_id_paquete INT,
    p_direccion_servicio VARCHAR(250),
    p_nota TEXT,
    p_fecha_limite DATETIME,
    p_iduser_update INT
)
BEGIN
	UPDATE tb_contactabilidad
		SET
        id_persona = p_id_persona,
        id_paquete = p_id_paquete,
        direccion_servicio = p_direccion_servicio,
        nota = p_nota,
        fecha_limite = p_fecha_limite,
        iduser_update = p_iduser_update,
        update_at = NOW()
	WHERE 
		id_contactabilidad = p_id_contactabilidad; 
END $$

-- Procedimiento para inhabilitar Manualmente -- 
DELIMITER $$
CREATE PROCEDURE spu_contactabilidad_inhabilitar_manualmente(
	p_id_contactabilidad INT,
    p_iduser_inactive INT
)
BEGIN
	UPDATE tb_contactabilidad
		SET
		inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
	WHERE
		id_contactabilidad = p_id_contactabilidad;
END $$


SET GLOBAL event_scheduler = ON;
SHOW VARIABLES LIKE 'event_scheduler';