USE Delatel;

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_paquetes_buscar_servicio$$

DELIMITER $$

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_paquetes_buscar_servicio$$

CREATE PROCEDURE spu_paquetes_buscar_servicio(IN p_id_servicio JSON)
BEGIN
    SELECT 
        p.id_paquete,
        p.id_servicio,
        GROUP_CONCAT(s.servicio) AS servicios,
        GROUP_CONCAT(s.tipo_servicio) AS tipos_servicio,
        p.paquete,
        p.precio,
        p.duracion,
        p.create_at,
        p.update_at,
        p.inactive_at,
        p.iduser_create,
        p.iduser_update,
        p.iduser_inactive
    FROM
        tb_paquetes p
        JOIN tb_servicios s ON JSON_CONTAINS(
            p.id_servicio, 
            CONCAT('{"id_servicio":', s.id_servicio, '}')
        )
    WHERE 
        JSON_CONTAINS(p.id_servicio, JSON_UNQUOTE(JSON_EXTRACT(p_id_servicio, '$.id_servicio')), '$.id_servicio')
    GROUP BY 
        p.id_paquete;
END $$

CALL spu_paquetes_buscar_servicio('{"id_servicio": [1]}');

CREATE VIEW vw_paquetes_listar AS
SELECT
    p.id_paquete,
    p.id_servicio, 
    p.paquete,
    s.tipo_servicio AS tipo_servicio,
    s.servicio,
    p.precio,
    p.duracion,
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
    IN p_id_servicio2 INT,
    IN p_id_servicio3 INT,
    IN p_id_servicio4 INT,
    IN p_paquete VARCHAR(250),
    IN p_precio DECIMAL(7,2),
    IN p_duracion JSON,
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_paquetes (id_servicio, id_servicio2, id_servicio3, id_servicio4, paquete, precio, duracion, iduser_create) 
    VALUES (p_id_servicio, p_id_servicio2, p_id_servicio3, p_id_servicio4, p_paquete, p_precio, p_duracion, p_iduser_create);
END $$  


DROP PROCEDURE IF EXISTS spu_paquete_actualizar$$
CREATE PROCEDURE spu_paquete_actualizar(
	p_id_paquete INT,
    p_id_servicio INT,
    p_id_servicio2 INT,
    p_id_servicio3 INT,
    p_id_servicio4 INT,
    p_paquete VARCHAR(250),
    p_precio DECIMAL(7,2),
    p_duracion JSON,
    p_iduser_update INT
)
BEGIN
	UPDATE tb_paquetes 
    SET 
		id_servicio = p_id_servicio,
        id_servicio2 = p_id_servicio2,
        id_servicio3 = p_id_servicio3,
        id_servicio4 = p_id_servicio4,
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

DROP PROCEDURE IF EXISTS spu_paquete_buscar_id$$
CREATE PROCEDURE spu_paquete_buscar_id(
    IN p_id_paquete INT
)
BEGIN
    SELECT
        p.id_paquete,
        p.id_servicio, 
        p.id_servicio2,
        p.id_servicio3, 
        p.id_servicio4,
        p.paquete,
        CONCAT_WS(' + ', s.tipo_servicio, s2.tipo_servicio, s3.tipo_servicio, s4.tipo_servicio) AS tipo_servicio,
        s.servicio,
        p.precio,
        p.duracion,
        p.create_at,
        p.update_at,
        p.inactive_at,
        p.iduser_create,
        p.iduser_update,
        p.iduser_inactive
    FROM
        tb_paquetes p
        LEFT JOIN tb_servicios s ON p.id_servicio = s.id_servicio
        LEFT JOIN tb_servicios s2 ON p.id_servicio2 = s2.id_servicio
        LEFT JOIN tb_servicios s3 ON p.id_servicio3 = s3.id_servicio
        LEFT JOIN tb_servicios s4 ON p.id_servicio4 = s4.id_servicio
    WHERE
        p.id_paquete = p_id_paquete;
END $$

DROP PROCEDURE IF EXISTS spu_paquete_buscar_idServicio$$
CREATE PROCEDURE spu_paquete_buscar_idServicio(IN p_id_servicio INT)
BEGIN 
    SELECT 
        p.id_servicio2,
        p.id_servicio3,
        p.id_servicio4,
        p.id_paquete, 
        p.paquete, 
        p.precio, 
        p.duracion,
        s.tipo_servicio,
        p.inactive_at
    FROM 
        tb_paquetes p
        LEFT JOIN tb_servicios s ON p.id_servicio = s.id_servicio
    WHERE 
        p.id_servicio = p_id_servicio;
END $$

