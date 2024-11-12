USE Delatel;
DROP VIEW IF EXISTS vw_soporte_detalle;


CREATE VIEW vw_soporte_detalle AS
SELECT
    s.id_soporte,
    s.id_contrato,
    s.fecha_hora_solicitud,
    s.fecha_hora_asistencia,
    s.prioridad,
    s.soporte,
    s.descripcion_problema,
    s.descripcion_solucion,
    ts.tipo_soporte,
    p_cliente.nro_doc,
    c.id_cliente,
    c.direccion_servicio,
    r.id_usuario AS id_tecnico,
    p_tecnico.nombres AS tecnico_nombres,
    p_tecnico.apellidos AS tecnico_apellidos,
    pk.id_paquete,      
    pk.id_servicio,     
    srv.tipo_servicio   
FROM
    tb_soporte s
    LEFT JOIN tb_contratos c ON s.id_contrato = c.id_contrato
    LEFT JOIN tb_tipo_soporte ts ON s.id_tipo_soporte = ts.id_tipo_soporte
    LEFT JOIN tb_responsables r ON s.id_tecnico = r.id_responsable
    LEFT JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
    LEFT JOIN tb_paquetes pk ON c.id_paquete = pk.id_paquete
    LEFT JOIN tb_servicios srv ON pk.id_servicio = srv.id_servicio
    LEFT JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona;





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
    IN p_fecha_hora_solicitud DATETIME,
    IN p_descripcion_problema TEXT,
    IN p_descripcion_solucion TEXT,
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_soporte (
        id_contrato,
        fecha_hora_solicitud,
        descripcion_problema,
        descripcion_solucion,
        create_at,
        iduser_create
    )
    VALUES (
        p_id_contrato,
        p_fecha_hora_solicitud,
        p_descripcion_problema,
        CASE 
            WHEN p_descripcion_solucion = '' THEN NULL 
            ELSE p_descripcion_solucion 
        END,
        NOW(),
        p_iduser_create
    );
END $$


DELIMITER $$

DROP PROCEDURE IF EXISTS spu_soporte_actualizar$$

CREATE PROCEDURE spu_soporte_actualizar(
    IN p_id_soporte INT,
    IN p_id_tecnico INT,
    IN p_id_tipo_soporte INT,
    IN p_fecha_hora_asistencia DATETIME,
    IN p_prioridad VARCHAR(50),
    IN p_soporte JSON,
    IN p_iduser_update INT,
    IN p_procedimiento_S TEXT
)
BEGIN
    UPDATE tb_soporte
    SET
        id_tecnico = p_id_tecnico,
        fecha_hora_asistencia = p_fecha_hora_asistencia,
        id_tipo_soporte = p_id_tipo_soporte,
        prioridad = p_prioridad,
        soporte = p_soporte,
        update_at = NOW(),
        iduser_update = p_iduser_update,
        descripcion_solucion = p_procedimiento_S
    WHERE id_soporte = p_id_soporte;
END $$

DROP PROCEDURE IF EXISTS spu_soporte_filtrar_prioridad$$

CREATE PROCEDURE spu_soporte_filtrar_prioridad(
    IN p_prioridad VARCHAR(50)
)
BEGIN
    SELECT 
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia,
        s.id_soporte,
        s.prioridad,
        s.soporte,
        s.descripcion_problema,
        s.descripcion_solucion,
        ts.tipo_soporte,
        c.id_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN CONCAT(p_cliente.nombres, ' ', p_cliente.apellidos)
            WHEN cl.id_empresa IS NOT NULL THEN e.razon_social
        END AS nombre_cliente,
        c.direccion_servicio,
        r.id_usuario AS id_tecnico,
        CONCAT(p_tecnico.nombres, ' ', p_tecnico.apellidos) AS nombre_tecnico
    FROM 
        tb_soporte s
    LEFT JOIN 
        tb_contratos c ON s.id_contrato = c.id_contrato
    LEFT JOIN 
        tb_tipo_soporte ts ON s.id_tipo_soporte = ts.id_tipo_soporte
    LEFT JOIN 
        tb_responsables r ON s.id_tecnico = r.id_responsable
    LEFT JOIN 
        tb_usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN 
        tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
    LEFT JOIN 
        tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN 
        tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona 
    LEFT JOIN 
        tb_empresas e ON cl.id_empresa = e.id_empresa 
    WHERE 
        (p_prioridad IS NULL OR TRIM(p_prioridad) = '' OR LOWER(TRIM(s.prioridad)) = LOWER(TRIM(p_prioridad)))
        AND LOWER(TRIM(s.prioridad)) != 'completo' OR LOWER(TRIM(s.prioridad)) != 'incidencia'
    ORDER BY 
        DATE(s.fecha_hora_asistencia) ASC,
        CASE 
            WHEN LOWER(TRIM(s.prioridad)) = 'Alta' THEN 1
            WHEN LOWER(TRIM(s.prioridad)) = 'Media' THEN 2
            WHEN LOWER(TRIM(s.prioridad)) = 'Baja' THEN 3
            ELSE 4
        END;
END;