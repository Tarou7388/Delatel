USE Delatel;

DELIMITER $$

/* Procedimiento buscar por servicio */
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

/* Procedimiento Listar */
DROP VIEW IF EXISTS vw_paquetes_listar;

CREATE VIEW vw_paquetes_listar AS
SELECT
    p.id_paquete,
    p.id_servicio,
    GROUP_CONCAT(s.servicio) AS servicios,
    GROUP_CONCAT(s.tipo_servicio) AS tipos_servicio,
    p.paquete,
    p.precio,
    p.create_at,
    p.update_at,
    p.inactive_at,
    p.iduser_create,
    p.iduser_update
FROM tb_paquetes p
    JOIN tb_servicios s ON JSON_CONTAINS(
        p.id_servicio, CONCAT(
            '{"id_servicio":', s.id_servicio, '}'
        )
    )
GROUP BY
    p.id_paquete;

/* Procedimiento Registrar */
DROP PROCEDURE IF EXISTS spu_paquete_registrar$$

CREATE PROCEDURE spu_paquete_registrar(
    IN p_id_servicio JSON,
    IN p_paquete VARCHAR(250),
    IN p_precio DECIMAL(7,2),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_paquetes (id_servicio, paquete, precio, iduser_create) 
    VALUES (p_id_servicio, p_paquete, p_precio, p_iduser_create);
END $$

/* Procedimiento Actualizar */
DROP PROCEDURE IF EXISTS spu_paquete_actualizar$$

CREATE PROCEDURE spu_paquete_actualizar(
	p_id_paquete INT,
    p_id_servicio JSON,
    p_paquete VARCHAR(250),
    p_precio DECIMAL(7,2),
    p_iduser_update INT
)
BEGIN
	UPDATE tb_paquetes 
    SET 
		id_servicio = p_id_servicio,
        paquete = p_paquete,
        precio = p_precio,
        iduser_update = p_iduser_update,
        update_at = NOW()
	WHERE
		id_paquete = p_id_paquete;
END $$

/* Procedimiento Eliminar */
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

/* Procedimiento Buscar por paquete */
DROP PROCEDURE IF EXISTS spu_paquete_buscar_id$$

CREATE PROCEDURE spu_paquete_buscar_id(
    IN p_id_paquete INT
)
BEGIN
    SELECT
        p.id_paquete,
        p.id_servicio,
        GROUP_CONCAT(s.servicio) AS servicios,
        GROUP_CONCAT(s.tipo_servicio) AS tipos_servicio,
        p.paquete,
        p.precio,
        p.create_at,
        p.update_at,
        p.inactive_at,
        p.iduser_create,
        p.iduser_update,
        p.iduser_inactive
    FROM tb_paquetes p
    JOIN tb_servicios s ON JSON_CONTAINS(
        p.id_servicio, CONCAT(
            '{"id_servicio":', s.id_servicio, '}'
        )
    )
    WHERE 
        p.id_paquete = p_id_paquete
    GROUP BY 
        p.id_paquete;
END $$

/* Procedimiento buscar por Servicio  */
DROP PROCEDURE IF EXISTS spu_paquete_buscar_idServicio$$
CREATE PROCEDURE spu_paquete_buscar_idServicio(IN p_id_servicio JSON)
BEGIN 
    SELECT 
        p.id_servicio,
        p.id_paquete, 
        p.paquete, 
        p.precio, 
        GROUP_CONCAT(s.tipo_servicio) AS tipos_servicio,
        p.inactive_at
    FROM 
        tb_paquetes p
        LEFT JOIN tb_servicios s ON JSON_CONTAINS(
            p.id_servicio, CONCAT(
                '{"id_servicio":', s.id_servicio, '}'
            )
        )
    WHERE 
        JSON_CONTAINS(p.id_servicio, CONCAT(
            '{"id_servicio":', JSON_UNQUOTE(JSON_EXTRACT(p_id_servicio, '$.id_servicio')), '}'
        ))
    GROUP BY 
        p.id_paquete;
END $$
