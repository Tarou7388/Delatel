/*
DROP PROCEDURE IF EXISTS spu_clientes_registrar$$
CREATE PROCEDURE spu_clientes_registrar(
p_id_persona        INT,
p_id_empresa        INT,
p_direccion         VARCHAR(50),
p_referencia        VARCHAR(150),
p_iduser_create     INT,
p_coordenadas       VARCHAR(50)
)*/


CALL spu_clientes_registrar (
    1112,
    NULL,
    'PSJE SAN FRANCISCO NRO. PUERTA 176 - C.P. SAN IGNACIO - SUNAMPE',
    NULL,
    1,
    '−13.4167,−76.1526'
);

SELECT
    direccion_servicio,
    tb_contratos.id_cliente,
    id_contrato,
    coordenada
FROM
    tb_contratos
    INNER JOIN tb_clientes ON tb_contratos.id_cliente = tb_clientes.id_cliente
    INNER JOIN tb_personas ON tb_clientes.id_persona = tb_personas.id_persona
WHERE
    id_contrato = 650;

SELECT * FROM tb_personas WHERE id_persona = '1112';

SELECT * FROM tb_contratos WHERE id_contrato = 658;