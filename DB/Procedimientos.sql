USE Delatel;

DELIMITER //

CREATE PROCEDURE spu_productos_agregar(
    IN p_marca VARCHAR(30),
    IN p_nombre VARCHAR(60),
    IN p_modelo VARCHAR(30),
    IN p_precio_actual DECIMAL(7, 2),
    IN p_codigo_barra VARCHAR(120)
)
BEGIN
    INSERT INTO tb_productos (marca, nombre, modelo, precio_actual, codigo_barra, create_at)
    VALUES (p_marca, p_nombre, p_modelo, p_precio_actual, p_codigo_barra, NOW());
END //

DELIMITER ;

CREATE VIEW vw_kardex AS
SELECT
    k.id_kardex,
    p.modelo,
    p.nombre,
    p.marca,
    p.precio_actual,
    k.fecha,
    k.tipo_operacion,
    k.motivo,
    k.cantidad,
    k.saldo_total,
    k.valor_unico_historico,
    k.create_at AS fecha_creacion
FROM
    tb_productos p
JOIN
    tb_kardex k ON p.id_producto = k.id_producto
ORDER BY 
    k.create_at DESC;

DELIMITER $$

CREATE PROCEDURE spu_kardex_registrar(
    IN p_id_producto INT,
    IN p_fecha DATE,
    IN p_tipo_operacion VARCHAR(20),
    IN p_motivo VARCHAR(90),
    IN p_cantidad INT,
    IN p_valor_unitario_historico DECIMAL(7,2)
)
BEGIN
    DECLARE p_saldo_kardex_actual INT DEFAULT 0;
    
    SELECT saldo_total
    INTO p_saldo_kardex_actual
    FROM tb_kardex
    WHERE id_producto = p_id_producto
    ORDER BY fecha DESC
    LIMIT 1;

    IF p_saldo_kardex_actual IS NULL THEN
        SET p_saldo_kardex_actual = 0;
    END IF;

    IF p_tipo_operacion = 'SALIDA' THEN
        IF p_saldo_kardex_actual < p_cantidad THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficiente saldo para la salida.';
        END IF;
    END IF;

    IF p_tipo_operacion = 'ENTRADA' THEN
        SET p_saldo_kardex_actual = p_saldo_kardex_actual + p_cantidad;
    ELSEIF p_tipo_operacion = 'SALIDA' THEN
        SET p_saldo_kardex_actual = p_saldo_kardex_actual - p_cantidad;
    END IF;

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