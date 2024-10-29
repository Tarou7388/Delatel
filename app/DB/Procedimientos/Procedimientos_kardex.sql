USE Delatel;


DELIMITER $$

DROP VIEW IF EXISTS vw_kardex_listar$$
CREATE VIEW vw_kardex_listar AS
SELECT
    k.id_kardex,
    p.id_producto,
    p.modelo,
    p.id_tipo AS id_tipo_producto,
    tp.tipo_nombre AS tipo_producto,
    p.id_marca AS id_marca,
    m.marca AS nombre_marca,
    p.precio_actual,
    k.fecha,
    k.id_tipooperacion AS id_tipo_operacion,
    toper.descripcion AS tipo_operacion,
    k.cantidad,
    k.saldo_total,
    k.valor_unico_historico,
    k.create_at AS fecha_creacion
FROM tb_productos p
    JOIN tb_kardex k ON p.id_producto = k.id_producto
    JOIN tb_tipoproducto tp ON p.id_tipo = tp.id_tipo
    JOIN tb_marca m ON p.id_marca = m.id_marca
    JOIN tb_tipooperacion toper ON k.id_tipooperacion = toper.id_tipooperacion
ORDER BY k.create_at DESC $$

DROP PROCEDURE IF EXISTS spu_kardex_registrar$$
CREATE PROCEDURE spu_kardex_registrar(
    IN p_id_almacen INT, 
    IN p_id_producto INT,
    IN p_fecha DATE,
    IN p_tipo_operacion_texto VARCHAR(30), 
    IN p_cantidad INT,
    IN p_valor_unitario_historico DECIMAL(7,2),
    IN p_iduser_create INT
)
BEGIN
    DECLARE p_saldo_kardex_actual INT DEFAULT 0;
    DECLARE v_id_tipooperacion INT;
    DECLARE v_movimiento CHAR(1);

    SELECT id_tipooperacion, movimiento
    INTO v_id_tipooperacion, v_movimiento
    FROM tb_tipooperacion
    WHERE descripcion = p_tipo_operacion_texto
    LIMIT 1;

    IF v_id_tipooperacion IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tipo de operación no encontrado.';
    END IF;

    SELECT COALESCE(SUM(CASE WHEN id_tipooperacion = v_id_tipooperacion THEN cantidad ELSE -cantidad END), 0)
    INTO p_saldo_kardex_actual
    FROM tb_kardex
    WHERE id_producto = p_id_producto;

    -- Validar si el tipo de operación es SALIDA y hay suficiente saldo
    IF v_movimiento = 'S' THEN
        IF p_saldo_kardex_actual < p_cantidad THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficiente saldo para la salida.';
        END IF;
        SET p_saldo_kardex_actual = p_saldo_kardex_actual - p_cantidad;
    ELSE
        SET p_saldo_kardex_actual = p_saldo_kardex_actual + p_cantidad;
    END IF;

    INSERT INTO tb_kardex (
        id_almacen,
        id_producto,
        fecha,
        id_tipooperacion,
        cantidad,
        saldo_total,
        valor_unico_historico,
        create_at,
        iduser_create
    )
    VALUES (
        p_id_almacen,
        p_id_producto,
        p_fecha,
        v_id_tipooperacion,
        p_cantidad,
        p_saldo_kardex_actual,
        p_valor_unitario_historico,
        NOW(),
        p_iduser_create
    );
END $$


-- Procedimiento spu_kardex_buscar
DROP PROCEDURE IF EXISTS spu_kardex_buscar$$
CREATE PROCEDURE spu_kardex_buscar(
    IN p_id_producto INT
)
BEGIN
    SELECT * FROM vw_kardex_listar 
    WHERE id_producto = p_id_producto 
    ORDER BY id_kardex DESC;
END $$
