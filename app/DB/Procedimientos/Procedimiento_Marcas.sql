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

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_registrar_marca$$
CREATE PROCEDURE spu_registrar_marca(
    IN p_marca VARCHAR(70),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_marca (marca, create_at, iduser_create)
    VALUES (p_marca, NOW(), p_iduser_create);
END $$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_marcas_actualizar$$
CREATE PROCEDURE spu_marcas_actualizar(
    IN p_id_marca INT,
    IN p_marca VARCHAR(70),
    IN iduser_update INT
)
BEGIN
    UPDATE tb_marca
    SET marca = p_marca,
        update_at = NOW(),
        iduser_update = iduser_update
    WHERE id_marca = p_id_marca;
END $$


DELIMITER $$
DROP PROCEDURE IF EXISTS spu_registrar_tipo_producto$$
CREATE PROCEDURE spu_registrar_tipo_producto(
    IN p_tipo_nombre VARCHAR(70),
    IN p_iduser_create INT
)
BEGIN
    INSERT INTO tb_tipoproducto (tipo_nombre, create_at, iduser_create)
    VALUES (p_tipo_nombre, NOW(), p_iduser_create);
END $$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_actualizar_tipoproducto$$
CREATE PROCEDURE spu_actualizar_tipoproducto(
    IN p_id_tipo INT,
    IN p_tipo_nombre VARCHAR(250),
    IN p_iduser_update INT
)
BEGIN
    UPDATE tb_tipoproducto
    SET tipo_nombre = p_tipo_nombre,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_tipo = p_id_tipo;
END $$
