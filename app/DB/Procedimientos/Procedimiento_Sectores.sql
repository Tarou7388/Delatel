USE Delatel;

DROP VIEW IF EXISTS vw_sectores_listar;
CREATE VIEW vw_sectores_listar AS
SELECT 
    id_sector, 
    sector
FROM 
    tb_sectores;

DROP VIEW IF EXISTS vw_sectores_obtener;
CREATE VIEW vw_sectores_obtener AS
SELECT
    s.id_sector,
    s.sector,
    s.id_distrito,
    s.descripcion,
    s.coordenadas,
    s.direccion,
    d.distrito,
    s.create_at,
    s.update_at,
    s.inactive_at,
    s.iduser_create,
    s.iduser_update,
    s.iduser_inactive
FROM
    tb_sectores s
    LEFT JOIN tb_distritos d ON s.id_distrito = d.id_distrito;


DELIMITER $$
DROP PROCEDURE IF EXISTS spu_sectores_registrar$$
CREATE PROCEDURE spu_sectores_registrar(
    p_id_distrito    INT,
    p_sector         VARCHAR(60),
    p_iduser_create  INT
)
BEGIN
    INSERT INTO tb_sectores (id_distrito, sector, iduser_create)
    VALUES (p_id_distrito, p_sector, p_iduser_create);
END $$

DROP PROCEDURE IF EXISTS spu_sectores_actualizar_id$$
CREATE PROCEDURE spu_sectores_actualizar_id(
    IN p_id_sector INT,
    IN p_id_distrito INT,
    IN p_sector VARCHAR(60),
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_sectores
    SET
        id_distrito = p_id_distrito,
        sector = p_sector,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE
        id_sector = p_id_sector;
END $$

