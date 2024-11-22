USE Delatel;

DROP PROCEDURE IF EXISTS spu_cajas_listar;
DELIMITER $$

CREATE PROCEDURE spu_cajas_listar()
BEGIN
  SELECT id_caja, nombre, descripcion, numero_entradas, id_mufa, coordenadas FROM tb_cajas;
END$$

DROP PROCEDURE IF EXISTS spu_mufas_listar;

CREATE PROCEDURE spu_mufas_listar()
BEGIN
  SELECT id_mufa, nombre, descripcion, coordenadas, id_sector FROM tb_mufas;
END$$

CREATE TABLE tb_lineas (
    id_linea INT PRIMARY KEY AUTO_INCREMENT,
    id_sector INTEGER NOT NULL,
    coordenadas JSON NOT NULL,
    iduser_create INTEGER NOT NULL,
    date_create DATE NOT NULL DEFAULT NOW()
);
INSERT INTO tb_lineas(id_sector, coordenadas, iduser_create) VALUES (1, '[
    {"lat": -13.411086708881479, "lng": -76.16067944369733},
    {"lat": -13.415915837032298, "lng": -76.14137781811166},
    {"lat": -13.416000192545276, "lng": -76.14082079571914},
    {"lat": -13.416418725232612, "lng": -76.139855179086},
    {"lat": -13.415263815402367, "lng": -76.13952708343515}
]', 1);