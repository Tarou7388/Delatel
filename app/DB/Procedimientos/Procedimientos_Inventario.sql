USE Delatel;

DELIMITER $$

CREATE PROCEDURE spu_productos_agregar(
    IN p_marca VARCHAR(30),
    IN p_tipo_producto VARCHAR(60),
    IN p_modelo VARCHAR(30),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_codigo_barra VARCHAR(120),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_productos (marca, tipo_producto, modelo, precio_actual, codigo_barra, create_at,iduser_create)
    VALUES (p_marca, p_tipo_producto, p_modelo, p_precio_actual, p_codigo_barra, NOW(),p_iduser_create);
END $$


DELIMITER $$

CREATE PROCEDURE spu_productos_actualizar(
  IN p_id_producto INT,
  IN p_marca VARCHAR(30),
  IN p_tipo_producto VARCHAR(60),
  IN p_modelo VARCHAR(30),
  IN p_precio_actual DECIMAL(7,2),
  IN p_codigo_barra VARCHAR(120),
  IN p_iduser_update INT
)
BEGIN
  UPDATE tb_productos 
  SET 
    marca = p_marca,
    tipo_producto = p_tipo_producto,
    modelo = p_modelo,
    iduser_update = p_iduser_update,
    precio_actual = p_precio_actual,
    codigo_barra = p_codigo_barra,
    update_at = NOW()
  WHERE id_producto = p_id_producto;
END $$