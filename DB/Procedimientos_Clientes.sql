USE Delatel;

CREATE VIEW vw_clientes_listar AS
SELECT
    c.id_cliente,
    COALESCE(CONCAT(p.nombres, ", ", p.apellidos), e.nombre_comercial) AS nombre_cliente,
    COALESCE(p.nro_doc, e.ruc) AS codigo_cliente, 
    COALESCE(p.email, e.email) AS email_cliente,
    COALESCE(p.telefono, e.telefono) AS telefono_cliente,
    c.direccion AS direccion_cliente,
    c.referencia AS referencia_cliente,
    c.coordenadas AS coordenadas_cliente
FROM
    tb_clientes c
LEFT JOIN tb_personas p ON c.id_persona = p.id_persona AND p.inactive_at IS NULL
LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa AND e.inactive_at IS NULL
WHERE
    c.inactive_at IS NULL;

DELIMITER $$
CREATE PROCEDURE spu_clientes_registrar(
    p_id_persona        INT,
    p_id_empresa        INT,
    p_direccion         VARCHAR(50),
    p_referencia        VARCHAR(150),
	p_iduser_create INT,
    p_coordenadas       VARCHAR(50)
)
BEGIN
    IF p_id_empresa = '' THEN
        SET p_id_empresa = NULL;
	ELSEIF p_id_persona = '' THEN
        SET p_id_persona = NULL;
    END IF;
    INSERT INTO tb_clientes(id_persona, id_empresa, direccion, referencia,iduser_create,coordenadas) 
    VALUES (p_id_persona, p_id_empresa, p_direccion, p_referencia,p_iduser_create,p_coordenadas);
END $$

DELIMITER $$
CREATE PROCEDURE spu_clientes_actualizar_old(
    p_id_persona        INT,
    p_id_empresa        INT,
    p_direccion         VARCHAR(50),
    p_referencia        VARCHAR(150),
    p_iduser_update     INT,
    p_id_cliente        INT,
    p_coordenadas       VARCHAR(50)
)
BEGIN
    IF p_id_empresa = '' THEN
        SET p_id_empresa = NULL;
    ELSEIF p_id_persona = '' THEN
        SET p_id_persona = NULL;
    END IF;
    
    UPDATE tb_clientes SET
        id_persona = p_id_persona,
        id_empresa = p_id_empresa,
        direccion = p_direccion,
        referencia = p_referencia,
        iduser_update = p_iduser_update,
        coordenadas = p_coordenadas
    WHERE id_cliente = p_id_cliente;
    
END $$

DELIMITER $$
CREATE PROCEDURE spu_cliente_persona_buscar(IN p_documento varchar(15))
BEGIN
    SELECT 
    c.id_cliente,
    c.direccion,
    p.nacionalidad,
    c.referencia,
    c.coordenadas,
    CONCAT(p.apellidos, ', ', p.nombres) AS "nombre",
    p.email,
    p.telefono
FROM 
    tb_clientes c
LEFT JOIN 
    tb_personas p ON c.id_persona = p.id_persona
WHERE 
    p.nro_doc = p_documento;
END$$

DELIMITER $$
CREATE PROCEDURE spu_cliente_empresa_buscar(IN _ruc varchar(15))
BEGIN
    SELECT 
    c.id_cliente,
    c.direccion,
    c.referencia,
    c.coordenadas,
    e.nombre_comercial AS "nombre",
    e.email,
    e.telefono
FROM 
    tb_clientes c
LEFT JOIN
    tb_empresas e ON e.id_empresa = c.id_empresa
    WHERE e.ruc = _ruc;
END$$

DELIMITER $$
CREATE PROCEDURE spu_clientes_actualizar(
    p_identificador VARCHAR(15),
    p_nombre VARCHAR(100),
    p_apellidos VARCHAR(30),
    p_email VARCHAR(100),
    p_telefono CHAR(9),
    p_direccion VARCHAR(250),
    p_referencia VARCHAR(150),
    p_coordenadas VARCHAR(50),
    p_iduser_update INT
)
BEGIN
    DECLARE v_tipo_doc CHAR(3);
    DECLARE v_nro_doc VARCHAR(15);

    IF LENGTH(p_identificador) = 8 THEN
        SET v_tipo_doc = 'DNI';
        SET v_nro_doc = p_identificador;

        UPDATE tb_personas
        SET 
            nombres = p_nombre,
            apellidos = p_apellidos,
            email = p_email,
            telefono = p_telefono,
            update_at = NOW(),
            iduser_update=p_iduser_update
        WHERE nro_doc = v_nro_doc AND tipo_doc = v_tipo_doc AND inactive_at IS NULL;

    ELSEIF LENGTH(p_identificador) = 11 THEN
        SET v_tipo_doc = 'RUC';
        SET v_nro_doc = p_identificador;

        UPDATE tb_empresas
        SET 
            nombre_comercial = p_nombre,
            email = p_email,
            telefono = p_telefono,
            update_at = NOW(),
            iduser_update=p_iduser_update
        WHERE ruc = v_nro_doc AND inactive_at IS NULL;
    END IF;

    UPDATE tb_clientes
    SET 
        direccion = p_direccion,
        referencia = p_referencia,
        coordenadas = p_coordenadas,
        update_at = NOW()
    WHERE id_cliente = (
        SELECT id_cliente
        FROM tb_clientes
        WHERE (id_persona IN (
                SELECT id_persona FROM tb_personas WHERE nro_doc = v_nro_doc AND tipo_doc = v_tipo_doc
            ) OR id_empresa IN (
                SELECT id_empresa FROM tb_empresas WHERE ruc = v_nro_doc
            )) AND inactive_at IS NULL
    );

END $$

