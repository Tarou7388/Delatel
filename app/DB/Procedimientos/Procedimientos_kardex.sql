USE Delatel;

DELIMITER $$

DROP PROCEDURE IF EXISTS spu_listar_tipo_operacion$$

CREATE PROCEDURE spu_listar_tipo_operacion(IN tipo_movimiento CHAR(1))
BEGIN
    SELECT id_tipooperacion, descripcion, movimiento 
    FROM tb_tipooperacion 
    WHERE movimiento = tipo_movimiento;
END $$

DROP VIEW IF EXISTS vw_kardex_listar;

CREATE VIEW vw_kardex_listar AS
SELECT
    k.id_kardex,
    p.id_producto,
    p.modelo,
    CONCAT(tp.tipo_nombre, ' ', p.modelo) AS producto,
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
    CONCAT(pe.nombres,' ',pe.apellidos) AS creado_por,
    toper.movimiento AS tipo_movimiento
FROM
    tb_productos p
    JOIN tb_kardex k ON p.id_producto = k.id_producto
    JOIN tb_tipoproducto tp ON p.id_tipo = tp.id_tipo
    JOIN tb_marca m ON p.id_marca = m.id_marca
    JOIN tb_tipooperacion toper ON k.id_tipooperacion = toper.id_tipooperacion
    JOIN tb_almacen a ON k.id_almacen = a.id_almacen
    LEFT JOIN tb_responsables res ON k.iduser_create = res.id_responsable
    LEFT JOIN tb_usuarios usu ON res.id_usuario = usu.id_usuario
    LEFT JOIN tb_personas pe ON usu.id_persona = pe.id_persona
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
    
    SELECT movimiento
    INTO v_movimiento
    FROM tb_tipooperacion
    WHERE id_tipooperacion = p_id_tipooperacion
    LIMIT 1;
    
    IF v_movimiento IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tipo de operación no encontrado.';
    END IF;
    
    SELECT COALESCE(saldo_total, 0)
    INTO v_saldo_kardex_actual
    FROM tb_kardex
    WHERE id_producto = p_id_producto
    AND id_almacen = p_id_almacen
    ORDER BY create_at DESC
    LIMIT 1;
    
    IF v_movimiento = 'S' THEN        
        IF v_saldo_kardex_actual = 0 OR p_cantidad > v_saldo_kardex_actual THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficiente saldo para la salida.';
        END IF;        
        SET v_nuevo_saldo = v_saldo_kardex_actual - p_cantidad;
    ELSE        
        SET v_nuevo_saldo = v_saldo_kardex_actual + p_cantidad;
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

CREATE VIEW vw_productos_kardex AS
SELECT 
    p.id_producto,
    m.marca,
    tp.tipo_nombre AS tipo_producto,
    p.modelo,
    um.unidad_nombre AS unidad_medida,
    p.precio_actual,
    p.codigo_barra,
    p.categoria,
    COALESCE(SUM(
        CASE 
            WHEN t_op.movimiento = 'E' THEN k.cantidad 
            WHEN t_op.movimiento = 'S' THEN -k.cantidad 
            ELSE 0 
        END
    ), 0) AS stock_total,
    GROUP_CONCAT(DISTINCT a.nombre_almacen ORDER BY a.nombre_almacen SEPARATOR ', ') AS almacenes_con_stock,
    p.create_at,
    p.update_at,
    CASE WHEN p.inactive_at IS NULL THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM 
    tb_productos p
INNER JOIN 
    tb_marca m ON p.id_marca = m.id_marca
INNER JOIN 
    tb_tipoproducto tp ON p.id_tipo = tp.id_tipo
INNER JOIN 
    tb_unidadmedida um ON p.id_unidad = um.id_unidad
LEFT JOIN 
    tb_kardex k ON p.id_producto = k.id_producto
LEFT JOIN 
    tb_tipooperacion t_op ON k.id_tipooperacion = t_op.id_tipooperacion
LEFT JOIN 
    tb_almacen a ON k.id_almacen = a.id_almacen
GROUP BY 
    p.id_producto, m.marca, tp.tipo_nombre, p.modelo, um.unidad_nombre, 
    p.precio_actual, p.codigo_barra, p.categoria, p.create_at, p.update_at, p.inactive_at
ORDER BY 
    m.marca, p.modelo;
