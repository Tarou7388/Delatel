USE Delatel; 

CREATE VIEW vw_tipo_soporte_listar AS
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

CREATE VIEW vw_servicios_listar AS
SELECT
    s.id_servicio,
    s.servicio,
    s.create_at,
    s.update_at,
    s.inactive_at,
    s.iduser_create,
    u1.nombre_user AS usuario_creador,
    s.iduser_update,
    u2.nombre_user AS usuario_modificador,
    s.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_servicios s
    LEFT JOIN tb_usuarios u1 ON s.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON s.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON s.iduser_inactive = u3.id_usuario;

CREATE VIEW vw_paquetes_listar AS
SELECT
    p.id_paquete,
    p.id_servicio,
    s.servicio AS nombre_servicio,
    p.precio,
    p.fecha_inicio,
    p.fecha_fin,
    p.create_at,
    p.update_at,
    p.inactive_at,
    p.iduser_create,
    u1.nombre_user AS usuario_creador,
    p.iduser_update,
    u2.nombre_user AS usuario_modificador,
    p.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_paquetes p
    LEFT JOIN tb_servicios s ON p.id_servicio = s.id_servicio
    LEFT JOIN tb_usuarios u1 ON p.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON p.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON p.iduser_inactive = u3.id_usuario;

CREATE VIEW vw_roles_listar AS
SELECT
    r.id_rol,
    r.rol,
    r.permisos,
    r.create_at,
    r.update_at,
    r.inactive_at,
    r.iduser_create,
    u1.nombre_user AS usuario_creador,
    r.iduser_update,
    u2.nombre_user AS usuario_modificador,
    r.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_roles r
    LEFT JOIN tb_usuarios u1 ON r.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON r.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON r.iduser_inactive = u3.id_usuario;

CREATE VIEW vw_sectores_listar AS
SELECT
    s.id_sector,
    s.sector,
    s.id_distrito,
    d.distrito AS nombre_distrito,
    s.create_at,
    s.update_at,
    s.inactive_at,
    s.iduser_create,
    u1.nombre_user AS usuario_creador,
    s.iduser_update,
    u2.nombre_user AS usuario_modificador,
    s.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
    tb_sectores s
    LEFT JOIN tb_distritos d ON s.id_distrito = d.id_distrito
    LEFT JOIN tb_usuarios u1 ON s.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON s.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON s.iduser_inactive = u3.id_usuario;

CREATE VIEW vw_listar_sectores AS
SELECT id_sector, sector
FROM tb_sectores;

CREATE VIEW view_paquetes_info AS
SELECT
    s.servicio AS nombre,
    p.id_paquete AS id,
    p.precio AS precio,
    p.tipo_paquete AS tipo_paquete
FROM tb_paquetes p
    JOIN tb_servicios s ON p.id_servicio = s.id_servicio;

CREATE VIEW vw_contactabilidad_listar AS 
SELECT 
	c.id_contactabilidad,
    CONCAT(p.nombres, ' ',p.apellidos) AS nombre_contacto,
    p.telefono,
    p.email,
    pk.tipo_paquete,
    pk.precio,
    c.create_at AS fecha_hora_contacto,
    c.direccion_servicio,
    c.nota,
    c.fecha_limite,
    u1.nombre_user AS usuario_creador,
    c.iduser_update,
    u2.nombre_user AS usuario_modificador,
    c.iduser_inactive,
    u3.nombre_user AS usuario_inactivador
FROM
	tb_contactabilidad c
JOIN 
	tb_personas p ON c.id_persona = p.id_persona
JOIN
	tb_paquetes pk ON c.id_paquete = pk.id_paquete
LEFT JOIN 
    tb_usuarios u1 ON c.iduser_create = u1.id_usuario
LEFT JOIN 
    tb_usuarios u2 ON c.iduser_update = u2.id_usuario
LEFT JOIN 
    tb_usuarios u3 ON c.iduser_inactive = u3.id_usuario;
