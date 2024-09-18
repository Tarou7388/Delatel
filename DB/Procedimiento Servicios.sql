USE Delatel;

DELIMITER $$
CREATE PROCEDURE spu_servicios_registrar(
    p_servicio       VARCHAR(50),
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_servicios (servicio, iduser_create)
    VALUES (p_servicio, p_iduser_create);
END $$
