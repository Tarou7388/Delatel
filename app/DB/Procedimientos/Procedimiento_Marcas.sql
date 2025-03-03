USE Delatel;

DELIMITER $$
DROP VIEW IF EXISTS vw_marca$$
CREATE VIEW vw_marca AS
	SELECT id_marca,
           marca,
           create_at,
           iduser_create
	FROM tb_marca
	WHERE inactive_at IS NULL;

DROP PROCEDURE IF EXISTS spu_registrar_marca$$
CREATE PROCEDURE spu_registrar_marca(
    IN p_marca VARCHAR(70),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_marca (marca, create_at, iduser_create)
    VALUES (p_marca, NOW(), p_iduser_create);
END $$