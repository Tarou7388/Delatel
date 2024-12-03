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


