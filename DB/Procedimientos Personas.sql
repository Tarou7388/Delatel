USE Delatel;

CREATE VIEW vw_personas_listar AS
SELECT
    p.id_persona,
    p.tipo_doc,
    p.nro_doc,
    p.apellidos,
    p.nombres,
    p.telefono,
    p.nacionalidad,
    p.email,
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
    tb_personas p
    LEFT JOIN tb_usuarios u1 ON p.iduser_create = u1.id_usuario
    LEFT JOIN tb_usuarios u2 ON p.iduser_update = u2.id_usuario
    LEFT JOIN tb_usuarios u3 ON p.iduser_inactive = u3.id_usuario;

DELIMITER $$

CREATE PROCEDURE spu_personas_registrar(
    p_tipo_doc          CHAR(3),
    p_nro_doc           VARCHAR(15),
    p_apellidos         VARCHAR(30),
    p_nombres           VARCHAR(30),
    p_telefono 		    CHAR(9),
    p_nacionalidad		VARCHAR(40),
    p_email             VARCHAR(100),
    p_iduser_create		INT
    )
BEGIN
    INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono,nacionalidad, email,iduser_create) 
    VALUES (p_tipo_doc, p_nro_doc, p_apellidos, p_nombres, p_telefono,p_nacionalidad, p_email,p_iduser_create);

    SELECT LAST_INSERT_ID() AS id_persona;
END $$

CREATE PROCEDURE spu_personas_actualizar(
    p_tipo_doc          CHAR(3),
    p_nro_doc           VARCHAR(15),
    p_apellidos         VARCHAR(30),
    p_nombres           VARCHAR(30),
    p_telefono          CHAR(9),
    p_nacionalidad      VARCHAR(40),
    p_email             VARCHAR(100),
    p_iduser_update      INT,
    p_id_persona        INT
)
BEGIN
    UPDATE tb_personas
    SET 
        tipo_doc = p_tipo_doc,
        nro_doc = p_nro_doc,
        apellidos = p_apellidos,
        nombres = p_nombres,
        telefono = p_telefono,
        nacionalidad = p_nacionalidad,
        email = p_email,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_persona = p_id_persona;
END $$

CREATE PROCEDURE spu_personas_eliminar(
    p_id_persona INT,
    p_iduser_inactive INT
)
BEGIN
    UPDATE tb_personas
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_persona = p_id_persona;
END $$


