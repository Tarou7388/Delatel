DROP VIEW IF EXISTS `vw_clientes_contratos`;
CREATE VIEW `vw_clientes_contratos` AS
SELECT 
    CONCAT(pe.apellidos, '', pe.nombres) AS nombre_completo,
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
    INNER JOIN tb_paquetes pa ON co.id_paquete = pa.id_paquete;


SELECT  
cl.id_cliente, 
CONCAT(pe.apellidos, '', pe.nombres) AS nombre_completo
FROM 
    tb_clientes cl 
    INNER JOIN tb_personas pe ON cl.id_persona = pe.id_persona;


SELECT * FROM tb_contratos WHERE direccion_servicio = "PSJ. SANTA ROSA ORURO N100-01 - CRUZ BLANCA";

SELECT * FROM tb_clientes WHERE id_cliente = 285;

SELECT * FROM tb_personas WHERE id_persona = 102;
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