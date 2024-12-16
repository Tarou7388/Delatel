-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-12-2024 a las 22:58:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delatel`
--
DROP DATABASE IF EXISTS `Delatel`;
CREATE DATABASE IF NOT EXISTS `Delatel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `Delatel`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `spu_averias_contratos_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_averias_contratos_listar` (IN `p_id_contrato` INT)   BEGIN
    SELECT 
        s.id_soporte,
        ts.tipo_soporte,
        CONCAT(p.nombres, ' ', p.apellidos) AS nombre_tecnico,
        s.soporte,
        s.descripcion_solucion,
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia
    FROM 
        tb_soporte s
    JOIN 
        tb_responsables r ON s.id_tecnico = r.id_responsable
    JOIN 
        tb_usuarios u ON r.id_usuario = u.id_usuario
    JOIN 
        tb_personas p ON u.id_persona = p.id_persona
    JOIN 
        tb_tipo_soporte ts ON s.id_tipo_soporte = ts.id_tipo_soporte
    WHERE 
        s.id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_buscar_datos_cliente_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_buscar_datos_cliente_id` (`p_id_cliente` INT)   BEGIN
    SELECT
        c.id_cliente,
        COALESCE(
            CONCAT(p.nombres, ", ", p.apellidos),
            e.nombre_comercial
        ) AS nombre_cliente,
        COALESCE(p.nro_doc, e.ruc) AS identificador_cliente,
        p.nacionalidad,  
        CASE 
            WHEN p.nro_doc IS NOT NULL THEN p.tipo_doc
            ELSE 'RUC'
        END AS tipo_doc,
        COALESCE(p.telefono, e.telefono) AS telefono,
        COALESCE(p.email, e.email) AS email,
        c.direccion,
        c.referencia,
        c.coordenadas
    FROM
        tb_clientes c
        LEFT JOIN tb_personas p ON c.id_persona = p.id_persona
        LEFT JOIN tb_empresas e ON c.id_empresa = e.id_empresa
    WHERE
        c.id_cliente = p_id_cliente;
END$$

DROP PROCEDURE IF EXISTS `spu_buscar_ficha_por_dni`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_buscar_ficha_por_dni` (IN `p_dni` VARCHAR(20), IN `p_servicio` VARCHAR(10), IN `p_coordenada` VARCHAR(50))   BEGIN
    SELECT * FROM 
        vw_soporte_fichadatos
    WHERE 
        nro_doc = p_dni
        AND tipo_servicio = p_servicio
        AND coordenada = p_coordenada
    ORDER BY 
        update_at DESC LIMIT 1;
END$$

DROP PROCEDURE IF EXISTS `spu_cajas_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_cajas_listar` ()   BEGIN
  SELECT 
    id_caja, 
    nombre, 
    descripcion, 
    numero_entradas, 
    id_sector, 
    coordenadas 
  FROM tb_cajas;
END$$

DROP PROCEDURE IF EXISTS `spu_cajas_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_cajas_registrar` (IN `p_nombre` VARCHAR(30), IN `p_descripcion` VARCHAR(100), IN `p_numero_entradas` TINYINT, IN `p_id_sector` INT, IN `p_coordenadas` VARCHAR(50), IN `p_iduser_create` INT)   BEGIN
  INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_sector, coordenadas, iduser_create)
  VALUES(p_nombre, p_descripcion, p_numero_entradas, p_id_sector, p_coordenadas, p_iduser_create);
  SELECT LAST_INSERT_ID() AS id_caja;
END$$

DROP PROCEDURE IF EXISTS `spu_clientesPersonas_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_clientesPersonas_actualizar` (`p_identificador` VARCHAR(15), `p_nombre` VARCHAR(100), `p_apellidos` VARCHAR(30), `p_email` VARCHAR(100), `p_telefono` CHAR(9), `p_direccion` VARCHAR(250), `p_referencia` VARCHAR(150), `p_coordenadas` VARCHAR(50), `p_iduser_update` INT)   BEGIN
    DECLARE v_tipo_doc CHAR(3);
    DECLARE v_nro_doc VARCHAR(15);
    IF LENGTH(p_identificador) = 8 THEN
        SET v_tipo_doc = 'DNI';
        SET v_nro_doc = p_identificador;
        UPDATE tb_personas
        SET 
            nombres = p_nombre,
            apellidos = p_apellidos,
            email = p_email,
            telefono = p_telefono,
            update_at = NOW(),
            iduser_update = p_iduser_update
        WHERE nro_doc = v_nro_doc AND tipo_doc = v_tipo_doc AND inactive_at IS NULL;
    ELSEIF LENGTH(p_identificador) = 11 THEN
        SET v_tipo_doc = 'RUC';
        SET v_nro_doc = p_identificador;
        UPDATE tb_empresas
        SET 
            nombre_comercial = p_nombre,
            email = p_email,
            telefono = p_telefono,
            update_at = NOW(),
            iduser_update = p_iduser_update
        WHERE ruc = v_nro_doc AND inactive_at IS NULL;
    END IF;
    UPDATE tb_clientes
    SET 
        direccion = p_direccion,
        referencia = p_referencia,
        coordenadas = p_coordenadas,
        update_at = NOW()
    WHERE id_cliente = (
        SELECT id_cliente
        FROM tb_clientes
        WHERE (id_persona IN (
                SELECT id_persona FROM tb_personas WHERE nro_doc = v_nro_doc AND tipo_doc = v_tipo_doc
            ) OR id_empresa IN (
                SELECT id_empresa FROM tb_empresas WHERE ruc = v_nro_doc
            )) AND inactive_at IS NULL
    );
END$$

DROP PROCEDURE IF EXISTS `spu_clientes_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_clientes_eliminar` (`p_identificador` VARCHAR(15), `p_iduser_inactive` INT)   BEGIN
    DECLARE v_tipo_doc CHAR(3);
    DECLARE v_nro_doc VARCHAR(15);
    IF LENGTH(p_identificador) = 8 THEN
        SET v_tipo_doc = 'DNI';
        SET v_nro_doc = p_identificador;
    ELSEIF LENGTH(p_identificador) = 11 THEN
        SET v_tipo_doc = 'RUC';
        SET v_nro_doc = p_identificador;
    END IF;
    UPDATE tb_clientes
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_cliente = (
        SELECT id_cliente
        FROM tb_clientes
        WHERE (id_persona IN (
                SELECT id_persona FROM tb_personas WHERE nro_doc = v_nro_doc AND tipo_doc = v_tipo_doc
            ) OR id_empresa IN (
                SELECT id_empresa FROM tb_empresas WHERE ruc = v_nro_doc
            )) AND inactive_at IS NULL
    );
END$$

DROP PROCEDURE IF EXISTS `spu_clientes_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_clientes_registrar` (`p_id_persona` INT, `p_id_empresa` INT, `p_direccion` VARCHAR(50), `p_referencia` VARCHAR(150), `p_iduser_create` INT, `p_coordenadas` VARCHAR(50))   BEGIN
    IF p_id_empresa = '' THEN
        SET p_id_empresa = NULL;
    ELSEIF p_id_persona = '' THEN
        SET p_id_persona = NULL;
    END IF;
    INSERT INTO tb_clientes(id_persona, id_empresa, direccion, referencia, iduser_create, coordenadas) 
    VALUES (p_id_persona, p_id_empresa, p_direccion, p_referencia, p_iduser_create, p_coordenadas);
    SELECT LAST_INSERT_ID() AS id_cliente;
END$$

DROP PROCEDURE IF EXISTS `spu_cliente_buscar_NombreApp`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_cliente_buscar_NombreApp` (IN `p_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50))   BEGIN
    IF p_apellido = '' THEN
        -- Si solo se proporciona el nombre
        SELECT codigo_cliente, nombre_cliente, telefono_cliente
        FROM vw_clientes_obtener
        WHERE nombre_cliente LIKE CONCAT('%', p_nombre, '%');
    ELSE
        -- Si se proporciona tanto nombre como apellido
        SELECT codigo_cliente, nombre_cliente, telefono_cliente
        FROM vw_clientes_obtener
        WHERE nombre_cliente LIKE CONCAT('%', p_nombre, '%')
          AND nombre_cliente LIKE CONCAT('%', p_apellido, '%');
    END IF;
END$$

DROP PROCEDURE IF EXISTS `spu_cliente_buscar_nrodoc`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_cliente_buscar_nrodoc` (IN `p_documento` VARCHAR(15))   BEGIN
    IF LENGTH(p_documento) IN (8, 9, 12) THEN
        SELECT 
            c.id_cliente,
            c.direccion,
            p.nacionalidad,
            c.referencia,
            c.coordenadas,
            CONCAT(p.apellidos, ', ', p.nombres) AS nombre,
            p.email,
            p.telefono
        FROM 
            tb_clientes c
        LEFT JOIN 
            tb_personas p ON c.id_persona = p.id_persona
        WHERE 
            p.nro_doc = p_documento;
    ELSEIF LENGTH(p_documento) = 11 THEN
        SELECT 
            c.id_cliente,
            c.direccion,
            c.referencia,
            c.coordenadas,
            e.nombre_comercial AS nombre,
            e.email,
            e.telefono
        FROM 
            tb_clientes c
        LEFT JOIN 
            tb_empresas e ON e.id_empresa = c.id_empresa
        WHERE 
            e.ruc = p_documento;
    END IF;
END$$

DROP PROCEDURE IF EXISTS `spu_contactabilidad_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contactabilidad_actualizar` (`p_id_contactabilidad` INT, `p_id_persona` INT, `p_id_paquete` INT, `p_direccion_servicio` VARCHAR(250), `p_nota` TEXT, `p_fecha_limite` DATETIME, `p_iduser_update` INT)   BEGIN
    UPDATE tb_contactabilidad
    SET
        id_persona = p_id_persona,
        id_paquete = p_id_paquete,
        direccion_servicio = p_direccion_servicio,
        nota = p_nota,
        fecha_limite = p_fecha_limite,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE 
        id_contactabilidad = p_id_contactabilidad;
END$$

DROP PROCEDURE IF EXISTS `spu_contactabilidad_inhabilitar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contactabilidad_inhabilitar` ()   BEGIN
    UPDATE tb_contactabilidad
    SET 
        inactive_at = NOW(),
        iduser_inactive = CASE 
            WHEN iduser_update IS NOT NULL THEN iduser_update 
            ELSE iduser_create 
        END
    WHERE fecha_limite <= NOW() AND inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_contactabilidad_inhabilitarManual`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contactabilidad_inhabilitarManual` (`p_id_contactabilidad` INT, `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_contactabilidad
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE
        id_contactabilidad = p_id_contactabilidad;
END$$

DROP PROCEDURE IF EXISTS `spu_contactabilidad_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contactabilidad_registrar` (`p_id_persona` INT, `p_id_empresa` INT, `p_id_paquete` INT, `p_direccion_servicio` VARCHAR(250), `p_nota` TEXT, `p_iduser_create` INT, `p_fecha_limite` DATE)   BEGIN
    INSERT INTO tb_contactabilidad (id_persona, id_empresa, id_paquete, direccion_servicio, nota, iduser_create, fecha_limite)
    VALUES (p_id_persona, p_id_empresa, p_id_paquete, p_direccion_servicio, p_nota, p_iduser_create, p_fecha_limite);
    SELECT LAST_INSERT_ID() AS id_contactabilidad;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contratos_actualizar` (IN `p_id_contrato` INT, IN `p_id_paquete` INT, IN `p_direccion_servicio` VARCHAR(200), IN `p_referencia` VARCHAR(200), IN `p_coordenada` VARCHAR(25), IN `p_nota` TEXT, IN `p_iduser_update` INT)   BEGIN
    UPDATE tb_contratos
    SET
        id_paquete = p_id_paquete,
        direccion_servicio = p_direccion_servicio,
        referencia = p_referencia,
        coordenada = p_coordenada,
        nota = p_nota,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_buscar_cliente`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contratos_buscar_cliente` (IN `p_id_cliente` INT)   BEGIN
    SELECT 
        c.id_contrato, 
        GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
        s.sector, 
        p.paquete,
        c.id_usuario_registro,
        c.referencia,
        c.fecha_inicio,
        c.nota,
        c.direccion_servicio,
        c.nota
    FROM 
        tb_contratos c
    JOIN 
        tb_paquetes p ON c.id_paquete = p.id_paquete
    JOIN 
        tb_sectores s ON c.id_sector = s.id_sector
    LEFT JOIN tb_servicios sv ON JSON_CONTAINS(p.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
    WHERE 
        c.id_cliente = p_id_cliente AND c.inactive_at IS NULL
    GROUP BY
        c.id_contrato,
        s.sector,
        p.paquete,
        c.id_usuario_registro,
        c.referencia,
        c.fecha_inicio,
        c.nota,
        c.direccion_servicio;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contratos_eliminar` (`p_id_contrato` INT, `p_iduser_inactive` INT)   BEGIN

    UPDATE 
    tb_contratos 
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive,
        fecha_fin = NOW()
    WHERE 
        id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_JsonFichabyId`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contratos_JsonFichabyId` (IN `p_id_contrato` INT)   BEGIN
    SELECT 
        ficha_instalacion
    FROM 
        tb_contratos
    WHERE 
        id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_pdf`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contratos_pdf` (IN `p_id_contrato` INT)   BEGIN
    SELECT 
        co.id_contrato,
        cl.id_cliente AS IdCliente,
        IFNULL(CONCAT(p.nombres, ' ', p.apellidos), e.razon_social) AS NombreCliente,
        IFNULL(p.nro_doc, e.ruc) AS NumeroDocumento,
        IFNULL(p.email, e.email) AS Correo,
        IFNULL(p.telefono, e.telefono) AS Telefono,
        cl.direccion AS DireccionPersona,
        co.direccion_servicio AS DireccionContrato,
        co.referencia AS Referencia,
        CASE 
            WHEN e.ruc IS NOT NULL THEN 'Empresa Peruana'
            WHEN LENGTH(p.nro_doc) = 8 THEN 'Peruano'
            ELSE 'Extranjero'
        END AS Nacionalidad,
        IFNULL(e.representante_legal, '') AS RepresentanteLegal,
        pa.paquete AS NombrePaquete,
        pa.precio AS PrecioPaquete,
        pa.velocidad AS VelocidadPaquete,
        co.nota,
        co.create_at AS FechaCreacion,
        co.ficha_instalacion AS FichaTecnica,
        s.sector AS Sector,
        d.departamento AS Departamento,
        pr.provincia AS Provincia,
        di.distrito AS Distrito
    FROM 
        tb_contratos co
    JOIN 
        tb_clientes cl ON co.id_cliente = cl.id_cliente
    LEFT JOIN 
        tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN 
        tb_empresas e ON cl.id_empresa = e.id_empresa
    LEFT JOIN 
        tb_paquetes pa ON co.id_paquete = pa.id_paquete
    LEFT JOIN 
        tb_sectores s ON co.id_sector = s.id_sector
    LEFT JOIN 
        tb_distritos di ON s.id_distrito = di.id_distrito
    LEFT JOIN 
        tb_provincias pr ON di.id_provincia = pr.id_provincia
    LEFT JOIN 
        tb_departamentos d ON pr.id_departamento = d.id_departamento
    WHERE 
        co.id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contratos_registrar` (IN `p_id_cliente` INT, IN `p_id_paquete` INT, IN `p_id_sector` INT, IN `p_direccion_servicio` VARCHAR(200), IN `p_referencia` VARCHAR(200), IN `p_coordenada` VARCHAR(50), IN `p_fecha_inicio` DATE, IN `p_fecha_registro` DATE, IN `p_nota` TEXT, IN `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_contratos (
        id_cliente,
        id_paquete,
        id_sector,
        direccion_servicio,
        referencia,
        coordenada,
        fecha_inicio,
        fecha_registro,
        nota,
        id_usuario_registro
    ) VALUES (
        p_id_cliente,
        p_id_paquete,
        p_id_sector,
        p_direccion_servicio,
        p_referencia,
        p_coordenada,
        p_fecha_inicio,
        p_fecha_registro,
        p_nota,
        p_iduser_create
    );
END$$

DROP PROCEDURE IF EXISTS `spu_contrato_buscar_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_contrato_buscar_id` (`p_id_contrato` INT)   BEGIN
    SELECT
        c.id_contrato,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nombres
            ELSE e.razon_social
        END AS nombre_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nro_doc
            ELSE e.ruc
        END AS num_identificacion,
        s.id_sector,
        s.sector AS nombre_sector,
        ur_persona.nombres AS nombre_usuario_registro,
        ut_persona.nombres AS nombre_usuario_tecnico,
        c.direccion_servicio,
        CONCAT('{"id_servicio": [', GROUP_CONCAT(sv.id_servicio), ']}') AS id_servicio,
        GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
        t.id_paquete,
        t.paquete,
        t.precio,
        c.referencia,
        c.coordenada,
        c.fecha_inicio,
        c.fecha_registro,
        c.nota
    FROM
        tb_contratos c
        INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
        LEFT JOIN tb_empresas e ON cl.id_cliente = e.id_empresa
        INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
        LEFT JOIN tb_servicios sv ON JSON_CONTAINS(t.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
        INNER JOIN tb_sectores s ON c.id_sector = s.id_sector
        INNER JOIN tb_responsables ur ON c.id_usuario_registro = ur.id_responsable
        INNER JOIN tb_usuarios ur_usuario ON ur.id_usuario = ur_usuario.id_usuario
        INNER JOIN tb_personas ur_persona ON ur_usuario.id_persona = ur_persona.id_persona
        LEFT JOIN tb_responsables ut ON c.id_usuario_tecnico = ut.id_responsable
        LEFT JOIN tb_usuarios ut_usuario ON ut.id_usuario = ut_usuario.id_usuario
        LEFT JOIN tb_personas ut_persona ON ut_usuario.id_persona = ut_persona.id_persona
    WHERE
        c.id_contrato = p_id_contrato AND c.inactive_at IS NULL
    GROUP BY
        c.id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_descontar_espacio_caja`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_descontar_espacio_caja` (IN `p_id_caja` INT)   BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas - 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;
  IF ROW_COUNT() = 0 THEN
      SELECT FALSE AS resultado;
  END IF;
END$$

DROP PROCEDURE IF EXISTS `spu_distritos_por_provincia`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_distritos_por_provincia` (`p_id_provincia` INT)   BEGIN
    SELECT id_distrito, distrito, id_provincia, id_departamento
    FROM tb_distritos
    WHERE id_provincia = p_id_provincia;
END$$

DROP PROCEDURE IF EXISTS `spu_empresas_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_empresas_actualizar` (`p_ruc` VARCHAR(11), `p_representante_legal` VARCHAR(70), `p_razon_social` VARCHAR(100), `p_nombre_comercial` VARCHAR(100), `p_telefono` CHAR(9), `p_email` VARCHAR(100), `p_iduser_update` INT, `p_id_empresa` INT)   BEGIN
    UPDATE tb_empresas
    SET 
        ruc = p_ruc,
        representante_legal = p_representante_legal,
        razon_social = p_razon_social,
        nombre_comercial = p_nombre_comercial,
        telefono = p_telefono,
        email = p_email,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_empresa = p_id_empresa;
END$$

DROP PROCEDURE IF EXISTS `spu_empresas_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_empresas_eliminar` (`p_id_empresa` INT, `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_empresas
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_empresa = p_id_empresa;
END$$

DROP PROCEDURE IF EXISTS `spu_empresas_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_empresas_registrar` (`p_ruc` VARCHAR(11), `p_representante_legal` VARCHAR(70), `p_razon_social` VARCHAR(100), `p_nombre_comercial` VARCHAR(100), `p_telefono` CHAR(9), `p_email` VARCHAR(100), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_empresas (ruc, representante_legal, razon_social, nombre_comercial, telefono, email, iduser_create) 
    VALUES (p_ruc, p_representante_legal, p_razon_social, p_nombre_comercial, p_telefono, p_email, p_iduser_create);
    SELECT LAST_INSERT_ID() AS id_empresa;
END$$

DROP PROCEDURE IF EXISTS `spu_empresa_cliente_existencia`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_empresa_cliente_existencia` (IN `p_ruc` VARCHAR(15))   BEGIN
    SELECT e.id_empresa, c.id_cliente, e.ruc, e.razon_social FROM
    tb_empresas e LEFT JOIN tb_clientes c ON e.id_empresa = c.id_empresa
    WHERE e.ruc = p_ruc;
END$$

DROP PROCEDURE IF EXISTS `spu_fichatecnica_buscar_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_fichatecnica_buscar_id` (`p_id_contrato` INT)   BEGIN
    SELECT
        c.id_contrato,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN CONCAT(p.nombres, ', ', p.apellidos)
            ELSE e.razon_social
        END AS nombre_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN p.nro_doc
            ELSE e.ruc
        END AS num_identificacion,
        t.paquete,
        GROUP_CONCAT(sv.tipo_servicio) AS tipos_servicio,
        c.ficha_instalacion,
        t.precio
    FROM
        tb_contratos c
        INNER JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
        LEFT JOIN tb_empresas e ON cl.id_cliente = e.id_empresa
        INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
        LEFT JOIN tb_servicios sv ON JSON_CONTAINS(t.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
    WHERE c.id_contrato = p_id_contrato AND c.inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_ficha_tecnica_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_ficha_tecnica_registrar` (`p_id_contrato` INT, `p_ficha_instalacion` JSON, `p_id_usuario_registro` INT)   BEGIN
    UPDATE 
    tb_contratos 
    SET ficha_instalacion = p_ficha_instalacion,
    id_usuario_registro = p_id_usuario_registro
    WHERE id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_kardex_buscar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_kardex_buscar` (IN `p_id_producto` INT)   BEGIN
    SELECT * FROM vw_kardex_listar 
    WHERE id_producto = p_id_producto 
    ORDER BY id_kardex DESC;
END$$

DROP PROCEDURE IF EXISTS `spu_kardex_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_kardex_registrar` (IN `p_id_almacen` INT, IN `p_id_producto` INT, IN `p_fecha` DATE, IN `p_id_tipooperacion` INT, IN `p_cantidad` INT, IN `p_valor_unitario_historico` DECIMAL(7,2), IN `p_iduser_create` INT)   BEGIN
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

DROP PROCEDURE IF EXISTS `spu_lineas_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_lineas_registrar` (IN `p_id_mufa` INT, IN `p_id_caja` INT, IN `p_coordenadas` JSON, IN `p_iduser_create` INT)   BEGIN
  INSERT INTO tb_lineas(id_mufa, id_caja, coordenadas, iduser_create)
  VALUES(p_id_mufa, p_id_caja, p_coordenadas, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_listar_tipo_operacion`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_listar_tipo_operacion` (IN `tipo_movimiento` CHAR(1))   BEGIN
    SELECT id_tipooperacion, descripcion, movimiento 
    FROM tb_tipooperacion 
    WHERE movimiento = tipo_movimiento;
END$$

DROP PROCEDURE IF EXISTS `spu_mufas_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_mufas_listar` ()   BEGIN
  SELECT id_mufa, nombre, descripcion, coordenadas FROM tb_mufas;
END$$

DROP PROCEDURE IF EXISTS `spu_paquetes_buscar_servicio`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_paquetes_buscar_servicio` (IN `p_id_servicio` JSON)   BEGIN
    SELECT 
        p.id_paquete,
        p.id_servicio,
        GROUP_CONCAT(s.servicio) AS servicios,
        GROUP_CONCAT(s.tipo_servicio) AS tipos_servicio,
        p.paquete,
        p.precio,
        p.velocidad, 
        p.create_at,
        p.update_at,
        p.inactive_at,
        p.iduser_create,
        p.iduser_update,
        p.iduser_inactive
    FROM
        tb_paquetes p
        JOIN tb_servicios s ON JSON_CONTAINS(
            p.id_servicio, 
            CONCAT('{"id_servicio":', s.id_servicio, '}')
        )
    WHERE 
        JSON_CONTAINS(p.id_servicio, JSON_UNQUOTE(JSON_EXTRACT(p_id_servicio, '$.id_servicio')), '$.id_servicio')
    GROUP BY 
        p.id_paquete;
END$$

DROP PROCEDURE IF EXISTS `spu_paquete_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_paquete_actualizar` (`p_id_paquete` INT, `p_id_servicio` JSON, `p_paquete` VARCHAR(250), `p_precio` DECIMAL(7,2), `p_velocidad` JSON, `p_iduser_update` INT)   BEGIN
	UPDATE tb_paquetes 
    SET 
		id_servicio = p_id_servicio,
        paquete = p_paquete,
        precio = p_precio,
        velocidad = p_velocidad,
        iduser_update = p_iduser_update,
        update_at = NOW()
	WHERE
		id_paquete = p_id_paquete;
END$$

DROP PROCEDURE IF EXISTS `spu_paquete_buscar_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_paquete_buscar_id` (IN `p_id_paquete` INT)   BEGIN
    SELECT
        p.id_paquete,
        p.id_servicio,
        GROUP_CONCAT(s.servicio) AS servicios,
        GROUP_CONCAT(s.tipo_servicio) AS tipos_servicio,
        p.paquete,
        p.precio,
        p.velocidad,
        p.create_at,
        p.update_at,
        p.inactive_at,
        p.iduser_create,
        p.iduser_update,
        p.iduser_inactive
    FROM tb_paquetes p
    JOIN tb_servicios s ON JSON_CONTAINS(
        p.id_servicio, CONCAT(
            '{"id_servicio":', s.id_servicio, '}'
        )
    )
    WHERE 
        p.id_paquete = p_id_paquete
    GROUP BY 
        p.id_paquete;
END$$

DROP PROCEDURE IF EXISTS `spu_paquete_buscar_idServicio`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_paquete_buscar_idServicio` (IN `p_id_servicio` JSON)   BEGIN 
    SELECT 
        p.id_servicio,
        p.id_paquete, 
        p.paquete, 
        p.precio, 
        p.velocidad,
        GROUP_CONCAT(s.tipo_servicio) AS tipos_servicio,
        p.inactive_at
    FROM 
        tb_paquetes p
        LEFT JOIN tb_servicios s ON JSON_CONTAINS(
            p.id_servicio, CONCAT(
                '{"id_servicio":', s.id_servicio, '}'
            )
        )
    WHERE 
        JSON_CONTAINS(p.id_servicio, CONCAT(
            '{"id_servicio":', JSON_UNQUOTE(JSON_EXTRACT(p_id_servicio, '$.id_servicio')), '}'
        ))
    GROUP BY 
        p.id_paquete;
END$$

DROP PROCEDURE IF EXISTS `spu_paquete_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_paquete_eliminar` (`p_id_paquete` INT, `p_iduser_inactive` INT)   BEGIN
	UPDATE tb_paquetes
    SET 	
		inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
	WHERE 
		id_paquete = p_id_paquete;
END$$

DROP PROCEDURE IF EXISTS `spu_paquete_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_paquete_registrar` (IN `p_id_servicio` JSON, IN `p_paquete` VARCHAR(250), IN `p_precio` DECIMAL(7,2), IN `p_velocidad` JSON, IN `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_paquetes (id_servicio, paquete, precio, velocidad, iduser_create) 
    VALUES (p_id_servicio, p_paquete, p_precio, p_velocidad, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_permisos_actualizar_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_permisos_actualizar_id` (`p_id_rol` INT, `p_permisos` JSON, `p_iduser_update` INT)   BEGIN
    UPDATE tb_roles
    SET
        permisos = p_permisos,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_permisos_listar_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_permisos_listar_id` (`p_id_rol` INT)   BEGIN
    SELECT permisos FROM tb_roles
    WHERE id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_personas_actualizar` (`p_tipo_doc` CHAR(3), `p_nro_doc` VARCHAR(15), `p_apellidos` VARCHAR(30), `p_nombres` VARCHAR(30), `p_telefono` CHAR(9), `p_nacionalidad` VARCHAR(40), `p_email` VARCHAR(100), `p_iduser_update` INT, `p_id_persona` INT)   BEGIN
    UPDATE tb_personas
    SET 
        tipo_doc = p_tipo_doc,
        nro_doc = p_nro_doc,
        apellidos = p_apellidos,
        nombres = p_nombres,
        telefono = p_telefono,
        nacionalidad = p_nacionalidad,
        email = p_email,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_persona = p_id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_buscar_dni`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_personas_buscar_dni` (IN `p_dni` VARCHAR(15))   BEGIN
    SELECT id_persona, tipo_doc, nro_doc, apellidos, nombres, telefono, nacionalidad, email
    FROM vw_personas_listar
    WHERE nro_doc = p_dni;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_personas_eliminar` (`p_id_persona` INT, `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_personas
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_persona = p_id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_listar_por_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_personas_listar_por_id` (IN `p_id_persona` INT)   BEGIN
    SELECT * FROM tb_personas WHERE id_persona = p_id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_personas_registrar` (`p_tipo_doc` CHAR(3), `p_nro_doc` VARCHAR(15), `p_apellidos` VARCHAR(30), `p_nombres` VARCHAR(30), `p_telefono` CHAR(9), `p_nacionalidad` VARCHAR(40), `p_email` VARCHAR(100), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, nacionalidad, email, iduser_create) 
    VALUES (p_tipo_doc, p_nro_doc, p_apellidos, p_nombres, p_telefono, p_nacionalidad, p_email, p_iduser_create);
    SELECT LAST_INSERT_ID() AS id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_persona_cliente_existencia`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_persona_cliente_existencia` (IN `p_dni` VARCHAR(15))   BEGIN
    SELECT p.id_persona, p.nombres, p.apellidos, c.id_cliente 
    FROM tb_personas p 
    LEFT JOIN tb_clientes c ON p.id_persona = c.id_persona
    WHERE p.nro_doc = p_dni;
END$$

DROP PROCEDURE IF EXISTS `spu_productos_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_productos_actualizar` (IN `p_id_producto` INT, IN `p_id_marca` INT, IN `p_id_tipo` INT, IN `p_idUnidad` INT, IN `p_modelo` VARCHAR(30), IN `p_precio_actual` DECIMAL(7,2), IN `p_iduser_update` INT)   BEGIN
    UPDATE tb_productos 
    SET 
        id_marca = p_id_marca,
        id_tipo = p_id_tipo,
        id_unidad = p_idUnidad,
        modelo = p_modelo,
        precio_actual = p_precio_actual,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_producto = p_id_producto;
END$$

DROP PROCEDURE IF EXISTS `spu_productos_buscar_barra`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_productos_buscar_barra` (IN `p_codigo_barra` VARCHAR(120))   BEGIN
    SELECT
        p.id_producto,
        p.modelo,
        p.precio_actual,
        m.marca
    FROM
        tb_productos p
    INNER JOIN
        tb_marca m ON p.id_marca = m.id_marca
    WHERE
        p.codigo_barra = p_codigo_barra
    AND
        p.inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_productos_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_productos_eliminar` (IN `p_id_producto` INT, IN `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_productos 
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_producto = p_id_producto;
END$$

DROP PROCEDURE IF EXISTS `spu_productos_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_productos_registrar` (IN `p_id_marca` INT, IN `p_id_tipo` INT, IN `p_id_unidad` INT, IN `p_modelo` VARCHAR(70), IN `p_precio_actual` DECIMAL(7,2), IN `p_codigo_barra` VARCHAR(120), IN `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_productos (id_marca, id_tipo, id_unidad, modelo, precio_actual, codigo_barra, create_at, iduser_create)
    VALUES (p_id_marca, p_id_tipo, p_id_unidad, p_modelo, p_precio_actual, p_codigo_barra, NOW(), p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_provincias_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_provincias_listar` ()   BEGIN
    SELECT id_provincia, provincia, id_departamento
    FROM tb_provincias;
END$$

DROP PROCEDURE IF EXISTS `spu_recontar_espacio_caja`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_recontar_espacio_caja` (IN `p_id_caja` INT)   BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas + 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;
END$$

DROP PROCEDURE IF EXISTS `spu_registrar_fichasoporte`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_registrar_fichasoporte` (IN `p_id_contrato` INT, IN `p_id_tecnico` INT, IN `p_fecha_hora_solicitud` DATETIME, IN `p_descripcion_problema` TEXT, IN `p_descripcion_solucion` TEXT, IN `p_prioridad` VARCHAR(50), IN `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_soporte (
        id_contrato,
        id_tecnico,
        fecha_hora_solicitud,
        descripcion_problema,
        descripcion_solucion,
        prioridad,
        create_at,
        iduser_create
    )
    VALUES (
        p_id_contrato,
        CASE 
            WHEN p_id_tecnico = 0 THEN NULL 
            ELSE p_id_tecnico 
        END,
        p_fecha_hora_solicitud,
        p_descripcion_problema,
        CASE 
            WHEN p_descripcion_solucion = '' THEN NULL 
            ELSE p_descripcion_solucion 
        END,
        p_prioridad,
        NOW(),
        p_iduser_create
    );
END$$

DROP PROCEDURE IF EXISTS `spu_responsablesUsuarios_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_responsablesUsuarios_actualizar` (IN `p_iduser_update` INT, IN `p_id_rol` INT, IN `p_id_responsable` INT)   BEGIN
    UPDATE tb_responsables
    SET 
        id_rol = p_id_rol,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE 
        p_id_responsable = id_responsable;
END$$

DROP PROCEDURE IF EXISTS `spu_responsables_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_responsables_eliminar` (IN `p_iduser_inactive` INT, IN `p_id_responsable` INT)   BEGIN
    UPDATE tb_responsables
    SET 
        user_inactive = p_iduser_inactive,
        fecha_fin = NOW()
    WHERE 
        p_id_responsable = id_responsable;
END$$

DROP PROCEDURE IF EXISTS `spu_responsables_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_responsables_registrar` (IN `p_id_usuario` INT, IN `p_id_rol` INT, IN `p_fecha_inicio` DATETIME, IN `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_responsables (
        id_usuario, 
        id_rol, 
        fecha_inicio, 
        iduser_create
    )
    VALUES (
        p_id_usuario, 
        p_id_rol, 
        p_fecha_inicio, 
        p_iduser_create
    );
END$$

DROP PROCEDURE IF EXISTS `spu_roles_activar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_roles_activar` (`p_id_rol` INT, `p_iduser_update` INT)   BEGIN
    UPDATE tb_roles
    SET
        inactive_at = NULL,
        iduser_inactive = NULL,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE
        id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_roles_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_roles_actualizar` (`p_id_rol` INT, `p_rol` VARCHAR(30), `p_iduser_update` INT)   BEGIN
    UPDATE tb_roles
    SET 
        rol = p_rol,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE
        id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_roles_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_roles_eliminar` (`p_id_rol` INT, `p_iduser_inactive` INT)   BEGIN 
    UPDATE tb_roles
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE
        id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_roles_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_roles_registrar` (`p_rol` VARCHAR(30), `p_permisos` JSON, `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_roles (rol, permisos, iduser_create)
    VALUES (p_rol, p_permisos, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_sectores_actualizar_id`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_sectores_actualizar_id` (IN `p_id_sector` INT, IN `p_id_distrito` INT, IN `p_sector` VARCHAR(60), IN `p_iduser_update` INT)   BEGIN
    UPDATE tb_sectores
    SET
        id_distrito = p_id_distrito,
        sector = p_sector,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE
        id_sector = p_id_sector;
END$$

DROP PROCEDURE IF EXISTS `spu_sectores_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_sectores_registrar` (`p_id_distrito` INT, `p_sector` VARCHAR(60), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_sectores (id_distrito, sector, iduser_create)
    VALUES (p_id_distrito, p_sector, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_servicio_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_servicio_actualizar` (IN `p_id_servicio` INT, IN `p_tipo_servicio` CHAR(4), IN `p_servicio` VARCHAR(50), IN `p_iduser_update` INT)   BEGIN
    UPDATE tb_servicios 
    SET
        tipo_servicio = p_tipo_servicio,
        servicio = p_servicio,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE 
        id_servicio = p_id_servicio;
END$$

DROP PROCEDURE IF EXISTS `spu_servicio_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_servicio_eliminar` (IN `p_id_servicio` INT, IN `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_servicios 
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE 
        id_servicio = p_id_servicio;
END$$

DROP PROCEDURE IF EXISTS `spu_servicio_reactivar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_servicio_reactivar` (IN `p_id_servicio` INT, IN `p_iduser_update` INT)   BEGIN
    UPDATE tb_servicios 
    SET
        inactive_at = NULL,
        iduser_inactive = NULL,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE 
        id_servicio = p_id_servicio;
END$$

DROP PROCEDURE IF EXISTS `spu_servicio_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_servicio_registrar` (IN `p_tipo_servicio` CHAR(4), IN `p_servicio` VARCHAR(50), IN `p_iduser_create` INT)   BEGIN 
    INSERT INTO tb_servicios (tipo_servicio, servicio, iduser_create) 
    VALUES (p_tipo_servicio, p_servicio, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_soporte_actualizar` (IN `p_id_soporte` INT, IN `p_id_tecnico` INT, IN `p_id_tipo_soporte` INT, IN `p_fecha_hora_asistencia` DATETIME, IN `p_soporte` JSON, IN `p_iduser_update` INT, IN `p_procedimiento_S` TEXT)   BEGIN
    UPDATE tb_soporte
    SET
        id_tecnico = p_id_tecnico,
        fecha_hora_asistencia = p_fecha_hora_asistencia,
        id_tipo_soporte = p_id_tipo_soporte,
        soporte = p_soporte,
        update_at = NOW(),
        iduser_update = p_iduser_update,
        descripcion_solucion = p_procedimiento_S
    WHERE id_soporte = p_id_soporte;
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_eliminarbyId`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_soporte_eliminarbyId` (IN `p_id_soporte` INT, IN `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_soporte
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_soporte = p_id_soporte;
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_ficha_doc`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_soporte_ficha_doc` (IN `p_idsoporte` INT)   BEGIN
    SELECT 
        ct.ficha_instalacion
    FROM tb_soporte s
    INNER JOIN tb_contratos ct ON s.id_contrato = ct.id_contrato
    INNER JOIN tb_clientes cl ON ct.id_cliente = cl.id_cliente
    LEFT JOIN tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN tb_empresas e ON cl.id_empresa = e.id_empresa
    WHERE 
        s.id_soporte = p_idsoporte;
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_filtrar_prioridad`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_soporte_filtrar_prioridad` (IN `p_prioridad` VARCHAR(50))   BEGIN
    SELECT
        c.coordenada,
        c.id_sector,
        sct.sector,
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia,
        c.direccion_servicio,
        s.id_soporte,
        s.prioridad,
        s.soporte,
        s.descripcion_problema,
        s.descripcion_solucion,
        ts.tipo_soporte,
        c.id_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN CONCAT(p_cliente.nombres, ' ', p_cliente.apellidos)
            WHEN cl.id_empresa IS NOT NULL THEN e.razon_social
        END AS nombre_cliente,
        c.direccion_servicio,
        r.id_usuario AS id_tecnico,
        CONCAT(p_tecnico.nombres, ' ', p_tecnico.apellidos) AS nombre_tecnico
    FROM 
        tb_soporte s
    LEFT JOIN 
        tb_contratos c ON s.id_contrato = c.id_contrato
    INNER JOIN
        tb_sectores sct ON c.id_sector = sct.id_sector
    LEFT JOIN 
        tb_tipo_soporte ts ON s.id_tipo_soporte = ts.id_tipo_soporte
    LEFT JOIN 
        tb_responsables r ON s.id_tecnico = r.id_responsable
    LEFT JOIN 
        tb_usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN 
        tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
    LEFT JOIN 
        tb_clientes cl ON c.id_cliente = cl.id_cliente
    LEFT JOIN 
        tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona 
    LEFT JOIN 
        tb_empresas e ON cl.id_empresa = e.id_empresa
    WHERE
        (p_prioridad = "" OR s.prioridad = p_prioridad) AND s.inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_tipo_soporte_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_tipo_soporte_registrar` (`p_tipo_soporte` VARCHAR(50), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_tipo_soporte (tipo_soporte, iduser_create)
    VALUES (p_tipo_soporte, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_usuarios_login`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_usuarios_login` (`p_nombre_user` VARCHAR(100))   BEGIN
        SELECT 
            u.nombre_user,
            u.id_usuario,
            r.id_responsable AS id_usuario,
            u.pass,
            r.id_rol,
            ro.rol AS "Cargo"
        FROM 
            tb_usuarios u
        JOIN 
            tb_responsables r ON u.id_usuario = r.id_usuario
        JOIN 
            tb_roles ro ON r.id_rol = ro.id_rol
        WHERE 
            nombre_user = p_nombre_user AND u.inactive_at IS NULL;
    END$$

DROP PROCEDURE IF EXISTS `spu_usuarios_registrar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_usuarios_registrar` (`p_id_persona` INT, `p_nombre_user` VARCHAR(100), `p_pass` VARCHAR(60), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_usuarios(id_persona, nombre_user, pass, iduser_create) 
    VALUES (p_id_persona, p_nombre_user, p_pass, p_iduser_create);
    SELECT LAST_INSERT_ID() AS id_usuario;
END$$

DROP PROCEDURE IF EXISTS `spu_usuario_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_usuario_actualizar` (IN `p_nombre_user` VARCHAR(100), IN `p_pass` CHAR(60), IN `p_iduser_update` INT, IN `p_id_usuario` INT)   BEGIN
	UPDATE tb_usuarios
	SET nombre_user = p_nombre_user,
		pass = p_pass,
		update_at = NOW(),
		iduser_update = p_iduser_update
	WHERE id_usuario = p_id_usuario;
END$$

DROP PROCEDURE IF EXISTS `spu_usuario_buscar_username`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spu_usuario_buscar_username` (IN `p_username` VARCHAR(100))   BEGIN
	SELECT nombre_user FROM tb_usuarios 
    WHERE nombre_user = p_username;
END$$

DROP PROCEDURE IF EXISTS `sp_usuario_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_usuario_eliminar` (IN `p_id_usuario` INT, IN `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_usuarios
    SET inactive_at = NOW(), 
        iduser_inactive = p_iduser_inactive
    WHERE id_usuario = p_id_usuario;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_almacen`
--
-- Creación: 15-12-2024 a las 21:54:44
-- Última actualización: 15-12-2024 a las 21:54:44
--

DROP TABLE IF EXISTS `tb_almacen`;
CREATE TABLE IF NOT EXISTS `tb_almacen` (
  `id_almacen` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_almacen` varchar(65) NOT NULL,
  `ubicacion` varchar(120) NOT NULL,
  `coordenada` varchar(50) NOT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_almacen`),
  UNIQUE KEY `uk_almacen` (`nombre_almacen`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_almacen`:
--

--
-- Volcado de datos para la tabla `tb_almacen`
--

INSERT INTO `tb_almacen` (`id_almacen`, `nombre_almacen`, `ubicacion`, `coordenada`, `inactive_at`, `iduser_inactive`, `create_at`, `update_at`, `iduser_create`, `iduser_update`) VALUES
(1, 'Almacen 1', 'Av 123', '-13.415960344185644, -76.13418174072265', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(2, 'Almacen 2', 'Av 123456', '-13.427602649212902, -76.13979326342246', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_cajas`
--
-- Creación: 15-12-2024 a las 21:54:44
--

DROP TABLE IF EXISTS `tb_cajas`;
CREATE TABLE IF NOT EXISTS `tb_cajas` (
  `id_caja` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `numero_entradas` tinyint(4) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `coordenadas` varchar(50) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_caja`),
  KEY `caja_fk_id_sector` (`id_sector`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_cajas`:
--   `id_sector`
--       `tb_sectores` -> `id_sector`
--

--
-- Volcado de datos para la tabla `tb_cajas`
--

INSERT INTO `tb_cajas` (`id_caja`, `nombre`, `descripcion`, `numero_entradas`, `id_sector`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'Caja 1', 'Cerca del estadio', 14, 11, '-13.390019838079903, -76.14898062581466', '2024-12-12 09:54:08', '2024-12-12 11:02:19', NULL, 1, NULL, NULL),
(2, 'Caja 2', 'Plaza san Isidro', 6, 11, '-13.396082705347906, -76.13534364004165', '2024-12-12 09:54:08', '2024-12-12 11:24:17', NULL, 1, NULL, NULL),
(3, 'Caja 3', 'Cerca de la Plaza', 0, 19, '-13.4277387660967, -76.16422117136221', '2024-12-12 09:54:08', '2024-12-12 11:32:23', NULL, 1, NULL, NULL),
(4, 'Caja 4', 'San Nicolas', 16, 19, '-13.432393655576314, -76.1627322889994', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 'Caja 5', 'Prolongacion Cañete', 15, 11, '-13.393627228237747, -76.14441531745013', '2024-12-12 09:54:08', '2024-12-12 11:16:48', NULL, 1, NULL, NULL),
(6, 'Caja 6', 'Tecnologico Chincha', 3, 6, '-13.404627155707574, -76.13712932116213', '2024-12-12 09:54:08', '2024-12-12 11:25:27', NULL, 1, NULL, NULL),
(7, 'Caja 7', 'Los Bancarios', 5, 6, '-13.42826126892918, -76.135733419194', '2024-12-12 09:54:08', '2024-12-12 10:25:10', NULL, 1, NULL, NULL),
(8, 'Caja 8', 'Plaza Chincha', 14, 6, '-13.41819520203595, -76.13222851544388', '2024-12-12 09:54:08', '2024-12-12 11:37:22', NULL, 1, NULL, NULL),
(9, 'Caja 9', 'Parque Toledo', 1, 19, '-13.417732015444551, -76.11985007949754', '2024-12-12 09:54:08', '2024-12-12 11:38:56', NULL, 1, NULL, NULL),
(10, 'Caja 10', 'Plaza de pueblo nuevo', 16, 19, '-13.404169746696624, -76.12736834665132', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_clientes`
--
-- Creación: 15-12-2024 a las 21:54:44
--

DROP TABLE IF EXISTS `tb_clientes`;
CREATE TABLE IF NOT EXISTS `tb_clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `direccion` varchar(250) NOT NULL,
  `referencia` varchar(150) NOT NULL,
  `coordenadas` varchar(50) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `clien_fk_id_persona` (`id_persona`),
  KEY `clien_fk_id_empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_clientes`:
--   `id_empresa`
--       `tb_empresas` -> `id_empresa`
--   `id_persona`
--       `tb_personas` -> `id_persona`
--

--
-- Volcado de datos para la tabla `tb_clientes`
--

INSERT INTO `tb_clientes` (`id_cliente`, `id_persona`, `id_empresa`, `direccion`, `referencia`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 6, NULL, 'Av. Luis Alva Maurtua S/N', 'Cruz blanca 4ta cuadra - Oruro', '-13.430139, -76.113639', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(2, 7, NULL, 'Calle San Luis #139', 'Chincha alta', '-13.421583, -76.122361', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(3, 8, NULL, 'AA.HH. Virgen Del Carmen Mz-G N-18 ', 'Chincha Alta', '-13.427278, -76.124889', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(4, 9, NULL, 'Av San Martin #103', 'Sunampe', '-13.433306, -76.137694', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(5, 10, NULL, 'Psj. Los Angeles S/N', 'Mina de oro', '-13.431694, -76.144278', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(6, 11, NULL, 'Av. Santa Rosa N° 312', 'Lomo largo', '-13.424111, -76.168028', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(7, 12, NULL, 'Psj. San Cosme #185', 'Calle Rosario 7ma Cuadra', '-13.406222, -76.138167', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(8, 13, NULL, 'Psj. San Vicente Mz-P Lt-16', 'Sunampe', '-13.411083, -76.163611', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(9, 14, NULL, 'Av. San Antonio', 'Santa Rosa - Sunampe', '-13.421583, -76.157194', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(10, 15, NULL, 'PSj. Primaveral Lt-11022', 'Cruz Blanca', '-13.430250, -76.121194', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(11, 16, NULL, 'Psj. Los Claveles N° 207', 'Cruz Blanca - Chinhca Alta', '-13.423222, -76.123889', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(12, 17, NULL, 'Calle Parada de los amigos', 'Sunampe', '-13.412833, -76.164778', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(13, 18, NULL, 'Barrio el por venir', 'Grocio Prado', '-13.403472, -76.165472', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(14, 19, NULL, 'Upis Divina Misericordia Mz-B Lt-6A', 'Chincha Alta', '-13.416028, -76.144944', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(15, 20, NULL, 'Psj. 2 de mayo N°228', 'Cruz Blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(16, 21, NULL, 'Urb Los Viñedos N° UZ-12', 'Chincha Alta', '-13.406250, -76.140111', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(17, 22, NULL, 'Psj. San Jose Mz-H Lt-10', 'Sunampe', '-13.421139, -76.169333', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(18, 23, NULL, 'Calle Sebastian Barranca Lt-14C', 'Grocio Prado', '-13.382250, -76.156000', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(19, 24, NULL, 'Psj. San Blas - Calle A Lt-02', 'Alfonso Ugarte Norte-Sunampe', '-13.418639, -76.170583', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(20, 25, NULL, 'Av. Unión N°3A - Los Alamos', 'Pueblo Nuevo', '-13.403750, -76.138222', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(21, 26, NULL, 'Psj. La frontera N° 257', 'Lomo Largo - Sunampe', '-13.420250, -76.165306', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(22, 27, NULL, 'AA.HH El Salvador Mz-J Sub Lt-2-2', 'Pueblo Nuevo a 2 casas de la torre', '-13.395750, -76.142361', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(23, 28, NULL, 'Av. Alva Maurtua Mz-J Lt-16', 'Cruz Blanca', '-13.428611, -76.117278', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(24, 29, NULL, 'Upis San Andrés Mz-A Lt-6', 'Pueblo Nuevo', '-13.392583, -76.139028', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(25, 30, NULL, 'Upis San Andrés Mz-I Lt-19', 'Pueblo Nuevo', '-13.394111, -76.137361', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(26, 31, NULL, 'Calle Los Angeles N°368', 'Lomo Largo', '-13.419361, -76.168944', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(27, 32, NULL, 'Calle Pedro Moreno N° 130', 'Grocio Prado', '-13.410833, -76.140333', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(28, 33, NULL, 'Av. Los Angeles #512 - Sunampe', 'Frente discoteca the boss', '-13.419139, -76.170278', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(29, 34, NULL, 'Condorillo alto Mz-I Lt-12', 'Chincha Alta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(30, 35, NULL, 'Psj. San gregorio S/N', 'Alameda - Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(31, 36, NULL, 'Psj. 2 de mayo #309', 'Cruz Blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(32, 37, NULL, 'Psj. San Juan de Dios', 'Cruz Blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(33, 38, NULL, 'AA.HH Jesús María y Jesús Mz-D Lt-02', 'Chincha Alta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(34, 39, NULL, 'Upis Biggio Mz-D Puerta 02', '', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(35, 40, NULL, 'Calle El Carmen N°210', 'Cruz Blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(36, 41, NULL, 'C.P Condorillo alto Mz-T Lt-23', 'Chincha Alta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(37, 42, NULL, 'Calle Sebastion Barranca Lt-3 C-1', 'Fundo colorado - Grocio Prado', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(38, 43, NULL, 'Calle Mina de oro Puerta 06 / Sin barrio', 'Mina de oro - cinco esquinas', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(39, 44, NULL, 'AA.HH Jesus Maria y Jose #A-05', 'Chincha Alta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(40, 45, NULL, 'Prol. Juan Castilla Roncero Lt-3B', 'Grocio Prado - Barrio el por venir', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(41, 46, NULL, 'Calle San Pedro de Pilpa #256-1', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(42, 47, NULL, 'Condorillo Alto Mz-P Lt-15', 'Cruz Blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(43, 48, NULL, 'Av. Luis Alva Maurtua N° 525', 'Cruz Blanca - Chincha Alta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(44, 49, NULL, 'AA.HH Husares de Junin', 'Mz-C Lt-8', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(45, 50, NULL, 'Psj. Anampa Puerta 160', 'Antiguo Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(46, 51, NULL, 'Calle Prol. Benavides', 'Grocio Prado', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(47, 52, NULL, 'Av. Paraiso Lt. 5-B', 'Loimo Largo - Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(48, 53, NULL, 'AA.HH Virgen del Carmen - Cruz Blanca', 'Mz-D Lt-17', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(49, 54, NULL, 'Luis Massaro ex Pilpa Plaza center', 'Chincha Frente SJB Stand 210-D', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(50, 55, NULL, 'Calle El Carmen N° 196', 'Cruz Blanca - Chincha', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(51, 56, NULL, 'Calle San Pedro de Pilpa #588', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(52, 57, NULL, 'Upis 15 de Noviembre', 'Jose olaya B-13-2 puertas', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(53, 58, NULL, 'AA.HH El milagro de San Judas Tadeo', 'Mz-D Lt-8 - Sunampe - Mina de Oro', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(54, 59, NULL, 'El por venir Mz-E Lt-19', 'Grocio Prado', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(55, 60, NULL, 'Av. Primavera #711', 'Antes de la baja del socorro - Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(56, 61, NULL, 'Psj. San Martin  N°114', 'Mina de oro', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(57, 62, NULL, 'AA.HH Virgen del Carmen', 'Mz-B Lt-04', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(58, 63, NULL, 'Psj. Arena Costa Mz-D Lt-7', 'San Ignacio', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(59, 64, NULL, 'CP. Condorillo alto', 'Mz-U Lt-01', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(60, 65, NULL, 'Av. San Rafael #258 - Grocio Prado', 'Frente a los mejilloneros', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(61, 66, NULL, 'Barrio Cruz Blanca - Alva Maurtua', 'Ultimo paradero - Oruro', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(62, 67, NULL, 'AA.HH El salvador Mz-B Puerta 17', 'Pueblo Nuevo - El salvador', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(63, 68, NULL, 'AA.HH San Judas Tadeo Mz-E Lt-1', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(64, 69, NULL, 'AA.HH San Judas Tadeo Mz-E Lt-4', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(65, 70, NULL, 'AA.HH San Judas Tadeo Mz-E Lt-5', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(66, 71, NULL, 'Estadio Cruz blanca', 'Chincha Alta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(67, 72, NULL, 'Condorillo alto N°15 primera cuadra', 'Antes de la posta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(68, 73, NULL, 'Centro Poblado El Tigre 141', 'Int. O1 - Chincha Alta', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(69, 74, NULL, 'Calle El Carmen N° 190', 'Cruz blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(70, 75, NULL, 'Toma de Cala', 'Cruz blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(71, 76, NULL, 'Psj San Francisco N°111 Int-20', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(72, 77, NULL, 'Condominio San Pablo Mz S/N Lt-2-1', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(73, 78, NULL, 'Av. Victor Raúl Haya de la Torre Lt-2', 'Chacarita - Sunampe - Costado del grifo Green', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(74, 79, NULL, 'Av. Fátima N°373', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(75, 80, NULL, 'Psj. Santa Rosa S/N', 'Cruz Blanca', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(76, 81, NULL, 'AA.HH San Valentin Mz-I Lt-12', 'Condorillo bajo', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(77, 82, NULL, 'Barrio el por venir Psj. San vicente', 'Lt-35 Mz-G - Grocio Prado', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(78, 83, NULL, 'Psj. Sucre N° 470', 'Espalda de mina de oro', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(79, 84, NULL, 'Cale el por venir N° 1138 - D', 'Barrio el por venir - Grocio Prado', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(80, 85, NULL, 'Av. Monterrico #405 - Sunampe', 'Pasando el colegio Simón bolivar', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(81, 86, NULL, 'Av. Primavera N°300', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(82, 87, NULL, 'HU.CA Santa Teresa S/N', 'Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(83, 88, NULL, 'AA.HH Las flores de mina Mz-A Lt-6', 'Grocio Prado - Mina de oro', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(84, 89, NULL, 'Calle Victor Haya de la Torre Lt-02', 'Chacarita Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(85, 90, NULL, 'Psj. San Juan Lt-94A', 'Alfonso Ugarte - Sunampe', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL),
(86, 91, NULL, 'Calle La Palma 114 cercado de grocio prado', 'Toma el carriso', '-1', '2024-12-12 09:54:43', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_contactabilidad`
--
-- Creación: 15-12-2024 a las 21:54:44
--

DROP TABLE IF EXISTS `tb_contactabilidad`;
CREATE TABLE IF NOT EXISTS `tb_contactabilidad` (
  `id_contactabilidad` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_paquete` int(11) NOT NULL,
  `fecha_hora_contacto` datetime NOT NULL DEFAULT current_timestamp(),
  `direccion_servicio` varchar(250) NOT NULL,
  `nota` text NOT NULL,
  `fecha_limite` datetime DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_contactabilidad`),
  KEY `contac_fk_id_persona` (`id_persona`),
  KEY `contac_fk_id_tarifario` (`id_paquete`),
  KEY `contac_fk_id_empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_contactabilidad`:
--   `id_empresa`
--       `tb_empresas` -> `id_empresa`
--   `id_persona`
--       `tb_personas` -> `id_persona`
--   `id_paquete`
--       `tb_paquetes` -> `id_paquete`
--

--
-- Volcado de datos para la tabla `tb_contactabilidad`
--

INSERT INTO `tb_contactabilidad` (`id_contactabilidad`, `id_persona`, `id_empresa`, `id_paquete`, `fecha_hora_contacto`, `direccion_servicio`, `nota`, `fecha_limite`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 20, NULL, 1, '2024-01-10 14:30:00', 'Av. San Martín 500, Chincha Alta', 'Se realizó la instalación del servicio.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(2, NULL, 21, 2, '2024-01-12 10:15:00', 'Calle Ayacucho 345, Chincha Alta', 'Cliente solicitó soporte técnico.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(3, 22, NULL, 3, '2024-01-14 11:45:00', 'Calle Grau 125, Chincha Alta', 'Se acordó la renovación del contrato.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(4, NULL, 23, 4, '2024-01-16 13:00:00', 'Av. Benavides 567, Chincha Alta', 'Se envió la propuesta de nuevos servicios.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(5, 24, NULL, 5, '2024-01-18 09:30:00', 'Calle Libertad 890, Chincha Alta', 'Cliente solicitó información adicional.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(6, NULL, 25, 6, '2024-01-20 12:00:00', 'Jirón Pisco 300, Chincha Alta', 'Se confirmó la fecha de instalación.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(7, 26, NULL, 7, '2024-01-22 14:45:00', 'Av. América 444, Chincha Alta', 'Se realizó el seguimiento al cliente.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(8, NULL, 27, 8, '2024-01-24 10:00:00', 'Calle Bolognesi 678, Chincha Alta', 'Cliente solicitó una ampliación del servicio.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(9, 28, NULL, 9, '2024-01-26 16:15:00', 'Av. Progreso 234, Chincha Alta', 'Se completó la instalación del servicio adicional.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(10, NULL, 29, 10, '2024-01-28 11:30:00', 'Calle Comercio 123, Chincha Alta', 'Cliente confirmó su satisfacción con el servicio.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(11, 30, NULL, 11, '2024-01-30 15:00:00', 'Av. Victoria 876, Chincha Alta', 'Se acordó una visita técnica para revisar el servicio.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(12, NULL, 31, 12, '2024-02-01 09:45:00', 'Calle Callao 789, Chincha Alta', 'Cliente solicitó una mejora en el plan contratado.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(13, 32, NULL, 13, '2024-02-03 13:15:00', 'Jirón Lima 321, Chincha Alta', 'Se finalizó la modificación solicitada.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(14, NULL, 33, 14, '2024-02-05 16:00:00', 'Calle Loreto 654, Chincha Alta', 'Se discutió la posibilidad de un nuevo contrato.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(15, 34, NULL, 15, '2024-02-07 11:45:00', 'Av. Mariscal Castilla 555, Chincha Alta', 'Se realizó una revisión técnica.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(16, NULL, 35, 16, '2024-02-09 14:30:00', 'Calle Zepita 412, Chincha Alta', 'Cliente aceptó el nuevo contrato propuesto.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(17, 36, NULL, 17, '2024-02-11 12:15:00', 'Jirón Túpac Amaru 876, Chincha Alta', 'Se confirmó el pago del nuevo contrato.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(18, NULL, 37, 18, '2024-02-13 09:30:00', 'Calle Junín 210, Chincha Alta', 'Se discutió un posible cambio en los términos del contrato.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(19, 38, NULL, 19, '2024-02-15 15:45:00', 'Av. Nicolás de Piérola 654, Chincha Alta', 'Cliente solicitó una visita técnica adicional.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(20, NULL, 39, 20, '2024-02-17 13:00:00', 'Calle Sucre 444, Chincha Alta', 'Se realizó el mantenimiento solicitado.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL),
(21, 40, NULL, 21, '2024-02-19 10:30:00', 'Av. Arica 765, Chincha Alta', 'Se acordó una renovación del plan actual.', NULL, '2024-12-12 09:54:47', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_contratos`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_contratos`;
CREATE TABLE IF NOT EXISTS `tb_contratos` (
  `id_contrato` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `id_paquete` int(11) NOT NULL,
  `id_sector` int(11) NOT NULL,
  `id_usuario_registro` int(11) NOT NULL,
  `id_usuario_tecnico` int(11) DEFAULT NULL,
  `direccion_servicio` varchar(200) NOT NULL,
  `referencia` varchar(200) DEFAULT NULL,
  `ficha_instalacion` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ficha_instalacion`)),
  `coordenada` varchar(50) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_registro` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `nota` text DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_contrato`),
  KEY `contr_fk_id_cliente` (`id_cliente`),
  KEY `contr_fk_id_tarifario` (`id_paquete`),
  KEY `contr_fk_id_sector` (`id_sector`),
  KEY `contr_fk_id_usuario_registro` (`id_usuario_registro`),
  KEY `contr_fk_id_usuario_tecnico` (`id_usuario_tecnico`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_contratos`:
--   `id_cliente`
--       `tb_clientes` -> `id_cliente`
--   `id_sector`
--       `tb_sectores` -> `id_sector`
--   `id_paquete`
--       `tb_paquetes` -> `id_paquete`
--   `id_usuario_registro`
--       `tb_responsables` -> `id_responsable`
--   `id_usuario_tecnico`
--       `tb_responsables` -> `id_responsable`
--

--
-- Volcado de datos para la tabla `tb_contratos`
--

INSERT INTO `tb_contratos` (`id_contrato`, `id_cliente`, `id_paquete`, `id_sector`, `id_usuario_registro`, `id_usuario_tecnico`, `direccion_servicio`, `referencia`, `ficha_instalacion`, `coordenada`, `fecha_inicio`, `fecha_registro`, `fecha_fin`, `nota`, `create_at`, `update_at`, `inactive_at`, `iduser_update`, `iduser_inactive`) VALUES
(1, 1, 3, 19, 1, NULL, 'Av. Luis Alva Maurtua SN', 'Cruz blanca 4ta cuadra  Oruro', '{\"fibraOptica\":{\"usuario\":\"ANGNAP1\",\"claveAcceso\":\"@ANGNAP1\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"21\",\"moden\":{\"ssid\":\"Familia Napa Abregu\",\"seguridad\":\"Dangel2024@\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"5G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"9\"}', '13.426161694436077,76.11948463094892', '2024-12-12', '2024-12-12', NULL, 'Migración', '2024-12-12 09:59:13', NULL, NULL, NULL, NULL),
(2, 2, 8, 19, 1, NULL, 'Calle San Luis #139', 'Chincha alta', '{\"fibraOptica\":{\"usuario\":\"MOIYAT2\",\"claveacceso\":\"@MOIYAT2\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet Duo Bronce 110MB - 80\",\"potencia\":21,\"moden\":{\"ssid\":\"GARCIA\",\"seguridad\":\"RARINA8722\",\"codigoBarra\":1234567890123,\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":4,\"catv\":true},\"detalles\":\"\"},\"idCaja\":\"9\",\"cable\":{\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":6,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":10,\"preciometro\":1.3000000000000000444089209850062616169452667236328125}},\"costo\":{\"pagoAdelantado\":\"30\",\"descuento\":\"0\",\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":1,\"costoAlquilerSintotizador\":40,\"cantidadCable\":\"10\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"6\"}}}', '13.421583,76.122361', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:02:20', NULL, NULL, NULL, NULL),
(3, 3, 3, 6, 1, NULL, 'AA.HH. Virgen Del Carmen MzG N18', 'Chincha Alta', '{\"fibraOptica\":{\"usuario\":\"MARMES3\",\"claveAcceso\":\"@MARMES3\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"-21\",\"moden\":{\"ssid\":\"MARYORI MESIAS\",\"seguridad\":\"alexia2229\",\"codigoBarra\":\"1234567890128\",\"marca\":\"Micronics\",\"modelo\":\"C\\u00e1mara Web MIC W360 + micr\\u00f3fono\",\"serie\":\"1234567890128\",\"banda\":[\"2G\"],\"numeroantena\":4,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"7\"}', '13.427543182910426,76.12667173509712', '2024-12-12', '2024-12-12', NULL, 'as', '2024-12-12 10:15:33', NULL, NULL, NULL, NULL),
(4, 4, 3, 6, 1, NULL, 'Av San Martin #103', 'Sunampe', '{\"fibraOptica\":{\"usuario\":\"ROBANC4\",\"claveAcceso\":\"@ROBANC4\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"-21\",\"moden\":{\"ssid\":\"ANCHANTE SUNAMPE\",\"seguridad\":\"@r0b3r70@l\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"7\"}', '13.433306,76.137694', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:21:23', NULL, NULL, NULL, NULL),
(5, 5, 3, 6, 1, NULL, 'Psj. Los Angeles SN', 'Mina de oro', '{\"fibraOptica\":{\"usuario\":\"MIGTAS5\",\"claveAcceso\":\"@MIGTAS5\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"-21\",\"moden\":{\"ssid\":\"TASAYCO HERNANDEZ\",\"seguridad\":\"LucasTasayco\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":4,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"7\"}', '13.431687529107938,76.14425921478924', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:25:10', NULL, NULL, NULL, NULL),
(6, 6, 3, 19, 1, NULL, 'Av. Santa Rosa N° 312', 'Lomo largo', '{\"fibraOptica\":{\"usuario\":\"PATPAS6\",\"claveAcceso\":\"@PATPAS6\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"-17\",\"moden\":{\"ssid\":\"APRIL URIBE\",\"seguridad\":\"12030829\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"3\"}', '13.424111,76.168028', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:29:04', NULL, NULL, NULL, NULL),
(7, 7, 3, 6, 1, NULL, 'Psj. San Cosme #185', 'Calle Rosario 7ma Cuadra', '{\"fibraOptica\":{\"usuario\":\"YHOGOI7\",\"claveAcceso\":\"@YHOGOI7\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"-21\",\"moden\":{\"ssid\":\"JHON\",\"seguridad\":\"JHON041221\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"MIGRACION \\nCANCELAR\\u00c1 EN 5 CUOTAS MENSUALES\",\"repetidores\":[]},\"idCaja\":\"6\"}', '13.406222,76.138167', '2024-12-12', '2024-12-12', NULL, 'MIGRACION EN 5 CUOTAS, YA QUE CONFIRMÓ SU 1° CUOTA DE 10.00 QUEDA 40.00', '2024-12-12 10:34:56', NULL, NULL, NULL, NULL),
(8, 8, 46, 19, 1, NULL, 'Psj. San Vicente MzP Lt16', 'Sunampe', '{\"cable\":{\"plan\":\"MAY054 NUEVO SERVICIO SOLO CATV 3 TV - BASICO + 1 APL\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":4,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":10,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"3\"},\"costo\":{\"nap\":{\"gpon\":\"-22\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"10\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"4\"}}}', '13.419420067775715,76.16254726052652', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:37:34', NULL, NULL, NULL, NULL),
(9, 9, 42, 19, 1, NULL, 'Av. San Antonio', 'Santa Rosa  Sunampe', '{\"cable\":{\"plan\":\"ABRO1 SERVICIO CATV 2 TV-BASICO + 1 APL - DUO 80 ANTERIOR\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":2,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":10,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"3\"},\"costo\":{\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"10\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"2\"}}}', '13.421635843858782,76.15750962541175', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:39:47', NULL, NULL, NULL, NULL),
(10, 10, 42, 19, 1, NULL, 'PSj. Primaveral Lt11022', 'Cruz Blanca', NULL, '13.42625006664019,76.12213590908762', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:43:38', NULL, NULL, NULL, NULL),
(11, 11, 3, 19, 1, NULL, 'Psj. Los Claveles N° 207', 'Cruz Blanca  Chinhca Alta', '{\"fibraOptica\":{\"usuario\":\"MARLEV11\",\"claveAcceso\":\"@MARLEV11\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"-21\",\"moden\":{\"ssid\":\"YESSICA\",\"seguridad\":\"YASUMI03\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"9\"}', '13.423222,76.123889', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:45:07', NULL, NULL, NULL, NULL),
(12, 12, 45, 6, 1, NULL, 'Calle Parada de los amigos', 'Sunampe', '{\"cable\":{\"plan\":\"MAY053 NUEVO SERVICIO CATV 3 TV - BASICO + 1 APL\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":8,\"precio\":1.5},\"spliter\":[{\"cantidad\":2,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":5,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"6\"},\"costo\":{\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"5\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"8\"}}}', '13.407525708435607,76.14538940853677', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:47:12', NULL, NULL, NULL, NULL),
(13, 13, 42, 11, 1, NULL, 'Barrio el por venir', 'Grocio Prado', '{\"cable\":{\"plan\":\"ABRO1 SERVICIO CATV 2 TV-BASICO + 1 APL - DUO 80 ANTERIOR\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":7,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":15,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"1\"},\"costo\":{\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"15\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"7\"}}}', '13.394448960679632,76.15591102236735', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:49:46', NULL, NULL, NULL, NULL),
(14, 14, 3, 6, 1, NULL, 'Upis Divina Misericordia MzB Lt6A', 'Chincha Alta', '{\"fibraOptica\":{\"usuario\":\"VICSAN14\",\"claveAcceso\":\"@VICSAN14\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"15\",\"moden\":{\"ssid\":\"YERLY SANTIAGO\",\"seguridad\":\"E161804V\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"8\"}', '13.416084194101291,76.1410193366925', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:51:45', NULL, NULL, NULL, NULL),
(15, 16, 3, 6, 1, NULL, 'Urb Los Viñedos N° UZ12', 'Chincha Alta', '{\"fibraOptica\":{\"usuario\":\"CECGAR15\",\"claveAcceso\":\"@CECGAR15\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"-21\",\"moden\":{\"ssid\":\"Cecilia Garcia\",\"seguridad\":\"capibara\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":true},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"6\"}', '13.40625,76.140111', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 10:56:16', NULL, NULL, NULL, NULL),
(16, 17, 3, 19, 1, NULL, 'Psj. San Jose MzH Lt10', 'Sunampe', '{\"fibraOptica\":{\"usuario\":\"CRIGEN16\",\"claveAcceso\":\"@CRIGEN16\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"22\",\"moden\":{\"ssid\":\"FAMILIA OSORES\",\"seguridad\":\"47898813\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"3\"}', '13.421139,76.169333', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:00:34', NULL, NULL, NULL, NULL),
(17, 18, 3, 11, 1, NULL, 'Calle Sebastian Barranca Lt14C', 'Grocio Prado', '{\"fibraOptica\":{\"usuario\":\"DANBAR17\",\"claveAcceso\":\"@DANBAR17\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"21\",\"moden\":{\"ssid\":\"DANIEL BARILLAS\",\"seguridad\":\"44176871\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"1\"}', '13.382739194195914,76.15369171554363', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:02:19', NULL, NULL, NULL, NULL),
(18, 19, 10, 19, 1, NULL, 'Psj. San Blas  Calle A Lt02', 'Alfonso Ugarte NorteSunampe', '{\"fibraOptica\":{\"usuario\":\"PEDCRI18\",\"claveacceso\":\"@PEDCRI18\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet Duo Oro 210MB - 120\",\"potencia\":21,\"moden\":{\"ssid\":\"PEDRO CRISOSTOMO\",\"seguridad\":\"pedro crisostomo 2401\",\"codigoBarra\":1234567890123,\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":4,\"catv\":true},\"detalles\":\"\"},\"idCaja\":\"3\",\"cable\":{\"pagoinstalacion\":30,\"potencia\":\"-11\",\"triplexor\":{\"requerido\":\"false\",\"cargador\":\" false\"},\"conector\":{\"numeroconector\":1,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":1,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"sintonizadores\":[{\"numero\":1,\"marcaModelo\":\"ASUS\",\"serie\":\"1234567890\"}]},\"costo\":{\"pagoAdelantado\":\"30\",\"descuento\":\"0\",\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":1,\"costoAlquilerSintotizador\":40,\"cantidadCable\":\"1\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"1\"}}}', '13.420511817158735,76.1692617684611', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:04:14', NULL, NULL, NULL, NULL),
(19, 20, 3, 6, 1, NULL, 'Av. Unión N°3A  Los Alamos', 'Pueblo Nuevo', '{\"fibraOptica\":{\"usuario\":\"NAYHUA19\",\"claveAcceso\":\"@NAYHUA19\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"18\",\"moden\":{\"ssid\":\"GARAY\",\"seguridad\":\"21866770\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":4,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"6\"}', '13.40375,76.138222', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:10:32', NULL, NULL, NULL, NULL),
(20, 21, 3, 19, 1, NULL, 'Psj. La frontera N° 257', 'Lomo Largo  Sunampe', '{\"fibraOptica\":{\"usuario\":\"LUILOB20\",\"claveAcceso\":\"@LUILOB20\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"21\",\"moden\":{\"ssid\":\"lobo\",\"seguridad\":\"08129800\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"3\"}', '13.42025,76.165306', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:13:24', NULL, NULL, NULL, NULL),
(21, 22, 6, 11, 1, NULL, 'AA.HH El Salvador MzJ Sub Lt22', 'Pueblo Nuevo a 2 casas de la torre', '{\"fibraOptica\":{\"usuario\":\"EDDDIA21\",\"claveAcceso\":\"@EDDDIA21\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet MIGRA 210MB - 110\",\"potencia\":\"20\",\"moden\":{\"ssid\":\"HOUSE\",\"seguridad\":\"998877312\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"5\"}', '13.39575,76.142361', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:16:48', NULL, NULL, NULL, NULL),
(22, 23, 13, 19, 1, NULL, 'Av. Alva Maurtua MzJ Lt16', 'Cruz Blanca', '{\"fibraOptica\":{\"usuario\":\"DELNAP22\",\"claveacceso\":\"@DELNAP22\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet Full Duo 2 - 190MB - 99\",\"potencia\":16,\"moden\":{\"ssid\":\"benjamin\",\"seguridad\":\"ciber0707\",\"codigoBarra\":1234567890123,\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false},\"detalles\":\"\"},\"idCaja\":\"9\",\"cable\":{\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"false\",\"cargador\":\" false\"},\"conector\":{\"numeroconector\":1,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":10,\"preciometro\":1.3000000000000000444089209850062616169452667236328125}},\"costo\":{\"pagoAdelantado\":\"0\",\"descuento\":\"0\",\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"10\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"1\"}}}', '13.426494050588131,76.11781617967458', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:18:21', NULL, NULL, NULL, NULL),
(23, 24, 3, 11, 1, NULL, 'Upis San Andrés MzA Lt6', 'Pueblo Nuevo', '{\"fibraOptica\":{\"usuario\":\"EPIMAR23\",\"claveAcceso\":\"@EPIMAR23\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"18\",\"moden\":{\"ssid\":\"ANDREA\",\"seguridad\":\"11112222\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":true},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"2\"}', '13.392583,76.139028', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:22:16', NULL, NULL, NULL, NULL),
(24, 25, 3, 11, 1, NULL, 'Upis San Andrés MzI Lt19', 'Pueblo Nuevo', NULL, '13.394111,76.137361', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:24:17', NULL, NULL, NULL, NULL),
(25, 27, 44, 6, 1, NULL, 'Calle Pedro Moreno N° 130', 'Grocio Prado', '{\"cable\":{\"plan\":\"JUN056 PLAN DUO + 01 TV = CATV 4 TV - BASICO + 1 APL\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"false\",\"cargador\":\" false\"},\"conector\":{\"numeroconector\":1,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"Elige una opci\\u00f3n\"}],\"cable\":{\"metrosadicionales\":1,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"6\"},\"costo\":{\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-12\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"1\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"01\"}}}', '13.410833,76.140333', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:25:27', NULL, NULL, NULL, NULL),
(26, 28, 45, 19, 1, NULL, 'Av. Los Angeles #512  Sunampe', 'Frente discoteca the boss', '{\"cable\":{\"plan\":\"MAY053 NUEVO SERVICIO CATV 3 TV - BASICO + 1 APL\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":1,\"precio\":1.5},\"spliter\":[{\"cantidad\":2,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":57,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"3\"},\"costo\":{\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"57\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"1\"}}}', '13.420260431574963,76.1690855144938', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:27:46', NULL, NULL, NULL, NULL),
(27, 30, 43, 19, 1, NULL, 'Psj. San gregorio SN', 'Alameda  Sunampe', '{\"cable\":{\"plan\":\"AGOS080 NUEVO SERVICIO SOLO CATV3 TV - BASICO + 1 APL\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":1,\"precio\":1.5},\"spliter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":10,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"3\"},\"costo\":{\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"10\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"1\"}}}', '13.425733136757316,76.15980551214437', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:32:23', NULL, NULL, NULL, NULL),
(28, 31, 3, 19, 1, NULL, 'Psj. 2 de mayo #309', 'Cruz Blanca', '{\"fibraOptica\":{\"usuario\":\"OSWPEV28\",\"claveAcceso\":\"@OSWPEV28\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet 110MB - 70\",\"potencia\":\"20\",\"moden\":{\"ssid\":\"FAMILIA PEVE\",\"seguridad\":\"19211531\",\"codigoBarra\":\"1234567890123\",\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":2,\"catv\":false},\"detallesModen\":\"\",\"repetidores\":[]},\"idCaja\":\"9\"}', '13.4261514606112,76.12088547549294', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:35:41', NULL, NULL, NULL, NULL),
(29, 32, 44, 6, 1, NULL, 'Psj. San Juan de Dios', 'Cruz Blanca', '{\"cable\":{\"plan\":\"JUN056 PLAN DUO + 01 TV = CATV 4 TV - BASICO + 1 APL\",\"periodo\":\"2025-06-12\",\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"false\",\"cargador\":\" false\"},\"conector\":{\"numeroconector\":1,\"precio\":1.5},\"spliter\":[{\"cantidad\":2,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":5,\"preciometro\":1.3000000000000000444089209850062616169452667236328125},\"idCaja\":\"8\"},\"costo\":{\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"5\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"1\"}}}', '13.4170868545878,76.13743158832351', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:37:22', NULL, NULL, NULL, NULL),
(30, 33, 14, 19, 1, NULL, 'AA.HH Jesús María y Jesús MzD Lt02', 'Chincha Alta', '{\"fibraOptica\":{\"usuario\":\"VICTOR30\",\"claveacceso\":\"@VICTOR30\",\"periodo\":\"2025-06-12\",\"plan\":\"Plan Internet Full Duo 3 - 260MB - 120\",\"potencia\":-21,\"moden\":{\"ssid\":\"GISELA\",\"seguridad\":\"VICTOR14\",\"codigoBarra\":1234567890123,\"marca\":\"TP Link\",\"modelo\":\"Router\",\"serie\":\"1234567890123\",\"banda\":[\"5G\"],\"numeroantena\":2,\"catv\":false},\"detalles\":\"\"},\"idCaja\":\"9\",\"cable\":{\"pagoinstalacion\":30,\"potencia\":\"-21\",\"triplexor\":{\"requerido\":\"true\",\"cargador\":\"false\"},\"conector\":{\"numeroconector\":2,\"precio\":1.5},\"spliter\":[{\"cantidad\":2,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":12,\"preciometro\":1.3000000000000000444089209850062616169452667236328125}},\"costo\":{\"pagoAdelantado\":\"30\",\"descuento\":\"0\",\"nap\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"casa\":{\"gpon\":\"-21\",\"catv\":\"-21\"},\"cableCosto\":{\"numerosintotizadores\":0,\"costoAlquilerSintotizador\":0,\"cantidadCable\":\"12\",\"precioCable\":\"1.30\",\"precioConector\":\"1.50\",\"cantidadConector\":\"2\"}}}', '13.426302785874682,76.1224713078623', '2024-12-12', '2024-12-12', NULL, '', '2024-12-12 11:38:56', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_departamentos`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_departamentos`;
CREATE TABLE IF NOT EXISTS `tb_departamentos` (
  `id_departamento` int(11) NOT NULL,
  `departamento` varchar(45) NOT NULL,
  PRIMARY KEY (`id_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_departamentos`:
--

--
-- Volcado de datos para la tabla `tb_departamentos`
--

INSERT INTO `tb_departamentos` (`id_departamento`, `departamento`) VALUES
(1, 'Amazonas'),
(2, 'Áncash'),
(3, 'Apurímac'),
(4, 'Arequipa'),
(5, 'Ayacucho'),
(6, 'Cajamarca'),
(7, 'Callao'),
(8, 'Cusco'),
(9, 'Huancavelica'),
(10, 'Huánuco'),
(11, 'Ica'),
(12, 'Junín'),
(13, 'La Libertad'),
(14, 'Lambayeque'),
(15, 'Lima'),
(16, 'Loreto'),
(17, 'Madre de Dios'),
(18, 'Moquegua'),
(19, 'Pasco'),
(20, 'Piura'),
(21, 'Puno'),
(22, 'San Martín'),
(23, 'Tacna'),
(24, 'Tumbes'),
(25, 'Ucayali');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_distritos`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_distritos`;
CREATE TABLE IF NOT EXISTS `tb_distritos` (
  `id_distrito` int(11) NOT NULL,
  `distrito` varchar(45) DEFAULT NULL,
  `id_provincia` int(11) DEFAULT NULL,
  `id_departamento` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_distrito`),
  KEY `distr_fk_id_provincia` (`id_provincia`),
  KEY `distr_fk_id_departamento` (`id_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_distritos`:
--   `id_departamento`
--       `tb_departamentos` -> `id_departamento`
--   `id_provincia`
--       `tb_provincias` -> `id_provincia`
--

--
-- Volcado de datos para la tabla `tb_distritos`
--

INSERT INTO `tb_distritos` (`id_distrito`, `distrito`, `id_provincia`, `id_departamento`) VALUES
(10101, 'Chachapoyas', 101, 1),
(10102, 'Asunción', 101, 1),
(10103, 'Balsas', 101, 1),
(10104, 'Cheto', 101, 1),
(10105, 'Chiliquin', 101, 1),
(10106, 'Chuquibamba', 101, 1),
(10107, 'Granada', 101, 1),
(10108, 'Huancas', 101, 1),
(10109, 'La Jalca', 101, 1),
(10110, 'Leimebamba', 101, 1),
(10111, 'Levanto', 101, 1),
(10112, 'Magdalena', 101, 1),
(10113, 'Mariscal Castilla', 101, 1),
(10114, 'Molinopampa', 101, 1),
(10115, 'Montevideo', 101, 1),
(10116, 'Olleros', 101, 1),
(10117, 'Quinjalca', 101, 1),
(10118, 'San Francisco de Daguas', 101, 1),
(10119, 'San Isidro de Maino', 101, 1),
(10120, 'Soloco', 101, 1),
(10121, 'Sonche', 101, 1),
(10201, 'Bagua', 102, 1),
(10202, 'Aramango', 102, 1),
(10203, 'Copallin', 102, 1),
(10204, 'El Parco', 102, 1),
(10205, 'Imaza', 102, 1),
(10206, 'La Peca', 102, 1),
(10301, 'Jumbilla', 103, 1),
(10302, 'Chisquilla', 103, 1),
(10303, 'Churuja', 103, 1),
(10304, 'Corosha', 103, 1),
(10305, 'Cuispes', 103, 1),
(10306, 'Florida', 103, 1),
(10307, 'Jazan', 103, 1),
(10308, 'Recta', 103, 1),
(10309, 'San Carlos', 103, 1),
(10310, 'Shipasbamba', 103, 1),
(10311, 'Valera', 103, 1),
(10312, 'Yambrasbamba', 103, 1),
(10401, 'Nieva', 104, 1),
(10402, 'El Cenepa', 104, 1),
(10403, 'Río Santiago', 104, 1),
(10501, 'Lamud', 105, 1),
(10502, 'Camporredondo', 105, 1),
(10503, 'Cocabamba', 105, 1),
(10504, 'Colcamar', 105, 1),
(10505, 'Conila', 105, 1),
(10506, 'Inguilpata', 105, 1),
(10507, 'Longuita', 105, 1),
(10508, 'Lonya Chico', 105, 1),
(10509, 'Luya', 105, 1),
(10510, 'Luya Viejo', 105, 1),
(10511, 'María', 105, 1),
(10512, 'Ocalli', 105, 1),
(10513, 'Ocumal', 105, 1),
(10514, 'Pisuquia', 105, 1),
(10515, 'Providencia', 105, 1),
(10516, 'San Cristóbal', 105, 1),
(10517, 'San Francisco de Yeso', 105, 1),
(10518, 'San Jerónimo', 105, 1),
(10519, 'San Juan de Lopecancha', 105, 1),
(10520, 'Santa Catalina', 105, 1),
(10521, 'Santo Tomas', 105, 1),
(10522, 'Tingo', 105, 1),
(10523, 'Trita', 105, 1),
(10601, 'San Nicolás', 106, 1),
(10602, 'Chirimoto', 106, 1),
(10603, 'Cochamal', 106, 1),
(10604, 'Huambo', 106, 1),
(10605, 'Limabamba', 106, 1),
(10606, 'Longar', 106, 1),
(10607, 'Mariscal Benavides', 106, 1),
(10608, 'Milpuc', 106, 1),
(10609, 'Omia', 106, 1),
(10610, 'Santa Rosa', 106, 1),
(10611, 'Totora', 106, 1),
(10612, 'Vista Alegre', 106, 1),
(10701, 'Bagua Grande', 107, 1),
(10702, 'Cajaruro', 107, 1),
(10703, 'Cumba', 107, 1),
(10704, 'El Milagro', 107, 1),
(10705, 'Jamalca', 107, 1),
(10706, 'Lonya Grande', 107, 1),
(10707, 'Yamon', 107, 1),
(20101, 'Huaraz', 201, 2),
(20102, 'Cochabamba', 201, 2),
(20103, 'Colcabamba', 201, 2),
(20104, 'Huanchay', 201, 2),
(20105, 'Independencia', 201, 2),
(20106, 'Jangas', 201, 2),
(20107, 'La Libertad', 201, 2),
(20108, 'Olleros', 201, 2),
(20109, 'Pampas Grande', 201, 2),
(20110, 'Pariacoto', 201, 2),
(20111, 'Pira', 201, 2),
(20112, 'Tarica', 201, 2),
(20201, 'Aija', 202, 2),
(20202, 'Coris', 202, 2),
(20203, 'Huacllan', 202, 2),
(20204, 'La Merced', 202, 2),
(20205, 'Succha', 202, 2),
(20301, 'Llamellin', 203, 2),
(20302, 'Aczo', 203, 2),
(20303, 'Chaccho', 203, 2),
(20304, 'Chingas', 203, 2),
(20305, 'Mirgas', 203, 2),
(20306, 'San Juan de Rontoy', 203, 2),
(20401, 'Chacas', 204, 2),
(20402, 'Acochaca', 204, 2),
(20501, 'Chiquian', 205, 2),
(20502, 'Abelardo Pardo Lezameta', 205, 2),
(20503, 'Antonio Raymondi', 205, 2),
(20504, 'Aquia', 205, 2),
(20505, 'Cajacay', 205, 2),
(20506, 'Canis', 205, 2),
(20507, 'Colquioc', 205, 2),
(20508, 'Huallanca', 205, 2),
(20509, 'Huasta', 205, 2),
(20510, 'Huayllacayan', 205, 2),
(20511, 'La Primavera', 205, 2),
(20512, 'Mangas', 205, 2),
(20513, 'Pacllon', 205, 2),
(20514, 'San Miguel de Corpanqui', 205, 2),
(20515, 'Ticllos', 205, 2),
(20601, 'Carhuaz', 206, 2),
(20602, 'Acopampa', 206, 2),
(20603, 'Amashca', 206, 2),
(20604, 'Anta', 206, 2),
(20605, 'Ataquero', 206, 2),
(20606, 'Marcara', 206, 2),
(20607, 'Pariahuanca', 206, 2),
(20608, 'San Miguel de Aco', 206, 2),
(20609, 'Shilla', 206, 2),
(20610, 'Tinco', 206, 2),
(20611, 'Yungar', 206, 2),
(20701, 'San Luis', 207, 2),
(20702, 'San Nicolás', 207, 2),
(20703, 'Yauya', 207, 2),
(20801, 'Casma', 208, 2),
(20802, 'Buena Vista Alta', 208, 2),
(20803, 'Comandante Noel', 208, 2),
(20804, 'Yautan', 208, 2),
(20901, 'Corongo', 209, 2),
(20902, 'Aco', 209, 2),
(20903, 'Bambas', 209, 2),
(20904, 'Cusca', 209, 2),
(20905, 'La Pampa', 209, 2),
(20906, 'Yanac', 209, 2),
(20907, 'Yupan', 209, 2),
(21001, 'Huari', 210, 2),
(21002, 'Anra', 210, 2),
(21003, 'Cajay', 210, 2),
(21004, 'Chavin de Huantar', 210, 2),
(21005, 'Huacachi', 210, 2),
(21006, 'Huacchis', 210, 2),
(21007, 'Huachis', 210, 2),
(21008, 'Huantar', 210, 2),
(21009, 'Masin', 210, 2),
(21010, 'Paucas', 210, 2),
(21011, 'Ponto', 210, 2),
(21012, 'Rahuapampa', 210, 2),
(21013, 'Rapayan', 210, 2),
(21014, 'San Marcos', 210, 2),
(21015, 'San Pedro de Chana', 210, 2),
(21016, 'Uco', 210, 2),
(21101, 'Huarmey', 211, 2),
(21102, 'Cochapeti', 211, 2),
(21103, 'Culebras', 211, 2),
(21104, 'Huayan', 211, 2),
(21105, 'Malvas', 211, 2),
(21201, 'Caraz', 212, 2),
(21202, 'Huallanca', 212, 2),
(21203, 'Huata', 212, 2),
(21204, 'Huaylas', 212, 2),
(21205, 'Mato', 212, 2),
(21206, 'Pamparomas', 212, 2),
(21207, 'Pueblo Libre', 212, 2),
(21208, 'Santa Cruz', 212, 2),
(21209, 'Santo Toribio', 212, 2),
(21210, 'Yuracmarca', 212, 2),
(21301, 'Piscobamba', 213, 2),
(21302, 'Casca', 213, 2),
(21303, 'Eleazar Guzmán Barron', 213, 2),
(21304, 'Fidel Olivas Escudero', 213, 2),
(21305, 'Llama', 213, 2),
(21306, 'Llumpa', 213, 2),
(21307, 'Lucma', 213, 2),
(21308, 'Musga', 213, 2),
(21401, 'Ocros', 214, 2),
(21402, 'Acas', 214, 2),
(21403, 'Cajamarquilla', 214, 2),
(21404, 'Carhuapampa', 214, 2),
(21405, 'Cochas', 214, 2),
(21406, 'Congas', 214, 2),
(21407, 'Llipa', 214, 2),
(21408, 'San Cristóbal de Rajan', 214, 2),
(21409, 'San Pedro', 214, 2),
(21410, 'Santiago de Chilcas', 214, 2),
(21501, 'Cabana', 215, 2),
(21502, 'Bolognesi', 215, 2),
(21503, 'Conchucos', 215, 2),
(21504, 'Huacaschuque', 215, 2),
(21505, 'Huandoval', 215, 2),
(21506, 'Lacabamba', 215, 2),
(21507, 'Llapo', 215, 2),
(21508, 'Pallasca', 215, 2),
(21509, 'Pampas', 215, 2),
(21510, 'Santa Rosa', 215, 2),
(21511, 'Tauca', 215, 2),
(21601, 'Pomabamba', 216, 2),
(21602, 'Huayllan', 216, 2),
(21603, 'Parobamba', 216, 2),
(21604, 'Quinuabamba', 216, 2),
(21701, 'Recuay', 217, 2),
(21702, 'Catac', 217, 2),
(21703, 'Cotaparaco', 217, 2),
(21704, 'Huayllapampa', 217, 2),
(21705, 'Llacllin', 217, 2),
(21706, 'Marca', 217, 2),
(21707, 'Pampas Chico', 217, 2),
(21708, 'Pararin', 217, 2),
(21709, 'Tapacocha', 217, 2),
(21710, 'Ticapampa', 217, 2),
(21801, 'Chimbote', 218, 2),
(21802, 'Cáceres del Perú', 218, 2),
(21803, 'Coishco', 218, 2),
(21804, 'Macate', 218, 2),
(21805, 'Moro', 218, 2),
(21806, 'Nepeña', 218, 2),
(21807, 'Samanco', 218, 2),
(21808, 'Santa', 218, 2),
(21809, 'Nuevo Chimbote', 218, 2),
(21901, 'Sihuas', 219, 2),
(21902, 'Acobamba', 219, 2),
(21903, 'Alfonso Ugarte', 219, 2),
(21904, 'Cashapampa', 219, 2),
(21905, 'Chingalpo', 219, 2),
(21906, 'Huayllabamba', 219, 2),
(21907, 'Quiches', 219, 2),
(21908, 'Ragash', 219, 2),
(21909, 'San Juan', 219, 2),
(21910, 'Sicsibamba', 219, 2),
(22001, 'Yungay', 220, 2),
(22002, 'Cascapara', 220, 2),
(22003, 'Mancos', 220, 2),
(22004, 'Matacoto', 220, 2),
(22005, 'Quillo', 220, 2),
(22006, 'Ranrahirca', 220, 2),
(22007, 'Shupluy', 220, 2),
(22008, 'Yanama', 220, 2),
(30101, 'Abancay', 301, 3),
(30102, 'Chacoche', 301, 3),
(30103, 'Circa', 301, 3),
(30104, 'Curahuasi', 301, 3),
(30105, 'Huanipaca', 301, 3),
(30106, 'Lambrama', 301, 3),
(30107, 'Pichirhua', 301, 3),
(30108, 'San Pedro de Cachora', 301, 3),
(30109, 'Tamburco', 301, 3),
(30201, 'Andahuaylas', 302, 3),
(30202, 'Andarapa', 302, 3),
(30203, 'Chiara', 302, 3),
(30204, 'Huancarama', 302, 3),
(30205, 'Huancaray', 302, 3),
(30206, 'Huayana', 302, 3),
(30207, 'Kishuara', 302, 3),
(30208, 'Pacobamba', 302, 3),
(30209, 'Pacucha', 302, 3),
(30210, 'Pampachiri', 302, 3),
(30211, 'Pomacocha', 302, 3),
(30212, 'San Antonio de Cachi', 302, 3),
(30213, 'San Jerónimo', 302, 3),
(30214, 'San Miguel de Chaccrampa', 302, 3),
(30215, 'Santa María de Chicmo', 302, 3),
(30216, 'Talavera', 302, 3),
(30217, 'Tumay Huaraca', 302, 3),
(30218, 'Turpo', 302, 3),
(30219, 'Kaquiabamba', 302, 3),
(30220, 'José María Arguedas', 302, 3),
(30301, 'Antabamba', 303, 3),
(30302, 'El Oro', 303, 3),
(30303, 'Huaquirca', 303, 3),
(30304, 'Juan Espinoza Medrano', 303, 3),
(30305, 'Oropesa', 303, 3),
(30306, 'Pachaconas', 303, 3),
(30307, 'Sabaino', 303, 3),
(30401, 'Chalhuanca', 304, 3),
(30402, 'Capaya', 304, 3),
(30403, 'Caraybamba', 304, 3),
(30404, 'Chapimarca', 304, 3),
(30405, 'Colcabamba', 304, 3),
(30406, 'Cotaruse', 304, 3),
(30407, 'Ihuayllo', 304, 3),
(30408, 'Justo Apu Sahuaraura', 304, 3),
(30409, 'Lucre', 304, 3),
(30410, 'Pocohuanca', 304, 3),
(30411, 'San Juan de Chacña', 304, 3),
(30412, 'Sañayca', 304, 3),
(30413, 'Soraya', 304, 3),
(30414, 'Tapairihua', 304, 3),
(30415, 'Tintay', 304, 3),
(30416, 'Toraya', 304, 3),
(30417, 'Yanaca', 304, 3),
(30501, 'Tambobamba', 305, 3),
(30502, 'Cotabambas', 305, 3),
(30503, 'Coyllurqui', 305, 3),
(30504, 'Haquira', 305, 3),
(30505, 'Mara', 305, 3),
(30506, 'Challhuahuacho', 305, 3),
(30601, 'Chincheros', 306, 3),
(30602, 'Anco_Huallo', 306, 3),
(30603, 'Cocharcas', 306, 3),
(30604, 'Huaccana', 306, 3),
(30605, 'Ocobamba', 306, 3),
(30606, 'Ongoy', 306, 3),
(30607, 'Uranmarca', 306, 3),
(30608, 'Ranracancha', 306, 3),
(30609, 'Rocchacc', 306, 3),
(30610, 'El Porvenir', 306, 3),
(30611, 'Los Chankas', 306, 3),
(30701, 'Chuquibambilla', 307, 3),
(30702, 'Curpahuasi', 307, 3),
(30703, 'Gamarra', 307, 3),
(30704, 'Huayllati', 307, 3),
(30705, 'Mamara', 307, 3),
(30706, 'Micaela Bastidas', 307, 3),
(30707, 'Pataypampa', 307, 3),
(30708, 'Progreso', 307, 3),
(30709, 'San Antonio', 307, 3),
(30710, 'Santa Rosa', 307, 3),
(30711, 'Turpay', 307, 3),
(30712, 'Vilcabamba', 307, 3),
(30713, 'Virundo', 307, 3),
(30714, 'Curasco', 307, 3),
(40101, 'Arequipa', 401, 4),
(40102, 'Alto Selva Alegre', 401, 4),
(40103, 'Cayma', 401, 4),
(40104, 'Cerro Colorado', 401, 4),
(40105, 'Characato', 401, 4),
(40106, 'Chiguata', 401, 4),
(40107, 'Jacobo Hunter', 401, 4),
(40108, 'La Joya', 401, 4),
(40109, 'Mariano Melgar', 401, 4),
(40110, 'Miraflores', 401, 4),
(40111, 'Mollebaya', 401, 4),
(40112, 'Paucarpata', 401, 4),
(40113, 'Pocsi', 401, 4),
(40114, 'Polobaya', 401, 4),
(40115, 'Quequeña', 401, 4),
(40116, 'Sabandia', 401, 4),
(40117, 'Sachaca', 401, 4),
(40118, 'San Juan de Siguas', 401, 4),
(40119, 'San Juan de Tarucani', 401, 4),
(40120, 'Santa Isabel de Siguas', 401, 4),
(40121, 'Santa Rita de Siguas', 401, 4),
(40122, 'Socabaya', 401, 4),
(40123, 'Tiabaya', 401, 4),
(40124, 'Uchumayo', 401, 4),
(40125, 'Vitor', 401, 4),
(40126, 'Yanahuara', 401, 4),
(40127, 'Yarabamba', 401, 4),
(40128, 'Yura', 401, 4),
(40129, 'José Luis Bustamante Y Rivero', 401, 4),
(40201, 'Camaná', 402, 4),
(40202, 'José María Quimper', 402, 4),
(40203, 'Mariano Nicolás Valcárcel', 402, 4),
(40204, 'Mariscal Cáceres', 402, 4),
(40205, 'Nicolás de Pierola', 402, 4),
(40206, 'Ocoña', 402, 4),
(40207, 'Quilca', 402, 4),
(40208, 'Samuel Pastor', 402, 4),
(40301, 'Caravelí', 403, 4),
(40302, 'Acarí', 403, 4),
(40303, 'Atico', 403, 4),
(40304, 'Atiquipa', 403, 4),
(40305, 'Bella Unión', 403, 4),
(40306, 'Cahuacho', 403, 4),
(40307, 'Chala', 403, 4),
(40308, 'Chaparra', 403, 4),
(40309, 'Huanuhuanu', 403, 4),
(40310, 'Jaqui', 403, 4),
(40311, 'Lomas', 403, 4),
(40312, 'Quicacha', 403, 4),
(40313, 'Yauca', 403, 4),
(40401, 'Aplao', 404, 4),
(40402, 'Andagua', 404, 4),
(40403, 'Ayo', 404, 4),
(40404, 'Chachas', 404, 4),
(40405, 'Chilcaymarca', 404, 4),
(40406, 'Choco', 404, 4),
(40407, 'Huancarqui', 404, 4),
(40408, 'Machaguay', 404, 4),
(40409, 'Orcopampa', 404, 4),
(40410, 'Pampacolca', 404, 4),
(40411, 'Tipan', 404, 4),
(40412, 'Uñon', 404, 4),
(40413, 'Uraca', 404, 4),
(40414, 'Viraco', 404, 4),
(40501, 'Chivay', 405, 4),
(40502, 'Achoma', 405, 4),
(40503, 'Cabanaconde', 405, 4),
(40504, 'Callalli', 405, 4),
(40505, 'Caylloma', 405, 4),
(40506, 'Coporaque', 405, 4),
(40507, 'Huambo', 405, 4),
(40508, 'Huanca', 405, 4),
(40509, 'Ichupampa', 405, 4),
(40510, 'Lari', 405, 4),
(40511, 'Lluta', 405, 4),
(40512, 'Maca', 405, 4),
(40513, 'Madrigal', 405, 4),
(40514, 'San Antonio de Chuca', 405, 4),
(40515, 'Sibayo', 405, 4),
(40516, 'Tapay', 405, 4),
(40517, 'Tisco', 405, 4),
(40518, 'Tuti', 405, 4),
(40519, 'Yanque', 405, 4),
(40520, 'Majes', 405, 4),
(40601, 'Chuquibamba', 406, 4),
(40602, 'Andaray', 406, 4),
(40603, 'Cayarani', 406, 4),
(40604, 'Chichas', 406, 4),
(40605, 'Iray', 406, 4),
(40606, 'Río Grande', 406, 4),
(40607, 'Salamanca', 406, 4),
(40608, 'Yanaquihua', 406, 4),
(40701, 'Mollendo', 407, 4),
(40702, 'Cocachacra', 407, 4),
(40703, 'Dean Valdivia', 407, 4),
(40704, 'Islay', 407, 4),
(40705, 'Mejia', 407, 4),
(40706, 'Punta de Bombón', 407, 4),
(40801, 'Cotahuasi', 408, 4),
(40802, 'Alca', 408, 4),
(40803, 'Charcana', 408, 4),
(40804, 'Huaynacotas', 408, 4),
(40805, 'Pampamarca', 408, 4),
(40806, 'Puyca', 408, 4),
(40807, 'Quechualla', 408, 4),
(40808, 'Sayla', 408, 4),
(40809, 'Tauria', 408, 4),
(40810, 'Tomepampa', 408, 4),
(40811, 'Toro', 408, 4),
(50101, 'Ayacucho', 501, 5),
(50102, 'Acocro', 501, 5),
(50103, 'Acos Vinchos', 501, 5),
(50104, 'Carmen Alto', 501, 5),
(50105, 'Chiara', 501, 5),
(50106, 'Ocros', 501, 5),
(50107, 'Pacaycasa', 501, 5),
(50108, 'Quinua', 501, 5),
(50109, 'San José de Ticllas', 501, 5),
(50110, 'San Juan Bautista', 501, 5),
(50111, 'Santiago de Pischa', 501, 5),
(50112, 'Socos', 501, 5),
(50113, 'Tambillo', 501, 5),
(50114, 'Vinchos', 501, 5),
(50115, 'Jesús Nazareno', 501, 5),
(50116, 'Andrés Avelino Cáceres Dorregaray', 501, 5),
(50201, 'Cangallo', 502, 5),
(50202, 'Chuschi', 502, 5),
(50203, 'Los Morochucos', 502, 5),
(50204, 'María Parado de Bellido', 502, 5),
(50205, 'Paras', 502, 5),
(50206, 'Totos', 502, 5),
(50301, 'Sancos', 503, 5),
(50302, 'Carapo', 503, 5),
(50303, 'Sacsamarca', 503, 5),
(50304, 'Santiago de Lucanamarca', 503, 5),
(50401, 'Huanta', 504, 5),
(50402, 'Ayahuanco', 504, 5),
(50403, 'Huamanguilla', 504, 5),
(50404, 'Iguain', 504, 5),
(50405, 'Luricocha', 504, 5),
(50406, 'Santillana', 504, 5),
(50407, 'Sivia', 504, 5),
(50408, 'Llochegua', 504, 5),
(50409, 'Canayre', 504, 5),
(50410, 'Uchuraccay', 504, 5),
(50411, 'Pucacolpa', 504, 5),
(50412, 'Chaca', 504, 5),
(50501, 'San Miguel', 505, 5),
(50502, 'Anco', 505, 5),
(50503, 'Ayna', 505, 5),
(50504, 'Chilcas', 505, 5),
(50505, 'Chungui', 505, 5),
(50506, 'Luis Carranza', 505, 5),
(50507, 'Santa Rosa', 505, 5),
(50508, 'Tambo', 505, 5),
(50509, 'Samugari', 505, 5),
(50510, 'Anchihuay', 505, 5),
(50511, 'Oronccoy', 505, 5),
(50601, 'Puquio', 506, 5),
(50602, 'Aucara', 506, 5),
(50603, 'Cabana', 506, 5),
(50604, 'Carmen Salcedo', 506, 5),
(50605, 'Chaviña', 506, 5),
(50606, 'Chipao', 506, 5),
(50607, 'Huac-Huas', 506, 5),
(50608, 'Laramate', 506, 5),
(50609, 'Leoncio Prado', 506, 5),
(50610, 'Llauta', 506, 5),
(50611, 'Lucanas', 506, 5),
(50612, 'Ocaña', 506, 5),
(50613, 'Otoca', 506, 5),
(50614, 'Saisa', 506, 5),
(50615, 'San Cristóbal', 506, 5),
(50616, 'San Juan', 506, 5),
(50617, 'San Pedro', 506, 5),
(50618, 'San Pedro de Palco', 506, 5),
(50619, 'Sancos', 506, 5),
(50620, 'Santa Ana de Huaycahuacho', 506, 5),
(50621, 'Santa Lucia', 506, 5),
(50701, 'Coracora', 507, 5),
(50702, 'Chumpi', 507, 5),
(50703, 'Coronel Castañeda', 507, 5),
(50704, 'Pacapausa', 507, 5),
(50705, 'Pullo', 507, 5),
(50706, 'Puyusca', 507, 5),
(50707, 'San Francisco de Ravacayco', 507, 5),
(50708, 'Upahuacho', 507, 5),
(50801, 'Pausa', 508, 5),
(50802, 'Colta', 508, 5),
(50803, 'Corculla', 508, 5),
(50804, 'Lampa', 508, 5),
(50805, 'Marcabamba', 508, 5),
(50806, 'Oyolo', 508, 5),
(50807, 'Pararca', 508, 5),
(50808, 'San Javier de Alpabamba', 508, 5),
(50809, 'San José de Ushua', 508, 5),
(50810, 'Sara Sara', 508, 5),
(50901, 'Querobamba', 509, 5),
(50902, 'Belén', 509, 5),
(50903, 'Chalcos', 509, 5),
(50904, 'Chilcayoc', 509, 5),
(50905, 'Huacaña', 509, 5),
(50906, 'Morcolla', 509, 5),
(50907, 'Paico', 509, 5),
(50908, 'San Pedro de Larcay', 509, 5),
(50909, 'San Salvador de Quije', 509, 5),
(50910, 'Santiago de Paucaray', 509, 5),
(50911, 'Soras', 509, 5),
(51001, 'Huancapi', 510, 5),
(51002, 'Alcamenca', 510, 5),
(51003, 'Apongo', 510, 5),
(51004, 'Asquipata', 510, 5),
(51005, 'Canaria', 510, 5),
(51006, 'Cayara', 510, 5),
(51007, 'Colca', 510, 5),
(51008, 'Huamanquiquia', 510, 5),
(51009, 'Huancaraylla', 510, 5),
(51010, 'Hualla', 510, 5),
(51011, 'Sarhua', 510, 5),
(51012, 'Vilcanchos', 510, 5),
(51101, 'Vilcas Huaman', 511, 5),
(51102, 'Accomarca', 511, 5),
(51103, 'Carhuanca', 511, 5),
(51104, 'Concepción', 511, 5),
(51105, 'Huambalpa', 511, 5),
(51106, 'Independencia', 511, 5),
(51107, 'Saurama', 511, 5),
(51108, 'Vischongo', 511, 5),
(60101, 'Cajamarca', 601, 6),
(60102, 'Asunción', 601, 6),
(60103, 'Chetilla', 601, 6),
(60104, 'Cospan', 601, 6),
(60105, 'Encañada', 601, 6),
(60106, 'Jesús', 601, 6),
(60107, 'Llacanora', 601, 6),
(60108, 'Los Baños del Inca', 601, 6),
(60109, 'Magdalena', 601, 6),
(60110, 'Matara', 601, 6),
(60111, 'Namora', 601, 6),
(60112, 'San Juan', 601, 6),
(60201, 'Cajabamba', 602, 6),
(60202, 'Cachachi', 602, 6),
(60203, 'Condebamba', 602, 6),
(60204, 'Sitacocha', 602, 6),
(60301, 'Celendín', 603, 6),
(60302, 'Chumuch', 603, 6),
(60303, 'Cortegana', 603, 6),
(60304, 'Huasmin', 603, 6),
(60305, 'Jorge Chávez', 603, 6),
(60306, 'José Gálvez', 603, 6),
(60307, 'Miguel Iglesias', 603, 6),
(60308, 'Oxamarca', 603, 6),
(60309, 'Sorochuco', 603, 6),
(60310, 'Sucre', 603, 6),
(60311, 'Utco', 603, 6),
(60312, 'La Libertad de Pallan', 603, 6),
(60401, 'Chota', 604, 6),
(60402, 'Anguia', 604, 6),
(60403, 'Chadin', 604, 6),
(60404, 'Chiguirip', 604, 6),
(60405, 'Chimban', 604, 6),
(60406, 'Choropampa', 604, 6),
(60407, 'Cochabamba', 604, 6),
(60408, 'Conchan', 604, 6),
(60409, 'Huambos', 604, 6),
(60410, 'Lajas', 604, 6),
(60411, 'Llama', 604, 6),
(60412, 'Miracosta', 604, 6),
(60413, 'Paccha', 604, 6),
(60414, 'Pion', 604, 6),
(60415, 'Querocoto', 604, 6),
(60416, 'San Juan de Licupis', 604, 6),
(60417, 'Tacabamba', 604, 6),
(60418, 'Tocmoche', 604, 6),
(60419, 'Chalamarca', 604, 6),
(60501, 'Contumaza', 605, 6),
(60502, 'Chilete', 605, 6),
(60503, 'Cupisnique', 605, 6),
(60504, 'Guzmango', 605, 6),
(60505, 'San Benito', 605, 6),
(60506, 'Santa Cruz de Toledo', 605, 6),
(60507, 'Tantarica', 605, 6),
(60508, 'Yonan', 605, 6),
(60601, 'Cutervo', 606, 6),
(60602, 'Callayuc', 606, 6),
(60603, 'Choros', 606, 6),
(60604, 'Cujillo', 606, 6),
(60605, 'La Ramada', 606, 6),
(60606, 'Pimpingos', 606, 6),
(60607, 'Querocotillo', 606, 6),
(60608, 'San Andrés de Cutervo', 606, 6),
(60609, 'San Juan de Cutervo', 606, 6),
(60610, 'San Luis de Lucma', 606, 6),
(60611, 'Santa Cruz', 606, 6),
(60612, 'Santo Domingo de la Capilla', 606, 6),
(60613, 'Santo Tomas', 606, 6),
(60614, 'Socota', 606, 6),
(60615, 'Toribio Casanova', 606, 6),
(60701, 'Bambamarca', 607, 6),
(60702, 'Chugur', 607, 6),
(60703, 'Hualgayoc', 607, 6),
(60801, 'Jaén', 608, 6),
(60802, 'Bellavista', 608, 6),
(60803, 'Chontali', 608, 6),
(60804, 'Colasay', 608, 6),
(60805, 'Huabal', 608, 6),
(60806, 'Las Pirias', 608, 6),
(60807, 'Pomahuaca', 608, 6),
(60808, 'Pucara', 608, 6),
(60809, 'Sallique', 608, 6),
(60810, 'San Felipe', 608, 6),
(60811, 'San José del Alto', 608, 6),
(60812, 'Santa Rosa', 608, 6),
(60901, 'San Ignacio', 609, 6),
(60902, 'Chirinos', 609, 6),
(60903, 'Huarango', 609, 6),
(60904, 'La Coipa', 609, 6),
(60905, 'Namballe', 609, 6),
(60906, 'San José de Lourdes', 609, 6),
(60907, 'Tabaconas', 609, 6),
(61001, 'Pedro Gálvez', 610, 6),
(61002, 'Chancay', 610, 6),
(61003, 'Eduardo Villanueva', 610, 6),
(61004, 'Gregorio Pita', 610, 6),
(61005, 'Ichocan', 610, 6),
(61006, 'José Manuel Quiroz', 610, 6),
(61007, 'José Sabogal', 610, 6),
(61101, 'San Miguel', 611, 6),
(61102, 'Bolívar', 611, 6),
(61103, 'Calquis', 611, 6),
(61104, 'Catilluc', 611, 6),
(61105, 'El Prado', 611, 6),
(61106, 'La Florida', 611, 6),
(61107, 'Llapa', 611, 6),
(61108, 'Nanchoc', 611, 6),
(61109, 'Niepos', 611, 6),
(61110, 'San Gregorio', 611, 6),
(61111, 'San Silvestre de Cochan', 611, 6),
(61112, 'Tongod', 611, 6),
(61113, 'Unión Agua Blanca', 611, 6),
(61201, 'San Pablo', 612, 6),
(61202, 'San Bernardino', 612, 6),
(61203, 'San Luis', 612, 6),
(61204, 'Tumbaden', 612, 6),
(61301, 'Santa Cruz', 613, 6),
(61302, 'Andabamba', 613, 6),
(61303, 'Catache', 613, 6),
(61304, 'Chancaybaños', 613, 6),
(61305, 'La Esperanza', 613, 6),
(61306, 'Ninabamba', 613, 6),
(61307, 'Pulan', 613, 6),
(61308, 'Saucepampa', 613, 6),
(61309, 'Sexi', 613, 6),
(61310, 'Uticyacu', 613, 6),
(61311, 'Yauyucan', 613, 6),
(70101, 'Callao', 701, 7),
(70102, 'Bellavista', 701, 7),
(70103, 'Carmen de la Legua Reynoso', 701, 7),
(70104, 'La Perla', 701, 7),
(70105, 'La Punta', 701, 7),
(70106, 'Ventanilla', 701, 7),
(70107, 'Mi Perú', 701, 7),
(80101, 'Cusco', 801, 8),
(80102, 'Ccorca', 801, 8),
(80103, 'Poroy', 801, 8),
(80104, 'San Jerónimo', 801, 8),
(80105, 'San Sebastian', 801, 8),
(80106, 'Santiago', 801, 8),
(80107, 'Saylla', 801, 8),
(80108, 'Wanchaq', 801, 8),
(80201, 'Acomayo', 802, 8),
(80202, 'Acopia', 802, 8),
(80203, 'Acos', 802, 8),
(80204, 'Mosoc Llacta', 802, 8),
(80205, 'Pomacanchi', 802, 8),
(80206, 'Rondocan', 802, 8),
(80207, 'Sangarara', 802, 8),
(80301, 'Anta', 803, 8),
(80302, 'Ancahuasi', 803, 8),
(80303, 'Cachimayo', 803, 8),
(80304, 'Chinchaypujio', 803, 8),
(80305, 'Huarocondo', 803, 8),
(80306, 'Limatambo', 803, 8),
(80307, 'Mollepata', 803, 8),
(80308, 'Pucyura', 803, 8),
(80309, 'Zurite', 803, 8),
(80401, 'Calca', 804, 8),
(80402, 'Coya', 804, 8),
(80403, 'Lamay', 804, 8),
(80404, 'Lares', 804, 8),
(80405, 'Pisac', 804, 8),
(80406, 'San Salvador', 804, 8),
(80407, 'Taray', 804, 8),
(80408, 'Yanatile', 804, 8),
(80501, 'Yanaoca', 805, 8),
(80502, 'Checca', 805, 8),
(80503, 'Kunturkanki', 805, 8),
(80504, 'Langui', 805, 8),
(80505, 'Layo', 805, 8),
(80506, 'Pampamarca', 805, 8),
(80507, 'Quehue', 805, 8),
(80508, 'Tupac Amaru', 805, 8),
(80601, 'Sicuani', 806, 8),
(80602, 'Checacupe', 806, 8),
(80603, 'Combapata', 806, 8),
(80604, 'Marangani', 806, 8),
(80605, 'Pitumarca', 806, 8),
(80606, 'San Pablo', 806, 8),
(80607, 'San Pedro', 806, 8),
(80608, 'Tinta', 806, 8),
(80701, 'Santo Tomas', 807, 8),
(80702, 'Capacmarca', 807, 8),
(80703, 'Chamaca', 807, 8),
(80704, 'Colquemarca', 807, 8),
(80705, 'Livitaca', 807, 8),
(80706, 'Llusco', 807, 8),
(80707, 'Quiñota', 807, 8),
(80708, 'Velille', 807, 8),
(80801, 'Espinar', 808, 8),
(80802, 'Condoroma', 808, 8),
(80803, 'Coporaque', 808, 8),
(80804, 'Ocoruro', 808, 8),
(80805, 'Pallpata', 808, 8),
(80806, 'Pichigua', 808, 8),
(80807, 'Suyckutambo', 808, 8),
(80808, 'Alto Pichigua', 808, 8),
(80901, 'Santa Ana', 809, 8),
(80902, 'Echarate', 809, 8),
(80903, 'Huayopata', 809, 8),
(80904, 'Maranura', 809, 8),
(80905, 'Ocobamba', 809, 8),
(80906, 'Quellouno', 809, 8),
(80907, 'Kimbiri', 809, 8),
(80908, 'Santa Teresa', 809, 8),
(80909, 'Vilcabamba', 809, 8),
(80910, 'Pichari', 809, 8),
(80911, 'Inkawasi', 809, 8),
(80912, 'Villa Virgen', 809, 8),
(80913, 'Villa Kintiarina', 809, 8),
(80914, 'Megantoni', 809, 8),
(81001, 'Paruro', 810, 8),
(81002, 'Accha', 810, 8),
(81003, 'Ccapi', 810, 8),
(81004, 'Colcha', 810, 8),
(81005, 'Huanoquite', 810, 8),
(81006, 'Omachaç', 810, 8),
(81007, 'Paccaritambo', 810, 8),
(81008, 'Pillpinto', 810, 8),
(81009, 'Yaurisque', 810, 8),
(81101, 'Paucartambo', 811, 8),
(81102, 'Caicay', 811, 8),
(81103, 'Challabamba', 811, 8),
(81104, 'Colquepata', 811, 8),
(81105, 'Huancarani', 811, 8),
(81106, 'Kosñipata', 811, 8),
(81201, 'Urcos', 812, 8),
(81202, 'Andahuaylillas', 812, 8),
(81203, 'Camanti', 812, 8),
(81204, 'Ccarhuayo', 812, 8),
(81205, 'Ccatca', 812, 8),
(81206, 'Cusipata', 812, 8),
(81207, 'Huaro', 812, 8),
(81208, 'Lucre', 812, 8),
(81209, 'Marcapata', 812, 8),
(81210, 'Ocongate', 812, 8),
(81211, 'Oropesa', 812, 8),
(81212, 'Quiquijana', 812, 8),
(81301, 'Urubamba', 813, 8),
(81302, 'Chinchero', 813, 8),
(81303, 'Huayllabamba', 813, 8),
(81304, 'Machupicchu', 813, 8),
(81305, 'Maras', 813, 8),
(81306, 'Ollantaytambo', 813, 8),
(81307, 'Yucay', 813, 8),
(90101, 'Huancavelica', 901, 9),
(90102, 'Acobambilla', 901, 9),
(90103, 'Acoria', 901, 9),
(90104, 'Conayca', 901, 9),
(90105, 'Cuenca', 901, 9),
(90106, 'Huachocolpa', 901, 9),
(90107, 'Huayllahuara', 901, 9),
(90108, 'Izcuchaca', 901, 9),
(90109, 'Laria', 901, 9),
(90110, 'Manta', 901, 9),
(90111, 'Mariscal Cáceres', 901, 9),
(90112, 'Moya', 901, 9),
(90113, 'Nuevo Occoro', 901, 9),
(90114, 'Palca', 901, 9),
(90115, 'Pilchaca', 901, 9),
(90116, 'Vilca', 901, 9),
(90117, 'Yauli', 901, 9),
(90118, 'Ascensión', 901, 9),
(90119, 'Huando', 901, 9),
(90201, 'Acobamba', 902, 9),
(90202, 'Andabamba', 902, 9),
(90203, 'Anta', 902, 9),
(90204, 'Caja', 902, 9),
(90205, 'Marcas', 902, 9),
(90206, 'Paucara', 902, 9),
(90207, 'Pomacocha', 902, 9),
(90208, 'Rosario', 902, 9),
(90301, 'Lircay', 903, 9),
(90302, 'Anchonga', 903, 9),
(90303, 'Callanmarca', 903, 9),
(90304, 'Ccochaccasa', 903, 9),
(90305, 'Chincho', 903, 9),
(90306, 'Congalla', 903, 9),
(90307, 'Huanca-Huanca', 903, 9),
(90308, 'Huayllay Grande', 903, 9),
(90309, 'Julcamarca', 903, 9),
(90310, 'San Antonio de Antaparco', 903, 9),
(90311, 'Santo Tomas de Pata', 903, 9),
(90312, 'Secclla', 903, 9),
(90401, 'Castrovirreyna', 904, 9),
(90402, 'Arma', 904, 9),
(90403, 'Aurahua', 904, 9),
(90404, 'Capillas', 904, 9),
(90405, 'Chupamarca', 904, 9),
(90406, 'Cocas', 904, 9),
(90407, 'Huachos', 904, 9),
(90408, 'Huamatambo', 904, 9),
(90409, 'Mollepampa', 904, 9),
(90410, 'San Juan', 904, 9),
(90411, 'Santa Ana', 904, 9),
(90412, 'Tantara', 904, 9),
(90413, 'Ticrapo', 904, 9),
(90501, 'Churcampa', 905, 9),
(90502, 'Anco', 905, 9),
(90503, 'Chinchihuasi', 905, 9),
(90504, 'El Carmen', 905, 9),
(90505, 'La Merced', 905, 9),
(90506, 'Locroja', 905, 9),
(90507, 'Paucarbamba', 905, 9),
(90508, 'San Miguel de Mayocc', 905, 9),
(90509, 'San Pedro de Coris', 905, 9),
(90510, 'Pachamarca', 905, 9),
(90511, 'Cosme', 905, 9),
(90601, 'Huaytara', 906, 9),
(90602, 'Ayavi', 906, 9),
(90603, 'Córdova', 906, 9),
(90604, 'Huayacundo Arma', 906, 9),
(90605, 'Laramarca', 906, 9),
(90606, 'Ocoyo', 906, 9),
(90607, 'Pilpichaca', 906, 9),
(90608, 'Querco', 906, 9),
(90609, 'Quito-Arma', 906, 9),
(90610, 'San Antonio de Cusicancha', 906, 9),
(90611, 'San Francisco de Sangayaico', 906, 9),
(90612, 'San Isidro', 906, 9),
(90613, 'Santiago de Chocorvos', 906, 9),
(90614, 'Santiago de Quirahuara', 906, 9),
(90615, 'Santo Domingo de Capillas', 906, 9),
(90616, 'Tambo', 906, 9),
(90701, 'Pampas', 907, 9),
(90702, 'Acostambo', 907, 9),
(90703, 'Acraquia', 907, 9),
(90704, 'Ahuaycha', 907, 9),
(90705, 'Colcabamba', 907, 9),
(90706, 'Daniel Hernández', 907, 9),
(90707, 'Huachocolpa', 907, 9),
(90709, 'Huaribamba', 907, 9),
(90710, 'Ñahuimpuquio', 907, 9),
(90711, 'Pazos', 907, 9),
(90713, 'Quishuar', 907, 9),
(90714, 'Salcabamba', 907, 9),
(90715, 'Salcahuasi', 907, 9),
(90716, 'San Marcos de Rocchac', 907, 9),
(90717, 'Surcubamba', 907, 9),
(90718, 'Tintay Puncu', 907, 9),
(90719, 'Quichuas', 907, 9),
(90720, 'Andaymarca', 907, 9),
(90721, 'Roble', 907, 9),
(90722, 'Pichos', 907, 9),
(90723, 'Santiago de Tucuma', 907, 9),
(100101, 'Huanuco', 1001, 10),
(100102, 'Amarilis', 1001, 10),
(100103, 'Chinchao', 1001, 10),
(100104, 'Churubamba', 1001, 10),
(100105, 'Margos', 1001, 10),
(100106, 'Quisqui (Kichki)', 1001, 10),
(100107, 'San Francisco de Cayran', 1001, 10),
(100108, 'San Pedro de Chaulan', 1001, 10),
(100109, 'Santa María del Valle', 1001, 10),
(100110, 'Yarumayo', 1001, 10),
(100111, 'Pillco Marca', 1001, 10),
(100112, 'Yacus', 1001, 10),
(100113, 'San Pablo de Pillao', 1001, 10),
(100201, 'Ambo', 1002, 10),
(100202, 'Cayna', 1002, 10),
(100203, 'Colpas', 1002, 10),
(100204, 'Conchamarca', 1002, 10),
(100205, 'Huacar', 1002, 10),
(100206, 'San Francisco', 1002, 10),
(100207, 'San Rafael', 1002, 10),
(100208, 'Tomay Kichwa', 1002, 10),
(100301, 'La Unión', 1003, 10),
(100307, 'Chuquis', 1003, 10),
(100311, 'Marías', 1003, 10),
(100313, 'Pachas', 1003, 10),
(100316, 'Quivilla', 1003, 10),
(100317, 'Ripan', 1003, 10),
(100321, 'Shunqui', 1003, 10),
(100322, 'Sillapata', 1003, 10),
(100323, 'Yanas', 1003, 10),
(100401, 'Huacaybamba', 1004, 10),
(100402, 'Canchabamba', 1004, 10),
(100403, 'Cochabamba', 1004, 10),
(100404, 'Pinra', 1004, 10),
(100501, 'Llata', 1005, 10),
(100502, 'Arancay', 1005, 10),
(100503, 'Chavín de Pariarca', 1005, 10),
(100504, 'Jacas Grande', 1005, 10),
(100505, 'Jircan', 1005, 10),
(100506, 'Miraflores', 1005, 10),
(100507, 'Monzón', 1005, 10),
(100508, 'Punchao', 1005, 10),
(100509, 'Puños', 1005, 10),
(100510, 'Singa', 1005, 10),
(100511, 'Tantamayo', 1005, 10),
(100601, 'Rupa-Rupa', 1006, 10),
(100602, 'Daniel Alomía Robles', 1006, 10),
(100603, 'Hermílio Valdizan', 1006, 10),
(100604, 'José Crespo y Castillo', 1006, 10),
(100605, 'Luyando', 1006, 10),
(100606, 'Mariano Damaso Beraun', 1006, 10),
(100607, 'Pucayacu', 1006, 10),
(100608, 'Castillo Grande', 1006, 10),
(100609, 'Pueblo Nuevo', 1006, 10),
(100610, 'Santo Domingo de Anda', 1006, 10),
(100701, 'Huacrachuco', 1007, 10),
(100702, 'Cholon', 1007, 10),
(100703, 'San Buenaventura', 1007, 10),
(100704, 'La Morada', 1007, 10),
(100705, 'Santa Rosa de Alto Yanajanca', 1007, 10),
(100801, 'Panao', 1008, 10),
(100802, 'Chaglla', 1008, 10),
(100803, 'Molino', 1008, 10),
(100804, 'Umari', 1008, 10),
(100901, 'Puerto Inca', 1009, 10),
(100902, 'Codo del Pozuzo', 1009, 10),
(100903, 'Honoria', 1009, 10),
(100904, 'Tournavista', 1009, 10),
(100905, 'Yuyapichis', 1009, 10),
(101001, 'Jesús', 1010, 10),
(101002, 'Baños', 1010, 10),
(101003, 'Jivia', 1010, 10),
(101004, 'Queropalca', 1010, 10),
(101005, 'Rondos', 1010, 10),
(101006, 'San Francisco de Asís', 1010, 10),
(101007, 'San Miguel de Cauri', 1010, 10),
(101101, 'Chavinillo', 1011, 10),
(101102, 'Cahuac', 1011, 10),
(101103, 'Chacabamba', 1011, 10),
(101104, 'Aparicio Pomares', 1011, 10),
(101105, 'Jacas Chico', 1011, 10),
(101106, 'Obas', 1011, 10),
(101107, 'Pampamarca', 1011, 10),
(101108, 'Choras', 1011, 10),
(110101, 'Ica', 1101, 11),
(110102, 'La Tinguiña', 1101, 11),
(110103, 'Los Aquijes', 1101, 11),
(110104, 'Ocucaje', 1101, 11),
(110105, 'Pachacutec', 1101, 11),
(110106, 'Parcona', 1101, 11),
(110107, 'Pueblo Nuevo', 1101, 11),
(110108, 'Salas', 1101, 11),
(110109, 'San José de Los Molinos', 1101, 11),
(110110, 'San Juan Bautista', 1101, 11),
(110111, 'Santiago', 1101, 11),
(110112, 'Subtanjalla', 1101, 11),
(110113, 'Tate', 1101, 11),
(110114, 'Yauca del Rosario', 1101, 11),
(110201, 'Chincha Alta', 1102, 11),
(110202, 'Alto Laran', 1102, 11),
(110203, 'Chavin', 1102, 11),
(110204, 'Chincha Baja', 1102, 11),
(110205, 'El Carmen', 1102, 11),
(110206, 'Grocio Prado', 1102, 11),
(110207, 'Pueblo Nuevo', 1102, 11),
(110208, 'San Juan de Yanac', 1102, 11),
(110209, 'San Pedro de Huacarpana', 1102, 11),
(110210, 'Sunampe', 1102, 11),
(110211, 'Tambo de Mora', 1102, 11),
(110301, 'Nasca', 1103, 11),
(110302, 'Changuillo', 1103, 11),
(110303, 'El Ingenio', 1103, 11),
(110304, 'Marcona', 1103, 11),
(110305, 'Vista Alegre', 1103, 11),
(110401, 'Palpa', 1104, 11),
(110402, 'Llipata', 1104, 11),
(110403, 'Río Grande', 1104, 11),
(110404, 'Santa Cruz', 1104, 11),
(110405, 'Tibillo', 1104, 11),
(110501, 'Pisco', 1105, 11),
(110502, 'Huancano', 1105, 11),
(110503, 'Humay', 1105, 11),
(110504, 'Independencia', 1105, 11),
(110505, 'Paracas', 1105, 11),
(110506, 'San Andrés', 1105, 11),
(110507, 'San Clemente', 1105, 11),
(110508, 'Tupac Amaru Inca', 1105, 11),
(120101, 'Huancayo', 1201, 12),
(120104, 'Carhuacallanga', 1201, 12),
(120105, 'Chacapampa', 1201, 12),
(120106, 'Chicche', 1201, 12),
(120107, 'Chilca', 1201, 12),
(120108, 'Chongos Alto', 1201, 12),
(120111, 'Chupuro', 1201, 12),
(120112, 'Colca', 1201, 12),
(120113, 'Cullhuas', 1201, 12),
(120114, 'El Tambo', 1201, 12),
(120116, 'Huacrapuquio', 1201, 12),
(120117, 'Hualhuas', 1201, 12),
(120119, 'Huancan', 1201, 12),
(120120, 'Huasicancha', 1201, 12),
(120121, 'Huayucachi', 1201, 12),
(120122, 'Ingenio', 1201, 12),
(120124, 'Pariahuanca', 1201, 12),
(120125, 'Pilcomayo', 1201, 12),
(120126, 'Pucara', 1201, 12),
(120127, 'Quichuay', 1201, 12),
(120128, 'Quilcas', 1201, 12),
(120129, 'San Agustín', 1201, 12),
(120130, 'San Jerónimo de Tunan', 1201, 12),
(120132, 'Saño', 1201, 12),
(120133, 'Sapallanga', 1201, 12),
(120134, 'Sicaya', 1201, 12),
(120135, 'Santo Domingo de Acobamba', 1201, 12),
(120136, 'Viques', 1201, 12),
(120201, 'Concepción', 1202, 12),
(120202, 'Aco', 1202, 12),
(120203, 'Andamarca', 1202, 12),
(120204, 'Chambara', 1202, 12),
(120205, 'Cochas', 1202, 12),
(120206, 'Comas', 1202, 12),
(120207, 'Heroínas Toledo', 1202, 12),
(120208, 'Manzanares', 1202, 12),
(120209, 'Mariscal Castilla', 1202, 12),
(120210, 'Matahuasi', 1202, 12),
(120211, 'Mito', 1202, 12),
(120212, 'Nueve de Julio', 1202, 12),
(120213, 'Orcotuna', 1202, 12),
(120214, 'San José de Quero', 1202, 12),
(120215, 'Santa Rosa de Ocopa', 1202, 12),
(120301, 'Chanchamayo', 1203, 12),
(120302, 'Perene', 1203, 12),
(120303, 'Pichanaqui', 1203, 12),
(120304, 'San Luis de Shuaro', 1203, 12),
(120305, 'San Ramón', 1203, 12),
(120306, 'Vitoc', 1203, 12),
(120401, 'Jauja', 1204, 12),
(120402, 'Acolla', 1204, 12),
(120403, 'Apata', 1204, 12),
(120404, 'Ataura', 1204, 12),
(120405, 'Canchayllo', 1204, 12),
(120406, 'Curicaca', 1204, 12),
(120407, 'El Mantaro', 1204, 12),
(120408, 'Huamali', 1204, 12),
(120409, 'Huaripampa', 1204, 12),
(120410, 'Huertas', 1204, 12),
(120411, 'Janjaillo', 1204, 12),
(120412, 'Julcán', 1204, 12),
(120413, 'Leonor Ordóñez', 1204, 12),
(120414, 'Llocllapampa', 1204, 12),
(120415, 'Marco', 1204, 12),
(120416, 'Masma', 1204, 12),
(120417, 'Masma Chicche', 1204, 12),
(120418, 'Molinos', 1204, 12),
(120419, 'Monobamba', 1204, 12),
(120420, 'Muqui', 1204, 12),
(120421, 'Muquiyauyo', 1204, 12),
(120422, 'Paca', 1204, 12),
(120423, 'Paccha', 1204, 12),
(120424, 'Pancan', 1204, 12),
(120425, 'Parco', 1204, 12),
(120426, 'Pomacancha', 1204, 12),
(120427, 'Ricran', 1204, 12),
(120428, 'San Lorenzo', 1204, 12),
(120429, 'San Pedro de Chunan', 1204, 12),
(120430, 'Sausa', 1204, 12),
(120431, 'Sincos', 1204, 12),
(120432, 'Tunan Marca', 1204, 12),
(120433, 'Yauli', 1204, 12),
(120434, 'Yauyos', 1204, 12),
(120501, 'Junin', 1205, 12),
(120502, 'Carhuamayo', 1205, 12),
(120503, 'Ondores', 1205, 12),
(120504, 'Ulcumayo', 1205, 12),
(120601, 'Satipo', 1206, 12),
(120602, 'Coviriali', 1206, 12),
(120603, 'Llaylla', 1206, 12),
(120604, 'Mazamari', 1206, 12),
(120605, 'Pampa Hermosa', 1206, 12),
(120606, 'Pangoa', 1206, 12),
(120607, 'Río Negro', 1206, 12),
(120608, 'Río Tambo', 1206, 12),
(120609, 'Vizcatan del Ene', 1206, 12),
(120701, 'Tarma', 1207, 12),
(120702, 'Acobamba', 1207, 12),
(120703, 'Huaricolca', 1207, 12),
(120704, 'Huasahuasi', 1207, 12),
(120705, 'La Unión', 1207, 12),
(120706, 'Palca', 1207, 12),
(120707, 'Palcamayo', 1207, 12),
(120708, 'San Pedro de Cajas', 1207, 12),
(120709, 'Tapo', 1207, 12),
(120801, 'La Oroya', 1208, 12),
(120802, 'Chacapalpa', 1208, 12),
(120803, 'Huay-Huay', 1208, 12),
(120804, 'Marcapomacocha', 1208, 12),
(120805, 'Morococha', 1208, 12),
(120806, 'Paccha', 1208, 12),
(120807, 'Santa Bárbara de Carhuacayan', 1208, 12),
(120808, 'Santa Rosa de Sacco', 1208, 12),
(120809, 'Suitucancha', 1208, 12),
(120810, 'Yauli', 1208, 12),
(120901, 'Chupaca', 1209, 12),
(120902, 'Ahuac', 1209, 12),
(120903, 'Chongos Bajo', 1209, 12),
(120904, 'Huachac', 1209, 12),
(120905, 'Huamancaca Chico', 1209, 12),
(120906, 'San Juan de Iscos', 1209, 12),
(120907, 'San Juan de Jarpa', 1209, 12),
(120908, 'Tres de Diciembre', 1209, 12),
(120909, 'Yanacancha', 1209, 12),
(130101, 'Trujillo', 1301, 13),
(130102, 'El Porvenir', 1301, 13),
(130103, 'Florencia de Mora', 1301, 13),
(130104, 'Huanchaco', 1301, 13),
(130105, 'La Esperanza', 1301, 13),
(130106, 'Laredo', 1301, 13),
(130107, 'Moche', 1301, 13),
(130108, 'Poroto', 1301, 13),
(130109, 'Salaverry', 1301, 13),
(130110, 'Simbal', 1301, 13),
(130111, 'Victor Larco Herrera', 1301, 13),
(130201, 'Ascope', 1302, 13),
(130202, 'Chicama', 1302, 13),
(130203, 'Chocope', 1302, 13),
(130204, 'Magdalena de Cao', 1302, 13),
(130205, 'Paijan', 1302, 13),
(130206, 'Rázuri', 1302, 13),
(130207, 'Santiago de Cao', 1302, 13),
(130208, 'Casa Grande', 1302, 13),
(130301, 'Bolívar', 1303, 13),
(130302, 'Bambamarca', 1303, 13),
(130303, 'Condormarca', 1303, 13),
(130304, 'Longotea', 1303, 13),
(130305, 'Uchumarca', 1303, 13),
(130306, 'Ucuncha', 1303, 13),
(130401, 'Chepen', 1304, 13),
(130402, 'Pacanga', 1304, 13),
(130403, 'Pueblo Nuevo', 1304, 13),
(130501, 'Julcan', 1305, 13),
(130502, 'Calamarca', 1305, 13),
(130503, 'Carabamba', 1305, 13),
(130504, 'Huaso', 1305, 13),
(130601, 'Otuzco', 1306, 13),
(130602, 'Agallpampa', 1306, 13),
(130604, 'Charat', 1306, 13),
(130605, 'Huaranchal', 1306, 13),
(130606, 'La Cuesta', 1306, 13),
(130608, 'Mache', 1306, 13),
(130610, 'Paranday', 1306, 13),
(130611, 'Salpo', 1306, 13),
(130613, 'Sinsicap', 1306, 13),
(130614, 'Usquil', 1306, 13),
(130701, 'San Pedro de Lloc', 1307, 13),
(130702, 'Guadalupe', 1307, 13),
(130703, 'Jequetepeque', 1307, 13),
(130704, 'Pacasmayo', 1307, 13),
(130705, 'San José', 1307, 13),
(130801, 'Tayabamba', 1308, 13),
(130802, 'Buldibuyo', 1308, 13),
(130803, 'Chillia', 1308, 13),
(130804, 'Huancaspata', 1308, 13),
(130805, 'Huaylillas', 1308, 13),
(130806, 'Huayo', 1308, 13),
(130807, 'Ongon', 1308, 13),
(130808, 'Parcoy', 1308, 13),
(130809, 'Pataz', 1308, 13),
(130810, 'Pias', 1308, 13),
(130811, 'Santiago de Challas', 1308, 13),
(130812, 'Taurija', 1308, 13),
(130813, 'Urpay', 1308, 13),
(130901, 'Huamachuco', 1309, 13),
(130902, 'Chugay', 1309, 13),
(130903, 'Cochorco', 1309, 13),
(130904, 'Curgos', 1309, 13),
(130905, 'Marcabal', 1309, 13),
(130906, 'Sanagoran', 1309, 13),
(130907, 'Sarin', 1309, 13),
(130908, 'Sartimbamba', 1309, 13),
(131001, 'Santiago de Chuco', 1310, 13),
(131002, 'Angasmarca', 1310, 13),
(131003, 'Cachicadan', 1310, 13),
(131004, 'Mollebamba', 1310, 13),
(131005, 'Mollepata', 1310, 13),
(131006, 'Quiruvilca', 1310, 13),
(131007, 'Santa Cruz de Chuca', 1310, 13),
(131008, 'Sitabamba', 1310, 13),
(131101, 'Cascas', 1311, 13),
(131102, 'Lucma', 1311, 13),
(131103, 'Marmot', 1311, 13),
(131104, 'Sayapullo', 1311, 13),
(131201, 'Viru', 1312, 13),
(131202, 'Chao', 1312, 13),
(131203, 'Guadalupito', 1312, 13),
(140101, 'Chiclayo', 1401, 14),
(140102, 'Chongoyape', 1401, 14),
(140103, 'Eten', 1401, 14),
(140104, 'Eten Puerto', 1401, 14),
(140105, 'José Leonardo Ortiz', 1401, 14),
(140106, 'La Victoria', 1401, 14),
(140107, 'Lagunas', 1401, 14),
(140108, 'Monsefu', 1401, 14),
(140109, 'Nueva Arica', 1401, 14),
(140110, 'Oyotun', 1401, 14),
(140111, 'Picsi', 1401, 14),
(140112, 'Pimentel', 1401, 14),
(140113, 'Reque', 1401, 14),
(140114, 'Santa Rosa', 1401, 14),
(140115, 'Saña', 1401, 14),
(140116, 'Cayalti', 1401, 14),
(140117, 'Patapo', 1401, 14),
(140118, 'Pomalca', 1401, 14),
(140119, 'Pucala', 1401, 14),
(140120, 'Tuman', 1401, 14),
(140201, 'Ferreñafe', 1402, 14),
(140202, 'Cañaris', 1402, 14),
(140203, 'Incahuasi', 1402, 14),
(140204, 'Manuel Antonio Mesones Muro', 1402, 14),
(140205, 'Pitipo', 1402, 14),
(140206, 'Pueblo Nuevo', 1402, 14),
(140301, 'Lambayeque', 1403, 14),
(140302, 'Chochope', 1403, 14),
(140303, 'Illimo', 1403, 14),
(140304, 'Jayanca', 1403, 14),
(140305, 'Mochumi', 1403, 14),
(140306, 'Morrope', 1403, 14),
(140307, 'Motupe', 1403, 14),
(140308, 'Olmos', 1403, 14),
(140309, 'Pacora', 1403, 14),
(140310, 'Salas', 1403, 14),
(140311, 'San José', 1403, 14),
(140312, 'Tucume', 1403, 14),
(150101, 'Lima', 1501, 15),
(150102, 'Ancón', 1501, 15),
(150103, 'Ate', 1501, 15),
(150104, 'Barranco', 1501, 15),
(150105, 'Breña', 1501, 15),
(150106, 'Carabayllo', 1501, 15),
(150107, 'Chaclacayo', 1501, 15),
(150108, 'Chorrillos', 1501, 15),
(150109, 'Cieneguilla', 1501, 15),
(150110, 'Comas', 1501, 15),
(150111, 'El Agustino', 1501, 15),
(150112, 'Independencia', 1501, 15),
(150113, 'Jesús María', 1501, 15),
(150114, 'La Molina', 1501, 15),
(150115, 'La Victoria', 1501, 15),
(150116, 'Lince', 1501, 15),
(150117, 'Los Olivos', 1501, 15),
(150118, 'Lurigancho', 1501, 15),
(150119, 'Lurin', 1501, 15),
(150120, 'Magdalena del Mar', 1501, 15),
(150121, 'Pueblo Libre', 1501, 15),
(150122, 'Miraflores', 1501, 15),
(150123, 'Pachacamac', 1501, 15),
(150124, 'Pucusana', 1501, 15),
(150125, 'Puente Piedra', 1501, 15),
(150126, 'Punta Hermosa', 1501, 15),
(150127, 'Punta Negra', 1501, 15),
(150128, 'Rímac', 1501, 15),
(150129, 'San Bartolo', 1501, 15),
(150130, 'San Borja', 1501, 15),
(150131, 'San Isidro', 1501, 15),
(150132, 'San Juan de Lurigancho', 1501, 15),
(150133, 'San Juan de Miraflores', 1501, 15),
(150134, 'San Luis', 1501, 15),
(150135, 'San Martín de Porres', 1501, 15),
(150136, 'San Miguel', 1501, 15),
(150137, 'Santa Anita', 1501, 15),
(150138, 'Santa María del Mar', 1501, 15),
(150139, 'Santa Rosa', 1501, 15),
(150140, 'Santiago de Surco', 1501, 15),
(150141, 'Surquillo', 1501, 15),
(150142, 'Villa El Salvador', 1501, 15),
(150143, 'Villa María del Triunfo', 1501, 15),
(150201, 'Barranca', 1502, 15),
(150202, 'Paramonga', 1502, 15),
(150203, 'Pativilca', 1502, 15),
(150204, 'Supe', 1502, 15),
(150205, 'Supe Puerto', 1502, 15),
(150301, 'Cajatambo', 1503, 15),
(150302, 'Copa', 1503, 15),
(150303, 'Gorgor', 1503, 15),
(150304, 'Huancapon', 1503, 15),
(150305, 'Manas', 1503, 15),
(150401, 'Canta', 1504, 15),
(150402, 'Arahuay', 1504, 15),
(150403, 'Huamantanga', 1504, 15),
(150404, 'Huaros', 1504, 15),
(150405, 'Lachaqui', 1504, 15),
(150406, 'San Buenaventura', 1504, 15),
(150407, 'Santa Rosa de Quives', 1504, 15),
(150501, 'San Vicente de Cañete', 1505, 15),
(150502, 'Asia', 1505, 15),
(150503, 'Calango', 1505, 15),
(150504, 'Cerro Azul', 1505, 15),
(150505, 'Chilca', 1505, 15),
(150506, 'Coayllo', 1505, 15),
(150507, 'Imperial', 1505, 15),
(150508, 'Lunahuana', 1505, 15),
(150509, 'Mala', 1505, 15),
(150510, 'Nuevo Imperial', 1505, 15),
(150511, 'Pacaran', 1505, 15),
(150512, 'Quilmana', 1505, 15),
(150513, 'San Antonio', 1505, 15),
(150514, 'San Luis', 1505, 15),
(150515, 'Santa Cruz de Flores', 1505, 15),
(150516, 'Zúñiga', 1505, 15),
(150601, 'Huaral', 1506, 15),
(150602, 'Atavillos Alto', 1506, 15),
(150603, 'Atavillos Bajo', 1506, 15),
(150604, 'Aucallama', 1506, 15),
(150605, 'Chancay', 1506, 15),
(150606, 'Ihuari', 1506, 15),
(150607, 'Lampian', 1506, 15),
(150608, 'Pacaraos', 1506, 15),
(150609, 'San Miguel de Acos', 1506, 15),
(150610, 'Santa Cruz de Andamarca', 1506, 15),
(150611, 'Sumbilca', 1506, 15),
(150612, 'Veintisiete de Noviembre', 1506, 15),
(150701, 'Matucana', 1507, 15),
(150702, 'Antioquia', 1507, 15),
(150703, 'Callahuanca', 1507, 15),
(150704, 'Carampoma', 1507, 15),
(150705, 'Chicla', 1507, 15),
(150706, 'Cuenca', 1507, 15),
(150707, 'Huachupampa', 1507, 15),
(150708, 'Huanza', 1507, 15),
(150709, 'Huarochiri', 1507, 15),
(150710, 'Lahuaytambo', 1507, 15),
(150711, 'Langa', 1507, 15),
(150712, 'Laraos', 1507, 15),
(150713, 'Mariatana', 1507, 15),
(150714, 'Ricardo Palma', 1507, 15),
(150715, 'San Andrés de Tupicocha', 1507, 15),
(150716, 'San Antonio', 1507, 15),
(150717, 'San Bartolomé', 1507, 15),
(150718, 'San Damian', 1507, 15),
(150719, 'San Juan de Iris', 1507, 15),
(150720, 'San Juan de Tantaranche', 1507, 15),
(150721, 'San Lorenzo de Quinti', 1507, 15),
(150722, 'San Mateo', 1507, 15),
(150723, 'San Mateo de Otao', 1507, 15),
(150724, 'San Pedro de Casta', 1507, 15),
(150725, 'San Pedro de Huancayre', 1507, 15),
(150726, 'Sangallaya', 1507, 15),
(150727, 'Santa Cruz de Cocachacra', 1507, 15),
(150728, 'Santa Eulalia', 1507, 15),
(150729, 'Santiago de Anchucaya', 1507, 15),
(150730, 'Santiago de Tuna', 1507, 15),
(150731, 'Santo Domingo de Los Olleros', 1507, 15),
(150732, 'Surco', 1507, 15),
(150801, 'Huacho', 1508, 15),
(150802, 'Ambar', 1508, 15),
(150803, 'Caleta de Carquin', 1508, 15),
(150804, 'Checras', 1508, 15),
(150805, 'Hualmay', 1508, 15),
(150806, 'Huaura', 1508, 15),
(150807, 'Leoncio Prado', 1508, 15),
(150808, 'Paccho', 1508, 15),
(150809, 'Santa Leonor', 1508, 15),
(150810, 'Santa María', 1508, 15),
(150811, 'Sayan', 1508, 15),
(150812, 'Vegueta', 1508, 15),
(150901, 'Oyon', 1509, 15),
(150902, 'Andajes', 1509, 15),
(150903, 'Caujul', 1509, 15),
(150904, 'Cochamarca', 1509, 15),
(150905, 'Navan', 1509, 15),
(150906, 'Pachangara', 1509, 15),
(151001, 'Yauyos', 1510, 15),
(151002, 'Alis', 1510, 15),
(151003, 'Allauca', 1510, 15),
(151004, 'Ayaviri', 1510, 15),
(151005, 'Azángaro', 1510, 15),
(151006, 'Cacra', 1510, 15),
(151007, 'Carania', 1510, 15),
(151008, 'Catahuasi', 1510, 15),
(151009, 'Chocos', 1510, 15),
(151010, 'Cochas', 1510, 15),
(151011, 'Colonia', 1510, 15),
(151012, 'Hongos', 1510, 15),
(151013, 'Huampara', 1510, 15),
(151014, 'Huancaya', 1510, 15),
(151015, 'Huangascar', 1510, 15),
(151016, 'Huantan', 1510, 15),
(151017, 'Huañec', 1510, 15),
(151018, 'Laraos', 1510, 15),
(151019, 'Lincha', 1510, 15),
(151020, 'Madean', 1510, 15),
(151021, 'Miraflores', 1510, 15),
(151022, 'Omas', 1510, 15),
(151023, 'Putinza', 1510, 15),
(151024, 'Quinches', 1510, 15),
(151025, 'Quinocay', 1510, 15),
(151026, 'San Joaquín', 1510, 15),
(151027, 'San Pedro de Pilas', 1510, 15),
(151028, 'Tanta', 1510, 15),
(151029, 'Tauripampa', 1510, 15),
(151030, 'Tomas', 1510, 15),
(151031, 'Tupe', 1510, 15),
(151032, 'Viñac', 1510, 15),
(151033, 'Vitis', 1510, 15),
(160101, 'Iquitos', 1601, 16),
(160102, 'Alto Nanay', 1601, 16),
(160103, 'Fernando Lores', 1601, 16),
(160104, 'Indiana', 1601, 16),
(160105, 'Las Amazonas', 1601, 16),
(160106, 'Mazan', 1601, 16),
(160107, 'Napo', 1601, 16),
(160108, 'Punchana', 1601, 16),
(160110, 'Torres Causana', 1601, 16),
(160112, 'Belén', 1601, 16),
(160113, 'San Juan Bautista', 1601, 16),
(160201, 'Yurimaguas', 1602, 16),
(160202, 'Balsapuerto', 1602, 16),
(160205, 'Jeberos', 1602, 16),
(160206, 'Lagunas', 1602, 16),
(160210, 'Santa Cruz', 1602, 16),
(160211, 'Teniente Cesar López Rojas', 1602, 16),
(160301, 'Nauta', 1603, 16),
(160302, 'Parinari', 1603, 16),
(160303, 'Tigre', 1603, 16),
(160304, 'Trompeteros', 1603, 16),
(160305, 'Urarinas', 1603, 16),
(160401, 'Ramón Castilla', 1604, 16),
(160402, 'Pebas', 1604, 16),
(160403, 'Yavari', 1604, 16),
(160404, 'San Pablo', 1604, 16),
(160501, 'Requena', 1605, 16),
(160502, 'Alto Tapiche', 1605, 16),
(160503, 'Capelo', 1605, 16),
(160504, 'Emilio San Martín', 1605, 16),
(160505, 'Maquia', 1605, 16),
(160506, 'Puinahua', 1605, 16),
(160507, 'Saquena', 1605, 16),
(160508, 'Soplin', 1605, 16),
(160509, 'Tapiche', 1605, 16),
(160510, 'Jenaro Herrera', 1605, 16),
(160511, 'Yaquerana', 1605, 16),
(160601, 'Contamana', 1606, 16),
(160602, 'Inahuaya', 1606, 16),
(160603, 'Padre Márquez', 1606, 16),
(160604, 'Pampa Hermosa', 1606, 16),
(160605, 'Sarayacu', 1606, 16),
(160606, 'Vargas Guerra', 1606, 16),
(160701, 'Barranca', 1607, 16),
(160702, 'Cahuapanas', 1607, 16),
(160703, 'Manseriche', 1607, 16),
(160704, 'Morona', 1607, 16),
(160705, 'Pastaza', 1607, 16),
(160706, 'Andoas', 1607, 16),
(160801, 'Putumayo', 1608, 16),
(160802, 'Rosa Panduro', 1608, 16),
(160803, 'Teniente Manuel Clavero', 1608, 16),
(160804, 'Yaguas', 1608, 16),
(170101, 'Tambopata', 1701, 17),
(170102, 'Inambari', 1701, 17),
(170103, 'Las Piedras', 1701, 17),
(170104, 'Laberinto', 1701, 17),
(170201, 'Manu', 1702, 17),
(170202, 'Fitzcarrald', 1702, 17),
(170203, 'Madre de Dios', 1702, 17),
(170204, 'Huepetuhe', 1702, 17),
(170301, 'Iñapari', 1703, 17),
(170302, 'Iberia', 1703, 17),
(170303, 'Tahuamanu', 1703, 17),
(180101, 'Moquegua', 1801, 18),
(180102, 'Carumas', 1801, 18),
(180103, 'Cuchumbaya', 1801, 18),
(180104, 'Samegua', 1801, 18),
(180105, 'San Cristóbal', 1801, 18),
(180106, 'Torata', 1801, 18),
(180201, 'Omate', 1802, 18),
(180202, 'Chojata', 1802, 18),
(180203, 'Coalaque', 1802, 18),
(180204, 'Ichuña', 1802, 18),
(180205, 'La Capilla', 1802, 18),
(180206, 'Lloque', 1802, 18),
(180207, 'Matalaque', 1802, 18),
(180208, 'Puquina', 1802, 18),
(180209, 'Quinistaquillas', 1802, 18),
(180210, 'Ubinas', 1802, 18),
(180211, 'Yunga', 1802, 18),
(180301, 'Ilo', 1803, 18),
(180302, 'El Algarrobal', 1803, 18),
(180303, 'Pacocha', 1803, 18),
(190101, 'Chaupimarca', 1901, 19),
(190102, 'Huachon', 1901, 19),
(190103, 'Huariaca', 1901, 19),
(190104, 'Huayllay', 1901, 19),
(190105, 'Ninacaca', 1901, 19),
(190106, 'Pallanchacra', 1901, 19),
(190107, 'Paucartambo', 1901, 19),
(190108, 'San Francisco de Asís de Yarusyacan', 1901, 19),
(190109, 'Simon Bolívar', 1901, 19),
(190110, 'Ticlacayan', 1901, 19),
(190111, 'Tinyahuarco', 1901, 19),
(190112, 'Vicco', 1901, 19),
(190113, 'Yanacancha', 1901, 19),
(190201, 'Yanahuanca', 1902, 19),
(190202, 'Chacayan', 1902, 19),
(190203, 'Goyllarisquizga', 1902, 19),
(190204, 'Paucar', 1902, 19),
(190205, 'San Pedro de Pillao', 1902, 19),
(190206, 'Santa Ana de Tusi', 1902, 19),
(190207, 'Tapuc', 1902, 19),
(190208, 'Vilcabamba', 1902, 19),
(190301, 'Oxapampa', 1903, 19),
(190302, 'Chontabamba', 1903, 19),
(190303, 'Huancabamba', 1903, 19),
(190304, 'Palcazu', 1903, 19),
(190305, 'Pozuzo', 1903, 19),
(190306, 'Puerto Bermúdez', 1903, 19),
(190307, 'Villa Rica', 1903, 19),
(190308, 'Constitución', 1903, 19),
(200101, 'Piura', 2001, 20),
(200104, 'Castilla', 2001, 20),
(200105, 'Catacaos', 2001, 20),
(200107, 'Cura Mori', 2001, 20),
(200108, 'El Tallan', 2001, 20),
(200109, 'La Arena', 2001, 20),
(200110, 'La Unión', 2001, 20),
(200111, 'Las Lomas', 2001, 20),
(200114, 'Tambo Grande', 2001, 20),
(200115, 'Veintiseis de Octubre', 2001, 20),
(200201, 'Ayabaca', 2002, 20),
(200202, 'Frias', 2002, 20),
(200203, 'Jilili', 2002, 20),
(200204, 'Lagunas', 2002, 20),
(200205, 'Montero', 2002, 20),
(200206, 'Pacaipampa', 2002, 20),
(200207, 'Paimas', 2002, 20),
(200208, 'Sapillica', 2002, 20),
(200209, 'Sicchez', 2002, 20),
(200210, 'Suyo', 2002, 20),
(200301, 'Huancabamba', 2003, 20),
(200302, 'Canchaque', 2003, 20),
(200303, 'El Carmen de la Frontera', 2003, 20),
(200304, 'Huarmaca', 2003, 20),
(200305, 'Lalaquiz', 2003, 20),
(200306, 'San Miguel de El Faique', 2003, 20),
(200307, 'Sondor', 2003, 20),
(200308, 'Sondorillo', 2003, 20),
(200401, 'Chulucanas', 2004, 20),
(200402, 'Buenos Aires', 2004, 20),
(200403, 'Chalaco', 2004, 20),
(200404, 'La Matanza', 2004, 20),
(200405, 'Morropon', 2004, 20),
(200406, 'Salitral', 2004, 20),
(200407, 'San Juan de Bigote', 2004, 20),
(200408, 'Santa Catalina de Mossa', 2004, 20),
(200409, 'Santo Domingo', 2004, 20),
(200410, 'Yamango', 2004, 20),
(200501, 'Paita', 2005, 20),
(200502, 'Amotape', 2005, 20),
(200503, 'Arenal', 2005, 20),
(200504, 'Colan', 2005, 20),
(200505, 'La Huaca', 2005, 20),
(200506, 'Tamarindo', 2005, 20),
(200507, 'Vichayal', 2005, 20),
(200601, 'Sullana', 2006, 20),
(200602, 'Bellavista', 2006, 20),
(200603, 'Ignacio Escudero', 2006, 20),
(200604, 'Lancones', 2006, 20),
(200605, 'Marcavelica', 2006, 20),
(200606, 'Miguel Checa', 2006, 20),
(200607, 'Querecotillo', 2006, 20),
(200608, 'Salitral', 2006, 20),
(200701, 'Pariñas', 2007, 20),
(200702, 'El Alto', 2007, 20),
(200703, 'La Brea', 2007, 20),
(200704, 'Lobitos', 2007, 20),
(200705, 'Los Organos', 2007, 20),
(200706, 'Mancora', 2007, 20),
(200801, 'Sechura', 2008, 20),
(200802, 'Bellavista de la Unión', 2008, 20),
(200803, 'Bernal', 2008, 20),
(200804, 'Cristo Nos Valga', 2008, 20),
(200805, 'Vice', 2008, 20),
(200806, 'Rinconada Llicuar', 2008, 20),
(210101, 'Puno', 2101, 21),
(210102, 'Acora', 2101, 21),
(210103, 'Amantani', 2101, 21),
(210104, 'Atuncolla', 2101, 21),
(210105, 'Capachica', 2101, 21),
(210106, 'Chucuito', 2101, 21),
(210107, 'Coata', 2101, 21),
(210108, 'Huata', 2101, 21),
(210109, 'Mañazo', 2101, 21),
(210110, 'Paucarcolla', 2101, 21),
(210111, 'Pichacani', 2101, 21),
(210112, 'Plateria', 2101, 21),
(210113, 'San Antonio', 2101, 21),
(210114, 'Tiquillaca', 2101, 21),
(210115, 'Vilque', 2101, 21),
(210201, 'Azángaro', 2102, 21),
(210202, 'Achaya', 2102, 21),
(210203, 'Arapa', 2102, 21),
(210204, 'Asillo', 2102, 21),
(210205, 'Caminaca', 2102, 21),
(210206, 'Chupa', 2102, 21),
(210207, 'José Domingo Choquehuanca', 2102, 21),
(210208, 'Muñani', 2102, 21),
(210209, 'Potoni', 2102, 21),
(210210, 'Saman', 2102, 21),
(210211, 'San Anton', 2102, 21),
(210212, 'San José', 2102, 21),
(210213, 'San Juan de Salinas', 2102, 21),
(210214, 'Santiago de Pupuja', 2102, 21),
(210215, 'Tirapata', 2102, 21),
(210301, 'Macusani', 2103, 21),
(210302, 'Ajoyani', 2103, 21),
(210303, 'Ayapata', 2103, 21),
(210304, 'Coasa', 2103, 21),
(210305, 'Corani', 2103, 21),
(210306, 'Crucero', 2103, 21),
(210307, 'Ituata', 2103, 21),
(210308, 'Ollachea', 2103, 21),
(210309, 'San Gaban', 2103, 21),
(210310, 'Usicayos', 2103, 21),
(210401, 'Juli', 2104, 21),
(210402, 'Desaguadero', 2104, 21),
(210403, 'Huacullani', 2104, 21),
(210404, 'Kelluyo', 2104, 21),
(210405, 'Pisacoma', 2104, 21),
(210406, 'Pomata', 2104, 21),
(210407, 'Zepita', 2104, 21),
(210501, 'Ilave', 2105, 21),
(210502, 'Capazo', 2105, 21),
(210503, 'Pilcuyo', 2105, 21),
(210504, 'Santa Rosa', 2105, 21),
(210505, 'Conduriri', 2105, 21),
(210601, 'Huancane', 2106, 21);
INSERT INTO `tb_distritos` (`id_distrito`, `distrito`, `id_provincia`, `id_departamento`) VALUES
(210602, 'Cojata', 2106, 21),
(210603, 'Huatasani', 2106, 21),
(210604, 'Inchupalla', 2106, 21),
(210605, 'Pusi', 2106, 21),
(210606, 'Rosaspata', 2106, 21),
(210607, 'Taraco', 2106, 21),
(210608, 'Vilque Chico', 2106, 21),
(210701, 'Lampa', 2107, 21),
(210702, 'Cabanilla', 2107, 21),
(210703, 'Calapuja', 2107, 21),
(210704, 'Nicasio', 2107, 21),
(210705, 'Ocuviri', 2107, 21),
(210706, 'Palca', 2107, 21),
(210707, 'Paratia', 2107, 21),
(210708, 'Pucara', 2107, 21),
(210709, 'Santa Lucia', 2107, 21),
(210710, 'Vilavila', 2107, 21),
(210801, 'Ayaviri', 2108, 21),
(210802, 'Antauta', 2108, 21),
(210803, 'Cupi', 2108, 21),
(210804, 'Llalli', 2108, 21),
(210805, 'Macari', 2108, 21),
(210806, 'Nuñoa', 2108, 21),
(210807, 'Orurillo', 2108, 21),
(210808, 'Santa Rosa', 2108, 21),
(210809, 'Umachiri', 2108, 21),
(210901, 'Moho', 2109, 21),
(210902, 'Conima', 2109, 21),
(210903, 'Huayrapata', 2109, 21),
(210904, 'Tilali', 2109, 21),
(211001, 'Putina', 2110, 21),
(211002, 'Ananea', 2110, 21),
(211003, 'Pedro Vilca Apaza', 2110, 21),
(211004, 'Quilcapuncu', 2110, 21),
(211005, 'Sina', 2110, 21),
(211101, 'Juliaca', 2111, 21),
(211102, 'Cabana', 2111, 21),
(211103, 'Cabanillas', 2111, 21),
(211104, 'Caracoto', 2111, 21),
(211105, 'San Miguel', 2111, 21),
(211201, 'Sandia', 2112, 21),
(211202, 'Cuyocuyo', 2112, 21),
(211203, 'Limbani', 2112, 21),
(211204, 'Patambuco', 2112, 21),
(211205, 'Phara', 2112, 21),
(211206, 'Quiaca', 2112, 21),
(211207, 'San Juan del Oro', 2112, 21),
(211208, 'Yanahuaya', 2112, 21),
(211209, 'Alto Inambari', 2112, 21),
(211210, 'San Pedro de Putina Punco', 2112, 21),
(211301, 'Yunguyo', 2113, 21),
(211302, 'Anapia', 2113, 21),
(211303, 'Copani', 2113, 21),
(211304, 'Cuturapi', 2113, 21),
(211305, 'Ollaraya', 2113, 21),
(211306, 'Tinicachi', 2113, 21),
(211307, 'Unicachi', 2113, 21),
(220101, 'Moyobamba', 2201, 22),
(220102, 'Calzada', 2201, 22),
(220103, 'Habana', 2201, 22),
(220104, 'Jepelacio', 2201, 22),
(220105, 'Soritor', 2201, 22),
(220106, 'Yantalo', 2201, 22),
(220201, 'Bellavista', 2202, 22),
(220202, 'Alto Biavo', 2202, 22),
(220203, 'Bajo Biavo', 2202, 22),
(220204, 'Huallaga', 2202, 22),
(220205, 'San Pablo', 2202, 22),
(220206, 'San Rafael', 2202, 22),
(220301, 'San José de Sisa', 2203, 22),
(220302, 'Agua Blanca', 2203, 22),
(220303, 'San Martín', 2203, 22),
(220304, 'Santa Rosa', 2203, 22),
(220305, 'Shatoja', 2203, 22),
(220401, 'Saposoa', 2204, 22),
(220402, 'Alto Saposoa', 2204, 22),
(220403, 'El Eslabón', 2204, 22),
(220404, 'Piscoyacu', 2204, 22),
(220405, 'Sacanche', 2204, 22),
(220406, 'Tingo de Saposoa', 2204, 22),
(220501, 'Lamas', 2205, 22),
(220502, 'Alonso de Alvarado', 2205, 22),
(220503, 'Barranquita', 2205, 22),
(220504, 'Caynarachi', 2205, 22),
(220505, 'Cuñumbuqui', 2205, 22),
(220506, 'Pinto Recodo', 2205, 22),
(220507, 'Rumisapa', 2205, 22),
(220508, 'San Roque de Cumbaza', 2205, 22),
(220509, 'Shanao', 2205, 22),
(220510, 'Tabalosos', 2205, 22),
(220511, 'Zapatero', 2205, 22),
(220601, 'Juanjuí', 2206, 22),
(220602, 'Campanilla', 2206, 22),
(220603, 'Huicungo', 2206, 22),
(220604, 'Pachiza', 2206, 22),
(220605, 'Pajarillo', 2206, 22),
(220701, 'Picota', 2207, 22),
(220702, 'Buenos Aires', 2207, 22),
(220703, 'Caspisapa', 2207, 22),
(220704, 'Pilluana', 2207, 22),
(220705, 'Pucacaca', 2207, 22),
(220706, 'San Cristóbal', 2207, 22),
(220707, 'San Hilarión', 2207, 22),
(220708, 'Shamboyacu', 2207, 22),
(220709, 'Tingo de Ponasa', 2207, 22),
(220710, 'Tres Unidos', 2207, 22),
(220801, 'Rioja', 2208, 22),
(220802, 'Awajun', 2208, 22),
(220803, 'Elías Soplin Vargas', 2208, 22),
(220804, 'Nueva Cajamarca', 2208, 22),
(220805, 'Pardo Miguel', 2208, 22),
(220806, 'Posic', 2208, 22),
(220807, 'San Fernando', 2208, 22),
(220808, 'Yorongos', 2208, 22),
(220809, 'Yuracyacu', 2208, 22),
(220901, 'Tarapoto', 2209, 22),
(220902, 'Alberto Leveau', 2209, 22),
(220903, 'Cacatachi', 2209, 22),
(220904, 'Chazuta', 2209, 22),
(220905, 'Chipurana', 2209, 22),
(220906, 'El Porvenir', 2209, 22),
(220907, 'Huimbayoc', 2209, 22),
(220908, 'Juan Guerra', 2209, 22),
(220909, 'La Banda de Shilcayo', 2209, 22),
(220910, 'Morales', 2209, 22),
(220911, 'Papaplaya', 2209, 22),
(220912, 'San Antonio', 2209, 22),
(220913, 'Sauce', 2209, 22),
(220914, 'Shapaja', 2209, 22),
(221001, 'Tocache', 2210, 22),
(221002, 'Nuevo Progreso', 2210, 22),
(221003, 'Polvora', 2210, 22),
(221004, 'Shunte', 2210, 22),
(221005, 'Uchiza', 2210, 22),
(230101, 'Tacna', 2301, 23),
(230102, 'Alto de la Alianza', 2301, 23),
(230103, 'Calana', 2301, 23),
(230104, 'Ciudad Nueva', 2301, 23),
(230105, 'Inclan', 2301, 23),
(230106, 'Pachia', 2301, 23),
(230107, 'Palca', 2301, 23),
(230108, 'Pocollay', 2301, 23),
(230109, 'Sama', 2301, 23),
(230110, 'Coronel Gregorio Albarracín Lanchipa', 2301, 23),
(230111, 'La Yarada los Palos', 2301, 23),
(230201, 'Candarave', 2302, 23),
(230202, 'Cairani', 2302, 23),
(230203, 'Camilaca', 2302, 23),
(230204, 'Curibaya', 2302, 23),
(230205, 'Huanuara', 2302, 23),
(230206, 'Quilahuani', 2302, 23),
(230301, 'Locumba', 2303, 23),
(230302, 'Ilabaya', 2303, 23),
(230303, 'Ite', 2303, 23),
(230401, 'Tarata', 2304, 23),
(230402, 'Héroes Albarracín', 2304, 23),
(230403, 'Estique', 2304, 23),
(230404, 'Estique-Pampa', 2304, 23),
(230405, 'Sitajara', 2304, 23),
(230406, 'Susapaya', 2304, 23),
(230407, 'Tarucachi', 2304, 23),
(230408, 'Ticaco', 2304, 23),
(240101, 'Tumbes', 2401, 24),
(240102, 'Corrales', 2401, 24),
(240103, 'La Cruz', 2401, 24),
(240104, 'Pampas de Hospital', 2401, 24),
(240105, 'San Jacinto', 2401, 24),
(240106, 'San Juan de la Virgen', 2401, 24),
(240201, 'Zorritos', 2402, 24),
(240202, 'Casitas', 2402, 24),
(240203, 'Canoas de Punta Sal', 2402, 24),
(240301, 'Zarumilla', 2403, 24),
(240302, 'Aguas Verdes', 2403, 24),
(240303, 'Matapalo', 2403, 24),
(240304, 'Papayal', 2403, 24),
(250101, 'Calleria', 2501, 25),
(250102, 'Campoverde', 2501, 25),
(250103, 'Iparia', 2501, 25),
(250104, 'Masisea', 2501, 25),
(250105, 'Yarinacocha', 2501, 25),
(250106, 'Nueva Requena', 2501, 25),
(250107, 'Manantay', 2501, 25),
(250201, 'Raymondi', 2502, 25),
(250202, 'Sepahua', 2502, 25),
(250203, 'Tahuania', 2502, 25),
(250204, 'Yurua', 2502, 25),
(250301, 'Padre Abad', 2503, 25),
(250302, 'Irazola', 2503, 25),
(250303, 'Curimana', 2503, 25),
(250304, 'Neshuya', 2503, 25),
(250305, 'Alexander Von Humboldt', 2503, 25),
(250401, 'Purus', 2504, 25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_empresas`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_empresas`;
CREATE TABLE IF NOT EXISTS `tb_empresas` (
  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,
  `ruc` varchar(11) NOT NULL,
  `representante_legal` varchar(70) NOT NULL,
  `razon_social` varchar(100) NOT NULL,
  `nombre_comercial` varchar(100) NOT NULL,
  `telefono` char(9) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `empre_uk_ruc` (`ruc`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_empresas`:
--

--
-- Volcado de datos para la tabla `tb_empresas`
--

INSERT INTO `tb_empresas` (`id_empresa`, `ruc`, `representante_legal`, `razon_social`, `nombre_comercial`, `telefono`, `email`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, '20123456789', 'Luis García', 'Servicios Informáticos S.A.', 'InfoTech', '987654321', 'info@infotech.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, '20234567890', 'Ana Martínez', 'Soluciones Empresariales S.R.L.', 'SolEmp', '976543210', 'contacto@solemp.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, '20345678901', 'Carlos Lopez', 'Desarrollo y Consultoría', 'DevConsult', '965432109', 'consultoria@devconsult.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, '20456789012', 'María Pérez', 'Tecnología Avanzada', 'TechAdvance', '954321098', 'info@techadvance.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, '20567890123', 'José Fernández', 'Consultores Asociados', 'ConAsociados', '943210987', 'contacto@conasociados.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(6, '20678901234', 'Claudia Torres', 'Innovación Digital S.A.C.', 'InnovaDigital', '932109876', 'info@innovadigital.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(7, '20789012345', 'Andrés Ruiz', 'Gestión de Proyectos S.R.L.', 'ProyGest', '921098765', 'contacto@proygest.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(8, '20890123456', 'Laura Sánchez', 'Soluciones Logísticas', 'LogiSol', '910987654', 'info@logisol.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(9, '20901234567', 'Ricardo Jiménez', 'Tecnologías de la Información', 'TechInfo', '909876543', 'contacto@techinfo.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(10, '21012345678', 'Patricia Silva', 'Estrategias Comerciales S.A.', 'EstrategiaCom', '898765432', 'info@estrategiacom.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(11, '21123456789', 'Javier Morales', 'Desarrollo Web S.R.L.', 'WebDev', '887654321', 'contacto@webdev.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(12, '21234567890', 'Verónica Castro', 'Consultoría Financiera', 'FinanConsult', '876543210', 'info@financonsult.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(13, '21345678901', 'Fernando Delgado', 'Servicios de Marketing', 'MarketServ', '865432109', 'contacto@marketserv.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(14, '21456789012', 'Mónica Herrera', 'Desarrollo de Software', 'SoftDev', '854321098', 'info@softdev.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(15, '21567890123', 'Santiago Castillo', 'Consultores de Negocios', 'ConNegocios', '843210987', 'contacto@connegocios.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(16, '21678901234', 'Elena Mendoza', 'Soluciones Ambientales', 'AmbiSol', '832109876', 'info@ambisol.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(17, '21789012345', 'Pablo Romero', 'Sistemas Integrales S.R.L.', 'SistInteg', '821098765', 'contacto@sistinteg.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(18, '21890123456', 'Gabriela López', 'Innovación Empresarial', 'InnovaEmp', '810987654', 'info@innovaemp.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(19, '21901234567', 'Hugo Pérez', 'Desarrollo Sostenible', 'DesaSostenible', '809876543', 'contacto@desasostenible.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(20, '22012345678', 'Raquel Salas', 'Tecnologías Avanzadas', 'TechAvan', '798765432', 'info@techavan.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(21, '22123456789', 'Diego García', 'Soluciones Creativas S.A.C.', 'CreaSol', '787654321', 'contacto@creasol.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(22, '22234567890', 'Susana Ríos', 'Asesoría en TI', 'AsesoriaTI', '776543210', 'info@asesoriati.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(23, '22345678901', 'Jorge Castro', 'Innovaciones Técnicas', 'InnovaTec', '765432109', 'contacto@innovatec.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(24, '22456789012', 'Carla Ramos', 'Desarrollo de Aplicaciones', 'AppDev', '754321098', 'info@appdev.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(25, '22567890123', 'Nicolás Mendoza', 'Gestión de Recursos S.R.L.', 'RecursosGest', '743210987', 'contacto@recursosgest.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(26, '22678901234', 'Marta Ortega', 'Consultoría en Procesos', 'ProcCon', '732109876', 'info@proccon.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(27, '22789012345', 'Mauricio López', 'Soluciones Educativas', 'EduSol', '721098765', 'contacto@edusol.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(28, '22890123456', 'Adriana Flores', 'Marketing Digital', 'DigitalMarket', '710987654', 'info@digitalmarket.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(29, '22901234567', 'Felipe Morales', 'Consultoría Jurídica', 'JuridConsult', '709876543', 'contacto@juridconsult.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(30, '23012345678', 'Olga Fernández', 'Estrategias de Ventas', 'EstrategiaVentas', '698765432', 'info@estrategiaventas.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(31, '23123456789', 'Ignacio Torres', 'Servicios de Diseño', 'DiseñoServ', '687654321', 'contacto@disenoserv.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(32, '23234567890', 'Natalia Guzmán', 'Innovación en Salud', 'SaludInnova', '676543210', 'info@saludinnova.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(33, '23345678901', 'Ricardo Salcedo', 'Soluciones de Recursos Humanos', 'RecursosHum', '665432109', 'contacto@recursoshum.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(34, '23456789012', 'Silvia Morales', 'Consultoría en Tecnologías', 'TecConsult', '654321098', 'info@tecconsult.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(35, '23567890123', 'Raúl Gutiérrez', 'Servicios de Ingeniería', 'EngiServ', '643210987', 'contacto@engiserv.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(36, '23678901234', 'Camila Sánchez', 'Innovación Empresarial S.R.L.', 'EmpInnova', '632109876', 'info@empinnova.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(37, '23789012345', 'Julio Ramírez', 'Gestión Ambiental S.A.C.', 'AmbientalGest', '621098765', 'contacto@ambientalgest.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(38, '23890123456', 'Sofía Herrera', 'Tecnologías Sustentables', 'SustenTech', '610987654', 'info@sustentech.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(39, '23901234567', 'David Torres', 'Asesoría Financiera S.A.', 'FinanAses', '609876543', 'contacto@finanases.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(40, '24012345678', 'María Vargas', 'Consultores Legales', 'LegalConsult', '598765432', 'info@legalconsult.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(41, '24123456789', 'Esteban Gálvez', 'Desarrollo de Proyectos', 'ProyectDev', '587654321', 'contacto@proyectdev.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(42, '24234567890', 'Daniela Ortiz', 'Servicios Médicos S.A.C.', 'MedServ', '576543210', 'info@medserv.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(43, '24345678901', 'Gustavo Peña', 'Consultores en Ventas', 'VentasConsult', '565432109', 'contacto@ventasconsult.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_kardex`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_kardex`;
CREATE TABLE IF NOT EXISTS `tb_kardex` (
  `id_kardex` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_tipooperacion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `cantidad` int(11) NOT NULL,
  `saldo_total` int(11) NOT NULL,
  `valor_unico_historico` decimal(7,2) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_kardex`),
  KEY `fk_id_producto` (`id_producto`),
  KEY `fk_id_almacen` (`id_almacen`),
  KEY `fk_id_tipooperacion` (`id_tipooperacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_kardex`:
--   `id_almacen`
--       `tb_almacen` -> `id_almacen`
--   `id_producto`
--       `tb_productos` -> `id_producto`
--   `id_tipooperacion`
--       `tb_tipooperacion` -> `id_tipooperacion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_lineas`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_lineas`;
CREATE TABLE IF NOT EXISTS `tb_lineas` (
  `id_linea` int(11) NOT NULL AUTO_INCREMENT,
  `id_mufa` int(11) DEFAULT NULL,
  `id_caja` int(11) DEFAULT NULL,
  `coordenadas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`coordenadas`)),
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_linea`),
  KEY `lineas_fk_id_mufa` (`id_mufa`),
  KEY `lineas_fk_id_caja` (`id_caja`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_lineas`:
--   `id_caja`
--       `tb_cajas` -> `id_caja`
--   `id_mufa`
--       `tb_mufas` -> `id_mufa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_marca`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_marca`;
CREATE TABLE IF NOT EXISTS `tb_marca` (
  `id_marca` int(11) NOT NULL AUTO_INCREMENT,
  `marca` varchar(30) NOT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_marca`),
  UNIQUE KEY `uk_marca` (`marca`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_marca`:
--

--
-- Volcado de datos para la tabla `tb_marca`
--

INSERT INTO `tb_marca` (`id_marca`, `marca`, `inactive_at`, `iduser_inactive`, `create_at`, `update_at`, `iduser_create`, `iduser_update`) VALUES
(1, 'TP Link', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(2, 'Logitech', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(3, 'Satra', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(4, 'Epson', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(5, 'Kingston', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(6, 'Micronics', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(7, 'Canon', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(8, 'Omega', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(9, 'Genius', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(10, 'Generico', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL),
(11, 'Sin Marca', NULL, NULL, '2024-12-12 09:54:08', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_mufas`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_mufas`;
CREATE TABLE IF NOT EXISTS `tb_mufas` (
  `id_mufa` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `coordenadas` varchar(50) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_mufa`),
  UNIQUE KEY `mufa_uk_mufa` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_mufas`:
--

--
-- Volcado de datos para la tabla `tb_mufas`
--

INSERT INTO `tb_mufas` (`id_mufa`, `nombre`, `descripcion`, `coordenadas`, `direccion`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'Mufa 1', 'Cerca del estadio', '-13.41287751332741, -76.15387988372802', 'Av 123', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 'Mufa 2', 'Plaza san Isidro', '-13.429027241634715, -76.14961981773376', 'Av 123456', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 'Mufa 3', 'Cerca de la Plaza', '-13.404169746696624, -76.12736834665132', 'Av 123', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 'Mufa 4', 'San Nicolas', '-13.42830253845429, -76.12306531088652', 'Av 123456', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_paquetes`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_paquetes`;
CREATE TABLE IF NOT EXISTS `tb_paquetes` (
  `id_paquete` int(11) NOT NULL AUTO_INCREMENT,
  `id_servicio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`id_servicio`)),
  `paquete` varchar(250) NOT NULL,
  `precio` decimal(7,2) NOT NULL,
  `velocidad` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`velocidad`)),
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_paquete`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_paquetes`:
--

--
-- Volcado de datos para la tabla `tb_paquetes`
--

INSERT INTO `tb_paquetes` (`id_paquete`, `id_servicio`, `paquete`, `precio`, `velocidad`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, '{\"id_servicio\": [3]}', 'Plan Internet Corporativo 300MB - 270', 65.00, '{\"bajada\":{\"maxima\":300,\"minima_garantizada\":270},\"subida\":{\"maxima\":300,\"minima_garantizada\":270}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, '{\"id_servicio\": [3]}', 'Plan Internet 55MB - 50', 60.00, '{\"bajada\":{\"maxima\":55,\"minima_garantizada\":50},\"subida\":{\"maxima\":55,\"minima_garantizada\":50}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, '{\"id_servicio\": [3]}', 'Plan Internet 110MB - 70', 70.00, '{\"bajada\":{\"maxima\":110,\"minima_garantizada\":70},\"subida\":{\"maxima\":110,\"minima_garantizada\":70}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, '{\"id_servicio\": [3]}', 'Plan Internet 155MB - 90', 68.00, '{\"bajada\":{\"maxima\":155,\"minima_garantizada\":90},\"subida\":{\"maxima\":155,\"minima_garantizada\":90}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, '{\"id_servicio\": [3]}', 'Plan Internet 165MB - 95', 67.00, '{\"bajada\":{\"maxima\":165,\"minima_garantizada\":95},\"subida\":{\"maxima\":165,\"minima_garantizada\":95}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(6, '{\"id_servicio\": [3]}', 'Plan Internet MIGRA 210MB - 110', 69.00, '{\"bajada\":{\"maxima\":210,\"minima_garantizada\":110},\"subida\":{\"maxima\":210,\"minima_garantizada\":110}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(7, '{\"id_servicio\": [3]}', 'Plan Internet 280MB - 150', 66.00, '{\"bajada\":{\"maxima\":280,\"minima_garantizada\":150},\"subida\":{\"maxima\":280,\"minima_garantizada\":150}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(8, '{\"id_servicio\": [1,3]}', 'Plan Internet Duo Bronce 110MB - 80', 100.00, '{\"bajada\":{\"maxima\":110,\"minima_garantizada\":80},\"subida\":{\"maxima\":110,\"minima_garantizada\":80}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(9, '{\"id_servicio\": [1,3]}', 'Plan Internet Duo Plata', 105.00, '{\"bajada\":{\"maxima\":100,\"minima_garantizada\":80},\"subida\":{\"maxima\":100,\"minima_garantizada\":80}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(10, '{\"id_servicio\": [1,3]}', 'Plan Internet Duo Oro 210MB - 120', 110.00, '{\"bajada\":{\"maxima\":210,\"minima_garantizada\":120},\"subida\":{\"maxima\":210,\"minima_garantizada\":120}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(11, '{\"id_servicio\": [1,3]}', 'Plan Internet Duo 180MB - 100', 95.00, '{\"bajada\":{\"maxima\":180,\"minima_garantizada\":100},\"subida\":{\"maxima\":180,\"minima_garantizada\":100}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(12, '{\"id_servicio\": [1,3]}', 'Plan Internet Duo 410MB - 140', 120.00, '{\"bajada\":{\"maxima\":410,\"minima_garantizada\":140},\"subida\":{\"maxima\":410,\"minima_garantizada\":140}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(13, '{\"id_servicio\": [1,3]}', 'Plan Internet Full Duo 2 - 190MB - 99', 115.00, '{\"bajada\":{\"maxima\":190,\"minima_garantizada\":99},\"subida\":{\"maxima\":190,\"minima_garantizada\":99}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(14, '{\"id_servicio\": [1,3]}', 'Plan Internet Full Duo 3 - 260MB - 120', 130.00, '{\"bajada\":{\"maxima\":260,\"minima_garantizada\":120},\"subida\":{\"maxima\":260,\"minima_garantizada\":120}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(15, '{\"id_servicio\": [1,3]}', 'Plan Internet Full Duo 4 - 320MB - 135', 125.00, '{\"bajada\":{\"maxima\":320,\"minima_garantizada\":135},\"subida\":{\"maxima\":320,\"minima_garantizada\":135}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(16, '{\"id_servicio\": [1,3]}', 'Plan Internet Full Duo 5 - 410MB - 159', 140.00, '{\"bajada\":{\"maxima\":410,\"minima_garantizada\":159},\"subida\":{\"maxima\":410,\"minima_garantizada\":159}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(17, '{\"id_servicio\": [2]}', 'Plan TamboMora Residencial 40MB - 50', 120.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(18, '{\"id_servicio\": [2]}', 'Techo Videna Residencial 20MB - 50', 110.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(19, '{\"id_servicio\": [2]}', 'Plan Salvador Residencial 20MB - 50', 115.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(20, '{\"id_servicio\": [2]}', 'Plan Sunampe Residencial 15MB', 105.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(21, '{\"id_servicio\": [2]}', 'Plan Chacarita Residencial 40MB - 50', 130.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(22, '{\"id_servicio\": [2]}', 'Plan Chacarita Residencial 40MB - 80', 140.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(23, '{\"id_servicio\": [2]}', 'Plan Satelite Residencial 40MB - 70', 125.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(24, '{\"id_servicio\": [2]}', 'Plan TamboMora Residencial 40MB', 120.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(25, '{\"id_servicio\": [2]}', 'Plan Sunampe Corporativo 50MB - 210', 150.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(26, '{\"id_servicio\": [2]}', 'Plan Sunampe Corporativo 50MB - 280', 160.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(27, '{\"id_servicio\": [2]}', 'Plan Chincha Corporativo 50MB - 280', 170.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(28, '{\"id_servicio\": [2]}', 'Plan Grocio Residencial 10MB', 90.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(29, '{\"id_servicio\": [2]}', 'Plan Grocio Residencial 12MB', 95.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(30, '{\"id_servicio\": [2]}', 'Plan Grocio Residencial 20MB', 100.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(31, '{\"id_servicio\": [2]}', 'Plan TechoPropio Residencial 10MB', 85.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(32, '{\"id_servicio\": [2]}', 'Plan TechoPropio Residencial 20MB', 105.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(33, '{\"id_servicio\": [2]}', 'Plan Satelite Residencial 10MB', 80.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(34, '{\"id_servicio\": [2]}', 'Plan Satelite Residencial 12MB', 90.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(35, '{\"id_servicio\": [2]}', 'Plan Satelite Residencial 20MB', 110.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(36, '{\"id_servicio\": [2]}', 'Plan CruzBlanca Residencial 10MB', 75.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(37, '{\"id_servicio\": [2]}', 'Plan CruzBlanca Residencial 12MB', 85.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(38, '{\"id_servicio\": [2]}', 'Plan CruzBlanca Residencial 20MB', 95.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(39, '{\"id_servicio\": [2]}', 'Plan Salvador Residencial 10MB', 70.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(40, '{\"id_servicio\": [2]}', 'Plan Salvador Residencial 20MB', 100.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(41, '{\"id_servicio\": [2]}', 'Plan Salvador Residencial 10MB', 75.00, '{\"bajada\":20,\"subida\":20}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(42, '{\"id_servicio\": [1]}', 'ABRO1 SERVICIO CATV 2 TV-BASICO + 1 APL - DUO 80 ANTERIOR', 45.00, NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(43, '{\"id_servicio\": [1]}', 'AGOS080 NUEVO SERVICIO SOLO CATV3 TV - BASICO + 1 APL', 50.00, NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(44, '{\"id_servicio\": [1]}', 'JUN056 PLAN DUO + 01 TV = CATV 4 TV - BASICO + 1 APL', 48.00, NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(45, '{\"id_servicio\": [1]}', 'MAY053 NUEVO SERVICIO CATV 3 TV - BASICO + 1 APL', 49.00, NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(46, '{\"id_servicio\": [1]}', 'MAY054 NUEVO SERVICIO SOLO CATV 3 TV - BASICO + 1 APL', 47.00, NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(47, '{\"id_servicio\": [1]}', 'MAY055 NUEVO SERVICIO DUO CATV 4 TV - BASICO + 1 APL', 46.00, NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_personas`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_personas`;
CREATE TABLE IF NOT EXISTS `tb_personas` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_doc` char(3) NOT NULL,
  `nro_doc` varchar(15) NOT NULL,
  `apellidos` varchar(30) NOT NULL,
  `nombres` varchar(30) NOT NULL,
  `telefono` char(9) NOT NULL,
  `nacionalidad` varchar(40) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `perso_uk_nro_doc` (`nro_doc`,`tipo_doc`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_personas`:
--

--
-- Volcado de datos para la tabla `tb_personas`
--

INSERT INTO `tb_personas` (`id_persona`, `tipo_doc`, `nro_doc`, `apellidos`, `nombres`, `telefono`, `nacionalidad`, `email`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'DNI', '12345678', 'PEREZ GARCIA', 'JUAN', '987654321', 'Peruano', 'juan.perezgarcia@example.com', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 'DNI', '73884605', 'MATTA RAMOS', 'JESUS EDUARDO', '904217929', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 'DNI', '73310144', 'MESIAS TASAYCO', 'BRAYAN', '933293445', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 'DNI', '72845296', 'DE LA CRUZ PEÑALOZA', 'ELOY ALEXANDER', '920520306', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 'DNI', '71592495', 'TALLA SARAVIA', 'ALEXIS ALEXANDER', '907277520', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(6, 'DNI', '73753884', 'NAPA ABREGU', 'ANGEL DANIEL', '966557234', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(7, 'DNI', '21781164', 'YATACO GARCIA', 'MOISES', '944420613', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(8, 'DNI', '73602072', 'MESIAS ALMEYDA', 'MARYORI ELIZABETH', '985797500', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(9, 'DNI', '47934103', 'ANCHANTE RICALES', 'ROBERTO CARLOS', '965973468', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(10, 'DNI', '40956921', 'TASAYCO LEVANO', 'MIGUEL ANGEL', '962278152', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(11, 'DNI', '72517098', 'PASTOR ROJAS', 'PATRICIA', '924594304', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(12, 'DNI', '41114586', 'GOITIA PEREZ', 'YHONSONN', '946090592', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(13, 'DNI', '21866147', 'MENDIGUETE LOYOLA', 'MARIA JULIA', '962402706', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(14, 'DNI', '22303840', 'SARAVIA VELA', 'ROCIO MAYDEE', '981168789', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(15, 'DNI', '21861430', 'TASAYCO TORRES', 'MARITZA LILIANA', '904712454', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(16, 'DNI', '21867629', 'LEVANO TORRES', 'MARITZA', '955446960', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(17, 'DNI', '45715311', 'CARBAJAL SANCHEZ', 'ROSA', '952567956', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(18, 'DNI', '70365628', 'GARCIA TASAYCO', 'RONALD STALIN', '950639761', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(19, 'DNI', '43628022', 'SANTIAGO SARAVIA', 'VICTOR HUGO', '948829288', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(20, 'DNI', '21825949', 'YATACO GARCIA', 'MARIA SANTOS', '965696054', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(21, 'DNI', '21866254', 'GARCIA MARTINEZ', 'CECILIA PATRICIA', '947929771', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(22, 'DNI', '47898813', 'GENTILLE GUTARRA', 'CRISTAL', '934444810', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(23, 'DNI', '44176871', 'BARILLAS PEVE', 'DANIEL', '962308941', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(24, 'DNI', '71616251', 'CRISOSTOMO LEVANO', 'PEDRO MANUEL', '955127262', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(25, 'DNI', '41135592', 'HUANQUI TRILLO DE GARAY', 'NAYADE SAIDA', '960169072', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(26, 'DNI', '72082086', 'LOBO MENESES', 'LUIS', '930197086', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(27, 'DNI', '45252181', 'DIAZ REBATTA', 'EDDER RUBEN', '994323996', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(28, 'DNI', '75234060', 'NAPA CASTILLO', 'DELIA LIBERTAD', '928589038', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(29, 'DNI', '40905473', 'MARTINEZ VILLAR', 'EPIFANIA CLEMENCIA', '971615965', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(30, 'DNI', '15439628', 'CAMPOS BARRIOS', 'JUANA MILAGROS', '956517578', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(31, 'DNI', '41256049', 'GONZALES ATUNCAR', 'MARIA', '924052883', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(32, 'DNI', '42869491', 'DE LA CRUZ TORRES', 'LUIS', '937233140', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(33, 'DNI', '71616237', 'SARAVIA MEDINA', 'LUIS', '977537270', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(34, 'DNI', '41893651', 'MENESES CRISOSTOMO', 'MARILU', '916728107', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(35, 'DNI', '47841679', 'ATUNCAR MARQUEZ', 'HAROLD', '906467373', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(36, 'DNI', '43210229', 'PEVE GUERRA', 'OSWALDO EFRAIN', '914717616', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(37, 'DNI', '72872536', 'VALENCIA SARAVIA', 'ELIZABETH', '950162295', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(38, 'DNI', '43510116', 'TORRES TASAYCO', 'VICTOR HUGO', '922397715', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(39, 'DNI', '21862542', 'YATACO GARCIA DE GARCIA', 'NELLY', '912700722', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(40, 'DNI', '41730654', 'CASTILLA MATEO', 'JUAN CARLOS', '941327977', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(41, 'DNI', '41637529', 'QUISPE SANCHEZ', 'LINO', '945160889', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(42, 'DNI', '41455781', 'MENESES TASAYCO', 'BLANCA MARIBEL', '955962818', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(43, 'DNI', '21876020', 'ALVAREZ CUEVA', 'MARTIN WILLIAM', '964347449', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(44, 'DNI', '44364538', 'VASQUEZ CHUQUISPUMA', 'RUTH ESTHER', '972573295', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(45, 'DNI', '60454449', 'PEREZ TERRONES', 'GRETY', '912143217', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(46, 'DNI', '09688142', 'GAMEZ CHACON', 'ERCELIZ', '956138789', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(47, 'DNI', '41075262', 'QUISPE PACHAS', 'RONNY RAUL', '994980680', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(48, 'DNI', '44972815', 'NAPA CASTILLA', 'OSCAR JAVIER', '960162907', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(49, 'DNI', '45778769', 'BRICEÑO DEL RIO', 'FREDY JHON', '952128903', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(50, 'DNI', '23019806', 'JUAREZ TORRES', 'LUCY YAMALI', '967591253', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(51, 'DNI', '44136139', 'PAZ CASAVERDE', 'VANESSA', '902226993', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(52, 'DNI', '71789780', 'CUADROS SARAVIA', 'DIANA', '927744936', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(53, 'DNI', '48222293', 'APOLAYA ROMERO', 'NELZI', '922693855', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(54, 'DNI', '48040901', 'MATIAS CRISOSTOMO', 'ANGEL ALBERTO', '933241678', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(55, 'DNI', '73819477', 'ANTON OSTIA', 'BRYAN LUIS', '955029880', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(56, 'DNI', '41748230', 'ANGULO LOYOLA', 'JHAN CARLOS', '998308628', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(57, 'DNI', '21794090', 'MAGALLANES ORTIZ', 'VICTOR LUIS', '912074015', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(58, 'DNI', '21881955', 'TASAYCO MENDOZA', 'LILIANA CATALINA', '912180079', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(59, 'DNI', '75352738', 'MEREDIA MUÑOZ', 'GIANELA CORAIMA', '997259195', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(60, 'DNI', '21857534', 'VALVERDE ORTIZ', 'SANTA ANGELICA', '960999975', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(61, 'DNI', '45442612', 'ORTIZ HERNANDEZ', 'MARIANELLA', '946916479', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(62, 'DNI', '21794453', 'MELO GUERRA', 'ANSELMO', '977867820', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(63, 'DNI', '44771538', 'ALMEYDA NAPA', 'GLORIA', '942370984', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(64, 'DNI', '74421607', 'DIAZ DE LA CRUZ', 'ARIANA', '933155682', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(65, 'DNI', '21873544', 'CASTILLA RILQUELME', 'ALEXANDER', '952683121', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(66, 'DNI', '45682504', 'TASAYCO ARIAS', 'GREGORIO JHONATHAN', '947700239', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(67, 'DNI', '76307312', 'SARAVIA LEVANO', 'MARYORI', '943735454', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(68, 'DNI', '80487137', 'DE LA CRUZ ABREGU', 'MIGUEL ANGEL', '917163741', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(69, 'DNI', '21882395', 'HUARANCA DURAND', 'VCITOR', '932904801', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(70, 'DNI', '44521340', 'BOGA SIGUAS', 'GIANCARLOS', '995734338', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(71, 'DNI', '42777407', 'DIAZ TASAYCO', 'CARLOS YVAN', '908601428', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(72, 'DNI', '74035877', 'DAVILA DIAZ', 'HILDA XIOMARA', '904354801', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(73, 'DNI', '40907806', 'QUISPE PAUCAR', 'MIRIAN', '904275168', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(74, 'DNI', '62892038', 'ALVAREZ CHIQUISPUMA', 'JHAN MARTINEZ', '924702432', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(75, 'DNI', '42876347', 'ROJAS GUERRA', 'EDGAR', '960329089', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(76, 'DNI', '73472203', 'MAGALLANES MURILLO', 'MIOSIRY LILIANA', '902492034', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(77, 'DNI', '21887823', 'MAGALLANES GARCIA', 'JULIO CESAR', '953433332', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(78, 'DNI', '44645111', 'DE LA CRUZ TORRES', 'MIRIAM', '977393013', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(79, 'DNI', '71440787', 'ATUNCAR ALMEYDA', 'DIEGO ALFONSO', '949792659', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(80, 'DNI', '42296834', 'HERNANDEZ NAPA', 'JOSE LUIS', '902151026', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(81, 'DNI', '21850270', 'DE LA CRUZ QUISPE', 'VICTORIA ISABEL', '997067532', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(82, 'DNI', '21846116', 'CRISOSTOMO CUELLAR', 'ARNALDO', '955017366', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(83, 'DNI', '75957606', 'CASTAÑEDA SULCA', 'ROSA LINDA', '900648734', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(84, 'DNI', '77923612', 'SARAVIA BONIFACIO', 'JENNIFER DENIS', '907539262', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(85, 'DNI', '41405135', 'ROJAS PACHAS', 'YOVANA VANESA', '904410306', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(86, 'DNI', '46132681', 'TORRES FAJARDO', 'ERICK JOHANY', '902301220', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(87, 'DNI', '41834203', 'ROJAS CONTRERAS', 'CECILIA', '943326467', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(88, 'DNI', '45852739', 'DE LA CRUZ JACOBO', 'JULIO CESAR', '902572234', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(89, 'DNI', '75178691', 'ATUNCAR ALMEYDA', 'ANGEL JESUS', '977655697', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(90, 'DNI', '42116747', 'ALVAREZ TOMASTO', 'JUAN MARTIN', '904384806', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(91, 'DNI', '40679555', 'NAPA MARTINEZ', 'MARIA', '902755736', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(92, 'DNI', '09736546', 'BENITES BOCANEGRA', 'FRANCISCO HERMAN', '943656810', 'Peruano', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(93, 'DNI', '40813108', 'SARAVIA TORRES', 'TERESA YSABEL', '951679716', 'Peruana', NULL, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_productos`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_productos`;
CREATE TABLE IF NOT EXISTS `tb_productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `id_marca` int(11) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `id_unidad` int(11) NOT NULL,
  `modelo` varchar(70) NOT NULL,
  `precio_actual` decimal(7,2) NOT NULL,
  `codigo_barra` varchar(120) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `producto_uk_modelo` (`id_marca`,`id_tipo`,`modelo`),
  UNIQUE KEY `producto_uk_codigo` (`codigo_barra`),
  KEY `fk_tipo_producto` (`id_tipo`),
  KEY `fk_unidad_medida` (`id_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_productos`:
--   `id_marca`
--       `tb_marca` -> `id_marca`
--   `id_tipo`
--       `tb_tipoproducto` -> `id_tipo`
--   `id_unidad`
--       `tb_unidadmedida` -> `id_unidad`
--

--
-- Volcado de datos para la tabla `tb_productos`
--

INSERT INTO `tb_productos` (`id_producto`, `id_marca`, `id_tipo`, `id_unidad`, `modelo`, `precio_actual`, `codigo_barra`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 1, 1, 1, 'Router', 150.00, '1234567890123', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 2, 2, 1, 'Teclado USB', 25.00, '1234567890124', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 3, 1, 2, 'Cable UTP Cat. 6', 1.50, '1234567890125', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 4, 3, 1, 'Tinta Magenta', 10.00, '1234567890126', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 5, 4, 1, 'Memoria RAM', 80.00, '1234567890127', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(6, 6, 2, 1, 'Cámara Web MIC W360 + micrófono', 45.00, '1234567890128', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(7, 7, 3, 1, 'Tinta Yellow', 10.00, '1234567890129', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(8, 8, 2, 1, 'Supresor de Pisco', 15.00, '1234567890130', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(9, 9, 2, 1, 'Mouse', 8.00, '1234567890131', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_provincias`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_provincias`;
CREATE TABLE IF NOT EXISTS `tb_provincias` (
  `id_provincia` int(11) NOT NULL,
  `provincia` varchar(45) NOT NULL,
  `id_departamento` int(11) NOT NULL,
  PRIMARY KEY (`id_provincia`),
  KEY `provi_fk_id_departamento` (`id_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_provincias`:
--   `id_departamento`
--       `tb_departamentos` -> `id_departamento`
--

--
-- Volcado de datos para la tabla `tb_provincias`
--

INSERT INTO `tb_provincias` (`id_provincia`, `provincia`, `id_departamento`) VALUES
(101, 'Chachapoyas', 1),
(102, 'Bagua', 1),
(103, 'Bongará', 1),
(104, 'Condorcanqui', 1),
(105, 'Luya', 1),
(106, 'Rodríguez de Mendoza', 1),
(107, 'Utcubamba', 1),
(201, 'Huaraz', 2),
(202, 'Aija', 2),
(203, 'Antonio Raymondi', 2),
(204, 'Asunción', 2),
(205, 'Bolognesi', 2),
(206, 'Carhuaz', 2),
(207, 'Carlos Fermín Fitzcarrald', 2),
(208, 'Casma', 2),
(209, 'Corongo', 2),
(210, 'Huari', 2),
(211, 'Huarmey', 2),
(212, 'Huaylas', 2),
(213, 'Mariscal Luzuriaga', 2),
(214, 'Ocros', 2),
(215, 'Pallasca', 2),
(216, 'Pomabamba', 2),
(217, 'Recuay', 2),
(218, 'Santa', 2),
(219, 'Sihuas', 2),
(220, 'Yungay', 2),
(301, 'Abancay', 3),
(302, 'Andahuaylas', 3),
(303, 'Antabamba', 3),
(304, 'Aymaraes', 3),
(305, 'Cotabambas', 3),
(306, 'Chincheros', 3),
(307, 'Grau', 3),
(401, 'Arequipa', 4),
(402, 'Camaná', 4),
(403, 'Caravelí', 4),
(404, 'Castilla', 4),
(405, 'Caylloma', 4),
(406, 'Condesuyos', 4),
(407, 'Islay', 4),
(408, 'La Uniòn', 4),
(501, 'Huamanga', 5),
(502, 'Cangallo', 5),
(503, 'Huanca Sancos', 5),
(504, 'Huanta', 5),
(505, 'La Mar', 5),
(506, 'Lucanas', 5),
(507, 'Parinacochas', 5),
(508, 'Pàucar del Sara Sara', 5),
(509, 'Sucre', 5),
(510, 'Víctor Fajardo', 5),
(511, 'Vilcas Huamán', 5),
(601, 'Cajamarca', 6),
(602, 'Cajabamba', 6),
(603, 'Celendín', 6),
(604, 'Chota', 6),
(605, 'Contumazá', 6),
(606, 'Cutervo', 6),
(607, 'Hualgayoc', 6),
(608, 'Jaén', 6),
(609, 'San Ignacio', 6),
(610, 'San Marcos', 6),
(611, 'San Miguel', 6),
(612, 'San Pablo', 6),
(613, 'Santa Cruz', 6),
(701, 'Prov. Const. del Callao', 7),
(801, 'Cusco', 8),
(802, 'Acomayo', 8),
(803, 'Anta', 8),
(804, 'Calca', 8),
(805, 'Canas', 8),
(806, 'Canchis', 8),
(807, 'Chumbivilcas', 8),
(808, 'Espinar', 8),
(809, 'La Convención', 8),
(810, 'Paruro', 8),
(811, 'Paucartambo', 8),
(812, 'Quispicanchi', 8),
(813, 'Urubamba', 8),
(901, 'Huancavelica', 9),
(902, 'Acobamba', 9),
(903, 'Angaraes', 9),
(904, 'Castrovirreyna', 9),
(905, 'Churcampa', 9),
(906, 'Huaytará', 9),
(907, 'Tayacaja', 9),
(1001, 'Huánuco', 10),
(1002, 'Ambo', 10),
(1003, 'Dos de Mayo', 10),
(1004, 'Huacaybamba', 10),
(1005, 'Huamalíes', 10),
(1006, 'Leoncio Prado', 10),
(1007, 'Marañón', 10),
(1008, 'Pachitea', 10),
(1009, 'Puerto Inca', 10),
(1010, 'Lauricocha ', 10),
(1011, 'Yarowilca ', 10),
(1101, 'Ica ', 11),
(1102, 'Chincha ', 11),
(1103, 'Nasca ', 11),
(1104, 'Palpa ', 11),
(1105, 'Pisco ', 11),
(1201, 'Huancayo ', 12),
(1202, 'Concepción ', 12),
(1203, 'Chanchamayo ', 12),
(1204, 'Jauja ', 12),
(1205, 'Junín ', 12),
(1206, 'Satipo ', 12),
(1207, 'Tarma ', 12),
(1208, 'Yauli ', 12),
(1209, 'Chupaca ', 12),
(1301, 'Trujillo ', 13),
(1302, 'Ascope ', 13),
(1303, 'Bolívar ', 13),
(1304, 'Chepén ', 13),
(1305, 'Julcán ', 13),
(1306, 'Otuzco ', 13),
(1307, 'Pacasmayo ', 13),
(1308, 'Pataz ', 13),
(1309, 'Sánchez Carrión ', 13),
(1310, 'Santiago de Chuco ', 13),
(1311, 'Gran Chimú ', 13),
(1312, 'Virú ', 13),
(1401, 'Chiclayo ', 14),
(1402, 'Ferreñafe ', 14),
(1403, 'Lambayeque ', 14),
(1501, 'Lima ', 15),
(1502, 'Barranca ', 15),
(1503, 'Cajatambo ', 15),
(1504, 'Canta ', 15),
(1505, 'Cañete ', 15),
(1506, 'Huaral ', 15),
(1507, 'Huarochirí ', 15),
(1508, 'Huaura ', 15),
(1509, 'Oyón ', 15),
(1510, 'Yauyos ', 15),
(1601, 'Maynas ', 16),
(1602, 'Alto Amazonas ', 16),
(1603, 'Loreto ', 16),
(1604, 'Mariscal Ramón Castilla ', 16),
(1605, 'Requena ', 16),
(1606, 'Ucayali ', 16),
(1607, 'Datem del Marañón ', 16),
(1608, 'Putumayo', 16),
(1701, 'Tambopata ', 17),
(1702, 'Manu ', 17),
(1703, 'Tahuamanu ', 17),
(1801, 'Mariscal Nieto ', 18),
(1802, 'General Sánchez Cerro ', 18),
(1803, 'Ilo ', 18),
(1901, 'Pasco ', 19),
(1902, 'Daniel Alcides Carrión ', 19),
(1903, 'Oxapampa ', 19),
(2001, 'Piura ', 20),
(2002, 'Ayabaca ', 20),
(2003, 'Huancabamba ', 20),
(2004, 'Morropón ', 20),
(2005, 'Paita ', 20),
(2006, 'Sullana ', 20),
(2007, 'Talara ', 20),
(2008, 'Sechura ', 20),
(2101, 'Puno ', 21),
(2102, 'Azángaro ', 21),
(2103, 'Carabaya ', 21),
(2104, 'Chucuito ', 21),
(2105, 'El Collao ', 21),
(2106, 'Huancané ', 21),
(2107, 'Lampa ', 21),
(2108, 'Melgar ', 21),
(2109, 'Moho ', 21),
(2110, 'San Antonio de Putina ', 21),
(2111, 'San Román ', 21),
(2112, 'Sandia ', 21),
(2113, 'Yunguyo ', 21),
(2201, 'Moyobamba ', 22),
(2202, 'Bellavista ', 22),
(2203, 'El Dorado ', 22),
(2204, 'Huallaga ', 22),
(2205, 'Lamas ', 22),
(2206, 'Mariscal Cáceres ', 22),
(2207, 'Picota ', 22),
(2208, 'Rioja ', 22),
(2209, 'San Martín ', 22),
(2210, 'Tocache ', 22),
(2301, 'Tacna ', 23),
(2302, 'Candarave ', 23),
(2303, 'Jorge Basadre ', 23),
(2304, 'Tarata ', 23),
(2401, 'Tumbes ', 24),
(2402, 'Contralmirante Villar ', 24),
(2403, 'Zarumilla ', 24),
(2501, 'Coronel Portillo ', 25),
(2502, 'Atalaya ', 25),
(2503, 'Padre Abad ', 25),
(2504, 'Purús', 25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_responsables`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_responsables`;
CREATE TABLE IF NOT EXISTS `tb_responsables` (
  `id_responsable` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_responsable`),
  KEY `respo_fk_id_usuario` (`id_usuario`),
  KEY `respo_fk_id_rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_responsables`:
--   `id_rol`
--       `tb_roles` -> `id_rol`
--   `id_usuario`
--       `tb_usuarios` -> `id_usuario`
--

--
-- Volcado de datos para la tabla `tb_responsables`
--

INSERT INTO `tb_responsables` (`id_responsable`, `id_usuario`, `id_rol`, `fecha_inicio`, `update_at`, `fecha_fin`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 1, 1, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 2, 2, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 3, 3, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 4, 4, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 5, 5, '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_roles`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_roles`;
CREATE TABLE IF NOT EXISTS `tb_roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `rol` varchar(30) NOT NULL,
  `permisos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`permisos`)),
  `create_at` datetime DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `roles_uk_rol` (`rol`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_roles`:
--

--
-- Volcado de datos para la tabla `tb_roles`
--

INSERT INTO `tb_roles` (`id_rol`, `rol`, `permisos`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'Administrador', '{\"actividad\":\"Mapa\", \"administracion\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true}, \"soporte\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"contratos\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"inventariado\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"personas\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"roles\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"usuarios\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"reportes\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"paquetes\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true}}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 'Tecnico Oficina', '{\"actividad\":\"Soporte\", \"administracion\":{},\"soporte\":false,\"contratos\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"inventariado\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"personas\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"roles\":false,\"usuarios\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"paquetes\":false}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 'Oficina', '{\"actividad\":\"Contratos\", \"administracion\":{},\"soporte\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"contratos\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"inventariado\":false,\"personas\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"roles\":false,\"usuarios\":false,\"paquetes\":false}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 'Tecnico Campo', '{\"actividad\":\"Fichas\", \"administracion\":{},\"soporte\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"contratos\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"inventariado\":false,\"personas\":false,\"roles\":false,\"usuarios\":false,\"paquetes\":false}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 'Almacen - Tecnico', '{\"actividad\":\"Kardex\", \"administracion\":{},\"soporte\":false,\"contratos\":false,\"inventariado\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"personas\":false,\"roles\":false,\"usuarios\":false,\"paquetes\":false}', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_sectores`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_sectores`;
CREATE TABLE IF NOT EXISTS `tb_sectores` (
  `id_sector` int(11) NOT NULL AUTO_INCREMENT,
  `id_distrito` int(11) NOT NULL,
  `sector` varchar(60) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `coordenadas` varchar(50) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_sector`),
  UNIQUE KEY `secto_uk_sector` (`sector`),
  KEY `secto_fk_id_distrito` (`id_distrito`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_sectores`:
--   `id_distrito`
--       `tb_distritos` -> `id_distrito`
--

--
-- Volcado de datos para la tabla `tb_sectores`
--

INSERT INTO `tb_sectores` (`id_sector`, `id_distrito`, `sector`, `descripcion`, `coordenadas`, `direccion`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 110210, 'COLEGIO', 'Descripción del sector', '-13.42544269617297, -76.15808116947606', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 110210, 'SANTA ROSA', 'Descripción del sector', '-13.4236801469295, -76.15636428337336', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 110210, 'SAN IGNACIO', 'Descripción del sector', '-13.42084308470873, -76.15172619142008', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 110210, 'VILLA JULIA', 'Descripción del sector', '-13.41865293087071, -76.14804412727285', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 110210, 'PARAISO', 'Descripción del sector', '-13.42056044489115, -76.1658703095588', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(6, 110210, 'SAN PILPA', 'Descripción del sector', '-13.41763371580861, -76.1636141502515', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(7, 110210, 'CRUZ BLANCA', 'Descripción del sector', '-13.4292202892175, -76.12004531160598', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(8, 110210, 'MINA ORO', 'Descripción del sector', '-13.42704443028948, -76.13963358072775', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(9, 110210, 'SANTA FE', 'Descripción del sector', '-13.42720878737056, -76.17156138732457', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(10, 110210, 'HUACA GRANDE', 'Descripción del sector', '-13.4288474271221, -76.15446500188271', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(11, 110206, 'MEJILLONEROS', 'Descripción del sector', '-13.40788239712879, -76.15983137626122', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(12, 110206, 'PORVENIR', 'Descripción del sector', '-13.40498211432371, -76.15983221931539', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(13, 110206, 'PROGRESO', 'Descripción del sector', '-13.4344505095856, -76.13017637387277', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(14, 110107, 'SALVADOR 1', 'Descripción del sector', '-13.39336425906626, -76.1488242018644', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(15, 110107, 'TECHO MAX', 'Descripción del sector', '-13.40220429678562, -76.13732471155042', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(16, 110107, 'SATELITE 1', 'Descripción del sector', '-13.38765487990007, -76.11958212522634', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(17, 110107, 'SATELITE 2', 'Descripción del sector', '-13.38534611704822, -76.12102025177141', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(18, 110107, 'ROSEDAL', 'Descripción del sector', '-13.399712698456614, -76.12151072760331', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(19, 110201, 'CRUZBLANCA', 'Descripción del sector', '-13.4292202892175, -76.12004531160598', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(20, 110201, 'ORURO', 'Descripción del sector', '-13.42999374526452, -76.11673399746118', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(21, 110201, 'VR DEL CARMEN', 'Descripción del sector', '-13.42802163353247, -76.12165813154482', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(22, 110201, 'CAMPO COND', 'Descripción del sector', '-13.4316581916571, -76.11842467768329', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(23, 110201, 'COND. ALTA', 'Descripción del sector', '-13.43669652995902, -76.11306320932194', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(24, 110201, 'COND. BAJA', 'Descripción del sector', '-13.43473693459032, -76.11455679499767', 'Dirección del sector', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_servicios`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_servicios`;
CREATE TABLE IF NOT EXISTS `tb_servicios` (
  `id_servicio` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_servicio` char(4) NOT NULL,
  `servicio` varchar(200) NOT NULL,
  `create_at` datetime DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_servicio`),
  UNIQUE KEY `servi_uk_servicio` (`servicio`,`tipo_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_servicios`:
--

--
-- Volcado de datos para la tabla `tb_servicios`
--

INSERT INTO `tb_servicios` (`id_servicio`, `tipo_servicio`, `servicio`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'CABL', 'Cable', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 'WISP', 'Wireless Internet Service Provider', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 'FIBR', 'Fibra Óptica', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_soporte`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_soporte`;
CREATE TABLE IF NOT EXISTS `tb_soporte` (
  `id_soporte` int(11) NOT NULL AUTO_INCREMENT,
  `id_contrato` int(11) NOT NULL,
  `id_tipo_soporte` int(11) DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `fecha_hora_solicitud` datetime NOT NULL,
  `fecha_hora_asistencia` datetime DEFAULT NULL,
  `descripcion_problema` text NOT NULL,
  `descripcion_solucion` text DEFAULT NULL,
  `estaCompleto` tinyint(1) NOT NULL DEFAULT 0,
  `prioridad` varchar(50) DEFAULT 'Incidencia',
  `soporte` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`soporte`)),
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_soporte`),
  KEY `sopor_fk_id_contrato` (`id_contrato`),
  KEY `sopor_fk_id_tipo_soporte` (`id_tipo_soporte`),
  KEY `sopor_fk_id_tecnico` (`id_tecnico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_soporte`:
--   `id_contrato`
--       `tb_contratos` -> `id_contrato`
--   `id_tecnico`
--       `tb_responsables` -> `id_responsable`
--   `id_tipo_soporte`
--       `tb_tipo_soporte` -> `id_tipo_soporte`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_tipooperacion`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_tipooperacion`;
CREATE TABLE IF NOT EXISTS `tb_tipooperacion` (
  `id_tipooperacion` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(55) NOT NULL,
  `movimiento` char(1) NOT NULL,
  PRIMARY KEY (`id_tipooperacion`),
  UNIQUE KEY `tipoop` (`descripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_tipooperacion`:
--

--
-- Volcado de datos para la tabla `tb_tipooperacion`
--

INSERT INTO `tb_tipooperacion` (`id_tipooperacion`, `descripcion`, `movimiento`) VALUES
(1, 'Adquisición de activos', 'E'),
(2, 'Compra de materiales', 'E'),
(3, 'Recepción de suministros', 'E'),
(4, 'Recepción de dispositivos de red', 'E'),
(5, 'Recepción de componentes', 'E'),
(6, 'Recepción de equipos', 'E'),
(7, 'Devolución de equipos', 'S'),
(8, 'Pérdida de activos', 'S'),
(9, 'Equipos fuera de servicio', 'S'),
(10, 'Despacho de dispositivos de red', 'S'),
(11, 'Despacho de componentes', 'S'),
(12, 'Despacho de equipos', 'S');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_tipoproducto`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_tipoproducto`;
CREATE TABLE IF NOT EXISTS `tb_tipoproducto` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_nombre` varchar(30) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tipo`),
  UNIQUE KEY `uk_tipopro` (`tipo_nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_tipoproducto`:
--

--
-- Volcado de datos para la tabla `tb_tipoproducto`
--

INSERT INTO `tb_tipoproducto` (`id_tipo`, `tipo_nombre`, `create_at`, `update_at`, `inactive_at`, `iduser_inactive`, `iduser_create`, `iduser_update`) VALUES
(1, 'Redes', '2024-12-12 09:54:08', NULL, NULL, NULL, 1, NULL),
(2, 'Accesorios', '2024-12-12 09:54:08', NULL, NULL, NULL, 1, NULL),
(3, 'Consumibles', '2024-12-12 09:54:08', NULL, NULL, NULL, 1, NULL),
(4, 'Componentes', '2024-12-12 09:54:08', NULL, NULL, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_tipo_soporte`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_tipo_soporte`;
CREATE TABLE IF NOT EXISTS `tb_tipo_soporte` (
  `id_tipo_soporte` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_soporte` varchar(50) NOT NULL,
  `create_at` datetime DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_soporte`),
  UNIQUE KEY `tiposopor_uk_tipo_soporte` (`tipo_soporte`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_tipo_soporte`:
--

--
-- Volcado de datos para la tabla `tb_tipo_soporte`
--

INSERT INTO `tb_tipo_soporte` (`id_tipo_soporte`, `tipo_soporte`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'Instalación de servicio', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 'Mantenimiento preventivo', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 'Problema de conexión', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 'Soporte técnico', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 'Consulta de facturación', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(6, 'Cambio de plan', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(7, 'Reinstalación de equipos', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(8, 'Consulta de saldo', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(9, 'Reportar caída de servicio', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(10, 'Activación de servicio', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(11, 'Desactivación de servicio', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(12, 'Actualización de datos', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(13, 'Asistencia en instalación de router', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(14, 'Problema con el router', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(15, 'Configuración de red', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(16, 'Consulta sobre promociones', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(17, 'Cambio de dirección de servicio', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(18, 'Aumento de velocidad', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(19, 'Sugerencias y quejas', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(20, 'Desbloqueo de cuenta', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_unidadmedida`
--
-- Creación: 15-12-2024 a las 21:54:45
-- Última actualización: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_unidadmedida`;
CREATE TABLE IF NOT EXISTS `tb_unidadmedida` (
  `id_unidad` int(11) NOT NULL AUTO_INCREMENT,
  `unidad_nombre` varchar(30) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_unidad`),
  UNIQUE KEY `uk_unidad` (`unidad_nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_unidadmedida`:
--

--
-- Volcado de datos para la tabla `tb_unidadmedida`
--

INSERT INTO `tb_unidadmedida` (`id_unidad`, `unidad_nombre`, `create_at`, `update_at`, `iduser_create`, `iduser_update`) VALUES
(1, 'Unidades', '2024-12-12 09:54:08', NULL, 1, NULL),
(2, 'Metros', '2024-12-12 09:54:08', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_usuarios`
--
-- Creación: 15-12-2024 a las 21:54:45
--

DROP TABLE IF EXISTS `tb_usuarios`;
CREATE TABLE IF NOT EXISTS `tb_usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) NOT NULL,
  `nombre_user` varchar(100) DEFAULT NULL,
  `pass` char(60) DEFAULT NULL,
  `create_at` datetime DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `usuar_uk_id_persona` (`id_persona`),
  UNIQUE KEY `usuar_uk_nombre_user` (`nombre_user`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `tb_usuarios`:
--   `id_persona`
--       `tb_personas` -> `id_persona`
--

--
-- Volcado de datos para la tabla `tb_usuarios`
--

INSERT INTO `tb_usuarios` (`id_usuario`, `id_persona`, `nombre_user`, `pass`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 1, 'Lgarcia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(2, 2, 'Mramos', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(3, 3, 'Mtasayco', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(4, 4, 'Dpeñaloza', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL),
(5, 5, 'Tsaravia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', '2024-12-12 09:54:08', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_almacen`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_almacen`;
CREATE TABLE IF NOT EXISTS `vw_almacen` (
`id_almacen` int(11)
,`nombre_almacen` varchar(65)
,`iduser_create` int(11)
,`iduser_update` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_clientes_obtener`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_clientes_obtener`;
CREATE TABLE IF NOT EXISTS `vw_clientes_obtener` (
`id_cliente` int(11)
,`nombre_cliente` varchar(100)
,`codigo_cliente` varchar(15)
,`email_cliente` varchar(100)
,`telefono_cliente` varchar(9)
,`direccion_cliente` varchar(250)
,`referencia_cliente` varchar(150)
,`coordenadas_cliente` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_contactabilidad_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_contactabilidad_listar`;
CREATE TABLE IF NOT EXISTS `vw_contactabilidad_listar` (
`id_contactabilidad` int(11)
,`nombre_contacto` varchar(61)
,`telefono` char(9)
,`email` varchar(100)
,`paquete` varchar(250)
,`precio` decimal(7,2)
,`fecha_hora_contacto` datetime
,`direccion_servicio` varchar(250)
,`nota` text
,`fecha_limite` datetime
,`usuario_creador` varchar(100)
,`iduser_update` int(11)
,`usuario_modificador` varchar(100)
,`iduser_inactive` int(11)
,`usuario_inactivador` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_contratos_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_contratos_listar`;
CREATE TABLE IF NOT EXISTS `vw_contratos_listar` (
`id_contrato` int(11)
,`nombre_cliente` varchar(100)
,`num_identificacion` varchar(15)
,`direccion_servicio` varchar(200)
,`paquete` varchar(250)
,`precio` decimal(7,2)
,`tipos_servicio` mediumtext
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_empresas_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_empresas_listar`;
CREATE TABLE IF NOT EXISTS `vw_empresas_listar` (
`id_empresa` int(11)
,`ruc` varchar(11)
,`representante_legal` varchar(70)
,`razon_social` varchar(100)
,`nombre_comercial` varchar(100)
,`telefono` char(9)
,`email` varchar(100)
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`iduser_update` int(11)
,`iduser_inactive` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_fichainstalacion_filtrar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_fichainstalacion_filtrar`;
CREATE TABLE IF NOT EXISTS `vw_fichainstalacion_filtrar` (
`id_contrato` int(11)
,`nombre_cliente` varchar(100)
,`direccion_servicio` varchar(200)
,`tipos_servicio` mediumtext
,`servicios` mediumtext
,`fecha_creacion` date
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_kardex_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_kardex_listar`;
CREATE TABLE IF NOT EXISTS `vw_kardex_listar` (
`id_kardex` int(11)
,`id_producto` int(11)
,`modelo` varchar(70)
,`id_tipo_producto` int(11)
,`tipo_producto` varchar(30)
,`id_marca` int(11)
,`nombre_marca` varchar(30)
,`precio_actual` decimal(7,2)
,`fecha` date
,`id_tipo_operacion` int(11)
,`tipo_operacion` varchar(55)
,`cantidad` int(11)
,`saldo_total` int(11)
,`valor_unico_historico` decimal(7,2)
,`fecha_creacion` datetime
,`id_almacen` int(11)
,`nombre_almacen` varchar(65)
,`creado_por` varchar(61)
,`tipo_movimiento` varchar(7)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_marca`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_marca`;
CREATE TABLE IF NOT EXISTS `vw_marca` (
`id_marca` int(11)
,`marca` varchar(30)
,`create_at` datetime
,`iduser_create` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_paquetes_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_paquetes_listar`;
CREATE TABLE IF NOT EXISTS `vw_paquetes_listar` (
`id_paquete` int(11)
,`id_servicio` longtext
,`servicios` mediumtext
,`tipos_servicio` mediumtext
,`paquete` varchar(250)
,`precio` decimal(7,2)
,`velocidad` longtext
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`iduser_update` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_personas_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_personas_listar`;
CREATE TABLE IF NOT EXISTS `vw_personas_listar` (
`id_persona` int(11)
,`tipo_doc` char(3)
,`nro_doc` varchar(15)
,`apellidos` varchar(30)
,`nombres` varchar(30)
,`telefono` char(9)
,`nacionalidad` varchar(40)
,`email` varchar(100)
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`usuario_creador` varchar(100)
,`iduser_update` int(11)
,`usuario_modificador` varchar(100)
,`iduser_inactive` int(11)
,`usuario_inactivador` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_productos_detalle`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_productos_detalle`;
CREATE TABLE IF NOT EXISTS `vw_productos_detalle` (
`id_producto` int(11)
,`modelo` varchar(70)
,`precio_actual` decimal(7,2)
,`codigo_barra` varchar(120)
,`marca` varchar(30)
,`id_marca` int(11)
,`tipo_nombre` varchar(30)
,`id_tipo` int(11)
,`unidad_nombre` varchar(30)
,`id_unidad` int(11)
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`iduser_update` int(11)
,`iduser_inactive` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_rolesdetallado_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_rolesdetallado_listar`;
CREATE TABLE IF NOT EXISTS `vw_rolesdetallado_listar` (
`id_rol` int(11)
,`rol` varchar(30)
,`permisos` longtext
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`usuario_creador` varchar(100)
,`iduser_update` int(11)
,`usuario_modificador` varchar(100)
,`iduser_inactive` int(11)
,`usuario_inactivador` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_roles_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_roles_listar`;
CREATE TABLE IF NOT EXISTS `vw_roles_listar` (
`id_rol` int(11)
,`rol` varchar(30)
,`create_at` datetime
,`update_at` datetime
,`iduser_create` int(11)
,`inactive_at` datetime
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_sectores_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_sectores_listar`;
CREATE TABLE IF NOT EXISTS `vw_sectores_listar` (
`id_sector` int(11)
,`sector` varchar(60)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_sectores_obtener`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_sectores_obtener`;
CREATE TABLE IF NOT EXISTS `vw_sectores_obtener` (
`id_sector` int(11)
,`sector` varchar(60)
,`id_distrito` int(11)
,`descripcion` varchar(100)
,`coordenadas` varchar(50)
,`direccion` varchar(200)
,`distrito` varchar(45)
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`iduser_update` int(11)
,`iduser_inactive` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_servicios_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_servicios_listar`;
CREATE TABLE IF NOT EXISTS `vw_servicios_listar` (
`id_servicio` int(11)
,`tipo_servicio` char(4)
,`servicio` varchar(200)
,`inactive_at` datetime
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_servicios_listartotal`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_servicios_listartotal`;
CREATE TABLE IF NOT EXISTS `vw_servicios_listartotal` (
`id_servicio` int(11)
,`servicio` varchar(200)
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`iduser_update` int(11)
,`iduser_inactive` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_soporte_detalle`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_soporte_detalle`;
CREATE TABLE IF NOT EXISTS `vw_soporte_detalle` (
`id_soporte` int(11)
,`coordenada` varchar(50)
,`id_contrato` int(11)
,`id_sector` int(11)
,`sector` varchar(60)
,`fecha_hora_solicitud` datetime
,`fecha_hora_asistencia` datetime
,`prioridad` varchar(50)
,`soporte` longtext
,`descripcion_problema` text
,`descripcion_solucion` text
,`tipo_soporte` varchar(50)
,`nro_doc` varchar(15)
,`id_cliente` int(11)
,`direccion_servicio` varchar(200)
,`id_tecnico` int(11)
,`tecnico_nombres` varchar(30)
,`tecnico_apellidos` varchar(30)
,`id_paquete` int(11)
,`id_servicio` longtext
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_soporte_fichadatos`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_soporte_fichadatos`;
CREATE TABLE IF NOT EXISTS `vw_soporte_fichadatos` (
`nro_doc` varchar(15)
,`id_soporte` int(11)
,`soporte` longtext
,`descripcion_problema` text
,`descripcion_solucion` text
,`update_at` datetime
,`tipo_servicio` char(4)
,`coordenada` varchar(50)
,`servicio` varchar(200)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_tiposoporte_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_tiposoporte_listar`;
CREATE TABLE IF NOT EXISTS `vw_tiposoporte_listar` (
`id_tipo_soporte` int(11)
,`tipo_soporte` varchar(50)
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_create` int(11)
,`usuario_creador` varchar(100)
,`iduser_update` int(11)
,`usuario_modificador` varchar(100)
,`iduser_inactive` int(11)
,`usuario_inactivador` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_tipo_productos`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_tipo_productos`;
CREATE TABLE IF NOT EXISTS `vw_tipo_productos` (
`id_tipo` int(11)
,`tipo_nombre` varchar(30)
,`iduser_create` int(11)
,`iduser_update` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_unidadmedida`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_unidadmedida`;
CREATE TABLE IF NOT EXISTS `vw_unidadmedida` (
`id_unidad` int(11)
,`unidad_nombre` varchar(30)
,`create_at` datetime
,`update_at` datetime
,`iduser_create` int(11)
,`iduser_update` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_usuarios_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_usuarios_listar`;
CREATE TABLE IF NOT EXISTS `vw_usuarios_listar` (
`id_responsable` int(11)
,`id_usuario` int(11)
,`id_rol` int(11)
,`nombre` varchar(62)
,`nombre_user` varchar(100)
,`Cargo` varchar(30)
,`create_at` datetime
,`inactive_at` datetime
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_almacen`
--
DROP TABLE IF EXISTS `vw_almacen`;

DROP VIEW IF EXISTS `vw_almacen`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_almacen`  AS SELECT `tb_almacen`.`id_almacen` AS `id_almacen`, `tb_almacen`.`nombre_almacen` AS `nombre_almacen`, `tb_almacen`.`iduser_create` AS `iduser_create`, `tb_almacen`.`iduser_update` AS `iduser_update` FROM `tb_almacen` WHERE `tb_almacen`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_clientes_obtener`
--
DROP TABLE IF EXISTS `vw_clientes_obtener`;

DROP VIEW IF EXISTS `vw_clientes_obtener`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_clientes_obtener`  AS SELECT `c`.`id_cliente` AS `id_cliente`, coalesce(concat(`p`.`nombres`,', ',`p`.`apellidos`),`e`.`razon_social`) AS `nombre_cliente`, coalesce(`p`.`nro_doc`,`e`.`ruc`) AS `codigo_cliente`, coalesce(`p`.`email`,`e`.`email`) AS `email_cliente`, coalesce(`p`.`telefono`,`e`.`telefono`) AS `telefono_cliente`, `c`.`direccion` AS `direccion_cliente`, `c`.`referencia` AS `referencia_cliente`, `c`.`coordenadas` AS `coordenadas_cliente` FROM ((`tb_clientes` `c` left join `tb_personas` `p` on(`c`.`id_persona` = `p`.`id_persona` and `p`.`inactive_at` is null)) left join `tb_empresas` `e` on(`c`.`id_empresa` = `e`.`id_empresa` and `e`.`inactive_at` is null)) WHERE `c`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_contactabilidad_listar`
--
DROP TABLE IF EXISTS `vw_contactabilidad_listar`;

DROP VIEW IF EXISTS `vw_contactabilidad_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_contactabilidad_listar`  AS SELECT `c`.`id_contactabilidad` AS `id_contactabilidad`, concat(`p`.`nombres`,' ',`p`.`apellidos`) AS `nombre_contacto`, `p`.`telefono` AS `telefono`, `p`.`email` AS `email`, `pk`.`paquete` AS `paquete`, `pk`.`precio` AS `precio`, `c`.`create_at` AS `fecha_hora_contacto`, `c`.`direccion_servicio` AS `direccion_servicio`, `c`.`nota` AS `nota`, `c`.`fecha_limite` AS `fecha_limite`, `u1`.`nombre_user` AS `usuario_creador`, `c`.`iduser_update` AS `iduser_update`, `u2`.`nombre_user` AS `usuario_modificador`, `c`.`iduser_inactive` AS `iduser_inactive`, `u3`.`nombre_user` AS `usuario_inactivador` FROM (((((`tb_contactabilidad` `c` join `tb_personas` `p` on(`c`.`id_persona` = `p`.`id_persona`)) join `tb_paquetes` `pk` on(`c`.`id_paquete` = `pk`.`id_paquete`)) left join `tb_usuarios` `u1` on(`c`.`iduser_create` = `u1`.`id_usuario`)) left join `tb_usuarios` `u2` on(`c`.`iduser_update` = `u2`.`id_usuario`)) left join `tb_usuarios` `u3` on(`c`.`iduser_inactive` = `u3`.`id_usuario`)) WHERE !(`p`.`id_persona` in (select `tb_clientes`.`id_persona` from `tb_clientes` where `tb_clientes`.`id_persona` is not null)) ORDER BY `c`.`id_contactabilidad` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_contratos_listar`
--
DROP TABLE IF EXISTS `vw_contratos_listar`;

DROP VIEW IF EXISTS `vw_contratos_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_contratos_listar`  AS SELECT `c`.`id_contrato` AS `id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN concat(`p`.`apellidos`,', ',`p`.`nombres`) ELSE `e`.`razon_social` END AS `nombre_cliente`, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nro_doc` ELSE `e`.`ruc` END AS `num_identificacion`, `c`.`direccion_servicio` AS `direccion_servicio`, `t`.`paquete` AS `paquete`, `t`.`precio` AS `precio`, group_concat(`sv`.`tipo_servicio` separator ',') AS `tipos_servicio` FROM (((((`tb_contratos` `c` join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) left join `tb_empresas` `e` on(`cl`.`id_cliente` = `e`.`id_empresa`)) join `tb_paquetes` `t` on(`c`.`id_paquete` = `t`.`id_paquete`)) join `tb_servicios` `sv` on(json_contains(`t`.`id_servicio`,json_object('id_servicio',`sv`.`id_servicio`)))) WHERE `c`.`inactive_at` is null GROUP BY `c`.`id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN concat(`p`.`apellidos`,', ',`p`.`nombres`) ELSE `e`.`razon_social` END, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nro_doc` ELSE `e`.`ruc` END, `c`.`direccion_servicio`, `t`.`paquete`, `t`.`precio` ORDER BY `c`.`id_contrato` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_empresas_listar`
--
DROP TABLE IF EXISTS `vw_empresas_listar`;

DROP VIEW IF EXISTS `vw_empresas_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_empresas_listar`  AS SELECT `e`.`id_empresa` AS `id_empresa`, `e`.`ruc` AS `ruc`, `e`.`representante_legal` AS `representante_legal`, `e`.`razon_social` AS `razon_social`, `e`.`nombre_comercial` AS `nombre_comercial`, `e`.`telefono` AS `telefono`, `e`.`email` AS `email`, `e`.`create_at` AS `create_at`, `e`.`update_at` AS `update_at`, `e`.`inactive_at` AS `inactive_at`, `e`.`iduser_create` AS `iduser_create`, `e`.`iduser_update` AS `iduser_update`, `e`.`iduser_inactive` AS `iduser_inactive` FROM `tb_empresas` AS `e` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_fichainstalacion_filtrar`
--
DROP TABLE IF EXISTS `vw_fichainstalacion_filtrar`;

DROP VIEW IF EXISTS `vw_fichainstalacion_filtrar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_fichainstalacion_filtrar`  AS SELECT `c`.`id_contrato` AS `id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nombres` ELSE `e`.`razon_social` END AS `nombre_cliente`, `c`.`direccion_servicio` AS `direccion_servicio`, group_concat(`sv`.`tipo_servicio` separator ',') AS `tipos_servicio`, group_concat(`sv`.`servicio` separator ',') AS `servicios`, cast(`c`.`create_at` as date) AS `fecha_creacion` FROM (((((`tb_contratos` `c` join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) left join `tb_empresas` `e` on(`cl`.`id_cliente` = `e`.`id_empresa`)) join `tb_paquetes` `t` on(`c`.`id_paquete` = `t`.`id_paquete`)) join `tb_servicios` `sv` on(json_contains(`t`.`id_servicio`,concat('{"id_servicio":',`sv`.`id_servicio`,'}')))) WHERE `c`.`inactive_at` is null AND `c`.`ficha_instalacion` is null GROUP BY `c`.`id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nombres` ELSE `e`.`razon_social` END, `c`.`direccion_servicio`, `c`.`create_at` ORDER BY `c`.`create_at` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_kardex_listar`
--
DROP TABLE IF EXISTS `vw_kardex_listar`;

DROP VIEW IF EXISTS `vw_kardex_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_kardex_listar`  AS SELECT `k`.`id_kardex` AS `id_kardex`, `p`.`id_producto` AS `id_producto`, `p`.`modelo` AS `modelo`, `p`.`id_tipo` AS `id_tipo_producto`, `tp`.`tipo_nombre` AS `tipo_producto`, `p`.`id_marca` AS `id_marca`, `m`.`marca` AS `nombre_marca`, `p`.`precio_actual` AS `precio_actual`, `k`.`fecha` AS `fecha`, `k`.`id_tipooperacion` AS `id_tipo_operacion`, `toper`.`descripcion` AS `tipo_operacion`, `k`.`cantidad` AS `cantidad`, `k`.`saldo_total` AS `saldo_total`, `k`.`valor_unico_historico` AS `valor_unico_historico`, `k`.`create_at` AS `fecha_creacion`, `k`.`id_almacen` AS `id_almacen`, `a`.`nombre_almacen` AS `nombre_almacen`, concat(`pe`.`nombres`,' ',`pe`.`apellidos`) AS `creado_por`, CASE WHEN `toper`.`movimiento` = 'E' THEN 'ENTRADA' WHEN `toper`.`movimiento` = 'S' THEN 'SALIDA' END AS `tipo_movimiento` FROM ((((((`tb_productos` `p` join `tb_kardex` `k` on(`p`.`id_producto` = `k`.`id_producto`)) join `tb_tipoproducto` `tp` on(`p`.`id_tipo` = `tp`.`id_tipo`)) join `tb_marca` `m` on(`p`.`id_marca` = `m`.`id_marca`)) join `tb_tipooperacion` `toper` on(`k`.`id_tipooperacion` = `toper`.`id_tipooperacion`)) join `tb_almacen` `a` on(`k`.`id_almacen` = `a`.`id_almacen`)) left join `tb_personas` `pe` on(`k`.`iduser_create` = `pe`.`id_persona`)) ORDER BY `k`.`create_at` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_marca`
--
DROP TABLE IF EXISTS `vw_marca`;

DROP VIEW IF EXISTS `vw_marca`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_marca`  AS SELECT `tb_marca`.`id_marca` AS `id_marca`, `tb_marca`.`marca` AS `marca`, `tb_marca`.`create_at` AS `create_at`, `tb_marca`.`iduser_create` AS `iduser_create` FROM `tb_marca` WHERE `tb_marca`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_paquetes_listar`
--
DROP TABLE IF EXISTS `vw_paquetes_listar`;

DROP VIEW IF EXISTS `vw_paquetes_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_paquetes_listar`  AS SELECT `p`.`id_paquete` AS `id_paquete`, `p`.`id_servicio` AS `id_servicio`, group_concat(`s`.`servicio` separator ',') AS `servicios`, group_concat(`s`.`tipo_servicio` separator ',') AS `tipos_servicio`, `p`.`paquete` AS `paquete`, `p`.`precio` AS `precio`, `p`.`velocidad` AS `velocidad`, `p`.`create_at` AS `create_at`, `p`.`update_at` AS `update_at`, `p`.`inactive_at` AS `inactive_at`, `p`.`iduser_create` AS `iduser_create`, `p`.`iduser_update` AS `iduser_update` FROM (`tb_paquetes` `p` join `tb_servicios` `s` on(json_contains(`p`.`id_servicio`,concat('{"id_servicio":',`s`.`id_servicio`,'}')))) GROUP BY `p`.`id_paquete` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_personas_listar`
--
DROP TABLE IF EXISTS `vw_personas_listar`;

DROP VIEW IF EXISTS `vw_personas_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_personas_listar`  AS SELECT `p`.`id_persona` AS `id_persona`, `p`.`tipo_doc` AS `tipo_doc`, `p`.`nro_doc` AS `nro_doc`, `p`.`apellidos` AS `apellidos`, `p`.`nombres` AS `nombres`, `p`.`telefono` AS `telefono`, `p`.`nacionalidad` AS `nacionalidad`, `p`.`email` AS `email`, `p`.`create_at` AS `create_at`, `p`.`update_at` AS `update_at`, `p`.`inactive_at` AS `inactive_at`, `p`.`iduser_create` AS `iduser_create`, `u1`.`nombre_user` AS `usuario_creador`, `p`.`iduser_update` AS `iduser_update`, `u2`.`nombre_user` AS `usuario_modificador`, `p`.`iduser_inactive` AS `iduser_inactive`, `u3`.`nombre_user` AS `usuario_inactivador` FROM (((`tb_personas` `p` left join `tb_usuarios` `u1` on(`p`.`iduser_create` = `u1`.`id_usuario`)) left join `tb_usuarios` `u2` on(`p`.`iduser_update` = `u2`.`id_usuario`)) left join `tb_usuarios` `u3` on(`p`.`iduser_inactive` = `u3`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_productos_detalle`
--
DROP TABLE IF EXISTS `vw_productos_detalle`;

DROP VIEW IF EXISTS `vw_productos_detalle`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_productos_detalle`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`modelo` AS `modelo`, `p`.`precio_actual` AS `precio_actual`, `p`.`codigo_barra` AS `codigo_barra`, `m`.`marca` AS `marca`, `m`.`id_marca` AS `id_marca`, `t`.`tipo_nombre` AS `tipo_nombre`, `t`.`id_tipo` AS `id_tipo`, `u`.`unidad_nombre` AS `unidad_nombre`, `u`.`id_unidad` AS `id_unidad`, `p`.`create_at` AS `create_at`, `p`.`update_at` AS `update_at`, `p`.`inactive_at` AS `inactive_at`, `p`.`iduser_create` AS `iduser_create`, `p`.`iduser_update` AS `iduser_update`, `p`.`iduser_inactive` AS `iduser_inactive` FROM (((`tb_productos` `p` join `tb_marca` `m` on(`p`.`id_marca` = `m`.`id_marca`)) join `tb_tipoproducto` `t` on(`p`.`id_tipo` = `t`.`id_tipo`)) join `tb_unidadmedida` `u` on(`p`.`id_unidad` = `u`.`id_unidad`)) WHERE `p`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_rolesdetallado_listar`
--
DROP TABLE IF EXISTS `vw_rolesdetallado_listar`;

DROP VIEW IF EXISTS `vw_rolesdetallado_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_rolesdetallado_listar`  AS SELECT `r`.`id_rol` AS `id_rol`, `r`.`rol` AS `rol`, `r`.`permisos` AS `permisos`, `r`.`create_at` AS `create_at`, `r`.`update_at` AS `update_at`, `r`.`inactive_at` AS `inactive_at`, `r`.`iduser_create` AS `iduser_create`, `u1`.`nombre_user` AS `usuario_creador`, `r`.`iduser_update` AS `iduser_update`, `u2`.`nombre_user` AS `usuario_modificador`, `r`.`iduser_inactive` AS `iduser_inactive`, `u3`.`nombre_user` AS `usuario_inactivador` FROM (((`tb_roles` `r` left join `tb_usuarios` `u1` on(`r`.`iduser_create` = `u1`.`id_usuario`)) left join `tb_usuarios` `u2` on(`r`.`iduser_update` = `u2`.`id_usuario`)) left join `tb_usuarios` `u3` on(`r`.`iduser_inactive` = `u3`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_roles_listar`
--
DROP TABLE IF EXISTS `vw_roles_listar`;

DROP VIEW IF EXISTS `vw_roles_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_roles_listar`  AS SELECT `r`.`id_rol` AS `id_rol`, `r`.`rol` AS `rol`, `r`.`create_at` AS `create_at`, `r`.`update_at` AS `update_at`, `r`.`iduser_create` AS `iduser_create`, `r`.`inactive_at` AS `inactive_at` FROM `tb_roles` AS `r` WHERE `r`.`rol` <> 'Administrador' ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_sectores_listar`
--
DROP TABLE IF EXISTS `vw_sectores_listar`;

DROP VIEW IF EXISTS `vw_sectores_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_sectores_listar`  AS SELECT `tb_sectores`.`id_sector` AS `id_sector`, `tb_sectores`.`sector` AS `sector` FROM `tb_sectores` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_sectores_obtener`
--
DROP TABLE IF EXISTS `vw_sectores_obtener`;

DROP VIEW IF EXISTS `vw_sectores_obtener`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_sectores_obtener`  AS SELECT `s`.`id_sector` AS `id_sector`, `s`.`sector` AS `sector`, `s`.`id_distrito` AS `id_distrito`, `s`.`descripcion` AS `descripcion`, `s`.`coordenadas` AS `coordenadas`, `s`.`direccion` AS `direccion`, `d`.`distrito` AS `distrito`, `s`.`create_at` AS `create_at`, `s`.`update_at` AS `update_at`, `s`.`inactive_at` AS `inactive_at`, `s`.`iduser_create` AS `iduser_create`, `s`.`iduser_update` AS `iduser_update`, `s`.`iduser_inactive` AS `iduser_inactive` FROM (`tb_sectores` `s` left join `tb_distritos` `d` on(`s`.`id_distrito` = `d`.`id_distrito`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_servicios_listar`
--
DROP TABLE IF EXISTS `vw_servicios_listar`;

DROP VIEW IF EXISTS `vw_servicios_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_servicios_listar`  AS SELECT `s`.`id_servicio` AS `id_servicio`, `s`.`tipo_servicio` AS `tipo_servicio`, `s`.`servicio` AS `servicio`, `s`.`inactive_at` AS `inactive_at` FROM `tb_servicios` AS `s` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_servicios_listartotal`
--
DROP TABLE IF EXISTS `vw_servicios_listartotal`;

DROP VIEW IF EXISTS `vw_servicios_listartotal`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_servicios_listartotal`  AS SELECT `s`.`id_servicio` AS `id_servicio`, `s`.`servicio` AS `servicio`, `s`.`create_at` AS `create_at`, `s`.`update_at` AS `update_at`, `s`.`inactive_at` AS `inactive_at`, `s`.`iduser_create` AS `iduser_create`, `s`.`iduser_update` AS `iduser_update`, `s`.`iduser_inactive` AS `iduser_inactive` FROM `tb_servicios` AS `s` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_soporte_detalle`
--
DROP TABLE IF EXISTS `vw_soporte_detalle`;

DROP VIEW IF EXISTS `vw_soporte_detalle`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_soporte_detalle`  AS SELECT `s`.`id_soporte` AS `id_soporte`, `c`.`coordenada` AS `coordenada`, `s`.`id_contrato` AS `id_contrato`, `c`.`id_sector` AS `id_sector`, `sct`.`sector` AS `sector`, `s`.`fecha_hora_solicitud` AS `fecha_hora_solicitud`, `s`.`fecha_hora_asistencia` AS `fecha_hora_asistencia`, `s`.`prioridad` AS `prioridad`, `s`.`soporte` AS `soporte`, `s`.`descripcion_problema` AS `descripcion_problema`, `s`.`descripcion_solucion` AS `descripcion_solucion`, `ts`.`tipo_soporte` AS `tipo_soporte`, coalesce(`p_cliente`.`nro_doc`,`emp`.`ruc`) AS `nro_doc`, `c`.`id_cliente` AS `id_cliente`, `c`.`direccion_servicio` AS `direccion_servicio`, `r`.`id_usuario` AS `id_tecnico`, `p_tecnico`.`nombres` AS `tecnico_nombres`, `p_tecnico`.`apellidos` AS `tecnico_apellidos`, `pk`.`id_paquete` AS `id_paquete`, `pk`.`id_servicio` AS `id_servicio` FROM ((((((((((`tb_soporte` `s` left join `tb_contratos` `c` on(`s`.`id_contrato` = `c`.`id_contrato`)) join `tb_sectores` `sct` on(`c`.`id_sector` = `sct`.`id_sector`)) left join `tb_tipo_soporte` `ts` on(`s`.`id_tipo_soporte` = `ts`.`id_tipo_soporte`)) left join `tb_responsables` `r` on(`s`.`id_tecnico` = `r`.`id_responsable`)) left join `tb_usuarios` `u` on(`r`.`id_usuario` = `u`.`id_usuario`)) left join `tb_personas` `p_tecnico` on(`u`.`id_persona` = `p_tecnico`.`id_persona`)) left join `tb_paquetes` `pk` on(`c`.`id_paquete` = `pk`.`id_paquete`)) left join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_empresas` `emp` on(`cl`.`id_empresa` = `emp`.`id_empresa`)) left join `tb_personas` `p_cliente` on(`cl`.`id_persona` = `p_cliente`.`id_persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_soporte_fichadatos`
--
DROP TABLE IF EXISTS `vw_soporte_fichadatos`;

DROP VIEW IF EXISTS `vw_soporte_fichadatos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_soporte_fichadatos`  AS SELECT `p`.`nro_doc` AS `nro_doc`, `s`.`id_soporte` AS `id_soporte`, `s`.`soporte` AS `soporte`, `s`.`descripcion_problema` AS `descripcion_problema`, `s`.`descripcion_solucion` AS `descripcion_solucion`, `s`.`update_at` AS `update_at`, `sv`.`tipo_servicio` AS `tipo_servicio`, `c`.`coordenada` AS `coordenada`, `sv`.`servicio` AS `servicio` FROM (((((`tb_soporte` `s` join `tb_contratos` `c` on(`s`.`id_contrato` = `c`.`id_contrato`)) join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) join `tb_paquetes` `pk` on(`c`.`id_paquete` = `pk`.`id_paquete`)) join `tb_servicios` `sv` on(json_contains(`pk`.`id_servicio`,concat('{"id_servicio":',`sv`.`id_servicio`,'}')))) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_tiposoporte_listar`
--
DROP TABLE IF EXISTS `vw_tiposoporte_listar`;

DROP VIEW IF EXISTS `vw_tiposoporte_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_tiposoporte_listar`  AS SELECT `t`.`id_tipo_soporte` AS `id_tipo_soporte`, `t`.`tipo_soporte` AS `tipo_soporte`, `t`.`create_at` AS `create_at`, `t`.`update_at` AS `update_at`, `t`.`inactive_at` AS `inactive_at`, `t`.`iduser_create` AS `iduser_create`, `u1`.`nombre_user` AS `usuario_creador`, `t`.`iduser_update` AS `iduser_update`, `u2`.`nombre_user` AS `usuario_modificador`, `t`.`iduser_inactive` AS `iduser_inactive`, `u3`.`nombre_user` AS `usuario_inactivador` FROM (((`tb_tipo_soporte` `t` left join `tb_usuarios` `u1` on(`t`.`iduser_create` = `u1`.`id_usuario`)) left join `tb_usuarios` `u2` on(`t`.`iduser_update` = `u2`.`id_usuario`)) left join `tb_usuarios` `u3` on(`t`.`iduser_inactive` = `u3`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_tipo_productos`
--
DROP TABLE IF EXISTS `vw_tipo_productos`;

DROP VIEW IF EXISTS `vw_tipo_productos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_tipo_productos`  AS SELECT `tb_tipoproducto`.`id_tipo` AS `id_tipo`, `tb_tipoproducto`.`tipo_nombre` AS `tipo_nombre`, `tb_tipoproducto`.`iduser_create` AS `iduser_create`, `tb_tipoproducto`.`iduser_update` AS `iduser_update` FROM `tb_tipoproducto` WHERE `tb_tipoproducto`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_unidadmedida`
--
DROP TABLE IF EXISTS `vw_unidadmedida`;

DROP VIEW IF EXISTS `vw_unidadmedida`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_unidadmedida`  AS SELECT `tb_unidadmedida`.`id_unidad` AS `id_unidad`, `tb_unidadmedida`.`unidad_nombre` AS `unidad_nombre`, `tb_unidadmedida`.`create_at` AS `create_at`, `tb_unidadmedida`.`update_at` AS `update_at`, `tb_unidadmedida`.`iduser_create` AS `iduser_create`, `tb_unidadmedida`.`iduser_update` AS `iduser_update` FROM `tb_unidadmedida` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_usuarios_listar`
--
DROP TABLE IF EXISTS `vw_usuarios_listar`;

DROP VIEW IF EXISTS `vw_usuarios_listar`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_usuarios_listar`  AS SELECT `res`.`id_responsable` AS `id_responsable`, `us`.`id_usuario` AS `id_usuario`, `ro`.`id_rol` AS `id_rol`, coalesce(concat(`pe`.`nombres`,', ',`pe`.`apellidos`)) AS `nombre`, `us`.`nombre_user` AS `nombre_user`, `ro`.`rol` AS `Cargo`, `us`.`create_at` AS `create_at`, `us`.`inactive_at` AS `inactive_at` FROM (((`tb_responsables` `res` join `tb_usuarios` `us` on(`res`.`id_usuario` = `us`.`id_usuario`)) join `tb_personas` `pe` on(`us`.`id_persona` = `pe`.`id_persona`)) join `tb_roles` `ro` on(`res`.`id_rol` = `ro`.`id_rol`)) WHERE `us`.`inactive_at` is null AND `us`.`id_usuario` <> 1 ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tb_cajas`
--
ALTER TABLE `tb_cajas`
  ADD CONSTRAINT `caja_fk_id_sector` FOREIGN KEY (`id_sector`) REFERENCES `tb_sectores` (`id_sector`);

--
-- Filtros para la tabla `tb_clientes`
--
ALTER TABLE `tb_clientes`
  ADD CONSTRAINT `clien_fk_id_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `tb_empresas` (`id_empresa`),
  ADD CONSTRAINT `clien_fk_id_persona` FOREIGN KEY (`id_persona`) REFERENCES `tb_personas` (`id_persona`);

--
-- Filtros para la tabla `tb_contactabilidad`
--
ALTER TABLE `tb_contactabilidad`
  ADD CONSTRAINT `contac_fk_id_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `tb_empresas` (`id_empresa`),
  ADD CONSTRAINT `contac_fk_id_persona` FOREIGN KEY (`id_persona`) REFERENCES `tb_personas` (`id_persona`),
  ADD CONSTRAINT `contac_fk_id_tarifario` FOREIGN KEY (`id_paquete`) REFERENCES `tb_paquetes` (`id_paquete`);

--
-- Filtros para la tabla `tb_contratos`
--
ALTER TABLE `tb_contratos`
  ADD CONSTRAINT `contr_fk_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `tb_clientes` (`id_cliente`),
  ADD CONSTRAINT `contr_fk_id_sector` FOREIGN KEY (`id_sector`) REFERENCES `tb_sectores` (`id_sector`),
  ADD CONSTRAINT `contr_fk_id_tarifario` FOREIGN KEY (`id_paquete`) REFERENCES `tb_paquetes` (`id_paquete`),
  ADD CONSTRAINT `contr_fk_id_usuario_registro` FOREIGN KEY (`id_usuario_registro`) REFERENCES `tb_responsables` (`id_responsable`),
  ADD CONSTRAINT `contr_fk_id_usuario_tecnico` FOREIGN KEY (`id_usuario_tecnico`) REFERENCES `tb_responsables` (`id_responsable`);

--
-- Filtros para la tabla `tb_distritos`
--
ALTER TABLE `tb_distritos`
  ADD CONSTRAINT `distr_fk_id_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `tb_departamentos` (`id_departamento`),
  ADD CONSTRAINT `distr_fk_id_provincia` FOREIGN KEY (`id_provincia`) REFERENCES `tb_provincias` (`id_provincia`);

--
-- Filtros para la tabla `tb_kardex`
--
ALTER TABLE `tb_kardex`
  ADD CONSTRAINT `fk_id_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `tb_almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `tb_productos` (`id_producto`),
  ADD CONSTRAINT `fk_id_tipooperacion` FOREIGN KEY (`id_tipooperacion`) REFERENCES `tb_tipooperacion` (`id_tipooperacion`);

--
-- Filtros para la tabla `tb_lineas`
--
ALTER TABLE `tb_lineas`
  ADD CONSTRAINT `lineas_fk_id_caja` FOREIGN KEY (`id_caja`) REFERENCES `tb_cajas` (`id_caja`),
  ADD CONSTRAINT `lineas_fk_id_mufa` FOREIGN KEY (`id_mufa`) REFERENCES `tb_mufas` (`id_mufa`);

--
-- Filtros para la tabla `tb_productos`
--
ALTER TABLE `tb_productos`
  ADD CONSTRAINT `fk_marca` FOREIGN KEY (`id_marca`) REFERENCES `tb_marca` (`id_marca`),
  ADD CONSTRAINT `fk_tipo_producto` FOREIGN KEY (`id_tipo`) REFERENCES `tb_tipoproducto` (`id_tipo`),
  ADD CONSTRAINT `fk_unidad_medida` FOREIGN KEY (`id_unidad`) REFERENCES `tb_unidadmedida` (`id_unidad`);

--
-- Filtros para la tabla `tb_provincias`
--
ALTER TABLE `tb_provincias`
  ADD CONSTRAINT `provi_fk_id_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `tb_departamentos` (`id_departamento`);

--
-- Filtros para la tabla `tb_responsables`
--
ALTER TABLE `tb_responsables`
  ADD CONSTRAINT `respo_fk_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `tb_roles` (`id_rol`),
  ADD CONSTRAINT `respo_fk_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuarios` (`id_usuario`);

--
-- Filtros para la tabla `tb_sectores`
--
ALTER TABLE `tb_sectores`
  ADD CONSTRAINT `secto_fk_id_distrito` FOREIGN KEY (`id_distrito`) REFERENCES `tb_distritos` (`id_distrito`);

--
-- Filtros para la tabla `tb_soporte`
--
ALTER TABLE `tb_soporte`
  ADD CONSTRAINT `sopor_fk_id_contrato` FOREIGN KEY (`id_contrato`) REFERENCES `tb_contratos` (`id_contrato`),
  ADD CONSTRAINT `sopor_fk_id_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `tb_responsables` (`id_responsable`),
  ADD CONSTRAINT `sopor_fk_id_tipo_soporte` FOREIGN KEY (`id_tipo_soporte`) REFERENCES `tb_tipo_soporte` (`id_tipo_soporte`);

--
-- Filtros para la tabla `tb_usuarios`
--
ALTER TABLE `tb_usuarios`
  ADD CONSTRAINT `usuar_fk_id_persona` FOREIGN KEY (`id_persona`) REFERENCES `tb_personas` (`id_persona`);

DELIMITER $$
--
-- Eventos
--
DROP EVENT IF EXISTS `ev_inhabilitar_contactos`$$
CREATE DEFINER=`root`@`localhost` EVENT `ev_inhabilitar_contactos` ON SCHEDULE EVERY 1 DAY STARTS '2024-12-12 09:55:00' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    CALL spu_contactabilidad_inhabilitar();
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
