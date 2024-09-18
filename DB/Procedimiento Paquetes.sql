USE Delatel;

DELIMITER $$
CREATE PROCEDURE spu_paquetes_registrar(
    p_id_servicio     INT,
    p_precio          DECIMAL(7,2),
    p_fecha_inicio    DATE,
    p_fecha_fin       DATE,
    p_iduser_create   INT
)
BEGIN
    INSERT INTO tb_paquetes (id_servicio, precio, fecha_inicio, fecha_fin, iduser_create)
    VALUES (p_id_servicio, p_precio, p_fecha_inicio, p_fecha_fin, p_iduser_create);
END $$