USE Delatel;

DROP PROCEDURE IF EXISTS spu_averias_contratos_listar;

CREATE PROCEDURE spu_averias_contratos_listar(IN p_id_contrato INT)
BEGIN
    SELECT 
        s.id_soporte,
        ts.tipo_soporte,
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
    JOIN 
        tb_tipo_soporte ts ON s.id_tipo_soporte = ts.id_tipo_soporte
    WHERE 
        s.id_contrato = p_id_contrato;
END;
