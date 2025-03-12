-- SQLBook: Code
USE Delatel;

DROP PROCEDURE IF EXISTS spu_cajas_listar;

DELIMITER $$

CREATE PROCEDURE spu_cajas_listar()
BEGIN
  SELECT 
    c.id_caja, 
    c.nombre, 
    c.descripcion, 
    c.numero_entradas, 
    c.id_sector,
    s.sector,
    c.coordenadas 
  FROM tb_cajas c
  INNER JOIN tb_sectores s ON c.id_sector = s.id_sector
  WHERE c.inactive_at IS NULL;
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
  IN p_tipo_linea CHAR(1),
  IN p_iduser_create INT
)
BEGIN
  INSERT INTO tb_lineas(id_mufa, id_caja, coordenadas, tipo_linea, iduser_create)
  VALUES(p_id_mufa, p_id_caja, p_coordenadas, p_tipo_linea, p_iduser_create);
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
    nombre,
    id_sector
  FROM tb_cajas 
  WHERE id_caja = p_id_caja;
END$$

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_cajas_buscar_multiple$$

CREATE PROCEDURE spu_cajas_buscar_multiple(IN _ids_lista VARCHAR(1000))
BEGIN
    IF _ids_lista IS NULL OR _ids_lista = '' THEN
        -- Si la lista está vacía, devolvemos un conjunto vacío
        SELECT id_caja, nombre, id_sector 
        FROM cajas 
        WHERE 1 = 0; -- Condición falsa para devolver conjunto vacío
    ELSE
        SET @sql = CONCAT('SELECT id_caja, nombre, id_sector 
                          FROM tb_cajas 
                          WHERE id_caja IN (', _ids_lista, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DROP PROCEDURE IF EXISTS spu_sectores_buscar_multiple$$

CREATE PROCEDURE spu_sectores_buscar_multiple(IN _ids_lista VARCHAR(1000))
BEGIN
    IF _ids_lista IS NULL OR _ids_lista = '' THEN
        -- Si la lista está vacía, devolvemos un conjunto vacío
        SELECT id_sector, sector 
        FROM sectores 
        WHERE 1 = 0; -- Condición falsa para devolver conjunto vacío
    ELSE
        SET @sql = CONCAT('SELECT id_sector, sector 
                          FROM tb_sectores 
                          WHERE id_sector IN (', _ids_lista, ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END $$