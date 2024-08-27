Use Delatel;

DELIMITER$$

create procedure spu_registrar_roles(
    in p_rol varchar(30)
)
BEGIN
    INSERT INTO tb_roles (rol) VALUES (p_rol);
end $$

CREATE PROCEDURE spu_listar_permisos(
    IN p_id_rol INT
)
BEGIN
    SELECT 
        permisos
    FROM tb_roles r
    WHERE 
        r.id_rol = p_id_rol;
END $$

call spu_listar_permisos(1);
