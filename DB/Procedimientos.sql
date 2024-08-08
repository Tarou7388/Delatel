DELIMITER //
CREATE PROCEDURE spu_productos_agregar(
    IN _tipo_producto VARCHAR(30),
    IN _descripcion VARCHAR(60),
    IN _marca VARCHAR(30),
    IN _precio_actual DECIMAL(7, 2)
)
BEGIN
    -- Insertar un nuevo registro en la tabla 'tb_producto'
    INSERT INTO tb_producto (tipo_producto, descripcion, marca, precio_actual, create_at)
    VALUES (_tipo_producto, _descripcion, _marca, _precio_actual, NOW());
END //
DELIMITER ;