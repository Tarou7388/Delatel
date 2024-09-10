DELIMITER $$ 

CREATE PROCEDURE spu_contratos_registrar(
    IN p_id_cliente INT,
    IN p_id_tarifario INT,
    IN p_id_sector INT,
    IN p_id_usuario_registro INT,
    IN p_direccion_servicio VARCHAR(200),
    IN p_referencia VARCHAR(200),
    IN p_coordenada VARCHAR(25),
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_fecha_registro DATE,
    IN p_ficha_instalacion JSON,
    IN p_nota TEXT
)
BEGIN
    -- Insertar en la tabla tb_contratos
    INSERT INTO tb_contratos (
        id_cliente,
        id_tarifario,
        id_sector,
        id_usuario_registro,
        direccion_servicio,
        referencia,
        coordenada,
        fecha_inicio,
        fecha_fin,
        fecha_registro,
        ficha_instalacion,
        nota,
        create_at
    ) VALUES (
        p_id_cliente,
        p_id_tarifario,
        p_id_sector,
        p_id_usuario_registro,
        p_direccion_servicio,
        p_referencia,
        p_coordenada,
        p_fecha_inicio,
        p_fecha_fin,
        p_fecha_registro,
        p_ficha_instalacion,
        p_nota,
        NOW()
    );
END $$