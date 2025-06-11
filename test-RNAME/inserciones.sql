
DELIMITER $$ 

DROP VIEW IF EXISTS `vw_clientes_contratos`;
CREATE VIEW `vw_clientes_contratos` AS
SELECT 
    TRIM(
        REGEXP_REPLACE(
            CONCAT(pe.apellidos, ' ', pe.nombres),
            '[ ]+',
            ' '
        )
    ) AS nombre_completo,
    co.id_paquete,
    pa.paquete,
    co.id_contrato,
    co.direccion_servicio,
    pa.precio,
    co.ficha_instalacion
FROM
    tb_personas pe
    INNER JOIN tb_clientes cl ON pe.id_persona = cl.id_persona
    INNER JOIN tb_contratos co ON cl.id_cliente = co.id_cliente
    INNER JOIN tb_paquetes pa ON co.id_paquete = pa.id_paquete
    WHERE
    co.inactive_at IS NULL;



SELECT * FROM tb_paquetes;
SELECT  
cl.id_cliente, 
CONCAT(pe.apellidos, '', pe.nombres) AS nombre_completo
FROM 
    tb_clientes cl 
    INNER JOIN tb_personas pe ON cl.id_persona = pe.id_persona;
$$

DELIMITER $$ 
DROP VIEW IF EXISTS `vw_clientes_personas_nombres`;
CREATE VIEW `vw_clientes_personas_nombres` AS
SELECT 
    TRIM(
        REGEXP_REPLACE(
            CONCAT(pe.apellidos, ' ', pe.nombres),
            '[ ]+',
            ' '
        )
    ) AS nombre_completo,
    cl.id_cliente
FROM
    tb_personas pe
    INNER JOIN tb_clientes cl ON pe.id_persona = cl.id_persona;
$$

DELIMITER $$ 
DROP VIEW IF EXISTS `vw_clientes_paquetes`;
CREATE VIEW `vw_clientes_paquetes` AS
SELECT 
    pa.id_paquete,
    TRIM(
        REGEXP_REPLACE(
            pa.paquete,
            '[ ]+',
            ' '
        )
    ) AS paquete
FROM
    tb_paquetes pa

$$

SELECT * FROM tb_clientes WHERE id_cliente = 884;

/**
SELECT * FROM tb_contratos WHERE direccion_servicio = "SANTA FE calle primavera lomo largo 441";

SELECT * FROM tb_clientes WHERE id_cliente = 140;

SELECT * FROM tb_personas WHERE id_persona = 55;
--cl.id_cliente as IdCliente,
--co.id_contrato as IdContratos,

SELECT id_paquete,paquete FROM tb_paquetes WHERE paquete LIKE '%Plan Internet MIGRA 100MB %';


CALL spu_contratos_buscar_cliente (861)

SELECT dist.id_distrito,dist.distrito,prov.provincia,dep.departamento FROM tb_distritos dist 
INNER JOIN tb_provincias prov 
ON dist.id_provincia = prov.id_provincia
INNER JOIN tb_departamentos dep
ON prov.id_departamento = dep.id_departamento
WHERE dist.distrito LIKE "Pueblo%";
**/

DELIMITER $$
DROP VIEW IF EXISTS vw_empresas_listar$$
CREATE VIEW vw_empresas_listar AS
SELECT
    c.id_cliente,
    e.id_empresa,
    e.razon_social,
    e.nombre_comercial,
    e.telefono,
    e.email,
    c.coordenadas,
    c.direccion as direccion_contacto,
    e.ruc
FROM tb_empresas e
    LEFT JOIN tb_clientes c ON e.id_empresa = c.id_empresa;


USE delatel; 
SELECT * FROM vw_empresas_listar;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_empresa_cliente_idEmpresa $$

CREATE PROCEDURE spu_empresa_cliente_idEmpresa (
    IN p_id_empresa INT
)
BEGIN
    SELECT
        c.id_cliente,
        e.id_empresa,
        e.razon_social,
        e.nombre_comercial,
        e.telefono,
        e.email,
        c.coordenadas,
        c.direccion as direccion_contacto,
        e.ruc
    FROM
        tb_empresas e
        LEFT JOIN tb_clientes c ON e.id_empresa = c.id_empresa
    WHERE c.id_empresa = p_id_empresa;
END $$
DELIMITER ;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_contrato_buscar_id$$

CREATE PROCEDURE spu_contrato_buscar_id(
    p_id_contrato INT
)
BEGIN
    SELECT
        c.id_contrato,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nombres
            ELSE e.razon_social
        END AS nombre_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nro_doc
            ELSE e.ruc
        END AS num_identificacion,
        s.id_sector,
        s.sector AS nombre_sector,
        ur_persona.nombres AS nombre_usuario_registro,
        ut_persona.nombres AS nombre_usuario_tecnico,
        c.direccion_servicio,
        CONCAT('{"id_servicio": [', GROUP_CONCAT(sv.id_servicio), ']}') AS id_servicio,
        GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
        t.id_paquete,
        t.paquete,
        t.precio,
        c.referencia,
        c.coordenada,
        c.fecha_inicio,
        c.fecha_registro,
        c.nota
    FROM
        tb_contratos c
        INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
        LEFT JOIN tb_empresas e ON cl.id_cliente = e.id_empresa
        INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
        LEFT JOIN tb_servicios sv ON JSON_CONTAINS(t.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
        LEFT JOIN tb_sectores s ON c.id_sector = s.id_sector
        INNER JOIN tb_responsables ur ON c.id_usuario_registro = ur.id_responsable
        INNER JOIN tb_usuarios ur_usuario ON ur.id_usuario = ur_usuario.id_usuario
        INNER JOIN tb_personas ur_persona ON ur_usuario.id_persona = ur_persona.id_persona
        LEFT JOIN tb_responsables ut ON c.id_usuario_tecnico = ut.id_responsable
        LEFT JOIN tb_usuarios ut_usuario ON ut.id_usuario = ut_usuario.id_usuario
        LEFT JOIN tb_personas ut_persona ON ut_usuario.id_persona = ut_persona.id_persona
    WHERE
        c.id_contrato = p_id_contrato AND c.inactive_at IS NULL
    GROUP BY
        c.id_contrato;
END$$

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_contratos_actualizar$$

CREATE PROCEDURE spu_contratos_actualizar(
    IN p_id_contrato INT,
    IN p_id_paquete INT,
    IN p_direccion_servicio VARCHAR(200),
    IN p_referencia VARCHAR(200),
    IN p_nota TEXT,
    IN p_fecha_inicio DATE,
    IN p_id_sector INT,
    IN p_ficha_instalacion JSON,
    IN p_coordenada VARCHAR(50),
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_contratos
    SET
        id_paquete = p_id_paquete,
        direccion_servicio = p_direccion_servicio,
        referencia = p_referencia,
        nota = p_nota,
        fecha_inicio = p_fecha_inicio,
        iduser_update = p_iduser_update,
        id_sector = NULLIF(p_id_sector, 0),
        ficha_instalacion = p_ficha_instalacion,
        coordenada = p_coordenada,
        update_at = NOW()
    WHERE id_contrato = p_id_contrato;
END$$
