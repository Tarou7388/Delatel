-- SQLBook: Code
USE Delatel;

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_base_listar$$
CREATE PROCEDURE spu_base_listar()
BEGIN
    SELECT id_base, nombre_base FROM tb_base;
END $$

DROP PROCEDURE IF EXISTS spu_subBase_por_base$$
CREATE PROCEDURE spu_subBase_por_base(
    p_id_base INT
)
BEGIN
    SELECT id_sub_base, nombre_sub_base
    FROM tb_subbase
    WHERE id_base = p_id_base;
END $$
DELIMITER ;

