USE Delatel;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_productos_registrar$$
CREATE PROCEDURE spu_productos_registrar(
    IN p_id_marca INT,
    IN p_id_tipo INT,
    IN p_modelo VARCHAR(30),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_codigo_barra VARCHAR(120),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_productos (id_marca, id_tipo, modelo, precio_actual, codigo_barra, create_at, iduser_create)
    VALUES (p_id_marca, p_id_tipo, p_modelo, p_precio_actual, p_codigo_barra, NOW(), p_iduser_create);
END $$

DROP PROCEDURE IF EXISTS spu_productos_actualizar$$
CREATE PROCEDURE spu_productos_actualizar(
    IN p_id_producto INT,
    IN p_id_marca INT,
    IN p_id_tipo INT,
    IN p_modelo VARCHAR(30),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_codigo_barra VARCHAR(120),
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_productos 
    SET 
        id_marca = p_id_marca,
        id_tipo = p_id_tipo,
        modelo = p_modelo,
        precio_actual = p_precio_actual,
        codigo_barra = p_codigo_barra,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_producto = p_id_producto;
END $$
