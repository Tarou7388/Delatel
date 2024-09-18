USE Delatel;

CREATE VIEW vw_clientes_listar AS
SELECT
    c.id_cliente,
    COALESCE(CONCAT(p.nombres," ", p.apellidos), e.nombre_comercial) AS nombre_cliente,
    COALESCE(p.nro_doc,e.ruc) AS codigo_cliente, 
    COALESCE(p.email, e.email) AS email_cliente,
    COALESCE(p.telefono, e.telefono) AS telefono_cliente,
    c.direccion AS direccion_cliente,
    c.referencia AS referencia_cliente,
    c.coordenadas AS coordenadas_cliente
FROM
    tb_clientes c
LEFT JOIN tb_personas p ON c.id_persona = p.id_persona
LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa;

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
CREATE PROCEDURE spu_clientes_actualizar(
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
    CONCAT(p.apellidos, ', ', p.nombres) AS "nombre"
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
    e.nombre_comercial AS "nombre"
FROM 
    tb_clientes c
LEFT JOIN
    tb_empresas e ON e.id_empresa = c.id_empresa
    WHERE e.ruc = _ruc;
END$$