USE Delatel;

DROP VIEW IF EXISTS vw_soporte_detalle;
CREATE VIEW vw_soporte_detalle AS
SELECT 
    s.id_soporte,
    s.fecha_hora_solicitud,
    s.fecha_hora_asistencia,
    s.prioridad,
    s.soporte,
    ts.tipo_soporte,
    c.id_cliente,
    c.direccion_servicio,
    r.id_usuario AS id_tecnico,
    p.nombres AS tecnico_nombres,
    p.apellidos AS tecnico_apellidos
FROM 
    tb_soporte s
JOIN 
    tb_contratos c ON s.id_contrato = c.id_contrato
JOIN 
    tb_tipo_soporte ts ON s.id_tipo_soporte = ts.id_tipo_soporte
JOIN 
    tb_responsables r ON s.id_tecnico = r.id_responsable
JOIN 
    tb_usuarios u ON r.id_usuario = u.id_usuario
JOIN 
    tb_personas p ON u.id_persona = p.id_persona;


DELIMITER $$
DROP PROCEDURE IF EXISTS spu_tipo_soporte_registrar$$
CREATE PROCEDURE spu_tipo_soporte_registrar(
    p_tipo_soporte   VARCHAR(50),
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_tipo_soporte (tipo_soporte, iduser_create)
    VALUES (p_tipo_soporte, p_iduser_create);
END $$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_registrar_fichasoporte$$
CREATE PROCEDURE spu_registrar_fichasoporte(
    IN p_id_contrato INT,
    IN p_id_tipo_soporte INT,
    IN p_id_tecnico INT,
    IN p_fecha_hora_solicitud DATETIME,
    IN p_fecha_hora_asistencia DATETIME,
    IN p_prioridad VARCHAR(50),
    IN p_soporte JSON,
	IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_soporte (
        id_contrato,
        id_tipo_soporte,
        id_tecnico,
        fecha_hora_solicitud,
        fecha_hora_asistencia,
        prioridad,
        soporte,
        create_at,
        iduser_create
    )
    VALUES (
        p_id_contrato,
        p_id_tipo_soporte,
        p_id_tecnico,
        p_fecha_hora_solicitud,
        p_fecha_hora_asistencia,
        p_prioridad,
        p_soporte,
        NOW(),
        p_iduser_create
    );
END $$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_soporte_actualizar$$
CREATE PROCEDURE spu_soporte_actualizar(
    IN p_id_soporte INT,
    IN p_id_contrato INT,
    IN p_id_tipo_soporte INT,
    IN p_id_tecnico INT,
    IN p_fecha_hora_asistencia DATETIME,
    IN p_prioridad VARCHAR(50),
    IN p_soporte JSON,
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_soporte
    SET
        id_contrato = p_id_contrato,
        id_tipo_soporte = p_id_tipo_soporte,
        id_tecnico = p_id_tecnico,
        fecha_hora_asistencia = p_fecha_hora_asistencia,
        prioridad = p_prioridad,
        soporte = p_soporte,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_soporte = p_id_soporte;
END $$

