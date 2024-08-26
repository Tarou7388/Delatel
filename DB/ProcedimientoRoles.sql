Use Delatel;

create procedure spu_registrar_roles(
    in p_rol varchar(30)
)
BEGIN
    INSERT INTO tb_roles (rol) VALUES (p_rol);
end

CREATE PROCEDURE spu_listar_permisos(
    IN p_id_rol INT
)
BEGIN
    SELECT 
        p.modulo,
        p.permisoC AS crear,
        p.permisoR AS leer,
        p.permisoU AS actualizar,
        p.permisoD AS eliminar
    FROM 
        tb_roles r
    JOIN 
        tb_permisos p ON p.id_rol = r.id_rol
    WHERE 
        r.id_rol = p_id_rol;
END$$


