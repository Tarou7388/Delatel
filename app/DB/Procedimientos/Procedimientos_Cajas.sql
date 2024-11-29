USE Delatel;

DROP PROCEDURE IF EXISTS spu_cajas_listar;
DELIMITER $$

CREATE PROCEDURE spu_cajas_listar()
BEGIN
  SELECT id_caja, nombre, descripcion, numero_entradas, id_mufa, coordenadas FROM tb_cajas;
END$$

DROP PROCEDURE IF EXISTS spu_mufas_listar;

CREATE PROCEDURE spu_mufas_listar()
BEGIN
  SELECT id_mufa, nombre, descripcion, coordenadas, id_sector FROM tb_mufas;
END$$

DROP PROCEDURE IF EXISTS spu_cajas_registrar;

CREATE PROCEDURE spu_cajas_registrar(
  IN p_nombre VARCHAR(50),
  IN p_descripcion VARCHAR(100),
  IN p_numero_entradas INT,
  IN p_id_mufa INT,
  IN p_coordenadas VARCHAR(100),
  IN p_idUser_create INT
)
BEGIN
  INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_mufa, coordenadas, iduser_create)
  VALUES(p_nombre, p_descripcion, p_numero_entradas, p_id_mufa, p_coordenadas, p_idUser_create);
END$$

DROP PROCEDURE IF EXISTS spu_lineas_registrar;

CREATE PROCEDURE spu_lineas_registrar(
  IN p_id_sector VARCHAR(50),
  IN p_coordenadas JSON,
  IN p_iduser_create VARCHAR(100)
)
BEGIN
  INSERT INTO tb_lineas(id_sector, coordenadas, iduser_create)
  VALUES(p_id_sector, p_coordenadas, p_iduser_create);
END$$