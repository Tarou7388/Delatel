USE delatel;

DELIMITER $$
DROP VIEW IF EXISTS vw_marca$$
CREATE VIEW vw_marca AS
	SELECT id_marca,
           marca,
           create_at,
           iduser_create
	FROM tb_marca
	WHERE inactive_at IS NULL;
$$