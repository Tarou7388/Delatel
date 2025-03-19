USE Delatel;

DELIMITER $$

DROP PROCEDURE IF EXISTS `spu_registrar_almacen`$$

CREATE PROCEDURE `spu_registrar_almacen`(
    IN p_nombre VARCHAR(65),
    IN p_direccion VARCHAR(120),
    IN p_coordenadas VARCHAR(50),
    IN p_idusuario INT
)
BEGIN 
    INSERT INTO tb_almacen (nombre_almacen, ubicacion, coordenada, iduser_create) VALUES (p_nombre, p_direccion, p_coordenadas, p_idusuario);
END$$

DROP PROCEDURE IF EXISTS `spu_actualizar_almacen`$$

CREATE PROCEDURE `spu_actualizar_almacen`(
    IN p_id INT,
    IN p_nombre VARCHAR(65),
    IN p_direccion VARCHAR(120),
    IN p_coordenadas VARCHAR(50),
    IN p_idusuario INT
)
BEGIN 
    UPDATE tb_almacen SET nombre_almacen = p_nombre, ubicacion = p_direccion, coordenada = p_coordenadas, iduser_update = p_idusuario, update_at = NOW() WHERE id_almacen = p_id;
END$$

DROP PROCEDURE IF EXISTS `spu_eliminar_almacen`$$

CREATE PROCEDURE `spu_eliminar_almacen`(
    IN p_id INT
)
BEGIN 
    UPDATE tb_almacen SET inactive_at = NOW() WHERE id_almacen = p_id;
END$$