CREATE TABLE tb_logs_sistema (
    id_log BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_responsable INT NOT NULL,
    log_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    log_level VARCHAR(10) NOT NULL,
    table_name VARCHAR(64) NOT NULL,
    id_registro_modificado BIGINT,
    message TEXT NOT NULL,
    operador VARCHAR(50) DEFAULT 'SISTEMA'
) ENGINE = InnoDB;

CREATE TABLE tb_detalle_cambios (
    id_detalle BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_log BIGINT NOT NULL,
    id_registro BIGINT NOT NULL,
    campo VARCHAR(64) NOT NULL,
    valor_anterior TEXT,
    valor_nuevo TEXT,
    FOREIGN KEY (id_log) REFERENCES tb_logs_sistema(id_log) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tb_tablas_log (
    id_opcion INT PRIMARY KEY AUTO_INCREMENT,
    nombre_tabla VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    inactive_at TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;


INSERT INTO tb_tablas_log (nombre_tabla) VALUES
('tb_departamentos'),
('tb_provincias'),
('tb_distritos'),
('tb_roles'),
('tb_servicios'),
('tb_sectores'),
('tb_mufas'),
('tb_cajas'),
('tb_lineas'),
('tb_personas'),
('tb_empresas'),
('tb_usuarios'),
('tb_responsables'),
('tb_paquetes'),
('tb_clientes'),
('tb_contratos'),
('tb_contactabilidad'),
('tb_soporte'),
('tb_almacen'),
('tb_marca'),
('tb_tipoproducto'),
('tb_unidadmedida'),
('tb_productos'),
('tb_tipooperacion'),
('tb_kardex'),
('tb_base'),
('tb_subbase'),
('tb_antenas');

SELECT * FROM 
;

-- TRIGGER: Registro, actualización e inhabilitación de contrato (INSERT/UPDATE)
DROP TRIGGER IF EXISTS trg_contratos_log;
CREATE TRIGGER trg_contratos_log
AFTER INSERT ON tb_contratos
FOR EACH ROW
BEGIN
    -- INSERT: Registro de contrato
    INSERT INTO tb_logs_sistema (
        id_responsable,
        log_level,
        table_name,
        id_registro_modificado,
        message,
        operador
    )
    VALUES (
        NEW.id_usuario_registro,
        'INFO',
        'tb_contratos',
        NEW.id_contrato,
        CONCAT('Se registró el contrato de ', COALESCE(
            (SELECT
                CASE
                    WHEN c.id_persona IS NOT NULL THEN CONCAT(p2.nombres, ' ', p2.apellidos)
                    ELSE e.razon_social
                END
             FROM tb_clientes c
             LEFT JOIN tb_personas p2 ON c.id_persona = p2.id_persona
             LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa
             WHERE c.id_cliente = NEW.id_cliente
             LIMIT 1), 'Desconocido')),
        (SELECT u.nombre_user
           FROM tb_responsables r
           JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
          WHERE r.id_responsable = NEW.id_usuario_registro
          LIMIT 1)
    );
END;

CREATE TRIGGER trg_contratos_log_update
AFTER UPDATE ON tb_contratos
FOR EACH ROW
BEGIN
    -- UPDATE: Actualización de contrato
    IF (OLD.inactive_at IS NULL AND NEW.inactive_at IS NOT NULL) THEN
        -- Inhabilitación de contrato
        INSERT INTO tb_logs_sistema (
            id_responsable,
            log_level,
            table_name,
            id_registro_modificado,
            message,
            operador
        )
        VALUES (
            NEW.iduser_inactive,
            'INFO',
            'tb_contratos',
            NEW.id_contrato,
            CONCAT('Se inhabilitó el contrato de ', COALESCE(
                (SELECT
                    CASE
                        WHEN c.id_persona IS NOT NULL THEN CONCAT(p2.nombres, ' ', p2.apellidos)
                        ELSE e.razon_social
                    END
                 FROM tb_clientes c
                 LEFT JOIN tb_personas p2 ON c.id_persona = p2.id_persona
                 LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa
                 WHERE c.id_cliente = NEW.id_cliente
                 LIMIT 1), 'Desconocido')),
            (SELECT u.nombre_user
               FROM tb_responsables r
               JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
              WHERE r.id_responsable = NEW.iduser_inactive
              LIMIT 1)
        );
    ELSE
        -- Actualización de datos del contrato
        IF OLD.id_paquete <> NEW.id_paquete OR
           OLD.id_sector <> NEW.id_sector OR
           OLD.direccion_servicio <> NEW.direccion_servicio OR
           OLD.referencia <> NEW.referencia OR
           OLD.coordenada <> NEW.coordenada OR
           OLD.fecha_inicio <> NEW.fecha_inicio OR
           OLD.nota <> NEW.nota OR
           OLD.ficha_instalacion <> NEW.ficha_instalacion THEN

            INSERT INTO tb_logs_sistema (
                id_responsable,
                log_level,
                table_name,
                id_registro_modificado,
                message,
                operador
            )
            VALUES (
                NEW.iduser_update,
                'INFO',
                'tb_contratos',
                NEW.id_contrato,
                CONCAT(
                    'Se actualizó el contrato de ',
                    COALESCE(
                        (SELECT
                            CASE
                                WHEN c.id_persona IS NOT NULL THEN CONCAT(p2.nombres, ' ', p2.apellidos)
                                ELSE e.razon_social
                            END
                         FROM tb_clientes c
                         LEFT JOIN tb_personas p2 ON c.id_persona = p2.id_persona
                         LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa
                         WHERE c.id_cliente = NEW.id_cliente
                         LIMIT 1), 'Desconocido'),
                    '.'
                ),
                (SELECT u.nombre_user
                   FROM tb_responsables r
                   JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
                  WHERE r.id_responsable = NEW.iduser_update
                  LIMIT 1)
            );

            -- Insertar detalle de cambios solo para los campos que cambiaron
            IF OLD.id_paquete <> NEW.id_paquete THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'id_paquete', OLD.id_paquete, NEW.id_paquete);
            END IF;
            IF OLD.id_sector <> NEW.id_sector THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'id_sector', OLD.id_sector, NEW.id_sector);
            END IF;
            IF OLD.direccion_servicio <> NEW.direccion_servicio THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'direccion_servicio', OLD.direccion_servicio, NEW.direccion_servicio);
            END IF;
            IF OLD.referencia <> NEW.referencia THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'referencia', OLD.referencia, NEW.referencia);
            END IF;
            IF OLD.coordenada <> NEW.coordenada THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'coordenada', OLD.coordenada, NEW.coordenada);
            END IF;
            IF OLD.fecha_inicio <> NEW.fecha_inicio THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'fecha_inicio', OLD.fecha_inicio, NEW.fecha_inicio);
            END IF;
            IF OLD.nota <> NEW.nota THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'nota', OLD.nota, NEW.nota);
            END IF;
            IF OLD.ficha_instalacion <> NEW.ficha_instalacion THEN
                INSERT INTO tb_detalle_cambios (id_log, id_registro, campo, valor_anterior, valor_nuevo)
                VALUES (LAST_INSERT_ID(), NEW.id_contrato, 'ficha_instalacion', OLD.ficha_instalacion, NEW.ficha_instalacion);
            END IF;
        END IF;
    END IF;
END;


SELECT * FROM tb_logs_sistema;
SELECT * FROM tb_detalle_cambios;



DELIMITER $$

DROP PROCEDURE IF EXISTS SP_GETLOGS_BY_TABLE_AND_ID$$

CREATE PROCEDURE sp_getlogs_by_table_and_id(
    IN p_table_option INT,
    IN p_id_registro BIGINT
)
BEGIN
    DECLARE v_table_name VARCHAR(64);

    -- Busca el nombre de la tabla según la opción
    SELECT nombre_tabla INTO v_table_name
    FROM tb_tablas_log
    WHERE id_opcion = p_table_option
    LIMIT 1;

    IF v_table_name IS NOT NULL THEN
        SELECT 
            l.*, 
            d.id_detalle, d.campo, d.valor_anterior, d.valor_nuevo
        FROM tb_logs_sistema l
        LEFT JOIN tb_detalle_cambios d
            ON l.id_log = d.id_log
            AND d.id_registro = p_id_registro
        WHERE l.table_name = v_table_name
          AND l.id_registro_modificado = p_id_registro
        ORDER BY l.log_time DESC, d.id_detalle ASC;
    ELSE
        SELECT 'Opción de tabla no válida.' AS error;
    END IF;
END$$

DELIMITER ;

CALL sp_getlogs_by_table_and_id(16, 748);