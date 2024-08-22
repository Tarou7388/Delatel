USE DELATEL;

DELIMITER $$

CREATE PROCEDURE spu_personas_registrar(
    p_tipo_doc          CHAR(3),
    p_nro_doc           VARCHAR(15),
    p_apellidos         VARCHAR(30),
    p_nombres           VARCHAR(30),
    p_telefono 		    CHAR(9),
    p_email             VARCHAR(100)
)
BEGIN
    INSERT tb_usuarios(tipo_doc, nro_doc, apellidos, nombres, telefono, email) 
        VALUES
            (p_tipo_doc, p_nro_doc, p_apellidos, p_nombres, p_telefono, p_email);
END $$

CREATE PROCEDURE spu_clientes_registrar(
    p_id_persona        INT,
    p_id_empresa        INT,
    p_direccion         VARCHAR(50),
    p_referencia        VARCHAR(150),
    p_estado		    BIT
)
BEGIN
    INSERT tb_clientes(id_persona, id_empresa, direccion, referencia, estado) 
        VALUES
            (p_id_persona, id_empresa, p_direccion, p_referencia, p_estado);
END $$

CREATE PROCEDURE spu_usuarios_registrar(
    p_id_persona        INT,
    p_nombre_user       VARCHAR(100),
    p_pass              VARCHAR(60)
)
BEGIN
    INSERT tb_clientes(id_persona, nombre_user, pass) 
        VALUES
            (p_id_persona, p_nombre_user, p_pass);
END $$

CREATE VIEW vw_usuarios AS
SELECT
    pe.apellidos,
    pe.nombres,
    us.nombre_user,
    ro.rol as "Cargo",
    us.create_at,
    us.inactive_at
FROM
    tb_responsables res
INNER JOIN
    tb_usuarios us ON res.id_usuario = us.id_usuario
INNER JOIN
    tb_personas pe ON us.id_persona = pe.id_persona
INNER JOIN
    tb_roles ro ON res.id_rol = ro.id_rol;