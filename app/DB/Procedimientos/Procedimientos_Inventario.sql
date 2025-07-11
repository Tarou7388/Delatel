-- SQLBook: Code
USE Delatel;

DELIMITER $$
DROP VIEW IF EXISTS vw_tipo_productos$$
CREATE VIEW vw_tipo_productos AS
	SELECT id_tipo,
    tipo_nombre,
    iduser_create,
    iduser_update
    FROM tb_tipoproducto 
    WHERE inactive_at IS NULL;

DROP VIEW IF EXISTS vw_almacen$$
CREATE VIEW vw_almacen AS
	SELECT id_almacen,
    nombre_almacen,
    ubicacion,
    coordenada,
    iduser_create,
	iduser_update
    FROM tb_almacen 
    WHERE inactive_at IS NULL;

DROP VIEW IF EXISTS vw_unidadmedida$$
CREATE VIEW vw_unidadmedida AS
	SELECT 
        id_unidad,
        unidad_nombre,
        create_at,
        update_at,
        iduser_create,
        iduser_update
	FROM 
        tb_unidadmedida;

DROP PROCEDURE IF EXISTS spu_productos_eliminar$$
CREATE PROCEDURE spu_productos_eliminar(
    IN p_id_producto INT,
    IN p_iduser_inactive INT
)
BEGIN
    UPDATE tb_productos 
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_producto = p_id_producto;
END $$

        
DROP PROCEDURE IF EXISTS spu_productos_buscar_barra$$

CREATE PROCEDURE spu_productos_buscar_barra(
    IN p_codigo_barra VARCHAR(120)
)
BEGIN
    SELECT
        p.id_producto,
        p.modelo,
        p.precio_actual,
        m.marca
    FROM
        tb_productos p
    INNER JOIN
        tb_marca m ON p.id_marca = m.id_marca
    INNER JOIN 
        tb_tipoproducto t ON p.id_tipo = t.id_tipo
    WHERE
        p.codigo_barra = p_codigo_barra
    AND
        p.inactive_at IS NULL;
END $$

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_productos_listar_tiposproductos$$
CREATE PROCEDURE spu_productos_listar_tiposproductos(
    IN codigobarra VARCHAR(120),
    IN tipo_producto VARCHAR(30),
    IN categoria CHAR(4)
)
BEGIN
    SELECT 
        p.id_producto,
        p.modelo,
        p.precio_actual,
        m.marca,
        p.codigo_barra,
        t.tipo_nombre
    FROM 
        tb_productos p
    INNER JOIN 
        tb_marca m ON p.id_marca = m.id_marca
    INNER JOIN 
        tb_tipoproducto t ON p.id_tipo = t.id_tipo
    INNER JOIN 
        tb_unidadmedida u ON p.id_unidad = u.id_unidad
    WHERE 
        p.codigo_barra LIKE CONCAT(codigobarra, '%')
        AND t.tipo_nombre = tipo_producto
        AND p.inactive_at IS NULL
        AND (
            categoria IS NULL 
            OR categoria = '' 
            OR p.categoria = categoria
        );
END $$

/*/************************************************************************************************/
/*/************************************************************************************************/
/*/************************************************************************************************/
/*/************************************************************************************************/

DELIMITER $$
DROP PROCEDURE IF EXISTS spu_productos_registrar$$
CREATE PROCEDURE spu_productos_registrar(
    IN p_id_marca INT,
    IN p_id_tipo INT,
    IN p_id_unidad INT,
    IN p_modelo VARCHAR(70),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_codigo_barra VARCHAR(120),
    IN p_iduser_create INT,
    IN p_categoria CHAR(4)
)
BEGIN
    INSERT INTO tb_productos (id_marca, id_tipo, id_unidad, modelo, precio_actual, codigo_barra, create_at, iduser_create, categoria)
    VALUES (p_id_marca, p_id_tipo, p_id_unidad, p_modelo, p_precio_actual, NULLIF(p_codigo_barra,''), NOW(), p_iduser_create, NULLIF(p_categoria, ''));
END $$

DROP PROCEDURE IF EXISTS spu_productos_actualizar$$
CREATE PROCEDURE spu_productos_actualizar(
    IN p_id_producto INT,
    IN p_id_marca INT,
    IN p_id_tipo INT,
    IN p_idUnidad INT,
    IN p_modelo VARCHAR(30),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_iduser_update INT,
    IN p_categoria CHAR(4)
)
BEGIN
    UPDATE tb_productos 
    SET 
        id_marca = p_id_marca,
        id_tipo = p_id_tipo,
        id_unidad = p_idUnidad,
        modelo = p_modelo,
        precio_actual = p_precio_actual,
        update_at = NOW(),
        iduser_update = p_iduser_update,
        categoria = NULLIF(p_categoria, '')
    WHERE id_producto = p_id_producto;
END $$

DELIMITER $$
DROP VIEW IF EXISTS vw_productos_detalle$$
CREATE VIEW vw_productos_detalle AS
    SELECT 
        p.id_producto,
        p.modelo,
        p.precio_actual,
        p.codigo_barra,
        m.marca,
        m.id_marca,
        t.tipo_nombre,
        t.id_tipo,
        u.unidad_nombre,
        u.id_unidad,
        p.categoria,
        p.create_at,
        p.update_at,
        p.inactive_at,
        p.iduser_create,
        p.iduser_update,
        p.iduser_inactive
    FROM 
        tb_productos p
    INNER JOIN 
        tb_marca m ON p.id_marca = m.id_marca
    INNER JOIN 
        tb_tipoproducto t ON p.id_tipo = t.id_tipo
    INNER JOIN 
        tb_unidadmedida u ON p.id_unidad = u.id_unidad
    WHERE 
        p.inactive_at IS NULL;