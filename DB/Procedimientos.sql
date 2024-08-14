DELIMITER //
CREATE PROCEDURE spu_productos_agregar(
    IN _tipo_producto VARCHAR(30),
    IN _nombre VARCHAR(60),
    IN _marca VARCHAR(30),
    IN _precio_actual DECIMAL(7, 2)
)
BEGIN
    -- Insertar un nuevo registro en la tabla 'tb_producto'
    INSERT INTO tb_producto (tipo_producto, nombre, marca, precio_actual, create_at)
    VALUES (_tipo_producto, _nombre, _marca, _precio_actual, NOW());
END //
DELIMITER ;

/*/-----------------------VIEW DEL KARDEX-------------------------/*/
CREATE VIEW vw_kardex AS
SELECT
	k.id_kardex,
    p.tipo_producto as producto,
    p.nombre,
    p.marca,
    p.precio_actual,
    k.fecha,
    k.tipo_operacion,
    k.motivo,
    k.cantidad,
    k.saldo_total,
    k.valor_unico_historico,
    k.create_at as fecha_creacion
FROM
    tb_producto p
JOIN
    tb_kardex k ON p.id_producto = k.id_producto
ORDER BY 
	k.create_at DESC;
/*/-----------------------VIEW DEL KARDEX-------------------------/*/

/*/----------------------------------------------- /*/
DELIMITER $$
CREATE PROCEDURE spu_registrar_kardex(
    IN p_id_producto INT,
    IN p_fecha DATE,
    IN p_tipo_operacion VARCHAR(20),
    IN p_motivo VARCHAR(90),
    IN p_cantidad INT,
    IN p_valor_unitario_historico DECIMAL(7,2)
)
BEGIN
    DECLARE p_saldo_kardex_actual INT DEFAULT 0;
    
    -- Obtener el saldo actual
    SELECT saldo_total
    INTO p_saldo_kardex_actual
    FROM tb_kardex
    WHERE id_producto = p_id_producto
    ORDER BY fecha DESC
    LIMIT 1;

    -- En caso sea nulo, se pone como 0
    IF p_saldo_kardex_actual IS NULL THEN
        SET p_saldo_kardex_actual = 0;
    END IF;

    -- En caso de superar a la cantidad actual en la salida se bloquea el proceso
    IF p_tipo_operacion = 'SALIDA' THEN
        IF p_saldo_kardex_actual < p_cantidad THEN
            SIGNAL SQLSTATE '45000';
        END IF;
    END IF;

    -- Actualizar el saldo según el tipo de operación
    IF p_tipo_operacion = 'ENTRADA' THEN
        SET p_saldo_kardex_actual = p_saldo_kardex_actual + p_cantidad;
    ELSEIF p_tipo_operacion = 'SALIDA' THEN
        SET p_saldo_kardex_actual = p_saldo_kardex_actual - p_cantidad;
    END IF;

    -- Insertar el nuevo movimiento en la tabla tb_kardex
    INSERT INTO tb_kardex (
        id_producto,
        fecha,
        tipo_operacion,
        motivo,
        cantidad,
        saldo_total,
        valor_unico_historico,
        create_at
    )
    VALUES (
        p_id_producto,
        p_fecha,
        p_tipo_operacion,
        p_motivo,
        p_cantidad,
        p_saldo_kardex_actual,
        p_valor_unitario_historico,
        NOW()
    );
END $$
DELIMITER ;

/*
CALL spu_productos_agregar("A","B","C",25.00);
SELECT * FROM tb_producto;
CALL spu_registrar_kardex(
    1,                    -- p_id_producto
    '2024-08-12',         -- p_fecha
    'SALIDA',             -- p_tipo_operacion
    'b',                  -- p_motivo
    100,                   -- p_cantidad
    29.00                 -- p_valor_unitario_historico
);
SELECT * FROM vw_kardex;
*/
