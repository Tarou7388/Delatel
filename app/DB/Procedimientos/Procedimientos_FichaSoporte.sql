USE Delatel;

-- Vista vw_soporte_detalle actualizada
DROP VIEW IF EXISTS vw_soporte_detalle;
CREATE VIEW vw_soporte_detalle AS
SELECT 
    s.id_soporte,
    s.fecha_hora_solicitud,
    s.fecha_hora_asistencia,
    s.prioridad,
    s.soporte,
    s.descripcion_problema,      
    s.descripcion_solucion,      
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


-- Procedimientos almacenados (sin cambios)

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
    IN p_descripcion_problema TEXT,
    IN p_descripcion_solucion TEXT,
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
        descripcion_problema,
        descripcion_solucion,
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
        p_descripcion_problema,
        NULLIF(p_descripcion_solucion,""),
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
    IN p_descripcion_solucion TEXT,
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
        descripcion_solucion = p_descripcion_solucion,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_soporte = p_id_soporte;
END $$

-- Vista vw_soporte_detalle_incompleto actualizada POSIBLE A ELIMINACION
DROP VIEW IF EXISTS vw_soporte_detalle_incompleto;
CREATE VIEW vw_soporte_detalle_incompleto AS
SELECT 
    s.id_soporte,
    s.prioridad,
    s.soporte,
    s.descripcion_problema,      -- Se agrega descripcion_problema
    s.descripcion_solucion,      -- Se agrega descripcion_solucion
    ts.tipo_soporte,
    c.id_cliente,
    CONCAT(p_cliente.nombres, ' ', p_cliente.apellidos) AS nombre_cliente,
    c.direccion_servicio,
    r.id_usuario AS id_tecnico,
    CONCAT(p_tecnico.nombres, ' ', p_tecnico.apellidos) AS nombre_tecnico
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
    tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
JOIN 
    tb_clientes cl ON c.id_cliente = cl.id_cliente
JOIN 
    tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona
ORDER BY s.id_soporte DESC;

DROP PROCEDURE IF EXISTS spu_soporte_filtrar_prioridad$$
CREATE PROCEDURE spu_soporte_filtrar_prioridad(
    IN p_prioridad VARCHAR(10)
)
BEGIN
    SELECT 
        s.id_soporte,
        s.prioridad,
        s.soporte,
        s.descripcion_problema,
        s.descripcion_solucion,
        ts.tipo_soporte,
        c.id_cliente,
        CONCAT(p_cliente.nombres, ' ', p_cliente.apellidos) AS nombre_cliente,
        c.direccion_servicio,
        r.id_usuario AS id_tecnico,
        CONCAT(p_tecnico.nombres, ' ', p_tecnico.apellidos) AS nombre_tecnico
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
        tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
    JOIN 
        tb_clientes cl ON c.id_cliente = cl.id_cliente
    JOIN 
        tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona 
    WHERE 
        LOWER(TRIM(s.prioridad)) = LOWER(TRIM(p_prioridad));
END$$

