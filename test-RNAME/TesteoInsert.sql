DELIMITER $$
DROP PROCEDURE IF EXISTS spu_obtener_iddistrito_por_datos;
CREATE PROCEDURE spu_obtener_iddistrito_por_datos(
    IN p_distrito VARCHAR(100),
    IN p_provincia VARCHAR(100),
    IN p_departamento VARCHAR(100)
)
BEGIN
    SELECT dist.id_distrito, dist.distrito, prov.provincia, dep.departamento, sect.id_sector, sect.sector
FROM
    tb_distritos dist
    INNER JOIN tb_provincias prov ON dist.id_provincia = prov.id_provincia
    INNER JOIN tb_departamentos dep ON prov.id_departamento = dep.id_departamento
    INNER JOIN tb_sectores sect ON dist.id_distrito = sect.id_distrito
    WHERE dist.distrito = p_distrito
      AND prov.provincia = p_provincia
      AND dep.departamento = p_departamento;
END;

CALL spu_obtener_iddistrito_por_datos('Pueblo Nuevo', 'Chincha', 'Ica');

SELECT * FROM tb_antenas

-- -13.397961073886,-76.14539173995833