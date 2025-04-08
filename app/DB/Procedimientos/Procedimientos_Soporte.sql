USE Delatel;

DROP VIEW IF EXISTS vw_soporte_detalle;

CREATE VIEW vw_soporte_detalle AS
SELECT
    s.id_soporte,
    c.coordenada,
    s.id_contrato,
    c.id_sector,
    sct.sector,
    s.fecha_hora_solicitud,
    s.fecha_hora_asistencia,
    s.prioridad,
    s.soporte,
    s.descripcion_problema,
    s.descripcion_solucion,
    COALESCE(p_cliente.nro_doc, emp.ruc) AS nro_doc,
    c.id_cliente,
    c.direccion_servicio,
    r.id_usuario AS id_tecnico,
    p_tecnico.nombres AS tecnico_nombres,
    p_tecnico.apellidos AS tecnico_apellidos,
    pk.id_paquete,
    pk.id_servicio
FROM
    tb_soporte s
    LEFT JOIN tb_contratos c ON s.id_contrato = c.id_contrato
    INNER JOIN tb_sectores sct ON c.id_sector = sct.id_sector
    LEFT JOIN tb_responsables r ON s.id_tecnico = r.id_responsable
    LEFT JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
    LEFT JOIN tb_paquetes pk ON c.id_paquete = pk.id_paquete
    LEFT JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN tb_empresas emp ON cl.id_empresa = emp.id_empresa
    LEFT JOIN tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona;

DELIMITER $$

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_registrar_fichasoporte;

CREATE PROCEDURE spu_registrar_fichasoporte(
    IN p_id_contrato INT,
    IN p_id_tecnico INT,
    IN p_fecha_hora_solicitud DATETIME,
    IN p_descripcion_problema TEXT,
    IN p_descripcion_solucion TEXT,
    IN p_prioridad VARCHAR(50),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_soporte (
        id_contrato,
        id_tecnico,
        fecha_hora_solicitud,
        descripcion_problema,
        descripcion_solucion,
        prioridad,
        create_at,
        iduser_create
    )
    VALUES (
        p_id_contrato,
        CASE 
            WHEN p_id_tecnico = 0 THEN NULL 
            ELSE p_id_tecnico 
        END,
        p_fecha_hora_solicitud,
        p_descripcion_problema,
        CASE 
            WHEN p_descripcion_solucion = '' THEN NULL 
            ELSE p_descripcion_solucion 
        END,
        p_prioridad,
        NOW(),
        p_iduser_create
    );
END $$

DROP PROCEDURE IF EXISTS spu_soporte_actualizar;

CREATE PROCEDURE spu_soporte_actualizar(
    IN p_id_soporte INT,
    IN p_id_tecnico INT,
    IN p_fecha_hora_asistencia DATETIME,
    IN p_soporte JSON,
    IN p_iduser_update INT,
    IN p_procedimiento_S TEXT
)
BEGIN
    UPDATE tb_soporte
    SET
        id_tecnico = p_id_tecnico,
        fecha_hora_asistencia = p_fecha_hora_asistencia,
        soporte = p_soporte,
        update_at = NOW(),
        iduser_update = p_iduser_update,
        descripcion_solucion = p_procedimiento_S
    WHERE id_soporte = p_id_soporte;
END $$

DROP PROCEDURE IF EXISTS spu_soporte_filtrar_prioridad;

CREATE PROCEDURE spu_soporte_filtrar_prioridad (
    IN p_prioridad VARCHAR(50)
)
BEGIN
    SELECT
        s.id_soporte,
        c.coordenada,
        c.id_sector,
        sct.sector,
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia,
        c.direccion_servicio,
        s.prioridad,
        s.soporte,
        s.descripcion_problema,
        s.descripcion_solucion,
        c.id_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN CONCAT(p_cliente.nombres, ' ', p_cliente.apellidos)
            WHEN cl.id_empresa IS NOT NULL THEN e.razon_social
        END AS nombre_cliente,
        c.direccion_servicio,
        r.id_usuario AS id_tecnico,
        CONCAT(p_tecnico.nombres, ' ', p_tecnico.apellidos) AS nombre_tecnico,
        GROUP_CONCAT(DISTINCT srv.tipo_servicio) AS tipos_servicio,
        GROUP_CONCAT(DISTINCT srv.servicio) AS servicios
    FROM
        tb_soporte s
        LEFT JOIN tb_contratos c ON s.id_contrato = c.id_contrato
        INNER JOIN tb_sectores sct ON c.id_sector = sct.id_sector
        LEFT JOIN tb_responsables r ON s.id_tecnico = r.id_responsable
        LEFT JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
        LEFT JOIN tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
        LEFT JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona
        LEFT JOIN tb_empresas e ON cl.id_empresa = e.id_empresa
        INNER JOIN tb_paquetes p ON c.id_paquete = p.id_paquete
        INNER JOIN tb_servicios srv ON JSON_CONTAINS(
            p.id_servicio,
            CONCAT(
                '{"id_servicio":',
                srv.id_servicio,
                '}'
            )
        )
    WHERE
        c.inactive_at IS NULL
        AND s.estaCompleto != 1
        AND (p_prioridad = "" OR s.prioridad = p_prioridad)
        AND s.inactive_at IS NULL
    GROUP BY
        s.id_soporte;
END $$

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_instalacion_ficha_IdSoporte$$

CREATE PROCEDURE spu_instalacion_ficha_IdSoporte(
    IN p_idsoporte INT
)
BEGIN
    SELECT 
        ct.ficha_instalacion,
        ct.id_contrato,
        GROUP_CONCAT(srv.tipo_servicio) AS tipos_servicio,
        GROUP_CONCAT(srv.servicio) AS servicios,
        ct.id_paquete,
        ct.id_sector
    FROM tb_soporte s
    INNER JOIN tb_contratos ct ON s.id_contrato = ct.id_contrato
    INNER JOIN tb_clientes cl ON ct.id_cliente = cl.id_cliente
    INNER JOIN tb_paquetes p ON ct.id_paquete = p.id_paquete
    INNER JOIN tb_servicios srv ON JSON_CONTAINS(
        p.id_servicio,
        CONCAT(
        '{"id_servicio":',
        srv.id_servicio,
        '}'
        )
    )
    WHERE 
        s.id_soporte = p_idsoporte
    GROUP BY ct.id_contrato, ct.create_at;
END $$

DROP VIEW IF EXISTS vw_soporte_fichadatos$$

CREATE VIEW vw_soporte_fichadatos AS
SELECT p.nro_doc, s.id_soporte, s.soporte, s.descripcion_problema, s.descripcion_solucion, s.update_at, sv.tipo_servicio, c.coordenada, sv.servicio, c.id_paquete, c.id_sector
FROM
    tb_soporte s
    INNER JOIN tb_contratos c ON s.id_contrato = c.id_contrato
    INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    INNER JOIN tb_personas p ON cl.id_persona = p.id_persona
    INNER JOIN tb_paquetes pk ON c.id_paquete = pk.id_paquete
    INNER JOIN tb_servicios sv ON JSON_CONTAINS(
        pk.id_servicio,
        CONCAT(
            '{"id_servicio":',
            sv.id_servicio,
            '}'
        )
    );

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_buscar_ficha_por_dni$$

CREATE PROCEDURE spu_buscar_ficha_por_dni (
    IN p_dni VARCHAR(20),
    IN p_servicio VARCHAR(10),
    IN p_coordenada VARCHAR(50)
)
BEGIN
    DECLARE resultado_count INT;

    SELECT COUNT(*) INTO resultado_count
    FROM vw_soporte_fichadatos
    WHERE nro_doc = p_dni
      AND tipo_servicio = p_servicio;
    
    IF resultado_count > 1 THEN
        SELECT * 
        FROM vw_soporte_fichadatos
        WHERE nro_doc = p_dni
          AND tipo_servicio = p_servicio
          AND coordenada = p_coordenada
        ORDER BY update_at DESC;
    ELSE
        SELECT * 
        FROM vw_soporte_fichadatos
        WHERE nro_doc = p_dni
          AND tipo_servicio = p_servicio
        ORDER BY update_at DESC;
    END IF;
END $$
DROP PROCEDURE IF EXISTS spu_soporte_eliminarbyId$$

CREATE PROCEDURE spu_soporte_eliminarbyId (
    IN p_id_soporte INT,
    IN p_iduser_inactive INT 
)
BEGIN
    UPDATE tb_soporte
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_soporte = p_id_soporte;
END $$

DROP PROCEDURE IF EXISTS spu_soporte_CompletarbyId$$

CREATE PROCEDURE spu_soporte_CompletarbyId (
    IN p_id_soporte INT,
    IN p_iduser_update INT 
)
BEGIN
    UPDATE tb_soporte
    SET
        estaCompleto = 1,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_soporte = p_id_soporte;
END $$

DROP VIEW IF EXISTS vw_averias_listar_ficha_null$$

CREATE VIEW vw_averias_listar_ficha_null AS
SELECT
    s.id_soporte,
    s.id_contrato,
    CONCAT(p.nombres, ' ', p.apellidos) AS nombre_cliente,
    s.descripcion_problema,
    s.create_at AS fecha_creacion,
    sec.sector AS sector_cliente,
    sv.tipo_servicio,
    c.coordenada,
    COALESCE(p.nro_doc, e.ruc) AS nrodocumento,
    s.prioridad,
    p.telefono
FROM
    tb_soporte s
    JOIN tb_contratos c ON s.id_contrato = c.id_contrato
    JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN tb_empresas e ON cl.id_empresa = e.id_empresa
    JOIN tb_sectores sec ON c.id_sector = sec.id_sector
    JOIN tb_paquetes pk ON c.id_paquete = pk.id_paquete
    JOIN tb_servicios sv ON JSON_CONTAINS(
        pk.id_servicio,
        CONCAT(
            '{"id_servicio":',
            sv.id_servicio,
            '}'
        )
    )
WHERE
    s.estaCompleto = 0
    AND s.inactive_at IS NULL$$

DROP VIEW IF EXISTS vw_averias_contar_ficha_vacia$$

CREATE VIEW vw_averias_contar_ficha_vacia AS
SELECT COUNT(*) AS total_averias_ficha_vacia
FROM tb_soporte
WHERE
    estaCompleto = 0
    AND inactive_at IS NULL$$

DELIMITER $$

DROP PROCEDURE IF EXISTS ObtenerHistorialSoporte$$

CREATE PROCEDURE ObtenerHistorialSoporte(IN docCliente VARCHAR(20))
BEGIN
    SELECT 
        s.id_soporte,
        s.id_contrato,
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia,
        s.prioridad,
        s.soporte,
        s.descripcion_problema,
        s.descripcion_solucion,
        s.create_at,
        s.update_at,
        s.inactive_at,
        s.iduser_create,
        s.iduser_update,
        s.iduser_inactive,
        c.coordenada,
        c.id_sector,
        sct.sector,
        c.direccion_servicio,
        r.id_usuario AS id_tecnico,
        p_tecnico.nombres AS tecnico_nombres,
        p_tecnico.apellidos AS tecnico_apellidos,
        pk.id_paquete,
        pk.id_servicio,
        COALESCE(p_cliente.nro_doc, emp.ruc) AS nro_doc,
        c.id_cliente
    FROM 
        tb_soporte s
        LEFT JOIN tb_contratos c ON s.id_contrato = c.id_contrato
        INNER JOIN tb_sectores sct ON c.id_sector = sct.id_sector
        LEFT JOIN tb_responsables r ON s.id_tecnico = r.id_responsable
        LEFT JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
        LEFT JOIN tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
        LEFT JOIN tb_paquetes pk ON c.id_paquete = pk.id_paquete
        LEFT JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_empresas emp ON cl.id_empresa = emp.id_empresa
        LEFT JOIN tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona
    WHERE 
        COALESCE(p_cliente.nro_doc, emp.ruc) = docCliente;
END$$

DELIMITER;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_ultimoSoporte_idcontrato$$

CREATE PROCEDURE spu_ultimoSoporte_idcontrato(IN p_id_contrato INT)
BEGIN
    SELECT 
        c.id_contrato,
        s.id_soporte,
        s.soporte,
        s.create_at,
        s.update_at
    FROM 
        tb_soporte s
        INNER JOIN tb_contratos c ON s.id_contrato = c.id_contrato    
    WHERE 
        c.id_contrato = 672
        AND s.inactive_at IS NULL
    ORDER BY 
        s.update_at DESC
    LIMIT 1;
END$$