DELIMITER //
CREATE PROCEDURE spu_productos_agregar(
    IN _tipo_producto VARCHAR(30),
    IN _descripcion VARCHAR(60),
    IN _marca VARCHAR(30),
    IN _precio_actual DECIMAL(7, 2)
)
BEGIN
    -- Insertar un nuevo registro en la tabla 'tb_producto'
    INSERT INTO tb_producto (tipo_producto, descripcion, marca, precio_actual, create_at)
    VALUES (_tipo_producto, _descripcion, _marca, _precio_actual, NOW());
END //
DELIMITER ;



CALL spu_productos_agregar("A","B","C",10.50);

SELECT * FROM tb_producto;

/*/------------------------------------------------/*/

CREATE VIEW vs_kardex AS
SELECT 
    K.id_kardex,
    P.tipo_producto,
    P.nombre as producto,
    P.marca,
    K.fecha,
    K.tipo_operacion,
    K.motivo,
    K.cantidad,
    K.valor_unitario_historico,
    P.precio_actual,
    K.saldo_total
FROM 
    tb_kardex K
INNER JOIN 
    tb_producto P ON K.idproducto = P.idproducto
ORDER BY 
    K.fecha DESC;


/*/----------------------------------------------- /*/
DELIMITER $$

CREATE PROCEDURE spu_registrar_kardex(
    IN p_id_producto INT,
    IN p_fecha DATE,
    IN p_tipo_operacion VARCHAR(20),
    IN p_motivo VARCHAR(90),
    IN p_cantidad INT,
    IN p_valor_unitario_historico DECIMAL(7,2),
    IN p_saldo_total INT
)
BEGIN
    DECLARE p_saldo_kardex_actual INT DEFAULT 0;

    -- Obtener el saldo actual del producto
    SELECT cantidad
    INTO p_saldo_kardex_actual
    FROM tb_kardex
    WHERE id_producto = p_id_producto
    ORDER BY fecha DESC
    LIMIT 1;

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

CALL spu_registrar_kardex(
    1,               -- p_id_producto
    '2024-08-09',    -- p_fecha
    'SALIDA',       -- p_tipo_operacion
    'Daño de fabrica', -- p_motivo
    10,             -- p_cantidad
    25.50,           -- p_valor_unitario_historico
    1000             -- p_saldo_total
);

SELECT * FROM tb_kardex;