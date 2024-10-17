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


DROP VIEW IF EXISTS vw_contactabilidad_listar;
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



CALL spu_fichatecnica_buscar_id(5);