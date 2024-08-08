USE Delatel;

DELIMITER $$

CREATE PROCEDURE spu_login_usuarios(
    p_nombre_user VARCHAR(100)
)
BEGIN
    SELECT 
        u.id_usuario,
        u.pass,
        r.id_rol
    FROM 
        tb_usuarios u
    JOIN 
        tb_responsables r ON u.id_usuario = r.id_usuario
    WHERE nombre_user = p_nombre_user;
END $$ 