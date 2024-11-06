USE Delatel;


DELIMITER $$

DROP PROCEDURE IF EXISTS spu_listar_tipo_operacion$$
CREATE PROCEDURE spu_listar_tipo_operacion(IN tipo_movimiento CHAR(1))
BEGIN
    SELECT id_tipooperacion, descripcion, movimiento 
    FROM tb_tipooperacion 
    WHERE movimiento = tipo_movimiento;
END $$

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
    k.create_at AS fecha_creacion,
    k.id_almacen,
    a.nombre_almacen,
    CASE 
        WHEN toper.movimiento = 'E' THEN 'ENTRADA'
        WHEN toper.movimiento = 'S' THEN 'SALIDA'
    END AS tipo_movimiento
FROM tb_productos p
    JOIN tb_kardex k ON p.id_producto = k.id_producto
    JOIN tb_tipoproducto tp ON p.id_tipo = tp.id_tipo
    JOIN tb_marca m ON p.id_marca = m.id_marca
    JOIN tb_tipooperacion toper ON k.id_tipooperacion = toper.id_tipooperacion
    JOIN tb_almacen a ON k.id_almacen = a.id_almacen
ORDER BY k.create_at DESC;

DROP PROCEDURE IF EXISTS spu_kardex_registrar$$
CREATE PROCEDURE spu_kardex_registrar(
    IN p_id_almacen INT, 
    IN p_id_producto INT,
    IN p_fecha DATE,
    IN p_id_tipooperacion INT, 
    IN p_cantidad INT,
    IN p_valor_unitario_historico DECIMAL(7,2),
    IN p_iduser_create INT
)
BEGIN
    DECLARE v_saldo_kardex_actual DECIMAL(10,2) DEFAULT 0;
    DECLARE v_movimiento CHAR(1);
    DECLARE v_nuevo_saldo DECIMAL(10,2);

    -- Obtener el tipo de movimiento (E para entrada, S para salida)
    SELECT movimiento
    INTO v_movimiento
    FROM tb_tipooperacion
    WHERE id_tipooperacion = p_id_tipooperacion
    LIMIT 1;

    -- Validar si el tipo de operación existe
    IF v_movimiento IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tipo de operación no encontrado.';
    END IF;

    -- Obtener el saldo actual del producto específico por almacén o 0 si no existen registros previos
    SELECT COALESCE(saldo_total, 0)
    INTO v_saldo_kardex_actual
    FROM tb_kardex
    WHERE id_producto = p_id_producto
    AND id_almacen = p_id_almacen
    ORDER BY create_at DESC
    LIMIT 1;

    -- Calcular el nuevo saldo en función del tipo de movimiento
    IF v_movimiento = 'S' THEN
        -- Verificar que hay suficiente saldo para la salida
        IF v_saldo_kardex_actual = 0 OR p_cantidad > v_saldo_kardex_actual THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficiente saldo para la salida.';
        END IF;
        -- Realizar la resta
        SET v_nuevo_saldo = v_saldo_kardex_actual - p_cantidad;
    ELSE
        -- Realizar la suma para entrada
        SET v_nuevo_saldo = v_saldo_kardex_actual + p_cantidad;
    END IF;

    -- Insertar el movimiento en el kardex para el almacén específico
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
        p_id_tipooperacion,
        p_cantidad,
        v_nuevo_saldo,
        p_valor_unitario_historico,
        NOW(),
        p_iduser_create
    );
END$$

DROP PROCEDURE IF EXISTS spu_kardex_buscar$$
CREATE PROCEDURE spu_kardex_buscar(
    IN p_id_producto INT
)
BEGIN
    SELECT * FROM vw_kardex_listar 
    WHERE id_producto = p_id_producto 
    ORDER BY id_kardex DESC;
END $$
