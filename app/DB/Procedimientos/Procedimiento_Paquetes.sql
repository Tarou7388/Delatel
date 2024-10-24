USE Delatel;

/* DELIMITER $$
DROP VIEW IF EXISTS vw_paquetes_listar$$
CREATE VIEW vw_paquetes_listar AS
SELECT
    p.id_paquete,
    p.id_servicio,
    s.servicio,
    p.precio,
    p.fecha_inicio,
    p.fecha_fin,
    p.create_at,
    p.update_at,
    p.inactive_at,
    p.iduser_create,
    p.iduser_update,
    p.iduser_inactive
FROM
    tb_paquetes p
    LEFT JOIN tb_servicios s ON p.id_servicio = s.id_servicio;


DROP PROCEDURE IF EXISTS spu_paquete_registrar$$
CREATE PROCEDURE spu_paquete_registrar(
    IN p_id_servicio INT,
    IN p_paquete VARCHAR(250),
    IN p_precio DECIMAL(7,2),
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_paquetes (id_servicio, paquete, precio, fecha_inicio, fecha_fin, iduser_create) 
    VALUES (p_id_servicio, p_paquete, p_precio, p_fecha_inicio, p_fecha_fin, p_iduser_create);
END $$ */

DROP PROCEDURE IF EXISTS spu_paquetes_actualizar$$
CREATE PROCEDURE spu_paquetes_actualizar(
	p_id_paquete INT,
    p_id_servicio INT,
    p_paquete VARCHAR(250),
    p_precio DECIMAL(7,2),
    p_duracion JSON,
    p_iduser_update INT
)
BEGIN
	UPDATE tb_paquetes 
    SET 
		id_servicio = p_id_servicio,
        paquete = p_paquete,
        precio = p_precio,
        duracion = p_duracion,
        iduser_update = p_iduser_update,
        update_at = NOW()
	WHERE
		id_paquete = p_id_paquete;
END $$


DROP PROCEDURE IF EXISTS spu_paquete_eliminar$$
CREATE PROCEDURE spu_paquete_eliminar(
	p_id_paquete INT,
    p_iduser_inactive INT
)
BEGIN
	UPDATE tb_paquetes
    SET 	
		inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
	WHERE 
		id_paquete = p_id_paquete;
END $$

