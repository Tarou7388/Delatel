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