USE Delatel;

DELIMITER $$

CREATE PROCEDURE spu_sectores_registrar(
    p_id_distrito    INT,
    p_sector         VARCHAR(60),
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_sectores (id_distrito, sector, iduser_create)
    VALUES (p_id_distrito, p_sector, p_iduser_create);
END $$

