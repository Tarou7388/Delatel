Use Delatel;

create procedure spu_registrar_roles(
    in p_rol varchar(30)
)
BEGIN
    INSERT INTO tb_roles (rol) VALUES (p_rol);
end