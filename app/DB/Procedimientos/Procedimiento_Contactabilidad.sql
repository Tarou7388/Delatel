USE Delatel;

DROP VIEW IF EXISTS vw_contactabilidad_listar;

CREATE VIEW vw_contactabilidad_listar AS
SELECT
    c.id_contactabilidad,
    CONCAT(p.nombres, ' ', p.apellidos) AS nombre_contacto,
    p.telefono,
    p.email,
    pk.paquete,
    pk.precio,
    c.create_at AS fecha_hora_contacto,
    c.direccion_servicio,
    c.nota,
    c.fecha_limite,
    u1.nombre_user AS usuario_creador,
    c.iduser_update,
    u2.nombre_user AS usuario_modificador,
    c.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_contactabilidad c
    JOIN tb_personas p ON c.id_persona = p.id_persona
    INNER JOIN tb_paquetes pk ON c.id_paquete = pk.id_paquete
    LEFT JOIN tb_usuarios u1 ON c.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON c.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON c.iduser_inactive = u3.id_usuario
WHERE
    p.id_persona NOT IN (SELECT id_persona FROM tb_clientes WHERE id_persona IS NOT NULL)
ORDER BY c.id_contactabilidad DESC;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_contactabilidad_registrar$$

CREATE PROCEDURE spu_contactabilidad_registrar(
    p_id_persona INT,
    p_id_empresa INT,
    p_id_paquete INT,
    p_direccion_servicio VARCHAR(250),
    p_nota TEXT,
    p_iduser_create INT,
    p_fecha_limite DATE
)
BEGIN
    INSERT INTO tb_contactabilidad (id_persona, id_empresa, id_paquete, direccion_servicio, nota, iduser_create, fecha_limite)
    VALUES (p_id_persona, p_id_empresa, p_id_paquete, p_direccion_servicio, p_nota, p_iduser_create, p_fecha_limite);
    SELECT LAST_INSERT_ID() AS id_contactabilidad;
END $$

DROP PROCEDURE IF EXISTS spu_contactabilidad_inhabilitar$$

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

DROP EVENT IF EXISTS ev_inhabilitar_contactos$$

CREATE EVENT ev_inhabilitar_contactos
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
    CALL spu_contactabilidad_inhabilitar(); 
END $$

DROP PROCEDURE IF EXISTS spu_contactabilidad_actualizar$$

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

DROP PROCEDURE IF EXISTS spu_contactabilidad_inhabilitarManual$$

CREATE PROCEDURE spu_contactabilidad_inhabilitarManual(
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