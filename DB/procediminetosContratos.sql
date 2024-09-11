DELIMITER $$

CREATE PROCEDURE spu_contratos_registrar(
    IN p_id_cliente INT,
    IN p_id_paquete INT,
    IN p_id_sector INT,
    IN p_id_usuario_registro INT,
    IN p_direccion_servicio VARCHAR(200),
    IN p_referencia VARCHAR(200),
    IN p_coordenada VARCHAR(25),
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_fecha_registro DATE,
    IN p_ficha_instalacion JSON,
    IN p_nota TEXT
)
BEGIN
    INSERT INTO tb_contratos (
        id_cliente,
        id_paquete,
        id_sector,
        id_usuario_registro,
        direccion_servicio,
        referencia,
        coordenada,
        fecha_inicio,
        fecha_fin,
        fecha_registro,
        ficha_instalacion,
        nota
    ) VALUES (
        p_id_cliente,
        p_id_paquete,
        p_id_sector,
        p_id_usuario_registro,
        p_direccion_servicio,
        p_referencia,
        p_coordenada,
        p_fecha_inicio,
        p_fecha_fin,
        p_fecha_registro,
        p_ficha_instalacion,
        p_nota
    );
END $$

CREATE PROCEDURE spu_contratos_listar()
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
        s.sector AS nombre_sector,
        ur_persona.nombres AS nombre_usuario_registro,
        ut_persona.nombres AS nombre_usuario_tecnico,
        c.direccion_servicio,
        sv.servicio,
        c.referencia,
        c.coordenada,
        c.fecha_inicio,
        c.fecha_fin,
        c.fecha_registro,
        c.ficha_instalacion,
        c.nota
    FROM 
        tb_contratos c
    INNER JOIN 
        tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN 
        tb_personas p ON cl.id_cliente = p.id_persona
    LEFT JOIN 
        tb_empresas e ON cl.id_cliente = e.id_empresa
    INNER JOIN 
        tb_paquetes t ON c.id_paquete = t.id_paquete
    INNER JOIN 
        tb_servicios sv ON t.id_servicio = sv.id_servicio -- Nuevo JOIN para obtener el nombre del servicio
    INNER JOIN 
        tb_sectores s ON c.id_sector = s.id_sector
    INNER JOIN 
        tb_responsables ur ON c.id_usuario_registro = ur.id_responsable
    INNER JOIN 
        tb_usuarios ur_usuario ON ur.id_usuario = ur_usuario.id_usuario
    INNER JOIN 
        tb_personas ur_persona ON ur_usuario.id_persona = ur_persona.id_persona
    LEFT JOIN 
        tb_responsables ut ON c.id_usuario_tecnico = ut.id_responsable
    LEFT JOIN 
        tb_usuarios ut_usuario ON ut.id_usuario = ut_usuario.id_usuario
    LEFT JOIN 
        tb_personas ut_persona ON ut_usuario.id_persona = ut_persona.id_persona
    WHERE 
        c.inactive_at IS NULL;
END $$