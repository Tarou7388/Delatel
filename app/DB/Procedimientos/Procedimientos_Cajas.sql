USE Delatel;

DROP PROCEDURE IF EXISTS spu_cajas_listar;
DELIMITER $$

CREATE PROCEDURE spu_cajas_listar()
BEGIN
  SELECT 
    id_caja, 
    nombre, 
    descripcion, 
    numero_entradas, 
    id_sector, 
    coordenadas 
  FROM tb_cajas;
END$$

DROP PROCEDURE IF EXISTS spu_mufas_listar$$

CREATE PROCEDURE spu_mufas_listar()
BEGIN
  SELECT id_mufa, nombre, descripcion, coordenadas FROM tb_mufas;
END$$

DROP PROCEDURE IF EXISTS spu_cajas_registrar$$

CREATE PROCEDURE spu_cajas_registrar(
  IN p_nombre VARCHAR(30),
  IN p_descripcion VARCHAR(100),
  IN p_numero_entradas TINYINT,
  IN p_id_sector INT,
  IN p_coordenadas VARCHAR(50),
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_sector, coordenadas, iduser_create)
  VALUES(p_nombre, p_descripcion, p_numero_entradas, p_id_sector, p_coordenadas, p_iduser_create);
  SELECT LAST_INSERT_ID() AS id_caja;
END$$

DROP PROCEDURE IF EXISTS spu_lineas_registrar$$

CREATE PROCEDURE spu_lineas_registrar(
  IN p_id_mufa INT,
  IN p_id_caja INT,
  IN p_coordenadas JSON,
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_lineas(id_mufa, id_caja, coordenadas, iduser_create)
  VALUES(p_id_mufa, p_id_caja, p_coordenadas, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS spu_descontar_espacio_caja$$
CREATE PROCEDURE spu_descontar_espacio_caja (
  IN p_id_caja INT
)
BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas - 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;

  IF ROW_COUNT() = 0 THEN
      SELECT FALSE AS resultado;
  END IF;
END $$

DROP PROCEDURE IF EXISTS spu_recontar_espacio_caja$$
CREATE PROCEDURE spu_recontar_espacio_caja (
  IN p_id_caja INT
)
BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas + 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;
END $$

DROP PROCEDURE IF EXISTS spu_mufa_registrar$$

CREATE PROCEDURE spu_mufa_registrar(
  IN p_nombre VARCHAR(30),
  IN p_descripcion VARCHAR(100),
  IN p_coordenadas JSON,
  IN p_direccion VARCHAR(100),
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_mufas(nombre, descripcion, coordenadas, direccion, iduser_create)
  VALUES(p_nombre, p_descripcion, p_coordenadas, p_direccion, p_iduser_create);
END$$