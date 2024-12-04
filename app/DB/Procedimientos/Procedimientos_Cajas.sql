USE Delatel;

DROP PROCEDURE IF EXISTS spu_cajas_listar;
DELIMITER $$

CREATE PROCEDURE spu_cajas_listar()
BEGIN
  SELECT id_caja, nombre, descripcion, numero_entradas, id_sector, coordenadas FROM tb_cajas;
END$$

DROP PROCEDURE IF EXISTS spu_mufas_listar;

CREATE PROCEDURE spu_mufas_listar()
BEGIN
  SELECT id_mufa, nombre, descripcion, coordenadas FROM tb_mufas;
END$$

DROP PROCEDURE IF EXISTS spu_cajas_registrar;

CREATE PROCEDURE spu_cajas_registrar(
  IN p_nombre VARCHAR(30),
  IN p_descripcion VARCHAR(100),
  IN p_numero_entradas TINYINT,
  IN p_id_mufa INT,
  IN p_coordenadas VARCHAR(50),
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_mufa, coordenadas, iduser_create)
  VALUES(p_nombre, p_descripcion, p_numero_entradas, p_id_mufa, p_coordenadas, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS spu_lineas_registrar;

CREATE PROCEDURE spu_lineas_registrar(
  IN p_id_sector INT,
  IN p_coordenadas JSON,
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_lineas(id_sector, coordenadas, iduser_create)
  VALUES(p_id_sector, p_coordenadas, p_iduser_create);
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS spu_descontar_espacio_caja;
CREATE PROCEDURE spu_descontar_espacio_caja (
    IN p_id_caja INT
)
BEGIN
    IF p_id_caja IS NOT NULL THEN
        UPDATE tb_cajas
        SET numero_entradas = numero_entradas - 1
        WHERE id_caja = p_id_caja AND numero_entradas > 0;

        IF ROW_COUNT() = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No hay espacios disponibles en la caja.';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ID de caja no proporcionado.';
    END IF;
END //