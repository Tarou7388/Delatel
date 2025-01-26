-- SQLBook: Code
Use Delatel;


DELIMITER $$
DROP PROCEDURE IF EXISTS spu_antenas_listar$$

CREATE PROCEDURE spu_antenas_listar()
BEGIN
  SELECT
        id_antena,
        id_distrito, 
        nombre, 
        descripcion,
        coordenadas, 
        direccion, 
        create_at
  FROM tb_antenas 
  WHERE inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS spu_antenas_registrar$$
CREATE PROCEDURE spu_antenas_registrar
  (
    IN p_id_distrito INT,
    IN p_nombre VARCHAR(60),
    IN p_descripcion VARCHAR(100),
    IN p_coordenadas VARCHAR(50),
    IN p_direccion VARCHAR(200),
    IN p_iduser INT
  )
BEGIN
  INSERT INTO tb_antenas (id_distrito, nombre, descripcion, coordenadas, direccion, iduser_create)
  VALUES (p_id_distrito, p_nombre, p_descripcion, p_coordenadas, p_direccion, p_iduser);
END$$

DROP PROCEDURE IF EXISTS spu_antena_inhabilitar$$
CREATE PROCEDURE spu_antena_inhabilitar
  (
    IN p_id_antena INT,
    IN p_iduser INT
  )
BEGIN
  UPDATE tb_antenas 
  SET iduser_inactive = p_iduser, 
      inactive_at = NOW() 
  WHERE id_antena = p_id_antena;
END$$

CALL spu_antenas_registrar(
  110201,                             
  'Antena Central',              
  'Antena principal del sector', 
  '-13.451882343831118, -76.15656155438536',           
  'Av. Principal 123',           
  1                            
);

