USE Delatel;

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_provincias_listar$$
CREATE PROCEDURE spu_provincias_listar()
BEGIN
    SELECT id_provincia, provincia, id_departamento
    FROM tb_provincias;
END $$

DROP PROCEDURE IF EXISTS spu_distritos_por_provincia$$
CREATE PROCEDURE spu_distritos_por_provincia(
    p_id_provincia INT
)
BEGIN
    SELECT id_distrito, distrito, id_provincia, id_departamento
    FROM tb_distritos
    WHERE id_provincia = p_id_provincia;
END $$
DELIMITER ;

