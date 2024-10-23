USE Delatel;

DROP VIEW IF EXISTS vw_incidencias;
CREATE VIEW vw_incidencias AS
SELECT 
    i.id_incidencia,
    CASE 
        WHEN p.nombres IS NOT NULL THEN CONCAT(p.apellidos, ', ', p.nombres)
        WHEN e.razon_social IS NOT NULL THEN e.razon_social
    END AS nombre_cliente,
    CONCAT(t_persona.apellidos, ', ', t_persona.nombres) AS nombre_tecnico,
    i.descripcion,
    i.solucion
FROM 
    tb_incidencias i
LEFT JOIN 
    tb_clientes c ON i.id_cliente = c.id_cliente
LEFT JOIN 
    tb_personas p ON c.id_persona = p.id_persona
LEFT JOIN 
    tb_empresas e ON c.id_empresa = e.id_empresa
LEFT JOIN 
    tb_responsables r ON i.id_tecnico = r.id_responsable
LEFT JOIN 
    tb_usuarios u ON r.id_usuario = u.id_usuario
LEFT JOIN 
    tb_personas t_persona ON u.id_persona = t_persona.id_persona;


DELIMITER $$
DROP PROCEDURE IF EXISTS spu_incidencia_registrar$$
CREATE PROCEDURE spu_incidencia_registrar (
    IN p_id_cliente INT,
    IN p_fecha_incidencia DATETIME,
    IN p_descripcion TEXT,
    IN p_solucion VARCHAR(50),
    IN p_id_tecnico INT,
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_incidencias (id_cliente, fecha_incidencia, descripcion, solucion, id_tecnico, create_at, iduser_create)
    VALUES (p_id_cliente, NOW(), p_descripcion, p_solucion, p_id_tecnico, NOW(), p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS spu_incidencia_actualizar;
CREATE PROCEDURE spu_incidencia_actualizar (
    IN p_id_incidencia INT,
    IN p_descripcion TEXT,
    IN p_solucion VARCHAR(50),
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_incidencias
    SET descripcion = p_descripcion,
        solucion = p_solucion,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_incidencia = p_id_incidencia;
END$$

DROP PROCEDURE IF EXISTS sp_eliminar_incidencia$$
CREATE PROCEDURE sp_eliminar_incidencia (
    IN p_id_incidencia INT,
    IN p_iduser_inactive INT
)
BEGIN
    UPDATE tb_incidencias
    SET inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_incidencia = p_id_incidencia;
END$$
