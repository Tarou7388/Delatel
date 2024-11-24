USE Delatel;

DROP VIEW IF EXISTS vw_fichainstalacion_filtrar;

CREATE VIEW vw_fichainstalacion_filtrar AS
SELECT
    c.id_contrato,
    CASE
        WHEN cl.id_persona IS NOT NULL THEN p.nombres
        ELSE e.razon_social
    END AS nombre_cliente,
    c.direccion_servicio,
    GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
    GROUP_CONCAT(sv.servicio) AS servicios,
    DATE(c.create_at) as fecha_creacion
FROM
    tb_contratos c
    INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN tb_empresas e ON cl.id_cliente = e.id_empresa
    INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
    INNER JOIN tb_servicios sv ON JSON_CONTAINS(
        t.id_servicio,
        CONCAT(
            '{"id_servicio":',
            sv.id_servicio,
            '}'
        )
    )
WHERE
    c.inactive_at IS NULL
    AND c.ficha_instalacion IS NULL
GROUP BY
    c.id_contrato,
    nombre_cliente,
    c.direccion_servicio,
    c.create_at
ORDER BY c.create_at ASC;

DROP VIEW IF EXISTS vw_contratos_listar;

CREATE VIEW vw_contratos_listar AS
SELECT
    c.id_contrato,
    CASE
        WHEN cl.id_persona IS NOT NULL THEN CONCAT(p.apellidos, ', ', p.nombres)
        ELSE e.razon_social
    END AS nombre_cliente,
    CASE
        WHEN cl.id_persona IS NOT NULL THEN p.nro_doc
        ELSE e.ruc
    END AS num_identificacion,
    c.direccion_servicio,
    t.paquete,
    t.precio,
    GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio
FROM
    tb_contratos c
    INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN tb_empresas e ON cl.id_cliente = e.id_empresa
    INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
    INNER JOIN tb_servicios sv ON JSON_CONTAINS(
        t.id_servicio,
        JSON_OBJECT('id_servicio', sv.id_servicio)
    )
WHERE
    c.inactive_at IS NULL
GROUP BY
    c.id_contrato,
    nombre_cliente,
    num_identificacion,
    c.direccion_servicio,
    t.paquete,
    t.precio
ORDER BY c.id_contrato DESC;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_contratos_registrar$$

CREATE PROCEDURE spu_contratos_registrar(
    IN p_id_cliente INT,
    IN p_id_paquete INT,
    IN p_id_sector INT,
    IN p_direccion_servicio VARCHAR(200),
    IN p_referencia VARCHAR(200),
    IN p_coordenada VARCHAR(50),
    IN p_fecha_inicio DATE,
    IN p_fecha_registro DATE,
    IN p_nota TEXT,
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_contratos (
        id_cliente,
        id_paquete,
        id_sector,
        direccion_servicio,
        referencia,
        coordenada,
        fecha_inicio,
        fecha_registro,
        nota,
        id_usuario_registro
    ) VALUES (
        p_id_cliente,
        p_id_paquete,
        p_id_sector,
        p_direccion_servicio,
        p_referencia,
        p_coordenada,
        p_fecha_inicio,
        p_fecha_registro,
        p_nota,
        p_iduser_create
    );
END $$

DROP PROCEDURE IF EXISTS spu_fichatecnica_buscar_id$$

CREATE PROCEDURE spu_fichatecnica_buscar_id(
    p_id_contrato INT
)
BEGIN
    SELECT
        c.id_contrato,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN CONCAT(p.nombres, ', ', p.apellidos)
            ELSE e.razon_social
        END AS nombre_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nro_doc
            ELSE e.ruc
        END AS num_identificacion,
        t.paquete,
        GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
        c.ficha_instalacion,
        t.precio
    FROM
        tb_contratos c
        INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
        LEFT JOIN tb_empresas e ON cl.id_cliente = e.id_empresa
        INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
        LEFT JOIN tb_servicios sv ON JSON_CONTAINS(t.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
    WHERE c.id_contrato = p_id_contrato AND c.inactive_at IS NULL;
END $$

DROP PROCEDURE IF EXISTS spu_contrato_buscar_id$$

CREATE PROCEDURE spu_contrato_buscar_id(
    p_id_contrato INT
)
BEGIN
    SELECT
        c.id_contrato,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nombres
            ELSE e.razon_social
        END AS nombre_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nro_doc
            ELSE e.ruc
        END AS num_identificacion,
        s.id_sector,
        s.sector AS nombre_sector,
        ur_persona.nombres AS nombre_usuario_registro,
        ut_persona.nombres AS nombre_usuario_tecnico,
        c.direccion_servicio,
        CONCAT('{"id_servicio": [', GROUP_CONCAT(sv.id_servicio), ']}') AS id_servicio,
        GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
        t.id_paquete,
        t.paquete,
        t.precio,
        c.referencia,
        c.coordenada,
        c.fecha_inicio,
        c.fecha_registro,
        c.nota
    FROM
        tb_contratos c
        INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
        LEFT JOIN tb_empresas e ON cl.id_cliente = e.id_empresa
        INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
        LEFT JOIN tb_servicios sv ON JSON_CONTAINS(t.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
        INNER JOIN tb_sectores s ON c.id_sector = s.id_sector
        INNER JOIN tb_responsables ur ON c.id_usuario_registro = ur.id_responsable
        INNER JOIN tb_usuarios ur_usuario ON ur.id_usuario = ur_usuario.id_usuario
        INNER JOIN tb_personas ur_persona ON ur_usuario.id_persona = ur_persona.id_persona
        LEFT JOIN tb_responsables ut ON c.id_usuario_tecnico = ut.id_responsable
        LEFT JOIN tb_usuarios ut_usuario ON ut.id_usuario = ut_usuario.id_usuario
        LEFT JOIN tb_personas ut_persona ON ut_usuario.id_persona = ut_persona.id_persona
    WHERE
        c.id_contrato = p_id_contrato AND c.inactive_at IS NULL
    GROUP BY
        c.id_contrato;
END $$

DROP PROCEDURE IF EXISTS spu_contratos_eliminar$$

CREATE PROCEDURE spu_contratos_eliminar(
    p_id_contrato INT,
    p_iduser_inactive INT
)
BEGIN
    UPDATE 
    tb_contratos 
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE 
        id_contrato = p_id_contrato;
END $$

DROP PROCEDURE IF EXISTS spu_ficha_tecnica_registrar$$

CREATE PROCEDURE spu_ficha_tecnica_registrar(
    p_id_contrato INT,
    p_ficha_instalacion JSON,
    p_id_usuario_registro INT
)
BEGIN
    UPDATE 
    tb_contratos 
    SET ficha_instalacion = p_ficha_instalacion,
    id_usuario_registro = p_id_usuario_registro
    WHERE id_contrato = p_id_contrato;
END $$

DROP PROCEDURE IF EXISTS spu_contratos_buscar_cliente$$

CREATE PROCEDURE spu_contratos_buscar_cliente(IN p_id_cliente INT)
BEGIN
    SELECT 
        c.id_contrato, 
        GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
        s.sector, 
        p.paquete,
        c.id_usuario_registro,
        c.referencia,
        c.fecha_inicio,
        c.nota,
        c.direccion_servicio,
        c.nota
    FROM 
        tb_contratos c
    JOIN 
        tb_paquetes p ON c.id_paquete = p.id_paquete
    JOIN 
        tb_sectores s ON c.id_sector = s.id_sector
    LEFT JOIN tb_servicios sv ON JSON_CONTAINS(p.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
    WHERE 
        c.id_cliente = p_id_cliente AND c.inactive_at IS NULL
    GROUP BY
        c.id_contrato,
        s.sector,
        p.paquete,
        c.id_usuario_registro,
        c.referencia,
        c.fecha_inicio,
        c.nota,
        c.direccion_servicio;
END$$

DROP PROCEDURE IF EXISTS spu_contratos_actualizar$$

CREATE PROCEDURE spu_contratos_actualizar(
    IN p_id_contrato INT,
    IN p_id_paquete INT,
    IN p_direccion_servicio VARCHAR(200),
    IN p_referencia VARCHAR(200),
    IN p_coordenada VARCHAR(25),
    IN p_nota TEXT,
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_contratos
    SET
        id_paquete = p_id_paquete,
        direccion_servicio = p_direccion_servicio,
        referencia = p_referencia,
        coordenada = p_coordenada,
        nota = p_nota,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_contrato = p_id_contrato;
END $$

DROP PROCEDURE IF EXISTS spu_contratos_pdf$$

CREATE PROCEDURE spu_contratos_pdf(IN p_id_contrato INT)
BEGIN
    SELECT 
        cl.id_cliente AS IdCliente,
        IFNULL(CONCAT(p.nombres, ' ', p.apellidos), e.razon_social) AS NombreCliente,
        IFNULL(p.nro_doc, e.ruc) AS NumeroDocumento,
        IFNULL(p.email, e.email) AS Correo,
        IFNULL(p.telefono, e.telefono) AS Telefono,
        cl.direccion AS DireccionPersona,
        co.direccion_servicio AS DireccionContrato,
        CASE 
            WHEN e.ruc IS NOT NULL THEN 'Empresa Peruana'
            WHEN LENGTH(p.nro_doc) = 8 THEN 'Peruano'
            ELSE 'Extranjero'
        END AS Nacionalidad,
        IFNULL(e.representante_legal, '') AS RepresentanteLegal,
        pa.paquete AS NombrePaquete,
        pa.precio AS PrecioPaquete,
        pa.velocidad AS VelocidadPaquete,
        co.nota,
        co.create_at AS FechaCreacion
    FROM 
        tb_contratos co
    JOIN 
        tb_clientes cl ON co.id_cliente = cl.id_cliente
    LEFT JOIN 
        tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN 
        tb_empresas e ON cl.id_empresa = e.id_empresa
    LEFT JOIN 
        tb_paquetes pa ON co.id_paquete = pa.id_paquete
    WHERE 
        co.id_contrato = p_id_contrato;
END$$

DELIMITER;