USE Delatel;
DROP Procedure IF EXISTS spu_buscar_distrito;

create procedure spu_buscar_distrito(IN p_id_provincia INT)
BEGIN
    SELECT 
        id_distrito, 
        distrito 
    FROM 
        tb_distritos
    WHERE 
        id_provincia = p_id_provincia;
END$$