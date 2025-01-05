USE Delatel;

DROP VIEW IF EXISTS vw_tiposoporte_listar;

CREATE VIEW vw_tiposoporte_listar AS
SELECT
    t.id_tipo_soporte,
    t.tipo_soporte,
    t.create_at,
    t.update_at,
    t.inactive_at,
    t.iduser_create,
    u1.nombre_user AS usuario_creador,
    t.iduser_update,
    u2.nombre_user AS usuario_modificador,
    t.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_tipo_soporte t
    LEFT JOIN tb_usuarios u1 ON t.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON t.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON t.iduser_inactive = u3.id_usuario;

DROP VIEW IF EXISTS vw_contratos_listar_ficha_null;

CREATE VIEW vw_contratos_listar_ficha_null AS
SELECT
    c.id_contrato,
    CONCAT(p.apellidos, ' ', p.nombres) AS nombre_cliente,
    p2.paquete AS nombre_paquete,
    s.sector AS nombre_sector,
    CONCAT(rp.apellidos, ' ', rp.nombres) AS nombre_tecnico_registro,
    c.direccion_servicio,
    c.referencia,
    c.ficha_instalacion,
    c.coordenada,
    c.fecha_inicio,
    c.fecha_registro,
    c.fecha_fin,
    c.nota,
    c.create_at,
    c.update_at,
    c.inactive_at,
    c.iduser_update,
    c.iduser_inactive
FROM
    tb_contratos c
    JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    JOIN tb_personas p ON cl.id_persona = p.id_persona
    JOIN tb_paquetes p2 ON c.id_paquete = p2.id_paquete
    JOIN tb_sectores s ON c.id_sector = s.id_sector
    JOIN tb_responsables r ON c.id_usuario_registro = r.id_responsable
    JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
    JOIN tb_personas rp ON u.id_persona = rp.id_persona
WHERE
    c.ficha_instalacion IS NULL
    AND c.inactive_at IS NULL
ORDER BY c.id_contrato DESC;

DROP VIEW IF EXISTS vw_contratos_contar_ficha_vacia;

CREATE VIEW vw_contratos_contar_ficha_vacia AS
SELECT COUNT(*) AS total_contratos_ficha_vacia
FROM tb_contratos
WHERE
    ficha_instalacion IS NULL
    AND inactive_at IS NULL;

DROP VIEW IF EXISTS vw_clientes_contar_con_ficha_llena;

CREATE VIEW vw_clientes_contar_con_ficha_llena AS
SELECT
    COUNT(DISTINCT c.id_cliente) AS total_clientes_con_ficha_llena
FROM tb_contratos c
WHERE
    c.ficha_instalacion IS NOT NULL
    AND c.inactive_at IS NULL;

DROP VIEW IF EXISTS vw_averias_listar_ficha_null;

CREATE VIEW vw_averias_listar_ficha_null AS
SELECT
    s.id_soporte,
    s.id_contrato,
    CONCAT(p.nombres, ' ', p.apellidos) AS nombre_cliente,
    s.descripcion_problema,
    s.create_at AS fecha_creacion,
    sec.sector AS sector_cliente
FROM
    tb_soporte s
    JOIN tb_contratos c ON s.id_contrato = c.id_contrato
    JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN tb_empresas e ON cl.id_empresa = e.id_empresa
    JOIN tb_sectores sec ON c.id_sector = sec.id_sector
WHERE
    s.estaCompleto = 0
    AND s.inactive_at IS NULL;

DROP VIEW IF EXISTS vw_averias_contar_ficha_vacia;

CREATE VIEW vw_averias_contar_ficha_vacia AS
SELECT COUNT(*) AS total_averias_ficha_vacia
FROM tb_soporte
WHERE
    estaCompleto = 0
    AND inactive_at IS NULL;