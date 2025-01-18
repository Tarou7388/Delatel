USE Delatel;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_averias_contratos_listar$$

CREATE PROCEDURE spu_averias_contratos_listar(IN p_id_contrato INT)
BEGIN
    SELECT 
        s.id_soporte,
        CONCAT(p.nombres, ' ', p.apellidos) AS nombre_tecnico,
        s.soporte,
        s.descripcion_solucion,
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia
    FROM 
        tb_soporte s
    JOIN 
        tb_responsables r ON s.id_tecnico = r.id_responsable
    JOIN 
        tb_usuarios u ON r.id_usuario = u.id_usuario
    JOIN 
        tb_personas p ON u.id_persona = p.id_persona
    WHERE 
        s.id_contrato = p_id_contrato;
END$$

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_soporte_pdf$$

CREATE PROCEDURE spu_soporte_pdf(IN p_id_soporte INT)
BEGIN
    SELECT 
        s.id_soporte,
        s.id_contrato,
        pa.paquete,
        cl.id_cliente AS IdCliente,
        IFNULL(CONCAT(p.nombres, ' ', p.apellidos), e.razon_social) AS NombreCliente,
        IFNULL(p.nro_doc, e.ruc) AS NumeroDocumento,
        IFNULL(p.email, e.email) AS Correo,
        IFNULL(p.telefono, e.telefono) AS Telefono,
        cl.direccion AS DireccionPersona,
        se.sector AS SectorCliente, 
        s.id_tecnico,
        CONCAT(pt.nombres, ' ', pt.apellidos) AS NombreTecnico,
        s.descripcion_problema,
        s.descripcion_solucion,
        s.estaCompleto,
        s.prioridad,
        s.create_at,
        s.soporte AS FichaAveria
    FROM 
        tb_soporte s
    JOIN 
        tb_contratos co ON s.id_contrato = co.id_contrato
    JOIN 
        tb_clientes cl ON co.id_cliente = cl.id_cliente
    LEFT JOIN 
        tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN 
        tb_empresas e ON cl.id_empresa = e.id_empresa
    LEFT JOIN 
        tb_responsables r ON s.id_tecnico = r.id_responsable
    LEFT JOIN 
        tb_personas pt ON r.id_usuario = pt.id_persona
    LEFT JOIN 
        tb_paquetes pa ON co.id_paquete = pa.id_paquete
    LEFT JOIN 
        tb_sectores se ON co.id_sector = se.id_sector 
    WHERE 
        s.id_soporte = p_id_soporte;
END$$

DELIMITER;