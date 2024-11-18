USE Delatel;

DROP PROCEDURE IF EXISTS spu_cajas_listar;
DELIMITER $$

CREATE PROCEDURE spu_cajas_listar()
BEGIN
  SELECT id_caja, nombre, descripcion, numero_entradas, id_mufa, coordenadas FROM tb_cajas;
END$$