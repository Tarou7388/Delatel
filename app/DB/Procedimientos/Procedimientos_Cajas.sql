-- SQLBook: Code
USE Delatel;

DROP PROCEDURE IF EXISTS spu_cajas_listar;

DELIMITER $$

CREATE PROCEDURE spu_cajas_listar()
BEGIN
  SELECT 
    id_caja, 
    nombre, 
    descripcion, 
    numero_entradas, 
    id_sector, 
    coordenadas 
  FROM tb_cajas WHERE inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS spu_mufas_listar$$

CREATE PROCEDURE spu_mufas_listar()
BEGIN
  SELECT id_mufa, nombre, descripcion, coordenadas FROM tb_mufas WHERE inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS spu_cajas_registrar$$

CREATE PROCEDURE spu_cajas_registrar(
  IN p_nombre VARCHAR(30),
  IN p_descripcion VARCHAR(100),
  IN p_numero_entradas TINYINT,
  IN p_id_sector INT,
  IN p_coordenadas VARCHAR(50),
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_sector, coordenadas, iduser_create)
  VALUES(p_nombre, p_descripcion, p_numero_entradas, p_id_sector, p_coordenadas, p_iduser_create);

  SET @last_id := LAST_INSERT_ID();

  SELECT 
    id_caja, 
    nombre, 
    descripcion, 
    numero_entradas, 
    id_sector, 
    coordenadas 
  FROM tb_cajas
  WHERE id_caja = @last_id;
END$$

DROP PROCEDURE IF EXISTS spu_lineas_registrar$$

CREATE PROCEDURE spu_lineas_registrar(
  IN p_id_mufa INT,
  IN p_id_caja INT,
  IN p_coordenadas JSON,
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_lineas(id_mufa, id_caja, coordenadas, iduser_create)
  VALUES(p_id_mufa, p_id_caja, p_coordenadas, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS spu_descontar_espacio_caja$$

CREATE PROCEDURE spu_descontar_espacio_caja (
  IN p_id_caja INT
)
BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas - 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;

  IF ROW_COUNT() = 0 THEN
      SELECT FALSE AS resultado;
  END IF;
END $$

DROP PROCEDURE IF EXISTS spu_recontar_espacio_caja$$

CREATE PROCEDURE spu_recontar_espacio_caja (
  IN p_id_caja INT
)
BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas + 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;
END $$

DROP PROCEDURE IF EXISTS spu_mufa_registrar$$

CREATE PROCEDURE spu_mufa_registrar(
  IN p_nombre VARCHAR(30),
  IN p_descripcion VARCHAR(100),
  IN p_coordenadas JSON,
  IN p_direccion VARCHAR(100),
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_mufas(nombre, descripcion, coordenadas, direccion, iduser_create)
  VALUES(p_nombre, p_descripcion, p_coordenadas, p_direccion, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS spu_buscar_cajas_sector_idCaja$$

CREATE PROCEDURE spu_buscar_cajas_sector_idCaja(
  IN p_id_caja INT
)
BEGIN
  DECLARE idSector INT;
  SELECT id_sector INTO idSector FROM tb_cajas WHERE id_caja = p_id_caja;
  SELECT id_caja, nombre, numero_entradas coordenadas FROM tb_cajas WHERE id_sector = idSector AND numero_entradas > 0;
END$$

DROP PROCEDURE IF EXISTS spu_actualizar_linea$$

CREATE PROCEDURE spu_actualizar_linea(
  IN p_id_caja INT,
  IN p_coordenadas JSON,
  IN p_id_user_create INT
)
BEGIN
  IF (p_id_caja = -1) THEN
    UPDATE tb_lineas
    SET coordenadas = p_coordenadas,
        update_at = NOW(),
        iduser_create = p_id_user_create
    WHERE id_linea = 1;
  ELSE
    UPDATE tb_lineas
    SET coordenadas = p_coordenadas,
        update_at = NOW(),
        iduser_create = p_id_user_create
    WHERE id_caja = p_id_caja;
  END IF;
END$$

DROP PROCEDURE IF EXISTS spu_caja_uso$$

CREATE PROCEDURE spu_caja_uso(
  IN p_id_caja INT
)
BEGIN
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN TRUE
      ELSE FALSE
    END as uso 
  FROM tb_contratos 
  WHERE JSON_EXTRACT(ficha_instalacion, '$.idcaja') = p_id_caja;
END$$

DROP PROCEDURE IF EXISTS spu_mufa_uso$$

CREATE PROCEDURE spu_mufa_uso(
  IN p_id_mufa INT
)
BEGIN
  SELECT
    CASE
      WHEN COUNT(*) > 0 THEN TRUE
      ELSE FALSE
    END as uso
  FROM tb_lineas
  WHERE id_mufa = p_id_mufa;
END$$

DROP PROCEDURE IF EXISTS spu_sector_desactivar$$

CREATE PROCEDURE spu_sector_desactivar(
  IN p_id_sector INT,
  IN p_id_user INT
)
BEGIN
  UPDATE tb_cajas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_sector = p_id_sector;
END$$

DROP PROCEDURE IF EXISTS spu_caja_eliminar$$

CREATE PROCEDURE spu_caja_eliminar(
  IN p_id_caja INT,
  IN p_id_user INT
)
BEGIN
  UPDATE tb_lineas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_caja = p_id_caja;
  UPDATE tb_cajas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_caja = p_id_caja;
END$$

DROP PROCEDURE IF EXISTS spu_mufa_eliminar$$

CREATE PROCEDURE spu_mufa_eliminar(
  IN p_id_mufa INT,
  IN p_id_user INT
)
BEGIN
  UPDATE tb_mufas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_mufa = p_id_mufa;
END$$

DROP PROCEDURE IF EXISTS spu_buscar_caja_id$$

CREATE PROCEDURE spu_buscar_caja_id(
  IN p_id_caja INT
)
BEGIN
  SELECT 
    id_caja, 
    nombre
  FROM tb_cajas 
  WHERE id_caja = p_id_caja;
END$$