USE Delatel;

DROP PROCEDURE IF EXISTS spu_buscar_distrito;
DELIMITER $$

CREATE PROCEDURE spu_buscar_distrito(IN p_id_provincia INT)
BEGIN
    SELECT 
        id_distrito, 
        distrito,
        limites
    FROM 
        tb_distritos
    WHERE 
        id_provincia = p_id_provincia;
END$$

DELIMITER;