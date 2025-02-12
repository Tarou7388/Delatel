USE Delatel;

DELIMITER;

DROP VIEW IF EXISTS vw_roles_listar;
CREATE VIEW vw_roles_listar AS
SELECT
    r.id_rol,
    r.rol,
    r.create_at,
    r.update_at,
    r.iduser_create,
    r.inactive_at
FROM
    tb_roles r 
WHERE 
    r.rol != 'Administrador';

    
CREATE VIEW vw_roles_listar_para_Registro AS
SELECT
    r.id_rol,
    r.rol,
    r.create_at,
    r.update_at,
    r.iduser_create,
    r.inactive_at
FROM
    tb_roles r 
WHERE 
    r.rol != 'Administrador' AND r.inactive_at IS NULL;

DROP VIEW IF EXISTS vw_rolesdetallado_listar$$
CREATE VIEW vw_rolesdetallado_listar AS
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
    LEFT JOIN tb_usuarios u3 ON r.iduser_inactive = u3.id_usuario ;

DROP PROCEDURE IF EXISTS spu_roles_registrar$$
CREATE PROCEDURE spu_roles_registrar(
    p_rol            VARCHAR(30),
    p_permisos       JSON,
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_roles (rol, permisos, iduser_create)
    VALUES (p_rol, p_permisos, p_iduser_create);
END $$

DROP PROCEDURE IF EXISTS spu_roles_actualizar$$
CREATE PROCEDURE spu_roles_actualizar(
    p_id_rol INT,
    p_rol VARCHAR(30),
    p_iduser_update INT
)
BEGIN
    UPDATE tb_roles
    SET 
        rol = p_rol,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE
        id_rol = p_id_rol;
END $$

DROP PROCEDURE IF EXISTS spu_roles_eliminar$$
CREATE PROCEDURE spu_roles_eliminar(
    p_id_rol INT,
    p_iduser_inactive INT
)
BEGIN 
    UPDATE tb_roles
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE
        id_rol = p_id_rol;
END $$

DROP PROCEDURE IF EXISTS spu_roles_activar$$
CREATE PROCEDURE spu_roles_activar(
    p_id_rol INT,
    p_iduser_update INT
)
BEGIN
    UPDATE tb_roles
    SET
        inactive_at = NULL,
        iduser_inactive = NULL,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE
        id_rol = p_id_rol;
END $$

DELIMITER ;
