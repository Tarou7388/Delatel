-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 04-03-2025 a las 16:28:47
-- Versión del servidor: 10.11.10-MariaDB
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Delatel`
--

DROP DATABASE IF EXISTS `Delatel`;
CREATE DATABASE IF NOT EXISTS `Delatel`;
USE `Delatel`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `ObtenerHistorialSoporte`$$
CREATE PROCEDURE `ObtenerHistorialSoporte` (IN `docCliente` VARCHAR(20))   BEGIN
    SELECT 
        s.id_soporte,
        s.id_contrato,
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia,
        s.prioridad,
        s.soporte,
        s.descripcion_problema,
        s.descripcion_solucion,
        s.create_at,
        s.update_at,
        s.inactive_at,
        s.iduser_create,
        s.iduser_update,
        s.iduser_inactive,
        c.coordenada,
        c.id_sector,
        sct.sector,
        c.direccion_servicio,
        r.id_usuario AS id_tecnico,
        p_tecnico.nombres AS tecnico_nombres,
        p_tecnico.apellidos AS tecnico_apellidos,
        pk.id_paquete,
        pk.id_servicio,
        COALESCE(p_cliente.nro_doc, emp.ruc) AS nro_doc,
        c.id_cliente
    FROM 
        tb_soporte s
        LEFT JOIN tb_contratos c ON s.id_contrato = c.id_contrato
        INNER JOIN tb_sectores sct ON c.id_sector = sct.id_sector
        LEFT JOIN tb_responsables r ON s.id_tecnico = r.id_responsable
        LEFT JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
        LEFT JOIN tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
        LEFT JOIN tb_paquetes pk ON c.id_paquete = pk.id_paquete
        LEFT JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_empresas emp ON cl.id_empresa = emp.id_empresa
        LEFT JOIN tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona
    WHERE 
        COALESCE(p_cliente.nro_doc, emp.ruc) = docCliente;
END$$

DROP PROCEDURE IF EXISTS `spu_actualizar_linea`$$
CREATE PROCEDURE `spu_actualizar_linea` (IN `p_id_caja` INT, IN `p_coordenadas` JSON, IN `p_id_user_create` INT)   BEGIN
  IF (p_id_caja = -1) THEN
    UPDATE tb_lineas
    SET coordenadas = p_coordenadas,
        update_at = NOW(),
        iduser_create = p_id_user_create
    WHERE id_linea = 1;
  ELSE
    UPDATE tb_lineas
    SET coordenadas = p_coordenadas,
        update_at = NOW(),
        iduser_create = p_id_user_create
    WHERE id_caja = p_id_caja;
  END IF;
END$$

DROP PROCEDURE IF EXISTS `spu_antenas_listar`$$
CREATE PROCEDURE `spu_antenas_listar` ()   BEGIN
  SELECT
        id_antena,
        id_distrito, 
        nombre, 
        descripcion,
        coordenadas, 
        direccion, 
        create_at
  FROM tb_antenas 
  WHERE inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_antenas_registrar`$$
CREATE PROCEDURE `spu_antenas_registrar` (IN `p_id_distrito` INT, IN `p_nombre` VARCHAR(60), IN `p_descripcion` VARCHAR(100), IN `p_coordenadas` VARCHAR(50), IN `p_direccion` VARCHAR(200), IN `p_iduser` INT)   BEGIN
  INSERT INTO tb_antenas (id_distrito, nombre, descripcion, coordenadas, direccion, iduser_create)
  VALUES (p_id_distrito, p_nombre, p_descripcion, p_coordenadas, p_direccion, p_iduser);
END$$

DROP PROCEDURE IF EXISTS `spu_antena_inhabilitar`$$
CREATE PROCEDURE `spu_antena_inhabilitar` (IN `p_id_antena` INT, IN `p_iduser` INT)   BEGIN
  UPDATE tb_antenas 
  SET iduser_inactive = p_iduser, 
      inactive_at = NOW() 
  WHERE id_antena = p_id_antena;
END$$

DROP PROCEDURE IF EXISTS `spu_averias_contratos_listar`$$
CREATE PROCEDURE `spu_averias_contratos_listar` (IN `p_id_contrato` INT)   BEGIN
    SELECT 
        s.id_soporte,
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
    WHERE 
        s.id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_base_listar`$$
CREATE PROCEDURE `spu_base_listar` ()   BEGIN
    SELECT id_base, nombre_base FROM tb_base;
END$$

DROP PROCEDURE IF EXISTS `spu_buscar_cajas_sector_idCaja`$$
CREATE PROCEDURE `spu_buscar_cajas_sector_idCaja` (IN `p_id_caja` INT)   BEGIN
  DECLARE idSector INT;
  SELECT id_sector INTO idSector FROM tb_cajas WHERE id_caja = p_id_caja;
  SELECT id_caja, nombre, numero_entradas coordenadas FROM tb_cajas WHERE id_sector = idSector AND numero_entradas > 0;
END$$

DROP PROCEDURE IF EXISTS `spu_buscar_caja_id`$$
CREATE PROCEDURE `spu_buscar_caja_id` (IN `p_id_caja` INT)   BEGIN
  SELECT 
    id_caja, 
    nombre,
    id_sector
  FROM tb_cajas 
  WHERE id_caja = p_id_caja;
END$$

DROP PROCEDURE IF EXISTS `spu_buscar_datos_cliente_id`$$
CREATE PROCEDURE `spu_buscar_datos_cliente_id` (`p_id_cliente` INT)   BEGIN
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

DROP PROCEDURE IF EXISTS `spu_buscar_distrito`$$
CREATE PROCEDURE `spu_buscar_distrito` (IN `p_id_provincia` INT)   BEGIN
    SELECT 
        id_distrito, 
        distrito,
        limites
    FROM 
        tb_distritos
    WHERE 
        id_provincia = p_id_provincia;
END$$

DROP PROCEDURE IF EXISTS `spu_buscar_ficha_por_dni`$$
CREATE PROCEDURE `spu_buscar_ficha_por_dni` (IN `p_dni` VARCHAR(20), IN `p_servicio` VARCHAR(10), IN `p_coordenada` VARCHAR(50))   BEGIN
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
CREATE PROCEDURE `spu_cajas_listar` ()   BEGIN
  SELECT 
    id_caja, 
    nombre, 
    descripcion, 
    numero_entradas, 
    id_sector, 
    coordenadas 
  FROM tb_cajas WHERE inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_cajas_registrar`$$
CREATE PROCEDURE `spu_cajas_registrar` (IN `p_nombre` VARCHAR(30), IN `p_descripcion` VARCHAR(100), IN `p_numero_entradas` TINYINT, IN `p_id_sector` INT, IN `p_coordenadas` VARCHAR(50), IN `p_iduser_create` INT)   BEGIN
  INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_sector, coordenadas, iduser_create)
  VALUES(p_nombre, p_descripcion, p_numero_entradas, p_id_sector, p_coordenadas, p_iduser_create);

  SET @last_id := LAST_INSERT_ID();

  SELECT 
    id_caja, 
    nombre, 
    descripcion, 
    numero_entradas, 
    id_sector, 
    coordenadas 
  FROM tb_cajas
  WHERE id_caja = @last_id;
END$$

DROP PROCEDURE IF EXISTS `spu_caja_eliminar`$$
CREATE PROCEDURE `spu_caja_eliminar` (IN `p_id_caja` INT, IN `p_id_user` INT)   BEGIN
  UPDATE tb_lineas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_caja = p_id_caja;
  UPDATE tb_cajas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_caja = p_id_caja;
END$$

DROP PROCEDURE IF EXISTS `spu_caja_uso`$$
CREATE PROCEDURE `spu_caja_uso` (IN `p_id_caja` INT)   BEGIN
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN TRUE
      ELSE FALSE
    END as uso 
  FROM tb_contratos 
  WHERE JSON_EXTRACT(ficha_instalacion, '$.idcaja') = p_id_caja;
END$$

DROP PROCEDURE IF EXISTS `spu_cargar_cliente_por_dniPersona`$$
CREATE PROCEDURE `spu_cargar_cliente_por_dniPersona` (IN `numero_documento` VARCHAR(15), IN `direccion` VARCHAR(250), IN `referencia` VARCHAR(250), IN `coordenadas` VARCHAR(50), IN `iduser_create` INT)   BEGIN
    DECLARE id_persona_encontrada INT;
    DECLARE exit HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    SELECT id_persona INTO id_persona_encontrada
    FROM tb_personas 
    WHERE nro_doc = numero_documento
    LIMIT 1;

    IF id_persona_encontrada IS NULL THEN
        ROLLBACK;
    ELSE
        INSERT INTO tb_clientes (id_persona, direccion, referencia, coordenadas, iduser_create) 
        VALUES (id_persona_encontrada, direccion, referencia, coordenadas, iduser_create);
        COMMIT;
    END IF;

END$$

DROP PROCEDURE IF EXISTS `spu_clientesPersonas_actualizar`$$
CREATE PROCEDURE `spu_clientesPersonas_actualizar` (`p_apellidos` VARCHAR(80), `p_nombres` VARCHAR(80), `p_telefono` CHAR(9), `p_email` VARCHAR(100), `p_direccion` VARCHAR(250), `p_referencia` VARCHAR(150), `p_coordenadas` VARCHAR(50), `p_iduser_update` INT, `p_id_persona` INT)   BEGIN
    SET p_email = CASE WHEN p_email = '' THEN NULL ELSE p_email END;

    UPDATE tb_personas
    SET
        apellidos = p_apellidos,
        nombres = p_nombres,
        telefono = p_telefono,
        email = p_email,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_persona = p_id_persona;
    UPDATE tb_clientes tc
    INNER JOIN tb_personas tp ON tc.id_persona = tp.id_persona
    SET
        tc.direccion = p_direccion,
        tc.referencia = p_referencia,
        tc.coordenadas = p_coordenadas,
        tc.update_at = NOW(),
        tc.iduser_update = p_iduser_update
    WHERE tp.id_persona = p_id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_clientes_eliminar`$$
CREATE PROCEDURE `spu_clientes_eliminar` (`p_identificador` VARCHAR(15), `p_iduser_inactive` INT)   BEGIN
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

DROP PROCEDURE IF EXISTS `spu_clientes_por_IdPersona`$$
CREATE PROCEDURE `spu_clientes_por_IdPersona` (IN `p_id_persona` INT)   BEGIN
    SELECT
        p.id_persona,
        p.nombres,
        p.apellidos,
        p.nro_doc AS identificador_cliente,
        p.telefono,
        p.email,
        c.direccion,
        c.referencia,
        c.coordenadas,
        c.id_cliente
    FROM tb_personas p
    LEFT JOIN tb_clientes c ON c.id_persona = p.id_persona
    WHERE p.id_persona = p_id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_clientes_registrar`$$
CREATE PROCEDURE `spu_clientes_registrar` (`p_id_persona` INT, `p_id_empresa` INT, `p_direccion` VARCHAR(50), `p_referencia` VARCHAR(150), `p_iduser_create` INT, `p_coordenadas` VARCHAR(50))   BEGIN
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
CREATE PROCEDURE `spu_cliente_buscar_NombreApp` (IN `p_nombre` VARCHAR(50), IN `p_apellido` VARCHAR(50))   BEGIN
    IF p_apellido = '' THEN
        SELECT codigo_cliente, nombre_cliente, telefono_cliente
        FROM vw_clientes_obtener
        WHERE nombre_cliente LIKE CONCAT('%', p_nombre, '%');
    ELSE
        SELECT codigo_cliente, nombre_cliente, telefono_cliente
        FROM vw_clientes_obtener
        WHERE nombre_cliente LIKE CONCAT('%', p_nombre, '%')
          AND nombre_cliente LIKE CONCAT('%', p_apellido, '%');
    END IF;
END$$

DROP PROCEDURE IF EXISTS `spu_cliente_buscar_nrodoc`$$
CREATE PROCEDURE `spu_cliente_buscar_nrodoc` (IN `p_documento` VARCHAR(15))   BEGIN
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
CREATE PROCEDURE `spu_contactabilidad_actualizar` (`p_id_contactabilidad` INT, `p_id_persona` INT, `p_id_paquete` INT, `p_direccion_servicio` VARCHAR(250), `p_nota` TEXT, `p_fecha_limite` DATETIME, `p_iduser_update` INT)   BEGIN
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
CREATE PROCEDURE `spu_contactabilidad_inhabilitar` ()   BEGIN
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
CREATE PROCEDURE `spu_contactabilidad_inhabilitarManual` (`p_id_contactabilidad` INT, `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_contactabilidad
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE
        id_contactabilidad = p_id_contactabilidad;
END$$

DROP PROCEDURE IF EXISTS `spu_contactabilidad_registrar`$$
CREATE PROCEDURE `spu_contactabilidad_registrar` (`p_id_persona` INT, `p_id_empresa` INT, `p_id_paquete` INT, `p_direccion_servicio` VARCHAR(250), `p_nota` TEXT, `p_iduser_create` INT, `p_fecha_limite` DATE)   BEGIN
    INSERT INTO tb_contactabilidad (id_persona, id_empresa, id_paquete, direccion_servicio, nota, iduser_create, fecha_limite)
    VALUES (p_id_persona, p_id_empresa, p_id_paquete, p_direccion_servicio, p_nota, p_iduser_create, p_fecha_limite);
    SELECT LAST_INSERT_ID() AS id_contactabilidad;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_actualizar`$$
CREATE PROCEDURE `spu_contratos_actualizar` (IN `p_id_contrato` INT, IN `p_id_paquete` INT, IN `p_direccion_servicio` VARCHAR(200), IN `p_referencia` VARCHAR(200), IN `p_nota` TEXT, IN `p_fecha_inicio` DATE, IN `p_iduser_update` INT)   BEGIN
    UPDATE tb_contratos
    SET
        id_paquete = p_id_paquete,
        direccion_servicio = p_direccion_servicio,
        referencia = p_referencia,
        nota = p_nota,
        fecha_inicio = p_fecha_inicio,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_buscar_cliente`$$
CREATE PROCEDURE `spu_contratos_buscar_cliente` (IN `p_id_cliente` INT)   BEGIN
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
        c.id_cliente = p_id_cliente AND c.inactive_at IS NULL AND c.ficha_instalacion IS NOT NULL
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
CREATE PROCEDURE `spu_contratos_eliminar` (`p_id_contrato` INT, `p_iduser_inactive` INT)   BEGIN

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
CREATE PROCEDURE `spu_contratos_JsonFichabyId` (IN `p_id_contrato` INT)   BEGIN
    SELECT 
        ficha_instalacion
    FROM 
        tb_contratos
    WHERE 
        id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_pdf`$$
CREATE PROCEDURE `spu_contratos_pdf` (IN `p_id_contrato` INT)   BEGIN
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
        di.distrito AS Distrito,
        CONCAT(pt.nombres, ' ', pt.apellidos) AS NombreTecnico,
        CONCAT(rt.nombres, ' ', rt.apellidos) AS NombreTecnicoFicha,
        co.create_at AS FechaFichaInstalacion
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
    LEFT JOIN 
        tb_responsables r ON co.id_usuario_tecnico = r.id_responsable
    LEFT JOIN 
        tb_usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN 
        tb_personas pt ON u.id_persona = pt.id_persona
    LEFT JOIN 
        tb_responsables rt_responsable ON co.id_usuario_registro = rt_responsable.id_responsable
    LEFT JOIN 
        tb_usuarios rt_usuario ON rt_responsable.id_usuario = rt_usuario.id_usuario
    LEFT JOIN 
        tb_personas rt ON rt_usuario.id_persona = rt.id_persona
    WHERE 
        co.id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contratos_registrar`$$
CREATE PROCEDURE `spu_contratos_registrar` (IN `p_id_cliente` INT, IN `p_id_paquete` INT, IN `p_id_sector` INT, IN `p_direccion_servicio` VARCHAR(200), IN `p_referencia` VARCHAR(200), IN `p_coordenada` VARCHAR(50), IN `p_fecha_inicio` DATE, IN `p_fecha_registro` DATE, IN `p_nota` TEXT, IN `p_ficha_instalacion` JSON, IN `p_iduser_create` INT)   BEGIN
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
        ficha_instalacion,
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
        p_ficha_instalacion,
        p_iduser_create
    );
END$$

DROP PROCEDURE IF EXISTS `spu_contrato_buscar_coordenada`$$
CREATE PROCEDURE `spu_contrato_buscar_coordenada` (IN `p_id_contrato` INT)   BEGIN 
    SELECT 
        c.id_contrato,
        c.coordenada,
        c.direccion_servicio
    FROM 
        tb_contratos c
    WHERE 
        c.id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_contrato_buscar_id`$$
CREATE PROCEDURE `spu_contrato_buscar_id` (`p_id_contrato` INT)   BEGIN
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
CREATE PROCEDURE `spu_descontar_espacio_caja` (IN `p_id_caja` INT)   BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas - 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;

  IF ROW_COUNT() = 0 THEN
      SELECT FALSE AS resultado;
  END IF;
END$$

DROP PROCEDURE IF EXISTS `spu_empresas_actualizar`$$
CREATE PROCEDURE `spu_empresas_actualizar` (`p_ruc` VARCHAR(11), `p_representante_legal` VARCHAR(70), `p_razon_social` VARCHAR(100), `p_nombre_comercial` VARCHAR(100), `p_telefono` CHAR(9), `p_email` VARCHAR(100), `p_iduser_update` INT, `p_id_empresa` INT)   BEGIN
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
CREATE PROCEDURE `spu_empresas_eliminar` (`p_id_empresa` INT, `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_empresas
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_empresa = p_id_empresa;
END$$

DROP PROCEDURE IF EXISTS `spu_empresas_registrar`$$
CREATE PROCEDURE `spu_empresas_registrar` (`p_ruc` VARCHAR(11), `p_representante_legal` VARCHAR(70), `p_razon_social` VARCHAR(100), `p_nombre_comercial` VARCHAR(100), `p_telefono` CHAR(9), `p_email` VARCHAR(100), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_empresas (ruc, representante_legal, razon_social, nombre_comercial, telefono, email, iduser_create) 
    VALUES (p_ruc, p_representante_legal, p_razon_social, p_nombre_comercial, p_telefono, p_email, p_iduser_create);
    
    SELECT LAST_INSERT_ID() AS id_empresa;
END$$

DROP PROCEDURE IF EXISTS `spu_empresa_cliente_existencia`$$
CREATE PROCEDURE `spu_empresa_cliente_existencia` (IN `p_ruc` VARCHAR(15))   BEGIN
    SELECT e.id_empresa, c.id_cliente, e.ruc, e.razon_social FROM
    tb_empresas e LEFT JOIN tb_clientes c ON e.id_empresa = c.id_empresa
    WHERE e.ruc = p_ruc;
END$$

DROP PROCEDURE IF EXISTS `spu_fichatecnica_buscar_id`$$
CREATE PROCEDURE `spu_fichatecnica_buscar_id` (`p_id_contrato` INT)   BEGIN
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
        LEFT JOIN tb_empresas e ON cl.id_empresa = e.id_empresa
        INNER JOIN tb_paquetes t ON c.id_paquete = t.id_paquete
        LEFT JOIN tb_servicios sv ON JSON_CONTAINS(t.id_servicio, JSON_OBJECT('id_servicio', sv.id_servicio))
    WHERE c.id_contrato = p_id_contrato AND c.inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_ficha_tecnica_registrar`$$
CREATE PROCEDURE `spu_ficha_tecnica_registrar` (`p_id_contrato` INT, `p_ficha_instalacion` JSON, `p_id_usuario_registro` INT)   BEGIN
    UPDATE 
    tb_contratos 
    SET ficha_instalacion = p_ficha_instalacion,
    iduser_update = p_id_usuario_registro,
    id_usuario_tecnico = p_id_usuario_registro,
    update_at = NOW()
    WHERE id_contrato = p_id_contrato;
END$$

DROP PROCEDURE IF EXISTS `spu_instalacion_ficha_IdSoporte`$$
CREATE PROCEDURE `spu_instalacion_ficha_IdSoporte` (IN `p_idsoporte` INT)   BEGIN
    SELECT 
        ct.ficha_instalacion,
        ct.id_contrato,
        GROUP_CONCAT(srv.tipo_servicio) AS tipos_servicio,
        GROUP_CONCAT(srv.servicio) AS servicios
    FROM tb_soporte s
    INNER JOIN tb_contratos ct ON s.id_contrato = ct.id_contrato
    INNER JOIN tb_clientes cl ON ct.id_cliente = cl.id_cliente
    INNER JOIN tb_paquetes p ON ct.id_paquete = p.id_paquete
    INNER JOIN tb_servicios srv ON JSON_CONTAINS(
        p.id_servicio,
        CONCAT(
        '{"id_servicio":',
        srv.id_servicio,
        '}'
        )
    )
    WHERE 
        s.id_soporte = p_idsoporte
    GROUP BY ct.id_contrato, ct.create_at;
END$$

DROP PROCEDURE IF EXISTS `spu_kardex_buscar`$$
CREATE PROCEDURE `spu_kardex_buscar` (IN `p_id_producto` INT)   BEGIN
    SELECT * FROM vw_kardex_listar 
    WHERE id_producto = p_id_producto 
    ORDER BY id_kardex DESC;
END$$

DROP PROCEDURE IF EXISTS `spu_kardex_registrar`$$
CREATE PROCEDURE `spu_kardex_registrar` (IN `p_id_almacen` INT, IN `p_id_producto` INT, IN `p_fecha` DATE, IN `p_id_tipooperacion` INT, IN `p_cantidad` INT, IN `p_valor_unitario_historico` DECIMAL(7,2), IN `p_iduser_create` INT)   BEGIN
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

DROP PROCEDURE IF EXISTS `spu_lineas_registrar`$$
CREATE PROCEDURE `spu_lineas_registrar` (IN `p_id_mufa` INT, IN `p_id_caja` INT, IN `p_coordenadas` JSON, IN `p_tipo_linea` CHAR(1), IN `p_iduser_create` INT)   BEGIN
  INSERT INTO tb_lineas(id_mufa, id_caja, coordenadas, tipo_linea, iduser_create)
  VALUES(p_id_mufa, p_id_caja, p_coordenadas, p_tipo_linea, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_listar_tipo_operacion`$$
CREATE PROCEDURE `spu_listar_tipo_operacion` (IN `tipo_movimiento` CHAR(1))   BEGIN
    SELECT id_tipooperacion, descripcion, movimiento 
    FROM tb_tipooperacion 
    WHERE movimiento = tipo_movimiento;
END$$

DROP PROCEDURE IF EXISTS `spu_mufas_listar`$$
CREATE PROCEDURE `spu_mufas_listar` ()   BEGIN
  SELECT id_mufa, nombre, descripcion, coordenadas FROM tb_mufas WHERE inactive_at IS NULL;
END$$

DROP PROCEDURE IF EXISTS `spu_mufa_eliminar`$$
CREATE PROCEDURE `spu_mufa_eliminar` (IN `p_id_mufa` INT, IN `p_id_user` INT)   BEGIN
  UPDATE tb_mufas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_mufa = p_id_mufa;
END$$

DROP PROCEDURE IF EXISTS `spu_mufa_registrar`$$
CREATE PROCEDURE `spu_mufa_registrar` (IN `p_nombre` VARCHAR(30), IN `p_descripcion` VARCHAR(100), IN `p_coordenadas` JSON, IN `p_direccion` VARCHAR(100), IN `p_iduser_create` INT)   BEGIN
  INSERT INTO tb_mufas(nombre, descripcion, coordenadas, direccion, iduser_create)
  VALUES(p_nombre, p_descripcion, p_coordenadas, p_direccion, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_mufa_uso`$$
CREATE PROCEDURE `spu_mufa_uso` (IN `p_id_mufa` INT)   BEGIN
  SELECT
    CASE
      WHEN COUNT(*) > 0 THEN TRUE
      ELSE FALSE
    END as uso
  FROM tb_lineas
  WHERE id_mufa = p_id_mufa;
END$$

DROP PROCEDURE IF EXISTS `spu_paquetes_buscar_servicio`$$
CREATE PROCEDURE `spu_paquetes_buscar_servicio` (IN `p_id_servicio` JSON)   BEGIN
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
CREATE PROCEDURE `spu_paquete_actualizar` (`p_id_paquete` INT, `p_id_servicio` JSON, `p_paquete` VARCHAR(250), `p_precio` DECIMAL(7,2), `p_velocidad` JSON, `p_iduser_update` INT)   BEGIN
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
CREATE PROCEDURE `spu_paquete_buscar_id` (IN `p_id_paquete` INT)   BEGIN
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
CREATE PROCEDURE `spu_paquete_buscar_idServicio` (IN `p_id_servicio` JSON)   BEGIN 
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
CREATE PROCEDURE `spu_paquete_eliminar` (`p_id_paquete` INT, `p_iduser_inactive` INT)   BEGIN
	UPDATE tb_paquetes
    SET 	
		inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
	WHERE 
		id_paquete = p_id_paquete;
END$$

DROP PROCEDURE IF EXISTS `spu_paquete_registrar`$$
CREATE PROCEDURE `spu_paquete_registrar` (IN `p_id_servicio` JSON, IN `p_paquete` VARCHAR(250), IN `p_precio` DECIMAL(7,2), IN `p_velocidad` JSON, IN `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_paquetes (id_servicio, paquete, precio, velocidad, iduser_create) 
    VALUES (p_id_servicio, p_paquete, p_precio, p_velocidad, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_permisos_actualizar_id`$$
CREATE PROCEDURE `spu_permisos_actualizar_id` (`p_id_rol` INT, `p_permisos` JSON, `p_iduser_update` INT)   BEGIN
    UPDATE tb_roles
    SET
        permisos = p_permisos,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_permisos_listar_id`$$
CREATE PROCEDURE `spu_permisos_listar_id` (`p_id_rol` INT)   BEGIN
    SELECT permisos FROM tb_roles
    WHERE id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_actualizar`$$
CREATE PROCEDURE `spu_personas_actualizar` (`p_tipo_doc` CHAR(3), `p_nro_doc` VARCHAR(15), `p_apellidos` VARCHAR(80), `p_nombres` VARCHAR(80), `p_telefono` CHAR(9), `p_nacionalidad` VARCHAR(40), `p_email` VARCHAR(100), `p_iduser_update` INT, `p_id_persona` INT)   BEGIN
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
CREATE PROCEDURE `spu_personas_buscar_dni` (IN `p_dni` VARCHAR(15))   BEGIN
    SELECT id_persona, tipo_doc, nro_doc, apellidos, nombres, telefono, nacionalidad, email
    FROM vw_personas_listar
    WHERE nro_doc = p_dni;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_eliminar`$$
CREATE PROCEDURE `spu_personas_eliminar` (`p_id_persona` INT, `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_personas
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_persona = p_id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_listar_por_id`$$
CREATE PROCEDURE `spu_personas_listar_por_id` (IN `p_id_persona` INT)   BEGIN
    SELECT * FROM tb_personas WHERE id_persona = p_id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_personas_registrar`$$
CREATE PROCEDURE `spu_personas_registrar` (`p_tipo_doc` CHAR(3), `p_nro_doc` VARCHAR(15), `p_apellidos` VARCHAR(80), `p_nombres` VARCHAR(80), `p_telefono` CHAR(9), `p_nacionalidad` VARCHAR(40), `p_email` VARCHAR(100), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, nacionalidad, email, iduser_create) 
    VALUES (p_tipo_doc, p_nro_doc, p_apellidos, p_nombres, p_telefono, p_nacionalidad, NULLIF(p_email,''), p_iduser_create);

    SELECT LAST_INSERT_ID() AS id_persona;
END$$

DROP PROCEDURE IF EXISTS `spu_persona_cliente_existencia`$$
CREATE PROCEDURE `spu_persona_cliente_existencia` (IN `p_dni` VARCHAR(15))   BEGIN
    SELECT p.id_persona, p.nombres, p.apellidos, c.id_cliente 
    FROM tb_personas p 
    LEFT JOIN tb_clientes c ON p.id_persona = c.id_persona
    WHERE p.nro_doc = p_dni;
END$$

DROP PROCEDURE IF EXISTS `spu_productos_actualizar`$$
CREATE PROCEDURE `spu_productos_actualizar` (IN `p_id_producto` INT, IN `p_id_marca` INT, IN `p_id_tipo` INT, IN `p_idUnidad` INT, IN `p_modelo` VARCHAR(30), IN `p_precio_actual` DECIMAL(7,2), IN `p_iduser_update` INT)   BEGIN
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
CREATE PROCEDURE `spu_productos_buscar_barra` (IN `p_codigo_barra` VARCHAR(120))   BEGIN
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
END$$

DROP PROCEDURE IF EXISTS `spu_productos_buscar_barraRepetidor`$$
CREATE PROCEDURE `spu_productos_buscar_barraRepetidor` (IN `p_codigo_barra` VARCHAR(120))   BEGIN
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
        p.inactive_at IS NULL AND t.tipo_nombre = 'Repetidor';
END$$

DROP PROCEDURE IF EXISTS `spu_productos_buscar_barraRouter`$$
CREATE PROCEDURE `spu_productos_buscar_barraRouter` (IN `p_codigo_barra` VARCHAR(120))   BEGIN
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
        p.inactive_at IS NULL AND t.tipo_nombre = 'Router';
END$$

DROP PROCEDURE IF EXISTS `spu_productos_buscar_barraSintonizador`$$
CREATE PROCEDURE `spu_productos_buscar_barraSintonizador` (IN `p_codigo_barra` VARCHAR(120))   BEGIN
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
        p.inactive_at IS NULL AND t.tipo_nombre = 'Sintonizador';
END$$

DROP PROCEDURE IF EXISTS `spu_productos_eliminar`$$
CREATE PROCEDURE `spu_productos_eliminar` (IN `p_id_producto` INT, IN `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_productos 
    SET 
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_producto = p_id_producto;
END$$

DROP PROCEDURE IF EXISTS `spu_productos_registrar`$$
CREATE PROCEDURE `spu_productos_registrar` (IN `p_id_marca` INT, IN `p_id_tipo` INT, IN `p_id_unidad` INT, IN `p_modelo` VARCHAR(70), IN `p_precio_actual` DECIMAL(7,2), IN `p_codigo_barra` VARCHAR(120), IN `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_productos (id_marca, id_tipo, id_unidad, modelo, precio_actual, codigo_barra, create_at, iduser_create)
    VALUES (p_id_marca, p_id_tipo, p_id_unidad, p_modelo, p_precio_actual, p_codigo_barra, NOW(), p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_recontar_espacio_caja`$$
CREATE PROCEDURE `spu_recontar_espacio_caja` (IN `p_id_caja` INT)   BEGIN
  UPDATE tb_cajas
  SET numero_entradas = numero_entradas + 1,
      update_at = NOW()
  WHERE id_caja = p_id_caja AND numero_entradas > 0;
END$$

DROP PROCEDURE IF EXISTS `spu_registrar_fichasoporte`$$
CREATE PROCEDURE `spu_registrar_fichasoporte` (IN `p_id_contrato` INT, IN `p_id_tecnico` INT, IN `p_fecha_hora_solicitud` DATETIME, IN `p_descripcion_problema` TEXT, IN `p_descripcion_solucion` TEXT, IN `p_prioridad` VARCHAR(50), IN `p_iduser_create` INT)   BEGIN
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
CREATE PROCEDURE `spu_responsablesUsuarios_actualizar` (IN `p_iduser_update` INT, IN `p_id_rol` INT, IN `p_id_responsable` INT)   BEGIN
    UPDATE tb_responsables
    SET 
        id_rol = p_id_rol,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE 
        p_id_responsable = id_responsable;
END$$

DROP PROCEDURE IF EXISTS `spu_responsables_eliminar`$$
CREATE PROCEDURE `spu_responsables_eliminar` (IN `p_iduser_inactive` INT, IN `p_id_responsable` INT)   BEGIN
    UPDATE tb_responsables
    SET 
        user_inactive = p_iduser_inactive,
        fecha_fin = NOW()
    WHERE 
        p_id_responsable = id_responsable;
END$$

DROP PROCEDURE IF EXISTS `spu_responsables_registrar`$$
CREATE PROCEDURE `spu_responsables_registrar` (IN `p_id_usuario` INT, IN `p_id_rol` INT, IN `p_fecha_inicio` DATETIME, IN `p_iduser_create` INT)   BEGIN
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
CREATE PROCEDURE `spu_roles_activar` (`p_id_rol` INT, `p_iduser_update` INT)   BEGIN
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
CREATE PROCEDURE `spu_roles_actualizar` (`p_id_rol` INT, `p_rol` VARCHAR(30), `p_iduser_update` INT)   BEGIN
    UPDATE tb_roles
    SET 
        rol = p_rol,
        iduser_update = p_iduser_update,
        update_at = NOW()
    WHERE
        id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_roles_eliminar`$$
CREATE PROCEDURE `spu_roles_eliminar` (`p_id_rol` INT, `p_iduser_inactive` INT)   BEGIN 
    UPDATE tb_roles
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE
        id_rol = p_id_rol;
END$$

DROP PROCEDURE IF EXISTS `spu_roles_registrar`$$
CREATE PROCEDURE `spu_roles_registrar` (`p_rol` VARCHAR(30), `p_permisos` JSON, `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_roles (rol, permisos, iduser_create)
    VALUES (p_rol, p_permisos, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_sectores_actualizar_id`$$
CREATE PROCEDURE `spu_sectores_actualizar_id` (IN `p_id_sector` INT, IN `p_id_distrito` INT, IN `p_sector` VARCHAR(60), IN `p_iduser_update` INT)   BEGIN
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
CREATE PROCEDURE `spu_sectores_registrar` (`p_id_distrito` INT, `p_sector` VARCHAR(60), `p_descripcion` VARCHAR(100), `p_coordenadas` VARCHAR(100), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_sectores (id_distrito, sector,descripcion,coordenadas, iduser_create)
    VALUES (p_id_distrito, p_sector,p_descripcion,p_coordenadas, p_iduser_create);
END$$

DROP PROCEDURE IF EXISTS `spu_sector_desactivar`$$
CREATE PROCEDURE `spu_sector_desactivar` (IN `p_id_sector` INT, IN `p_id_user` INT)   BEGIN
  UPDATE tb_cajas SET inactive_at = NOW(), iduser_update = p_id_user WHERE id_sector = p_id_sector;
END$$

DROP PROCEDURE IF EXISTS `spu_servicio_actualizar`$$
CREATE PROCEDURE `spu_servicio_actualizar` (IN `p_id_servicio` INT, IN `p_tipo_servicio` CHAR(4), IN `p_servicio` VARCHAR(50), IN `p_iduser_update` INT)   BEGIN
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
CREATE PROCEDURE `spu_servicio_eliminar` (IN `p_id_servicio` INT, IN `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_servicios 
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE 
        id_servicio = p_id_servicio;
END$$

DROP PROCEDURE IF EXISTS `spu_servicio_reactivar`$$
CREATE PROCEDURE `spu_servicio_reactivar` (IN `p_id_servicio` INT, IN `p_iduser_update` INT)   BEGIN
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
CREATE PROCEDURE `spu_servicio_registrar` (IN `p_tipo_servicio` CHAR(4), IN `p_servicio` VARCHAR(50), IN `p_iduser_create` INT)   BEGIN 
    INSERT INTO tb_servicios (tipo_servicio, servicio, iduser_create) 
    VALUES (p_tipo_servicio, p_servicio, p_iduser_create); 
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_actualizar`$$
CREATE PROCEDURE `spu_soporte_actualizar` (IN `p_id_soporte` INT, IN `p_id_tecnico` INT, IN `p_fecha_hora_asistencia` DATETIME, IN `p_soporte` JSON, IN `p_iduser_update` INT, IN `p_procedimiento_S` TEXT)   BEGIN
    UPDATE tb_soporte
    SET
        id_tecnico = p_id_tecnico,
        fecha_hora_asistencia = p_fecha_hora_asistencia,
        soporte = p_soporte,
        update_at = NOW(),
        iduser_update = p_iduser_update,
        descripcion_solucion = p_procedimiento_S
    WHERE id_soporte = p_id_soporte;
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_CompletarbyId`$$
CREATE PROCEDURE `spu_soporte_CompletarbyId` (IN `p_id_soporte` INT, IN `p_iduser_update` INT)   BEGIN
    UPDATE tb_soporte
    SET
        estaCompleto = 1,
        update_at = NOW(),
        iduser_update = p_iduser_update
    WHERE id_soporte = p_id_soporte;
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_eliminarbyId`$$
CREATE PROCEDURE `spu_soporte_eliminarbyId` (IN `p_id_soporte` INT, IN `p_iduser_inactive` INT)   BEGIN
    UPDATE tb_soporte
    SET
        inactive_at = NOW(),
        iduser_inactive = p_iduser_inactive
    WHERE id_soporte = p_id_soporte;
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_filtrar_prioridad`$$
CREATE PROCEDURE `spu_soporte_filtrar_prioridad` (IN `p_prioridad` VARCHAR(50))   BEGIN
    SELECT
        s.id_soporte,
        c.coordenada,
        c.id_sector,
        sct.sector,
        s.fecha_hora_solicitud,
        s.fecha_hora_asistencia,
        c.direccion_servicio,
        s.prioridad,
        s.soporte,
        s.descripcion_problema,
        s.descripcion_solucion,
        c.id_cliente,
        CASE
            WHEN cl.id_persona IS NOT NULL THEN CONCAT(p_cliente.nombres, ' ', p_cliente.apellidos)
            WHEN cl.id_empresa IS NOT NULL THEN e.razon_social
        END AS nombre_cliente,
        c.direccion_servicio,
        r.id_usuario AS id_tecnico,
        CONCAT(p_tecnico.nombres, ' ', p_tecnico.apellidos) AS nombre_tecnico,
        GROUP_CONCAT(DISTINCT srv.tipo_servicio) AS tipos_servicio,
        GROUP_CONCAT(DISTINCT srv.servicio) AS servicios
    FROM
        tb_soporte s
        LEFT JOIN tb_contratos c ON s.id_contrato = c.id_contrato
        INNER JOIN tb_sectores sct ON c.id_sector = sct.id_sector
        LEFT JOIN tb_responsables r ON s.id_tecnico = r.id_responsable
        LEFT JOIN tb_usuarios u ON r.id_usuario = u.id_usuario
        LEFT JOIN tb_personas p_tecnico ON u.id_persona = p_tecnico.id_persona
        LEFT JOIN tb_clientes cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN tb_personas p_cliente ON cl.id_persona = p_cliente.id_persona
        LEFT JOIN tb_empresas e ON cl.id_empresa = e.id_empresa
        INNER JOIN tb_paquetes p ON c.id_paquete = p.id_paquete
        INNER JOIN tb_servicios srv ON JSON_CONTAINS(
            p.id_servicio,
            CONCAT(
                '{"id_servicio":',
                srv.id_servicio,
                '}'
            )
        )
    WHERE
        c.inactive_at IS NULL
        AND s.estaCompleto != 1
        AND (p_prioridad = "" OR s.prioridad = p_prioridad)
        AND s.inactive_at IS NULL
    GROUP BY
        s.id_soporte;
END$$

DROP PROCEDURE IF EXISTS `spu_soporte_pdf`$$
CREATE PROCEDURE `spu_soporte_pdf` (IN `p_id_soporte` INT)   BEGIN
    SELECT 
        s.id_soporte,
        s.id_contrato,
        pa.paquete,
        cl.id_cliente AS IdCliente,
        IFNULL(CONCAT(p.nombres, ' ', p.apellidos), e.razon_social) AS NombreCliente,
        IFNULL(p.nro_doc, e.ruc) AS NumeroDocumento,
        IFNULL(p.email, e.email) AS Correo,
        IFNULL(p.telefono, e.telefono) AS Telefono,
        cl.direccion AS DireccionPersona,
        se.sector AS SectorCliente, 
        s.id_tecnico,
        CONCAT(pt.nombres, ' ', pt.apellidos) AS NombreTecnico,
        s.descripcion_problema,
        s.descripcion_solucion,
        s.estaCompleto,
        s.prioridad,
        s.create_at,
        s.soporte AS FichaAveria
    FROM 
        tb_soporte s
    JOIN 
        tb_contratos co ON s.id_contrato = co.id_contrato
    JOIN 
        tb_clientes cl ON co.id_cliente = cl.id_cliente
    LEFT JOIN 
        tb_personas p ON cl.id_persona = p.id_persona
    LEFT JOIN 
        tb_empresas e ON cl.id_empresa = e.id_empresa
    LEFT JOIN 
        tb_responsables r ON s.id_tecnico = r.id_responsable
    LEFT JOIN 
        tb_personas pt ON r.id_usuario = pt.id_persona
    LEFT JOIN 
        tb_paquetes pa ON co.id_paquete = pa.id_paquete
    LEFT JOIN 
        tb_sectores se ON co.id_sector = se.id_sector 
    WHERE 
        s.id_soporte = p_id_soporte;
END$$

DROP PROCEDURE IF EXISTS `spu_subBase_por_base`$$
CREATE PROCEDURE `spu_subBase_por_base` (`p_id_base` INT)   BEGIN
    SELECT id_sub_base, nombre_sub_base
    FROM tb_subbase
    WHERE id_base = p_id_base;
END$$

DROP PROCEDURE IF EXISTS `spu_usuarios_login`$$
CREATE PROCEDURE `spu_usuarios_login` (`p_nombre_user` VARCHAR(100))   BEGIN
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
CREATE PROCEDURE `spu_usuarios_registrar` (`p_id_persona` INT, `p_nombre_user` VARCHAR(100), `p_pass` VARCHAR(60), `p_iduser_create` INT)   BEGIN
    INSERT INTO tb_usuarios(id_persona, nombre_user, pass, iduser_create) 
    VALUES (p_id_persona, p_nombre_user, p_pass, p_iduser_create);
    
    SELECT LAST_INSERT_ID() AS id_usuario;
END$$

DROP PROCEDURE IF EXISTS `spu_usuario_actualizar`$$
CREATE PROCEDURE `spu_usuario_actualizar` (IN `p_nombre_user` VARCHAR(100), IN `p_pass` CHAR(60), IN `p_iduser_update` INT, IN `p_id_usuario` INT)   BEGIN
	UPDATE tb_usuarios
	SET nombre_user = p_nombre_user,
		pass = p_pass,
		update_at = NOW(),
		iduser_update = p_iduser_update
	WHERE id_usuario = p_id_usuario;
END$$

DROP PROCEDURE IF EXISTS `spu_usuario_buscar_username`$$
CREATE PROCEDURE `spu_usuario_buscar_username` (IN `p_username` VARCHAR(100))   BEGIN
	SELECT nombre_user FROM tb_usuarios 
    WHERE nombre_user = p_username;
END$$

DROP PROCEDURE IF EXISTS `sp_usuario_eliminar`$$
CREATE PROCEDURE `sp_usuario_eliminar` (IN `p_id_usuario` INT, IN `p_iduser_inactive` INT)   BEGIN
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
) ENGINE=InnoDB AUTO_INCREMENT=3;

--
-- Volcado de datos para la tabla `tb_almacen`
--

INSERT INTO `tb_almacen` (`id_almacen`, `nombre_almacen`, `ubicacion`, `coordenada`, `inactive_at`, `iduser_inactive`, `create_at`, `update_at`, `iduser_create`, `iduser_update`) VALUES
(1, 'Almacen-Sunampe', 'Av 123', '-13.415960344185644, -76.13418174072265', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(2, 'Almacen-Grocio', 'Av 123456', '-13.427602649212902, -76.13979326342246', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_antenas`
--

DROP TABLE IF EXISTS `tb_antenas`;
CREATE TABLE IF NOT EXISTS `tb_antenas` (
  `id_antena` int(11) NOT NULL AUTO_INCREMENT,
  `id_distrito` int(11) NOT NULL,
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
  PRIMARY KEY (`id_antena`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `anten_uk_antena` (`nombre`),
  KEY `fk_sector_antena` (`id_distrito`)
) ENGINE=InnoDB AUTO_INCREMENT=3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_base`
--

DROP TABLE IF EXISTS `tb_base`;
CREATE TABLE IF NOT EXISTS `tb_base` (
  `id_base` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_base` varchar(50) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_base`),
  UNIQUE KEY `uk_base` (`nombre_base`)
) ENGINE=InnoDB AUTO_INCREMENT=6;

--
-- Volcado de datos para la tabla `tb_base`
--

INSERT INTO `tb_base` (`id_base`, `nombre_base`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'Chincha', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(2, 'Pueblo Nuevo', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(3, 'Grocio Prado', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(4, 'Tambo de Mora', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(5, 'Sunampe', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_cajas`
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
  UNIQUE KEY `nombre` (`nombre`),
  KEY `caja_fk_id_sector` (`id_sector`)
) ENGINE=InnoDB AUTO_INCREMENT=179;

--
-- Volcado de datos para la tabla `tb_cajas`
--

INSERT INTO `tb_cajas` (`id_caja`, `nombre`, `descripcion`, `numero_entradas`, `id_sector`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'SN-ZSTFE-01-16', 'Caja 1', 16, 5, '-13.429921783880777,-76.17494600116132', '2025-02-06 16:48:04', NULL, NULL, 1, NULL, NULL),
(2, 'SN-ZSTFE-02-16', 'Santa fe', 16, 5, '-13.4299821448565,-76.17492463503565', '2025-02-06 16:53:14', NULL, NULL, 1, NULL, NULL),
(3, 'SN-ZSTFE-03-16', 'bajada socorro', 16, 5, '-13.430125827789597,-76.17565177603981', '2025-02-06 16:54:10', NULL, NULL, 1, NULL, NULL),
(4, 'SN-ZSTFE-04-16', 'Baja Socorro', 16, 5, '-13.430355020042235,-76.17656661502566', '2025-02-06 17:01:39', NULL, NULL, 1, NULL, NULL),
(5, 'SN-ZSTFE-05-16', 'Sta Teresa', 16, 5, '-13.427437956759812,-76.17497433761412', '2025-02-06 17:03:06', NULL, NULL, 1, NULL, NULL),
(6, 'SN-ZSTFE-06-16', 'Av. los Jazmines', 16, 5, '-13.42570407020543,-76.17384731251043', '2025-02-06 17:08:27', NULL, NULL, 1, NULL, NULL),
(7, 'SN-ZSTFE-07-16', 'Av. la primavera', 16, 5, '-13.42402091324064,-76.1732447508896', '2025-02-06 17:09:37', NULL, NULL, 1, NULL, NULL),
(8, 'SN-ZSTFE-08-16', 'La tienda Lactea', 16, 5, '-13.42777241713813,-76.17422998058001', '2025-02-06 17:11:21', NULL, NULL, 1, NULL, NULL),
(9, 'ENLACE-LIMA-007-16', 'Por Pollo Rico', 16, 6, '-13.429544454071744,-76.169934307804', '2025-02-06 17:25:36', NULL, NULL, 1, NULL, NULL),
(10, 'SN-ZLIMA-01-16', 'Calle Lima', 16, 6, '-13.42733478042149,-76.16730023502598', '2025-02-07 16:37:00', NULL, NULL, 1, NULL, NULL),
(11, 'SN-ZLIMA-02-16', 'Calle Lima', 16, 6, '-13.42645212064318,-76.16823597657066', '2025-02-07 16:38:22', NULL, NULL, 1, NULL, NULL),
(12, 'SN-ZLIMA-03-16', 'Calle Lima', 16, 6, '-13.426965901649798,-76.16574831230929', '2025-02-07 16:39:24', NULL, NULL, 1, NULL, NULL),
(13, 'SN-ZLIMA-04-16', 'Parque de Juegos', 16, 6, '-13.426298635323759,-76.16503399163575', '2025-02-07 16:41:37', NULL, NULL, 1, NULL, NULL),
(14, 'SN-ZLIMA-05-16', 'El dulce Bicicentro', 16, 6, '-13.42600313230086,-76.16660472869587', '2025-02-07 16:43:51', NULL, NULL, 1, NULL, NULL),
(15, 'SN-ZLIMA-06-16', 'Av. Grande', 16, 6, '-13.424568596158336,-76.16758836841433', '2025-02-07 16:46:10', NULL, NULL, 1, NULL, NULL),
(16, 'SN-ZSIMO-01-16', 'Av. Tupac Amaru', 16, 6, '-13.428308777565869,-76.1639939648581', '2025-02-07 16:49:15', NULL, NULL, 1, NULL, NULL),
(17, 'SN-ZSIMO-02-16', 'Av. Tupac Amaru', 16, 7, '-13.427735449637003,-76.162486577768', '2025-02-07 16:52:21', NULL, NULL, 1, NULL, NULL),
(18, 'SN-ZSIMO-03-16', 'Calle 9 de Diciembre', 16, 7, '-13.427035809884648,-76.1627835314827', '2025-02-07 16:53:19', NULL, NULL, 1, NULL, NULL),
(19, 'SN-ZSIMO-06-16', 'Calle 22 de Diciembre', 16, 7, '-13.430334583783168,-76.16505395980302', '2025-02-07 16:55:30', NULL, NULL, 1, NULL, NULL),
(20, 'SN-ZSIMO-04-16', 'Av. Monterico', 8, 7, '-13.42985655987614,-76.16362105846564', '2025-02-07 16:56:50', NULL, NULL, 1, NULL, NULL),
(21, 'SN-ZSIMO-05-16', 'Calle San Nicolas', 16, 7, '-13.433336446147615,-76.16393358938441', '2025-02-07 17:05:01', '2025-03-04 10:00:10', NULL, 1, NULL, NULL),
(22, 'SN-ZHUGR-01-16', 'Calle San Jose', 16, 8, '-13.429870021276917,-76.16007055801217', '2025-02-07 17:08:19', NULL, NULL, 1, NULL, NULL),
(23, 'SN-ZHUGR-02-16', 'Calle San Jose', 16, 8, '-13.429767839054534,-76.15931604402857', '2025-02-07 17:09:54', NULL, NULL, 1, NULL, NULL),
(24, 'SN-ZHUGR-03-16', 'Intersacción', 16, 8, '-13.42933460393575,-76.15653095697792', '2025-02-07 17:11:24', NULL, NULL, 1, NULL, NULL),
(25, 'SN-ZHUGR-05-16', 'Av. Huaca Grande', 16, 8, '-13.427584139331747,-76.15663652320269', '2025-02-07 17:13:13', NULL, NULL, 1, NULL, NULL),
(26, 'SN-ZHUGR-04-16', 'Calle. Nazareno', 16, 8, '-13.429204208723482,-76.15554628538325', '2025-02-07 17:15:33', NULL, NULL, 1, NULL, NULL),
(27, 'SN-ZCOLG-001-16', 'Av. Fatima', 14, 1, '-13.426374204847662,-76.15954266112254', '2025-02-07 17:19:23', '2025-02-24 18:58:59', NULL, 1, NULL, NULL),
(28, 'SN-ZCOLG-002-16', 'Carretera Sunampe', 15, 1, '-13.42547264097679,-76.15915770645812', '2025-02-07 17:52:26', '2025-03-01 12:48:26', NULL, 1, NULL, NULL),
(29, 'SN-ZCOLG-003-16', 'Asambreas de Dios', 16, 1, '-13.425590273643117,-76.15849505063193', '2025-02-07 17:53:24', NULL, NULL, 1, NULL, NULL),
(30, 'SN-ZCOLG-004-16', 'Av Huaca Grande', 16, 1, '-13.425650929193075,-76.15700835556312', '2025-02-07 17:54:17', NULL, NULL, 1, NULL, NULL),
(31, 'SN-ZSTRO-002-16', 'Pasaje de Gomez', 16, 2, '-13.424505931248174,-76.15540441936172', '2025-02-07 17:56:43', NULL, NULL, 1, NULL, NULL),
(32, 'SN-ZSTRO-001-16', 'Av el Porvenir', 16, 2, '-13.423822367870782,-76.15688045607511', '2025-02-07 17:58:30', NULL, NULL, 1, NULL, NULL),
(33, 'NAP_LALAMEDA-16', 'El hopedaje Cascabel', 16, 2, '-13.421191891022174,-76.1595650177472', '2025-02-07 18:00:27', NULL, NULL, 1, NULL, NULL),
(34, 'SN-ZSTRO-004-16', 'Calle San Ignasio', 16, 3, '-13.42020440710891,-76.15601988973823', '2025-02-07 18:02:02', NULL, NULL, 1, NULL, NULL),
(35, 'SN-ZSIGN-006-16', 'Jr Los Pinos', 16, 3, '-13.41924838666237,-76.15279166669748', '2025-02-07 23:40:00', NULL, NULL, 1, NULL, NULL),
(36, 'SN-ZSIGN-007-16', 'Av Huascar', 16, 3, '-13.420076112172781,-76.1512025684645', '2025-02-07 23:41:00', NULL, NULL, 1, NULL, NULL),
(37, 'SN-ZSIGN-008-16', 'Av San Antonio', 17, 3, '-13.421296988362371,-76.15168459391317', '2025-02-07 23:42:05', '2025-02-27 18:36:20', NULL, 1, NULL, NULL),
(38, 'SN-ZSIGN-001-16', 'Calle San Francisco', 16, 3, '-13.417702534694131,-76.15256066236635', '2025-02-07 23:43:14', NULL, NULL, 1, NULL, NULL),
(39, 'SN-ZSIGN-004-16', 'Av Santa Rosa', 16, 3, '-13.417704789843706,-76.15355453231531', '2025-02-07 23:44:04', NULL, NULL, 1, NULL, NULL),
(40, 'SN-ZSIGN-002-16', 'Pasaje Chumpi', 16, 3, '-13.41631797563302,-76.15270985687364', '2025-02-07 23:45:21', NULL, NULL, 1, NULL, NULL),
(41, 'SN-ZSIGN-003-16', 'Carretera Sunampe', 16, 3, '-13.416449375984651,-76.1554683428218', '2025-02-07 23:47:49', NULL, NULL, 1, NULL, NULL),
(42, 'SN-ZSIGN-005-16', 'Calle Nueva', 16, 4, '-13.417302231591083,-76.1511559056006', '2025-02-07 23:48:51', NULL, NULL, 1, NULL, NULL),
(43, 'SN-ZVLJU-004-16', 'Pasaje los laureles', 16, 4, '-13.41690392623234,-76.14802484866465', '2025-02-07 23:51:10', NULL, NULL, 1, NULL, NULL),
(44, 'SN-ZVLJU-006-16', 'Pasaje Villa Julia', 16, 4, '-13.41425523502112,-76.14849549990548', '2025-02-07 23:53:04', NULL, NULL, 1, NULL, NULL),
(45, 'SN-ZVLJU-005-16', 'Pasaje Divino Misericordia', 16, 4, '-13.416048345107448,-76.14516180518561', '2025-02-07 23:58:24', NULL, NULL, 1, NULL, NULL),
(46, 'SN-ZVLJU-001-16', 'Fundo Lourdes', 16, 4, '-13.417807830976205,-76.1478759569314', '2025-02-07 23:59:53', NULL, NULL, 1, NULL, NULL),
(47, 'SN-ZVLJU-007-16', 'Avenida San Cristobal', 16, 4, '-13.417668329433338,-76.14679260840332', '2025-02-08 00:00:43', NULL, NULL, 1, NULL, NULL),
(48, 'SN-ZVLJU-008-16', 'Puerto Pizarro', 16, 4, '-13.418424646716032,-76.14622230274585', '2025-02-08 00:01:43', NULL, NULL, 1, NULL, NULL),
(49, 'SN-ZPAISO-002-16', 'Avenida Paraiso', 16, 9, '-13.419933947893377,-76.16435981461203', '2025-02-08 00:09:42', NULL, NULL, 1, NULL, NULL),
(50, 'SN-ZPAISO-003-16', 'Avenida Paraiso', 16, 9, '-13.420477118400061,-76.16601048359009', '2025-02-08 00:13:18', NULL, NULL, 1, NULL, NULL),
(51, 'SN-ZPAISO-004-16', 'Paraiso', 16, 9, '-13.42110097370149,-76.16790350232328', '2025-02-08 00:47:09', NULL, NULL, 1, NULL, NULL),
(52, 'SN-ZPAISO-001-16', 'Paraiso', 16, 9, '-13.419239251685408,-76.1623509795231', '2025-02-08 00:48:45', NULL, NULL, 1, NULL, NULL),
(53, 'SN-ZPAISO-005-16', 'Paraiso', 16, 9, '-13.421756060826775,-76.16987500441513', '2025-02-08 00:50:19', NULL, NULL, 1, NULL, NULL),
(54, 'SN-ZPAISO-006-16', 'Paraiso', 16, 9, '-13.422134028787209,-76.17137949940093', '2025-02-08 00:51:40', NULL, NULL, 1, NULL, NULL),
(55, 'SN-ZPAISO-007-16', 'Av La primavera', 16, 9, '-13.423794599136347,-76.16943156315325', '2025-02-08 00:52:52', NULL, NULL, 1, NULL, NULL),
(56, 'SN-ZPAISO-008-16', 'Avenida Primavera', 16, 9, '-13.42394023654972,-76.17104106417763', '2025-02-08 00:54:52', NULL, NULL, 1, NULL, NULL),
(57, 'SN-ZPILP-001-16', 'Av. Paraiso', 16, 10, '-13.418280934164581,-76.16029990188906', '2025-02-08 01:01:11', NULL, NULL, 1, NULL, NULL),
(58, 'SN-ZPILP-002-16', 'Avenida San Pedro', 16, 10, '-13.417426839896217,-76.16199606688939', '2025-02-08 01:03:01', NULL, NULL, 1, NULL, NULL),
(59, 'SN-ZPILP-003-16', 'Cerca del consultorio Divino Niño', 16, 10, '-13.417235446119829,-76.1637502742115', '2025-02-08 01:05:02', NULL, NULL, 1, NULL, NULL),
(60, 'SN-ZPILP-004-16', 'Avenida San Pedro de Pilpa', 16, 10, '-13.416799792110726,-76.16634296984638', '2025-02-08 01:06:51', NULL, NULL, 1, NULL, NULL),
(61, 'SN-ZPILP-005-16', 'Avenida San Pedro de Pilpa', 16, 10, '-13.416391080039519,-76.16858874522177', '2025-02-08 01:09:31', NULL, NULL, 1, NULL, NULL),
(62, 'GP-ZMEJI-001-16', 'Calle Miguel Grau', 16, 11, '-13.409028636830612,-76.16087181298752', '2025-02-08 08:05:28', NULL, NULL, 1, NULL, NULL),
(63, 'GP-ZMEJI-002-16', 'intersección', 16, 11, '-13.408237858157321,-76.1605273671672', '2025-02-08 08:06:14', NULL, NULL, 1, NULL, NULL),
(64, 'GP-ZMEJI-003-16', 'Calle El progreso', 16, 11, '-13.408015946371787,-76.16151107633004', '2025-02-08 08:07:02', NULL, NULL, 1, NULL, NULL),
(65, 'M7-C1-16', 'Av 28 de Julio', 16, 11, '-13.409422152354585,-76.16009761098292', '2025-02-11 09:40:19', NULL, NULL, 1, NULL, NULL),
(66, 'M7-C3-16', 'Panemericana', 16, 11, '-13.41132362413342,-76.1596894862375', '2025-02-11 09:42:28', NULL, NULL, 1, NULL, NULL),
(67, 'M7-C4-16', 'HandsTech Peru', 16, 11, '-13.410747565683629,-76.15863354300126', '2025-02-11 09:44:13', NULL, NULL, 1, NULL, NULL),
(68, 'GP-ZMEJI-004-16', 'Interseccion entre el progreso y NIcolas de Pierola', 16, 11, '-13.407162581588983,-76.16069802397482', '2025-02-11 09:46:30', NULL, NULL, 1, NULL, NULL),
(69, 'GP-ZMEJI-006-16', 'Pasaje Benavides', 15, 11, '-13.404948272558947,-76.1607125594199', '2025-02-11 09:48:27', '2025-02-12 12:18:33', NULL, 1, NULL, NULL),
(70, 'GP-ZMEJI-007-16', 'Final de la ruta', 16, 11, '-13.404731463603946,-76.16155723399454', '2025-02-11 09:50:10', NULL, NULL, 1, NULL, NULL),
(71, 'GP-ZMEJI-008-16', 'Pasaje', 16, 11, '-13.405513984315913,-76.16179537835924', '2025-02-11 09:51:39', NULL, NULL, 1, NULL, NULL),
(72, 'GR_1-16', 'Callle Plaza de Armas', 16, 12, '-13.397604948039714,-76.15751040115717', '2025-02-11 09:56:44', NULL, NULL, 1, NULL, NULL),
(73, 'GR_2-16', 'Mallorca', 16, 12, '-13.39660425334889,-76.16043924379322', '2025-02-11 09:58:25', NULL, NULL, 1, NULL, NULL),
(74, 'CB-ZCBCE-003-16', 'Alva Maurta', 16, 13, '-13.42859813030849,-76.11941242866365', '2025-02-11 10:21:37', NULL, NULL, 1, NULL, NULL),
(75, 'CB-ZCBOR-001-16', 'Alva Maurta', 16, 13, '-13.428736344242354,-76.11818842081185', '2025-02-11 10:22:46', NULL, NULL, 1, NULL, NULL),
(76, 'CB-ZCBOR-002-16', 'Alva Maurta', 16, 13, '-13.428892355661405,-76.11687041193359', '2025-02-11 10:24:32', NULL, NULL, 1, NULL, NULL),
(77, 'CB-ZCBOR-003-16', 'Yoguis Market', 16, 14, '-13.429423874737077,-76.11445473816414', '2025-02-11 10:26:28', NULL, NULL, 1, NULL, NULL),
(79, 'GR_3-16', 'Entre Camino Yataco y San Juan', 16, 12, '-13.395790481408019,-76.16432252478614', '2025-02-11 10:54:59', NULL, NULL, 1, NULL, NULL),
(80, 'GR_4-16', 'Picanteria RestoBar', 16, 12, '-13.39455892975187,-76.16637019539583', '2025-02-11 10:57:54', NULL, NULL, 1, NULL, NULL),
(85, 'PN-ZTEMX-07-16', 'Videnita', 15, 20, '-13.410428685730011,-76.13645358605973', '2025-02-12 12:38:42', NULL, NULL, 1, NULL, NULL),
(86, 'GP-ZPORV-01-16', 'Calle Gonzales', 16, 11, '-13.403658973870964,-76.1589563391492', '2025-02-13 08:41:42', NULL, NULL, 1, NULL, NULL),
(87, 'GP-ZPORV-02-16', 'Calle Gonzales', 16, 11, '-13.40285406866261,-76.16078167526226', '2025-02-13 08:42:38', NULL, NULL, 1, NULL, NULL),
(88, 'GP-ZPORV-03-16', 'El Porvenir', 16, 22, '-13.401873197628264,-76.16272704243768', '2025-02-13 08:45:01', NULL, NULL, 1, NULL, NULL),
(89, 'GP-ZPORV-04-16', 'El Porvenir', 16, 22, '-13.402989281279115,-76.16437573274656', '2025-02-13 08:49:13', NULL, NULL, 1, NULL, NULL),
(90, 'GP-ZPORV-05-16', 'Calle Gonzales', 16, 22, '-13.404114678325497,-76.16420603301982', '2025-02-13 09:39:22', NULL, NULL, 1, NULL, NULL),
(91, 'GP-ZPORV-06-16', 'Interseccion', 16, 22, '-13.404302752364682,-76.16625545461156', '2025-02-13 09:44:43', NULL, NULL, 1, NULL, NULL),
(92, 'GP-ZPORV-08-16', 'Calle Salto de Lomas', 16, 11, '-13.407496203530949,-76.16551888676972', '2025-02-13 09:48:16', NULL, NULL, 1, NULL, NULL),
(93, 'GP-ZPORV-07-16', 'Avenida Carrizo', 16, 22, '-13.402824839429512,-76.16621601026819', '2025-02-13 09:50:57', NULL, NULL, 1, NULL, NULL),
(94, 'CO-ZCOBA-001-16', 'Por la avenida progreso a una cuadra', 15, 24, '-13.435243310619711,-76.11686904987705', '2025-02-13 12:41:07', '2025-02-18 12:03:45', NULL, 1, NULL, NULL),
(105, 'PN-ZSALV-03-16', 'Calle Nueva Jerusalen y francisco Pachas Cruce', 16, 16, '-13.392357318711122,-76.14919365275274', '2025-02-14 14:34:21', NULL, NULL, 1, NULL, NULL),
(106, 'PN-ZSALV-02-16', 'Calle los Cipreces y Sebastian Barranca Cruce', 16, 16, '-13.39215024329061,-76.1474990792468', '2025-02-14 14:35:41', NULL, NULL, 1, NULL, NULL),
(107, 'PN-ZSALV-04-16', 'Cruce de la prolongacion Lima y Los Jazmines', 16, 16, '-13.390181474676144,-76.14618980380452', '2025-02-14 14:37:43', NULL, NULL, 1, NULL, NULL),
(108, 'PN-ZSALV-01-16', 'Jr. Sebastian Barranca, frente a un arbol ', 16, 16, '-13.382913879741157,-76.15373396245266', '2025-02-14 14:40:21', NULL, NULL, 1, NULL, NULL),
(109, 'PN-ZSALV-05-16', 'Calle Pedro Wilca, pasando el parque Fujimori', 16, 16, '-13.396014657430712,-76.14571585118601', '2025-02-14 14:45:03', NULL, NULL, 1, NULL, NULL),
(110, 'PN-ZSALV-06-16', 'Calle Plaza principal, pasando la plaza', 16, 16, '-13.394165693922226,-76.14342823237017', '2025-02-14 14:46:26', NULL, NULL, 1, NULL, NULL),
(111, 'PN-ZSALV-07-16', 'Cruce entre Av.B y Los Pinos', 16, 16, '-13.392717789317453,-76.14246822882725', '2025-02-14 14:48:04', NULL, NULL, 1, NULL, NULL),
(112, 'PN-ZSALV-08-16', 'Prolongacion Cañete frente al parque', 16, 21, '-13.396624058656938,-76.14211366405553', '2025-02-14 15:00:28', NULL, NULL, 1, NULL, NULL),
(113, 'PN-ZTEMX-01-16', 'Jiron Arica', 14, 21, '-13.395425260363789,-76.1382694702351', '2025-02-14 15:01:51', '2025-02-27 12:28:35', NULL, 1, NULL, NULL),
(114, 'PN-ZLAME-01-16', 'Av. 2 de Mayo', 16, 25, '-13.398209009332751,-76.13152126590919', '2025-02-14 15:21:56', NULL, NULL, 1, NULL, NULL),
(115, 'PN-ZLAME-06-16', 'Cerca del cruce entre Av. 2 de Mayo y la Sebastian Barranca', 16, 25, '-13.401223282278917,-76.13245144628341', '2025-02-14 15:24:29', NULL, NULL, 1, NULL, NULL),
(116, 'PN-ZLAME-02-16', 'Jirón los Martines Cruce con Tupac', 16, 25, '-13.395916998768953,-76.13236489951917', '2025-02-14 15:41:14', NULL, NULL, 1, NULL, NULL),
(117, 'PN-ZLAME-03-16', 'Frente al parque 28 de julo', 16, 25, '-13.394343708007403,-76.1317754618287', '2025-02-14 15:46:00', NULL, NULL, 1, NULL, NULL),
(118, 'PN-ZLAME-04-16', 'Jiron Arica cruce con la Av. Primavera', 16, 25, '-13.397598003746221,-76.13025553839137', '2025-02-14 15:47:46', NULL, NULL, 1, NULL, NULL),
(119, 'PN-ZLAME-05-16', 'Av. Primavera Antes del Parque Mariella Ormeño De Peña', 16, 25, '-13.39545694762725,-76.12974567786583', '2025-02-14 15:51:51', NULL, NULL, 1, NULL, NULL),
(120, 'PN-ZSAT2-01-16', 'Avenida Satélite', 16, 26, '-13.384852778081553,-76.1198469314674', '2025-02-14 16:07:39', NULL, NULL, 1, NULL, NULL),
(121, 'PN-ZSAT2-02-16', 'Entre jiron Chimu y Capilla San Jose', 16, 26, '-13.385071963589239,-76.12044506407773', '2025-02-14 16:08:33', NULL, NULL, 1, NULL, NULL),
(122, 'PN-ZSAT2-03-16', 'SATELITE, antes de la plaza', 16, 27, '-13.384538315093698,-76.12127313935997', '2025-02-14 16:15:42', NULL, NULL, 1, NULL, NULL),
(123, 'PN-ZSAT2-04-16', 'Frente a plaza \"LAS ROCAS\"', 16, 27, '-13.38351124725254,-76.12220528575334', '2025-02-14 16:18:18', NULL, NULL, 1, NULL, NULL),
(124, 'PN-ZSAT2-05-16', 'Atras de plaza \"LAS ROCAS\"', 16, 27, '-13.38379789722049,-76.12284394206162', '2025-02-14 16:20:15', NULL, NULL, 1, NULL, NULL),
(125, 'PN-ZSAT2-06-16', 'SATELITE en una esquina yendo al Fundo', 16, 27, '-13.38332694023409,-76.12416196595733', '2025-02-14 16:24:04', NULL, NULL, 1, NULL, NULL),
(126, 'PN-ZSAT2-07-16', 'Frente a la chacra', 16, 27, '-13.385261025771625,-76.12328996115099', '2025-02-14 16:27:09', NULL, NULL, 1, NULL, NULL),
(127, 'PN-ZSAT2-08-16', 'SATELITE', 16, 27, '-13.385080857193614,-76.12173136769323', '2025-02-14 16:29:10', NULL, NULL, 1, NULL, NULL),
(128, 'PN-ZSAT1-01-16', 'SATELITE-S1-01', 16, 26, '-13.386358805293323,-76.12102855317724', '2025-02-14 16:30:38', NULL, NULL, 1, NULL, NULL),
(129, 'PN-ZSAT1-02-16', 'Jiron Ricardo Palma cruzando Jiron Bolivar', 16, 26, '-13.38702695833904,-76.1196950708403', '2025-02-14 16:32:15', NULL, NULL, 1, NULL, NULL),
(130, 'PN-ZSAT1-03-16', 'SATELITE, Jiron Ricardo Palma frente al terreno con arboles', 16, 26, '-13.387605940164153,-76.12059440266438', '2025-02-14 16:33:31', NULL, NULL, 1, NULL, NULL),
(131, 'PN-ZSAT1-04-16', 'Av Leoncio Prado', 16, 26, '-13.387111335317352,-76.11892241865255', '2025-02-14 16:43:46', NULL, NULL, 1, NULL, NULL),
(132, 'PN-ZSAT1-05-16', 'Jiron Jose Galvez', 16, 26, '-13.385778899724333,-76.1194668778092', '2025-02-14 16:47:27', NULL, NULL, 1, NULL, NULL),
(133, 'PN-ZSAT1-06-16', 'Jiron San Martin, a la izquierda en la casa azul al lado', 16, 26, '-13.38479419639618,-76.11824977642307', '2025-02-14 17:02:02', NULL, NULL, 1, NULL, NULL),
(134, 'PN-ZSAT1-07-16', 'Satelite, 1 cuadra mas adelante de la Caja 6', 16, 26, '-13.384023644429487,-76.11781527678353', '2025-02-14 17:05:56', NULL, NULL, 1, NULL, NULL),
(135, 'PN-ZSAT1-08-16', 'SATELITE, Casa Blanca de rejilla', 16, 26, '-13.38365594400052,-76.11725511660788', '2025-02-15 05:11:02', '2025-02-18 11:42:40', NULL, 1, NULL, NULL),
(136, 'CO-ZCOBA-002-16', 'Condorillo Alto', 16, 24, '-13.435181958459932,-76.11530012560296', '2025-02-19 09:31:39', NULL, NULL, 1, NULL, NULL),
(137, 'CO-ZCOBA-003-16', 'Condorillo Alto', 16, 24, '-13.435737435612095,-76.11421945803488', '2025-02-19 09:33:05', NULL, NULL, 1, NULL, NULL),
(138, 'CO-ZCOBA-004-16', 'Condorillo Alto', 16, 24, '-13.436197735302594,-76.11447569906825', '2025-02-19 09:35:01', NULL, NULL, 1, NULL, NULL),
(140, 'CO-ZCOAL-001-16', 'Avenida Progeso, Condorillo Alto', 16, 24, '-13.437133579813938,-76.11335096388657', '2025-02-19 10:06:07', NULL, NULL, 1, NULL, NULL),
(141, 'CO-ZCOAL-002-16', 'Avenida Progeso, Condorillo Alto', 16, 24, '-13.438055685548077,-76.1101002274427', '2025-02-19 10:21:19', NULL, NULL, 1, NULL, NULL),
(142, 'SN-ZMNOR-001-16', 'Jiron San Martin', 16, 28, '-13.42504137582312,-76.14200881808364', '2025-02-19 10:34:36', NULL, NULL, 1, NULL, NULL),
(143, 'SN-ZMNOR-002-16', 'Calle Roel Jasmin', 16, 28, '-13.425226040667317,-76.14436863882796', '2025-02-19 10:36:12', NULL, NULL, 1, NULL, NULL),
(144, 'CO-ZCOAL-003-16', 'Avenida Progreso', 16, 24, '-13.436317767425896,-76.11689551536871', '2025-02-19 10:36:16', NULL, NULL, 1, NULL, NULL),
(145, 'SN-ZMNOR-003-16', 'Pasaje Paso de Gomez', 16, 28, '-13.425439504465244,-76.1449246895465', '2025-02-19 10:37:42', NULL, NULL, 1, NULL, NULL),
(146, 'SN-ZMNOR-004-16', 'Invación', 16, 28, '-13.425585818554579,-76.1435446233033', '2025-02-19 10:38:53', NULL, NULL, 1, NULL, NULL),
(147, 'CO-ZCOAL-004-16', 'Avenida Progreso, al lado de un edificio con techo rojo', 16, 24, '-13.436142321058245,-76.11938318771783', '2025-02-19 10:41:16', NULL, NULL, 1, NULL, NULL),
(148, 'SN-ZMNOR-007-16', 'Calle Roel Jasmin', 15, 28, '-13.426895138582891,-76.14359787002896', '2025-02-19 10:41:40', '2025-02-25 18:54:42', NULL, 1, NULL, NULL),
(149, 'SN-ZMNOR-005-16', 'Calle los Laureles', 16, 28, '-13.427876387910972,-76.14294282832999', '2025-02-19 10:47:29', NULL, NULL, 1, NULL, NULL),
(150, 'CO-ZCOAL-MINI_NAP-005-16', 'Condorillo Alto', 16, 29, '-13.437393628598901,-76.12260638803308', '2025-02-19 10:47:30', NULL, NULL, 1, NULL, NULL),
(151, 'SN-ZMNOR-006-16', 'Calle Los Laureles', 16, 28, '-13.427917762945745,-76.14386586687952', '2025-02-19 10:49:54', NULL, NULL, 1, NULL, NULL),
(152, 'SN-ZMNOR-008-16', 'Avenida Garcilazo de la Vega', 16, 28, '-13.426836992268354,-76.13771379872061', '2025-02-19 10:54:17', NULL, NULL, 1, NULL, NULL),
(154, 'PN-ZRCHAC-01-16', 'Avenida Urbine Julve', 16, 30, '-13.435902739910853,-76.13733810022276', '2025-02-19 11:03:00', NULL, NULL, 1, NULL, NULL),
(156, 'PN-ZRCHAC-02-16', 'Calle Las FLores', 16, 30, '-13.437940986758287,-76.13764273356978', '2025-02-19 11:05:55', NULL, NULL, 1, NULL, NULL),
(157, 'PN-ZRCHAC-03-16', 'Pasaje las Flores', 16, 30, '-13.438220601665263,-76.13694187670025', '2025-02-19 11:07:54', NULL, NULL, 1, NULL, NULL),
(158, 'CB-ZCBCP-001-16', 'Jr. Los Ciruelos', 16, 13, '-13.430744626237484,-76.1219213806365', '2025-02-19 11:09:13', NULL, NULL, 1, NULL, NULL),
(159, 'PN-ZRCHAC-04-16', 'Calle Victor Haya de la Torre', 16, 30, '-13.43835730579954,-76.13534143424863', '2025-02-19 11:09:41', NULL, NULL, 1, NULL, NULL),
(160, 'CB-ZCBCP-002-16', 'Pasaje Primavera', 16, 13, '-13.429937414574562,-76.12128675039799', '2025-02-19 11:10:32', NULL, NULL, 1, NULL, NULL),
(161, 'PN-ZRCHAC-06-16', 'Avenida San Martin', 16, 30, '-13.433067050109404,-76.14183322924112', '2025-02-19 11:10:58', NULL, NULL, 1, NULL, NULL),
(162, 'CB-ZCBCP-003-16', 'CB-ZCBCP-003', 16, 31, '-13.43212977758795,-76.11970787996609', '2025-02-19 11:12:22', NULL, NULL, 1, NULL, NULL),
(163, 'PN-ZRCHAC-05-16', 'Prolongacion Avenida Progreso', 16, 30, '-13.434475494216915,-76.13601594827195', '2025-02-19 11:13:28', NULL, NULL, 1, NULL, NULL),
(164, 'PN-ZPROG-01-16', 'Avenida Progreso', 16, 32, '-13.434819751462658,-76.13329962565467', '2025-02-19 11:35:58', NULL, NULL, 1, NULL, NULL),
(165, 'PN-ZPROG-04-16', 'Avenida Santa Rita', 16, 32, '-13.432757001283713,-76.13213336399158', '2025-02-19 11:37:20', NULL, NULL, 1, NULL, NULL),
(166, 'PN-ZPROG-05-16', 'Condominio Santa rita', 16, 32, '-13.431757160431712,-76.13002163201878', '2025-02-19 11:39:00', NULL, NULL, 1, NULL, NULL),
(167, 'CB-ZCBCP-004-16', 'CB-ZCBCP-004', 16, 31, '-13.433161125510397,-76.11879647143573', '2025-02-19 11:40:12', NULL, NULL, 1, NULL, NULL),
(168, 'CB-ZCBCP-005-16', 'H.H San Agustin', 16, 31, '-13.433071430033204,-76.11946271622385', '2025-02-19 11:41:47', NULL, NULL, 1, NULL, NULL),
(169, 'PN-ZPROG-02-16', 'Avenida Progreso', 16, 32, '-13.43491610304252,-76.1304779364157', '2025-02-19 11:42:17', NULL, NULL, 1, NULL, NULL),
(170, 'CB-ZCBCP-006-16', 'H.H San Agustin, yendo para Avenida Santa Rita', 16, 31, '-13.433031951357611,-76.12025538032422', '2025-02-19 11:43:29', NULL, NULL, 1, NULL, NULL),
(171, 'PN-ZPROG-03-16', 'Pasaje 1', 16, 32, '-13.438374075607406,-76.1291279497553', '2025-02-19 11:44:46', NULL, NULL, 1, NULL, NULL),
(172, 'CB-ZCBOR-004-16', 'Cerca a la Cruz Blanca Oruro', 16, 14, '-13.430029613694684,-76.11297304121621', '2025-02-20 09:27:32', NULL, NULL, 1, NULL, NULL),
(173, 'CB-ZCBVC-001-16', 'Av. Cruz Blanca', 16, 13, '-13.42622807578486,-76.12283832786662', '2025-02-20 09:30:03', NULL, NULL, 1, NULL, NULL),
(174, 'CB-ZCBVC-002-16', 'Pasaje los Jazmines', 15, 13, '-13.427355523841037,-76.12398143483176', '2025-02-20 09:31:35', '2025-02-25 09:46:42', NULL, 1, NULL, NULL),
(175, 'CB-ZCBVC-004-16', 'Hornos Goyito', 16, 33, '-13.42896712685317,-76.12367536816973', '2025-02-20 10:18:00', NULL, NULL, 1, NULL, NULL),
(176, 'CB-ZCBVC-003-16', 'Cerca del estadio Cruz Blanca', 16, 33, '-13.427756302048131,-76.12340173293555', '2025-02-20 10:19:23', NULL, NULL, 1, NULL, NULL),
(177, 'CB-ZCBVC-006-16', 'Pje. Alva Maurtua', 16, 13, '-13.428491602475926,-76.12081823457488', '2025-02-20 13:05:00', NULL, NULL, 1, NULL, NULL),
(178, 'CB-ZCBVC-007-16', 'Av Cruz Blanca yendo para la plaza', 16, 13, '-13.427812303636289,-76.12041744406119', '2025-02-20 13:07:12', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_clientes`
--

DROP TABLE IF EXISTS `tb_clientes`;
CREATE TABLE IF NOT EXISTS `tb_clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `id_persona` int(11) DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `direccion` varchar(250) NOT NULL,
  `referencia` varchar(150) DEFAULT NULL,
  `coordenadas` varchar(50) DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `unique_id_persona` (`id_persona`),
  UNIQUE KEY `unique_id_empresa` (`id_empresa`),
  KEY `clien_fk_id_persona` (`id_persona`),
  KEY `clien_fk_id_empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=805;

--
-- Volcado de datos para la tabla `tb_clientes`
--

INSERT INTO `tb_clientes` (`id_cliente`, `id_persona`, `id_empresa`, `direccion`, `referencia`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(87, 6, NULL, 'PSJE JOSE OLAYA NRO. CASA 160 Q-03 - CRUZ BLANCA ', 'ninguna', '-13.429693043680158,-76.11500661967389', '2025-02-11 11:34:59', NULL, NULL, 12, NULL, NULL),
(88, 10, NULL, 'Av. Santo Domingo', 'En una Casa Verde', '-13.388689372736787,-76.15666938110351', '2025-02-12 09:30:14', '2025-02-26 17:28:53', NULL, 1, 1, NULL),
(89, 11, NULL, 'Avenida Rosario 07 - Sin barrio', 'A la espalda de la videna', '-13.410219326135763,-76.13651458968663', '2025-02-12 10:25:48', NULL, NULL, 1, NULL, NULL),
(90, 12, NULL, 'CL. 9 DE OCTUBRE NRO. 211 - GROCIO PRADO', 'ninguna', '-13.399400833088006,-76.15762943316717', '2025-02-12 12:10:12', NULL, NULL, 12, NULL, NULL),
(91, 345, NULL, 'Avda. Fátima S/N - Sunampe', 'ESPALDA DE LA CASA DE IVAN', '-13.428167820314462,-76.15966500985327', '2025-02-13 17:42:51', NULL, NULL, 14, NULL, NULL),
(92, 347, NULL, 'C.P. CONDORILLO ALTO MZ. I - LT. 04', 'ninguna', '-13.433602969372952,-76.11663157364464', '2025-02-14 10:45:19', NULL, NULL, 12, NULL, NULL),
(93, 348, NULL, 'MZNA K NRO. 3 UPIS HUSARES DE JUNIN', 'Esquina de la Plaza del Usares de Junin', '-13.392111774958352,-76.14944983301655', '2025-02-14 14:31:14', NULL, NULL, 1, NULL, NULL),
(94, 349, NULL, 'PARAISO - SU - 1 - C.P. LOMO LARGO - SUNAMPE', 'ninguna', '-13.421977338442261,-76.17351750433104', '2025-02-17 12:53:38', NULL, NULL, 12, NULL, NULL),
(95, 632, NULL, 'AV. FATIMA MZ. I - LT. 01 - SUNAMPE ', 'ninguna', '-13.427724958285477,-76.16006088898726', '2025-02-21 10:10:36', NULL, NULL, 12, NULL, NULL),
(96, 625, NULL, 'AV. FATIMA N° 373 - SUNAMPE', 'ultima cuadra de av. fatima', '-13.429843953195782,-76.160477301138', '2025-02-24 18:58:55', NULL, NULL, 1, NULL, NULL),
(97, 633, NULL, ' Virgen del Carmen Mz. I, Lot 24', 'Cruz blanca', '-13.427199449025544,-76.12336163323111', '2025-02-25 09:46:36', NULL, NULL, 14, NULL, NULL),
(98, 1144, NULL, 'La unión hace la fuerza. Mina de oro . Sunampe', 'MINA DE ORO', '-13.427277342369194,-76.14331187549509', '2025-02-25 18:54:40', NULL, NULL, 14, NULL, NULL),
(99, 1145, NULL, 'PSJE SOLARI MZ. D LT. 14 - C.P. MINA DE ORO - SUNA', 'ninguna', '-13.42528008481821,-76.14371661782366', '2025-02-26 11:00:13', NULL, NULL, 12, NULL, NULL),
(100, 14, NULL, 'Calle Miguel Grau #513- Sunampe', 'Carretera de Sunampe', '-13.41719018574119, -76.15661544129519', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(101, 15, NULL, 'AV.PRINCIPAL 543 SUNAMPE LOTE 6A', 'NINGUNA', '-13.417248516590439, -76.1573496291887', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(102, 16, NULL, 'SUNAMPE PASO DE GOMEZ S/N', 'NINGUNA', '-13.42510969987012, -76.15729550600098', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(103, 17, NULL, 'Psj. San Cristobal 360   - Villa Julia', 'NINGUNA', '-13.41794641756243, -76.14639163372296', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(104, 18, NULL, 'Av. Melchorita Nº 604 - Grocio Prado', 'NINGUNA', '-13.4035641141539, -76.15864855162403', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(105, 19, NULL, 'PSJ. DOS DE MAYO N°303 - CRUZ BLANCA', 'NINGUNA', '-13.42967750940962, -76.11966117091839', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(106, 20, NULL, 'Parada de los Amigos Pasaje Villa - Sunampe', 'NINGUNA', '-13.411228170857974, -76.16367377634829', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(107, 21, NULL, 'Parada de amigos cevicheria Barrunto -Sunampe', 'NINGUNA', '-13.411536085588242, -76.16266532974558', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(108, 22, NULL, 'Parada de los Amigos Pasaje Renovacion - Sunampe', 'NINGUNA', '-13.410982469879979, -76.16261357482894', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(109, 23, NULL, 'Pasaje Moran -Santa Rosa 193 - Sunampe', 'NINGUNA', '-13.421810334691294, -76.15402267434136', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(110, 24, NULL, 'Pasaje Santa Rosa - Espalda de Cruz Blanca', 'NINGUNA', '-13.42858871096858, -76.12367960922052', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(111, 25, NULL, 'Pasaje Napa - Cruz Blanca', 'NINGUNA', '-13.430130170740975, -76.11363179107259', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(112, 26, NULL, 'Prolongacion Alva Maurtua - Cruz Blanca', 'Ex toma de cala', '-13.429125385395603, -76.1228649434129', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(113, 27, NULL, 'Av. Alfonso Ugarte Mz M Lt 5, CP San Pedro de Pilpa - Sunampe', 'NINGUNA', '-13.41359873953495, -76.16482120348537', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(114, 28, NULL, 'AV. PARAISO MZ C LT 27, LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.42198243029193, -76.17087858938373', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(115, 29, NULL, 'Psj 2 de mayo #285-4 cruz Blanca', 'Espalda del colegio 22234', '-13.429726544074592, -76.11767187519753', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(116, 30, NULL, 'Av. Alva maurtua 580 cruz blanca', 'NINGUNA', '-13.430053578451815, -76.11304420522345', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(117, 31, NULL, 'barrio el tigre 280 av los proceres chincha', 'NINGUNA', '-13.425845342461963, -76.1220683373692', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(118, 32, NULL, 'calle San Vicente Ferrer 520 Sunampe', 'NINGUNA', '-13.412870617423376, -76.1648875393158', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(119, 33, NULL, 'Cruz blanca pasaje santa rosa chincha alta oruro', 'NINGUNA', '-13.428458058166505, -76.113114404048', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(120, 34, NULL, 'Av. paraíso - Lomo Largo - Sunampe', 'A 1 cuadra del hostal “El otro Sitio”', '-13.418689958639435, -76.16093481707499', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(121, 35, NULL, 'Psj. 2 de mayo - Cruz blanca', 'NINGUNA', '-13.429273425461991, -76.11800451461055', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(122, 36, NULL, 'Av. San marcelo 158 (Villa Julia) - Sunampe', 'NINGUNA', '-13.416883603617444, -76.14803884495005', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(123, 37, NULL, 'Av. San Pedro de Pilpa #121 - Lomo Largo - Sunampe', 'NINGUNA', '-13.417545645553526, -76.16143536030052', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(124, 38, NULL, 'Calle Grau 108 - Lomo Largo - Sunampe', 'NINGUNA', '-13.416879128920188, -76.14803565919091', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(125, 39, NULL, 'PSJ DE LA CRUZ MATIAS - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.423134812620187, -76.1707820306064', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(126, 40, NULL, 'PASAJE SANTA ROSA 130 - 01  SUNAMPE', 'NINGUNA', '-13.419139859241461, -76.159484979508', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(127, 41, NULL, 'Psj. Betania interior 04 Nº 390 - Guayabo - Sunampe', 'NINGUNA', '-13.418722022148165, -76.14559918754053', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(128, 42, NULL, 'CALLE UNION SANTA ROSA N°101 - CRUZ BLANCA', 'NINGUNA', '-13.42756085706627, -76.14332212278372', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(129, 43, NULL, 'CRUZ BLANCA VIRGEN DEL CARMEN', 'NINGUNA', '-13.427296025814895, -76.12291257486424', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(130, 44, NULL, 'Calle los Próceres Lote 24-Cruz Blanca', 'NINGUNA', '-13.4266066114104, -76.12246498243971', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(131, 45, NULL, 'Toma de cala Cruz blanca -. Virgen de carmen', 'NINGUNA', '-13.428097217467817, -76.12418029303822', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(132, 47, NULL, 'Upis Nueva Generación siglo XXI mz K Lt 11- Chincha Alta', 'NINGUNA', '-13.425682429212067, -76.12281439111074', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(133, 48, NULL, 'Av. Huascar 130 San IGNACIO', 'NINGUNA', '-13.418094617560746, -76.15345253371902', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(134, 49, NULL, 'Av San Francisco 117 sunampe', 'NINGUNA', '-13.41573241306898, -76.15267683372478', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(135, 50, NULL, 'SAN IGANCIO PASANDO  Cevicheria de san ignacio', 'NINGUNA', '-13.41576611881792, -76.15281555072741', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(136, 51, NULL, 'Asoc. Civil virgen del carmen Mz. B lt. 13', 'NINGUNA', '-13.424659147259803, -76.13217507756363', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(137, 52, NULL, 'Av. Arenal s/n Lote 24 02- Cruz Blanca', 'NINGUNA', '-13.427666321374453, -76.1208730748715', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(138, 53, NULL, 'pasaje santa rosa sunampe', 'Frente al grifo', '-13.419281429242341, -76.15850432255074', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(139, 54, NULL, 'AA.HH. Virgen del carmen Mz B Lt. 8 -Cruz Blanca', 'NINGUNA', '-13.42683401550152, -76.12279454423651', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(140, 55, NULL, 'PSJ. MARTINEZ Nª 90 - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.428425560733201, -76.12167915171833', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(141, 56, NULL, 'AV. UNION SANTA ROSA N103-18 - CRUZ BLANCA', 'NINGUNA', '-13.430889464861027, -76.12027098123384', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(142, 57, NULL, 'Calle el carmen Nº 190 - Cruz Blanca', 'NINGUNA', '-13.429980963236876, -76.12000506099658', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(143, 58, NULL, 'Comite Alameda G.B. 232 - Sunampe', 'NINGUNA', '-13.421390393516296, -76.16029439727183', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(144, 59, NULL, 'Av Principal Huaca Grande 317- Sunampe', 'NINGUNA', '-13.427309030613106, -76.14817359640526', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(145, 60, NULL, 'C.P. CONDORILLO ALTO MZ L LT 10 - CHINCHA', 'NINGUNA', '-13.438335912076914, -76.10859605100418', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(146, 61, NULL, 'Av. Alva Maurtua S/N - Cruz Blanca', 'NINGUNA', '-13.430170015673815, -76.11402576045354', '2025-02-26 22:20:32', NULL, NULL, 1, NULL, NULL),
(194, 62, NULL, 'PSJ. ANDRES AVELINO CACERES 137', 'SANTA ROSA - SUNAMPE', '-13.430168477029357, -76.11402632974261', '2025-02-26 22:22:01', NULL, NULL, 1, NULL, NULL),
(195, 63, NULL, 'Psj. Santa Rosa S/N - Cruz Blanca', 'NINGUNA', '-13.431564010800189, -76.12199075682139', '2025-02-26 22:22:01', NULL, NULL, 1, NULL, NULL),
(196, 64, NULL, 'Calle San Antonio 301 - Sunampe', 'NINGUNA', '-13.421333392577337, -76.15164768103696', '2025-02-26 22:22:01', NULL, NULL, 1, NULL, NULL),
(197, 66, NULL, 'A.v Alva Maurtua Nº106 - Cruz Blanca', 'NINGUNA', '-13.429936858810889, -76.12398894217505', '2025-02-26 22:22:01', NULL, NULL, 1, NULL, NULL),
(249, 67, NULL, 'Psj. Primavera Lt 10022 - Cruz Blanca', 'NINGUNA', '-13.430237995583562, -76.12119651153856', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(250, 68, NULL, 'AV. ALVA MAURTUA N°508 - CRUZ BLANCA', 'NINGUNA', '-13.428987360313329, -76.11632165116166', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(251, 69, NULL, 'Av. Alva Maurtua Nº 300 - Cruz Blanca', 'NINGUNA', '-13.428168943018482, -76.1178218909214', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(252, 70, NULL, 'Av. Primavera 130 - Lomo Largo - Sunampe', 'NINGUNA', '-13.423981787236794, -76.17110780088149', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(253, 71, NULL, 'Av. Alva Maurtua 514 - Cruz Blanca', 'NINGUNA', '-13.43430045571954, -76.11618877502345', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(254, 72, NULL, 'AV.PARAISO CASA DE 2 PISOS AZUL - Sunampe', 'NINGUNA', '-13.42148481583886, -76.16825004186549', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(255, 73, NULL, 'Calle el Carmen Nº 163 - Cruz Blanca', 'NINGUNA', '-13.428924060306764, -76.11926827478936', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(256, 74, NULL, 'Psj. 2 de Mayo 285- Cruz Blanca', 'NINGUNA', '-13.42987291328192, -76.11813351915245', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(257, 75, NULL, 'Carretera Sunampe 701 1era entrada Santa Rosa Sunampe', 'NINGUNA', '-13.41919175596393, -76.15781664620239', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(258, 76, NULL, 'Psj. Napa S/N - Cruz Blanca', 'NINGUNA', '-13.426354382482504, -76.12449390427189', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(259, 77, NULL, 'A.v Los Proceres s/n  -SUNAMPE', 'NINGUNA', '-13.424543147922412, -76.1589062487844', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(260, 78, NULL, 'PSJ. EL CARMEN MZ D LT 11', 'AL COST. DEL COLEGIO', '-13.42581768292055, -76.15790404551956', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(261, 79, NULL, 'AV. La alameda s/n Sunampe', 'NINGUNA', '-13.421390452168307, -76.16029207143043', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(262, 80, NULL, 'Calle las Nazarenas, S/n Huaca Grande- Sunampe', 'NINGUNA', '-13.429402341686831, -76.15299157455065', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(263, 81, NULL, 'LOS ARENALES, PSJ SANTA ANGELA - CRUZ BLANCA', 'NINGUNA', '-13.426259822559144, -76.12458300657327', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(264, 82, NULL, 'RESIDENCIAL SAN PABLO LT 17 - SUNAMPE', 'NINGUNA', '-13.416892876989156, -76.15523497347475', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(265, 83, NULL, 'C.P. Nuevo condorillo - San Valentin A-6', 'NINGUNA', '-13.433273312017231, -76.11790360771933', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(266, 84, NULL, 'CC.PP. NUEVO CONDORILLO - SAN VALENTIN A-1', 'NINGUNA', '-13.4273723563749, -76.12291224740346', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(267, 85, NULL, 'Sector La Alameda - Sunampe', 'NINGUNA', '-13.423853411245695, -76.12455202098646', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(268, 86, NULL, 'AV. LOS ANGELES Nª 512 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.419141239184535, -76.17028953372078', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(269, 87, NULL, 'Proceres LT 385 - Carretera Sunampe', 'NINGUNA', '-13.417254705430095, -76.17068282304398', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(270, 88, NULL, 'PSJ JOSE SANTOS CHOCANO 145 - San Pedro de Pilpa', 'NINGUNA', '-13.415064394209452, -76.16291749274434', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(271, 89, NULL, 'Calle los Angeles 449 - Lomo Largo', 'NINGUNA', '-13.419593239313508, -76.16987968101026', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(272, 90, NULL, 'HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.430753838446877, -76.15971759131152', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(273, 91, NULL, 'Av. san antonio, guayabo psj. 29', 'NINGUNA', '-13.41581328157863, -76.15356902074144', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(274, 92, NULL, 'Calle santa angela, frente al mega mercado - Cruz Blanca', 'NINGUNA', '-13.426298622029181, -76.12446891712763', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(275, 93, NULL, 'Calle Santa Rosa - Sunampe', 'NINGUNA', '-13.42006459011307, -76.15620267568863', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(276, 94, NULL, 'AV.SANTA ROSA 146 SUNAMPE', 'NINGUNA', '-13.419063580873406, -76.15627360248006', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(277, 95, NULL, 'AV. ALVA MAURTUA MZ. B LT. 17 - CRUZ BLANCA', 'NINGUNA', '-13.42884725380203, -76.12022646496229', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(278, 96, NULL, 'Cruz Blanca Psj estrada 2 de mayo', 'NINGUNA', '-13.429537958067284, -76.11871746463513', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(279, 97, NULL, 'Villa Julia - Sunampe', 'NINGUNA', '-13.414495593251925, -76.14878060733449', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(280, 622, NULL, 'ENTRADA SANTA FE, CAMINO EL SOCORRO - SUNAMPE', 'NINGUNA', '-13.430107698052336, -76.17453896353705', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(281, 98, NULL, 'Condorillo alto Mz. F lt. 31', 'NINGUNA', '-13.435369960629686, -76.12207454341551', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(282, 99, NULL, 'Virgen del carmen mz lote 11 Cruz Blanca', 'NINGUNA', '-13.427011618346716, -76.12379410074234', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(283, 100, NULL, 'Av. Principal Cacerio Huaca Grande', 'NINGUNA', '-13.425930227147525, -76.15701382269881', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(284, 101, NULL, 'Paso de gomez , empezando huaca grande sunampe', 'NINGUNA', '-13.425992310419245, -76.15697661440275', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(285, 102, NULL, 'Prolg. Paraiso S/N Lomo Largo', 'NINGUNA', '-13.421928996054978, -76.17293899990555', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(286, 103, NULL, 'AV. ARENALES, BARRIO SANTA ANGELA - CRUZ BLANCA', 'NINGUNA', '-13.430802357247302, -76.11908077026254', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(287, 104, NULL, 'Calle San Juan - San pedro de pilpa - Sunampe', 'NINGUNA', '-13.418054164501157, -76.16447761117549', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(288, 105, NULL, 'CALLE SANTA ROSA #355  PRIMERA ENTRADA - SUNAMPE', 'NINGUNA', '-13.418819468476078, -76.15545522892165', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(289, 106, NULL, 'Av San Pedro de Pilpa 475', 'NINGUNA', '-13.416902703915383, -76.16612403710519', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(290, 107, NULL, 'VILLA JULIA PSJ LOS LAURELES', 'NINGUNA', '-13.416766991446668, -76.14781617482069', '2025-02-26 22:24:03', NULL, NULL, 1, NULL, NULL),
(291, 108, NULL, 'CP. San pedro de pilpa - Calle San Vicente de ferrer 8 int. 1', 'NINGUNA', '-13.416889569729063, -76.15523480342493', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(292, 109, NULL, 'Calle Parada de los amigos 409 - Sunampe', 'NINGUNA', '-13.412626588231548, -76.16432037415127', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(293, 110, NULL, 'Calle San Vicente ferrer 300 - Int. 10 - Sunampe', 'NINGUNA', '-13.416023037606756, -76.14494748899315', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(294, 111, NULL, 'Calle Parada de los amigos - Psj Villa - Sunampe', 'NINGUNA', '-13.411353465211132, -76.16444090254723', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(295, 112, NULL, 'Calle Parada de los amigos - Sunampe', 'NINGUNA', '-13.41283349187035, -76.16477568060611', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(296, 113, NULL, 'cruz blanca -  psj napa', 'NINGUNA', '-13.430039531275638, -76.11873414753506', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(297, 114, NULL, 'AV ALVA MAUTUA PUERTA 627-B - CRUZ BLANCA', 'NINGUNA', '-13.430123112882104, -76.11190258605404', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(298, 115, NULL, 'Pasaje Ose Olaya- Entrada Condoriilo', 'NINGUNA', '-13.429863697910026, -76.11514460710553', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(299, 116, NULL, 'CRUZ BLANCA PSJ TUPAC AMARU ENTRADA CONDORILLO', 'NINGUNA', '-13.429942392474318, -76.12455825586457', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(300, 118, NULL, 'CRUZ BLANCA PSJ SAN MARTIN 55', 'NINGUNA', '-13.429172168945072, -76.11888968373708', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(301, 119, NULL, 'PSJ. SAN MARTIN - SAN IGNACIO - SUNAMPE', 'NINGUNA', '-13.417595181788572, -76.15320468668405', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(302, 120, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ C - LT 07 - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.427148295951795, -76.12315537884602', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(303, 121, NULL, 'CRUZ BLANCA VIRGEN DEL CARMEN AV TOMA DE CALA', 'NINGUNA', '-13.431823845450527, -76.12348439243824', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(304, 122, NULL, 'CRUZ BLANCA ENTRADA CONDORILLO', 'NINGUNA', '-13.429979726602893, -76.11493849022246', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(305, 123, NULL, 'Av Alva Maurtua 144 Cruz blanca', 'NINGUNA', '-13.428653139142838, -76.11985924024819', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(306, 124, NULL, 'TOMA DE CALA CRUZ BLANCA', 'NINGUNA', '-13.428593339075729, -76.12228380981374', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(307, 125, NULL, 'AV. PRIMAVERA N° 711 - SUNAMPE', 'ANTES DE LA BAJADA DEL SOCORRO', '-13.430063690014734, -76.17490495212819', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(308, 126, NULL, 'CONDOMINIO LOS SAUCES MZ. D LT. 02 - SUNAMPE', 'NINGUNA', '-13.433628228148605, -76.16394266207602', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(309, 127, NULL, 'San Ignacio  - Sunampe', 'NINGUNA', '-13.416892723140409, -76.15261449212417', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(310, 128, NULL, 'Av. Primavera, despues de la entrada de Santa fe - Sunampe', 'NINGUNA', '-13.430181232632037, -76.17542416167812', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(311, 129, NULL, 'Calle Grau 168 lomo largo', 'NINGUNA', '-13.423494423375596, -76.17042011211421', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(312, 131, NULL, 'Sunampe , AV,FATIMA PASAJ LOS MARCLOS', 'NINGUNA', '-13.426601270831265, -76.15971424382356', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(313, 132, NULL, 'SANTA ROSA , SUNAMPE COSTADO DE PANADERIA JJ', 'NINGUNA', '-13.42168617360319, -76.15698037439243', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(314, 133, NULL, 'Asociación virgen del Carmen mz. A lote 7', 'Costado del estadio pasaje girasoles', '-13.426829457860423, -76.1226354362449', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(315, 134, NULL, 'PSJ. SANTA ROSA S/N - CRUZ BLANCA', 'NINGUNA', '-13.428805430588326, -76.12206564060556', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(316, 135, NULL, 'Av. 2 de mayo 299 - Cruz blanca', 'NINGUNA', '-13.430049926609883, -76.11773513008174', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(317, 136, NULL, 'psj santa rosa sunampe guayabo cholo', 'NINGUNA', '-13.421974322412993, -76.14908245728179', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(318, 137, NULL, 'toma de cala lt 16', 'NINGUNA', '-13.429367131314704, -76.12241324287791', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(319, 138, NULL, 'Calle El carmen 180-cruz blanca', 'NINGUNA', '-13.429711281821628, -76.11966287094124', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(320, 139, NULL, 'Av. San ignacio 1era entrada Santa Rosa', 'NINGUNA', '-13.420171495116229, -76.15618061517338', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(321, 140, NULL, 'Psj los pinos S/N- Sunampe', 'Pasando la capilla San Ignacio a la mano derecha', '-13.419877469416173, -76.15238278785488', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(322, 141, NULL, 'Av. emancipacion SUNAMPE S/N', 'NINGUNA', '-13.425360488548469, -76.15905944500962', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(323, 142, NULL, 'AV. PROCERES N° 101 - SUNAMPE', 'NINGUNA', '-13.424903582038215, -76.15809707913787', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(324, 143, NULL, 'Psj. San Juan de Dios S/N', 'NINGUNA', '-13.429969345311038, -76.11891300774745', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(325, 144, NULL, 'San Martin 698 - San pedro de pilpa - Sunampe', 'NINGUNA', '-13.41585415119624, -76.17104984724809', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(326, 145, NULL, 'Paso de Gomez 115 - Sunampe', 'NINGUNA', '-13.424359084393235, -76.15580821570718', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(327, 146, NULL, 'Av. San pedro de pilpa 461 - Sunampe', 'NINGUNA', '-13.41655151437483, -76.16723988823344', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(328, 147, NULL, 'Sunampe, Av. Huascar', 'Casa de pandora 02', '-13.420125158538326, -76.15213933147336', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(329, 148, NULL, 'Calle Paso de Gomez nº 106- Sunampe', 'Parte Baja o Rafichez', '-13.424867000047772, -76.15495174634056', '2025-02-26 22:24:04', NULL, NULL, 1, NULL, NULL),
(330, 149, NULL, 'AV. FATIMA LT. 27 - SUNAMPE', 'NINGUNA', '-13.427649626254865, -76.16028540733728', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(331, 150, NULL, 'Psj. Nueva Esperanza Lt. 20 - Grocio Prado', 'NINGUNA', '-13.408000448179731, -76.16115888367376', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(332, 151, NULL, 'Psj. toma de martinez Lt. 1 Virgen del carmen', 'NINGUNA', '-13.427992460271543, -76.12461973388965', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(333, 152, NULL, 'Av. Alva Maurtua, cruz blanca 760', 'ultimo paradero terminando la pista', '-13.429820120859631, -76.11231519916467', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(334, 153, NULL, 'Av. Alva maurtua 5ta cuadra', 'NINGUNA', '-13.429061671826192, -76.11650578749887', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(335, 154, NULL, 'Psj. Santa Rosa Sunampe', 'NINGUNA', '-13.418236839317773, -76.15852982173264', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(336, 155, NULL, 'Av. Nueva esperanza lote 24 - grocio prado', 'NINGUNA', '-13.40824350503321, -76.16105275751887', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(337, 156, NULL, 'Avenida San Rafael #256 Grocio Prado', 'frente al campo de los mejilloneros', '-13.408086881335906, -76.16298106404645', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(338, 157, NULL, 'San pedro de pilpa 487-5 - Sunampe', 'NINGUNA', '-13.417035452209468, -76.16648559710049', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(339, 158, NULL, 'Av. Emancipacion - Sunampe', 'Frente del colegio 22268', '-13.425210916503925, -76.15864609442222', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(340, 159, NULL, 'Pasaje 2 de mayo - Cruz blanca', 'NINGUNA', '-13.429881699257201, -76.11813333345087', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(341, 160, NULL, 'CASERIO SAN IGNACIO N° 158 - SUNAMPE', 'SANTA ROSA PRIMERA ENTRADA', '-13.417823996065959, -76.15493877027954', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(342, 161, NULL, 'Av. Paraiso Mz. W Lt. 08 - Lomo Largo', 'NINGUNA', '-13.418806006772499, -76.16164185757955', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(343, 162, NULL, 'C.P. EL TIGRE 141 INT. 01 - CHINCHA ALTA', 'NINGUNA', '-13.423247878277067, -76.12021089789316', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(344, 163, NULL, 'AA.HH. VIRGEN DEL CARMEN, PSJ. TOMA DE MARTINEZ, LOTE 04 - CHINCHA', 'NINGUNA', '-13.428018147412404, -76.12476926327456', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(345, 164, NULL, 'Pasaje Villa, parada de los amigos 195', 'NINGUNA', '-13.411331586976265, -76.16425163827394', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(346, 165, NULL, 'Psj santa Rosa S/N- Cruz Blanca', 'NINGUNA', '-13.429181912622301, -76.12219495377815', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(347, 166, NULL, 'Calle nueva San Ignacio sunampe', 'NINGUNA', '-13.416881839376384, -76.15073455133025', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(348, 167, NULL, 'PSJ. LOS GERANIOS S/N - C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.423416495873894, -76.17033692557459', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(349, 168, NULL, 'Av. Melchorita 607 - Grocio Prado', 'NINGUNA', '-13.40419769926072, -76.15878597795847', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(350, 169, NULL, 'Calle jose pardo mz. V lt. 07 - Sunampe', 'NINGUNA', '-13.42627318189979, -76.16445185863', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(351, 170, NULL, 'AA.HH Mina de Oro PsJ. Los jazmines S/N', 'NINGUNA', '-13.427088366904924, -76.1457750529219', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(352, 171, NULL, 'Av. primavera 722 Sunampe', 'NINGUNA', '-13.430277035249686, -76.17579129818323', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(353, 172, NULL, 'Centro Poblado Mina de Oro Mz B Lote 6', 'Estadio de Mina de oro', '-13.427071100721081, -76.14187383159397', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(354, 173, NULL, 'Av. Primavera 724 - Sunampe', 'A dos casas del Rest. Mar Verde', '-13.430205119719743, -76.17596121562228', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(355, 174, NULL, 'PSJ SAN JUAN DE DIOS S/N - CRUZ BLANCA', 'NINGUNA', '-13.429761360331542, -76.1188766429311', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(356, 175, NULL, 'CONDORILLO ALTO PRIMERA ENTRADA', 'NINGUNA', '-13.434252973793338, -76.1159700649332', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(357, 176, NULL, 'Cruz Blanca S/N', 'NINGUNA', '-13.429037386543078, -76.11589827150259', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(358, 178, NULL, 'Virgen del carmen Mz. I lt. 1', 'NINGUNA', '-13.427515534712066, -76.12359265552823', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(359, 179, NULL, '2 puentes Av. los arenales s/n', 'NINGUNA', '-13.426516355717059, -76.12437578539456', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(360, 180, NULL, 'AV. SAN PEDRO DE PILPA N548', 'CP. SAN PEDRO P. - SUNAMPE', '-13.416560548577799, -76.16723153370867', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(361, 181, NULL, 'LOMO LARGO PASANDO LA PLAZA DE ARMAS', 'NINGUNA', '-13.42131193375289, -76.17242206296153', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(362, 183, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ A LT 10 - CRUZ BLANCA', 'NINGUNA', '-13.427034725813513, -76.12275106048067', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(363, 185, NULL, 'Prolong. Ayacucho S/N', 'NINGUNA', '-13.406193187829656, -76.16063838971122', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(364, 186, NULL, 'CALLE LOS ANGELES S/N, LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.418626323943162, -76.17058834293819', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(365, 187, NULL, 'Av. San Gregorio 105', 'carrizo, paradero de motos', '-13.400162198637608, -76.16254403194397', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(366, 188, NULL, 'Psj, Martinez 184, cruz blanca', 'NINGUNA', '-13.428425489076755, -76.12168076906148', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(367, 189, NULL, 'psj. san martin s/n', 'NINGUNA', '-13.420078778873272, -76.15695697579861', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(368, 190, NULL, 'Asociación Virgen del Carmen Mz  C Lote 12/ Calle Toma de Cala- Cruz Blanca', 'NINGUNA', '-13.427372030255594, -76.12291166266165', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(369, 191, NULL, 'Psj, Santa Rosa lt. 24', 'NINGUNA', '-13.429326401946732, -76.12241424003003', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(370, 192, NULL, 'PSJ. DOS DE MAYO - CRUZ BLANCA', 'NINGUNA', '-13.42917808534923, -76.11828962137008', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(371, 193, NULL, 'toma de cala lt. 12', 'NINGUNA', '-13.43182082463147, -76.12348511697073', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(372, 194, NULL, 'psj. primavera 116 cruz blanca', 'NINGUNA', '-13.441438778177526, -76.1211476456542', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(373, 195, NULL, 'PSJ. SAN ANTONIO MZ J LT12, ALT. VILLA JULIA - SUNAMPE', 'NINGUNA', '-13.41892125005867, -76.14963399942758', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(374, 196, NULL, 'AV. UNION SANTA ROSA N109, INT 33 - CRUZ BLANCA', 'NINGUNA', '-13.430124743042697, -76.12242269891699', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(375, 197, NULL, 'AV. UNION SANTA ROSA N110-34 - CRUZ BLANCA', 'NINGUNA', '-13.43034717086192, -76.12248700027008', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(376, 198, NULL, 'AV.FATIMA PASANDO BODEGA VIÑA SAN FRANCISCO', 'NINGUNA', '-13.429319647096124, -76.1604636731831', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(377, 199, NULL, 'Psj. Union Santa rosa  Cruz Blanca', 'NINGUNA', '-13.430491566560601, -76.12236464025139', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(378, 200, NULL, 'psj. jose olaya cruz blanca', 'NINGUNA', '-13.438745124910957, -76.11478373835001', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(379, 201, NULL, 'Av.Nazarenas N 62 Huaca Grande', 'NINGUNA', '-13.429132479161854, -76.15308446087936', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(380, 202, NULL, 'Codorillo alto Mz. P Lt. 4', 'NINGUNA', '-13.434310304523175, -76.11595527310206', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(381, 203, NULL, 'C.P. CONDORILLO ALTO MZ I LT 09 - CHINCHA', 'NINGUNA', '-13.434585806188188, -76.11578608124573', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(382, 204, NULL, 'condorillo, frente a la base de condorillo', 'NINGUNA', '-13.434376715961273, -76.1140524168616', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(383, 205, NULL, 'Calle Alva Maurtua - Cruz Blanca', 'NINGUNA', '-13.428652155920846, -76.11969056640474', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(384, 206, NULL, 'Av. pachacutec 2645 Cruz Blanca', 'NINGUNA', '-13.426079459019888, -76.12272679052907', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(385, 207, NULL, 'Condorillo alto capilla', 'NINGUNA', '-13.436066222322127, -76.11362076984966', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(386, 208, NULL, 'Calle san jose Mz. H Lt. 05 Huaca grande', 'NINGUNA', '-13.429209552888103, -76.15677835305426', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(387, 209, NULL, 'Condorillo alto mz. L lt. 5', 'NINGUNA', '-13.436569051755232, -76.11911793538523', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(388, 210, NULL, 'Condorillo alto L.19', 'NINGUNA', '-13.438442590387652, -76.10719688742114', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(389, 211, NULL, 'CALLE EL CARMEN N° 107 - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.42987657261934, -76.11880708151894', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(390, 212, NULL, 'Av Las Nazarenas 370-Huaca grande - Sunampe', 'NINGUNA', '-13.42928499298282, -76.15289383614248', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(391, 213, NULL, 'Condorillo alto MZ I LT 01', 'NINGUNA', '-13.433443529566102, -76.11752454540019', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(392, 214, NULL, 'Condorillo Mz. I lt. 18', 'NINGUNA', '-13.434015129116236, -76.11821625966459', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(393, 215, NULL, 'C.P. CONDORILLO ALTO MZ J LT 02 - CHICHA', 'NINGUNA', '-13.434157389654008, -76.11804199406434', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(394, 216, NULL, 'AV. EL PORVENIR S/N - GROCIO PRADO', 'NINGUNA', '-13.402420877088113, -76.1632762232298', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(395, 623, NULL, 'Av. alva maurtua lt 05 Cruz Blanca', 'NINGUNA', '-13.429202800743932, -76.11578405241849', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(396, 217, NULL, 'Condorillo Alto Mz. E Lt. 5 - Chincha', 'NINGUNA', '-13.436071994984232, -76.12127430836257', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(397, 218, NULL, 'Nuevo san valentin S/N -Nuevo Condorillo Bajo', 'NINGUNA', '-13.43321590518742, -76.12030190358838', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(398, 219, NULL, 'Nuevo San Valentin, invasion de condorillo', 'NINGUNA', '-13.433186481157437, -76.11910389321967', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(399, 220, NULL, 'Calle El carmen, psj los ciruelos', 'NINGUNA', '-13.432234317340766, -76.11941398674345', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(400, 221, NULL, 'Cruz blanca pasaje los ciruelos 207 - B', 'NINGUNA', '-13.432119433710003, -76.11948732972283', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(401, 222, NULL, 'PSJ. TUPAC AMARU 166 - CRUZ BLANCA', 'NINGUNA', '-13.429520182990009, -76.11579503432007', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(402, 223, NULL, 'Invasion de condorillo', 'NINGUNA', '-13.432628517165165, -76.12050438865623', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(403, 224, NULL, 'C.P. Condorillo Alto Mz Z Lt 22', 'NINGUNA', '-13.438096109933362, -76.10797254545747', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(404, 225, NULL, 'C.P. CONDORILLO ALTO MZ. L LT. 12 - CHINCHA', 'NINGUNA', '-13.436174934678537, -76.11727328244838', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(405, 226, NULL, 'HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.430092116312121, -76.15642059504194', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(406, 227, NULL, 'Av. Paraiso 24-6', 'NINGUNA', '-13.41954620011749, -76.1629596153689', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(407, 228, NULL, 'SANTA ROSA- SUNAMPE', 'NINGUNA', '-13.416879131364649, -76.16604178473249', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(408, 229, NULL, 'Condorillo Alto Mz O Lt 12', 'NINGUNA', '-13.436161224315263, -76.11665618986804', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(409, 230, NULL, 'PSJ. SANTA ANGELA MZ. B LT. 4., CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.426516201067372, -76.12441737070023', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(410, 231, NULL, 'PSJ. PRIMAVERA 100 LT 21 - CRUZ BLANCA', 'NINGUNA', '-13.43026032339094, -76.12098847601234', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(411, 232, NULL, 'C.P. Condorillo alto Mz. O lt. 13', 'NINGUNA', '-13.435806257004145, -76.11684303782587', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(412, 233, NULL, 'Condorillo alto Mz. J lt. 11', 'NINGUNA', '-13.434971354656875, -76.11669095795219', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(413, 234, NULL, 'SAN MARTIN PSJ PACHAS MINA DE ORO', 'NINGUNA', '-13.4294583360356, -76.14376087726292', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(414, 235, NULL, 'Av. garcilazo de la vega 470-Sunampe', 'NINGUNA', '-13.426251124608944, -76.14131336320382', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(415, 236, NULL, 'CALLE NAZARENO N° 33 - SUNAMPE', 'NINGUNA', '-13.429351274449589, -76.15597943526488', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(416, 237, NULL, 'Nuevo condorillo, san valentin B. 16', 'NINGUNA', '-13.433091622506089, -76.11977374444604', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(417, 238, NULL, 'AV. SAN ANTONIO NRO. 396 - GUAYABO', 'ANTES DE LA 2DA LOZA', '-13.4208715748947, -76.14706497118101', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(418, 620, NULL, 'Carretera Sunampe 351 pasando San Ignacio', 'NINGUNA', '-13.41587139548157, -76.15340191217544', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(419, 239, NULL, 'TOMA DE CALA LT. 17 - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.429218950725302, -76.12251525023778', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(420, 240, NULL, 'PASAJE TUPAC AMARTU 132 CRUZ BLANCA', 'NINGUNA', '-13.429858806192117, -76.11585764132911', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(421, 241, NULL, 'Condorillo Alto Mz. Z Lt. 16, pasando la Posta', 'NINGUNA', '-13.437519417573654, -76.1115956962839', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(422, 242, NULL, 'Centro poblado condorillo alto, m z lt 7', 'NINGUNA', '-13.437366772093169, -76.11193354473862', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(423, 243, NULL, 'Av. San pedro de pilpa 133 - Lomo largo - Sunampe', 'NINGUNA', '-13.41758874813199, -76.16166665428675', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(424, 244, NULL, 'BARRIO EL PORVENIR MZ E LOTE 19 - GROCIO PRADO', 'NINGUNA', '-13.403470081027697, -76.16548369001141', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(425, 245, NULL, 'Av. Fatima 363 - Sunampe', 'NINGUNA', '-13.429172077141567, -76.16042487129809', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(426, 246, NULL, 'PSJ. SANTA ROSA S/N - CRUZ BLANCA', 'NINGUNA', '-13.42863037548039, -76.11158318574098', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(427, 247, NULL, 'C.P. CONDORILLO ALTO MZ. N LT. 02 - CHINCHA', 'NINGUNA', '-13.416243589499867, -76.1358723449069', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(428, 248, NULL, 'psj. Santa Angela lt. 05 Cruz Blanca', 'NINGUNA', '-13.4234413843482, -76.1265963970361', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(429, 249, NULL, 'AA.HH. Mina de oro Mz. A lt. 10 - Sunampe', 'NINGUNA', '-13.428248436333208, -76.14362222612961', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(430, 250, NULL, 'PILPA PASANDO LA CAPILLA', 'NINGUNA', '-13.416769414481632, -76.16768033502277', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(431, 251, NULL, 'condorillo alto S/N antes del colegio', 'NINGUNA', '-13.416241208402209, -76.13587221637277', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(432, 252, NULL, 'Psj. Cachuy - Lomo largo', 'NINGUNA', '-13.4199384355038, -76.1632693375083', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(433, 253, NULL, 'PSJ. SANTOS CHOCANO N° 148', 'NINGUNA', '-13.415023152519526, -76.16287966972122', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(434, 254, NULL, 'Av. Fatima Sunampe', 'NINGUNA', '-13.42808123046308, -76.15951870484626', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(435, 255, NULL, 'San pedro de pilpa - Sunampe', 'NINGUNA', '-13.417392654290643, -76.16364474777835', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(436, 256, NULL, 'Calle San Antonio125 lomo largo', 'NINGUNA', '-13.422150358599431, -76.16918823392629', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(437, 257, NULL, 'Av. Paraiso Lomo largo, psj. Emeterio 151 - Sunampe', 'NINGUNA', '-13.42068645399083, -76.16767219835498', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(438, 258, NULL, 'CALLE LOS ANGELES N368 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.419340626672835, -76.16894767434908', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(439, 259, NULL, 'Av. Emancipación 390 - Sunampe', 'Frente al local Venture', '-13.426065368232196, -76.15972446991825', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(440, 260, NULL, 'Av. Paraiso 29 - lomo largo - sunampe', 'NINGUNA', '-13.419813600112544, -76.16402077460785', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(441, 261, NULL, 'Avenida principal mz A Lt 11 , centro Poblado Condorillo Alto', 'Por la bodega Charito', '-13.438314770443105, -76.108847742463', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(442, 262, NULL, 'Sunampe Av. Fatima lt.29', 'NINGUNA', '-13.427524533498135, -76.16025366087766', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(443, 263, NULL, 'BARRIO EL PORVENIR N°485 - GROCIO PRADO', 'NINGUNA', '-13.404644936105814, -76.16660984309196', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(444, 264, NULL, 'CALLE JUAN CASTILLO RONCEROS S/N - GROCIO PRADO', 'NINGUNA', '-13.40588765480797, -76.16194965168856', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(445, 266, NULL, 'Prolong. Benavides', 'NINGUNA', '-13.405501432125721, -76.1617572637237', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(446, 267, NULL, 'Av. alameda 232 - Sunampe', 'NINGUNA', '-13.421409867964867, -76.16049684216348', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(447, 268, NULL, 'Condominio San Pablo Lt. 17', 'NINGUNA', '-13.417093872159908, -76.15511868200977', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(448, 269, NULL, 'SAN PEDRO DE PILPA LT 39 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.41666844334502, -76.17075110223385', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(449, 270, NULL, 'Condorillo alto Mz. O lt. 10', 'NINGUNA', '-13.436278680894272, -76.11591581243621', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(450, 271, NULL, 'panamericana sur km. 16-17', 'Antes de la ENTRADA DE GROCIO', '-13.411560910081414, -76.15929159217572', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(451, 272, NULL, 'Condorillo Alto, De la pista principal hacia abajo', 'NINGUNA', '-13.437207448951224, -76.10940353491017', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(452, 273, NULL, 'Psj. Primavera - Cruz blanca', 'NINGUNA', '-13.430271899273626, -76.12103768603352', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(453, 274, NULL, 'Av. Unión n°107 Puerta 05 A , Centro Poblado Santa Rosa- Cruz Blanca', 'NINGUNA', '-13.430797927126513, -76.12150205046618', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(454, 275, NULL, 'Calle Santa Teresa Lt. 8', 'En la misma tienda chipana', '-13.42915318809097, -76.1749298590611', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(455, 276, NULL, 'San Juan con San pedro de pilpa - Sunampe', 'NINGUNA', '-13.417161140477825, -76.16434633206269', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(456, 624, NULL, 'CL. Santa Teresa 355 Entrada a Sant aFe- Sunampe', 'NINGUNA', '-13.42933217385414, -76.17489832998675', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(457, 277, NULL, 'Santo Toribio #120 - Sunampe', 'por atrás de pilpa', '-13.413743108332069, -76.16003239403511', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(458, 278, NULL, 'AV. MELCHORITA N° 1216 - GROCIO PRADO', 'NINGUNA', '-13.40939548255217, -76.16099967080925', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(459, 279, NULL, 'Av. San Valentin Mz Y Lote 2 -Condorillo alto', 'A una cuadra de la posta', '-13.437224397912804, -76.11348200975107', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(460, 280, NULL, 'Av. Arenales s/n', 'Pasando el megamercado de cruz blanca', '-13.425778974157756, -76.12266644686031', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(461, 281, NULL, 'Av. la alameda nº 232 interior 5 - Sunampe', 'NINGUNA', '-13.421381673665788, -76.16029366390175', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(462, 282, NULL, 'AV. HUASCAR N108 - SAN IGNACIO - SUNAMPE', 'NINGUNA', '-13.41825515041524, -76.15388151425769', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(463, 283, NULL, 'Psj. Santa Rosa - Cruz Blanca - Oruro parte Alta', 'NINGUNA', '-13.428774080471994, -76.11207832927431', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(464, 284, NULL, 'Calle Sebastián Barranca S/N - Cruz Blanca', 'NINGUNA', '-13.429194450378423,-76.11996459960938', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(465, 285, NULL, 'AV. 28 de Julio 909 - Grocio Prado', 'NINGUNA', '-13.407942306566717, -76.1627124454567', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(466, 286, NULL, 'Calle san vicente ferrer parada de los amigos nº 300 int. 5 - sunampe', 'NINGUNA', '-13.412124743283078, -76.16254365536973', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(467, 287, NULL, 'Psj santa rosa cruz blanca espalda estadio', 'NINGUNA', '-13.42873557991508, -76.12202575028351', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(468, 288, NULL, 'CRUZ BLANCA PSJ SANTA ROSA', 'NINGUNA', '-13.428806880798989, -76.12212064326239', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(469, 289, NULL, 'Psj. La victoria - Lomo largo - San Pedro de pilpa - Sunampe', 'NINGUNA', '-13.429867659778523, -76.11811823078715', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(470, 290, NULL, 'Calle el carmen 107 - Cruz blanca', 'NINGUNA', '-13.428727258966063, -76.11942712636008', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(471, 291, NULL, 'Av. Melchorita nº 813- Grocio Prado', 'Colegio media luna espalda del restaurante Yanella', '-13.406602239668246, -76.16006858795497', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(472, 292, NULL, 'Av. San Antonio M. c Lt. 06 - Sunampe', 'NINGUNA', '-13.419942048035274, -76.14945765908419', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(473, 293, NULL, 'CL. ANDRES CORCINO Nº 154 B - EL PORVENIR - GROCIO PRADO', 'NINGUNA', '-13.404511233190934, -76.16420184444902', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(474, 294, NULL, 'Av. san pedro de pilpa 159 int B', 'NINGUNA', '-13.417534884964152, -76.1619997825571', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(475, 295, NULL, 'Urb. las palmeras F15 Huaca grande', 'NINGUNA', '-13.428105138576202, -76.15822653628284', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(476, 296, NULL, 'Av Santa Rosa 229 Sunampe', 'NINGUNA', '-13.418723456297851, -76.15696980276701', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(477, 297, NULL, 'Calle las lomas  - La Victoria Sunampe', 'NINGUNA', '-13.429346192174306, -76.16989625969906', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(478, 298, NULL, 'CALLE LIMA 349- Sunampe', 'A DOS PUERTAS DE LA POLLERÍA AJÍ SECO', '-13.427238702524454, -76.16651310064458', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(479, 299, NULL, 'espalda del habana club - Sunampe', 'NINGUNA', '-13.425014112411548, -76.15918744538689', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(480, 300, NULL, 'LA VICTORIA Nº 128', 'NINGUNA', '-13.429744181752007, -76.16912670021614', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(481, 301, NULL, 'CALLE SANTA TERESA, CENTRO POBLADO SANTA FE', 'NINGUNA', '-13.429882803904631, -76.17491281027434', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(482, 302, NULL, 'CL. SAN IGNACIO MZ.  I1 LT. 04 - SUNAMPE', 'NINGUNA', '-13.419127647923606, -76.15640387528867', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(483, 303, NULL, 'Av. Alva Maurtua - Cruz blanca', 'NINGUNA', '-13.42921357552648, -76.11580879282944', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(484, 304, NULL, 'A.A.H.H NUEVO SAN VALENTIN B15', 'NINGUNA', '-13.433149375873157, -76.11976924542407', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(485, 305, NULL, 'AV. JOSE SANTOS CHOCANO N155 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.41534831664028, -76.16338433376238', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(486, 306, NULL, 'A.A.H.H NUEVO SAN VALENTIN - PRIMERA ENTRADA', 'NINGUNA', '-13.432971585938597, -76.12026402282932', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(487, 307, NULL, 'San Pedro de Pilpa - PSJE SAN BLAS Nro.Lote 09 Sunampe', 'NINGUNA', '-13.406019867570778, -76.16101383576465', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(488, 308, NULL, 'AV. EL PORVENIR LOTE 30', 'CASA DE 2 PISOS, COSTADO DE UNA TIENDA', '-13.402326071445925, -76.16147875167053', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(489, 309, NULL, 'AV. SAN RAFAEL 258 - Grocio Prado', 'NINGUNA', '-13.408351455350203, -76.16314864098949', '2025-02-26 22:24:05', NULL, NULL, 1, NULL, NULL),
(490, 310, NULL, 'C.P. CONDORILLO ALTO MZ R LT 10 - CHINCHA', 'NINGUNA', '-13.436520058419113, -76.11397735774617', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(491, 311, NULL, 'Pado de Gómez N 102    C. P  Huaca Grande.', 'NINGUNA', '-13.424408560607665, -76.15603694586666', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL);
INSERT INTO `tb_clientes` (`id_cliente`, `id_persona`, `id_empresa`, `direccion`, `referencia`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(492, 312, NULL, 'AV. SAN RAFEEL SN - GROCIO PRADO', 'NINGUNA', '-13.4070281042798, -76.16230602018504', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(493, 313, NULL, 'Urb Las Palmeras Mz. D, lote 14, Huaca Grande, Sunampe.', 'NINGUNA', '-13.42759273015186, -76.15731628421283', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(494, 314, NULL, 'Av.union santa rosa #111 - CRUZ BLANCA', 'NINGUNA', '-13.428734732900189, -76.12227222625863', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(495, 315, NULL, 'Cruz blanca, toma de cala', 'NINGUNA', '-13.427753260552223, -76.12299310749519', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(496, 316, NULL, 'URB. SAN ANTONIO Nº 127 - CERCADO SUNAMPE', 'NINGUNA', '-13.426434611623758, -76.16718754388214', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(497, 318, NULL, 'Calle santa Rosa 153 sunampe chincha', 'NINGUNA', '-13.426564633679295, -76.16753692670876', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(498, 320, NULL, 'Av. Paraiso - Lomo largo - Sunampe', 'NINGUNA', '-13.421103850672914, -76.16679370359485', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(499, 321, NULL, 'Av. San Francisco 191 - San Ignacio - Sunampe', 'NINGUNA', '-13.417068737967465, -76.15249930623665', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(500, 322, NULL, 'AV. SANTA ROSA S/N (SEGUNDA ENTRADA) - SUNAMPE', 'NINGUNA', '-13.42094296582253, -76.15518723818572', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(501, 323, NULL, 'Av. San Pedro de Pilpa - Sunampe', 'NINGUNA', '-13.41748366215299, -76.1622136137891', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(502, 324, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. F LT. 10, CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.427556169725106, -76.12417969305913', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(503, 325, NULL, 'ENTRADA CONDORILLO PSJ GONZALES PRADA 205', 'NINGUNA', '-13.430256543311078, -76.11493977146503', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(504, 326, NULL, 'PSJ. JASMIN S/N, MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.425781399612742, -76.14545867645504', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(505, 327, NULL, 'Av. San Antonio   - Santa Rosa - Sunampe', 'NINGUNA', '-13.421581299021499, -76.15718895865567', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(506, 328, NULL, 'Av.melchorita 506 - grocio prado', 'NINGUNA', '-13.402640460796281, -76.15839193286943', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(507, 329, NULL, 'AV. San ignacio 147 - Sunampe', 'NINGUNA', '-13.419536590576172,-76.1566390991211', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(508, 330, NULL, 'Av.fatima sunampe sn', 'NINGUNA', '-13.429291795630956, -76.1596196485705', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(509, 331, NULL, 'Calle Santa tereza 281-Sunampe', 'NINGUNA', '-13.426273760135254, -76.16605282278745', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(510, 332, NULL, 'Calle La Victoria 247 - Sunampe', 'NINGUNA', '-13.430129476613173, -76.17045612396113', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(511, 333, NULL, 'Av.fatima última cuadra , pasando bodega Viña San Francisco', 'NINGUNA', '-13.429626577587536, -76.16049674206778', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(512, 334, NULL, 'PSJE SAN PEDRO Nª PUERTA 11 SIN BARRIO C.P. HUACA GRANDE- SUNAMPE', 'NINGUNA', '-13.430773801360594, -76.1590597064315', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(513, 335, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. L LT. 26- Cruz Blanca', 'NINGUNA', '-13.427309926089958, -76.12339441575645', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(514, 336, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. H LT. 02 - CRUZ BLANCA', 'NINGUNA', '-13.42743224048799, -76.12396873931684', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(515, 337, NULL, 'Ulises San Valentín manzana Gn Lote 4- Condorillo', 'NINGUNA', '-13.43301029089026, -76.11991519309291', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(516, 338, NULL, 'Psj Sucre espalda del estadio mina de oro', 'NINGUNA', '-13.42585365254978, -76.14520342608343', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(517, 339, NULL, 'CL. SAN ANTONIO S/N, BARRIO MELCHORITA II - GROCIO PRADO', 'NINGUNA', '-13.407269210212192, -76.16142203120069', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(518, 340, NULL, 'AV. PRINCIPAL S/N, HUACA GRANDE', 'NINGUNA', '-13.426424173845735, -76.15721990731062', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(519, 341, NULL, 'CALLE 2 DE MAYO, PSJ. SAN JUAN DE DIOS NRO 27 - CRUZ BLANCA', 'NINGUNA', '-13.429006726195178, -76.11855482202434', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(520, 342, NULL, 'PSJ. SANTA ANGELA, FRENTE AL MEGA MERCADO - CRUZ BLANCA', 'NINGUNA', '-13.426343385838988, -76.12449809078947', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(521, 343, NULL, 'PSJ. SAN GREGORIO S/N', 'LA ALAMEDA  - SUNAMPE', '-13.42134963065632, -76.15973780792604', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(522, 344, NULL, 'CONDOMINIO SAN PABLO - SUNAMPE', 'NINGUNA', '-13.41688652019325, -76.1552906593292', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(523, 350, NULL, 'Av. Fatima - Sunampe  710', 'NINGUNA', '-13.43437146547172, -76.11580566384147', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(524, 351, NULL, 'AV. HUASCAR 130  A - SAN IGNACIO', 'NINGUNA', '-13.417992507149243, -76.15342781749762', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(525, 352, NULL, 'AV. HUASCAR - SAN IGNACIO', 'NINGUNA', '-13.417996656026991, -76.15342750371669', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(526, 353, NULL, 'AV. PARAISO - LOMO LARGO', 'COSTADO DE LA CAPILLA CACHUY', '-13.42001281579753, -76.16317928566961', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(527, 354, NULL, 'Pasaje la frontera 136 - lomo largo', 'Antes de la Scorpia', '-13.42130378262127, -76.17264006235045', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(528, 355, NULL, 'AV. HUASCAR 130 - SAN IGNACIO- SUNAMPE', 'PLAZUELA DE SAN IGNACIO 1 CDA ADELANTE', '-13.418004945314195, -76.15342699863429', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(529, 628, NULL, 'PSJ ALMEYDA, LA ALAMEDA - SUNAMPE', 'NINGUNA', '-13.421384791591862, -76.16017671967717', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(530, 356, NULL, 'Huaca grande Lt. 55-04 - Sunampe', 'NINGUNA', '-13.42622966912492, -76.15732667483995', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(531, 357, NULL, 'Av san jose 29 - huaca grande', 'NINGUNA', '-13.42914305101387, -76.15747351222157', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(532, 358, NULL, 'TOMA DE CALA LOTE 11 - CRUZ BLANCA', 'NINGUNA', '-13.428311603671764, -76.12350993303802', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(533, 359, NULL, 'CALLE NUEVA ESPERANZA S/N - GROCIO PRADO', 'NINGUNA', '-13.407836730141883, -76.16284699916224', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(534, 360, NULL, 'PSJE VILLA S/N-PARADA DE LOS AMIGOS GROCIO PRADO', 'Pasando la capilla', '-13.411295429378585, -76.16451139549032', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(535, 361, NULL, 'AA.HH SAN VALENTIN F-4, CC.PP. CONDORILLO ALTO', 'NINGUNA', '-13.433379400662178, -76.12041926183728', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(536, 362, NULL, 'Calle jorge chavez Mz B Lote 16  CHACARITA', 'NINGUNA', '-13.438138694507849, -76.13655158130489', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(537, 363, NULL, 'PSJ. PACHAS - MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.425658280115915, -76.14077830642927', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(538, 364, NULL, 'Calle jorge Chávez Mz CLt 24-Barrio chacarita', 'NINGUNA', '-13.43828723705633, -76.13705133201292', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(539, 365, NULL, 'CALLE LAS FLORES S/N - CHACARITA', 'NINGUNA', '-13.437906325824613, -76.13765131947025', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(540, 366, NULL, 'Pasaje beata melchorita-Cruz blanca', 'Por el colegio 22234 a la mano derecha al fondo', '-13.429930061932035, -76.11766293571434', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(541, 367, NULL, 'AV. LAS FLORES N134 - CHACARITA', 'NINGUNA', '-13.438867634326217, -76.13928646214514', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(542, 368, NULL, 'CALLE LOS ANGELES 442, LOMO LARGO', 'NINGUNA', '-13.41934437496944, -76.16971201100152', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(543, 369, NULL, 'AV. SAN RAFAEL S/N - GROCIO PRADO', 'NINGUNA', '-13.407152337914958, -76.162458072065', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(544, 370, NULL, 'CALLE SAN PEDRO DE PILPA N° 156-02 - SUNAMPE', 'NINGUNA', '-13.417540641415195, -76.16162022427345', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(545, 371, NULL, 'Calle San Blas 440 - San Pedro de Pilpa', 'NINGUNA', '-13.41531927725892, -76.16862377058659', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(546, 372, NULL, 'SAN PEDRO DE PILPA N514 - SUNAMPE', 'NINGUNA', '-13.416598443242178, -76.16676856555722', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(547, 373, NULL, 'AV. ALVA MAURTUA N106 - CRUZ BLANCA', 'Frente a la plaza de Armas', '-13.428554805500115, -76.11967636010927', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(548, 374, NULL, 'CALLE TUPAC AMARU Nª 395 - SUNAMPE', 'Espalda de la Munic', '-13.430347136365011, -76.12248756825923', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(549, 375, NULL, 'PSJ TORRES - CRUZ BLANCA', 'NINGUNA', '-13.425800899881995, -76.12696095786092', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(550, 376, NULL, 'AV. PRIMAVERA N° 300 - SUNAMPE', 'NINGUNA', '-13.428110801411488, -76.16662245966185', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(551, 377, NULL, 'AV. PARAISO, PSJ. 17 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.41989413563799, -76.16306555205867', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(552, 378, NULL, 'PSJ. PARADA DE LOS AMIGOS MZ.E    LT. 8 - SUNAMPE', 'NINGUNA', '-13.411596683433435, -76.16330961159422', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(553, 379, NULL, 'CONDOMINIO LAS PALMERAS B-29 - C.P. HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.427592817112751, -76.1570326243143', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(554, 380, NULL, 'AV. SAN CRISTOBAL N196, VILLA JULIA - SUNAMPE', 'NINGUNA', '-13.43606073324707, -76.12171151943784', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(555, 381, NULL, 'C.P. CONDORILLO ALTO MZ E LT 02 - CHINCHA', 'NINGUNA', '-13.435767434126653, -76.12170317563965', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(556, 382, NULL, 'Psj. Jose Olaya ex pilpa', 'NINGUNA', '-13.422672700127448, -76.12796668179472', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(557, 383, NULL, 'AA.HH. LA UNION HACE LA FUERZA MZ. D LT. 10 -  SUNAMPE', 'NINGUNA', '-13.427561969468616, -76.14332132877549', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(558, 384, NULL, 'CALLE JORGE CHAVEZ MZ C LT 17, CHACARITA - SUNAMPE', 'NINGUNA', '-13.43822804501987, -76.13693093335948', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(559, 385, NULL, 'AV. PROGRESO N398 - INT 10 - CONDORILLO', 'NINGUNA', '-13.435877058536606, -76.13112463586806', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(560, 386, NULL, 'MINA DE ORO MZ B LT 01 - SUNAMPE', 'NINGUNA', '-13.42851965538365, -76.14357159664266', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(561, 387, NULL, 'AV. FATIMA S/N - SUNAMPE', 'NINGUNA', '-13.429017661766126, -76.160288189593', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(562, 388, NULL, 'AV. LA ALAMEDA Nº215 - SUNAMPE', 'NINGUNA', '-13.421404608015873, -76.1608257703391', '2025-02-26 22:24:06', NULL, NULL, 1, NULL, NULL),
(563, 389, NULL, 'PANAMERICANA SUR 1769, entrada de parada de los amigos', 'NINGUNA', '-13.410633082661933, -76.16265443417164', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(564, 390, NULL, 'AV. SANTA RITA N°204 (AMERICA) - CHINCHA ALTA', 'NINGUNA', '-13.432816072894695, -76.13292394924221', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(565, 629, NULL, 'AV. JOSE OLAYA, PSJ. LOS CIRUELOS S/N - AMERICA - CHINCHA', 'NINGUNA', '-13.431745903420257, -76.1297903358184', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(566, 391, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ B LT 09 - CRUZ BLANCA', 'NINGUNA', '-13.426921139545849, -76.12229693425527', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(567, 392, NULL, 'AV. PARAISO S/N, LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.418746724947068, -76.16137820404218', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(568, 393, NULL, 'PSJ. JOSE OLAYA N°899', 'CHINCHA ALTA (La playita)', '-13.423298484811356, -76.12815139604889', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(569, 394, NULL, 'PSJ. JOSE OLAYA N° 137 - SANTA MARIA / JOSE OLAYA - CHINCHA', 'NINGUNA', '-13.429595969970956, -76.12868700120318', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(570, 395, NULL, 'AV. SANTO TOMAS N109 - CHINCHA ALTA', 'NINGUNA', '-13.428009717197519, -76.13732364855078', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(571, 396, NULL, 'AV. SANTA ROSA S/N - SUNAMPE', 'Frente al estadio sunampe', '-13.426706502614604, -76.16697302783233', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(572, 397, NULL, 'PASO DE GOMEZ Nº140 - SUNAMPE', 'NINGUNA', '-13.424579183477109, -76.15558730709945', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(573, 398, NULL, 'CALLE LAS NAZARENAS Nº36 - HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.429338361603403, -76.15607039111592', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(574, 399, NULL, 'PSJ. UNION SANTA ROSA - CRUZ BLANCA', 'NINGUNA', '-13.430345848876364, -76.12226381148709', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(575, 400, NULL, 'CL TOMA DE CALA LT17, CRUZ BLANCA', 'NINGUNA', '-13.428726950009105, -76.12220081694913', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(576, 401, NULL, 'PSJ. JORGE CHAVEZ S/N - SUNAMPE', 'NINGUNA', '-13.426909426830115, -76.13797828323483', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(577, 402, NULL, 'AV. PARAISO OESTE 317 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.430111194695732, -76.11886109059807', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(578, 403, NULL, 'AV. ALVA MAURTUA LOTE 07 - CRUZ BLANCA', 'AL LADO DE RECEPCIONES EVAS 2', '-13.428752514762298, -76.11652020351346', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(579, 404, NULL, 'CALLE JORGE CHAVEZ MZ. C LT. 24, CHACARITA - SUNAMPE', 'NINGUNA', '-13.438464700612215, -76.13707706466599', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(580, 405, NULL, 'BARRIO EL PORVENIR, PSJ MAGALLANES S/N - GROCIO PRADO', 'NINGUNA', '-13.40176663630732, -76.1633278727916', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(581, 406, NULL, 'PSJ. PRIMAVERA S/N - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.430094358975117, -76.12109482464612', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(582, 407, NULL, 'PSJ. SAN FRANCISCO 191 - SAN IGNACIO - SUNAMPE', 'NINGUNA', '-13.41685724211973, -76.15220412888391', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(583, 408, NULL, 'AV. PRIMAVERA N710, C.P. LA VICTORIA - SUNAMPE', 'NINGUNA', '-13.430135868284243, -76.17469530328391', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(584, 409, NULL, 'AV. LA MAR N° 468 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.419534667156515, -76.17364251470752', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(585, 410, NULL, 'AV. VICTORIA N341 - CRUZ BLANCA', 'NINGUNA', '-13.424836751373848, -76.12895376927283', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(586, 411, NULL, 'PSJ. SANTA ROSA ORURO N100-01 - CRUZ BLANCA', 'NINGUNA', '-13.412961467814299, -76.16073498093868', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(587, 412, NULL, 'CALLE TUPAC AMARU N340 - SUNAMPE', 'NINGUNA', '-13.427496700741068, -76.16141322601842', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(588, 413, NULL, 'PSJ. 2 DE MAYO N° 309 - CRUZ BLANCA', 'NINGUNA', '-13.430111420333796, -76.11886204871183', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(589, 414, NULL, 'C.P. CONDORILLO ALTO MZ. I LT. 12 - CHINCHA', 'NINGUNA', '-13.434342812630636, -76.11650597609436', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(590, 415, NULL, 'PSJ. RENOVACION S/N - CERCADO GROCIO PRADO', 'NINGUNA', '-13.411373832691801, -76.1628506376645', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(591, 416, NULL, 'AV. SAN CRISTOBAL N°196 - 14 - C.P. SAN IGNACIO - SUNAMPE', 'NINGUNA', '-13.419169126089797, -76.14954960682611', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(592, 417, NULL, 'PSJ. VILLA S/N, CALLE SAN VICENTE DE FERRER - SUNAMPE', 'NINGUNA', '-13.410989872221789, -76.16373512912483', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(593, 418, NULL, 'CALLE JOSE SANTOS CHOCANO N°146 - SAN PEDRO DE PILPA - SUNAMPE', 'NINGUNA', '-13.412929216217474, -76.16074401982402', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(594, 419, NULL, 'AV. SAN ANTONIO, PSJ. 58 PUERTA N°165 - SUNAMPE', 'NINGUNA', '-13.421094971823743, -76.15717054882616', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(595, 420, NULL, 'AV. ALFONSO UGARTE Nº 140 - CERCADO DE SUNAMPE', 'NINGUNA', '-13.429459405643673, -76.16333923897334', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(596, 421, NULL, 'CALLE VICTOR RAUL HAYA DE LA TORRE - CHACARITA', 'NINGUNA', '-13.438171802572693, -76.13543507883959', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(597, 422, NULL, 'AA.HH. JESUS MARIA Y JOSE MZ. C LT 01. - CHACARITA - SUNAMPE', 'NINGUNA', '-13.43960611028296, -76.13683578903894', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(598, 423, NULL, 'PSJ. BENAVIDES N° 138-04 - CERCADO CHINCHA ALTA (PROGRESO)', 'NINGUNA', '-13.427646232615945, -76.12791458226613', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(599, 424, NULL, 'URB. LEON DE VIVERO MZ. 17 LT 03 - PUEBLO NUEVO', 'NINGUNA', '-13.393790568494259, -76.14250765503573', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(600, 425, NULL, 'SAN PEDRO DE PILPA S/N - SUNAMPE', 'NINGUNA', '-13.416688535457093, -76.16286188765062', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(601, 426, NULL, 'UPIS KEIKO SOFIA MZ. U LT. 12 - PUEBLO NUEVO', 'NINGUNA', '-13.395019543529333, -76.14585500491341', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(602, 427, NULL, 'AA.HH. EL SALVADOR MZ. N LT. 06 - PUEBLO NUEVO', 'NINGUNA', '-13.39547575420927, -76.14234330213098', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(603, 428, NULL, 'AV. PROGRESO N° 309 - CERCADO DE CHINCHA', 'NINGUNA', '-13.434866364836372, -76.13144443870947', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(604, 429, NULL, 'CL. EL CARMEN N°207 (PSJ. LOS CIRUELOS) - CRUZ BLANCA', 'NINGUNA', '-13.432373809687189, -76.11952825609576', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(605, 430, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. E LT. 10 - CRUZ BLANCA', 'NINGUNA', '-13.427559110770954, -76.1238580511754', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(606, 431, NULL, 'AV. SANTA RITA S/N, PSJ. JABONCILLO - CONDORILLO BAJO - CHINCHA', 'NINGUNA', '-13.43211936609776, -76.1301964137852', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(607, 432, NULL, 'AA.HH. BEATA MELCHORITA MZ. H LT. 10 - PUEBLO NUEVO', 'NINGUNA', '-13.390989006450418, -76.14743478598828', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(608, 433, NULL, 'PSJ. SAN NICOLAS N° 257 - C.P. MONTE RICO MZ. P LT. 05 - SUNAMPE', 'NINGUNA', '-13.431010591622575, -76.16488692814731', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(609, 434, NULL, 'CL. NUEVA ESPERANZA LT. 29, BARRIO MELCHORITA II - GROCIO PRADO', 'NINGUNA', '-13.405996236273332, -76.16101095701133', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(610, 435, NULL, 'PSJ. EMANCIPACION S/N, PASO DE GOMEZ - SUNAMPE', 'NINGUNA', '-13.425958355490152, -76.15776258109992', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(611, 436, NULL, 'URB. LEON DE VIVERO MZ. J1 LT. 20 - PUEBLO NUEVO', 'NINGUNA', '-13.392445259883383, -76.14229621679269', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(612, 437, NULL, 'FUNDO COLORADO MZ. C LT. 07 - GROCIO PRADO', 'NINGUNA', '-13.380826407184612, -76.15513040288293', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(613, 438, NULL, 'FUNDO COLORADO, SAN LUIS LT.08', 'NINGUNA', '-13.38086120472437, -76.1552863885931', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(614, 439, NULL, 'AV. ALVA MAURTUA MZ. O LT. 05, PSJ SOTELO - CRUZ BLANCA', 'NINGUNA', '-13.428728591619175, -76.11651880301807', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(615, 440, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. C LT.06 - CHINCHA ALTA', 'NINGUNA', '-13.427180980223376, -76.12318513843873', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(616, 441, NULL, 'AA.HH VIRGEN DEL CARMEN MZ. G LT. 15 - CHINCHA ALTA', 'NINGUNA', '-13.426666129387382, -76.12363299099732', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(617, 442, NULL, 'FUNDO COLORADO LT Nº2 PROLONGACIÓN SEBASTIÁN BARRANCA', 'NINGUNA', '-13.382393868853958, -76.15485834111882', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(618, 443, NULL, 'C.P. CONDORILLO ALTO MZ. H LT. 8 - CHINCHA', 'NINGUNA', '-13.433182551697161, -76.12030204384183', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(619, 444, NULL, 'URB. LEON DE VIVERO MZ. 17 LT. 07 - PUEBLO NUEVO', 'NINGUNA', '-13.394018220035166, -76.14245879675765', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(620, 445, NULL, 'FUNDO COLORADO MZ. C LT.03 - GROCIO PRADO', 'NINGUNA', '-13.382240033167419, -76.15501714094079', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(621, 446, NULL, 'AA.HH. EL SALVADOR MZ. F LT. 14 - PUEBLO NUEVO', 'NINGUNA', '-13.396621291486849, -76.14089077787574', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(622, 447, NULL, 'PSJ. SARAVIA S/N - CERCADO DE GROCIO PRADO', 'NINGUNA', '-13.410931280026999, -76.16371108490736', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(623, 448, NULL, 'AV. FATIMA 1 LT. 03 - SUNAMPE', 'NINGUNA', '-13.42632396384232, -76.15958713247512', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(624, 449, NULL, 'AV. SAN FRANCISCO N°156 - SAN IGNACIO - SUNAMPE', 'NINGUNA', '-13.416529185612916, -76.15279849279436', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(625, 450, NULL, 'León de vivero mz 3 lt 16- pueblo nuevo', 'NINGUNA', '-13.397184392913223, -76.14150306477204', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(626, 451, NULL, 'AA.HH. EL SALVADOR MZ. F LT. 01 - PUEBLO NUEVO', 'NINGUNA', '-13.397179143526433, -76.14150606057075', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(627, 452, NULL, 'AA.HH. BEATA MELCHORITA MZ. C LT. 05 - PUEBLO NUEVO', 'NINGUNA', '-13.389961367821613, -76.14643579137716', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(628, 453, NULL, 'URB. LEON DE VIVERO MZ. 04 LT. 07 - PUEBLO NUEVO', 'NINGUNA', '-13.389369463808436, -76.14647675841168', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(629, 454, NULL, 'PSJ. RAMON CASTILLA N° 135 - SUNAMPE (CHACARITA)', 'NINGUNA', '-13.433696595216038, -76.1402784217099', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(630, 455, NULL, 'Av. Las Nazarenas S/N del Centro Poblado', 'NINGUNA', '-13.429972388696182, -76.15616524845082', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(631, 456, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. E LT. 8 - CHINCHA ALTA', 'NINGUNA', '-13.427500653447508, -76.12397323896312', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(632, 457, NULL, 'C.P. CONDORILLO ALTO MZ. O LT. 04 - CHINCHA', 'NINGUNA', '-13.43627838636762, -76.11624956068754', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(633, 458, NULL, 'AV. SANTA ROSA N° 312 - C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.424110321919065, -76.16802748313492', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(634, 459, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. I LT. 6 - CHINCHA ALTA', 'NINGUNA', '-13.427192983297864, -76.12352848165622', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(635, 460, NULL, 'CL. SAN PEDRO DE PILPA N°172 - ALFONSO UGARTE - SUNAMPE', 'NINGUNA', '-13.417000565631536, -76.16786177276528', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(636, 461, NULL, 'AV. SAN MARTIN N°599, MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.433217705451355, -76.14401917179192', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(637, 462, NULL, 'URB. LEON DE VIVERO MZ. 17 LT. 5 - PUEBLO NUEVO', 'NINGUNA', '-13.393481853122376, -76.14147572498348', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(638, 463, NULL, 'CALLE SAN JUAN N°143, SAN PEDRO DE PILPA - SUNAMPE', 'NINGUNA', '-13.417804953070167, -76.16430576452794', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(639, 464, NULL, 'CL. SAN VICENTE FERRER, PUERTA B - CERCADO GROCIO PRADO', 'NINGUNA', '-13.411390363907458, -76.16439001302655', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(640, 465, NULL, 'CALLE LOS PALTOS N°117,  LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.433093930414934, -76.11993361006982', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(641, 466, NULL, 'PSJ LEVANO - LAS BEGONIAS N° A-02, DOS PUENTES - CHINCHA ALTA', 'NINGUNA', '-13.427077945758288, -76.13005458184752', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(642, 467, NULL, 'PSJ. SAN BLAS N° 160, BARRIO ALFONSO UGARTE - SUNAMPE', 'NINGUNA', '-13.417113436742053, -76.17002326639343', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(643, 468, NULL, 'CL. VICTOR RAUL HAYA DE LA TORRE S/N, CHACARITA - SUNAMPE', 'NINGUNA', '-13.43863167253537, -76.13527705596171', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(644, 469, NULL, 'CC.PP NUEVO CONDORILLO - SAN VALENTIN G-8', 'NINGUNA', '-13.43282245333188, -76.11983434075488', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(645, 470, NULL, 'UPIS VILLA ESPERANZA MZ. B LT. 15, MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.425878013141725, -76.14385914405844', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(646, 471, NULL, 'CL. SANTA ROSA N° 251 - SUNAMPE', 'NINGUNA', '-13.419488860589578, -76.1585282216539', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(647, 472, NULL, 'CC.PP. MINA DE ORO MZ. B LT.27 - SUNAMPE', 'NINGUNA', '-13.42640518120541, -76.14383288060843', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(648, 473, NULL, 'CC.PP CONDORILLO ALTO MZ F LOTE 33 - CHINCHA', 'NINGUNA', '-13.435654539835438, -76.12133526014375', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(649, 474, NULL, 'PSJE. SAN MIGUEL LOTE 06, BARRIO CHACARITA - SUNAMPE', 'NINGUNA', '-13.437602110203255, -76.13622136135349', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(650, 475, NULL, 'PSJE SAN MIGUEL MZ B LOTE 22, BARRIO CHACARITA - SUNAMPE', 'NINGUNA', '-13.417602637087484, -76.1576382126577', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(651, 476, NULL, 'C.P. CONDORILLO ALTO MZ. N - LT. 15 - CHINCHA ALTA', 'NINGUNA', '-13.436739373924809, -76.11758491047564', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(652, 626, NULL, 'CL. LOS PROCERES LT.26 - CHINCHA ALTA (CRUZ BLANCA)', 'NINGUNA', '-13.426534180726103, -76.12280575213221', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(653, 477, NULL, 'C.P. CONDORILLO ALTO - MZ N - LT. 16 - CHINCHA ALTA', 'NINGUNA', '-13.43716111974922, -76.11535987518604', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(654, 478, NULL, 'C.P. CONDORILLO ALTO - MZ. N  LT. 20 - CHINCHA ALTA', 'NINGUNA', '-13.436876289356169, -76.11603084556772', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(655, 479, NULL, 'C.P. CONDORILLO ALTO MZ. I - LT. 12 - CHINCHA ALTA', 'NINGUNA', '-13.43395508262943, -76.11742819987924', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(656, 480, NULL, 'CL. BENAVIDES N° 340, EL PORVENIR - GROCIO PRADO', 'NINGUNA', '-13.405239437013451, -76.16138857020961', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(657, 481, NULL, 'C.P CONDORILLO ALTO MZ. A - LT. 05, CONDORILLO ALTO - CHINCHA ALTA', 'NINGUNA', '-13.438684315728795, -76.10986363990328', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(658, 482, NULL, 'CL. VICTOR RAUL HAYA DE LA TORRE. PUERTA 1A - CHACARITA - SUNAMPE', 'NINGUNA', '-13.43874223961381, -76.13552741548604', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(659, 483, NULL, 'PSJ. PASO DE GOMEZ N° 104 - SUNAMPE', 'NINGUNA', '-13.42471893035874, -76.15460393669794', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(660, 484, NULL, 'AV. ALFONSO UGARTE N° 544 - SAN PEDRO DE PILPA - SUNAMPE', 'NINGUNA', '-13.413520300569358, -76.16427877709934', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(661, 485, NULL, 'PSJ. JOSE OLAYA N° 899 46 - CERCADO DE CHINCHA ALTA', 'NINGUNA', '-13.422572273012959, -76.12797404169812', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(662, 486, NULL, 'C.P. SAN ANTONIO MZ. F LT. 11, SANTA ROSA- SUNAMPE', 'NINGUNA', '-13.42209774035359, -76.14886217944155', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(663, 487, NULL, 'PSJ. AVALOS Nº 12 - PROGRESO - CHINCHA ALTA', 'NINGUNA', '-13.436875328731432, -76.13016914618328', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(664, 488, NULL, 'Pasaje Santo Domingo 102 -Santo Toribio- Sunampe', 'NINGUNA', '-13.413264637060445, -76.1610561911148', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(665, 489, NULL, 'C.P. CONDORILLO ALTO MZ. Z LT. 24 - CHINCHA ALTA', 'NINGUNA', '-13.437352812976178, -76.11013977612579', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(666, 490, NULL, 'PSJ. EL MILAGRO S/N, LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.420212898946584, -76.16716606521146', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(667, 491, NULL, 'CALLE EL CARMEN N° 207 - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.432179282854113, -76.11954371260782', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(668, 492, NULL, 'HUSARES DE JUNIN MZ. N LT. 11 - PUEBLO NUEVO', 'NINGUNA', '-13.393355406957586, -76.14930594044426', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(669, 493, NULL, 'AA.HH. VIRGEN DE FATIMA MZ B LT. 10 (AMERICA) - CHINCHA ALTA', 'NINGUNA', '-13.429849945666415, -76.13138834221564', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(670, 494, NULL, 'AV. LAS VIÑAS 500-12 - SUNAMPE', 'NINGUNA', '-13.424240093910218, -76.15836102075323', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(671, 495, NULL, 'URB. LEON DE VIVERO MZ. 17 LT. 4 - PUEBLO NUEVO', 'NINGUNA', '-13.394101666388902, -76.14222110918384', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(672, 496, NULL, 'CARRETERA SUNAMPE N° 128, C.P. HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.41401226459545, -76.1508051017261', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(673, 627, NULL, 'CALLE LAS VIÑAS S/N - SUNAMPE', 'NINGUNA', '-13.42354480029955, -76.159250283904', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(674, 497, NULL, 'CL. LAS FRONTERAS N° 181, C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.421822206631077, -76.17447160453766', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(675, 498, NULL, 'PSJ. HERNANDEZ 103-02 - CERCADO DE GROCIO PRADO', 'NINGUNA', '-13.403954247856012, -76.16705710128832', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(676, 499, NULL, 'C.P. NUEVO CONDORILLO (SAN VALENTIN) - CHINCHA', 'NINGUNA', '-13.43320963450338, -76.12030677540865', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(677, 500, NULL, 'PSJ. 2 DE MAYO LT. 07 - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.429463082823188, -76.1187491025173', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(678, 501, NULL, 'CL. 09 DE DICIEMBRE N° 151, CERCADO DE SUNAMPE', 'NINGUNA', '-13.4266816347943, -76.16344669732938', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(679, 502, NULL, 'CL. LA PALMA N° 114, TOMA DE CARRIZO - GROCIO PRADO', 'NINGUNA', '-13.398506169102689, -76.16155820430961', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(680, 503, NULL, 'PSJ. SAN JUAN LT. 94A - ALFONSO UGARTE - SUNAMPE', 'NINGUNA', '-13.419126494272545, -76.1642517229234', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(681, 504, NULL, 'CL. VICTOR RAUL HAYA DE LA TORRE MZ. K LT. 27 - CHACARITA - SUNAMPE', 'NINGUNA', '-13.43871169897933, -76.13558401332115', '2025-02-26 22:24:07', NULL, NULL, 1, NULL, NULL),
(682, 505, NULL, 'CL. SANTA TERESA S/N - BAJADA DEL SOCORRO - SUNAMPE', 'NINGUNA', '-13.429102262850202, -76.17497197200531', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(683, 506, NULL, 'AV. MONTERICO N° 405 - C.P. MONTE RICO - SUNAMPE', 'PASANDO EL COLEGIO SIMON BOLIVAR', '-13.430074690795642, -76.16341838129993', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(684, 507, NULL, 'CL. EL PORVENIR N° 113 8-D - EL PORVENIR - GROCIO PRADO', 'PASANDO VIÑA EL PATRON', '-13.402182190397909, -76.16366843069612', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(685, 508, NULL, 'PSJ. SUCRE Nº 470, ESPALDA DE MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.425463018180473, -76.14497572975705', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(686, 509, NULL, 'CC.PP. NUEVO CONDORILLO - SAN VALENTIN MZ. I LT. 12 - CHINCHA', 'NINGUNA', '-13.433540593563087, -76.11797331834916', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(687, 510, NULL, 'UR. PAGO DE PILPATOMA DE GONZALES MZ. SN LT. 2-1 - SUNAMPE - CHINCHA', 'NINGUNA', '-13.41684779225311, -76.15536095881399', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(688, 511, NULL, 'C.P. CONDORILLO ALTO MZ. N LT. 15 - CHINCHA', 'NINGUNA', '-13.436738598510615, -76.11730821730009', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(689, 512, NULL, 'AA.HH. SAN JUDAS TADEO MZ. E LT. 1 - SUNAMPE', 'NINGUNA', '-13.429349781563669, -76.14230868412778', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(690, 513, NULL, 'AA.HH. EL SALVADOR MZ. B LT. 17 - PUEBLO NUEVO', 'NINGUNA', '-13.397406937790064, -76.1406639889317', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(691, 514, NULL, 'AA.HH. SAN JUDAS TADEO MZ. E LT. 4 - SUNAMPE - CHINCHA', 'NINGUNA', '-13.429337461184122, -76.14230512009142', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(692, 515, NULL, 'AA.HH. SAN JUDAS TADEO MZ. E LT. 5 - SUNAMPE - CHINCHA', 'NINGUNA', '-13.429343574046866, -76.1423051017027', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(693, 516, NULL, 'AV. LUIS ALVA MAURTUA S/N - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.430546660856695, -76.11205501468658', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(694, 517, NULL, 'C.P. CONDORILLO ALTO MZ. U LT. 01 - CHINCHA ALTA', 'NINGUNA', '-13.436323117929504, -76.11444658174636', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(695, 518, NULL, 'CL BENAVIDES LT 11 - BARRIO EL PORVENIR - GROCIO PRADO', 'NINGUNA', '-13.405766000514747, -76.16130655012535', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(696, 519, NULL, 'LUIS MASSARO EX PILPA - PLAZA CENTER CHINCHA - FRENTE A USJB STAND 210-D', 'NINGUNA', '-13.416594848865872, -76.1424460517334', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(697, 520, NULL, 'AA.HH. VIRGEN DEL CARMEN MZ. B LT. 04 - CHINCHA ALTA', 'NINGUNA', '-13.42687130696271, -76.12300333676603', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(698, 521, NULL, 'AV. PARAISO LT. 5-B - C.P. PARAISO - SUNAMPE', 'NINGUNA', '-13.422705519294304, -76.17344499672132', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(699, 522, NULL, 'PROLG. BENAVIDES LT. 30 - GROCIO PRADO', 'NINGUNA', '-13.405545869246344, -76.16258645032431', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(700, 523, NULL, 'PSJ. ANAMPA N° 160 - SUNAMPE', 'NINGUNA', '-13.435101528818507, -76.143058506038', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(701, 524, NULL, 'AV. LUIS ALVA MAURTUA  Nº 525 - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.428850824636978, -76.11655706462034', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(702, 525, NULL, 'PSJ. SAN MARTIN Nª 474, C.P. MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.425731082548747, -76.14536153357136', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(703, 526, NULL, 'Calle san pedro de pilpa 256 -02 - Sunampe', 'NINGUNA', '-13.420209500906578, -76.16716684549868', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(704, 527, NULL, 'C.P. CONDORILLO ALTO MZ. P LT. 15 - CHINCHA ALTA', 'NINGUNA', '-13.430375217376968, -76.11194806102444', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(705, 528, NULL, 'UPIS 15 DE NOVIEMBRE / JOSE OLAYA B 13 - DOS PUENTES', 'NINGUNA', '-13.429429498594793, -76.12822338512728', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(706, 529, NULL, 'AA.HH. EL MILAGRO DE SAN JUDAS TADEO MZ. D - LT. 8 - SUNAMPE', 'NINGUNA', '-13.429125842563607, -76.1423624448934', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(707, 530, NULL, 'CL. SAN PEDRO DE PILPA Nª 588 - ALFONSO UGARTE - SUNAMPE', 'NINGUNA', '-13.416331552925643, -76.1694223674655', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(708, 531, NULL, 'CL. EL CARMEN Nª 196, CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.43075773721901, -76.11897442665364', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(709, 532, NULL, 'PROL. JUAN CASTILLA RONCERO N° LT 3 B, EL PORVENIR - GROCIO PRADO', 'NINGUNA', '-13.405652547330487, -76.16372457291367', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(710, 533, NULL, 'CL. MINA DE ORO Nª 06, C.P. MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.427181742607564, -76.14391930376158', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(711, 534, NULL, 'CL. SEBASTIAN BARRANCA Nº 3 C-1 - FUNDO COLORADO - GROCIO PRADO', 'NINGUNA', '-13.382348493754897, -76.15508429579448', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(712, 535, NULL, 'C.P. CONDORILLO ALTO MZ. T - LT. 24 - CHINCHA ALTA', 'NINGUNA', '-13.436348035675268, -76.11492017184291', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(713, 536, NULL, 'CL. EL CARMEN N° 210 - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.431676323107133, -76.11958437666812', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(714, 537, NULL, 'UPIS MARIO BIGGIO MZ. D - LT. 02 - GROCIO PRADO', 'NINGUNA', '-13.406544388699254, -76.14139012254402', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(715, 538, NULL, 'PSJ. SAN JUAN DE DIOS MZ.-10 LT. 04 - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.42912264432363, -76.11866870016499', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(716, 539, NULL, 'AA.HH. JESUS MARIA Y JOSE Nº D-02 - CHINCHA ALTA', 'NINGUNA', '-13.439883212126317, -76.13655436788727', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(717, 540, NULL, 'PSJ. LAS FRONTERAS S/N - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.410819912208094, -76.14033526051995', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(718, 541, NULL, 'C.P. CONDORILLO ALTO MZ. I - LT. 12 - CHINCHA ALTA', 'NINGUNA', '-13.434131703212298, -76.11756631468941', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(719, 542, NULL, 'AA.HH. LOS ALAMOS MZ 07 - LT. 03 - PUEBLO NUEVO', 'NINGUNA', '-13.403761452967288, -76.13817014191167', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(720, 543, NULL, 'CL. SAN MARTIN MZ. F - LT. 09 - MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.424902146454187, -76.14369570779887', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(721, 544, NULL, 'AV. EMANCIPACIÓN, PSJE. GUADALUPE Nª 12 - C.P. HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.42515330443632, -76.15989008478523', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(722, 545, NULL, 'CL. PEDRO MORENO N° 130 - CERCADO GROCIO PRADO - GROCIO PRADO', 'NINGUNA', '-13.410819581570836, -76.14033491626022', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(723, 546, NULL, 'URB. LOS VIÑEDOS MZ. R2 - LT. 07 - CHINCHA ALTA', 'NINGUNA', '-13.405901156604502, -76.13983570043364', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(724, 547, NULL, 'PSJ. ALMEYDA Nª 108 INT. 05 - SUNAMPE', 'NINGUNA', '-13.421987027253765, -76.16122380663187', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(725, 548, NULL, 'PSJ. JOSE OLAYA MZ. Q - LT 03 - CHINCHA ALTA', 'NINGUNA', '-13.42695941111934, -76.12880620010152', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(726, 549, NULL, 'PSJE SAN MARTIN Nª 474 - C.P. MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.425679740899506, -76.14491559816796', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(727, 550, NULL, 'PSJE. PASO DE GOMEZ Nª 111-10C - C.P. HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.424232895955596, -76.15567157236704', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(728, 551, NULL, 'URB. LOS VIÑEDOS MZ. F1 - LT. 03 - CHINCHA ALTA', 'NINGUNA', '-13.404236109088663, -76.14089143042213', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(729, 552, NULL, 'UPIS SAN ANDRES MZ. F - LT. 19 - PUEBLO NUEVO - CHINCHA', 'NINGUNA', '-13.394089821037078, -76.13736395569319', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(730, 553, NULL, 'UPIS SAN ANDRES MZ. A - LT. 06 - PUEBLO NUEVO - CHINCHA', 'NINGUNA', '-13.392572572540768, -76.13901435605464', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(731, 554, NULL, 'AA.HH. EL SALVADOR MZ. J - LT. 02 - PUEBLO NUEVO', 'NINGUNA', '-13.395526224158916, -76.14238128989486', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(732, 555, NULL, 'PSJ. LA FRONTERA Nª 257 - C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.419988527630736, -76.16525775209597', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(733, 556, NULL, 'AV. UNION Nº 3A - LOS ALAMOS - PUEBLO NUEVO', 'NINGUNA', '-13.40373581379816, -76.13822326080387', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(734, 557, NULL, 'SAN JOSE MZ. H - LT. 10 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.421124660232426, -76.16933485762435', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(735, 558, NULL, 'CL. SEBASTIAN BARRANCA LOTE Nª 14-C - FUNDO COLORADO - GROCIO PRADO', 'NINGUNA', '-13.38224116571989, -76.15600124984125', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(736, 559, NULL, 'URB. LOS VIÑEDOS MZ. U2 - LT. 12 - CHINCHA ALTA', 'NINGUNA', '-13.40623766697818, -76.14011153666642', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(737, 560, NULL, 'UPIS DIVIDA MISERICORDIA MZ. B - LT. 06', 'SUNAMPE (BALCONCITO)', '-13.416016360511472, -76.1449472028827', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(738, 561, NULL, 'PSJ. DOS DE MAYO S/N - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.429153764752225, -76.1186917042735', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(739, 562, NULL, 'PSJ. LOS CLAVELES Nª 207 - CRUZ BLANCA - CHINCHA', 'NINGUNA', '-13.423205452177557, -76.12388814398952', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(740, 630, NULL, 'PSJ. LA PALMA, FUNDO EL NISPERO LT. 05 - SUNAMPE', 'NINGUNA', '-13.414519696860816, -76.16629051915034', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(741, 563, NULL, 'PSJ. LOS ANGELES S/N - C.P. MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.431678430222359, -76.1442795880139', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(742, 564, NULL, 'CL. SAN MARTIN Nª 103 - CHACARITA - SUNAMPE', 'NINGUNA', '-13.433291920283867, -76.13769598456894', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(743, 565, NULL, 'CL. SAN LUIS Nª 139 - CERCADO DE CHINCHA ALTA', 'NINGUNA', '-13.42157267076392, -76.12236295287404', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(744, 566, NULL, 'PSJE CASTILLA Nª 268 - C. P. SAN PEDRO DE PILPA - SUNAMPE', 'NINGUNA', '-13.416595267614799, -76.16286319945932', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(745, 567, NULL, 'AV. LUIS ALVA MAURTUA S/N (4TA CDRA) - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.430130098731983, -76.11364118368603', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(746, 568, NULL, 'AV. LUIS ALVA MAURTUA N° 568-01 - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.43009910435166, -76.11305880766777', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(747, 569, NULL, 'AV. ALFONSO UGARTE Nª H-7 - SUNAMPE', 'NINGUNA', '-13.413847568723686, -76.16344555559186', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(748, 570, NULL, 'AV. NICOLAS DE PIEROLA Nº 130 - BARRIO SAN MARTIN - SUNAMPE', 'NINGUNA', '-13.432901687223886, -76.1419748711397', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(749, 571, NULL, 'PSJ SANTA ROSA NRO. S/N - CHINCHA ALTA', 'NINGUNA', '-13.429514709166895, -76.12230876088258', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(750, 572, NULL, 'PSJ. 02 DE MAYO Nª 325 - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.430460699183783, -76.11839168402231', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(751, 573, NULL, 'PSJE SAN VICENTE M-P LT-16 - SAN P. PILPA - SUNAMPE', 'NINGUNA', '-13.411069602744266, -76.1636022923179', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(752, 574, NULL, 'AV. HUASCAR Nª 148 - C.P. SAN IGNACIO - SUNAMPE', 'NINGUNA', '-13.41855634811682, -76.15312146615075', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(753, 575, NULL, 'CL. JOSÉ OLAYA N° 222-01 CERCADO DE CHINCHA ALTA', 'NINGUNA', '-13.427154732441437, -76.13005811611357', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(754, 576, NULL, 'CL. SANTA ANGELA Nª 805 - CRUZ BLANCA - CHINCHA ALTA', 'NINGUNA', '-13.4263204228638, -76.12455391316747', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(755, 577, NULL, 'CL. EL PORVENIR Nª 104 - C.P. HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.424317014499604, -76.1567529028557', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(756, 578, NULL, 'CL. LAS FLORES Nª 212 - C.P. CHACARITA - SUNAMPE', 'NINGUNA', '-13.438096815945572, -76.13780818004443', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(757, 579, NULL, 'AA. HH. EL MILAGRO SAN JUDAS TADEO - MZ E LOTE 6 - MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.42731671006423, -76.14818021237694', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(758, 580, NULL, 'AV. PARAISO NRO. PUERTA 496 - C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.42209654776099, -76.17308436777651', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(759, 581, NULL, 'CL. SAN PEDRO DE PILPA Nª 235 - C.P. ALFONSO UGARTE NORTE - SUNAMPE', 'NINGUNA', '-13.417407270263073, -76.16336036639458', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(760, 582, NULL, 'CL. EL PORVENIR MZ. V1 - LT. 13 - C.P. HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.424156768224716, -76.15675337463101', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(761, 583, NULL, 'CL. MIGUEL GRAU LOTE MZ. M - LT. 11 - C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.423377144049624, -76.16991740118004', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(762, 584, NULL, 'CL. LOS ANGELES S/N, C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.419049284053875, -76.17027918079681', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(763, 585, NULL, 'CL. SANTA ANGELA MZ. B LT. 8 - CHINCHA ALTA', 'FRENTE AL MEGA MERCADO DE CRUZ BLANCA', '-13.42690189937251, -76.12486216480197', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(764, 586, NULL, 'AA. HH. EL MILAGRO SAN JUDAS TADEO - MZ C LOTE 06 - MINA DE ORO - SUNAMPE', 'NINGUNA', '-13.428706533665016, -76.14261244489347', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(765, 587, NULL, 'RESIDENCIAL SAN PABLO, LT 27 - SUNAMPE', 'FRENT. GRIFO PRIMAX', '-13.41688086591144, -76.15544474602468', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(766, 588, NULL, 'PSJ. LA FRONTERA Nª 150 - C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.422067454421558, -76.17477858511613', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(767, 589, NULL, 'JR. GARCILAZO DE LA VEGA Nº 12 - SECTOR LOS ALAMOS - PUEBLO NUEVO', 'NINGUNA', '-13.403234917687397, -76.138472015793', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(768, 590, NULL, 'PSJ EL ANGEL S/N - CERCADO CHINCHA ALTA', 'NINGUNA', '-13.415709794099593, -76.14411244489906', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(769, 591, NULL, 'PSJE SAN FRANCISCO MZ. X LT. 8 - C.P. SAN IGNACIO - SUNAMPE', 'NINGUNA', '-13.416742236756571, -76.1518903095728', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(770, 592, NULL, 'MZNA B Nro: PUERTA 04 URB. JULIO ARBOLEDA CHINCHA ALTA', 'NINGUNA', '-13.426404124116054, -76.13625004876131', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(771, 593, NULL, 'AV. PARAISO N° 21 - LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.419894019256763, -76.16346993227727', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(772, 631, NULL, 'PSJ BENAVIDES NRO. 101-11 DPTO 101 - GROCIO PRADO', 'NINGUNA', '-13.404850162650078, -76.16172708841837', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(773, 594, NULL, 'Upis  keyko Sofia Mz ñ Lt  20 -Salvador', 'NINGUNA', '-13.396323620861255, -76.14589064658135', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(774, 595, NULL, 'AV. SAN MARTIN O-12 - MZNA O Nro. Puerta 12 Sunampe Antiguo SUNAMPE', 'NINGUNA', '-13.432931213280048, -76.13947361938361', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(775, 596, NULL, 'Calle dos puentes #118-03 cercado CHINCHA ALTA', 'NINGUNA', '-13.425654946832868, -76.12705560378916', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(776, 597, NULL, 'PSJ. FELIX NRO. PUERTA 299-15 - BARRIO MELCHORITA II - GROCIO PRADO', 'NINGUNA', '-13.407012258185965, -76.16169475516723', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(777, 598, NULL, 'ALVA MAURTUA SN - MZ-SN LT-SN - 1 - UR. TOMA DE CALA - CHINCHA ALTA', 'NINGUNA', '-13.428291838734307, -76.12219535183725', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(778, 599, NULL, 'AVDA ARENALES Nro. Puerta 20 Sin Barrio Cruz Blanca', 'CHINCHA ALTA', '-13.42768104916221, -76.12086129971105', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(779, 600, NULL, 'AVDA PARADA DE LOS AMIGOS Nro. Lote 2 - PSJ 8 - C.P. SAN PEDRO DE PILPA - SUNAMPE', 'NINGUNA', '-13.412429145425016, -76.16483255383304', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(780, 601, NULL, 'Av. union santa rosa 109 - Cruz blanca', 'NINGUNA', '-13.429514332279613, -76.12230819040332', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(781, 602, NULL, 'AA.HH 28 de julio mz f lote 8 Pueblo Nuevo', 'NINGUNA', '-13.393798647811305, -76.13113809407929', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL);
INSERT INTO `tb_clientes` (`id_cliente`, `id_persona`, `id_empresa`, `direccion`, `referencia`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(782, 603, NULL, 'PSJE. MAGALLANES -26- EL PORVENIR - GROCIO PRADO', 'NINGUNA', '-13.401710203104447, -76.16291649992776', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(783, 604, NULL, 'MZNA Ñ NRO. PUERTA 14 AA. HH. EL SALVADOR - PUEBLO NUEVO', 'NINGUNA', '-13.394292365203789, -76.14322336423038', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(784, 605, NULL, 'PSJ. SANTA ROSA S/N - CRUZ BLANCHA - CHINCHA ALTA', 'NINGUNA', '-13.428677104647695, -76.1220574571626', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(785, 606, NULL, 'AVDA 28 DE JULIO NRO. PUERTA 1004-04 - GROCIO PRADO', 'NINGUNA', '-13.407403533167047, -76.159583890828', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(786, 607, NULL, 'PSJE. FELIX NRO. 299-14 - BARRIO MELCHORITA II - GROCIO PRADO', 'NINGUNA', '-13.40674018719647, -76.16178018279754', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(787, 608, NULL, 'PSJE COCO 192 - C.P. MONTERRICO - SUNAMPE', 'NINGUNA', '-13.432597378151316, -76.1645557333599', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(788, 609, NULL, 'Av. arenales psj. las palmeras S/N', 'NINGUNA', '-13.424668403330276, -76.12501892822935', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(789, 610, NULL, 'AV. PARAISO 201 LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.421238511265148, -76.16933136970471', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(790, 611, NULL, 'URB. LEON DE VIVERO MZ 01 LT. 23 - PUEBLO NUEVO', 'NINGUNA', '-13.388352020567341, -76.14639077348275', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(791, 612, NULL, 'AV. MINA DE ORO 360 - SUNAMPE', 'NINGUNA', '-13.4256252459709, -76.14344479657693', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(792, 613, NULL, 'AV. PARAISO 106 LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.422682973591973, -76.17405752038829', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(793, 614, NULL, 'PSJE EMANCIPACION MZ. H LT. 09 - C.P. HUACA GRANDE - SUNAMPE', 'NINGUNA', '-13.425316038661213, -76.16000302808287', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(794, 615, NULL, 'PSJE GUADALUPE MZ. H LT. 10 - C.P. HUACA GRANDE -SUNAMPE', 'NINGUNA', '-13.425350955340106, -76.1599181906612', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(795, 616, NULL, 'AA-HH. EL SALVADOR MZ. B LT. 16 - PUEBLO NUEVO', 'NINGUNA', '-13.397460964418466, -76.14083718868405', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(796, 617, NULL, 'PASAJE JORGE CHAVEZ - CHACARITA', 'NINGUNA', '-13.438059321789517, -76.13684886831548', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(797, 618, NULL, 'AV. ALFONSO UGARTE S/N PUEBLO NUEVO', 'AFUERA DE TECHO PROPIO PASANDO HOTEL CARRETON DORADO', '-13.4034887932479, -76.13902975370759', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(798, 619, NULL, 'PSJE LA FRONTERA NRO. PUERTA 150-05 CP LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.422043923435126, -76.17430556050688', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(799, 621, NULL, 'av. las nazarenas 62a Huaca Grande', 'NINGUNA', '-13.429019176232492, -76.15310571231694', '2025-02-26 22:24:08', NULL, NULL, 1, NULL, NULL),
(800, 1061, NULL, 'LOS MARTIRES - 222 - S:SAN ISIDRO - PUEBLO NUEVO', 'NINGUNA', '-13.395631829739004,-76.13210099090263', '2025-02-27 11:56:27', NULL, NULL, 12, NULL, NULL),
(801, 1063, NULL, 'AV. SAN ISIDRO NRO. 1201 - PUEBLO NUEVO', 'NINGUNA', '-13.395284766378909,-76.13163707556068', '2025-02-27 12:28:34', NULL, NULL, 12, NULL, NULL),
(802, 1153, NULL, 'AV. LA ALAMEDA S/N - SUNAMPE', 'EN UN PSJE, ESPALDA DE LA DISCOTECA PICASSO', '-13.420140428440586,-76.15965049742238', '2025-03-01 12:48:25', NULL, NULL, 12, NULL, NULL),
(803, 1154, NULL, 'CL. ALFONSO UGARTE N° 160, SAN PEDRO DE PILPA - SU', 'NINGUNA', '-13.413810854334017,-76.16323730433116', '2025-03-03 12:15:52', NULL, NULL, 12, NULL, NULL),
(804, 1155, NULL, 'CL NUEVA ESPERANZA Nro. LOTE 08 MZ T 1 - BARRIO ME', 'serca a la caja 3', '-13.407794103636514,-76.16124022112322', '2025-03-04 09:31:35', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_contactabilidad`
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
) ENGINE=InnoDB AUTO_INCREMENT=39;

--
-- Volcado de datos para la tabla `tb_contactabilidad`
--

INSERT INTO `tb_contactabilidad` (`id_contactabilidad`, `id_persona`, `id_empresa`, `id_paquete`, `fecha_hora_contacto`, `direccion_servicio`, `nota`, `fecha_limite`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(22, 6, NULL, 49, '2025-02-11 11:33:55', 'PSJE JOSE OLAYA NRO. CASA 160 Q03  CRUZ BLANCA', 'Para llamar', '2025-02-25 00:00:00', '2025-02-11 11:33:55', NULL, NULL, 12, NULL, NULL),
(23, 10, NULL, 48, '2025-02-12 09:29:43', 'av Santo Domingo', 'Para llamar', '2025-02-26 00:00:00', '2025-02-12 09:29:43', NULL, NULL, 1, NULL, NULL),
(24, 11, NULL, 50, '2025-02-12 10:25:36', 'Avenida Rosario 07  Sin barrio', 'Para llamar', '2025-02-26 00:00:00', '2025-02-12 10:25:36', NULL, NULL, 1, NULL, NULL),
(26, 13, NULL, 56, '2025-02-12 18:16:12', 'ytrfytfy', 'Para llamar', '2025-02-26 00:00:00', '2025-02-12 18:16:12', NULL, NULL, 14, NULL, NULL),
(27, 345, NULL, 61, '2025-02-13 17:39:58', 'Avda. Fátima SN  Sunampe', 'Para llamar', '2025-02-27 00:00:00', '2025-02-13 17:39:58', NULL, NULL, 14, NULL, NULL),
(28, 347, NULL, 49, '2025-02-14 10:44:56', 'C.P. CONDORILLO ALTO MZ. I  LT. 04', 'Para llamar', '2025-02-28 00:00:00', '2025-02-14 10:44:56', NULL, NULL, 12, NULL, NULL),
(29, 348, NULL, 49, '2025-02-14 14:25:49', 'MZNA K NRO. 3 UPIS HUSARES DE JUNIN', 'Para llamar', '2025-02-28 00:00:00', '2025-02-14 14:25:49', NULL, NULL, 1, NULL, NULL),
(30, 349, NULL, 49, '2025-02-17 12:52:50', 'PARAISO  SU  1  C.P. LOMO LARGO  SUNAMPE', 'Para llamar', '2025-03-03 00:00:00', '2025-02-17 12:52:50', NULL, NULL, 12, NULL, NULL),
(31, 632, NULL, 61, '2025-02-21 10:09:53', 'AV. FATIMA MZ. I  LT. 01  SUNAMPE', 'Para llamar', '2025-03-07 00:00:00', '2025-02-21 10:09:53', NULL, NULL, 12, NULL, NULL),
(32, 633, NULL, 61, '2025-02-25 09:38:49', 'Virgen del Carmen Mz. I, Lot 24', 'Para llamar', '2025-03-11 00:00:00', '2025-02-25 09:38:49', NULL, NULL, 14, NULL, NULL),
(33, 1144, NULL, 49, '2025-02-25 18:50:07', 'La unión hace la fuerza. Mina de oro . Sunampe', 'Para llamar', '2025-03-11 00:00:00', '2025-02-25 18:50:07', NULL, NULL, 14, NULL, NULL),
(34, 1145, NULL, 115, '2025-02-26 10:59:52', 'PSJE SOLARI MZ. D LT. 14  C.P. MINA DE ORO  SUNAMPE', 'Para llamar', '2025-03-12 00:00:00', '2025-02-26 10:59:52', NULL, NULL, 12, NULL, NULL),
(35, 1152, NULL, 49, '2025-02-28 12:40:54', 'Av. America 851', 'Para llamar', '2025-03-14 00:00:00', '2025-02-28 12:40:54', NULL, NULL, 1, NULL, NULL),
(36, 1153, NULL, 108, '2025-03-01 12:46:52', 'AV. LA ALAMEDA SN  SUNAMPE', 'Para llamar', '2025-03-15 00:00:00', '2025-03-01 12:46:52', NULL, NULL, 12, NULL, NULL),
(37, 1154, NULL, 77, '2025-03-03 12:15:27', 'CL. ALFONSO UGARTE N° 160, SAN PEDRO DE PILPA  SUNAMPE', 'Para llamar', '2025-03-17 00:00:00', '2025-03-03 12:15:27', NULL, NULL, 12, NULL, NULL),
(38, 1155, NULL, 49, '2025-03-04 09:27:58', 'CL NUEVA ESPERANZA Nro. LOTE 08 MZ T 1  BARRIO MELCHORITA II  GROCIO PRADO', 'Para llamar', '2025-03-18 00:00:00', '2025-03-04 09:27:58', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_contratos`
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
) ENGINE=InnoDB AUTO_INCREMENT=31;

--
-- Volcado de datos para la tabla `tb_contratos`
--

INSERT INTO `tb_contratos` (`id_contrato`, `id_cliente`, `id_paquete`, `id_sector`, `id_usuario_registro`, `id_usuario_tecnico`, `direccion_servicio`, `referencia`, `ficha_instalacion`, `coordenada`, `fecha_inicio`, `fecha_registro`, `fecha_fin`, `nota`, `create_at`, `update_at`, `inactive_at`, `iduser_update`, `iduser_inactive`) VALUES
(1, 87, 49, 14, 13, 12, 'PSJE JOSE OLAYA NRO. CASA 160 Q03  CRUZ BLANCA', 'ninguna', '{\"periodo\":\"2025-08-12\",\"fibraoptica\":{\"usuario\":\"rodtoscan1\",\"claveacceso\":\"@erazo1\",\"vlan\":32,\"plan\":\"Plan Internet Duplica X6 180MB  50\",\"potencia\":21,\"router\":{\"ssid\":\"Familiatm\",\"seguridad\":\"47256445\",\"codigobarra\":\"60D2DD24895F\",\"ip\":\"192.168\",\"marca\":\"Sin Marca\",\"modelo\":\"BT213XR\",\"serie\":\"12345678\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":4,\"catv\":false,\"ingresouserrouter\":\"admin\",\"ingresopass\":\"dpont26\"},\"detalles\":\"Pago adelantado \\nEfectivo s\\/50.00\\n\",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":16},\"idcaja\":76}', '-13.429693043680158,-76.11500661967389', '2025-02-11', '2025-02-11', NULL, '', '2025-02-11 11:35:04', NULL, NULL, NULL, NULL),
(2, 89, 50, 20, 13, 12, 'Avenida Rosario 07  Sin barrio', 'A la espalda de la videna', '{\"periodo\":\"2025-08-12\",\"fibraoptica\":{\"usuario\":\"patcollac2\",\"claveacceso\":\"@taype2\",\"vlan\":105,\"plan\":\"Plan Internet Duo Bronce 110MB  80\",\"potencia\":21,\"router\":{\"ssid\":\"Rusmery\",\"seguridad\":\"Levano10\",\"codigobarra\":\"4CD7C83E6614\",\"ip\":\"192.168.1.1\",\"marca\":\"\",\"modelo\":\"\",\"serie\":\"V24072301859\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":4,\"catv\":true,\"ingresouserrouter\":\"admin\",\"ingresopass\":\"Dpont26\"},\"detalles\":\"- Pago Adelantado\\n- 2 Tv Directa \\n- 1 Tv con Deco\\nPago en Efectivo s\\/ 60.00\\n- Deco pagar\\u00e1 en 4 Cuotas \",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":1},\"idcaja\":85,\"cable\":{\"pagoinstalacion\":30,\"potencia\":-9,\"plan\":\"Plan Internet Duo Bronce 110MB  80\",\"triplexor\":{\"requerido\":\"false\",\"cargador\":\" false\"},\"conector\":{\"numeroconector\":3,\"precio\":\"1.50\"},\"splitter\":[{\"cantidad\":1,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":10,\"preciometro\":\"1.30\"},\"sintonizadores\":[]},\"costo\":{\"pagoadelantado\":0,\"descuento\":0,\"nap\":{\"gpon\":-20,\"catv\":-9},\"casa\":{\"gpon\":-21,\"catv\":-10},\"cablecosto\":{\"numerosintotizadores\":0,\"costoalquilersintotizador\":0,\"costocable\":13,\"costoconector\":4.5,\"cantidadcable\":10,\"preciocable\":\"1.30\",\"precioconector\":\"1.50\",\"cantidadconector\":3,\"detalle\":\"\"}}}', '-13.410219326135763,-76.13651458968663', '2025-02-12', '2025-02-12', NULL, '', '2025-02-12 10:25:49', NULL, NULL, NULL, NULL),
(3, 90, 60, 11, 13, 15, 'CL. 9 DE OCTUBRE NRO. 211  GROCIO PRADO', 'ninguna', '{\"cable\":{\"plan\":\"SERVICIO DIGITAL  CATV CATV 3 TV  BASICO\",\"periodo\":\"2025-08-27\",\"pagoinstalacion\":60,\"potencia\":-29,\"triplexor\":{\"requerido\":\"false\",\"cargador\":\" false\"},\"conector\":{\"numeroconector\":1,\"precio\":\"1.50\"},\"splitter\":[{\"cantidad\":0,\"tipo\":\"1x3\"}],\"cable\":{\"metrosadicionales\":1,\"preciometro\":\"1.30\"},\"tipoEntrada\":{\"puerto\":2},\"sintonizadores\":[]},\"costo\":{\"nap\":{\"gpon\":-18,\"catv\":-18},\"casa\":{\"gpon\":-19,\"catv\":-19},\"cablecosto\":{\"numerosintotizadores\":0,\"costoalquilersintotizador\":0,\"costocable\":0,\"costoconector\":\"0\",\"cantidadcable\":1,\"preciocable\":\"1.30\",\"precioconector\":\"1.50\",\"cantidadconector\":1,\"detalle\":\"Se conecto a 1 Tv directo\"}},\"idcaja\":69}', '-13.399400833088006,-76.15762943316717', '2025-02-12', '2025-02-12', NULL, '', '2025-02-12 12:18:33', '2025-02-27 17:46:38', NULL, 15, NULL),
(4, 91, 61, 1, 14, 15, 'Avda. Fátima SN  Sunampe', 'ESPALDA DE LA CASA DE IVAN', '{\"periodo\":\"2025-08-27\",\"fibraoptica\":{\"usuario\":\"sonrojas4\",\"claveacceso\":\"@ramos4\",\"vlan\":25,\"plan\":\"Plan Internet 100MB\",\"potencia\":-22,\"router\":{\"ssid\":\"Magaly\",\"seguridad\":\"magaly24\",\"codigobarra\":\"099988\",\"ip\":\"192.168.10.1\",\"marca\":\"\",\"modelo\":\"\",\"serie\":\"8h9jggjkkk88\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":2,\"catv\":false,\"ingresouserrouter\":\"Epadmin\",\"ingresopass\":\"Gpon26\"},\"detalles\":\"\",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":12},\"idcaja\":27}', '-13.428167820314462,-76.15966500985327', '2025-02-13', '2025-02-13', NULL, '', '2025-02-13 17:42:54', '2025-02-27 17:52:35', NULL, 15, NULL),
(9, 92, 49, 24, 12, 15, 'C.P. CONDORILLO ALTO MZ. I  LT. 04', 'ninguna', '{\"periodo\":\"2025-08-27\",\"fibraoptica\":{\"usuario\":\"patpalomi9\",\"claveacceso\":\"@chuquis9\",\"vlan\":36,\"plan\":\"Plan Internet Duplica X6 180MB  50\",\"potencia\":-23,\"router\":{\"ssid\":\"Stephanie\",\"seguridad\":\"stephanie\",\"codigobarra\":\"4CD7C8\",\"ip\":\"192.168.10.1\",\"marca\":\"V-SOL\",\"modelo\":\"V28044ACZ\",\"serie\":\"V24072301492\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":4,\"catv\":false,\"ingresouserrouter\":\"admin\",\"ingresopass\":\"Dpon26\"},\"detalles\":\"\",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":16},\"idcaja\":76}', '-13.433602969372952,-76.11663157364464', '2025-02-14', '2025-02-14', NULL, '', '2025-02-14 10:45:21', '2025-02-27 17:56:26', NULL, 15, NULL),
(10, 93, 49, 16, 1, 15, 'MZNA K NRO. 3 UPIS HUSARES DE JUNIN', 'Esquina de la Plaza del Usares de Junin', '{\"periodo\":\"2025-08-27\",\"fibraoptica\":{\"usuario\":\"denmartin10\",\"claveacceso\":\"@lozano10\",\"vlan\":104,\"plan\":\"Plan Internet Duplica X6 180MB  50\",\"potencia\":-23,\"router\":{\"ssid\":\"Denis Frefire\",\"seguridad\":\"denis1691\",\"codigobarra\":\"123456\",\"ip\":\"192.168.10.1\",\"marca\":\"\",\"modelo\":\"\",\"serie\":\"1a2b3c4d5e\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":4,\"catv\":false,\"ingresouserrouter\":\"admin\",\"ingresopass\":\"Dpon26\"},\"detalles\":\"Pago efectivo \",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":8},\"idcaja\":105}', '-13.392111774958352,-76.14944983301655', '2025-02-15', '2025-02-14', NULL, '', '2025-02-14 14:31:26', '2025-02-27 17:58:42', NULL, 15, NULL),
(11, 94, 49, 10, 13, 12, 'PARAISO  SU  1  C.P. LOMO LARGO  SUNAMPE', 'ninguna', '{\"periodo\":\"2025-08-17\",\"fibraoptica\":{\"usuario\":\"BLAMAT11\",\"claveacceso\":\"@BLAMAT11\",\"vlan\":29,\"plan\":\"Plan Internet Duplica X6 180MB  50\",\"potencia\":21,\"router\":{\"ssid\":\"Jhonatan\",\"seguridad\":\"Miaykalezy\",\"codigobarra\":\"2057AFA58C38\",\"ip\":\"192.168.1.1\",\"marca\":\"\",\"modelo\":\"\",\"serie\":\"Z127F3A100016\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false,\"ingresouserrouter\":\"BLAMATT11\",\"ingresopass\":\"@BLAMATT11\"},\"detalles\":\"Pago Adelantado s\\/50.00\",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":9},\"idcaja\":7}', '-13.421977338442261,-76.17351750433104', '2025-02-17', '2025-02-17', NULL, 'RECOM. ARMANDO SARAVIA YATACO', '2025-02-17 12:53:39', NULL, NULL, NULL, NULL),
(15, 95, 108, 9, 12, 15, 'AV. FATIMA MZ. I  LT. 01  SUNAMPE', 'ninguna', '{\"periodo\":\"2025-08-27\",\"fibraoptica\":{\"usuario\":\"cesrojas15\",\"claveacceso\":\"@ramos15\",\"vlan\":100,\"plan\":\"Plan Internet MIGRA 100MB  50\",\"potencia\":-22,\"router\":{\"ssid\":\"Rojas\",\"seguridad\":\"#ramosrojas20\",\"codigobarra\":\"123456\",\"ip\":\"192.168.0.1\",\"marca\":\"\",\"modelo\":\"\",\"serie\":\"1a2b3c4d5e\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false,\"ingresouserrouter\":\"admin\",\"ingresopass\":\"Dpon26\"},\"detalles\":\"Migraci\\u00f3n \",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":14},\"idcaja\":27}', '-13.427724958285477,-76.16006088898726', '2025-02-21', '2025-02-21', NULL, '', '2025-02-21 10:10:39', '2025-02-27 18:00:40', NULL, 15, NULL),
(16, 96, 107, 8, 1, NULL, 'AV. FATIMA N° 373  SUNAMPE', 'ultima cuadra de av. fatima', '{\"idcaja\":27}', '-13.429843953195782,-76.160477301138', '2025-02-24', '2025-02-24', NULL, '', '2025-02-24 18:58:59', NULL, NULL, NULL, NULL),
(17, 97, 108, 13, 14, 15, 'Virgen del Carmen Mz. I, Lot 24', 'Cruz blanca', '{\"periodo\":\"2025-08-27\",\"fibraoptica\":{\"usuario\":\"rubiturri17\",\"claveacceso\":\"@sulca17\",\"vlan\":33,\"plan\":\"Plan Internet MIGRA 100MB  50\",\"potencia\":-21,\"router\":{\"ssid\":\"Iturrizaga \",\"seguridad\":\"#*RUBEN_123@*#\",\"codigobarra\":\"123456\",\"ip\":\"192.168.0.1\",\"marca\":\"\",\"modelo\":\"\",\"serie\":\"4CD7C83E2764\",\"banda\":[\"2G\",\"5G\"],\"numeroantena\":4,\"catv\":false,\"ingresouserrouter\":\"admin\",\"ingresopass\":\"Dpon26\"},\"detalles\":\"Migraci\\u00f3n pago en efectivo \",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":15},\"idcaja\":174}', '-13.427199449025544,-76.12336163323111', '2025-02-25', '2025-02-25', NULL, '', '2025-02-25 09:46:42', '2025-02-27 18:05:12', NULL, 15, NULL),
(18, 98, 49, 28, 14, 15, 'La unión hace la fuerza. Mina de oro . Sunampe', 'MINA DE ORO', '{\"periodo\":\"2025-08-27\",\"fibraoptica\":{\"usuario\":\"melmateo18\",\"claveacceso\":\"@pasache18\",\"vlan\":37,\"plan\":\"Plan Internet Duplica X6 180MB  50\",\"potencia\":-23,\"router\":{\"ssid\":\"Dorita\",\"seguridad\":\"magallanesmateo\",\"codigobarra\":\"123456\",\"ip\":\"192.168.0.1\",\"marca\":\"\",\"modelo\":\"\",\"serie\":\"1CEF0342E564\",\"banda\":[\"2G\"],\"numeroantena\":2,\"catv\":false,\"ingresouserrouter\":\"admin\",\"ingresopass\":\"Dpon26\"},\"detalles\":\"Pago por Yape \",\"repetidores\":[]},\"tipoentrada\":{\"puerto\":12},\"idcaja\":148}', '-13.427277342369194,-76.14331187549509', '2025-02-25', '2025-02-25', NULL, '', '2025-02-25 18:54:42', '2025-02-27 18:08:02', NULL, 15, NULL),
(19, 99, 115, 30, 12, NULL, 'PSJE SOLARI MZ. D LT. 14  C.P. MINA DE ORO  SUNAMPE', 'ninguna', '{\"idcaja\":\"37\"}', '-13.42528008481821,-76.14371661782366', '2025-02-26', '2025-02-26', '2025-02-27', '', '2025-02-26 11:00:15', NULL, '2025-02-27 18:36:20', NULL, 1),
(20, 800, 108, 21, 12, NULL, 'LOS MARTIRES  222  S:SAN ISIDRO  PUEBLO NUEVO', 'NINGUNA', '{\"idcaja\":113}', '-13.395631829739004,-76.13210099090263', '2025-02-27', '2025-02-27', NULL, '', '2025-02-27 11:56:29', NULL, NULL, NULL, NULL),
(21, 800, 108, 21, 12, NULL, 'AV. SAN ISIDRO NRO. 1201  PUEBLO NUEVO', 'NINGUNA', '{\"idcaja\":113}', '-13.395232581586734,-76.13160488905417', '2025-02-27', '2025-02-27', '2025-02-27', '', '2025-02-27 11:58:58', NULL, '2025-02-27 12:15:44', NULL, 1),
(22, 800, 108, 21, 12, NULL, 'AV. SAN ISIDRO NRO. 1201  PUEBLO NUEVO', 'NINGUNA', '{\"idcaja\":113}', '-13.395316077248761,-76.13162634672517', '2025-02-27', '2025-02-27', '2025-02-27', '', '2025-02-27 12:22:19', NULL, '2025-02-27 12:22:37', NULL, 1),
(23, 801, 108, 21, 12, NULL, 'AV. SAN ISIDRO NRO. 1201  PUEBLO NUEVO', 'NINGUNA', '{\"idcaja\":113}', '-13.395284766378909,-76.13163707556068', '2025-02-27', '2025-02-27', NULL, '', '2025-02-27 12:28:35', NULL, NULL, NULL, NULL),
(24, 802, 108, 10, 12, NULL, 'AV. LA ALAMEDA SN  SUNAMPE', 'EN UN PSJE, ESPALDA DE LA DISCOTECA PICASSO', '{\"idcaja\":28}', '-13.420140428440586,-76.15965049742238', '2025-03-01', '2025-03-01', NULL, '', '2025-03-01 12:48:26', NULL, NULL, NULL, NULL),
(25, 803, 77, 11, 12, NULL, 'CL. ALFONSO UGARTE N° 160, SAN PEDRO DE PILPA  SUNAMPE', 'NINGUNA', '{\"idcaja\":\"57\"}', '-13.413810854334017,-76.16323730433116', '2025-03-03', '2025-03-03', NULL, '', '2025-03-03 12:15:53', NULL, NULL, NULL, NULL),
(30, 804, 49, 11, 1, NULL, 'CL NUEVA ESPERANZA Nro. LOTE 08 MZ T 1  BARRIO ME', 'Cerca a la caja 3', '{\"idcaja\":\"64\"}', '-13.413831484387982,-76.16325927139526', '2025-03-04', '2025-03-04', NULL, '', '2025-03-04 10:03:42', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_departamentos`
--

DROP TABLE IF EXISTS `tb_departamentos`;
CREATE TABLE IF NOT EXISTS `tb_departamentos` (
  `id_departamento` int(11) NOT NULL,
  `departamento` varchar(45) NOT NULL,
  PRIMARY KEY (`id_departamento`)
) ENGINE=InnoDB;

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

DROP TABLE IF EXISTS `tb_distritos`;
CREATE TABLE IF NOT EXISTS `tb_distritos` (
  `id_distrito` int(11) NOT NULL,
  `distrito` varchar(45) DEFAULT NULL,
  `id_provincia` int(11) DEFAULT NULL,
  `id_departamento` int(11) DEFAULT NULL,
  `limites` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`limites`)),
  PRIMARY KEY (`id_distrito`),
  KEY `distr_fk_id_provincia` (`id_provincia`),
  KEY `distr_fk_id_departamento` (`id_departamento`)
) ENGINE=InnoDB;

--
-- Volcado de datos para la tabla `tb_distritos`
--

INSERT INTO `tb_distritos` (`id_distrito`, `distrito`, `id_provincia`, `id_departamento`, `limites`) VALUES
(10101, 'Chachapoyas', 101, 1, NULL),
(10102, 'Asunción', 101, 1, NULL),
(10103, 'Balsas', 101, 1, NULL),
(10104, 'Cheto', 101, 1, NULL),
(10105, 'Chiliquin', 101, 1, NULL),
(10106, 'Chuquibamba', 101, 1, NULL),
(10107, 'Granada', 101, 1, NULL),
(10108, 'Huancas', 101, 1, NULL),
(10109, 'La Jalca', 101, 1, NULL),
(10110, 'Leimebamba', 101, 1, NULL),
(10111, 'Levanto', 101, 1, NULL),
(10112, 'Magdalena', 101, 1, NULL),
(10113, 'Mariscal Castilla', 101, 1, NULL),
(10114, 'Molinopampa', 101, 1, NULL),
(10115, 'Montevideo', 101, 1, NULL),
(10116, 'Olleros', 101, 1, NULL),
(10117, 'Quinjalca', 101, 1, NULL),
(10118, 'San Francisco de Daguas', 101, 1, NULL),
(10119, 'San Isidro de Maino', 101, 1, NULL),
(10120, 'Soloco', 101, 1, NULL),
(10121, 'Sonche', 101, 1, NULL),
(10201, 'Bagua', 102, 1, NULL),
(10202, 'Aramango', 102, 1, NULL),
(10203, 'Copallin', 102, 1, NULL),
(10204, 'El Parco', 102, 1, NULL),
(10205, 'Imaza', 102, 1, NULL),
(10206, 'La Peca', 102, 1, NULL),
(10301, 'Jumbilla', 103, 1, NULL),
(10302, 'Chisquilla', 103, 1, NULL),
(10303, 'Churuja', 103, 1, NULL),
(10304, 'Corosha', 103, 1, NULL),
(10305, 'Cuispes', 103, 1, NULL),
(10306, 'Florida', 103, 1, NULL),
(10307, 'Jazan', 103, 1, NULL),
(10308, 'Recta', 103, 1, NULL),
(10309, 'San Carlos', 103, 1, NULL),
(10310, 'Shipasbamba', 103, 1, NULL),
(10311, 'Valera', 103, 1, NULL),
(10312, 'Yambrasbamba', 103, 1, NULL),
(10401, 'Nieva', 104, 1, NULL),
(10402, 'El Cenepa', 104, 1, NULL),
(10403, 'Río Santiago', 104, 1, NULL),
(10501, 'Lamud', 105, 1, NULL),
(10502, 'Camporredondo', 105, 1, NULL),
(10503, 'Cocabamba', 105, 1, NULL),
(10504, 'Colcamar', 105, 1, NULL),
(10505, 'Conila', 105, 1, NULL),
(10506, 'Inguilpata', 105, 1, NULL),
(10507, 'Longuita', 105, 1, NULL),
(10508, 'Lonya Chico', 105, 1, NULL),
(10509, 'Luya', 105, 1, NULL),
(10510, 'Luya Viejo', 105, 1, NULL),
(10511, 'María', 105, 1, NULL),
(10512, 'Ocalli', 105, 1, NULL),
(10513, 'Ocumal', 105, 1, NULL),
(10514, 'Pisuquia', 105, 1, NULL),
(10515, 'Providencia', 105, 1, NULL),
(10516, 'San Cristóbal', 105, 1, NULL),
(10517, 'San Francisco de Yeso', 105, 1, NULL),
(10518, 'San Jerónimo', 105, 1, NULL),
(10519, 'San Juan de Lopecancha', 105, 1, NULL),
(10520, 'Santa Catalina', 105, 1, NULL),
(10521, 'Santo Tomas', 105, 1, NULL),
(10522, 'Tingo', 105, 1, NULL),
(10523, 'Trita', 105, 1, NULL),
(10601, 'San Nicolás', 106, 1, NULL),
(10602, 'Chirimoto', 106, 1, NULL),
(10603, 'Cochamal', 106, 1, NULL),
(10604, 'Huambo', 106, 1, NULL),
(10605, 'Limabamba', 106, 1, NULL),
(10606, 'Longar', 106, 1, NULL),
(10607, 'Mariscal Benavides', 106, 1, NULL),
(10608, 'Milpuc', 106, 1, NULL),
(10609, 'Omia', 106, 1, NULL),
(10610, 'Santa Rosa', 106, 1, NULL),
(10611, 'Totora', 106, 1, NULL),
(10612, 'Vista Alegre', 106, 1, NULL),
(10701, 'Bagua Grande', 107, 1, NULL),
(10702, 'Cajaruro', 107, 1, NULL),
(10703, 'Cumba', 107, 1, NULL),
(10704, 'El Milagro', 107, 1, NULL),
(10705, 'Jamalca', 107, 1, NULL),
(10706, 'Lonya Grande', 107, 1, NULL),
(10707, 'Yamon', 107, 1, NULL),
(20101, 'Huaraz', 201, 2, NULL),
(20102, 'Cochabamba', 201, 2, NULL),
(20103, 'Colcabamba', 201, 2, NULL),
(20104, 'Huanchay', 201, 2, NULL),
(20105, 'Independencia', 201, 2, NULL),
(20106, 'Jangas', 201, 2, NULL),
(20107, 'La Libertad', 201, 2, NULL),
(20108, 'Olleros', 201, 2, NULL),
(20109, 'Pampas Grande', 201, 2, NULL),
(20110, 'Pariacoto', 201, 2, NULL),
(20111, 'Pira', 201, 2, NULL),
(20112, 'Tarica', 201, 2, NULL),
(20201, 'Aija', 202, 2, NULL),
(20202, 'Coris', 202, 2, NULL),
(20203, 'Huacllan', 202, 2, NULL),
(20204, 'La Merced', 202, 2, NULL),
(20205, 'Succha', 202, 2, NULL),
(20301, 'Llamellin', 203, 2, NULL),
(20302, 'Aczo', 203, 2, NULL),
(20303, 'Chaccho', 203, 2, NULL),
(20304, 'Chingas', 203, 2, NULL),
(20305, 'Mirgas', 203, 2, NULL),
(20306, 'San Juan de Rontoy', 203, 2, NULL),
(20401, 'Chacas', 204, 2, NULL),
(20402, 'Acochaca', 204, 2, NULL),
(20501, 'Chiquian', 205, 2, NULL),
(20502, 'Abelardo Pardo Lezameta', 205, 2, NULL),
(20503, 'Antonio Raymondi', 205, 2, NULL),
(20504, 'Aquia', 205, 2, NULL),
(20505, 'Cajacay', 205, 2, NULL),
(20506, 'Canis', 205, 2, NULL),
(20507, 'Colquioc', 205, 2, NULL),
(20508, 'Huallanca', 205, 2, NULL),
(20509, 'Huasta', 205, 2, NULL),
(20510, 'Huayllacayan', 205, 2, NULL),
(20511, 'La Primavera', 205, 2, NULL),
(20512, 'Mangas', 205, 2, NULL),
(20513, 'Pacllon', 205, 2, NULL),
(20514, 'San Miguel de Corpanqui', 205, 2, NULL),
(20515, 'Ticllos', 205, 2, NULL),
(20601, 'Carhuaz', 206, 2, NULL),
(20602, 'Acopampa', 206, 2, NULL),
(20603, 'Amashca', 206, 2, NULL),
(20604, 'Anta', 206, 2, NULL),
(20605, 'Ataquero', 206, 2, NULL),
(20606, 'Marcara', 206, 2, NULL),
(20607, 'Pariahuanca', 206, 2, NULL),
(20608, 'San Miguel de Aco', 206, 2, NULL),
(20609, 'Shilla', 206, 2, NULL),
(20610, 'Tinco', 206, 2, NULL),
(20611, 'Yungar', 206, 2, NULL),
(20701, 'San Luis', 207, 2, NULL),
(20702, 'San Nicolás', 207, 2, NULL),
(20703, 'Yauya', 207, 2, NULL),
(20801, 'Casma', 208, 2, NULL),
(20802, 'Buena Vista Alta', 208, 2, NULL),
(20803, 'Comandante Noel', 208, 2, NULL),
(20804, 'Yautan', 208, 2, NULL),
(20901, 'Corongo', 209, 2, NULL),
(20902, 'Aco', 209, 2, NULL),
(20903, 'Bambas', 209, 2, NULL),
(20904, 'Cusca', 209, 2, NULL),
(20905, 'La Pampa', 209, 2, NULL),
(20906, 'Yanac', 209, 2, NULL),
(20907, 'Yupan', 209, 2, NULL),
(21001, 'Huari', 210, 2, NULL),
(21002, 'Anra', 210, 2, NULL),
(21003, 'Cajay', 210, 2, NULL),
(21004, 'Chavin de Huantar', 210, 2, NULL),
(21005, 'Huacachi', 210, 2, NULL),
(21006, 'Huacchis', 210, 2, NULL),
(21007, 'Huachis', 210, 2, NULL),
(21008, 'Huantar', 210, 2, NULL),
(21009, 'Masin', 210, 2, NULL),
(21010, 'Paucas', 210, 2, NULL),
(21011, 'Ponto', 210, 2, NULL),
(21012, 'Rahuapampa', 210, 2, NULL),
(21013, 'Rapayan', 210, 2, NULL),
(21014, 'San Marcos', 210, 2, NULL),
(21015, 'San Pedro de Chana', 210, 2, NULL),
(21016, 'Uco', 210, 2, NULL),
(21101, 'Huarmey', 211, 2, NULL),
(21102, 'Cochapeti', 211, 2, NULL),
(21103, 'Culebras', 211, 2, NULL),
(21104, 'Huayan', 211, 2, NULL),
(21105, 'Malvas', 211, 2, NULL),
(21201, 'Caraz', 212, 2, NULL),
(21202, 'Huallanca', 212, 2, NULL),
(21203, 'Huata', 212, 2, NULL),
(21204, 'Huaylas', 212, 2, NULL),
(21205, 'Mato', 212, 2, NULL),
(21206, 'Pamparomas', 212, 2, NULL),
(21207, 'Pueblo Libre', 212, 2, NULL),
(21208, 'Santa Cruz', 212, 2, NULL),
(21209, 'Santo Toribio', 212, 2, NULL),
(21210, 'Yuracmarca', 212, 2, NULL),
(21301, 'Piscobamba', 213, 2, NULL),
(21302, 'Casca', 213, 2, NULL),
(21303, 'Eleazar Guzmán Barron', 213, 2, NULL),
(21304, 'Fidel Olivas Escudero', 213, 2, NULL),
(21305, 'Llama', 213, 2, NULL),
(21306, 'Llumpa', 213, 2, NULL),
(21307, 'Lucma', 213, 2, NULL),
(21308, 'Musga', 213, 2, NULL),
(21401, 'Ocros', 214, 2, NULL),
(21402, 'Acas', 214, 2, NULL),
(21403, 'Cajamarquilla', 214, 2, NULL),
(21404, 'Carhuapampa', 214, 2, NULL),
(21405, 'Cochas', 214, 2, NULL),
(21406, 'Congas', 214, 2, NULL),
(21407, 'Llipa', 214, 2, NULL),
(21408, 'San Cristóbal de Rajan', 214, 2, NULL),
(21409, 'San Pedro', 214, 2, NULL),
(21410, 'Santiago de Chilcas', 214, 2, NULL),
(21501, 'Cabana', 215, 2, NULL),
(21502, 'Bolognesi', 215, 2, NULL),
(21503, 'Conchucos', 215, 2, NULL),
(21504, 'Huacaschuque', 215, 2, NULL),
(21505, 'Huandoval', 215, 2, NULL),
(21506, 'Lacabamba', 215, 2, NULL),
(21507, 'Llapo', 215, 2, NULL),
(21508, 'Pallasca', 215, 2, NULL),
(21509, 'Pampas', 215, 2, NULL),
(21510, 'Santa Rosa', 215, 2, NULL),
(21511, 'Tauca', 215, 2, NULL),
(21601, 'Pomabamba', 216, 2, NULL),
(21602, 'Huayllan', 216, 2, NULL),
(21603, 'Parobamba', 216, 2, NULL),
(21604, 'Quinuabamba', 216, 2, NULL),
(21701, 'Recuay', 217, 2, NULL),
(21702, 'Catac', 217, 2, NULL),
(21703, 'Cotaparaco', 217, 2, NULL),
(21704, 'Huayllapampa', 217, 2, NULL),
(21705, 'Llacllin', 217, 2, NULL),
(21706, 'Marca', 217, 2, NULL),
(21707, 'Pampas Chico', 217, 2, NULL),
(21708, 'Pararin', 217, 2, NULL),
(21709, 'Tapacocha', 217, 2, NULL),
(21710, 'Ticapampa', 217, 2, NULL),
(21801, 'Chimbote', 218, 2, NULL),
(21802, 'Cáceres del Perú', 218, 2, NULL),
(21803, 'Coishco', 218, 2, NULL),
(21804, 'Macate', 218, 2, NULL),
(21805, 'Moro', 218, 2, NULL),
(21806, 'Nepeña', 218, 2, NULL),
(21807, 'Samanco', 218, 2, NULL),
(21808, 'Santa', 218, 2, NULL),
(21809, 'Nuevo Chimbote', 218, 2, NULL),
(21901, 'Sihuas', 219, 2, NULL),
(21902, 'Acobamba', 219, 2, NULL),
(21903, 'Alfonso Ugarte', 219, 2, NULL),
(21904, 'Cashapampa', 219, 2, NULL),
(21905, 'Chingalpo', 219, 2, NULL),
(21906, 'Huayllabamba', 219, 2, NULL),
(21907, 'Quiches', 219, 2, NULL),
(21908, 'Ragash', 219, 2, NULL),
(21909, 'San Juan', 219, 2, NULL),
(21910, 'Sicsibamba', 219, 2, NULL),
(22001, 'Yungay', 220, 2, NULL),
(22002, 'Cascapara', 220, 2, NULL),
(22003, 'Mancos', 220, 2, NULL),
(22004, 'Matacoto', 220, 2, NULL),
(22005, 'Quillo', 220, 2, NULL),
(22006, 'Ranrahirca', 220, 2, NULL),
(22007, 'Shupluy', 220, 2, NULL),
(22008, 'Yanama', 220, 2, NULL),
(30101, 'Abancay', 301, 3, NULL),
(30102, 'Chacoche', 301, 3, NULL),
(30103, 'Circa', 301, 3, NULL),
(30104, 'Curahuasi', 301, 3, NULL),
(30105, 'Huanipaca', 301, 3, NULL),
(30106, 'Lambrama', 301, 3, NULL),
(30107, 'Pichirhua', 301, 3, NULL),
(30108, 'San Pedro de Cachora', 301, 3, NULL),
(30109, 'Tamburco', 301, 3, NULL),
(30201, 'Andahuaylas', 302, 3, NULL),
(30202, 'Andarapa', 302, 3, NULL),
(30203, 'Chiara', 302, 3, NULL),
(30204, 'Huancarama', 302, 3, NULL),
(30205, 'Huancaray', 302, 3, NULL),
(30206, 'Huayana', 302, 3, NULL),
(30207, 'Kishuara', 302, 3, NULL),
(30208, 'Pacobamba', 302, 3, NULL),
(30209, 'Pacucha', 302, 3, NULL),
(30210, 'Pampachiri', 302, 3, NULL),
(30211, 'Pomacocha', 302, 3, NULL),
(30212, 'San Antonio de Cachi', 302, 3, NULL),
(30213, 'San Jerónimo', 302, 3, NULL),
(30214, 'San Miguel de Chaccrampa', 302, 3, NULL),
(30215, 'Santa María de Chicmo', 302, 3, NULL),
(30216, 'Talavera', 302, 3, NULL),
(30217, 'Tumay Huaraca', 302, 3, NULL),
(30218, 'Turpo', 302, 3, NULL),
(30219, 'Kaquiabamba', 302, 3, NULL),
(30220, 'José María Arguedas', 302, 3, NULL),
(30301, 'Antabamba', 303, 3, NULL),
(30302, 'El Oro', 303, 3, NULL),
(30303, 'Huaquirca', 303, 3, NULL),
(30304, 'Juan Espinoza Medrano', 303, 3, NULL),
(30305, 'Oropesa', 303, 3, NULL),
(30306, 'Pachaconas', 303, 3, NULL),
(30307, 'Sabaino', 303, 3, NULL),
(30401, 'Chalhuanca', 304, 3, NULL),
(30402, 'Capaya', 304, 3, NULL),
(30403, 'Caraybamba', 304, 3, NULL),
(30404, 'Chapimarca', 304, 3, NULL),
(30405, 'Colcabamba', 304, 3, NULL),
(30406, 'Cotaruse', 304, 3, NULL),
(30407, 'Ihuayllo', 304, 3, NULL),
(30408, 'Justo Apu Sahuaraura', 304, 3, NULL),
(30409, 'Lucre', 304, 3, NULL),
(30410, 'Pocohuanca', 304, 3, NULL),
(30411, 'San Juan de Chacña', 304, 3, NULL),
(30412, 'Sañayca', 304, 3, NULL),
(30413, 'Soraya', 304, 3, NULL),
(30414, 'Tapairihua', 304, 3, NULL),
(30415, 'Tintay', 304, 3, NULL),
(30416, 'Toraya', 304, 3, NULL),
(30417, 'Yanaca', 304, 3, NULL),
(30501, 'Tambobamba', 305, 3, NULL),
(30502, 'Cotabambas', 305, 3, NULL),
(30503, 'Coyllurqui', 305, 3, NULL),
(30504, 'Haquira', 305, 3, NULL),
(30505, 'Mara', 305, 3, NULL),
(30506, 'Challhuahuacho', 305, 3, NULL),
(30601, 'Chincheros', 306, 3, NULL),
(30602, 'Anco_Huallo', 306, 3, NULL),
(30603, 'Cocharcas', 306, 3, NULL),
(30604, 'Huaccana', 306, 3, NULL),
(30605, 'Ocobamba', 306, 3, NULL),
(30606, 'Ongoy', 306, 3, NULL),
(30607, 'Uranmarca', 306, 3, NULL),
(30608, 'Ranracancha', 306, 3, NULL),
(30609, 'Rocchacc', 306, 3, NULL),
(30610, 'El Porvenir', 306, 3, NULL),
(30611, 'Los Chankas', 306, 3, NULL),
(30701, 'Chuquibambilla', 307, 3, NULL),
(30702, 'Curpahuasi', 307, 3, NULL),
(30703, 'Gamarra', 307, 3, NULL),
(30704, 'Huayllati', 307, 3, NULL),
(30705, 'Mamara', 307, 3, NULL),
(30706, 'Micaela Bastidas', 307, 3, NULL),
(30707, 'Pataypampa', 307, 3, NULL),
(30708, 'Progreso', 307, 3, NULL),
(30709, 'San Antonio', 307, 3, NULL),
(30710, 'Santa Rosa', 307, 3, NULL),
(30711, 'Turpay', 307, 3, NULL),
(30712, 'Vilcabamba', 307, 3, NULL),
(30713, 'Virundo', 307, 3, NULL),
(30714, 'Curasco', 307, 3, NULL),
(40101, 'Arequipa', 401, 4, NULL),
(40102, 'Alto Selva Alegre', 401, 4, NULL),
(40103, 'Cayma', 401, 4, NULL),
(40104, 'Cerro Colorado', 401, 4, NULL),
(40105, 'Characato', 401, 4, NULL),
(40106, 'Chiguata', 401, 4, NULL),
(40107, 'Jacobo Hunter', 401, 4, NULL),
(40108, 'La Joya', 401, 4, NULL),
(40109, 'Mariano Melgar', 401, 4, NULL),
(40110, 'Miraflores', 401, 4, NULL),
(40111, 'Mollebaya', 401, 4, NULL),
(40112, 'Paucarpata', 401, 4, NULL),
(40113, 'Pocsi', 401, 4, NULL),
(40114, 'Polobaya', 401, 4, NULL),
(40115, 'Quequeña', 401, 4, NULL),
(40116, 'Sabandia', 401, 4, NULL),
(40117, 'Sachaca', 401, 4, NULL),
(40118, 'San Juan de Siguas', 401, 4, NULL),
(40119, 'San Juan de Tarucani', 401, 4, NULL),
(40120, 'Santa Isabel de Siguas', 401, 4, NULL),
(40121, 'Santa Rita de Siguas', 401, 4, NULL),
(40122, 'Socabaya', 401, 4, NULL),
(40123, 'Tiabaya', 401, 4, NULL),
(40124, 'Uchumayo', 401, 4, NULL),
(40125, 'Vitor', 401, 4, NULL),
(40126, 'Yanahuara', 401, 4, NULL),
(40127, 'Yarabamba', 401, 4, NULL),
(40128, 'Yura', 401, 4, NULL),
(40129, 'José Luis Bustamante Y Rivero', 401, 4, NULL),
(40201, 'Camaná', 402, 4, NULL),
(40202, 'José María Quimper', 402, 4, NULL),
(40203, 'Mariano Nicolás Valcárcel', 402, 4, NULL),
(40204, 'Mariscal Cáceres', 402, 4, NULL),
(40205, 'Nicolás de Pierola', 402, 4, NULL),
(40206, 'Ocoña', 402, 4, NULL),
(40207, 'Quilca', 402, 4, NULL),
(40208, 'Samuel Pastor', 402, 4, NULL),
(40301, 'Caravelí', 403, 4, NULL),
(40302, 'Acarí', 403, 4, NULL),
(40303, 'Atico', 403, 4, NULL),
(40304, 'Atiquipa', 403, 4, NULL),
(40305, 'Bella Unión', 403, 4, NULL),
(40306, 'Cahuacho', 403, 4, NULL),
(40307, 'Chala', 403, 4, NULL),
(40308, 'Chaparra', 403, 4, NULL),
(40309, 'Huanuhuanu', 403, 4, NULL),
(40310, 'Jaqui', 403, 4, NULL),
(40311, 'Lomas', 403, 4, NULL),
(40312, 'Quicacha', 403, 4, NULL),
(40313, 'Yauca', 403, 4, NULL),
(40401, 'Aplao', 404, 4, NULL),
(40402, 'Andagua', 404, 4, NULL),
(40403, 'Ayo', 404, 4, NULL),
(40404, 'Chachas', 404, 4, NULL),
(40405, 'Chilcaymarca', 404, 4, NULL),
(40406, 'Choco', 404, 4, NULL),
(40407, 'Huancarqui', 404, 4, NULL),
(40408, 'Machaguay', 404, 4, NULL),
(40409, 'Orcopampa', 404, 4, NULL),
(40410, 'Pampacolca', 404, 4, NULL),
(40411, 'Tipan', 404, 4, NULL),
(40412, 'Uñon', 404, 4, NULL),
(40413, 'Uraca', 404, 4, NULL),
(40414, 'Viraco', 404, 4, NULL),
(40501, 'Chivay', 405, 4, NULL),
(40502, 'Achoma', 405, 4, NULL),
(40503, 'Cabanaconde', 405, 4, NULL),
(40504, 'Callalli', 405, 4, NULL),
(40505, 'Caylloma', 405, 4, NULL),
(40506, 'Coporaque', 405, 4, NULL),
(40507, 'Huambo', 405, 4, NULL),
(40508, 'Huanca', 405, 4, NULL),
(40509, 'Ichupampa', 405, 4, NULL),
(40510, 'Lari', 405, 4, NULL),
(40511, 'Lluta', 405, 4, NULL),
(40512, 'Maca', 405, 4, NULL),
(40513, 'Madrigal', 405, 4, NULL),
(40514, 'San Antonio de Chuca', 405, 4, NULL),
(40515, 'Sibayo', 405, 4, NULL),
(40516, 'Tapay', 405, 4, NULL),
(40517, 'Tisco', 405, 4, NULL),
(40518, 'Tuti', 405, 4, NULL),
(40519, 'Yanque', 405, 4, NULL),
(40520, 'Majes', 405, 4, NULL),
(40601, 'Chuquibamba', 406, 4, NULL),
(40602, 'Andaray', 406, 4, NULL),
(40603, 'Cayarani', 406, 4, NULL),
(40604, 'Chichas', 406, 4, NULL),
(40605, 'Iray', 406, 4, NULL),
(40606, 'Río Grande', 406, 4, NULL),
(40607, 'Salamanca', 406, 4, NULL),
(40608, 'Yanaquihua', 406, 4, NULL),
(40701, 'Mollendo', 407, 4, NULL),
(40702, 'Cocachacra', 407, 4, NULL),
(40703, 'Dean Valdivia', 407, 4, NULL),
(40704, 'Islay', 407, 4, NULL),
(40705, 'Mejia', 407, 4, NULL),
(40706, 'Punta de Bombón', 407, 4, NULL),
(40801, 'Cotahuasi', 408, 4, NULL),
(40802, 'Alca', 408, 4, NULL),
(40803, 'Charcana', 408, 4, NULL),
(40804, 'Huaynacotas', 408, 4, NULL),
(40805, 'Pampamarca', 408, 4, NULL),
(40806, 'Puyca', 408, 4, NULL),
(40807, 'Quechualla', 408, 4, NULL),
(40808, 'Sayla', 408, 4, NULL),
(40809, 'Tauria', 408, 4, NULL),
(40810, 'Tomepampa', 408, 4, NULL),
(40811, 'Toro', 408, 4, NULL),
(50101, 'Ayacucho', 501, 5, NULL),
(50102, 'Acocro', 501, 5, NULL),
(50103, 'Acos Vinchos', 501, 5, NULL),
(50104, 'Carmen Alto', 501, 5, NULL),
(50105, 'Chiara', 501, 5, NULL),
(50106, 'Ocros', 501, 5, NULL),
(50107, 'Pacaycasa', 501, 5, NULL),
(50108, 'Quinua', 501, 5, NULL),
(50109, 'San José de Ticllas', 501, 5, NULL),
(50110, 'San Juan Bautista', 501, 5, NULL),
(50111, 'Santiago de Pischa', 501, 5, NULL),
(50112, 'Socos', 501, 5, NULL),
(50113, 'Tambillo', 501, 5, NULL),
(50114, 'Vinchos', 501, 5, NULL),
(50115, 'Jesús Nazareno', 501, 5, NULL),
(50116, 'Andrés Avelino Cáceres Dorregaray', 501, 5, NULL),
(50201, 'Cangallo', 502, 5, NULL),
(50202, 'Chuschi', 502, 5, NULL),
(50203, 'Los Morochucos', 502, 5, NULL),
(50204, 'María Parado de Bellido', 502, 5, NULL),
(50205, 'Paras', 502, 5, NULL),
(50206, 'Totos', 502, 5, NULL),
(50301, 'Sancos', 503, 5, NULL),
(50302, 'Carapo', 503, 5, NULL),
(50303, 'Sacsamarca', 503, 5, NULL),
(50304, 'Santiago de Lucanamarca', 503, 5, NULL),
(50401, 'Huanta', 504, 5, NULL),
(50402, 'Ayahuanco', 504, 5, NULL),
(50403, 'Huamanguilla', 504, 5, NULL),
(50404, 'Iguain', 504, 5, NULL),
(50405, 'Luricocha', 504, 5, NULL),
(50406, 'Santillana', 504, 5, NULL),
(50407, 'Sivia', 504, 5, NULL),
(50408, 'Llochegua', 504, 5, NULL),
(50409, 'Canayre', 504, 5, NULL),
(50410, 'Uchuraccay', 504, 5, NULL),
(50411, 'Pucacolpa', 504, 5, NULL),
(50412, 'Chaca', 504, 5, NULL),
(50501, 'San Miguel', 505, 5, NULL),
(50502, 'Anco', 505, 5, NULL),
(50503, 'Ayna', 505, 5, NULL),
(50504, 'Chilcas', 505, 5, NULL),
(50505, 'Chungui', 505, 5, NULL),
(50506, 'Luis Carranza', 505, 5, NULL),
(50507, 'Santa Rosa', 505, 5, NULL),
(50508, 'Tambo', 505, 5, NULL),
(50509, 'Samugari', 505, 5, NULL),
(50510, 'Anchihuay', 505, 5, NULL),
(50511, 'Oronccoy', 505, 5, NULL),
(50601, 'Puquio', 506, 5, NULL),
(50602, 'Aucara', 506, 5, NULL),
(50603, 'Cabana', 506, 5, NULL),
(50604, 'Carmen Salcedo', 506, 5, NULL),
(50605, 'Chaviña', 506, 5, NULL),
(50606, 'Chipao', 506, 5, NULL),
(50607, 'Huac-Huas', 506, 5, NULL),
(50608, 'Laramate', 506, 5, NULL),
(50609, 'Leoncio Prado', 506, 5, NULL),
(50610, 'Llauta', 506, 5, NULL),
(50611, 'Lucanas', 506, 5, NULL),
(50612, 'Ocaña', 506, 5, NULL),
(50613, 'Otoca', 506, 5, NULL),
(50614, 'Saisa', 506, 5, NULL),
(50615, 'San Cristóbal', 506, 5, NULL),
(50616, 'San Juan', 506, 5, NULL),
(50617, 'San Pedro', 506, 5, NULL),
(50618, 'San Pedro de Palco', 506, 5, NULL),
(50619, 'Sancos', 506, 5, NULL),
(50620, 'Santa Ana de Huaycahuacho', 506, 5, NULL),
(50621, 'Santa Lucia', 506, 5, NULL),
(50701, 'Coracora', 507, 5, NULL),
(50702, 'Chumpi', 507, 5, NULL),
(50703, 'Coronel Castañeda', 507, 5, NULL),
(50704, 'Pacapausa', 507, 5, NULL),
(50705, 'Pullo', 507, 5, NULL),
(50706, 'Puyusca', 507, 5, NULL),
(50707, 'San Francisco de Ravacayco', 507, 5, NULL),
(50708, 'Upahuacho', 507, 5, NULL),
(50801, 'Pausa', 508, 5, NULL),
(50802, 'Colta', 508, 5, NULL),
(50803, 'Corculla', 508, 5, NULL),
(50804, 'Lampa', 508, 5, NULL),
(50805, 'Marcabamba', 508, 5, NULL),
(50806, 'Oyolo', 508, 5, NULL),
(50807, 'Pararca', 508, 5, NULL),
(50808, 'San Javier de Alpabamba', 508, 5, NULL),
(50809, 'San José de Ushua', 508, 5, NULL),
(50810, 'Sara Sara', 508, 5, NULL),
(50901, 'Querobamba', 509, 5, NULL),
(50902, 'Belén', 509, 5, NULL),
(50903, 'Chalcos', 509, 5, NULL),
(50904, 'Chilcayoc', 509, 5, NULL),
(50905, 'Huacaña', 509, 5, NULL),
(50906, 'Morcolla', 509, 5, NULL),
(50907, 'Paico', 509, 5, NULL),
(50908, 'San Pedro de Larcay', 509, 5, NULL),
(50909, 'San Salvador de Quije', 509, 5, NULL),
(50910, 'Santiago de Paucaray', 509, 5, NULL),
(50911, 'Soras', 509, 5, NULL),
(51001, 'Huancapi', 510, 5, NULL),
(51002, 'Alcamenca', 510, 5, NULL),
(51003, 'Apongo', 510, 5, NULL),
(51004, 'Asquipata', 510, 5, NULL),
(51005, 'Canaria', 510, 5, NULL),
(51006, 'Cayara', 510, 5, NULL),
(51007, 'Colca', 510, 5, NULL),
(51008, 'Huamanquiquia', 510, 5, NULL),
(51009, 'Huancaraylla', 510, 5, NULL),
(51010, 'Hualla', 510, 5, NULL),
(51011, 'Sarhua', 510, 5, NULL),
(51012, 'Vilcanchos', 510, 5, NULL),
(51101, 'Vilcas Huaman', 511, 5, NULL),
(51102, 'Accomarca', 511, 5, NULL),
(51103, 'Carhuanca', 511, 5, NULL),
(51104, 'Concepción', 511, 5, NULL),
(51105, 'Huambalpa', 511, 5, NULL),
(51106, 'Independencia', 511, 5, NULL),
(51107, 'Saurama', 511, 5, NULL),
(51108, 'Vischongo', 511, 5, NULL),
(60101, 'Cajamarca', 601, 6, NULL),
(60102, 'Asunción', 601, 6, NULL),
(60103, 'Chetilla', 601, 6, NULL),
(60104, 'Cospan', 601, 6, NULL),
(60105, 'Encañada', 601, 6, NULL),
(60106, 'Jesús', 601, 6, NULL),
(60107, 'Llacanora', 601, 6, NULL),
(60108, 'Los Baños del Inca', 601, 6, NULL),
(60109, 'Magdalena', 601, 6, NULL),
(60110, 'Matara', 601, 6, NULL),
(60111, 'Namora', 601, 6, NULL),
(60112, 'San Juan', 601, 6, NULL),
(60201, 'Cajabamba', 602, 6, NULL),
(60202, 'Cachachi', 602, 6, NULL),
(60203, 'Condebamba', 602, 6, NULL),
(60204, 'Sitacocha', 602, 6, NULL),
(60301, 'Celendín', 603, 6, NULL),
(60302, 'Chumuch', 603, 6, NULL),
(60303, 'Cortegana', 603, 6, NULL),
(60304, 'Huasmin', 603, 6, NULL),
(60305, 'Jorge Chávez', 603, 6, NULL),
(60306, 'José Gálvez', 603, 6, NULL),
(60307, 'Miguel Iglesias', 603, 6, NULL),
(60308, 'Oxamarca', 603, 6, NULL),
(60309, 'Sorochuco', 603, 6, NULL),
(60310, 'Sucre', 603, 6, NULL),
(60311, 'Utco', 603, 6, NULL),
(60312, 'La Libertad de Pallan', 603, 6, NULL),
(60401, 'Chota', 604, 6, NULL),
(60402, 'Anguia', 604, 6, NULL),
(60403, 'Chadin', 604, 6, NULL),
(60404, 'Chiguirip', 604, 6, NULL),
(60405, 'Chimban', 604, 6, NULL),
(60406, 'Choropampa', 604, 6, NULL),
(60407, 'Cochabamba', 604, 6, NULL),
(60408, 'Conchan', 604, 6, NULL),
(60409, 'Huambos', 604, 6, NULL),
(60410, 'Lajas', 604, 6, NULL),
(60411, 'Llama', 604, 6, NULL),
(60412, 'Miracosta', 604, 6, NULL),
(60413, 'Paccha', 604, 6, NULL),
(60414, 'Pion', 604, 6, NULL),
(60415, 'Querocoto', 604, 6, NULL),
(60416, 'San Juan de Licupis', 604, 6, NULL),
(60417, 'Tacabamba', 604, 6, NULL),
(60418, 'Tocmoche', 604, 6, NULL),
(60419, 'Chalamarca', 604, 6, NULL),
(60501, 'Contumaza', 605, 6, NULL),
(60502, 'Chilete', 605, 6, NULL),
(60503, 'Cupisnique', 605, 6, NULL),
(60504, 'Guzmango', 605, 6, NULL),
(60505, 'San Benito', 605, 6, NULL),
(60506, 'Santa Cruz de Toledo', 605, 6, NULL),
(60507, 'Tantarica', 605, 6, NULL),
(60508, 'Yonan', 605, 6, NULL),
(60601, 'Cutervo', 606, 6, NULL),
(60602, 'Callayuc', 606, 6, NULL),
(60603, 'Choros', 606, 6, NULL),
(60604, 'Cujillo', 606, 6, NULL),
(60605, 'La Ramada', 606, 6, NULL),
(60606, 'Pimpingos', 606, 6, NULL),
(60607, 'Querocotillo', 606, 6, NULL),
(60608, 'San Andrés de Cutervo', 606, 6, NULL),
(60609, 'San Juan de Cutervo', 606, 6, NULL),
(60610, 'San Luis de Lucma', 606, 6, NULL),
(60611, 'Santa Cruz', 606, 6, NULL),
(60612, 'Santo Domingo de la Capilla', 606, 6, NULL),
(60613, 'Santo Tomas', 606, 6, NULL),
(60614, 'Socota', 606, 6, NULL),
(60615, 'Toribio Casanova', 606, 6, NULL),
(60701, 'Bambamarca', 607, 6, NULL),
(60702, 'Chugur', 607, 6, NULL),
(60703, 'Hualgayoc', 607, 6, NULL),
(60801, 'Jaén', 608, 6, NULL),
(60802, 'Bellavista', 608, 6, NULL),
(60803, 'Chontali', 608, 6, NULL),
(60804, 'Colasay', 608, 6, NULL),
(60805, 'Huabal', 608, 6, NULL),
(60806, 'Las Pirias', 608, 6, NULL),
(60807, 'Pomahuaca', 608, 6, NULL),
(60808, 'Pucara', 608, 6, NULL),
(60809, 'Sallique', 608, 6, NULL),
(60810, 'San Felipe', 608, 6, NULL),
(60811, 'San José del Alto', 608, 6, NULL),
(60812, 'Santa Rosa', 608, 6, NULL),
(60901, 'San Ignacio', 609, 6, NULL),
(60902, 'Chirinos', 609, 6, NULL),
(60903, 'Huarango', 609, 6, NULL),
(60904, 'La Coipa', 609, 6, NULL),
(60905, 'Namballe', 609, 6, NULL),
(60906, 'San José de Lourdes', 609, 6, NULL),
(60907, 'Tabaconas', 609, 6, NULL),
(61001, 'Pedro Gálvez', 610, 6, NULL),
(61002, 'Chancay', 610, 6, NULL),
(61003, 'Eduardo Villanueva', 610, 6, NULL),
(61004, 'Gregorio Pita', 610, 6, NULL),
(61005, 'Ichocan', 610, 6, NULL),
(61006, 'José Manuel Quiroz', 610, 6, NULL),
(61007, 'José Sabogal', 610, 6, NULL),
(61101, 'San Miguel', 611, 6, NULL),
(61102, 'Bolívar', 611, 6, NULL),
(61103, 'Calquis', 611, 6, NULL),
(61104, 'Catilluc', 611, 6, NULL),
(61105, 'El Prado', 611, 6, NULL),
(61106, 'La Florida', 611, 6, NULL),
(61107, 'Llapa', 611, 6, NULL),
(61108, 'Nanchoc', 611, 6, NULL),
(61109, 'Niepos', 611, 6, NULL),
(61110, 'San Gregorio', 611, 6, NULL),
(61111, 'San Silvestre de Cochan', 611, 6, NULL),
(61112, 'Tongod', 611, 6, NULL),
(61113, 'Unión Agua Blanca', 611, 6, NULL),
(61201, 'San Pablo', 612, 6, NULL),
(61202, 'San Bernardino', 612, 6, NULL),
(61203, 'San Luis', 612, 6, NULL),
(61204, 'Tumbaden', 612, 6, NULL),
(61301, 'Santa Cruz', 613, 6, NULL),
(61302, 'Andabamba', 613, 6, NULL),
(61303, 'Catache', 613, 6, NULL),
(61304, 'Chancaybaños', 613, 6, NULL),
(61305, 'La Esperanza', 613, 6, NULL),
(61306, 'Ninabamba', 613, 6, NULL),
(61307, 'Pulan', 613, 6, NULL),
(61308, 'Saucepampa', 613, 6, NULL),
(61309, 'Sexi', 613, 6, NULL),
(61310, 'Uticyacu', 613, 6, NULL),
(61311, 'Yauyucan', 613, 6, NULL),
(70101, 'Callao', 701, 7, NULL),
(70102, 'Bellavista', 701, 7, NULL),
(70103, 'Carmen de la Legua Reynoso', 701, 7, NULL),
(70104, 'La Perla', 701, 7, NULL),
(70105, 'La Punta', 701, 7, NULL),
(70106, 'Ventanilla', 701, 7, NULL),
(70107, 'Mi Perú', 701, 7, NULL),
(80101, 'Cusco', 801, 8, NULL),
(80102, 'Ccorca', 801, 8, NULL),
(80103, 'Poroy', 801, 8, NULL),
(80104, 'San Jerónimo', 801, 8, NULL),
(80105, 'San Sebastian', 801, 8, NULL),
(80106, 'Santiago', 801, 8, NULL),
(80107, 'Saylla', 801, 8, NULL),
(80108, 'Wanchaq', 801, 8, NULL),
(80201, 'Acomayo', 802, 8, NULL),
(80202, 'Acopia', 802, 8, NULL),
(80203, 'Acos', 802, 8, NULL),
(80204, 'Mosoc Llacta', 802, 8, NULL),
(80205, 'Pomacanchi', 802, 8, NULL),
(80206, 'Rondocan', 802, 8, NULL),
(80207, 'Sangarara', 802, 8, NULL),
(80301, 'Anta', 803, 8, NULL),
(80302, 'Ancahuasi', 803, 8, NULL),
(80303, 'Cachimayo', 803, 8, NULL),
(80304, 'Chinchaypujio', 803, 8, NULL),
(80305, 'Huarocondo', 803, 8, NULL),
(80306, 'Limatambo', 803, 8, NULL),
(80307, 'Mollepata', 803, 8, NULL),
(80308, 'Pucyura', 803, 8, NULL),
(80309, 'Zurite', 803, 8, NULL),
(80401, 'Calca', 804, 8, NULL),
(80402, 'Coya', 804, 8, NULL),
(80403, 'Lamay', 804, 8, NULL),
(80404, 'Lares', 804, 8, NULL),
(80405, 'Pisac', 804, 8, NULL),
(80406, 'San Salvador', 804, 8, NULL),
(80407, 'Taray', 804, 8, NULL),
(80408, 'Yanatile', 804, 8, NULL),
(80501, 'Yanaoca', 805, 8, NULL),
(80502, 'Checca', 805, 8, NULL),
(80503, 'Kunturkanki', 805, 8, NULL),
(80504, 'Langui', 805, 8, NULL),
(80505, 'Layo', 805, 8, NULL),
(80506, 'Pampamarca', 805, 8, NULL),
(80507, 'Quehue', 805, 8, NULL),
(80508, 'Tupac Amaru', 805, 8, NULL),
(80601, 'Sicuani', 806, 8, NULL),
(80602, 'Checacupe', 806, 8, NULL),
(80603, 'Combapata', 806, 8, NULL),
(80604, 'Marangani', 806, 8, NULL),
(80605, 'Pitumarca', 806, 8, NULL),
(80606, 'San Pablo', 806, 8, NULL),
(80607, 'San Pedro', 806, 8, NULL),
(80608, 'Tinta', 806, 8, NULL),
(80701, 'Santo Tomas', 807, 8, NULL),
(80702, 'Capacmarca', 807, 8, NULL),
(80703, 'Chamaca', 807, 8, NULL),
(80704, 'Colquemarca', 807, 8, NULL),
(80705, 'Livitaca', 807, 8, NULL),
(80706, 'Llusco', 807, 8, NULL),
(80707, 'Quiñota', 807, 8, NULL),
(80708, 'Velille', 807, 8, NULL),
(80801, 'Espinar', 808, 8, NULL),
(80802, 'Condoroma', 808, 8, NULL),
(80803, 'Coporaque', 808, 8, NULL),
(80804, 'Ocoruro', 808, 8, NULL),
(80805, 'Pallpata', 808, 8, NULL),
(80806, 'Pichigua', 808, 8, NULL),
(80807, 'Suyckutambo', 808, 8, NULL),
(80808, 'Alto Pichigua', 808, 8, NULL),
(80901, 'Santa Ana', 809, 8, NULL),
(80902, 'Echarate', 809, 8, NULL),
(80903, 'Huayopata', 809, 8, NULL),
(80904, 'Maranura', 809, 8, NULL),
(80905, 'Ocobamba', 809, 8, NULL),
(80906, 'Quellouno', 809, 8, NULL),
(80907, 'Kimbiri', 809, 8, NULL),
(80908, 'Santa Teresa', 809, 8, NULL),
(80909, 'Vilcabamba', 809, 8, NULL),
(80910, 'Pichari', 809, 8, NULL),
(80911, 'Inkawasi', 809, 8, NULL),
(80912, 'Villa Virgen', 809, 8, NULL),
(80913, 'Villa Kintiarina', 809, 8, NULL),
(80914, 'Megantoni', 809, 8, NULL),
(81001, 'Paruro', 810, 8, NULL),
(81002, 'Accha', 810, 8, NULL),
(81003, 'Ccapi', 810, 8, NULL),
(81004, 'Colcha', 810, 8, NULL),
(81005, 'Huanoquite', 810, 8, NULL),
(81006, 'Omachaç', 810, 8, NULL),
(81007, 'Paccaritambo', 810, 8, NULL),
(81008, 'Pillpinto', 810, 8, NULL),
(81009, 'Yaurisque', 810, 8, NULL),
(81101, 'Paucartambo', 811, 8, NULL),
(81102, 'Caicay', 811, 8, NULL),
(81103, 'Challabamba', 811, 8, NULL),
(81104, 'Colquepata', 811, 8, NULL),
(81105, 'Huancarani', 811, 8, NULL),
(81106, 'Kosñipata', 811, 8, NULL),
(81201, 'Urcos', 812, 8, NULL),
(81202, 'Andahuaylillas', 812, 8, NULL),
(81203, 'Camanti', 812, 8, NULL),
(81204, 'Ccarhuayo', 812, 8, NULL),
(81205, 'Ccatca', 812, 8, NULL),
(81206, 'Cusipata', 812, 8, NULL),
(81207, 'Huaro', 812, 8, NULL),
(81208, 'Lucre', 812, 8, NULL),
(81209, 'Marcapata', 812, 8, NULL),
(81210, 'Ocongate', 812, 8, NULL),
(81211, 'Oropesa', 812, 8, NULL),
(81212, 'Quiquijana', 812, 8, NULL),
(81301, 'Urubamba', 813, 8, NULL),
(81302, 'Chinchero', 813, 8, NULL),
(81303, 'Huayllabamba', 813, 8, NULL),
(81304, 'Machupicchu', 813, 8, NULL),
(81305, 'Maras', 813, 8, NULL),
(81306, 'Ollantaytambo', 813, 8, NULL),
(81307, 'Yucay', 813, 8, NULL),
(90101, 'Huancavelica', 901, 9, NULL),
(90102, 'Acobambilla', 901, 9, NULL),
(90103, 'Acoria', 901, 9, NULL),
(90104, 'Conayca', 901, 9, NULL),
(90105, 'Cuenca', 901, 9, NULL),
(90106, 'Huachocolpa', 901, 9, NULL),
(90107, 'Huayllahuara', 901, 9, NULL),
(90108, 'Izcuchaca', 901, 9, NULL),
(90109, 'Laria', 901, 9, NULL),
(90110, 'Manta', 901, 9, NULL),
(90111, 'Mariscal Cáceres', 901, 9, NULL),
(90112, 'Moya', 901, 9, NULL),
(90113, 'Nuevo Occoro', 901, 9, NULL),
(90114, 'Palca', 901, 9, NULL),
(90115, 'Pilchaca', 901, 9, NULL),
(90116, 'Vilca', 901, 9, NULL),
(90117, 'Yauli', 901, 9, NULL),
(90118, 'Ascensión', 901, 9, NULL),
(90119, 'Huando', 901, 9, NULL),
(90201, 'Acobamba', 902, 9, NULL),
(90202, 'Andabamba', 902, 9, NULL),
(90203, 'Anta', 902, 9, NULL),
(90204, 'Caja', 902, 9, NULL),
(90205, 'Marcas', 902, 9, NULL),
(90206, 'Paucara', 902, 9, NULL),
(90207, 'Pomacocha', 902, 9, NULL),
(90208, 'Rosario', 902, 9, NULL),
(90301, 'Lircay', 903, 9, NULL),
(90302, 'Anchonga', 903, 9, NULL),
(90303, 'Callanmarca', 903, 9, NULL),
(90304, 'Ccochaccasa', 903, 9, NULL),
(90305, 'Chincho', 903, 9, NULL),
(90306, 'Congalla', 903, 9, NULL),
(90307, 'Huanca-Huanca', 903, 9, NULL),
(90308, 'Huayllay Grande', 903, 9, NULL),
(90309, 'Julcamarca', 903, 9, NULL),
(90310, 'San Antonio de Antaparco', 903, 9, NULL),
(90311, 'Santo Tomas de Pata', 903, 9, NULL),
(90312, 'Secclla', 903, 9, NULL),
(90401, 'Castrovirreyna', 904, 9, NULL),
(90402, 'Arma', 904, 9, NULL),
(90403, 'Aurahua', 904, 9, NULL),
(90404, 'Capillas', 904, 9, NULL),
(90405, 'Chupamarca', 904, 9, NULL),
(90406, 'Cocas', 904, 9, NULL),
(90407, 'Huachos', 904, 9, NULL),
(90408, 'Huamatambo', 904, 9, NULL),
(90409, 'Mollepampa', 904, 9, NULL),
(90410, 'San Juan', 904, 9, NULL),
(90411, 'Santa Ana', 904, 9, NULL),
(90412, 'Tantara', 904, 9, NULL),
(90413, 'Ticrapo', 904, 9, NULL),
(90501, 'Churcampa', 905, 9, NULL),
(90502, 'Anco', 905, 9, NULL),
(90503, 'Chinchihuasi', 905, 9, NULL),
(90504, 'El Carmen', 905, 9, NULL),
(90505, 'La Merced', 905, 9, NULL),
(90506, 'Locroja', 905, 9, NULL),
(90507, 'Paucarbamba', 905, 9, NULL),
(90508, 'San Miguel de Mayocc', 905, 9, NULL),
(90509, 'San Pedro de Coris', 905, 9, NULL),
(90510, 'Pachamarca', 905, 9, NULL),
(90511, 'Cosme', 905, 9, NULL),
(90601, 'Huaytara', 906, 9, NULL),
(90602, 'Ayavi', 906, 9, NULL),
(90603, 'Córdova', 906, 9, NULL),
(90604, 'Huayacundo Arma', 906, 9, NULL),
(90605, 'Laramarca', 906, 9, NULL),
(90606, 'Ocoyo', 906, 9, NULL),
(90607, 'Pilpichaca', 906, 9, NULL),
(90608, 'Querco', 906, 9, NULL),
(90609, 'Quito-Arma', 906, 9, NULL),
(90610, 'San Antonio de Cusicancha', 906, 9, NULL),
(90611, 'San Francisco de Sangayaico', 906, 9, NULL),
(90612, 'San Isidro', 906, 9, NULL),
(90613, 'Santiago de Chocorvos', 906, 9, NULL),
(90614, 'Santiago de Quirahuara', 906, 9, NULL),
(90615, 'Santo Domingo de Capillas', 906, 9, NULL),
(90616, 'Tambo', 906, 9, NULL),
(90701, 'Pampas', 907, 9, NULL),
(90702, 'Acostambo', 907, 9, NULL),
(90703, 'Acraquia', 907, 9, NULL),
(90704, 'Ahuaycha', 907, 9, NULL),
(90705, 'Colcabamba', 907, 9, NULL),
(90706, 'Daniel Hernández', 907, 9, NULL),
(90707, 'Huachocolpa', 907, 9, NULL),
(90709, 'Huaribamba', 907, 9, NULL),
(90710, 'Ñahuimpuquio', 907, 9, NULL),
(90711, 'Pazos', 907, 9, NULL),
(90713, 'Quishuar', 907, 9, NULL),
(90714, 'Salcabamba', 907, 9, NULL),
(90715, 'Salcahuasi', 907, 9, NULL),
(90716, 'San Marcos de Rocchac', 907, 9, NULL),
(90717, 'Surcubamba', 907, 9, NULL),
(90718, 'Tintay Puncu', 907, 9, NULL),
(90719, 'Quichuas', 907, 9, NULL),
(90720, 'Andaymarca', 907, 9, NULL),
(90721, 'Roble', 907, 9, NULL),
(90722, 'Pichos', 907, 9, NULL),
(90723, 'Santiago de Tucuma', 907, 9, NULL),
(100101, 'Huanuco', 1001, 10, NULL),
(100102, 'Amarilis', 1001, 10, NULL),
(100103, 'Chinchao', 1001, 10, NULL),
(100104, 'Churubamba', 1001, 10, NULL),
(100105, 'Margos', 1001, 10, NULL),
(100106, 'Quisqui (Kichki)', 1001, 10, NULL),
(100107, 'San Francisco de Cayran', 1001, 10, NULL),
(100108, 'San Pedro de Chaulan', 1001, 10, NULL),
(100109, 'Santa María del Valle', 1001, 10, NULL),
(100110, 'Yarumayo', 1001, 10, NULL),
(100111, 'Pillco Marca', 1001, 10, NULL),
(100112, 'Yacus', 1001, 10, NULL),
(100113, 'San Pablo de Pillao', 1001, 10, NULL),
(100201, 'Ambo', 1002, 10, NULL),
(100202, 'Cayna', 1002, 10, NULL),
(100203, 'Colpas', 1002, 10, NULL),
(100204, 'Conchamarca', 1002, 10, NULL),
(100205, 'Huacar', 1002, 10, NULL),
(100206, 'San Francisco', 1002, 10, NULL),
(100207, 'San Rafael', 1002, 10, NULL),
(100208, 'Tomay Kichwa', 1002, 10, NULL),
(100301, 'La Unión', 1003, 10, NULL),
(100307, 'Chuquis', 1003, 10, NULL),
(100311, 'Marías', 1003, 10, NULL),
(100313, 'Pachas', 1003, 10, NULL),
(100316, 'Quivilla', 1003, 10, NULL),
(100317, 'Ripan', 1003, 10, NULL),
(100321, 'Shunqui', 1003, 10, NULL),
(100322, 'Sillapata', 1003, 10, NULL),
(100323, 'Yanas', 1003, 10, NULL),
(100401, 'Huacaybamba', 1004, 10, NULL),
(100402, 'Canchabamba', 1004, 10, NULL),
(100403, 'Cochabamba', 1004, 10, NULL),
(100404, 'Pinra', 1004, 10, NULL),
(100501, 'Llata', 1005, 10, NULL),
(100502, 'Arancay', 1005, 10, NULL),
(100503, 'Chavín de Pariarca', 1005, 10, NULL),
(100504, 'Jacas Grande', 1005, 10, NULL),
(100505, 'Jircan', 1005, 10, NULL),
(100506, 'Miraflores', 1005, 10, NULL),
(100507, 'Monzón', 1005, 10, NULL),
(100508, 'Punchao', 1005, 10, NULL),
(100509, 'Puños', 1005, 10, NULL),
(100510, 'Singa', 1005, 10, NULL),
(100511, 'Tantamayo', 1005, 10, NULL),
(100601, 'Rupa-Rupa', 1006, 10, NULL),
(100602, 'Daniel Alomía Robles', 1006, 10, NULL),
(100603, 'Hermílio Valdizan', 1006, 10, NULL),
(100604, 'José Crespo y Castillo', 1006, 10, NULL),
(100605, 'Luyando', 1006, 10, NULL),
(100606, 'Mariano Damaso Beraun', 1006, 10, NULL),
(100607, 'Pucayacu', 1006, 10, NULL),
(100608, 'Castillo Grande', 1006, 10, NULL),
(100609, 'Pueblo Nuevo', 1006, 10, NULL),
(100610, 'Santo Domingo de Anda', 1006, 10, NULL),
(100701, 'Huacrachuco', 1007, 10, NULL),
(100702, 'Cholon', 1007, 10, NULL),
(100703, 'San Buenaventura', 1007, 10, NULL),
(100704, 'La Morada', 1007, 10, NULL),
(100705, 'Santa Rosa de Alto Yanajanca', 1007, 10, NULL),
(100801, 'Panao', 1008, 10, NULL),
(100802, 'Chaglla', 1008, 10, NULL),
(100803, 'Molino', 1008, 10, NULL),
(100804, 'Umari', 1008, 10, NULL),
(100901, 'Puerto Inca', 1009, 10, NULL),
(100902, 'Codo del Pozuzo', 1009, 10, NULL),
(100903, 'Honoria', 1009, 10, NULL),
(100904, 'Tournavista', 1009, 10, NULL),
(100905, 'Yuyapichis', 1009, 10, NULL),
(101001, 'Jesús', 1010, 10, NULL),
(101002, 'Baños', 1010, 10, NULL),
(101003, 'Jivia', 1010, 10, NULL),
(101004, 'Queropalca', 1010, 10, NULL),
(101005, 'Rondos', 1010, 10, NULL),
(101006, 'San Francisco de Asís', 1010, 10, NULL),
(101007, 'San Miguel de Cauri', 1010, 10, NULL),
(101101, 'Chavinillo', 1011, 10, NULL),
(101102, 'Cahuac', 1011, 10, NULL),
(101103, 'Chacabamba', 1011, 10, NULL),
(101104, 'Aparicio Pomares', 1011, 10, NULL),
(101105, 'Jacas Chico', 1011, 10, NULL),
(101106, 'Obas', 1011, 10, NULL),
(101107, 'Pampamarca', 1011, 10, NULL),
(101108, 'Choras', 1011, 10, NULL),
(110101, 'Ica', 1101, 11, NULL),
(110102, 'La Tinguiña', 1101, 11, NULL),
(110103, 'Los Aquijes', 1101, 11, NULL),
(110104, 'Ocucaje', 1101, 11, NULL),
(110105, 'Pachacutec', 1101, 11, NULL),
(110106, 'Parcona', 1101, 11, NULL),
(110107, 'Pueblo Nuevo', 1101, 11, NULL),
(110108, 'Salas', 1101, 11, NULL),
(110109, 'San José de Los Molinos', 1101, 11, NULL),
(110110, 'San Juan Bautista', 1101, 11, NULL),
(110111, 'Santiago', 1101, 11, NULL),
(110112, 'Subtanjalla', 1101, 11, NULL),
(110113, 'Tate', 1101, 11, NULL),
(110114, 'Yauca del Rosario', 1101, 11, NULL),
(110201, 'Chincha Alta', 1102, 11, '[{\"lat\": -13.4123373, \"lng\": -76.1386358},\r\n      {\"lat\": -13.416254, \"lng\": -76.1397199},\r\n      {\"lat\": -13.4164283, \"lng\": -76.1394512},\r\n      {\"lat\": -13.4267389, \"lng\": -76.1336576},\r\n      {\"lat\": -13.4511152, \"lng\": -76.1360608},\r\n      {\"lat\": -13.4526595, \"lng\": -76.1076938},\r\n      {\"lat\": -13.4426005, \"lng\": -76.1062776},\r\n      {\"lat\": -13.4260293, \"lng\": -76.1014711},\r\n      {\"lat\": -13.4238169, \"lng\": -76.102544},\r\n      {\"lat\": -13.4193504, \"lng\": -76.1101829},\r\n      {\"lat\": -13.412713, \"lng\": -76.1213623},\r\n      {\"lat\": -13.4105841, \"lng\": -76.1287438},\r\n      {\"lat\": -13.4092482, \"lng\": -76.1307823},\r\n      {\"lat\": -13.4151134, \"lng\": -76.1322843},\r\n      {\"lat\": -13.4123373, \"lng\": -76.1386358}]'),
(110202, 'Alto Laran', 1102, 11, '[{\"lat\": -13.4134379, \"lng\": -76.0897037},\r\n          {\"lat\": -13.4139388, \"lng\": -76.0953685},\r\n          {\"lat\": -13.4120185, \"lng\": -76.0988876},\r\n          {\"lat\": -13.4193504, \"lng\": -76.1101829},\r\n          {\"lat\": -13.4238169, \"lng\": -76.102544},\r\n          {\"lat\": -13.4260293, \"lng\": -76.1014711},\r\n          {\"lat\": -13.4426005, \"lng\": -76.1062776},\r\n          {\"lat\": -13.4526595, \"lng\": -76.1076938},\r\n          {\"lat\": -13.4553579, \"lng\": -76.0592407},\r\n          {\"lat\": -13.4541058, \"lng\": -76.0559791},\r\n          {\"lat\": -13.4327352, \"lng\": -76.0735744},\r\n          {\"lat\": -13.4313994, \"lng\": -76.0716003},\r\n          {\"lat\": -13.4149527, \"lng\": -76.0853332},\r\n          {\"lat\": -13.4153701, \"lng\": -76.0886806},\r\n          {\"lat\": -13.4134379, \"lng\": -76.0897037}]'),
(110204, 'Chincha Baja', 1102, 11, '[{\"lat\": -13.4437245, \"lng\": -76.1802416},\r\n          {\"lat\": -13.4586668, \"lng\": -76.1789541},\r\n          {\"lat\": -13.4598354, \"lng\": -76.1714869},\r\n          {\"lat\": -13.4730238, \"lng\": -76.1745768},\r\n          {\"lat\": -13.4736915, \"lng\": -76.1819582},\r\n          {\"lat\": -13.475027, \"lng\": -76.1834173},\r\n          {\"lat\": -13.499315, \"lng\": -76.1850481},\r\n          {\"lat\": -13.5003999, \"lng\": -76.1899405},\r\n          {\"lat\": -13.5399333, \"lng\": -76.188411},\r\n          {\"lat\": -13.5529504, \"lng\": -76.1810295},\r\n          {\"lat\": -13.5496127, \"lng\": -76.133136},\r\n          {\"lat\": -13.5386816, \"lng\": -76.1327069},\r\n          {\"lat\": -13.5165675, \"lng\": -76.1421482},\r\n          {\"lat\": -13.4643199, \"lng\": -76.1363976},\r\n          {\"lat\": -13.4509482, \"lng\": -76.1360608},\r\n          {\"lat\": -13.4437245, \"lng\": -76.1802416}]'),
(110205, 'El Carmen', 1102, 11, '[{\"lat\": -13.5496127, \"lng\": -76.133136},\r\n          {\"lat\": -13.5512467, \"lng\": -76.1157635},\r\n          {\"lat\": -13.5545843, \"lng\": -76.0251263},\r\n          {\"lat\": -13.5525817, \"lng\": -75.9985188},\r\n          {\"lat\": -13.455103, \"lng\": -75.9997204},\r\n          {\"lat\": -13.4519309, \"lng\": -76.0034969},\r\n          {\"lat\": -13.4470893, \"lng\": -76.024268},\r\n          {\"lat\": -13.4541058, \"lng\": -76.0559791},\r\n          {\"lat\": -13.4553579, \"lng\": -76.0592407},\r\n          {\"lat\": -13.4509482, \"lng\": -76.1360608},\r\n          {\"lat\": -13.5165675, \"lng\": -76.1421482},\r\n          {\"lat\": -13.5386816, \"lng\": -76.1327069},\r\n          {\"lat\": -13.5496127, \"lng\": -76.133136}]'),
(110206, 'Grocio Prado', 1102, 11, '[{\"lat\": -13.4144525, \"lng\": -76.1867276},\r\n          {\"lat\": -13.4094431, \"lng\": -76.168274},\r\n          {\"lat\": -13.4133738, \"lng\": -76.1517731},\r\n          {\"lat\": -13.416254, \"lng\": -76.1397199},\r\n          {\"lat\": -13.4123373, \"lng\": -76.1386358},\r\n          {\"lat\": -13.4151134, \"lng\": -76.1322843},\r\n          {\"lat\": -13.4092482, \"lng\": -76.1307823},\r\n          {\"lat\": -13.4019508, \"lng\": -76.1412833},\r\n          {\"lat\": -13.3980683, \"lng\": -76.1457894},\r\n          {\"lat\": -13.3946033, \"lng\": -76.1491153},\r\n          {\"lat\": -13.391994, \"lng\": -76.1511538},\r\n          {\"lat\": -13.3901362, \"lng\": -76.1490724},\r\n          {\"lat\": -13.3861492, \"lng\": -76.1450598},\r\n          {\"lat\": -13.3854185, \"lng\": -76.1451671},\r\n          {\"lat\": -13.3851466, \"lng\": -76.1445158},\r\n          {\"lat\": -13.3766295, \"lng\": -76.1306971},\r\n          {\"lat\": -13.3583419, \"lng\": -76.1399668},\r\n          {\"lat\": -13.3669431, \"lng\": -76.1711234},\r\n          {\"lat\": -13.4144525, \"lng\": -76.1867276}]'),
(110207, 'Pueblo Nuevo', 1102, 11, '[{\"lat\": -13.391994, \"lng\": -76.1511538},\r\n          {\"lat\": -13.3946033, \"lng\": -76.1491153},\r\n          {\"lat\": -13.3980683, \"lng\": -76.1457894},\r\n          {\"lat\": -13.4019508, \"lng\": -76.1412833},\r\n          {\"lat\": -13.4092482, \"lng\": -76.1307823},\r\n          {\"lat\": -13.4105841, \"lng\": -76.1287438},\r\n          {\"lat\": -13.412713, \"lng\": -76.1213623},\r\n          {\"lat\": -13.4193504, \"lng\": -76.1101829},\r\n          {\"lat\": -13.4120185, \"lng\": -76.0988876},\r\n          {\"lat\": -13.4139388, \"lng\": -76.0953685},\r\n          {\"lat\": -13.4134379, \"lng\": -76.0897037},\r\n          {\"lat\": -13.3851743, \"lng\": -76.09434},\r\n          {\"lat\": -13.3659277, \"lng\": -76.1175129},\r\n          {\"lat\": -13.3746122, \"lng\": -76.1312458},\r\n          {\"lat\": -13.3766295, \"lng\": -76.1306971},\r\n          {\"lat\": -13.3854185, \"lng\": -76.1451671},\r\n          {\"lat\": -13.3861492, \"lng\": -76.1450598},\r\n          {\"lat\": -13.391994, \"lng\": -76.1511538}]'),
(110210, 'Sunampe', 1102, 11, '[{\"lat\": -13.416087, \"lng\": -76.1397199},\r\n          {\"lat\": -13.4093596, \"lng\": -76.1681023},\r\n          {\"lat\": -13.414369, \"lng\": -76.1865559},\r\n          {\"lat\": -13.4186685, \"lng\": -76.1948385},\r\n          {\"lat\": -13.4331533, \"lng\": -76.1909333},\r\n          {\"lat\": -13.4431709, \"lng\": -76.1896029},\r\n          {\"lat\": -13.443004, \"lng\": -76.1844102},\r\n          {\"lat\": -13.4509482, \"lng\": -76.1360608},\r\n          {\"lat\": -13.4265719, \"lng\": -76.1336576},\r\n          {\"lat\": -13.416087, \"lng\": -76.1397199}]'),
(110211, 'Tambo de Mora', 1102, 11, '[{\"lat\": -13.4431709, \"lng\": -76.1896029},\r\n          {\"lat\": -13.4615883, \"lng\": -76.1874514},\r\n          {\"lat\": -13.4646768, \"lng\": -76.1900263},\r\n          {\"lat\": -13.4712709, \"lng\": -76.1910563},\r\n          {\"lat\": -13.5003999, \"lng\": -76.1899405},\r\n          {\"lat\": -13.499315, \"lng\": -76.1850481},\r\n          {\"lat\": -13.475027, \"lng\": -76.1834173},\r\n          {\"lat\": -13.4736915, \"lng\": -76.1819582},\r\n          {\"lat\": -13.4730238, \"lng\": -76.1745768},\r\n          {\"lat\": -13.4598354, \"lng\": -76.1714869},\r\n          {\"lat\": -13.4586668, \"lng\": -76.1789541},\r\n          {\"lat\": -13.4437245, \"lng\": -76.1802416},\r\n          {\"lat\": -13.4428063, \"lng\": -76.1849623},\r\n          {\"lat\": -13.4431709, \"lng\": -76.1896029}]'),
(110301, 'Nasca', 1103, 11, NULL),
(110302, 'Changuillo', 1103, 11, NULL),
(110303, 'El Ingenio', 1103, 11, NULL),
(110304, 'Marcona', 1103, 11, NULL),
(110305, 'Vista Alegre', 1103, 11, NULL),
(110401, 'Palpa', 1104, 11, NULL),
(110402, 'Llipata', 1104, 11, NULL),
(110403, 'Río Grande', 1104, 11, NULL),
(110404, 'Santa Cruz', 1104, 11, NULL),
(110405, 'Tibillo', 1104, 11, NULL),
(110501, 'Pisco', 1105, 11, NULL),
(110502, 'Huancano', 1105, 11, NULL),
(110503, 'Humay', 1105, 11, NULL),
(110504, 'Independencia', 1105, 11, NULL),
(110505, 'Paracas', 1105, 11, NULL),
(110506, 'San Andrés', 1105, 11, NULL),
(110507, 'San Clemente', 1105, 11, NULL),
(110508, 'Tupac Amaru Inca', 1105, 11, NULL),
(120101, 'Huancayo', 1201, 12, NULL),
(120104, 'Carhuacallanga', 1201, 12, NULL),
(120105, 'Chacapampa', 1201, 12, NULL),
(120106, 'Chicche', 1201, 12, NULL),
(120107, 'Chilca', 1201, 12, NULL),
(120108, 'Chongos Alto', 1201, 12, NULL),
(120111, 'Chupuro', 1201, 12, NULL),
(120112, 'Colca', 1201, 12, NULL),
(120113, 'Cullhuas', 1201, 12, NULL),
(120114, 'El Tambo', 1201, 12, NULL),
(120116, 'Huacrapuquio', 1201, 12, NULL),
(120117, 'Hualhuas', 1201, 12, NULL),
(120119, 'Huancan', 1201, 12, NULL),
(120120, 'Huasicancha', 1201, 12, NULL),
(120121, 'Huayucachi', 1201, 12, NULL),
(120122, 'Ingenio', 1201, 12, NULL),
(120124, 'Pariahuanca', 1201, 12, NULL),
(120125, 'Pilcomayo', 1201, 12, NULL),
(120126, 'Pucara', 1201, 12, NULL),
(120127, 'Quichuay', 1201, 12, NULL),
(120128, 'Quilcas', 1201, 12, NULL),
(120129, 'San Agustín', 1201, 12, NULL),
(120130, 'San Jerónimo de Tunan', 1201, 12, NULL),
(120132, 'Saño', 1201, 12, NULL),
(120133, 'Sapallanga', 1201, 12, NULL),
(120134, 'Sicaya', 1201, 12, NULL),
(120135, 'Santo Domingo de Acobamba', 1201, 12, NULL),
(120136, 'Viques', 1201, 12, NULL),
(120201, 'Concepción', 1202, 12, NULL),
(120202, 'Aco', 1202, 12, NULL),
(120203, 'Andamarca', 1202, 12, NULL),
(120204, 'Chambara', 1202, 12, NULL),
(120205, 'Cochas', 1202, 12, NULL),
(120206, 'Comas', 1202, 12, NULL),
(120207, 'Heroínas Toledo', 1202, 12, NULL),
(120208, 'Manzanares', 1202, 12, NULL),
(120209, 'Mariscal Castilla', 1202, 12, NULL),
(120210, 'Matahuasi', 1202, 12, NULL),
(120211, 'Mito', 1202, 12, NULL),
(120212, 'Nueve de Julio', 1202, 12, NULL),
(120213, 'Orcotuna', 1202, 12, NULL),
(120214, 'San José de Quero', 1202, 12, NULL),
(120215, 'Santa Rosa de Ocopa', 1202, 12, NULL),
(120301, 'Chanchamayo', 1203, 12, NULL),
(120302, 'Perene', 1203, 12, NULL),
(120303, 'Pichanaqui', 1203, 12, NULL),
(120304, 'San Luis de Shuaro', 1203, 12, NULL),
(120305, 'San Ramón', 1203, 12, NULL),
(120306, 'Vitoc', 1203, 12, NULL),
(120401, 'Jauja', 1204, 12, NULL),
(120402, 'Acolla', 1204, 12, NULL),
(120403, 'Apata', 1204, 12, NULL),
(120404, 'Ataura', 1204, 12, NULL),
(120405, 'Canchayllo', 1204, 12, NULL),
(120406, 'Curicaca', 1204, 12, NULL),
(120407, 'El Mantaro', 1204, 12, NULL),
(120408, 'Huamali', 1204, 12, NULL),
(120409, 'Huaripampa', 1204, 12, NULL),
(120410, 'Huertas', 1204, 12, NULL),
(120411, 'Janjaillo', 1204, 12, NULL),
(120412, 'Julcán', 1204, 12, NULL),
(120413, 'Leonor Ordóñez', 1204, 12, NULL),
(120414, 'Llocllapampa', 1204, 12, NULL),
(120415, 'Marco', 1204, 12, NULL),
(120416, 'Masma', 1204, 12, NULL),
(120417, 'Masma Chicche', 1204, 12, NULL),
(120418, 'Molinos', 1204, 12, NULL),
(120419, 'Monobamba', 1204, 12, NULL),
(120420, 'Muqui', 1204, 12, NULL),
(120421, 'Muquiyauyo', 1204, 12, NULL),
(120422, 'Paca', 1204, 12, NULL),
(120423, 'Paccha', 1204, 12, NULL),
(120424, 'Pancan', 1204, 12, NULL),
(120425, 'Parco', 1204, 12, NULL),
(120426, 'Pomacancha', 1204, 12, NULL),
(120427, 'Ricran', 1204, 12, NULL),
(120428, 'San Lorenzo', 1204, 12, NULL),
(120429, 'San Pedro de Chunan', 1204, 12, NULL),
(120430, 'Sausa', 1204, 12, NULL),
(120431, 'Sincos', 1204, 12, NULL),
(120432, 'Tunan Marca', 1204, 12, NULL),
(120433, 'Yauli', 1204, 12, NULL),
(120434, 'Yauyos', 1204, 12, NULL),
(120501, 'Junin', 1205, 12, NULL),
(120502, 'Carhuamayo', 1205, 12, NULL),
(120503, 'Ondores', 1205, 12, NULL),
(120504, 'Ulcumayo', 1205, 12, NULL),
(120601, 'Satipo', 1206, 12, NULL),
(120602, 'Coviriali', 1206, 12, NULL),
(120603, 'Llaylla', 1206, 12, NULL),
(120604, 'Mazamari', 1206, 12, NULL),
(120605, 'Pampa Hermosa', 1206, 12, NULL),
(120606, 'Pangoa', 1206, 12, NULL),
(120607, 'Río Negro', 1206, 12, NULL),
(120608, 'Río Tambo', 1206, 12, NULL),
(120609, 'Vizcatan del Ene', 1206, 12, NULL),
(120701, 'Tarma', 1207, 12, NULL),
(120702, 'Acobamba', 1207, 12, NULL),
(120703, 'Huaricolca', 1207, 12, NULL),
(120704, 'Huasahuasi', 1207, 12, NULL),
(120705, 'La Unión', 1207, 12, NULL),
(120706, 'Palca', 1207, 12, NULL),
(120707, 'Palcamayo', 1207, 12, NULL),
(120708, 'San Pedro de Cajas', 1207, 12, NULL),
(120709, 'Tapo', 1207, 12, NULL),
(120801, 'La Oroya', 1208, 12, NULL),
(120802, 'Chacapalpa', 1208, 12, NULL),
(120803, 'Huay-Huay', 1208, 12, NULL),
(120804, 'Marcapomacocha', 1208, 12, NULL),
(120805, 'Morococha', 1208, 12, NULL),
(120806, 'Paccha', 1208, 12, NULL),
(120807, 'Santa Bárbara de Carhuacayan', 1208, 12, NULL),
(120808, 'Santa Rosa de Sacco', 1208, 12, NULL),
(120809, 'Suitucancha', 1208, 12, NULL),
(120810, 'Yauli', 1208, 12, NULL),
(120901, 'Chupaca', 1209, 12, NULL),
(120902, 'Ahuac', 1209, 12, NULL),
(120903, 'Chongos Bajo', 1209, 12, NULL),
(120904, 'Huachac', 1209, 12, NULL),
(120905, 'Huamancaca Chico', 1209, 12, NULL),
(120906, 'San Juan de Iscos', 1209, 12, NULL),
(120907, 'San Juan de Jarpa', 1209, 12, NULL),
(120908, 'Tres de Diciembre', 1209, 12, NULL),
(120909, 'Yanacancha', 1209, 12, NULL),
(130101, 'Trujillo', 1301, 13, NULL),
(130102, 'El Porvenir', 1301, 13, NULL),
(130103, 'Florencia de Mora', 1301, 13, NULL),
(130104, 'Huanchaco', 1301, 13, NULL),
(130105, 'La Esperanza', 1301, 13, NULL),
(130106, 'Laredo', 1301, 13, NULL),
(130107, 'Moche', 1301, 13, NULL),
(130108, 'Poroto', 1301, 13, NULL),
(130109, 'Salaverry', 1301, 13, NULL),
(130110, 'Simbal', 1301, 13, NULL),
(130111, 'Victor Larco Herrera', 1301, 13, NULL),
(130201, 'Ascope', 1302, 13, NULL),
(130202, 'Chicama', 1302, 13, NULL),
(130203, 'Chocope', 1302, 13, NULL),
(130204, 'Magdalena de Cao', 1302, 13, NULL),
(130205, 'Paijan', 1302, 13, NULL),
(130206, 'Rázuri', 1302, 13, NULL),
(130207, 'Santiago de Cao', 1302, 13, NULL),
(130208, 'Casa Grande', 1302, 13, NULL),
(130301, 'Bolívar', 1303, 13, NULL),
(130302, 'Bambamarca', 1303, 13, NULL),
(130303, 'Condormarca', 1303, 13, NULL),
(130304, 'Longotea', 1303, 13, NULL),
(130305, 'Uchumarca', 1303, 13, NULL),
(130306, 'Ucuncha', 1303, 13, NULL),
(130401, 'Chepen', 1304, 13, NULL),
(130402, 'Pacanga', 1304, 13, NULL),
(130403, 'Pueblo Nuevo', 1304, 13, NULL),
(130501, 'Julcan', 1305, 13, NULL),
(130502, 'Calamarca', 1305, 13, NULL),
(130503, 'Carabamba', 1305, 13, NULL),
(130504, 'Huaso', 1305, 13, NULL),
(130601, 'Otuzco', 1306, 13, NULL),
(130602, 'Agallpampa', 1306, 13, NULL),
(130604, 'Charat', 1306, 13, NULL),
(130605, 'Huaranchal', 1306, 13, NULL),
(130606, 'La Cuesta', 1306, 13, NULL),
(130608, 'Mache', 1306, 13, NULL),
(130610, 'Paranday', 1306, 13, NULL),
(130611, 'Salpo', 1306, 13, NULL),
(130613, 'Sinsicap', 1306, 13, NULL),
(130614, 'Usquil', 1306, 13, NULL),
(130701, 'San Pedro de Lloc', 1307, 13, NULL),
(130702, 'Guadalupe', 1307, 13, NULL),
(130703, 'Jequetepeque', 1307, 13, NULL),
(130704, 'Pacasmayo', 1307, 13, NULL),
(130705, 'San José', 1307, 13, NULL),
(130801, 'Tayabamba', 1308, 13, NULL),
(130802, 'Buldibuyo', 1308, 13, NULL),
(130803, 'Chillia', 1308, 13, NULL),
(130804, 'Huancaspata', 1308, 13, NULL),
(130805, 'Huaylillas', 1308, 13, NULL),
(130806, 'Huayo', 1308, 13, NULL),
(130807, 'Ongon', 1308, 13, NULL),
(130808, 'Parcoy', 1308, 13, NULL),
(130809, 'Pataz', 1308, 13, NULL),
(130810, 'Pias', 1308, 13, NULL),
(130811, 'Santiago de Challas', 1308, 13, NULL),
(130812, 'Taurija', 1308, 13, NULL),
(130813, 'Urpay', 1308, 13, NULL),
(130901, 'Huamachuco', 1309, 13, NULL),
(130902, 'Chugay', 1309, 13, NULL),
(130903, 'Cochorco', 1309, 13, NULL),
(130904, 'Curgos', 1309, 13, NULL),
(130905, 'Marcabal', 1309, 13, NULL),
(130906, 'Sanagoran', 1309, 13, NULL),
(130907, 'Sarin', 1309, 13, NULL),
(130908, 'Sartimbamba', 1309, 13, NULL),
(131001, 'Santiago de Chuco', 1310, 13, NULL),
(131002, 'Angasmarca', 1310, 13, NULL),
(131003, 'Cachicadan', 1310, 13, NULL),
(131004, 'Mollebamba', 1310, 13, NULL);
INSERT INTO `tb_distritos` (`id_distrito`, `distrito`, `id_provincia`, `id_departamento`, `limites`) VALUES
(131005, 'Mollepata', 1310, 13, NULL),
(131006, 'Quiruvilca', 1310, 13, NULL),
(131007, 'Santa Cruz de Chuca', 1310, 13, NULL),
(131008, 'Sitabamba', 1310, 13, NULL),
(131101, 'Cascas', 1311, 13, NULL),
(131102, 'Lucma', 1311, 13, NULL),
(131103, 'Marmot', 1311, 13, NULL),
(131104, 'Sayapullo', 1311, 13, NULL),
(131201, 'Viru', 1312, 13, NULL),
(131202, 'Chao', 1312, 13, NULL),
(131203, 'Guadalupito', 1312, 13, NULL),
(140101, 'Chiclayo', 1401, 14, NULL),
(140102, 'Chongoyape', 1401, 14, NULL),
(140103, 'Eten', 1401, 14, NULL),
(140104, 'Eten Puerto', 1401, 14, NULL),
(140105, 'José Leonardo Ortiz', 1401, 14, NULL),
(140106, 'La Victoria', 1401, 14, NULL),
(140107, 'Lagunas', 1401, 14, NULL),
(140108, 'Monsefu', 1401, 14, NULL),
(140109, 'Nueva Arica', 1401, 14, NULL),
(140110, 'Oyotun', 1401, 14, NULL),
(140111, 'Picsi', 1401, 14, NULL),
(140112, 'Pimentel', 1401, 14, NULL),
(140113, 'Reque', 1401, 14, NULL),
(140114, 'Santa Rosa', 1401, 14, NULL),
(140115, 'Saña', 1401, 14, NULL),
(140116, 'Cayalti', 1401, 14, NULL),
(140117, 'Patapo', 1401, 14, NULL),
(140118, 'Pomalca', 1401, 14, NULL),
(140119, 'Pucala', 1401, 14, NULL),
(140120, 'Tuman', 1401, 14, NULL),
(140201, 'Ferreñafe', 1402, 14, NULL),
(140202, 'Cañaris', 1402, 14, NULL),
(140203, 'Incahuasi', 1402, 14, NULL),
(140204, 'Manuel Antonio Mesones Muro', 1402, 14, NULL),
(140205, 'Pitipo', 1402, 14, NULL),
(140206, 'Pueblo Nuevo', 1402, 14, NULL),
(140301, 'Lambayeque', 1403, 14, NULL),
(140302, 'Chochope', 1403, 14, NULL),
(140303, 'Illimo', 1403, 14, NULL),
(140304, 'Jayanca', 1403, 14, NULL),
(140305, 'Mochumi', 1403, 14, NULL),
(140306, 'Morrope', 1403, 14, NULL),
(140307, 'Motupe', 1403, 14, NULL),
(140308, 'Olmos', 1403, 14, NULL),
(140309, 'Pacora', 1403, 14, NULL),
(140310, 'Salas', 1403, 14, NULL),
(140311, 'San José', 1403, 14, NULL),
(140312, 'Tucume', 1403, 14, NULL),
(150101, 'Lima', 1501, 15, NULL),
(150102, 'Ancón', 1501, 15, NULL),
(150103, 'Ate', 1501, 15, NULL),
(150104, 'Barranco', 1501, 15, NULL),
(150105, 'Breña', 1501, 15, NULL),
(150106, 'Carabayllo', 1501, 15, NULL),
(150107, 'Chaclacayo', 1501, 15, NULL),
(150108, 'Chorrillos', 1501, 15, NULL),
(150109, 'Cieneguilla', 1501, 15, NULL),
(150110, 'Comas', 1501, 15, NULL),
(150111, 'El Agustino', 1501, 15, NULL),
(150112, 'Independencia', 1501, 15, NULL),
(150113, 'Jesús María', 1501, 15, NULL),
(150114, 'La Molina', 1501, 15, NULL),
(150115, 'La Victoria', 1501, 15, NULL),
(150116, 'Lince', 1501, 15, NULL),
(150117, 'Los Olivos', 1501, 15, NULL),
(150118, 'Lurigancho', 1501, 15, NULL),
(150119, 'Lurin', 1501, 15, NULL),
(150120, 'Magdalena del Mar', 1501, 15, NULL),
(150121, 'Pueblo Libre', 1501, 15, NULL),
(150122, 'Miraflores', 1501, 15, NULL),
(150123, 'Pachacamac', 1501, 15, NULL),
(150124, 'Pucusana', 1501, 15, NULL),
(150125, 'Puente Piedra', 1501, 15, NULL),
(150126, 'Punta Hermosa', 1501, 15, NULL),
(150127, 'Punta Negra', 1501, 15, NULL),
(150128, 'Rímac', 1501, 15, NULL),
(150129, 'San Bartolo', 1501, 15, NULL),
(150130, 'San Borja', 1501, 15, NULL),
(150131, 'San Isidro', 1501, 15, NULL),
(150132, 'San Juan de Lurigancho', 1501, 15, NULL),
(150133, 'San Juan de Miraflores', 1501, 15, NULL),
(150134, 'San Luis', 1501, 15, NULL),
(150135, 'San Martín de Porres', 1501, 15, NULL),
(150136, 'San Miguel', 1501, 15, NULL),
(150137, 'Santa Anita', 1501, 15, NULL),
(150138, 'Santa María del Mar', 1501, 15, NULL),
(150139, 'Santa Rosa', 1501, 15, NULL),
(150140, 'Santiago de Surco', 1501, 15, NULL),
(150141, 'Surquillo', 1501, 15, NULL),
(150142, 'Villa El Salvador', 1501, 15, NULL),
(150143, 'Villa María del Triunfo', 1501, 15, NULL),
(150201, 'Barranca', 1502, 15, NULL),
(150202, 'Paramonga', 1502, 15, NULL),
(150203, 'Pativilca', 1502, 15, NULL),
(150204, 'Supe', 1502, 15, NULL),
(150205, 'Supe Puerto', 1502, 15, NULL),
(150301, 'Cajatambo', 1503, 15, NULL),
(150302, 'Copa', 1503, 15, NULL),
(150303, 'Gorgor', 1503, 15, NULL),
(150304, 'Huancapon', 1503, 15, NULL),
(150305, 'Manas', 1503, 15, NULL),
(150401, 'Canta', 1504, 15, NULL),
(150402, 'Arahuay', 1504, 15, NULL),
(150403, 'Huamantanga', 1504, 15, NULL),
(150404, 'Huaros', 1504, 15, NULL),
(150405, 'Lachaqui', 1504, 15, NULL),
(150406, 'San Buenaventura', 1504, 15, NULL),
(150407, 'Santa Rosa de Quives', 1504, 15, NULL),
(150501, 'San Vicente de Cañete', 1505, 15, NULL),
(150502, 'Asia', 1505, 15, NULL),
(150503, 'Calango', 1505, 15, NULL),
(150504, 'Cerro Azul', 1505, 15, NULL),
(150505, 'Chilca', 1505, 15, NULL),
(150506, 'Coayllo', 1505, 15, NULL),
(150507, 'Imperial', 1505, 15, NULL),
(150508, 'Lunahuana', 1505, 15, NULL),
(150509, 'Mala', 1505, 15, NULL),
(150510, 'Nuevo Imperial', 1505, 15, NULL),
(150511, 'Pacaran', 1505, 15, NULL),
(150512, 'Quilmana', 1505, 15, NULL),
(150513, 'San Antonio', 1505, 15, NULL),
(150514, 'San Luis', 1505, 15, NULL),
(150515, 'Santa Cruz de Flores', 1505, 15, NULL),
(150516, 'Zúñiga', 1505, 15, NULL),
(150601, 'Huaral', 1506, 15, NULL),
(150602, 'Atavillos Alto', 1506, 15, NULL),
(150603, 'Atavillos Bajo', 1506, 15, NULL),
(150604, 'Aucallama', 1506, 15, NULL),
(150605, 'Chancay', 1506, 15, NULL),
(150606, 'Ihuari', 1506, 15, NULL),
(150607, 'Lampian', 1506, 15, NULL),
(150608, 'Pacaraos', 1506, 15, NULL),
(150609, 'San Miguel de Acos', 1506, 15, NULL),
(150610, 'Santa Cruz de Andamarca', 1506, 15, NULL),
(150611, 'Sumbilca', 1506, 15, NULL),
(150612, 'Veintisiete de Noviembre', 1506, 15, NULL),
(150701, 'Matucana', 1507, 15, NULL),
(150702, 'Antioquia', 1507, 15, NULL),
(150703, 'Callahuanca', 1507, 15, NULL),
(150704, 'Carampoma', 1507, 15, NULL),
(150705, 'Chicla', 1507, 15, NULL),
(150706, 'Cuenca', 1507, 15, NULL),
(150707, 'Huachupampa', 1507, 15, NULL),
(150708, 'Huanza', 1507, 15, NULL),
(150709, 'Huarochiri', 1507, 15, NULL),
(150710, 'Lahuaytambo', 1507, 15, NULL),
(150711, 'Langa', 1507, 15, NULL),
(150712, 'Laraos', 1507, 15, NULL),
(150713, 'Mariatana', 1507, 15, NULL),
(150714, 'Ricardo Palma', 1507, 15, NULL),
(150715, 'San Andrés de Tupicocha', 1507, 15, NULL),
(150716, 'San Antonio', 1507, 15, NULL),
(150717, 'San Bartolomé', 1507, 15, NULL),
(150718, 'San Damian', 1507, 15, NULL),
(150719, 'San Juan de Iris', 1507, 15, NULL),
(150720, 'San Juan de Tantaranche', 1507, 15, NULL),
(150721, 'San Lorenzo de Quinti', 1507, 15, NULL),
(150722, 'San Mateo', 1507, 15, NULL),
(150723, 'San Mateo de Otao', 1507, 15, NULL),
(150724, 'San Pedro de Casta', 1507, 15, NULL),
(150725, 'San Pedro de Huancayre', 1507, 15, NULL),
(150726, 'Sangallaya', 1507, 15, NULL),
(150727, 'Santa Cruz de Cocachacra', 1507, 15, NULL),
(150728, 'Santa Eulalia', 1507, 15, NULL),
(150729, 'Santiago de Anchucaya', 1507, 15, NULL),
(150730, 'Santiago de Tuna', 1507, 15, NULL),
(150731, 'Santo Domingo de Los Olleros', 1507, 15, NULL),
(150732, 'Surco', 1507, 15, NULL),
(150801, 'Huacho', 1508, 15, NULL),
(150802, 'Ambar', 1508, 15, NULL),
(150803, 'Caleta de Carquin', 1508, 15, NULL),
(150804, 'Checras', 1508, 15, NULL),
(150805, 'Hualmay', 1508, 15, NULL),
(150806, 'Huaura', 1508, 15, NULL),
(150807, 'Leoncio Prado', 1508, 15, NULL),
(150808, 'Paccho', 1508, 15, NULL),
(150809, 'Santa Leonor', 1508, 15, NULL),
(150810, 'Santa María', 1508, 15, NULL),
(150811, 'Sayan', 1508, 15, NULL),
(150812, 'Vegueta', 1508, 15, NULL),
(150901, 'Oyon', 1509, 15, NULL),
(150902, 'Andajes', 1509, 15, NULL),
(150903, 'Caujul', 1509, 15, NULL),
(150904, 'Cochamarca', 1509, 15, NULL),
(150905, 'Navan', 1509, 15, NULL),
(150906, 'Pachangara', 1509, 15, NULL),
(151001, 'Yauyos', 1510, 15, NULL),
(151002, 'Alis', 1510, 15, NULL),
(151003, 'Allauca', 1510, 15, NULL),
(151004, 'Ayaviri', 1510, 15, NULL),
(151005, 'Azángaro', 1510, 15, NULL),
(151006, 'Cacra', 1510, 15, NULL),
(151007, 'Carania', 1510, 15, NULL),
(151008, 'Catahuasi', 1510, 15, NULL),
(151009, 'Chocos', 1510, 15, NULL),
(151010, 'Cochas', 1510, 15, NULL),
(151011, 'Colonia', 1510, 15, NULL),
(151012, 'Hongos', 1510, 15, NULL),
(151013, 'Huampara', 1510, 15, NULL),
(151014, 'Huancaya', 1510, 15, NULL),
(151015, 'Huangascar', 1510, 15, NULL),
(151016, 'Huantan', 1510, 15, NULL),
(151017, 'Huañec', 1510, 15, NULL),
(151018, 'Laraos', 1510, 15, NULL),
(151019, 'Lincha', 1510, 15, NULL),
(151020, 'Madean', 1510, 15, NULL),
(151021, 'Miraflores', 1510, 15, NULL),
(151022, 'Omas', 1510, 15, NULL),
(151023, 'Putinza', 1510, 15, NULL),
(151024, 'Quinches', 1510, 15, NULL),
(151025, 'Quinocay', 1510, 15, NULL),
(151026, 'San Joaquín', 1510, 15, NULL),
(151027, 'San Pedro de Pilas', 1510, 15, NULL),
(151028, 'Tanta', 1510, 15, NULL),
(151029, 'Tauripampa', 1510, 15, NULL),
(151030, 'Tomas', 1510, 15, NULL),
(151031, 'Tupe', 1510, 15, NULL),
(151032, 'Viñac', 1510, 15, NULL),
(151033, 'Vitis', 1510, 15, NULL),
(160101, 'Iquitos', 1601, 16, NULL),
(160102, 'Alto Nanay', 1601, 16, NULL),
(160103, 'Fernando Lores', 1601, 16, NULL),
(160104, 'Indiana', 1601, 16, NULL),
(160105, 'Las Amazonas', 1601, 16, NULL),
(160106, 'Mazan', 1601, 16, NULL),
(160107, 'Napo', 1601, 16, NULL),
(160108, 'Punchana', 1601, 16, NULL),
(160110, 'Torres Causana', 1601, 16, NULL),
(160112, 'Belén', 1601, 16, NULL),
(160113, 'San Juan Bautista', 1601, 16, NULL),
(160201, 'Yurimaguas', 1602, 16, NULL),
(160202, 'Balsapuerto', 1602, 16, NULL),
(160205, 'Jeberos', 1602, 16, NULL),
(160206, 'Lagunas', 1602, 16, NULL),
(160210, 'Santa Cruz', 1602, 16, NULL),
(160211, 'Teniente Cesar López Rojas', 1602, 16, NULL),
(160301, 'Nauta', 1603, 16, NULL),
(160302, 'Parinari', 1603, 16, NULL),
(160303, 'Tigre', 1603, 16, NULL),
(160304, 'Trompeteros', 1603, 16, NULL),
(160305, 'Urarinas', 1603, 16, NULL),
(160401, 'Ramón Castilla', 1604, 16, NULL),
(160402, 'Pebas', 1604, 16, NULL),
(160403, 'Yavari', 1604, 16, NULL),
(160404, 'San Pablo', 1604, 16, NULL),
(160501, 'Requena', 1605, 16, NULL),
(160502, 'Alto Tapiche', 1605, 16, NULL),
(160503, 'Capelo', 1605, 16, NULL),
(160504, 'Emilio San Martín', 1605, 16, NULL),
(160505, 'Maquia', 1605, 16, NULL),
(160506, 'Puinahua', 1605, 16, NULL),
(160507, 'Saquena', 1605, 16, NULL),
(160508, 'Soplin', 1605, 16, NULL),
(160509, 'Tapiche', 1605, 16, NULL),
(160510, 'Jenaro Herrera', 1605, 16, NULL),
(160511, 'Yaquerana', 1605, 16, NULL),
(160601, 'Contamana', 1606, 16, NULL),
(160602, 'Inahuaya', 1606, 16, NULL),
(160603, 'Padre Márquez', 1606, 16, NULL),
(160604, 'Pampa Hermosa', 1606, 16, NULL),
(160605, 'Sarayacu', 1606, 16, NULL),
(160606, 'Vargas Guerra', 1606, 16, NULL),
(160701, 'Barranca', 1607, 16, NULL),
(160702, 'Cahuapanas', 1607, 16, NULL),
(160703, 'Manseriche', 1607, 16, NULL),
(160704, 'Morona', 1607, 16, NULL),
(160705, 'Pastaza', 1607, 16, NULL),
(160706, 'Andoas', 1607, 16, NULL),
(160801, 'Putumayo', 1608, 16, NULL),
(160802, 'Rosa Panduro', 1608, 16, NULL),
(160803, 'Teniente Manuel Clavero', 1608, 16, NULL),
(160804, 'Yaguas', 1608, 16, NULL),
(170101, 'Tambopata', 1701, 17, NULL),
(170102, 'Inambari', 1701, 17, NULL),
(170103, 'Las Piedras', 1701, 17, NULL),
(170104, 'Laberinto', 1701, 17, NULL),
(170201, 'Manu', 1702, 17, NULL),
(170202, 'Fitzcarrald', 1702, 17, NULL),
(170203, 'Madre de Dios', 1702, 17, NULL),
(170204, 'Huepetuhe', 1702, 17, NULL),
(170301, 'Iñapari', 1703, 17, NULL),
(170302, 'Iberia', 1703, 17, NULL),
(170303, 'Tahuamanu', 1703, 17, NULL),
(180101, 'Moquegua', 1801, 18, NULL),
(180102, 'Carumas', 1801, 18, NULL),
(180103, 'Cuchumbaya', 1801, 18, NULL),
(180104, 'Samegua', 1801, 18, NULL),
(180105, 'San Cristóbal', 1801, 18, NULL),
(180106, 'Torata', 1801, 18, NULL),
(180201, 'Omate', 1802, 18, NULL),
(180202, 'Chojata', 1802, 18, NULL),
(180203, 'Coalaque', 1802, 18, NULL),
(180204, 'Ichuña', 1802, 18, NULL),
(180205, 'La Capilla', 1802, 18, NULL),
(180206, 'Lloque', 1802, 18, NULL),
(180207, 'Matalaque', 1802, 18, NULL),
(180208, 'Puquina', 1802, 18, NULL),
(180209, 'Quinistaquillas', 1802, 18, NULL),
(180210, 'Ubinas', 1802, 18, NULL),
(180211, 'Yunga', 1802, 18, NULL),
(180301, 'Ilo', 1803, 18, NULL),
(180302, 'El Algarrobal', 1803, 18, NULL),
(180303, 'Pacocha', 1803, 18, NULL),
(190101, 'Chaupimarca', 1901, 19, NULL),
(190102, 'Huachon', 1901, 19, NULL),
(190103, 'Huariaca', 1901, 19, NULL),
(190104, 'Huayllay', 1901, 19, NULL),
(190105, 'Ninacaca', 1901, 19, NULL),
(190106, 'Pallanchacra', 1901, 19, NULL),
(190107, 'Paucartambo', 1901, 19, NULL),
(190108, 'San Francisco de Asís de Yarusyacan', 1901, 19, NULL),
(190109, 'Simon Bolívar', 1901, 19, NULL),
(190110, 'Ticlacayan', 1901, 19, NULL),
(190111, 'Tinyahuarco', 1901, 19, NULL),
(190112, 'Vicco', 1901, 19, NULL),
(190113, 'Yanacancha', 1901, 19, NULL),
(190201, 'Yanahuanca', 1902, 19, NULL),
(190202, 'Chacayan', 1902, 19, NULL),
(190203, 'Goyllarisquizga', 1902, 19, NULL),
(190204, 'Paucar', 1902, 19, NULL),
(190205, 'San Pedro de Pillao', 1902, 19, NULL),
(190206, 'Santa Ana de Tusi', 1902, 19, NULL),
(190207, 'Tapuc', 1902, 19, NULL),
(190208, 'Vilcabamba', 1902, 19, NULL),
(190301, 'Oxapampa', 1903, 19, NULL),
(190302, 'Chontabamba', 1903, 19, NULL),
(190303, 'Huancabamba', 1903, 19, NULL),
(190304, 'Palcazu', 1903, 19, NULL),
(190305, 'Pozuzo', 1903, 19, NULL),
(190306, 'Puerto Bermúdez', 1903, 19, NULL),
(190307, 'Villa Rica', 1903, 19, NULL),
(190308, 'Constitución', 1903, 19, NULL),
(200101, 'Piura', 2001, 20, NULL),
(200104, 'Castilla', 2001, 20, NULL),
(200105, 'Catacaos', 2001, 20, NULL),
(200107, 'Cura Mori', 2001, 20, NULL),
(200108, 'El Tallan', 2001, 20, NULL),
(200109, 'La Arena', 2001, 20, NULL),
(200110, 'La Unión', 2001, 20, NULL),
(200111, 'Las Lomas', 2001, 20, NULL),
(200114, 'Tambo Grande', 2001, 20, NULL),
(200115, 'Veintiseis de Octubre', 2001, 20, NULL),
(200201, 'Ayabaca', 2002, 20, NULL),
(200202, 'Frias', 2002, 20, NULL),
(200203, 'Jilili', 2002, 20, NULL),
(200204, 'Lagunas', 2002, 20, NULL),
(200205, 'Montero', 2002, 20, NULL),
(200206, 'Pacaipampa', 2002, 20, NULL),
(200207, 'Paimas', 2002, 20, NULL),
(200208, 'Sapillica', 2002, 20, NULL),
(200209, 'Sicchez', 2002, 20, NULL),
(200210, 'Suyo', 2002, 20, NULL),
(200301, 'Huancabamba', 2003, 20, NULL),
(200302, 'Canchaque', 2003, 20, NULL),
(200303, 'El Carmen de la Frontera', 2003, 20, NULL),
(200304, 'Huarmaca', 2003, 20, NULL),
(200305, 'Lalaquiz', 2003, 20, NULL),
(200306, 'San Miguel de El Faique', 2003, 20, NULL),
(200307, 'Sondor', 2003, 20, NULL),
(200308, 'Sondorillo', 2003, 20, NULL),
(200401, 'Chulucanas', 2004, 20, NULL),
(200402, 'Buenos Aires', 2004, 20, NULL),
(200403, 'Chalaco', 2004, 20, NULL),
(200404, 'La Matanza', 2004, 20, NULL),
(200405, 'Morropon', 2004, 20, NULL),
(200406, 'Salitral', 2004, 20, NULL),
(200407, 'San Juan de Bigote', 2004, 20, NULL),
(200408, 'Santa Catalina de Mossa', 2004, 20, NULL),
(200409, 'Santo Domingo', 2004, 20, NULL),
(200410, 'Yamango', 2004, 20, NULL),
(200501, 'Paita', 2005, 20, NULL),
(200502, 'Amotape', 2005, 20, NULL),
(200503, 'Arenal', 2005, 20, NULL),
(200504, 'Colan', 2005, 20, NULL),
(200505, 'La Huaca', 2005, 20, NULL),
(200506, 'Tamarindo', 2005, 20, NULL),
(200507, 'Vichayal', 2005, 20, NULL),
(200601, 'Sullana', 2006, 20, NULL),
(200602, 'Bellavista', 2006, 20, NULL),
(200603, 'Ignacio Escudero', 2006, 20, NULL),
(200604, 'Lancones', 2006, 20, NULL),
(200605, 'Marcavelica', 2006, 20, NULL),
(200606, 'Miguel Checa', 2006, 20, NULL),
(200607, 'Querecotillo', 2006, 20, NULL),
(200608, 'Salitral', 2006, 20, NULL),
(200701, 'Pariñas', 2007, 20, NULL),
(200702, 'El Alto', 2007, 20, NULL),
(200703, 'La Brea', 2007, 20, NULL),
(200704, 'Lobitos', 2007, 20, NULL),
(200705, 'Los Organos', 2007, 20, NULL),
(200706, 'Mancora', 2007, 20, NULL),
(200801, 'Sechura', 2008, 20, NULL),
(200802, 'Bellavista de la Unión', 2008, 20, NULL),
(200803, 'Bernal', 2008, 20, NULL),
(200804, 'Cristo Nos Valga', 2008, 20, NULL),
(200805, 'Vice', 2008, 20, NULL),
(200806, 'Rinconada Llicuar', 2008, 20, NULL),
(210101, 'Puno', 2101, 21, NULL),
(210102, 'Acora', 2101, 21, NULL),
(210103, 'Amantani', 2101, 21, NULL),
(210104, 'Atuncolla', 2101, 21, NULL),
(210105, 'Capachica', 2101, 21, NULL),
(210106, 'Chucuito', 2101, 21, NULL),
(210107, 'Coata', 2101, 21, NULL),
(210108, 'Huata', 2101, 21, NULL),
(210109, 'Mañazo', 2101, 21, NULL),
(210110, 'Paucarcolla', 2101, 21, NULL),
(210111, 'Pichacani', 2101, 21, NULL),
(210112, 'Plateria', 2101, 21, NULL),
(210113, 'San Antonio', 2101, 21, NULL),
(210114, 'Tiquillaca', 2101, 21, NULL),
(210115, 'Vilque', 2101, 21, NULL),
(210201, 'Azángaro', 2102, 21, NULL),
(210202, 'Achaya', 2102, 21, NULL),
(210203, 'Arapa', 2102, 21, NULL),
(210204, 'Asillo', 2102, 21, NULL),
(210205, 'Caminaca', 2102, 21, NULL),
(210206, 'Chupa', 2102, 21, NULL),
(210207, 'José Domingo Choquehuanca', 2102, 21, NULL),
(210208, 'Muñani', 2102, 21, NULL),
(210209, 'Potoni', 2102, 21, NULL),
(210210, 'Saman', 2102, 21, NULL),
(210211, 'San Anton', 2102, 21, NULL),
(210212, 'San José', 2102, 21, NULL),
(210213, 'San Juan de Salinas', 2102, 21, NULL),
(210214, 'Santiago de Pupuja', 2102, 21, NULL),
(210215, 'Tirapata', 2102, 21, NULL),
(210301, 'Macusani', 2103, 21, NULL),
(210302, 'Ajoyani', 2103, 21, NULL),
(210303, 'Ayapata', 2103, 21, NULL),
(210304, 'Coasa', 2103, 21, NULL),
(210305, 'Corani', 2103, 21, NULL),
(210306, 'Crucero', 2103, 21, NULL),
(210307, 'Ituata', 2103, 21, NULL),
(210308, 'Ollachea', 2103, 21, NULL),
(210309, 'San Gaban', 2103, 21, NULL),
(210310, 'Usicayos', 2103, 21, NULL),
(210401, 'Juli', 2104, 21, NULL),
(210402, 'Desaguadero', 2104, 21, NULL),
(210403, 'Huacullani', 2104, 21, NULL),
(210404, 'Kelluyo', 2104, 21, NULL),
(210405, 'Pisacoma', 2104, 21, NULL),
(210406, 'Pomata', 2104, 21, NULL),
(210407, 'Zepita', 2104, 21, NULL),
(210501, 'Ilave', 2105, 21, NULL),
(210502, 'Capazo', 2105, 21, NULL),
(210503, 'Pilcuyo', 2105, 21, NULL),
(210504, 'Santa Rosa', 2105, 21, NULL),
(210505, 'Conduriri', 2105, 21, NULL),
(210601, 'Huancane', 2106, 21, NULL),
(210602, 'Cojata', 2106, 21, NULL),
(210603, 'Huatasani', 2106, 21, NULL),
(210604, 'Inchupalla', 2106, 21, NULL),
(210605, 'Pusi', 2106, 21, NULL),
(210606, 'Rosaspata', 2106, 21, NULL),
(210607, 'Taraco', 2106, 21, NULL),
(210608, 'Vilque Chico', 2106, 21, NULL),
(210701, 'Lampa', 2107, 21, NULL),
(210702, 'Cabanilla', 2107, 21, NULL),
(210703, 'Calapuja', 2107, 21, NULL),
(210704, 'Nicasio', 2107, 21, NULL),
(210705, 'Ocuviri', 2107, 21, NULL),
(210706, 'Palca', 2107, 21, NULL),
(210707, 'Paratia', 2107, 21, NULL),
(210708, 'Pucara', 2107, 21, NULL),
(210709, 'Santa Lucia', 2107, 21, NULL),
(210710, 'Vilavila', 2107, 21, NULL),
(210801, 'Ayaviri', 2108, 21, NULL),
(210802, 'Antauta', 2108, 21, NULL),
(210803, 'Cupi', 2108, 21, NULL),
(210804, 'Llalli', 2108, 21, NULL),
(210805, 'Macari', 2108, 21, NULL),
(210806, 'Nuñoa', 2108, 21, NULL),
(210807, 'Orurillo', 2108, 21, NULL),
(210808, 'Santa Rosa', 2108, 21, NULL),
(210809, 'Umachiri', 2108, 21, NULL),
(210901, 'Moho', 2109, 21, NULL),
(210902, 'Conima', 2109, 21, NULL),
(210903, 'Huayrapata', 2109, 21, NULL),
(210904, 'Tilali', 2109, 21, NULL),
(211001, 'Putina', 2110, 21, NULL),
(211002, 'Ananea', 2110, 21, NULL),
(211003, 'Pedro Vilca Apaza', 2110, 21, NULL),
(211004, 'Quilcapuncu', 2110, 21, NULL),
(211005, 'Sina', 2110, 21, NULL),
(211101, 'Juliaca', 2111, 21, NULL),
(211102, 'Cabana', 2111, 21, NULL),
(211103, 'Cabanillas', 2111, 21, NULL),
(211104, 'Caracoto', 2111, 21, NULL),
(211105, 'San Miguel', 2111, 21, NULL),
(211201, 'Sandia', 2112, 21, NULL),
(211202, 'Cuyocuyo', 2112, 21, NULL),
(211203, 'Limbani', 2112, 21, NULL),
(211204, 'Patambuco', 2112, 21, NULL),
(211205, 'Phara', 2112, 21, NULL),
(211206, 'Quiaca', 2112, 21, NULL),
(211207, 'San Juan del Oro', 2112, 21, NULL),
(211208, 'Yanahuaya', 2112, 21, NULL),
(211209, 'Alto Inambari', 2112, 21, NULL),
(211210, 'San Pedro de Putina Punco', 2112, 21, NULL),
(211301, 'Yunguyo', 2113, 21, NULL),
(211302, 'Anapia', 2113, 21, NULL),
(211303, 'Copani', 2113, 21, NULL),
(211304, 'Cuturapi', 2113, 21, NULL),
(211305, 'Ollaraya', 2113, 21, NULL),
(211306, 'Tinicachi', 2113, 21, NULL),
(211307, 'Unicachi', 2113, 21, NULL),
(220101, 'Moyobamba', 2201, 22, NULL),
(220102, 'Calzada', 2201, 22, NULL),
(220103, 'Habana', 2201, 22, NULL),
(220104, 'Jepelacio', 2201, 22, NULL),
(220105, 'Soritor', 2201, 22, NULL),
(220106, 'Yantalo', 2201, 22, NULL),
(220201, 'Bellavista', 2202, 22, NULL),
(220202, 'Alto Biavo', 2202, 22, NULL),
(220203, 'Bajo Biavo', 2202, 22, NULL),
(220204, 'Huallaga', 2202, 22, NULL),
(220205, 'San Pablo', 2202, 22, NULL),
(220206, 'San Rafael', 2202, 22, NULL),
(220301, 'San José de Sisa', 2203, 22, NULL),
(220302, 'Agua Blanca', 2203, 22, NULL),
(220303, 'San Martín', 2203, 22, NULL),
(220304, 'Santa Rosa', 2203, 22, NULL),
(220305, 'Shatoja', 2203, 22, NULL),
(220401, 'Saposoa', 2204, 22, NULL),
(220402, 'Alto Saposoa', 2204, 22, NULL),
(220403, 'El Eslabón', 2204, 22, NULL),
(220404, 'Piscoyacu', 2204, 22, NULL),
(220405, 'Sacanche', 2204, 22, NULL),
(220406, 'Tingo de Saposoa', 2204, 22, NULL),
(220501, 'Lamas', 2205, 22, NULL),
(220502, 'Alonso de Alvarado', 2205, 22, NULL),
(220503, 'Barranquita', 2205, 22, NULL),
(220504, 'Caynarachi', 2205, 22, NULL),
(220505, 'Cuñumbuqui', 2205, 22, NULL),
(220506, 'Pinto Recodo', 2205, 22, NULL),
(220507, 'Rumisapa', 2205, 22, NULL),
(220508, 'San Roque de Cumbaza', 2205, 22, NULL),
(220509, 'Shanao', 2205, 22, NULL),
(220510, 'Tabalosos', 2205, 22, NULL),
(220511, 'Zapatero', 2205, 22, NULL),
(220601, 'Juanjuí', 2206, 22, NULL),
(220602, 'Campanilla', 2206, 22, NULL),
(220603, 'Huicungo', 2206, 22, NULL),
(220604, 'Pachiza', 2206, 22, NULL),
(220605, 'Pajarillo', 2206, 22, NULL),
(220701, 'Picota', 2207, 22, NULL),
(220702, 'Buenos Aires', 2207, 22, NULL),
(220703, 'Caspisapa', 2207, 22, NULL),
(220704, 'Pilluana', 2207, 22, NULL),
(220705, 'Pucacaca', 2207, 22, NULL),
(220706, 'San Cristóbal', 2207, 22, NULL),
(220707, 'San Hilarión', 2207, 22, NULL),
(220708, 'Shamboyacu', 2207, 22, NULL),
(220709, 'Tingo de Ponasa', 2207, 22, NULL),
(220710, 'Tres Unidos', 2207, 22, NULL),
(220801, 'Rioja', 2208, 22, NULL),
(220802, 'Awajun', 2208, 22, NULL),
(220803, 'Elías Soplin Vargas', 2208, 22, NULL),
(220804, 'Nueva Cajamarca', 2208, 22, NULL),
(220805, 'Pardo Miguel', 2208, 22, NULL),
(220806, 'Posic', 2208, 22, NULL),
(220807, 'San Fernando', 2208, 22, NULL),
(220808, 'Yorongos', 2208, 22, NULL),
(220809, 'Yuracyacu', 2208, 22, NULL),
(220901, 'Tarapoto', 2209, 22, NULL),
(220902, 'Alberto Leveau', 2209, 22, NULL),
(220903, 'Cacatachi', 2209, 22, NULL),
(220904, 'Chazuta', 2209, 22, NULL),
(220905, 'Chipurana', 2209, 22, NULL),
(220906, 'El Porvenir', 2209, 22, NULL),
(220907, 'Huimbayoc', 2209, 22, NULL),
(220908, 'Juan Guerra', 2209, 22, NULL),
(220909, 'La Banda de Shilcayo', 2209, 22, NULL),
(220910, 'Morales', 2209, 22, NULL),
(220911, 'Papaplaya', 2209, 22, NULL),
(220912, 'San Antonio', 2209, 22, NULL),
(220913, 'Sauce', 2209, 22, NULL),
(220914, 'Shapaja', 2209, 22, NULL),
(221001, 'Tocache', 2210, 22, NULL),
(221002, 'Nuevo Progreso', 2210, 22, NULL),
(221003, 'Polvora', 2210, 22, NULL),
(221004, 'Shunte', 2210, 22, NULL),
(221005, 'Uchiza', 2210, 22, NULL),
(230101, 'Tacna', 2301, 23, NULL),
(230102, 'Alto de la Alianza', 2301, 23, NULL),
(230103, 'Calana', 2301, 23, NULL),
(230104, 'Ciudad Nueva', 2301, 23, NULL),
(230105, 'Inclan', 2301, 23, NULL),
(230106, 'Pachia', 2301, 23, NULL),
(230107, 'Palca', 2301, 23, NULL),
(230108, 'Pocollay', 2301, 23, NULL),
(230109, 'Sama', 2301, 23, NULL),
(230110, 'Coronel Gregorio Albarracín Lanchipa', 2301, 23, NULL),
(230111, 'La Yarada los Palos', 2301, 23, NULL),
(230201, 'Candarave', 2302, 23, NULL),
(230202, 'Cairani', 2302, 23, NULL),
(230203, 'Camilaca', 2302, 23, NULL),
(230204, 'Curibaya', 2302, 23, NULL),
(230205, 'Huanuara', 2302, 23, NULL),
(230206, 'Quilahuani', 2302, 23, NULL),
(230301, 'Locumba', 2303, 23, NULL),
(230302, 'Ilabaya', 2303, 23, NULL),
(230303, 'Ite', 2303, 23, NULL),
(230401, 'Tarata', 2304, 23, NULL),
(230402, 'Héroes Albarracín', 2304, 23, NULL),
(230403, 'Estique', 2304, 23, NULL),
(230404, 'Estique-Pampa', 2304, 23, NULL),
(230405, 'Sitajara', 2304, 23, NULL),
(230406, 'Susapaya', 2304, 23, NULL),
(230407, 'Tarucachi', 2304, 23, NULL),
(230408, 'Ticaco', 2304, 23, NULL),
(240101, 'Tumbes', 2401, 24, NULL),
(240102, 'Corrales', 2401, 24, NULL),
(240103, 'La Cruz', 2401, 24, NULL),
(240104, 'Pampas de Hospital', 2401, 24, NULL),
(240105, 'San Jacinto', 2401, 24, NULL),
(240106, 'San Juan de la Virgen', 2401, 24, NULL),
(240201, 'Zorritos', 2402, 24, NULL),
(240202, 'Casitas', 2402, 24, NULL),
(240203, 'Canoas de Punta Sal', 2402, 24, NULL),
(240301, 'Zarumilla', 2403, 24, NULL),
(240302, 'Aguas Verdes', 2403, 24, NULL),
(240303, 'Matapalo', 2403, 24, NULL),
(240304, 'Papayal', 2403, 24, NULL),
(250101, 'Calleria', 2501, 25, NULL),
(250102, 'Campoverde', 2501, 25, NULL),
(250103, 'Iparia', 2501, 25, NULL),
(250104, 'Masisea', 2501, 25, NULL),
(250105, 'Yarinacocha', 2501, 25, NULL),
(250106, 'Nueva Requena', 2501, 25, NULL),
(250107, 'Manantay', 2501, 25, NULL),
(250201, 'Raymondi', 2502, 25, NULL),
(250202, 'Sepahua', 2502, 25, NULL),
(250203, 'Tahuania', 2502, 25, NULL),
(250204, 'Yurua', 2502, 25, NULL),
(250301, 'Padre Abad', 2503, 25, NULL),
(250302, 'Irazola', 2503, 25, NULL),
(250303, 'Curimana', 2503, 25, NULL),
(250304, 'Neshuya', 2503, 25, NULL),
(250305, 'Alexander Von Humboldt', 2503, 25, NULL),
(250401, 'Purus', 2504, 25, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_empresas`
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
) ENGINE=InnoDB AUTO_INCREMENT=47;

--
-- Volcado de datos para la tabla `tb_empresas`
--

INSERT INTO `tb_empresas` (`id_empresa`, `ruc`, `representante_legal`, `razon_social`, `nombre_comercial`, `telefono`, `email`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(44, '20452777399', 'CAMPOS MARTINEZ HERNANDO MARTIN', 'UNIVERSIDAD AUTONOMA DE ICA SAC', 'Unadic Sac', '970582925', NULL, '2025-02-20 14:19:44', NULL, NULL, 1, NULL, NULL),
(45, '20410275768', 'CAROLINA PEREZ', 'UNIDAD EJECUTORA 401 SALUD CHINCHA PISCO', 'Hospital San José de Chincha', '959390288', NULL, '2025-02-20 14:19:44', NULL, NULL, 1, NULL, NULL),
(46, '20147673478', 'MARIA VERONICA TORRES YATACO', 'MUNICIPALIDAD DISTRITAL DE SUNAMPE', 'MD-Sunampe', '942608827', NULL, '2025-02-20 14:19:44', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_kardex`
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
) ENGINE=InnoDB AUTO_INCREMENT=5;

--
-- Volcado de datos para la tabla `tb_kardex`
--

INSERT INTO `tb_kardex` (`id_kardex`, `id_producto`, `id_almacen`, `id_tipooperacion`, `fecha`, `cantidad`, `saldo_total`, `valor_unico_historico`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(2, 24, 1, 2, '2025-02-18', 2, 2, 165.00, '2025-02-18 12:58:00', NULL, NULL, 1, NULL, NULL),
(3, 27, 1, 1, '2025-02-18', 3, 3, 165.00, '2025-02-18 12:58:18', NULL, NULL, 1, NULL, NULL),
(4, 25, 1, 1, '2025-02-18', 3, 3, 130.00, '2025-02-18 12:58:27', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_lineas`
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
  `tipo_linea` char(1) NOT NULL,
  PRIMARY KEY (`id_linea`),
  KEY `lineas_fk_id_mufa` (`id_mufa`),
  KEY `lineas_fk_id_caja` (`id_caja`)
) ENGINE=InnoDB AUTO_INCREMENT=187;

--
-- Volcado de datos para la tabla `tb_lineas`
--

INSERT INTO `tb_lineas` (`id_linea`, `id_mufa`, `id_caja`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`, `tipo_linea`) VALUES
(1, NULL, NULL, '[{\"lng\":-76.17508995312564,\"lat\":-13.429970902608913},{\"lng\":-76.17201772401685,\"lat\":-13.42955462875151},{\"lat\":-13.429097201391013,\"lng\":-76.17003118883397},{\"lat\":-13.428742394506669,\"lng\":-76.16840040575292},{\"lat\":-13.427844939457602,\"lng\":-76.16554686836626},{\"lat\":-13.428296089067258,\"lng\":-76.1653837256161},{\"lat\":-13.427996067572721,\"lng\":-76.1643027953831},{\"lat\":-13.428833517937118,\"lng\":-76.16402652785456},{\"lat\":-13.42985497629304,\"lng\":-76.16362500132804},{\"lat\":-13.430295873900935,\"lng\":-76.16346138657813},{\"lat\":-13.429560174481969,\"lng\":-76.16164824283751},{\"lat\":-13.430123290391329,\"lng\":-76.16157158614406},{\"lat\":-13.429973026506158,\"lng\":-76.16063876779761},{\"lat\":-13.429190133675641,\"lng\":-76.16049579219475},{\"lat\":-13.428383991117514,\"lng\":-76.16024098233834},{\"lat\":-13.427867432326568,\"lng\":-76.16016856269493},{\"lat\":-13.426508199084912,\"lng\":-76.15958920554772},{\"lat\":-13.426309922575204,\"lng\":-76.15945509509697},{\"lat\":-13.426103819187546,\"lng\":-76.15935317115441},{\"lat\":-13.425562899971801,\"lng\":-76.15919178865596},{\"lat\":-13.425189825460224,\"lng\":-76.15842199466869},{\"lat\":-13.424895017918553,\"lng\":-76.15809208295985},{\"lat\":-13.4244880263811,\"lng\":-76.15793383262798},{\"lat\":-13.424503679914539,\"lng\":-76.15752613685771},{\"lat\":-13.424561076195047,\"lng\":-76.15720695398494},{\"lat\":-13.424498462070174,\"lng\":-76.15672683857127},{\"lat\":-13.424112341272556,\"lng\":-76.15598118446513},{\"lat\":-13.424015810976092,\"lng\":-76.15558421753093},{\"lat\":-13.423079204192442,\"lng\":-76.15562445066615},{\"lat\":-13.422648594958737,\"lng\":-76.15570137953708},{\"lat\":-13.421763886460644,\"lng\":-76.15581648798276},{\"lat\":-13.421009324531179,\"lng\":-76.15589731094957},{\"lat\":-13.41969865550533,\"lng\":-76.15605449589563},{\"lat\":-13.41893533093695,\"lng\":-76.15628877153172},{\"lat\":-13.41820775149314,\"lng\":-76.15551882767674},{\"lat\":-13.417757266466467,\"lng\":-76.1537360467319},{\"lat\":-13.418640432745999,\"lng\":-76.15257373772175},{\"lat\":-13.418489111518234,\"lng\":-76.15255898557217},{\"lat\":-13.418462470046663,\"lng\":-76.15131495557434},{\"lat\":-13.418605964332638,\"lng\":-76.15094615183479},{\"lat\":-13.418473880138585,\"lng\":-76.15033354668496},{\"lat\":-13.417942950560251,\"lng\":-76.14877115993379},{\"lat\":-13.417810885542016,\"lng\":-76.14786117015838},{\"lat\":-13.417771098872002,\"lng\":-76.14736295346901},{\"lat\":-13.417243873809419,\"lng\":-76.14367675857352},{\"lat\":-13.417371570450412,\"lng\":-76.14370001173383},{\"lat\":-13.417789010031267,\"lng\":-76.14369196510678},{\"lat\":-13.418316026465867,\"lng\":-76.1436222276724},{\"lat\":-13.41873929630932,\"lng\":-76.14361589032963},{\"lat\":-13.419104553902095,\"lng\":-76.14362768221858},{\"lat\":-13.41992768931122,\"lng\":-76.14373698743387},{\"lat\":-13.420024221251328,\"lng\":-76.14308789285226},{\"lat\":-13.4201390159404,\"lng\":-76.14249512465997},{\"lat\":-13.420371214120992,\"lng\":-76.14152416499658},{\"lat\":-13.420510283495357,\"lng\":-76.14102713987376},{\"lat\":-13.420867711509509,\"lng\":-76.1395224206164},{\"lat\":-13.422195395135518,\"lng\":-76.13972665045358},{\"lat\":-13.423536390271025,\"lng\":-76.14006997320749},{\"lat\":-13.42352073667452,\"lng\":-76.13994122717477},{\"lat\":-13.423802280462112,\"lng\":-76.13864322461833},{\"lat\":-13.423960120661684,\"lng\":-76.13780175039932},{\"lat\":-13.423997950115595,\"lng\":-76.13752308141335},{\"lat\":-13.423957424120417,\"lng\":-76.13513349339627},{\"lat\":-13.424025256241189,\"lng\":-76.1348297415489},{\"lat\":-13.424018733922715,\"lng\":-76.1347224531883}]', '2025-02-06 16:14:04', '2025-02-19 11:16:05', NULL, 1, NULL, NULL, 'P'),
(2, 1, NULL, '[{\"lat\":-13.41893458450332,\"lng\":-76.15628775042316},{\"lat\":-13.419028507861,\"lng\":-76.15636486012832},{\"lat\":-13.419109386278448,\"lng\":-76.1566143055667},{\"lat\":-13.41901859234727,\"lng\":-76.15793288591789},{\"lat\":-13.41918732460976,\"lng\":-76.15800979458783},{\"lat\":-13.419281247868591,\"lng\":-76.15843358361218},{\"lat\":-13.419153407868368,\"lng\":-76.15866961800549},{\"lat\":-13.418503770897297,\"lng\":-76.15904434499201},{\"lat\":-13.418052002621119,\"lng\":-76.1595422498122},{\"lat\":-13.418286811809377,\"lng\":-76.16020207322987},{\"lat\":-13.417939815927893,\"lng\":-76.16078947700413},{\"lat\":-13.417538030596697,\"lng\":-76.16121863044651},{\"lat\":-13.4173240926786,\"lng\":-76.16299425281437},{\"lat\":-13.417141174958394,\"lng\":-76.16436464402487},{\"lat\":-13.41664285503075,\"lng\":-76.16716755244543},{\"lat\":-13.415082479812511,\"lng\":-76.16520935108521},{\"lat\":-13.41390580687619,\"lng\":-76.16367512752869},{\"lat\":-13.41349588017605,\"lng\":-76.16415464616252},{\"lat\":-13.41342804508118,\"lng\":-76.16468035912943},{\"lat\":-13.413464571673115,\"lng\":-76.16527312732173},{\"lat\":-13.41249819010488,\"lng\":-76.16437458730174},{\"lat\":-13.411604112727687,\"lng\":-76.1635156705385},{\"lat\":-13.410636148670488,\"lng\":-76.16258494401033},{\"lat\":-13.410878792317877,\"lng\":-76.1615335180765},{\"lat\":-13.409068059519651,\"lng\":-76.16084685648754},{\"lat\":-13.4082357584263,\"lng\":-76.16050889815166},{\"lat\":-13.407000247208575,\"lng\":-76.16003951157406},{\"lat\":-13.406216819587433,\"lng\":-76.15977129067257},{\"lat\":-13.405307607877086,\"lng\":-76.15939195567417},{\"lat\":-13.403761467380047,\"lng\":-76.15878203041385},{\"lat\":-13.401510149218112,\"lng\":-76.15790122866672},{\"lat\":-13.399635732279474,\"lng\":-76.1571943001846},{\"lat\":-13.398712817347748,\"lng\":-76.1568272183517},{\"lat\":-13.397005191479158,\"lng\":-76.15617302298513},{\"lat\":-13.396074613627688,\"lng\":-76.15581037731057},{\"lat\":-13.395161381110888,\"lng\":-76.15554215640908},{\"lat\":-13.394390827972286,\"lng\":-76.15431817991632},{\"lat\":-13.39406467161736,\"lng\":-76.1537575982322},{\"lat\":-13.391557629671501,\"lng\":-76.15086859810611},{\"lat\":-13.39122757002864,\"lng\":-76.15036128569925},{\"lat\":-13.390128971420191,\"lng\":-76.14904245772028},{\"lat\":-13.391611876693643,\"lng\":-76.14806579231126},{\"lat\":-13.392735622083375,\"lng\":-76.14700732538131},{\"lat\":-13.394048729525858,\"lng\":-76.1457091362181},{\"lat\":-13.395551654433548,\"lng\":-76.14416954824355},{\"lat\":-13.396472713148473,\"lng\":-76.14326296159652},{\"lat\":-13.395335087708078,\"lng\":-76.14169738908748},{\"lat\":-13.395695162397246,\"lng\":-76.14137820621471},{\"lat\":-13.396246036064548,\"lng\":-76.13942094964585},{\"lat\":-13.396676793952023,\"lng\":-76.13788418421687},{\"lat\":-13.397282120516303,\"lng\":-76.13575881426146},{\"lat\":-13.398082035027695,\"lng\":-76.13296420940769},{\"lat\":-13.39845573308992,\"lng\":-76.13159180741617},{\"lat\":-13.39729068854531,\"lng\":-76.13129473647511},{\"lat\":-13.397830779934754,\"lng\":-76.12910194129122},{\"lat\":-13.398077390395287,\"lng\":-76.12804216269804},{\"lat\":-13.397790377224519,\"lng\":-76.12788391236616},{\"lat\":-13.39644305255336,\"lng\":-76.12640417686076},{\"lat\":-13.394692254990575,\"lng\":-76.12456295587484},{\"lat\":-13.393058526562683,\"lng\":-76.12281346684233},{\"lat\":-13.391186583985998,\"lng\":-76.12089638034776},{\"lat\":-13.389007123412112,\"lng\":-76.11868869717443},{\"lat\":-13.38832861338904,\"lng\":-76.1197086907998},{\"lat\":-13.387434803625306,\"lng\":-76.11898343886051},{\"lat\":-13.38614579387845,\"lng\":-76.12074833239231},{\"lat\":-13.385355245841366,\"lng\":-76.12011934586572}]', '2025-02-06 16:35:48', NULL, NULL, 1, NULL, NULL, 'S'),
(3, 2, 1, '[{\"lat\":-13.429921783880777,\"lng\":-76.17494600116132},{\"lat\":-13.429921131664948,\"lng\":-76.1750056803119},{\"lat\":-13.429959657496903,\"lng\":-76.17500280539561}]', '2025-02-06 16:48:05', NULL, NULL, 1, NULL, NULL, 'C'),
(4, 2, 2, '[{\"lat\":-13.4299821448565,\"lng\":-76.17492463503565},{\"lat\":-13.42998410150344,\"lng\":-76.17499973688807},{\"lat\":-13.429959657496903,\"lng\":-76.17500280539561}]', '2025-02-06 16:53:14', NULL, NULL, 1, NULL, NULL, 'C'),
(5, 2, 3, '[{\"lat\": -13.430125827789597, \"lng\": -76.17565177603981}, {\"lat\": -13.430033213204903, \"lng\": -76.17526151462815}, {\"lat\": -13.429959657496903, \"lng\": -76.17500280539561}]', '2025-02-06 16:54:11', NULL, NULL, 1, NULL, NULL, 'C'),
(6, 2, 4, '[{\"lat\":-13.430355020042235,\"lng\":-76.17656661502566},{\"lat\":-13.4302402302388,\"lng\":-76.17612673274722},{\"lat\":-13.430154137850165,\"lng\":-76.17575524679866},{\"lat\":-13.429978039686318,\"lng\":-76.17514862328255},{\"lat\":-13.429959657496903,\"lng\":-76.17500280539561}]', '2025-02-06 17:01:39', NULL, NULL, 1, NULL, NULL, 'C'),
(7, 2, 5, '[\r\n  {\"lat\": -13.427437956759812, \"lng\": -76.17497433761412},\r\n  {\"lat\": -13.427842334409291, \"lng\": -76.17503334621244},\r\n  {\"lat\": -13.42880501136192, \"lng\": -76.17507089713865},\r\n  {\"lat\": -13.429731305906916, \"lng\": -76.1750939589911},\r\n  {\"lat\": -13.429959657496903, \"lng\": -76.17500280539561}\r\n]', '2025-02-06 17:03:06', NULL, NULL, 1, NULL, NULL, 'C'),
(8, 2, 6, '[{\"lat\":-13.42570407020543,\"lng\":-76.17384731251043},{\"lat\":-13.425617976189482,\"lng\":-76.17471366602224},{\"lat\":-13.42734245953232,\"lng\":-76.17494970041555},{\"lat\":-13.42783957243143,\"lng\":-76.1750113912229},{\"lat\":-13.429740460446364,\"lng\":-76.17511633303204},{\"lat\":-13.429985179521392,\"lng\":-76.17510485283806},{\"lat\":-13.429959657496903,\"lng\":-76.17500280539561}]', '2025-02-06 17:08:27', NULL, NULL, 1, NULL, NULL, 'C'),
(9, 2, 7, '[{\"lat\":-13.42402091324064,\"lng\":-76.1732447508896},{\"lat\":-13.423971343614921,\"lng\":-76.17362026015168},{\"lat\":-13.425738463309628,\"lng\":-76.17386077123761},{\"lat\":-13.425635686166045,\"lng\":-76.17470704386312},{\"lat\":-13.427835327872472,\"lng\":-76.1750186832714},{\"lat\":-13.429983839472829,\"lng\":-76.17509387031721},{\"lat\":-13.429959657496903,\"lng\":-76.17500280539561}]', '2025-02-06 17:09:37', NULL, NULL, 1, NULL, NULL, 'C'),
(10, 2, 8, '[{\"lat\":-13.42777241713813,\"lng\":-76.17422998058001},{\"lat\":-13.427725577921573,\"lng\":-76.17372716750523},{\"lat\":-13.425781949137706,\"lng\":-76.17349381532094},{\"lat\":-13.425606537153927,\"lng\":-76.17470645607995},{\"lat\":-13.427846238019288,\"lng\":-76.175028208205},{\"lat\":-13.42999025707121,\"lng\":-76.17509297427989},{\"lat\":-13.429959657496903,\"lng\":-76.17500280539561}]', '2025-02-06 17:11:21', NULL, NULL, 1, NULL, NULL, 'C'),
(11, 3, 9, '[{\"lat\":-13.429544454071744,\"lng\":-76.169934307804},{\"lat\":-13.42911920831555,\"lng\":-76.16999063419331},{\"lat\":-13.428764401463738,\"lng\":-76.16833839344014},{\"lat\":-13.428328718803115,\"lng\":-76.16694096254338},{\"lat\":-13.428284134347114,\"lng\":-76.1669445824996}]', '2025-02-06 17:25:36', NULL, NULL, 1, NULL, NULL, 'C'),
(12, 3, 10, '[{\"lat\":-13.42733478042149,\"lng\":-76.16730023502598},{\"lat\":-13.427551318308401,\"lng\":-76.16717760250044},{\"lat\":-13.427827860385918,\"lng\":-76.16708372518492},{\"lat\":-13.428284134347114,\"lng\":-76.1669445824996}]', '2025-02-07 16:37:01', NULL, NULL, 1, NULL, NULL, 'C'),
(13, 3, 11, '[{\"lat\":-13.42645212064318,\"lng\":-76.16823597657066},{\"lat\":-13.426376462502967,\"lng\":-76.16752519118171},{\"lat\":-13.42682354515118,\"lng\":-76.16746300644627},{\"lat\":-13.427339412136991,\"lng\":-76.1672909506392},{\"lat\":-13.42753675017291,\"lng\":-76.16719170862063},{\"lat\":-13.428082287900631,\"lng\":-76.16699648715111},{\"lat\":-13.428284134347114,\"lng\":-76.1669445824996}]', '2025-02-07 16:38:22', NULL, NULL, 1, NULL, NULL, 'C'),
(14, 3, 12, '[{\"lat\":-13.426965901649798,\"lng\":-76.16574831230929},{\"lat\":-13.427198093227243,\"lng\":-76.16674743516734},{\"lat\":-13.427344188115255,\"lng\":-76.16729126856741},{\"lat\":-13.427532840698122,\"lng\":-76.1671923708947},{\"lat\":-13.427898880072192,\"lng\":-76.16705653397062},{\"lat\":-13.428020114468888,\"lng\":-76.16701220080105},{\"lat\":-13.428284134347114,\"lng\":-76.1669445824996}]', '2025-02-07 16:39:24', NULL, NULL, 1, NULL, NULL, 'C'),
(15, 3, 13, '[{\"lat\":-13.426298635323759,\"lng\":-76.16503399163575},{\"lat\":-13.426490389591478,\"lng\":-76.16485696584077},{\"lat\":-13.426790412968293,\"lng\":-76.1650956824431},{\"lat\":-13.426974340157345,\"lng\":-76.16574075371118},{\"lat\":-13.42718685276967,\"lng\":-76.16675898048148},{\"lat\":-13.427337516292477,\"lng\":-76.16728804620966},{\"lat\":-13.427528806853404,\"lng\":-76.16719892775652},{\"lat\":-13.428019049196472,\"lng\":-76.16701589829421},{\"lat\":-13.428247040433392,\"lng\":-76.16694912299288},{\"lat\":-13.428284134347114,\"lng\":-76.1669445824996}]', '2025-02-07 16:41:37', NULL, NULL, 1, NULL, NULL, 'C'),
(16, 3, 14, '[{\"lat\":-13.42600313230086,\"lng\":-76.16660472869587},{\"lat\":-13.425911820578534,\"lng\":-76.1660334181757},{\"lat\":-13.426970382197913,\"lng\":-76.16574809819174},{\"lat\":-13.42719400496504,\"lng\":-76.16675372719729},{\"lat\":-13.427337344420316,\"lng\":-76.16729013078694},{\"lat\":-13.42754566507395,\"lng\":-76.16718358460909},{\"lat\":-13.427996817166868,\"lng\":-76.16702254480236},{\"lat\":-13.428246143120738,\"lng\":-76.16694703241265},{\"lat\":-13.428284134347114,\"lng\":-76.1669445824996}]', '2025-02-07 16:43:51', NULL, NULL, 1, NULL, NULL, 'C'),
(17, 3, 15, '[{\"lat\":-13.424568596158336,\"lng\":-76.16758836841433},{\"lat\":-13.42504863722473,\"lng\":-76.16748376226275},{\"lat\":-13.42517125625624,\"lng\":-76.16741670703738},{\"lat\":-13.425335617838542,\"lng\":-76.16721017694323},{\"lat\":-13.426090713120551,\"lng\":-76.16706150338474},{\"lat\":-13.425905480800896,\"lng\":-76.16603958175007},{\"lat\":-13.426967961590872,\"lng\":-76.16574439653324},{\"lat\":-13.427191081536577,\"lng\":-76.16675636505043},{\"lat\":-13.427338448103795,\"lng\":-76.16729427275412},{\"lat\":-13.427530906208178,\"lng\":-76.16718698439352},{\"lat\":-13.428021510816194,\"lng\":-76.16700622280695},{\"lat\":-13.428246294263026,\"lng\":-76.16694530352608},{\"lat\":-13.428284134347114,\"lng\":-76.1669445824996}]', '2025-02-07 16:46:10', NULL, NULL, 1, NULL, NULL, 'C'),
(18, 4, 16, '[{\"lat\":-13.428308777565869,\"lng\":-76.1639939648581},{\"lat\":-13.42836225961615,\"lng\":-76.16413478083138},{\"lat\":-13.42838530966998,\"lng\":-76.16417511096424}]', '2025-02-07 16:49:15', NULL, NULL, 1, NULL, NULL, 'C'),
(19, 4, 17, '[{\"lat\":-13.427735449637003,\"lng\":-76.162486577768},{\"lat\":-13.42798198933424,\"lng\":-76.16319602205243},{\"lat\":-13.428372846849152,\"lng\":-76.16413150144847},{\"lat\":-13.42838530966998,\"lng\":-76.16417511096424}]', '2025-02-07 16:52:21', NULL, NULL, 1, NULL, NULL, 'C'),
(20, 4, 18, '[{\"lat\":-13.427035809884648,\"lng\":-76.1627835314827},{\"lat\":-13.427025374305916,\"lng\":-76.16268160754014},{\"lat\":-13.427724557078859,\"lng\":-76.16249854677487},{\"lat\":-13.427978902170262,\"lng\":-76.16319718162961},{\"lat\":-13.42838530966998,\"lng\":-76.16417511096424}]', '2025-02-07 16:53:19', NULL, NULL, 1, NULL, NULL, 'C'),
(21, 4, 19, '[{\"lat\":-13.430334583783168,\"lng\":-76.16505395980302},{\"lat\":-13.429870206473199,\"lng\":-76.16364445896569},{\"lat\":-13.42985661332882,\"lng\":-76.1636187412384},{\"lat\":-13.429669417980577,\"lng\":-76.1636932759428},{\"lat\":-13.429202908260523,\"lng\":-76.16388612761259},{\"lat\":-13.428837877698209,\"lng\":-76.16404341413023},{\"lat\":-13.42838530966998,\"lng\":-76.16417511096424}]', '2025-02-07 16:55:30', NULL, NULL, 1, NULL, NULL, 'C'),
(22, 4, 20, '[{\"lat\":-13.42985655987614,\"lng\":-76.16362105846564},{\"lat\":-13.429677461378844,\"lng\":-76.16369197477428},{\"lat\":-13.429466795363961,\"lng\":-76.16377445270149},{\"lat\":-13.429183124510363,\"lng\":-76.16389214327545},{\"lat\":-13.428838646846977,\"lng\":-76.1640304676141},{\"lat\":-13.428376645950372,\"lng\":-76.16416494109578},{\"lat\":-13.42838530966998,\"lng\":-76.16417511096424}]', '2025-02-07 16:56:50', NULL, NULL, 1, NULL, NULL, 'C'),
(23, 4, 21, '[{\"lat\":-13.433336446147615,\"lng\":-76.16393358938441},{\"lat\":-13.433185134184665,\"lng\":-76.16285802356944},{\"lat\":-13.433123826724238,\"lng\":-76.16275207631335},{\"lat\":-13.432463039376259,\"lng\":-76.16274057345808},{\"lat\":-13.432256116044286,\"lng\":-76.16276227746344},{\"lat\":-13.431271083994877,\"lng\":-76.16313922741934},{\"lat\":-13.431032657161603,\"lng\":-76.16322451411075},{\"lat\":-13.430304374265994,\"lng\":-76.16347417150196},{\"lat\":-13.4298608678098,\"lng\":-76.1636082819527},{\"lat\":-13.428843141859236,\"lng\":-76.16403529167653},{\"lat\":-13.428370967387611,\"lng\":-76.16416109417062},{\"lat\":-13.42838530966998,\"lng\":-76.16417511096424}]', '2025-02-07 17:05:01', NULL, NULL, 1, NULL, NULL, 'C'),
(24, 5, 22, '[{\"lat\":-13.429870021276917,\"lng\":-76.16007055801217},{\"lat\":-13.429905893151735,\"lng\":-76.16020131570164},{\"lat\":-13.429957418198923,\"lng\":-76.160445396722},{\"lat\":-13.42997295622689,\"lng\":-76.1606390029192}]', '2025-02-07 17:08:19', NULL, NULL, 1, NULL, NULL, 'C'),
(25, 5, 23, '[{\"lat\":-13.429767839054534,\"lng\":-76.15931604402857},{\"lat\":-13.429876106924674,\"lng\":-76.1600590159257},{\"lat\":-13.429964808275864,\"lng\":-76.16043586629229},{\"lat\":-13.42997295622689,\"lng\":-76.1606390029192}]', '2025-02-07 17:09:54', NULL, NULL, 1, NULL, NULL, 'C'),
(26, 5, 24, '[{\"lat\":-13.42933460393575,\"lng\":-76.15653095697792},{\"lat\":-13.429321559587189,\"lng\":-76.15663086926372},{\"lat\":-13.429350909370447,\"lng\":-76.15684745764167},{\"lat\":-13.429382868019227,\"lng\":-76.15692054783733},{\"lat\":-13.429446133086929,\"lng\":-76.15732811829358},{\"lat\":-13.429547878934029,\"lng\":-76.15778811713963},{\"lat\":-13.429609187308232,\"lng\":-76.15797318956166},{\"lat\":-13.429703290337278,\"lng\":-76.15835753365869},{\"lat\":-13.429726770126816,\"lng\":-76.15845342263097},{\"lat\":-13.42976394645554,\"lng\":-76.15865659996385},{\"lat\":-13.429756772076768,\"lng\":-76.15889866932744},{\"lat\":-13.429746988832624,\"lng\":-76.15909380003328},{\"lat\":-13.429762642023045,\"lng\":-76.1593325166356},{\"lat\":-13.42986621363727,\"lng\":-76.16005464733202},{\"lat\":-13.429959511746397,\"lng\":-76.16044155598242},{\"lat\":-13.42997295622689,\"lng\":-76.1606390029192}]', '2025-02-07 17:11:24', NULL, NULL, 1, NULL, NULL, 'C'),
(27, 5, 25, '[{\"lat\":-13.427584139331747,\"lng\":-76.15663652320269},{\"lat\":-13.428520728536665,\"lng\":-76.15656410355929},{\"lat\":-13.429328407870267,\"lng\":-76.15653728433581},{\"lat\":-13.429317972391226,\"lng\":-76.15663417913647},{\"lat\":-13.42935514878328,\"lng\":-76.15684506782027},{\"lat\":-13.429378954715535,\"lng\":-76.15692486353846},{\"lat\":-13.429475426480948,\"lng\":-76.15749467968305},{\"lat\":-13.429553366403034,\"lng\":-76.15779341071209},{\"lat\":-13.429606590906259,\"lng\":-76.15797341463185},{\"lat\":-13.429733646440821,\"lng\":-76.15845785176433},{\"lat\":-13.429762448713422,\"lng\":-76.15865498195393},{\"lat\":-13.429751361036963,\"lng\":-76.1590992109765},{\"lat\":-13.42975688532927,\"lng\":-76.15932062251754},{\"lat\":-13.429827000825311,\"lng\":-76.15980874751894},{\"lat\":-13.429860589950641,\"lng\":-76.16004390896548},{\"lat\":-13.429954509033415,\"lng\":-76.16044782968207},{\"lat\":-13.42997295622689,\"lng\":-76.1606390029192}]', '2025-02-07 17:13:14', NULL, NULL, 1, NULL, NULL, 'C'),
(28, 5, 26, '[{\"lat\":-13.429204208723482,\"lng\":-76.15554628538325},{\"lat\":-13.42925116839791,\"lng\":-76.1560411529465},{\"lat\":-13.429347696588732,\"lng\":-76.1565279738827},{\"lat\":-13.429338565545313,\"lng\":-76.15664599107936},{\"lat\":-13.429380639813607,\"lng\":-76.1569053368016},{\"lat\":-13.429434121625002,\"lng\":-76.15730900925834},{\"lat\":-13.429560651716693,\"lng\":-76.1577877835675},{\"lat\":-13.429601089154616,\"lng\":-76.157968832676},{\"lat\":-13.429736750186878,\"lng\":-76.15846235913475},{\"lat\":-13.429755072192371,\"lng\":-76.15865840693168},{\"lat\":-13.429741262181707,\"lng\":-76.15909884310373},{\"lat\":-13.429769959697397,\"lng\":-76.1593080554069},{\"lat\":-13.429872357623127,\"lng\":-76.16006343252072},{\"lat\":-13.429958474917568,\"lng\":-76.16043424575533},{\"lat\":-13.42997295622689,\"lng\":-76.1606390029192}]', '2025-02-07 17:15:33', NULL, NULL, 1, NULL, NULL, 'C'),
(29, 6, 27, '[{\"lat\":-13.426374204847662,\"lng\":-76.15954266112254},{\"lat\":-13.426360508112706,\"lng\":-76.15950108688281},{\"lat\":-13.426089387399815,\"lng\":-76.1593310912567},{\"lat\":-13.42590720615436,\"lng\":-76.15927208265838},{\"lat\":-13.425613427496993,\"lng\":-76.15918486349555},{\"lat\":-13.425586778170786,\"lng\":-76.15919738646637}]', '2025-02-07 17:19:23', NULL, NULL, 1, NULL, NULL, 'C'),
(30, 6, 28, '[{\"lat\":-13.42547264097679,\"lng\":-76.15915770645812},{\"lat\":-13.425490251129595,\"lng\":-76.15917983468249},{\"lat\":-13.425586778170786,\"lng\":-76.15919738646637}]', '2025-02-07 17:52:26', NULL, NULL, 1, NULL, NULL, 'C'),
(31, 6, 29, '[{\"lat\":-13.425590273643117,\"lng\":-76.15849505063193},{\"lat\":-13.425410258761923,\"lng\":-76.15855070646899},{\"lat\":-13.425322207955649,\"lng\":-76.15859093960421},{\"lat\":-13.425597694708545,\"lng\":-76.15916572963035},{\"lat\":-13.425586778170786,\"lng\":-76.15919738646637}]', '2025-02-07 17:53:25', NULL, NULL, 1, NULL, NULL, 'C'),
(32, 6, 30, '[{\"lat\":-13.425650929193075,\"lng\":-76.15700835556312},{\"lat\":-13.425268723620054,\"lng\":-76.15717062920852},{\"lat\":-13.424818685561052,\"lng\":-76.15735301942154},{\"lat\":-13.424907388781468,\"lng\":-76.15806112260147},{\"lat\":-13.42521393642319,\"lng\":-76.15838566989227},{\"lat\":-13.425579184166041,\"lng\":-76.1591648516111},{\"lat\":-13.425586778170786,\"lng\":-76.15919738646637}]', '2025-02-07 17:54:17', NULL, NULL, 1, NULL, NULL, 'C'),
(33, 7, 31, '[{\"lat\":-13.424505931248174,\"lng\":-76.15540441936172},{\"lat\":-13.42440287880196,\"lng\":-76.15589258140243},{\"lat\":-13.424517671397451,\"lng\":-76.1564813262812},{\"lat\":-13.424504626787092,\"lng\":-76.15670126742042},{\"lat\":-13.424487016561987,\"lng\":-76.15669053858436},{\"lat\":-13.424116387800753,\"lng\":-76.15596815828123},{\"lat\":-13.424043203346905,\"lng\":-76.1556537936495},{\"lat\":-13.424046464505837,\"lng\":-76.15556729240878},{\"lat\":-13.424015750480569,\"lng\":-76.15558438514931}]', '2025-02-07 17:56:43', NULL, NULL, 1, NULL, NULL, 'C'),
(34, 7, 32, '[{\"lat\":-13.423822367870782,\"lng\":-76.15688045607511},{\"lat\":-13.424219720934772,\"lng\":-76.15679555906449},{\"lat\":-13.424497156350139,\"lng\":-76.15674170151752},{\"lat\":-13.424104569203132,\"lng\":-76.155967972895},{\"lat\":-13.4240325053617,\"lng\":-76.15567913516533},{\"lat\":-13.424043267186466,\"lng\":-76.15556447072994},{\"lat\":-13.424015750480569,\"lng\":-76.15558438514931}]', '2025-02-07 17:58:31', NULL, NULL, 1, NULL, NULL, 'C'),
(35, 7, 33, '[{\"lat\":-13.421191891022174,\"lng\":-76.1595650177472},{\"lat\":-13.421029116019412,\"lng\":-76.15855404098515},{\"lat\":-13.421806584814284,\"lng\":-76.15840517838483},{\"lat\":-13.421740056542758,\"lng\":-76.1577864214587},{\"lat\":-13.42172831625762,\"lng\":-76.15733044592616},{\"lat\":-13.423776142407846,\"lng\":-76.15688573725126},{\"lat\":-13.424490372254752,\"lng\":-76.15673847651131},{\"lat\":-13.424117659545328,\"lng\":-76.1559778600781},{\"lat\":-13.42402699933758,\"lng\":-76.15566672383237},{\"lat\":-13.424036782814884,\"lng\":-76.15557955203938},{\"lat\":-13.424015750480569,\"lng\":-76.15558438514931}]', '2025-02-07 18:00:27', NULL, NULL, 1, NULL, NULL, 'C'),
(36, 7, 34, '[{\"lat\":-13.42020440710891,\"lng\":-76.15601988973823},{\"lat\":-13.422654216382362,\"lng\":-76.15571948232856},{\"lat\":-13.423097736155652,\"lng\":-76.1555987829229},{\"lat\":-13.424016992598938,\"lng\":-76.15556709118655},{\"lat\":-13.424015750480569,\"lng\":-76.15558438514931}]', '2025-02-07 18:02:03', NULL, NULL, 1, NULL, NULL, 'C'),
(37, 8, 35, '[{\"lat\":-13.41924838666237,\"lng\":-76.15279166669748},{\"lat\":-13.419123155625277,\"lng\":-76.1524711427202},{\"lat\":-13.418948353860161,\"lng\":-76.15219085187815},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:40:00', NULL, NULL, 1, NULL, NULL, 'C'),
(38, 8, 36, '[{\"lat\":-13.420076112172781,\"lng\":-76.1512025684645},{\"lat\":-13.419052022030643,\"lng\":-76.15206087534926},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:41:00', NULL, NULL, 1, NULL, NULL, 'C'),
(39, 8, 37, '[{\"lat\":-13.421296988362371,\"lng\":-76.15168459391317},{\"lat\":-13.421349819735818,\"lng\":-76.15145794725142},{\"lat\":-13.421315251060673,\"lng\":-76.1508960244628},{\"lat\":-13.421116318022086,\"lng\":-76.1503206906291},{\"lat\":-13.42053259271841,\"lng\":-76.15080821293314},{\"lat\":-13.419900807248153,\"lng\":-76.15134194810925},{\"lat\":-13.419225490820432,\"lng\":-76.15190971851759},{\"lat\":-13.41904487688539,\"lng\":-76.15206053318397},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:42:06', NULL, NULL, 1, NULL, NULL, 'C'),
(40, 8, 38, '[{\"lat\":-13.417702534694131,\"lng\":-76.15256066236635},{\"lat\":-13.418482796435097,\"lng\":-76.15255689472095},{\"lat\":-13.418641773655564,\"lng\":-76.15256326496736},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:43:14', NULL, NULL, 1, NULL, NULL, 'C'),
(41, 8, 39, '[{\"lat\":-13.417704789843706,\"lng\":-76.15355453231531},{\"lat\":-13.417543189414738,\"lng\":-76.15257767610662},{\"lat\":-13.418631407915258,\"lng\":-76.15254548959844},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:44:04', NULL, NULL, 1, NULL, NULL, 'C'),
(42, 8, 40, '[{\"lat\":-13.41631797563302,\"lng\":-76.15270985687364},{\"lat\":-13.416679004957176,\"lng\":-76.15261144937979},{\"lat\":-13.416956211809081,\"lng\":-76.15257591011034},{\"lat\":-13.417172106806252,\"lng\":-76.15256652237879},{\"lat\":-13.417544681881665,\"lng\":-76.15257188679682},{\"lat\":-13.418627236504236,\"lng\":-76.15255549483855},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:45:21', NULL, NULL, 1, NULL, NULL, 'C'),
(43, 8, 41, '[{\"lat\":-13.416449375984651,\"lng\":-76.1554683428218},{\"lat\":-13.416000625903115,\"lng\":-76.15439009479782},{\"lat\":-13.41530489995213,\"lng\":-76.1529561968373},{\"lat\":-13.41668702669508,\"lng\":-76.15261416067112},{\"lat\":-13.416951188517007,\"lng\":-76.15258063305843},{\"lat\":-13.417172518464096,\"lng\":-76.15256273168191},{\"lat\":-13.417542539599808,\"lng\":-76.15256675465099},{\"lat\":-13.41862726857303,\"lng\":-76.15256171040544},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:47:49', NULL, NULL, 1, NULL, NULL, 'C'),
(44, 8, 42, '[{\"lat\":-13.417302231591083,\"lng\":-76.1511559056006},{\"lat\":-13.417703691192246,\"lng\":-76.15257177668434},{\"lat\":-13.418510275927524,\"lng\":-76.1525555955644},{\"lat\":-13.418641377502441,\"lng\":-76.15256028943017},{\"lat\":-13.418638744527968,\"lng\":-76.15257416912958}]', '2025-02-07 23:48:51', NULL, NULL, 1, NULL, NULL, 'C'),
(45, 9, 43, '[{\"lat\":-13.41690392623234,\"lng\":-76.14802484866465},{\"lat\":-13.417771548331284,\"lng\":-76.14786731392377},{\"lat\":-13.417810575768458,\"lng\":-76.14785821873483}]', '2025-02-07 23:51:10', NULL, NULL, 1, NULL, NULL, 'C'),
(46, 9, 44, '[{\"lat\":-13.41425523502112,\"lng\":-76.14849549990548},{\"lat\":-13.414672680017723,\"lng\":-76.14848342996491},{\"lat\":-13.415333828955802,\"lng\":-76.148409669217},{\"lat\":-13.416466141740122,\"lng\":-76.14812937837495},{\"lat\":-13.416909261859619,\"lng\":-76.14801432513224},{\"lat\":-13.417810575768458,\"lng\":-76.14785821873483}]', '2025-02-07 23:53:05', NULL, NULL, 1, NULL, NULL, 'C'),
(47, 9, 45, '[{\"lat\":-13.416048345107448,\"lng\":-76.14516180518561},{\"lat\":-13.41615661916491,\"lng\":-76.14546891811781},{\"lat\":-13.415618464442844,\"lng\":-76.1457085126231},{\"lat\":-13.41535364889986,\"lng\":-76.14580641325215},{\"lat\":-13.414772146964674,\"lng\":-76.14601127990672},{\"lat\":-13.414739534113949,\"lng\":-76.14612795599886},{\"lat\":-13.414829545571223,\"lng\":-76.1461883057017},{\"lat\":-13.415010872897247,\"lng\":-76.14685885795542},{\"lat\":-13.415005126979715,\"lng\":-76.14693515882502},{\"lat\":-13.415186454173186,\"lng\":-76.14789270744333},{\"lat\":-13.415328645905433,\"lng\":-76.14839964494715},{\"lat\":-13.416039290369062,\"lng\":-76.14824944124231},{\"lat\":-13.41685480556474,\"lng\":-76.14804024718616},{\"lat\":-13.417810575768458,\"lng\":-76.14785821873483}]', '2025-02-07 23:58:25', NULL, NULL, 1, NULL, NULL, 'C'),
(48, 9, 46, '[{\"lat\":-13.417807830976205,\"lng\":-76.1478759569314},{\"lat\":-13.417806200354391,\"lng\":-76.14786791030436},{\"lat\":-13.417810575768458,\"lng\":-76.14785821873483}]', '2025-02-07 23:59:53', NULL, NULL, 1, NULL, NULL, 'C'),
(49, 9, 47, '[{\"lat\":-13.417668329433338,\"lng\":-76.14679260840332},{\"lat\":-13.417746599313304,\"lng\":-76.14736391892349},{\"lat\":-13.417810575768458,\"lng\":-76.14785821873483}]', '2025-02-08 00:00:43', NULL, NULL, 1, NULL, NULL, 'C'),
(50, 9, 48, '[{\"lat\":-13.418424646716032,\"lng\":-76.14622230274585},{\"lat\":-13.417608032018618,\"lng\":-76.14634836656955},{\"lat\":-13.41776085650352,\"lng\":-76.14735706430187},{\"lat\":-13.417810575768458,\"lng\":-76.14785821873483}]', '2025-02-08 00:01:43', NULL, NULL, 1, NULL, NULL, 'C'),
(51, 10, 49, '[{\"lat\":-13.419933947893377,\"lng\":-76.16435981461203},{\"lat\":-13.419419246720128,\"lng\":-76.16284777117065},{\"lat\":-13.418911062638568,\"lng\":-76.16139144798665},{\"lat\":-13.418605811442523,\"lng\":-76.16074503561406},{\"lat\":-13.41829366908919,\"lng\":-76.16019403181629},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:09:42', NULL, NULL, 1, NULL, NULL, 'C'),
(52, 10, 50, '[{\"lat\":-13.420477118400061,\"lng\":-76.16601048359009},{\"lat\":-13.420233179963658,\"lng\":-76.16526080617042},{\"lat\":-13.41994070763508,\"lng\":-76.16435126212835},{\"lat\":-13.41923433368655,\"lng\":-76.16236037003563},{\"lat\":-13.418903013091334,\"lng\":-76.16139881868428},{\"lat\":-13.41859645739188,\"lng\":-76.16074704189366},{\"lat\":-13.418290439057776,\"lng\":-76.160197741894},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:13:19', NULL, NULL, 1, NULL, NULL, 'C'),
(53, 10, 51, '[{\"lat\":-13.42110097370149,\"lng\":-76.16790350232328},{\"lat\":-13.420498303385976,\"lng\":-76.16602863822187},{\"lat\":-13.419946071971497,\"lng\":-76.16433169428247},{\"lat\":-13.418905285483511,\"lng\":-76.16139600505183},{\"lat\":-13.41859899968496,\"lng\":-76.16073916720616},{\"lat\":-13.418292043589163,\"lng\":-76.16020951884785},{\"lat\":-13.41821279551551,\"lng\":-76.1600304813961},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:47:09', NULL, NULL, 1, NULL, NULL, 'C'),
(54, 10, 52, '[{\"lat\":-13.419239251685408,\"lng\":-76.1623509795231},{\"lat\":-13.418912120719776,\"lng\":-76.16140374439358},{\"lat\":-13.418594461801202,\"lng\":-76.16073528081569},{\"lat\":-13.418278865644675,\"lng\":-76.16019494725158},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:48:45', NULL, NULL, 1, NULL, NULL, 'C'),
(55, 10, 53, '[{\"lat\":-13.421756060826775,\"lng\":-76.16987500441513},{\"lat\":-13.4215812609783,\"lng\":-76.16937074912033},{\"lat\":-13.421289197352705,\"lng\":-76.16851791961479},{\"lat\":-13.42111178820535,\"lng\":-76.16790369375038},{\"lat\":-13.420472592396337,\"lng\":-76.16598323209571},{\"lat\":-13.419453079156149,\"lng\":-76.16296836067191},{\"lat\":-13.418922151742613,\"lng\":-76.1614006095027},{\"lat\":-13.418585592725176,\"lng\":-76.16075285602561},{\"lat\":-13.418230770304572,\"lng\":-76.16010107923499},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:50:19', NULL, NULL, 1, NULL, NULL, 'C'),
(56, 10, 54, '[{\"lat\":-13.422134028787209,\"lng\":-76.17137949940093},{\"lat\":-13.421894005459931,\"lng\":-76.17024492498763},{\"lat\":-13.42127502201699,\"lng\":-76.16853537458992},{\"lat\":-13.4211080486956,\"lng\":-76.16792785424805},{\"lat\":-13.42075235250954,\"lng\":-76.16687117205015},{\"lat\":-13.420371521365794,\"lng\":-76.16565981421445},{\"lat\":-13.419947563844852,\"lng\":-76.16435760173772},{\"lat\":-13.419339672678014,\"lng\":-76.16265037569974},{\"lat\":-13.418920931301063,\"lng\":-76.16140717182134},{\"lat\":-13.418610654277087,\"lng\":-76.16074256270326},{\"lat\":-13.418244091438028,\"lng\":-76.16012029021181},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:51:40', NULL, NULL, 1, NULL, NULL, 'C'),
(57, 10, 55, '[{\"lat\":-13.423794599136347,\"lng\":-76.16943156315325},{\"lat\":-13.421744944533362,\"lng\":-76.16986277842284},{\"lat\":-13.42128509460739,\"lng\":-76.16853082258199},{\"lat\":-13.421093336181757,\"lng\":-76.16786295253728},{\"lat\":-13.419939360665442,\"lng\":-76.16438262704926},{\"lat\":-13.418894368586628,\"lng\":-76.1614002755344},{\"lat\":-13.418583131588706,\"lng\":-76.16072759281951},{\"lat\":-13.418249181086283,\"lng\":-76.16012342523891},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:52:52', NULL, NULL, 1, NULL, NULL, 'C'),
(58, 10, 56, '[{\"lat\":-13.42394023654972,\"lng\":-76.17104106417763},{\"lat\":-13.423951324494645,\"lng\":-76.17071919909584},{\"lat\":-13.423925235211664,\"lng\":-76.17036246529686},{\"lat\":-13.423860011991799,\"lng\":-76.16987832656967},{\"lat\":-13.423778252695357,\"lng\":-76.16942334901556},{\"lat\":-13.422586423563247,\"lng\":-76.16970171789262},{\"lat\":-13.421747249459749,\"lng\":-76.16986741556948},{\"lat\":-13.42158837251281,\"lng\":-76.16936160479823},{\"lat\":-13.4213002419484,\"lng\":-76.16853294901975},{\"lat\":-13.421104230976416,\"lng\":-76.1679067917759},{\"lat\":-13.420864858201627,\"lng\":-76.16718650087259},{\"lat\":-13.420703844909402,\"lng\":-76.16669057023702},{\"lat\":-13.420547807785008,\"lng\":-76.1662292777934},{\"lat\":-13.420397964150354,\"lng\":-76.16577700848981},{\"lat\":-13.420274117386914,\"lng\":-76.16537348923589},{\"lat\":-13.420103664365323,\"lng\":-76.1648496143997},{\"lat\":-13.419988497077563,\"lng\":-76.16451052286322},{\"lat\":-13.419544380226236,\"lng\":-76.16321127672877},{\"lat\":-13.419365744894774,\"lng\":-76.16270270292436},{\"lat\":-13.418907567057452,\"lng\":-76.16139716397643},{\"lat\":-13.418599045531701,\"lng\":-76.16073203308395},{\"lat\":-13.418278194218285,\"lng\":-76.16018102160243},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 00:54:52', NULL, NULL, 1, NULL, NULL, 'C'),
(59, 10, 57, '[{\"lat\":-13.418280934164581,\"lng\":-76.16029990188906},{\"lat\":-13.418266584720417,\"lng\":-76.16019907832134},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 01:01:11', NULL, NULL, 1, NULL, NULL, 'C'),
(60, 10, 58, '[{\"lat\":-13.417426839896217,\"lng\":-76.16199606688939},{\"lat\":-13.417546649232158,\"lng\":-76.16122990497932},{\"lat\":-13.417930171594564,\"lng\":-76.1607752705513},{\"lat\":-13.418148582189223,\"lng\":-76.16048003733036},{\"lat\":-13.418246419339548,\"lng\":-76.16024266183254},{\"lat\":-13.418273813734505,\"lng\":-76.16019572317478},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 01:03:01', NULL, NULL, 1, NULL, NULL, 'C'),
(61, 10, 59, '[{\"lat\":-13.417235446119829,\"lng\":-76.1637502742115},{\"lat\":-13.417480361826021,\"lng\":-76.16149478452444},{\"lat\":-13.417509060807424,\"lng\":-76.16132178204298},{\"lat\":-13.417541657602468,\"lng\":-76.16122368783553},{\"lat\":-13.417937436501148,\"lng\":-76.16077559816567},{\"lat\":-13.4181389811645,\"lng\":-76.1604738496515},{\"lat\":-13.418198335709498,\"lng\":-76.16031895208089},{\"lat\":-13.418278562159099,\"lng\":-76.16020361709325},{\"lat\":-13.418220058830505,\"lng\":-76.16001531792023}]', '2025-02-08 01:05:02', NULL, NULL, 1, NULL, NULL, 'C'),
(62, 11, 60, '[{\"lat\":-13.416799792110726,\"lng\":-76.16634296984638},{\"lat\":-13.416775658805314,\"lng\":-76.16648982078995},{\"lat\":-13.416762383533575,\"lng\":-76.16649798276468}]', '2025-02-08 01:06:51', NULL, NULL, 1, NULL, NULL, 'C'),
(63, 11, 61, '[{\"lat\":-13.416391080039519,\"lng\":-76.16858874522177},{\"lat\":-13.416633717874676,\"lng\":-76.16719399653402},{\"lat\":-13.416762383533575,\"lng\":-76.16649798276468}]', '2025-02-08 01:09:31', NULL, NULL, 1, NULL, NULL, 'C'),
(64, 12, NULL, '[{\"lat\":-13.424019208853661,\"lng\":-76.1347292327218},{\"lat\":-13.42404651171429,\"lng\":-76.13391411515984},{\"lat\":-13.423778623595043,\"lng\":-76.13260499392949},{\"lat\":-13.423989946834732,\"lng\":-76.13196126376592},{\"lat\":-13.423986825629685,\"lng\":-76.1314395067829},{\"lat\":-13.424028568470389,\"lng\":-76.13126248098791},{\"lat\":-13.424276742381059,\"lng\":-76.13064724982581},{\"lat\":-13.42440509284957,\"lng\":-76.13011064499436},{\"lat\":-13.424499196195985,\"lng\":-76.12946139829751},{\"lat\":-13.424531807721307,\"lng\":-76.12920927065011},{\"lat\":-13.424569637085108,\"lng\":-76.12884518145297},{\"lat\":-13.424561515825792,\"lng\":-76.12842284124947},{\"lat\":-13.424711559371906,\"lng\":-76.12787160992691},{\"lat\":-13.424778855201938,\"lng\":-76.12736787903923},{\"lat\":-13.424859273813807,\"lng\":-76.12704804252117},{\"lat\":-13.424963630522662,\"lng\":-76.12679248474109},{\"lat\":-13.425357522529884,\"lng\":-76.1261166062801},{\"lat\":-13.425412105620616,\"lng\":-76.12597955445516},{\"lat\":-13.425457761581177,\"lng\":-76.12569255809056},{\"lat\":-13.425684013414104,\"lng\":-76.12500752510519},{\"lat\":-13.426083186955916,\"lng\":-76.12367193510329},{\"lat\":-13.426477617065512,\"lng\":-76.1224381754657},{\"lat\":-13.426686329030638,\"lng\":-76.12227724292481},{\"lat\":-13.427356798768175,\"lng\":-76.12111132269887},{\"lat\":-13.427787265420436,\"lng\":-76.12036778844426},{\"lat\":-13.427959451865144,\"lng\":-76.11979111350605},{\"lat\":-13.428478619336975,\"lng\":-76.11993327058384},{\"lat\":-13.428610568851852,\"lng\":-76.1194211488241},{\"lat\":-13.42917378411,\"lng\":-76.11951404734667},{\"lat\":-13.42960107865801,\"lng\":-76.11960053244587},{\"lat\":-13.429820897004056,\"lng\":-76.11963540116307},{\"lat\":-13.430566853193568,\"lng\":-76.11977623351984},{\"lat\":-13.430869480326763,\"lng\":-76.1198318893569},{\"lat\":-13.430918396314613,\"lng\":-76.11964681693487},{\"lat\":-13.430990791958346,\"lng\":-76.11952075311117},{\"lat\":-13.431071014132618,\"lng\":-76.11948101007395},{\"lat\":-13.431171454865849,\"lng\":-76.11948235117846},{\"lat\":-13.431559077906948,\"lng\":-76.1195564073846},{\"lat\":-13.43189727296795,\"lng\":-76.11962941985479},{\"lat\":-13.432113756396067,\"lng\":-76.11967128636692},{\"lat\":-13.432306435949585,\"lng\":-76.11789199379334},{\"lat\":-13.432328102235441,\"lng\":-76.11771787852562},{\"lat\":-13.432353538395716,\"lng\":-76.11764679998673},{\"lat\":-13.43241484605301,\"lng\":-76.11760991961278},{\"lat\":-13.43324795491187,\"lng\":-76.11751275547361},{\"lat\":-13.433368613134304,\"lng\":-76.11743832417345},{\"lat\":-13.433516011745281,\"lng\":-76.11709902473306},{\"lat\":-13.433677130978003,\"lng\":-76.11674452566703},{\"lat\":-13.434007766837468,\"lng\":-76.11606290175179},{\"lat\":-13.434622630313305,\"lng\":-76.11654506047526},{\"lat\":-13.43485742329063,\"lng\":-76.11663634602778},{\"lat\":-13.435423521432588,\"lng\":-76.11684247795445},{\"lat\":-13.435415853803269,\"lng\":-76.1163225287491},{\"lat\":-13.43544911604569,\"lng\":-76.1161066109234},{\"lat\":-13.435718740743342,\"lng\":-76.11536404418294},{\"lat\":-13.436513331016847,\"lng\":-76.11561768866424}]', '2025-02-08 01:15:40', NULL, NULL, 1, NULL, NULL, 'S'),
(65, 13, 62, '[{\"lat\":-13.409028636830612,\"lng\":-76.16087181298752},{\"lat\":-13.409041356145236,\"lng\":-76.16085471390505},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-08 08:05:28', NULL, NULL, 1, NULL, NULL, 'C'),
(66, 13, 63, '[{\"lat\":-13.408237858157321,\"lng\":-76.1605273671672},{\"lat\":-13.409003005708671,\"lng\":-76.16084129361349},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-08 08:06:14', NULL, NULL, 1, NULL, NULL, 'C'),
(67, 13, 64, '[{\"lat\":-13.408015946371787,\"lng\":-76.16151107633004},{\"lat\":-13.40823675012918,\"lng\":-76.16051199235793},{\"lat\":-13.409054562128505,\"lng\":-76.16083752579134},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-08 08:07:02', NULL, NULL, 1, NULL, NULL, 'C'),
(68, 13, 65, '[{\"lat\":-13.409422152354585,\"lng\":-76.16009761098292},{\"lat\":-13.409202336760686,\"lng\":-76.1605441987839},{\"lat\":-13.409055575495566,\"lng\":-76.16082448962595},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-11 09:40:19', NULL, NULL, 1, NULL, NULL, 'C'),
(69, 13, 66, '[{\"lat\":-13.41132362413342,\"lng\":-76.1596894862375},{\"lat\":-13.411160557494952,\"lng\":-76.16031712314698},{\"lat\":-13.410695610483254,\"lng\":-76.15988608105086},{\"lat\":-13.410285985806754,\"lng\":-76.15945692760847},{\"lat\":-13.40970943356118,\"lng\":-76.15901576012348},{\"lat\":-13.409687507236859,\"lng\":-76.1592357012627},{\"lat\":-13.409615757441067,\"lng\":-76.15956829518055},{\"lat\":-13.409429585569047,\"lng\":-76.16008327931141},{\"lat\":-13.409049705301205,\"lng\":-76.16082021623825},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-11 09:42:28', NULL, NULL, 1, NULL, NULL, 'C'),
(70, 13, 67, '[{\"lat\":-13.410747565683629,\"lng\":-76.15863354300126},{\"lat\":-13.41143114146657,\"lng\":-76.15921424125298},{\"lat\":-13.411175387819977,\"lng\":-76.16032558583113},{\"lat\":-13.41068712480695,\"lng\":-76.15988332326272},{\"lat\":-13.41028066963535,\"lng\":-76.15944236180066},{\"lat\":-13.409741213825368,\"lng\":-76.15903760210216},{\"lat\":-13.40969457647096,\"lng\":-76.15902050301969},{\"lat\":-13.409683752292997,\"lng\":-76.15922648944125},{\"lat\":-13.409616039366579,\"lng\":-76.15957551732167},{\"lat\":-13.409426507822221,\"lng\":-76.16009907087128},{\"lat\":-13.409418354428553,\"lng\":-76.1600980650429},{\"lat\":-13.409050252264105,\"lng\":-76.16082993985694},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-11 09:44:13', NULL, NULL, 1, NULL, NULL, 'C'),
(71, 13, 68, '[{\"lat\":-13.407162581588983,\"lng\":-76.16069802397482},{\"lat\":-13.407620264460766,\"lng\":-76.16099398729848},{\"lat\":-13.408006095111622,\"lng\":-76.16146261603984},{\"lat\":-13.408237959511244,\"lng\":-76.16050298950624},{\"lat\":-13.409041953631657,\"lng\":-76.16084084595686},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-11 09:46:30', NULL, NULL, 1, NULL, NULL, 'C'),
(72, 13, 69, '[{\"lat\":-13.404948272558947,\"lng\":-76.1607125594199},{\"lat\":-13.40529898837186,\"lng\":-76.1593981035945},{\"lat\":-13.40619297392481,\"lng\":-76.1597799287202},{\"lat\":-13.406655965081239,\"lng\":-76.1599491517365},{\"lat\":-13.406660204894708,\"lng\":-76.16000179008842},{\"lat\":-13.40667292433466,\"lng\":-76.16004336432815},{\"lat\":-13.406758372862516,\"lng\":-76.16016708121896},{\"lat\":-13.40691883337476,\"lng\":-76.16037495241761},{\"lat\":-13.407161806913974,\"lng\":-76.16068742976785},{\"lat\":-13.40761896914468,\"lng\":-76.16099748190315},{\"lat\":-13.408004101484286,\"lng\":-76.16145390782505},{\"lat\":-13.4082399862902,\"lng\":-76.16050711085822},{\"lat\":-13.40904325731111,\"lng\":-76.16083038619816},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-11 09:48:27', NULL, NULL, 1, NULL, NULL, 'C'),
(73, 13, 70, '[{\"lat\":-13.404731463603946,\"lng\":-76.16155723399454},{\"lat\":-13.405299809910291,\"lng\":-76.15938199076675},{\"lat\":-13.40619571953794,\"lng\":-76.15977434275656},{\"lat\":-13.40665034741745,\"lng\":-76.15994177108517},{\"lat\":-13.406655360453328,\"lng\":-76.1600014788271},{\"lat\":-13.406671341288362,\"lng\":-76.1600464058281},{\"lat\":-13.407160804507843,\"lng\":-76.16068931215808},{\"lat\":-13.40762327228466,\"lng\":-76.1609925723578},{\"lat\":-13.408005616191433,\"lng\":-76.16145728200506},{\"lat\":-13.40823581498837,\"lng\":-76.16050382270662},{\"lat\":-13.409047732063021,\"lng\":-76.16083281643655},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-11 09:50:10', NULL, NULL, 1, NULL, NULL, 'C'),
(74, 13, 71, '[{\"lat\":-13.405513984315913,\"lng\":-76.16179537835924},{\"lat\":-13.404898159825338,\"lng\":-76.16090198872544},{\"lat\":-13.405301727168537,\"lng\":-76.15938774023786},{\"lat\":-13.406195075212699,\"lng\":-76.1597770791056},{\"lat\":-13.406651623353218,\"lng\":-76.15993826336312},{\"lat\":-13.406657856333249,\"lng\":-76.16000008755353},{\"lat\":-13.406676772423381,\"lng\":-76.16004635565903},{\"lat\":-13.407161660552456,\"lng\":-76.16068294637465},{\"lat\":-13.407619805981378,\"lng\":-76.16099659150603},{\"lat\":-13.408005078277144,\"lng\":-76.16145852841642},{\"lat\":-13.408237794155873,\"lng\":-76.1605016239007},{\"lat\":-13.40906226013356,\"lng\":-76.16084502097766}]', '2025-02-11 09:51:39', NULL, NULL, 1, NULL, NULL, 'C'),
(75, 14, 72, '[{\"lat\":-13.397604948039714,\"lng\":-76.15751040115717},{\"lat\":-13.397923271962883,\"lng\":-76.1565783335245},{\"lat\":-13.397947884875087,\"lng\":-76.15653437875416}]', '2025-02-11 09:56:44', NULL, NULL, 1, NULL, NULL, 'C'),
(76, 14, 73, '[{\"lat\":-13.39660425334889,\"lng\":-76.16043924379322},{\"lat\":-13.39688753942813,\"lng\":-76.15966027858438},{\"lat\":-13.396851010317462,\"lng\":-76.15947118284883},{\"lat\":-13.397171238826086,\"lng\":-76.15847467563118},{\"lat\":-13.397326395191621,\"lng\":-76.1582295375661},{\"lat\":-13.397621301922362,\"lng\":-76.1574958413115},{\"lat\":-13.397941120999171,\"lng\":-76.15656396958045},{\"lat\":-13.397947884875087,\"lng\":-76.15653437875416}]', '2025-02-11 09:58:25', NULL, NULL, 1, NULL, NULL, 'C'),
(77, 15, 74, '[{\"lat\":-13.42859813030849,\"lng\":-76.11941242866365},{\"lat\":-13.428523650855636,\"lng\":-76.11986385407374},{\"lat\":-13.428476038819085,\"lng\":-76.11992252739594},{\"lat\":-13.42843005732276,\"lng\":-76.11994230868743},{\"lat\":-13.427970413275554,\"lng\":-76.1197882671493},{\"lat\":-13.427942367765842,\"lng\":-76.11979530794797},{\"lat\":-13.427927366677919,\"lng\":-76.11981341285882},{\"lat\":-13.427897565650667,\"lng\":-76.11990566393136},{\"lat\":-13.427800600290544,\"lng\":-76.12036650233375},{\"lat\":-13.427335017187007,\"lng\":-76.12110378851395},{\"lat\":-13.427077668001822,\"lng\":-76.12161311300524},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-11 10:21:37', NULL, NULL, 1, NULL, NULL, 'C'),
(78, 15, 75, '[{\"lat\":-13.428736344242354,\"lng\":-76.11818842081185},{\"lat\":-13.428641772463504,\"lng\":-76.11897020152408},{\"lat\":-13.428525773427909,\"lng\":-76.11987361233308},{\"lat\":-13.428475552512822,\"lng\":-76.1199212215431},{\"lat\":-13.428428592686592,\"lng\":-76.11993798534944},{\"lat\":-13.427967283187613,\"lng\":-76.11978741664241},{\"lat\":-13.427932063244219,\"lng\":-76.11979278106044},{\"lat\":-13.427918366598153,\"lng\":-76.11981893259833},{\"lat\":-13.42789227774638,\"lng\":-76.11990677494357},{\"lat\":-13.42779705341329,\"lng\":-76.1203662331435},{\"lat\":-13.427339636167453,\"lng\":-76.12110495826089},{\"lat\":-13.42707491362559,\"lng\":-76.12161689746519},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-11 10:22:46', NULL, NULL, 1, NULL, NULL, 'C'),
(79, 15, 76, '[{\"lat\":-13.428892355661405,\"lng\":-76.11687041193359},{\"lat\":-13.428813157452092,\"lng\":-76.11755992456489},{\"lat\":-13.428739506708396,\"lng\":-76.11818963769974},{\"lat\":-13.428645310210047,\"lng\":-76.1189638943955},{\"lat\":-13.428591828222856,\"lng\":-76.11940338724429},{\"lat\":-13.428548952263581,\"lng\":-76.119770104769},{\"lat\":-13.428519667223707,\"lng\":-76.11987149213937},{\"lat\":-13.42847564239498,\"lng\":-76.11992480104354},{\"lat\":-13.428431943668114,\"lng\":-76.119939217917},{\"lat\":-13.427972346683973,\"lng\":-76.1197835426026},{\"lat\":-13.427938431183732,\"lng\":-76.11979863002831},{\"lat\":-13.427924082316803,\"lng\":-76.11981707021529},{\"lat\":-13.427895058469703,\"lng\":-76.11990692421729},{\"lat\":-13.427799407569385,\"lng\":-76.12036329580371},{\"lat\":-13.427332296225899,\"lng\":-76.12110376918173},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-11 10:24:32', NULL, NULL, 1, NULL, NULL, 'C'),
(80, 15, 77, '[{\"lat\":-13.429423874737077,\"lng\":-76.11445473816414},{\"lat\":-13.42911871326163,\"lng\":-76.11496059134022},{\"lat\":-13.428895573922109,\"lng\":-76.1168703592194},{\"lat\":-13.428637950978239,\"lng\":-76.11896497079864},{\"lat\":-13.428546390516715,\"lng\":-76.11976976033512},{\"lat\":-13.428518018964512,\"lng\":-76.11986799624029},{\"lat\":-13.428474588036117,\"lng\":-76.11992795070864},{\"lat\":-13.42842893264944,\"lng\":-76.11994002064921},{\"lat\":-13.427963890547705,\"lng\":-76.11978849452696},{\"lat\":-13.427937097441193,\"lng\":-76.11979876057461},{\"lat\":-13.427929596897187,\"lng\":-76.11981653020933},{\"lat\":-13.427893398616265,\"lng\":-76.11990772531584},{\"lat\":-13.427795707289778,\"lng\":-76.12036449072745},{\"lat\":-13.42733259954788,\"lng\":-76.12110155537432},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-11 10:26:29', NULL, NULL, 1, NULL, NULL, 'C'),
(83, 14, 80, '[{\"lat\":-13.39455892975187,\"lng\":-76.16637019539583},{\"lat\":-13.394930094886579,\"lng\":-76.16571211438114},{\"lat\":-13.39576874225265,\"lng\":-76.16424557554123},{\"lat\":-13.395811794611888,\"lng\":-76.16441589581368},{\"lat\":-13.39656750053246,\"lng\":-76.16250680546261},{\"lat\":-13.396688829485953,\"lng\":-76.1623881177137},{\"lat\":-13.397301477047575,\"lng\":-76.1607705696325},{\"lat\":-13.397233637382923,\"lng\":-76.16076319355771},{\"lat\":-13.396741618404429,\"lng\":-76.16056688362839},{\"lat\":-13.39660137259636,\"lng\":-76.16042539710286},{\"lat\":-13.396884993048776,\"lng\":-76.1596572686099},{\"lat\":-13.396848463937713,\"lng\":-76.15946414956083},{\"lat\":-13.397174747844105,\"lng\":-76.15847428210463},{\"lat\":-13.397318907143912,\"lng\":-76.15823154218879},{\"lat\":-13.397947884875087,\"lng\":-76.15653437875416}]', '2025-02-11 10:57:54', NULL, NULL, 1, NULL, NULL, 'C');
INSERT INTO `tb_lineas` (`id_linea`, `id_mufa`, `id_caja`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`, `tipo_linea`) VALUES
(89, 17, 85, '[{\"lat\":-13.410428685730011,\"lng\":-76.13645358605973},{\"lat\":-13.40935254503368,\"lng\":-76.13780783304668},{\"lat\":-13.408886852915433,\"lng\":-76.13858199315042},{\"lat\":-13.408625943595222,\"lng\":-76.13880857991195},{\"lat\":-13.408396343159128,\"lng\":-76.13914653824783},{\"lat\":-13.40797366905551,\"lng\":-76.13981709050155},{\"lat\":-13.407525750551915,\"lng\":-76.1405234513806},{\"lat\":-13.406711707926325,\"lng\":-76.14107598643767},{\"lat\":-13.405464580294257,\"lng\":-76.14032696346706},{\"lat\":-13.404759528268372,\"lng\":-76.13979288880893},{\"lat\":-13.403366245294665,\"lng\":-76.13905259912082},{\"lat\":-13.399984760908442,\"lng\":-76.13808353113026},{\"lat\":-13.399609037486028,\"lng\":-76.13951046632619},{\"lat\":-13.397451471867047,\"lng\":-76.1389207774479},{\"lat\":-13.396481312431991,\"lng\":-76.13858343011884}]', '2025-02-12 12:38:42', NULL, NULL, 1, NULL, NULL, 'C'),
(90, 19, 86, '[{\"lat\":-13.403658973870964,\"lng\":-76.1589563391492},{\"lat\":-13.40370202481783,\"lng\":-76.15886112072917},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 08:41:42', NULL, NULL, 1, NULL, NULL, 'C'),
(91, 19, 87, '[{\"lat\":-13.40285406866261,\"lng\":-76.16078167526226},{\"lat\":-13.402994963113546,\"lng\":-76.16044237582187},{\"lat\":-13.403525750774081,\"lng\":-76.15921452895783},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 08:42:38', NULL, NULL, 1, NULL, NULL, 'C'),
(92, 19, 88, '[{\"lat\":-13.401873197628264,\"lng\":-76.16272704243768},{\"lat\":-13.401035734451654,\"lng\":-76.16154327680468},{\"lat\":-13.40192839719507,\"lng\":-76.161315688678},{\"lat\":-13.402426884512135,\"lng\":-76.16118704071432},{\"lat\":-13.40249700572793,\"lng\":-76.1611445849007},{\"lat\":-13.402613113370535,\"lng\":-76.16103159684594},{\"lat\":-13.40283054353995,\"lng\":-76.16082309917003},{\"lat\":-13.403281514989082,\"lng\":-76.15974442471736},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 08:45:01', NULL, NULL, 1, NULL, NULL, 'C'),
(93, 19, 89, '[{\"lat\":-13.402989281279115,\"lng\":-76.16437573274656},{\"lat\":-13.402318773466472,\"lng\":-76.16340652706145},{\"lat\":-13.402151240950007,\"lng\":-76.16316001018264},{\"lat\":-13.401032502228544,\"lng\":-76.16154223394342},{\"lat\":-13.402352000883731,\"lng\":-76.16121274326122},{\"lat\":-13.40242734044521,\"lng\":-76.16118592117107},{\"lat\":-13.402497145875689,\"lng\":-76.16114324226692},{\"lat\":-13.402829267380412,\"lng\":-76.16082260934304},{\"lat\":-13.403279509683461,\"lng\":-76.15974308455715},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 08:49:13', NULL, NULL, 1, NULL, NULL, 'C'),
(94, 19, 90, '[{\"lat\":-13.404114678325497,\"lng\":-76.16420603301982},{\"lat\":-13.403088880528577,\"lng\":-76.16450653152896},{\"lat\":-13.402196939429851,\"lng\":-76.16321667887294},{\"lat\":-13.401035650094336,\"lng\":-76.16153785950048},{\"lat\":-13.402424324675067,\"lng\":-76.16119297330054},{\"lat\":-13.402496728907616,\"lng\":-76.1611487168518},{\"lat\":-13.402827483262831,\"lng\":-76.16082322343068},{\"lat\":-13.403283645558542,\"lng\":-76.15974773832319},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 09:39:22', NULL, NULL, 1, NULL, NULL, 'C'),
(95, 19, 91, '[{\"lat\":-13.404302752364682,\"lng\":-76.16625545461156},{\"lat\":-13.404140104618635,\"lng\":-76.16604366034285},{\"lat\":-13.403745846903208,\"lng\":-76.16546669649058},{\"lat\":-13.403086257569772,\"lng\":-76.1645138817766},{\"lat\":-13.401034889968292,\"lng\":-76.16153967966835},{\"lat\":-13.402424188945302,\"lng\":-76.16119033274221},{\"lat\":-13.402495940887611,\"lng\":-76.16114842322635},{\"lat\":-13.402827241185317,\"lng\":-76.16082179221644},{\"lat\":-13.403278711864832,\"lng\":-76.15973905651366},{\"lat\":-13.403417750383909,\"lng\":-76.15946200903424},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 09:44:43', NULL, NULL, 1, NULL, NULL, 'C'),
(96, 19, 92, '[{\"lat\":-13.407496203530949,\"lng\":-76.16551888676972},{\"lat\":-13.40746840184402,\"lng\":-76.16544997469312},{\"lat\":-13.407357514763133,\"lng\":-76.16524310932284},{\"lat\":-13.407343816943696,\"lng\":-76.16522835717326},{\"lat\":-13.407236303885783,\"lng\":-76.16516826960472},{\"lat\":-13.40713494607605,\"lng\":-76.16517899844078},{\"lat\":-13.406942137956522,\"lng\":-76.16534072485808},{\"lat\":-13.40620928645755,\"lng\":-76.16554960070567},{\"lat\":-13.405907853046486,\"lng\":-76.16573992853404},{\"lat\":-13.404303646595645,\"lng\":-76.16625187757464},{\"lat\":-13.40414231720127,\"lng\":-76.16604300620168},{\"lat\":-13.40298252250444,\"lng\":-76.1643608372041},{\"lat\":-13.401030325775153,\"lng\":-76.16154217605084},{\"lat\":-13.402421681822135,\"lng\":-76.16119067904185},{\"lat\":-13.402494086055487,\"lng\":-76.16114809897374},{\"lat\":-13.40282562534647,\"lng\":-76.16082189606307},{\"lat\":-13.403279242576815,\"lng\":-76.15974125506328},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 09:48:16', NULL, NULL, 1, NULL, NULL, 'C'),
(97, 19, 93, '[{\"lat\":-13.402824839429512,\"lng\":-76.16621601026819},{\"lat\":-13.403122609354009,\"lng\":-76.16662119174306},{\"lat\":-13.404140214760126,\"lng\":-76.16604213527414},{\"lat\":-13.403564243233456,\"lng\":-76.16520662898468},{\"lat\":-13.40243669067037,\"lng\":-76.16357425643432},{\"lat\":-13.401032706524424,\"lng\":-76.16154039947826},{\"lat\":-13.402428499030481,\"lng\":-76.16118943221144},{\"lat\":-13.402495132243596,\"lng\":-76.16114314044498},{\"lat\":-13.402825322651147,\"lng\":-76.1608206409405},{\"lat\":-13.403281985909869,\"lng\":-76.15974070266397},{\"lat\":-13.403743713169362,\"lng\":-76.15877517687947}]', '2025-02-13 09:50:57', NULL, NULL, 1, NULL, NULL, 'C'),
(98, 20, 94, '[{\"lat\":-13.435243310619711,\"lng\":-76.11686904987705},{\"lat\":-13.435237825701359,\"lng\":-76.11684596081041},{\"lat\":-13.435252174130873,\"lng\":-76.11679902215265},{\"lat\":-13.434624755638298,\"lng\":-76.11655404103058},{\"lat\":-13.434411463009098,\"lng\":-76.11637908656142}]', '2025-02-13 12:41:07', NULL, NULL, 1, NULL, NULL, 'C'),
(108, 22, 105, '[{\"lat\":-13.392357318711122,\"lng\":-76.14919365275274},{\"lat\":-13.391672384066993,\"lng\":-76.14816502559553},{\"lat\":-13.391682821180954,\"lng\":-76.14810333478819},{\"lat\":-13.392078040385963,\"lng\":-76.14764404111857},{\"lat\":-13.39271470243629,\"lng\":-76.14705127292628},{\"lat\":-13.393677520123987,\"lng\":-76.14609673124754},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 14:34:21', NULL, NULL, 1, NULL, NULL, 'C'),
(109, 22, 106, '[{\"lat\":-13.39215024329061,\"lng\":-76.1474990792468},{\"lat\":-13.392687874564317,\"lng\":-76.14699542018141},{\"lat\":-13.393251634267804,\"lng\":-76.14637210161308},{\"lat\":-13.393598646505064,\"lng\":-76.14605830297937},{\"lat\":-13.393787553188144,\"lng\":-76.14584654437526},{\"lat\":-13.393906274289247,\"lng\":-76.14574730264171},{\"lat\":-13.393933671458093,\"lng\":-76.14571779834255},{\"lat\":-13.394011949066222,\"lng\":-76.14575132595523},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 14:35:41', NULL, NULL, 1, NULL, NULL, 'C'),
(110, 22, 107, '[{\"lat\":-13.390181474676144,\"lng\":-76.14618980380452},{\"lat\":-13.39073464451939,\"lng\":-76.14679061862385},{\"lat\":-13.391024275392459,\"lng\":-76.1471232125417},{\"lat\":-13.39135043586829,\"lng\":-76.14754431935704},{\"lat\":-13.39165050311565,\"lng\":-76.1479332396642},{\"lat\":-13.391904282581207,\"lng\":-76.14775815724214},{\"lat\":-13.392006044324999,\"lng\":-76.14765086888154},{\"lat\":-13.392066057640921,\"lng\":-76.14759454249223},{\"lat\":-13.392425406741244,\"lng\":-76.1472707461019},{\"lat\":-13.392942670783269,\"lng\":-76.14674010872949},{\"lat\":-13.39319055080916,\"lng\":-76.14644774794687},{\"lat\":-13.393538568464967,\"lng\":-76.14609998777057},{\"lat\":-13.393627283231256,\"lng\":-76.14601683929111},{\"lat\":-13.393765573831105,\"lng\":-76.14585590675021},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 14:37:44', NULL, NULL, 1, NULL, NULL, 'C'),
(111, 22, 108, '[{\"lat\":-13.382913879741157,\"lng\":-76.15373396245266},{\"lat\":-13.383360082192796,\"lng\":-76.15344696608807},{\"lat\":-13.384017299595657,\"lng\":-76.1530204948547},{\"lat\":-13.384646154901606,\"lng\":-76.15263962117459},{\"lat\":-13.385158975085023,\"lng\":-76.15230685758978},{\"lat\":-13.385646922881874,\"lng\":-76.1518964796105},{\"lat\":-13.385772171354743,\"lng\":-76.15180796671301},{\"lat\":-13.388135472151077,\"lng\":-76.15014928722253},{\"lat\":-13.38892870317903,\"lng\":-76.14965576076379},{\"lat\":-13.38973236879154,\"lng\":-76.14914077663293},{\"lat\":-13.389976406039395,\"lng\":-76.14897860425792},{\"lat\":-13.390130354509331,\"lng\":-76.14901615518413},{\"lat\":-13.390333728418902,\"lng\":-76.14891289013705},{\"lat\":-13.390548995000195,\"lng\":-76.14877341526828},{\"lat\":-13.390965579886624,\"lng\":-76.14850550271676},{\"lat\":-13.391387078229338,\"lng\":-76.14822915757831},{\"lat\":-13.391612780985476,\"lng\":-76.14807493055996},{\"lat\":-13.391945689728027,\"lng\":-76.14782255984105},{\"lat\":-13.392292283765956,\"lng\":-76.14754496908641},{\"lat\":-13.392694581880301,\"lng\":-76.14715182750892},{\"lat\":-13.393091859425494,\"lng\":-76.14675441588656},{\"lat\":-13.393274507777146,\"lng\":-76.14659080113665},{\"lat\":-13.393650241093182,\"lng\":-76.14620456303851},{\"lat\":-13.393900729644583,\"lng\":-76.14594707097308},{\"lat\":-13.394007709050609,\"lng\":-76.14582100714938},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 14:40:21', NULL, NULL, 1, NULL, NULL, 'C'),
(112, 22, 109, '[{\"lat\":-13.396014657430712,\"lng\":-76.14571585118601},{\"lat\":-13.395121664334416,\"lng\":-76.14467718427753},{\"lat\":-13.394708711536909,\"lng\":-76.14497616468611},{\"lat\":-13.394366900117426,\"lng\":-76.14529534755889},{\"lat\":-13.394121630555365,\"lng\":-76.1455152886981},{\"lat\":-13.393993777173874,\"lng\":-76.14568158565703},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 14:45:03', NULL, NULL, 1, NULL, NULL, 'C'),
(113, 22, 110, '[{\"lat\":-13.394165693922226,\"lng\":-76.14342823237017},{\"lat\":-13.394437055926486,\"lng\":-76.14388957232073},{\"lat\":-13.394739728570174,\"lng\":-76.1443348190172},{\"lat\":-13.394922375670964,\"lng\":-76.14457085341051},{\"lat\":-13.394969342045895,\"lng\":-76.14465668409899},{\"lat\":-13.394930564238553,\"lng\":-76.14485442570925},{\"lat\":-13.39425737854665,\"lng\":-76.14542841843844},{\"lat\":-13.394090386455558,\"lng\":-76.14557862214328},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 14:46:26', NULL, NULL, 1, NULL, NULL, 'C'),
(114, 22, 111, '[{\"lat\":-13.392717789317453,\"lng\":-76.14246822882725},{\"lat\":-13.392814332184969,\"lng\":-76.14257819939687},{\"lat\":-13.393400015882307,\"lng\":-76.14205255211232},{\"lat\":-13.39344959181369,\"lng\":-76.14208205641148},{\"lat\":-13.393697471317399,\"lng\":-76.14242269695637},{\"lat\":-13.393796623047372,\"lng\":-76.14256217182515},{\"lat\":-13.39395839683489,\"lng\":-76.14270969332097},{\"lat\":-13.39366616023628,\"lng\":-76.1430208295667},{\"lat\":-13.393923294136105,\"lng\":-76.14335602876443},{\"lat\":-13.394272933936948,\"lng\":-76.14363229629296},{\"lat\":-13.394604191220921,\"lng\":-76.14416325311616},{\"lat\":-13.39492773760125,\"lng\":-76.14462459306672},{\"lat\":-13.3946824686109,\"lng\":-76.14497864465669},{\"lat\":-13.394210194638024,\"lng\":-76.14542120914415},{\"lat\":-13.394015522642924,\"lng\":-76.14570146426104},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 14:48:04', NULL, NULL, 1, NULL, NULL, 'C'),
(115, 22, 112, '[{\"lat\":-13.396624058656938,\"lng\":-76.14211366405553},{\"lat\":-13.396321388383843,\"lng\":-76.14230410089559},{\"lat\":-13.396183099253028,\"lng\":-76.14242211809224},{\"lat\":-13.396021326961362,\"lng\":-76.14256159296102},{\"lat\":-13.395569567956947,\"lng\":-76.14291126256958},{\"lat\":-13.395431278393971,\"lng\":-76.14298100000397},{\"lat\":-13.395136517019962,\"lng\":-76.14256525760666},{\"lat\":-13.39494604235272,\"lng\":-76.14276374107376},{\"lat\":-13.39471903810031,\"lng\":-76.14297295337693},{\"lat\":-13.39437794324972,\"lng\":-76.14329700889114},{\"lat\":-13.394229215998743,\"lng\":-76.14340697946075},{\"lat\":-13.394182249479355,\"lng\":-76.143452577014},{\"lat\":-13.39466615440688,\"lng\":-76.14423913741582},{\"lat\":-13.394900986439945,\"lng\":-76.14456100249761},{\"lat\":-13.394976654490652,\"lng\":-76.14467901969427},{\"lat\":-13.394945343576001,\"lng\":-76.1448640921163},{\"lat\":-13.394340429799847,\"lng\":-76.14537326839245},{\"lat\":-13.394129080488018,\"lng\":-76.14555565860546},{\"lat\":-13.394063849181437,\"lng\":-76.14566294696606},{\"lat\":-13.394009271568539,\"lng\":-76.14575381259645}]', '2025-02-14 15:00:28', NULL, NULL, 1, NULL, NULL, 'C'),
(116, 17, 113, '[{\"lat\":-13.395425260363789,\"lng\":-76.1382694702351},{\"lat\":-13.395970590456935,\"lng\":-76.13842503835797},{\"lat\":-13.396226295050994,\"lng\":-76.13850550462841},{\"lat\":-13.396346319562642,\"lng\":-76.13854841997265},{\"lat\":-13.396481312431991,\"lng\":-76.13858343011884}]', '2025-02-14 15:01:52', NULL, NULL, 1, NULL, NULL, 'C'),
(117, 18, 114, '[{\"lat\":-13.398209009332751,\"lng\":-76.13152126590919},{\"lat\":-13.398312073013205,\"lng\":-76.13154004137229},{\"lat\":-13.398364257138368,\"lng\":-76.13155345241736},{\"lat\":-13.398415136649488,\"lng\":-76.13156686346244},{\"lat\":-13.398442409195512,\"lng\":-76.13165742273162}]', '2025-02-14 15:21:56', NULL, NULL, 1, NULL, NULL, 'C'),
(118, 18, 115, '[{\"lat\":-13.401223282278917,\"lng\":-76.13245144628341},{\"lat\":-13.400816250640991,\"lng\":-76.13232940577323},{\"lat\":-13.400540982059454,\"lng\":-76.13209471248443},{\"lat\":-13.400036742949288,\"lng\":-76.13197648977669},{\"lat\":-13.399530898278798,\"lng\":-76.1318597479639},{\"lat\":-13.399238668449513,\"lng\":-76.13179403384304},{\"lat\":-13.398628733339502,\"lng\":-76.13164207477551},{\"lat\":-13.398480008716477,\"lng\":-76.13159647722226},{\"lat\":-13.398442409195512,\"lng\":-76.13165742273162}]', '2025-02-14 15:24:30', NULL, NULL, 1, NULL, NULL, 'C'),
(119, 18, 116, '[{\"lat\":-13.395916998768953,\"lng\":-76.13236489951917},{\"lat\":-13.395945700324951,\"lng\":-76.13227638662168},{\"lat\":-13.3963526520099,\"lng\":-76.1323869129435},{\"lat\":-13.396608356197856,\"lng\":-76.1324593325869},{\"lat\":-13.396864060114021,\"lng\":-76.13252907002129},{\"lat\":-13.396999739632633,\"lng\":-76.13204627239861},{\"lat\":-13.397310236704595,\"lng\":-76.13144545757928},{\"lat\":-13.398025927390009,\"lng\":-76.13161711895623},{\"lat\":-13.398127686544639,\"lng\":-76.13165198767342},{\"lat\":-13.398255921316583,\"lng\":-76.13168646207099},{\"lat\":-13.398442409195512,\"lng\":-76.13165742273162}]', '2025-02-14 15:41:14', NULL, NULL, 1, NULL, NULL, 'C'),
(120, 18, 117, '[{\"lat\":-13.394343708007403,\"lng\":-76.1317754618287},{\"lat\":-13.394378680052045,\"lng\":-76.13170222272481},{\"lat\":-13.39473353768191,\"lng\":-76.13188729514684},{\"lat\":-13.395158844298756,\"lng\":-76.13203749885167},{\"lat\":-13.395751381535865,\"lng\":-76.1322159275109},{\"lat\":-13.395934027868641,\"lng\":-76.13227225390021},{\"lat\":-13.396609818094166,\"lng\":-76.13245464411322},{\"lat\":-13.396849361190037,\"lng\":-76.13251901712958},{\"lat\":-13.397005914483524,\"lng\":-76.13205231276099},{\"lat\":-13.397311193112756,\"lng\":-76.13146759119574},{\"lat\":-13.398257570058776,\"lng\":-76.13170079259417},{\"lat\":-13.398442409195512,\"lng\":-76.13165742273162}]', '2025-02-14 15:46:00', NULL, NULL, 1, NULL, NULL, 'C'),
(121, 18, 118, '[{\"lat\":-13.397598003746221,\"lng\":-76.13025553839137},{\"lat\":-13.397313599220846,\"lng\":-76.1312881888621},{\"lat\":-13.398117323271672,\"lng\":-76.1314988755617},{\"lat\":-13.398396508435583,\"lng\":-76.13154447311496},{\"lat\":-13.398442409195512,\"lng\":-76.13165742273162}]', '2025-02-14 15:47:47', NULL, NULL, 1, NULL, NULL, 'C'),
(122, 18, 119, '[{\"lat\":-13.39545694762725,\"lng\":-76.12974567786583},{\"lat\":-13.396116141803624,\"lng\":-76.13001209827239},{\"lat\":-13.39644751383108,\"lng\":-76.13014620872313},{\"lat\":-13.39658462172807,\"lng\":-76.13013767644874},{\"lat\":-13.396831452060221,\"lng\":-76.13021572834515},{\"lat\":-13.397301111669984,\"lng\":-76.13034715658688},{\"lat\":-13.397408089563985,\"lng\":-76.13037934309506},{\"lat\":-13.39751767662559,\"lng\":-76.13050272470974},{\"lat\":-13.397329813060859,\"lng\":-76.13125910765194},{\"lat\":-13.397606389924611,\"lng\":-76.13135030275845},{\"lat\":-13.397934708507133,\"lng\":-76.13144069979518},{\"lat\":-13.398091261094255,\"lng\":-76.13148629734843},{\"lat\":-13.398360009464552,\"lng\":-76.13154530594676},{\"lat\":-13.398442409195512,\"lng\":-76.13165742273162}]', '2025-02-14 15:51:51', NULL, NULL, 1, NULL, NULL, 'C'),
(123, 23, 120, '[{\"lat\":-13.384852778081553,\"lng\":-76.1198469314674},{\"lat\":-13.384955847482045,\"lng\":-76.11991398669278},{\"lat\":-13.385053698137886,\"lng\":-76.11999579406773},{\"lat\":-13.385175032895903,\"lng\":-76.12010844684636},{\"lat\":-13.385255922700601,\"lng\":-76.12016209102666},{\"lat\":-13.385279406832373,\"lng\":-76.12018086648976},{\"lat\":-13.385348554540366,\"lng\":-76.12018623090779},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:07:39', NULL, NULL, 1, NULL, NULL, 'C'),
(124, 23, 121, '[{\"lat\":-13.385071963589239,\"lng\":-76.12044506407773},{\"lat\":-13.385103275788335,\"lng\":-76.12038739658391},{\"lat\":-13.385190688989256,\"lng\":-76.12028279043233},{\"lat\":-13.38523896193736,\"lng\":-76.12021171189343},{\"lat\":-13.385263750744784,\"lng\":-76.12017952538525},{\"lat\":-13.385357687255038,\"lng\":-76.1201875720123},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:08:33', NULL, NULL, 1, NULL, NULL, 'C'),
(125, 23, 122, '[{\"lat\":-13.384538315093698,\"lng\":-76.12127313935997},{\"lat\":-13.384720264622842,\"lng\":-76.12111910855286},{\"lat\":-13.38478680313825,\"lng\":-76.12106278216355},{\"lat\":-13.38486247436871,\"lng\":-76.12099840914719},{\"lat\":-13.38490944270669,\"lng\":-76.12078919684403},{\"lat\":-13.384939450251148,\"lng\":-76.12063496982567},{\"lat\":-13.38499424662705,\"lng\":-76.12055450355523},{\"lat\":-13.385079050517552,\"lng\":-76.12044453298562},{\"lat\":-13.38520429928582,\"lng\":-76.12027421271317},{\"lat\":-13.38523169744519,\"lng\":-76.12024068510048},{\"lat\":-13.38526300962351,\"lng\":-76.1201897231292},{\"lat\":-13.385287798428456,\"lng\":-76.1201897231292},{\"lat\":-13.385343899398666,\"lng\":-76.12019776975625},{\"lat\":-13.385398695682527,\"lng\":-76.1201897231292},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:15:42', NULL, NULL, 1, NULL, NULL, 'C'),
(126, 23, 123, '[{\"lat\":-13.38351124725254,\"lng\":-76.12220528575334},{\"lat\":-13.383960057959468,\"lng\":-76.12181368323716},{\"lat\":-13.384299274799195,\"lng\":-76.12150522920045},{\"lat\":-13.384458445613115,\"lng\":-76.12134966107759},{\"lat\":-13.384604569546385,\"lng\":-76.12122896167192},{\"lat\":-13.384848498383114,\"lng\":-76.12099682248025},{\"lat\":-13.385031152989939,\"lng\":-76.12051670706659},{\"lat\":-13.385093713110454,\"lng\":-76.1204362931707},{\"lat\":-13.385160251522656,\"lng\":-76.12034375695968},{\"lat\":-13.385199391756533,\"lng\":-76.12028474836136},{\"lat\":-13.385267234813528,\"lng\":-76.12019623546387},{\"lat\":-13.385352038607886,\"lng\":-76.12019221215034},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:18:18', NULL, NULL, 1, NULL, NULL, 'C'),
(127, 23, 124, '[{\"lat\":-13.38379789722049,\"lng\":-76.12284394206162},{\"lat\":-13.383489992083348,\"lng\":-76.12313898505326},{\"lat\":-13.383376484581792,\"lng\":-76.12301426233407},{\"lat\":-13.383212094312249,\"lng\":-76.12280907334443},{\"lat\":-13.383099860849956,\"lng\":-76.12268294678621},{\"lat\":-13.383052892159025,\"lng\":-76.12263600812845},{\"lat\":-13.38316379044236,\"lng\":-76.12252871976786},{\"lat\":-13.38331774326869,\"lng\":-76.12239460931711},{\"lat\":-13.383452125740016,\"lng\":-76.12226049886637},{\"lat\":-13.383519969289296,\"lng\":-76.12220417247705},{\"lat\":-13.383752202832516,\"lng\":-76.12199093686037},{\"lat\":-13.383915288052028,\"lng\":-76.12184743867807},{\"lat\":-13.384292152359468,\"lng\":-76.12150648705133},{\"lat\":-13.384545240729214,\"lng\":-76.12127154139307},{\"lat\":-13.384844011783219,\"lng\":-76.12100847504732},{\"lat\":-13.38492490169912,\"lng\":-76.12072416089174},{\"lat\":-13.38494447183599,\"lng\":-76.12063698909876},{\"lat\":-13.385008400938663,\"lng\":-76.12054042957422},{\"lat\":-13.38512348782397,\"lng\":-76.120389753919},{\"lat\":-13.385263087983663,\"lng\":-76.12019529376542},{\"lat\":-13.38530533450394,\"lng\":-76.12018833282681},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:20:15', NULL, NULL, 1, NULL, NULL, 'C'),
(128, 23, 125, '[{\"lat\":-13.38332694023409,\"lng\":-76.12416196595733},{\"lat\":-13.382940753311848,\"lng\":-76.12373817693297},{\"lat\":-13.382906831458007,\"lng\":-76.12366307508056},{\"lat\":-13.383068612564147,\"lng\":-76.12351555358474},{\"lat\":-13.38325648726068,\"lng\":-76.12335730325286},{\"lat\":-13.383428705603741,\"lng\":-76.12319637071197},{\"lat\":-13.38353308029717,\"lng\":-76.12311590444152},{\"lat\":-13.38347868607682,\"lng\":-76.12311303854698},{\"lat\":-13.383404319095593,\"lng\":-76.12302586675399},{\"lat\":-13.383322123984346,\"lng\":-76.1229373538565},{\"lat\":-13.383164257104717,\"lng\":-76.12274557591194},{\"lat\":-13.38306640568108,\"lng\":-76.12263962865585},{\"lat\":-13.383075240536959,\"lng\":-76.1226244397595},{\"lat\":-13.383316607301143,\"lng\":-76.12240047530676},{\"lat\":-13.383469255346034,\"lng\":-76.12225027160193},{\"lat\":-13.383791422644025,\"lng\":-76.12196693705609},{\"lat\":-13.384101936756355,\"lng\":-76.12169201063206},{\"lat\":-13.384443285499469,\"lng\":-76.12136968162693},{\"lat\":-13.384862216208951,\"lng\":-76.12100251459975},{\"lat\":-13.384947309942063,\"lng\":-76.12063991009555},{\"lat\":-13.38501254371935,\"lng\":-76.12054603278003},{\"lat\":-13.385268259955891,\"lng\":-76.12020271002612},{\"lat\":-13.385341864757788,\"lng\":-76.12020131309818},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:24:04', NULL, NULL, 1, NULL, NULL, 'C'),
(129, 23, 126, '[{\"lat\":-13.385261025771625,\"lng\":-76.12328996115099},{\"lat\":-13.385214057502228,\"lng\":-76.12319876604448},{\"lat\":-13.384934857045039,\"lng\":-76.12286617212663},{\"lat\":-13.384679140454413,\"lng\":-76.122571129135},{\"lat\":-13.384504313649412,\"lng\":-76.12237532787691},{\"lat\":-13.384428911803537,\"lng\":-76.1222841327704},{\"lat\":-13.38412100747325,\"lng\":-76.12256308250795},{\"lat\":-13.38384702447544,\"lng\":-76.12280448131929},{\"lat\":-13.383533900667663,\"lng\":-76.12310488872896},{\"lat\":-13.383463447754798,\"lng\":-76.12308879547487},{\"lat\":-13.38307465167975,\"lng\":-76.12264086656938},{\"lat\":-13.383374729242618,\"lng\":-76.1223565524138},{\"lat\":-13.383617400389543,\"lng\":-76.12213124685655},{\"lat\":-13.383802665294095,\"lng\":-76.12196763210665},{\"lat\":-13.383959227074149,\"lng\":-76.12182547502886},{\"lat\":-13.384235819303465,\"lng\":-76.12157787965963},{\"lat\":-13.38455155155426,\"lng\":-76.12128283666799},{\"lat\":-13.384828143103196,\"lng\":-76.12099852251241},{\"lat\":-13.384953392001965,\"lng\":-76.12064363878257},{\"lat\":-13.385112562383483,\"lng\":-76.12038614671714},{\"lat\":-13.385274342007701,\"lng\":-76.12021180313117},{\"lat\":-13.385287704907437,\"lng\":-76.1201994481679},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:27:09', NULL, NULL, 1, NULL, NULL, 'C'),
(130, 23, 127, '[{\"lat\":-13.385080857193614,\"lng\":-76.12173136769323},{\"lat\":-13.384718157270731,\"lng\":-76.1220317751029},{\"lat\":-13.384574642761898,\"lng\":-76.1221578389266},{\"lat\":-13.384441565595468,\"lng\":-76.12228122054128},{\"lat\":-13.384558986628496,\"lng\":-76.12242136548008},{\"lat\":-13.384984311224331,\"lng\":-76.12290684531177},{\"lat\":-13.385253074231885,\"lng\":-76.12324480364765},{\"lat\":-13.384433737524557,\"lng\":-76.12228457282032},{\"lat\":-13.384022528546454,\"lng\":-76.12265918007955},{\"lat\":-13.383539796191288,\"lng\":-76.12310979119405},{\"lat\":-13.383380624770135,\"lng\":-76.12301591387853},{\"lat\":-13.38308054721461,\"lng\":-76.12264308682546},{\"lat\":-13.38344070239293,\"lng\":-76.12228537156965},{\"lat\":-13.38365399032889,\"lng\":-76.12209246049011},{\"lat\":-13.3839031846014,\"lng\":-76.1218721310681},{\"lat\":-13.384108019490913,\"lng\":-76.12168303533255},{\"lat\":-13.38437054408413,\"lng\":-76.12144736717629},{\"lat\":-13.384491879186399,\"lng\":-76.12133069108414},{\"lat\":-13.384852137270355,\"lng\":-76.1209987407686},{\"lat\":-13.38488084014589,\"lng\":-76.12085658369081},{\"lat\":-13.384953901995434,\"lng\":-76.12064737138765},{\"lat\":-13.385151917131715,\"lng\":-76.12033333798647},{\"lat\":-13.385247158359695,\"lng\":-76.12020861526727},{\"lat\":-13.385269337818341,\"lng\":-76.12020861526727},{\"lat\":-13.385321524771783,\"lng\":-76.12019922753572},{\"lat\":-13.385373711713923,\"lng\":-76.12018983980417},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:29:10', NULL, NULL, 1, NULL, NULL, 'C'),
(131, 23, 128, '[{\"lat\":-13.386358805293323,\"lng\":-76.12102855317724},{\"lat\":-13.386314446574723,\"lng\":-76.12097490899694},{\"lat\":-13.386157886326092,\"lng\":-76.12076301448477},{\"lat\":-13.385432489178799,\"lng\":-76.12020511500967},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:30:38', NULL, NULL, 1, NULL, NULL, 'C'),
(132, 23, 129, '[{\"lat\":-13.38702695833904,\"lng\":-76.1196950708403},{\"lat\":-13.386961725107538,\"lng\":-76.11965751991409},{\"lat\":-13.386158050245202,\"lng\":-76.12074649677413},{\"lat\":-13.385444337819786,\"lng\":-76.12020407560223},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:32:15', NULL, NULL, 1, NULL, NULL, 'C'),
(133, 23, 130, '[{\"lat\":-13.387605940164153,\"lng\":-76.12059440266438},{\"lat\":-13.38781859986464,\"lng\":-76.12030472409077},{\"lat\":-13.387287602592703,\"lng\":-76.11987959396191},{\"lat\":-13.387044935144841,\"lng\":-76.11970927368947},{\"lat\":-13.386965350605982,\"lng\":-76.11966367613621},{\"lat\":-13.386600947557184,\"lng\":-76.12015498069327},{\"lat\":-13.386155880528593,\"lng\":-76.1207555633209},{\"lat\":-13.385646680403509,\"lng\":-76.12036588359751},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:33:31', NULL, NULL, 1, NULL, NULL, 'C'),
(134, 23, 131, '[{\"lat\":-13.387111335317352,\"lng\":-76.11892241865255},{\"lat\":-13.387130905276491,\"lng\":-76.1188781622038},{\"lat\":-13.387304425511303,\"lng\":-76.11897874504186},{\"lat\":-13.38736574466213,\"lng\":-76.1190404358492},{\"lat\":-13.387352500848134,\"lng\":-76.11910627682693},{\"lat\":-13.387208987909581,\"lng\":-76.11930207808501},{\"lat\":-13.38695979705847,\"lng\":-76.11964674194343},{\"lat\":-13.386460267750879,\"lng\":-76.12032793032235},{\"lat\":-13.386151198825102,\"lng\":-76.12074695482329},{\"lat\":-13.385434466276815,\"lng\":-76.12019999383409},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:43:46', NULL, NULL, 1, NULL, NULL, 'C'),
(135, 23, 132, '[{\"lat\":-13.385778899724333,\"lng\":-76.1194668778092},{\"lat\":-13.386110285985268,\"lng\":-76.11906186424795},{\"lat\":-13.386256408916038,\"lng\":-76.11883924089972},{\"lat\":-13.386459937136113,\"lng\":-76.11854956232611},{\"lat\":-13.386561961409033,\"lng\":-76.11843792893205},{\"lat\":-13.3867341773879,\"lng\":-76.11854521729265},{\"lat\":-13.387042078376403,\"lng\":-76.11875711180483},{\"lat\":-13.387089046289178,\"lng\":-76.1188429424933},{\"lat\":-13.387352262453476,\"lng\":-76.11905215503765},{\"lat\":-13.386979128634907,\"lng\":-76.1196368766029},{\"lat\":-13.386300702028562,\"lng\":-76.12056760313106},{\"lat\":-13.386167625816121,\"lng\":-76.12076340438915},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 16:47:28', NULL, NULL, 1, NULL, NULL, 'C'),
(136, 23, 133, '[{\"lat\":-13.38479419639618,\"lng\":-76.11824977642307},{\"lat\":-13.384742009328445,\"lng\":-76.11842143780002},{\"lat\":-13.384598494833822,\"lng\":-76.11872184520969},{\"lat\":-13.384830727336874,\"lng\":-76.1188666844965},{\"lat\":-13.385284754280091,\"lng\":-76.1191027188898},{\"lat\":-13.385699444694987,\"lng\":-76.11941175183246},{\"lat\":-13.385792790860236,\"lng\":-76.11946539601276},{\"lat\":-13.386121567763334,\"lng\":-76.1190577002425},{\"lat\":-13.386327705433912,\"lng\":-76.11874924620578},{\"lat\":-13.3865573269351,\"lng\":-76.11845152100513},{\"lat\":-13.38702767180272,\"lng\":-76.1187652199474},{\"lat\":-13.38724163667733,\"lng\":-76.1189610212055},{\"lat\":-13.38734600971789,\"lng\":-76.11904416968495},{\"lat\":-13.387004187841491,\"lng\":-76.11961279799611},{\"lat\":-13.386458837430807,\"lng\":-76.12036381652028},{\"lat\":-13.386177029078976,\"lng\":-76.12076614787252},{\"lat\":-13.386142298148828,\"lng\":-76.12072323252828},{\"lat\":-13.385429947686012,\"lng\":-76.12016533305318},{\"lat\":-13.385377760756057,\"lng\":-76.12016265084416},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 17:02:02', NULL, NULL, 1, NULL, NULL, 'C'),
(137, 23, 134, '[{\"lat\":-13.384023644429487,\"lng\":-76.11781527678353},{\"lat\":-13.384712514868102,\"lng\":-76.1183490363775},{\"lat\":-13.38474904582119,\"lng\":-76.11841072718484},{\"lat\":-13.384608140685904,\"lng\":-76.11871918122155},{\"lat\":-13.385279499488535,\"lng\":-76.1190893260656},{\"lat\":-13.38577788441114,\"lng\":-76.11945142428262},{\"lat\":-13.386565889490575,\"lng\":-76.11845096182928},{\"lat\":-13.387353666128156,\"lng\":-76.11904225406501},{\"lat\":-13.386993578958442,\"lng\":-76.11964575109336},{\"lat\":-13.386174248174044,\"lng\":-76.12077227887961},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-14 17:05:56', NULL, NULL, 1, NULL, NULL, 'C'),
(138, 23, 135, '[{\"lat\":-13.38365594400052,\"lng\":-76.11725511660788},{\"lat\":-13.383495467972551,\"lng\":-76.11743750682089},{\"lat\":-13.383774670098733,\"lng\":-76.11764269581053},{\"lat\":-13.383927317853251,\"lng\":-76.11778619399283},{\"lat\":-13.384034301691926,\"lng\":-76.11782776823256},{\"lat\":-13.384705129194778,\"lng\":-76.11834705358659},{\"lat\":-13.384741660148984,\"lng\":-76.11841008549844},{\"lat\":-13.384602059686975,\"lng\":-76.11872256284867},{\"lat\":-13.385277000957762,\"lng\":-76.11909347875859},{\"lat\":-13.385774081214295,\"lng\":-76.11944216593052},{\"lat\":-13.385801927081253,\"lng\":-76.1194305685957},{\"lat\":-13.385846285894278,\"lng\":-76.11937424220639},{\"lat\":-13.386000237005513,\"lng\":-76.1191770998438},{\"lat\":-13.386092868558901,\"lng\":-76.11906712927419},{\"lat\":-13.386133313310484,\"lng\":-76.11901214398938},{\"lat\":-13.386454828868636,\"lng\":-76.11856468174237},{\"lat\":-13.386567030252108,\"lng\":-76.11845068785924},{\"lat\":-13.38705830833562,\"lng\":-76.1188131013615},{\"lat\":-13.38733728358155,\"lng\":-76.11902430351395},{\"lat\":-13.38707896021421,\"lng\":-76.11952319439072},{\"lat\":-13.386894252227098,\"lng\":-76.11979056047096},{\"lat\":-13.386694638372973,\"lng\":-76.12004671143188},{\"lat\":-13.386171466636638,\"lng\":-76.12074542688026},{\"lat\":-13.386147101347548,\"lng\":-76.12077355207033},{\"lat\":-13.386115789284199,\"lng\":-76.12073734224863},{\"lat\":-13.385753090920335,\"lng\":-76.12045973361559},{\"lat\":-13.385460672557581,\"lng\":-76.12022504032679},{\"lat\":-13.38542283703932,\"lng\":-76.12020492375918},{\"lat\":-13.385411929856193,\"lng\":-76.1201644457893}]', '2025-02-15 05:11:03', NULL, NULL, 1, NULL, NULL, 'C'),
(139, 20, 136, '[{\"lat\":-13.435181958459932,\"lng\":-76.11530012560296},{\"lat\":-13.435255005018272,\"lng\":-76.11530012560296},{\"lat\":-13.435437621316805,\"lng\":-76.11534035873818},{\"lat\":-13.435643716686728,\"lng\":-76.11539132070946},{\"lat\":-13.435587914713249,\"lng\":-76.11555530780588},{\"lat\":-13.435530521070364,\"lng\":-76.11570551151071},{\"lat\":-13.43546269220199,\"lng\":-76.11580743545328},{\"lat\":-13.435423560153817,\"lng\":-76.11616685146127},{\"lat\":-13.435387036903082,\"lng\":-76.11652626746927},{\"lat\":-13.435400080921843,\"lng\":-76.1165852760676},{\"lat\":-13.43538964570689,\"lng\":-76.11675157302652},{\"lat\":-13.435285293532448,\"lng\":-76.11677839511667},{\"lat\":-13.435018781116787,\"lng\":-76.11669926995073},{\"lat\":-13.434628490545062,\"lng\":-76.11655308955942},{\"lat\":-13.434411463009098,\"lng\":-76.11637908656142}]', '2025-02-19 09:31:39', NULL, NULL, 1, NULL, NULL, 'C'),
(142, 20, 137, '[{\"lat\":-13.435737435612095,\"lng\":-76.11421945803488},{\"lat\":-13.435620039582881,\"lng\":-76.11446085684622},{\"lat\":-13.435462293979024,\"lng\":-76.11485317486373},{\"lat\":-13.435386638679988,\"lng\":-76.11502483624068},{\"lat\":-13.435277068894255,\"lng\":-76.11523673075286},{\"lat\":-13.435261416063643,\"lng\":-76.11529573935118},{\"lat\":-13.435353448721026,\"lng\":-76.11531582586504},{\"lat\":-13.435643025810993,\"lng\":-76.11538422219492},{\"lat\":-13.435555630960305,\"lng\":-76.1156281726022},{\"lat\":-13.435489106500393,\"lng\":-76.11575825973942},{\"lat\":-13.43546693167631,\"lng\":-76.11581190391972},{\"lat\":-13.435422825790965,\"lng\":-76.11620887085392},{\"lat\":-13.435391520147732,\"lng\":-76.11652403041317},{\"lat\":-13.435401672141555,\"lng\":-76.1166249044414},{\"lat\":-13.43539645453417,\"lng\":-76.11675901489214},{\"lat\":-13.435285580350468,\"lng\":-76.11678583698229},{\"lat\":-13.434945009573346,\"lng\":-76.1166624553676},{\"lat\":-13.434624125897251,\"lng\":-76.11654041485743},{\"lat\":-13.434416451981576,\"lng\":-76.116372776794},{\"lat\":-13.434411463009098,\"lng\":-76.11637908656142}]', '2025-02-19 09:33:05', NULL, NULL, 1, NULL, NULL, 'C'),
(143, 20, 138, '[{\"lat\":-13.436197735302594,\"lng\":-76.11447569906825},{\"lat\":-13.435975987624763,\"lng\":-76.11436706960315},{\"lat\":-13.435739891342434,\"lng\":-76.11423027694339},{\"lat\":-13.435741195742423,\"lng\":-76.11422437192562},{\"lat\":-13.435708585740585,\"lng\":-76.11429008604648},{\"lat\":-13.435648583325621,\"lng\":-76.11441078545215},{\"lat\":-13.435596407300402,\"lng\":-76.1145274615443},{\"lat\":-13.435539013659564,\"lng\":-76.11466693641307},{\"lat\":-13.435427510990003,\"lng\":-76.1149414103095},{\"lat\":-13.435319245625225,\"lng\":-76.1151586692397},{\"lat\":-13.435281417956126,\"lng\":-76.11523511219663},{\"lat\":-13.435264460723223,\"lng\":-76.11528875637693},{\"lat\":-13.435642737172412,\"lng\":-76.11537523341607},{\"lat\":-13.435633606368592,\"lng\":-76.1153966910882},{\"lat\":-13.4356189123948,\"lng\":-76.11543128007308},{\"lat\":-13.435532821936453,\"lng\":-76.11567938440696},{\"lat\":-13.435472141064395,\"lng\":-76.11580696117556},{\"lat\":-13.435429095812742,\"lng\":-76.11618951880841},{\"lat\":-13.435396485768475,\"lng\":-76.1165301593533},{\"lat\":-13.435392303692607,\"lng\":-76.11675412380605},{\"lat\":-13.435293169129066,\"lng\":-76.1167809458962},{\"lat\":-13.434952344765682,\"lng\":-76.11666265625618},{\"lat\":-13.434626243475252,\"lng\":-76.11653659243248},{\"lat\":-13.43441836622066,\"lng\":-76.11637114870891},{\"lat\":-13.434411463009098,\"lng\":-76.11637908656142}]', '2025-02-19 09:35:01', NULL, NULL, 1, NULL, NULL, 'C'),
(147, 24, NULL, '[{\"lat\":-13.42122479147426,\"lng\":-76.13957744506519},{\"lat\":-13.422180152527964,\"lng\":-76.13971679026622},{\"lat\":-13.423531765584878,\"lng\":-76.14006459628632},{\"lat\":-13.42353894014975,\"lng\":-76.14000223492673},{\"lat\":-13.423566337119862,\"lng\":-76.13998781805327},{\"lat\":-13.42357155498448,\"lng\":-76.13998379473975},{\"lat\":-13.423580034014263,\"lng\":-76.13997541283658},{\"lat\":-13.42358264294644,\"lng\":-76.13996770148566},{\"lat\":-13.423592752558356,\"lng\":-76.13993835976976},{\"lat\":-13.42366648504171,\"lng\":-76.13969079719489},{\"lat\":-13.423931652626706,\"lng\":-76.13973537697028},{\"lat\":-13.424452706492987,\"lng\":-76.1398233367587},{\"lat\":-13.424858550105663,\"lng\":-76.13989034272137},{\"lat\":-13.425319668330788,\"lng\":-76.13996853266097},{\"lat\":-13.425708365606788,\"lng\":-76.14004988898317},{\"lat\":-13.42602196292851,\"lng\":-76.14011337263554},{\"lat\":-13.426540723561013,\"lng\":-76.14022871899874},{\"lat\":-13.426969523763445,\"lng\":-76.1402958738388},{\"lat\":-13.427500130385216,\"lng\":-76.14038221334604},{\"lat\":-13.427735935772041,\"lng\":-76.14041825091343},{\"lat\":-13.427711231805848,\"lng\":-76.13999306089383},{\"lat\":-13.427704794712524,\"lng\":-76.13990872128132},{\"lat\":-13.428073929560915,\"lng\":-76.13992381987018},{\"lat\":-13.428363091981712,\"lng\":-76.13993760972564},{\"lat\":-13.4286523176333,\"lng\":-76.13995202659909},{\"lat\":-13.429452991190644,\"lng\":-76.13999008624654},{\"lat\":-13.429490610195774,\"lng\":-76.14038209912371},{\"lat\":-13.430301005016064,\"lng\":-76.14042873029607},{\"lat\":-13.430303731841619,\"lng\":-76.14057720942256},{\"lat\":-13.430320545116778,\"lng\":-76.14114058321003},{\"lat\":-13.430328128642243,\"lng\":-76.14131279830139},{\"lat\":-13.43075258691287,\"lng\":-76.14136999101967},{\"lat\":-13.431207040582178,\"lng\":-76.1414320124523},{\"lat\":-13.431408345857028,\"lng\":-76.14145186854365},{\"lat\":-13.431651647148879,\"lng\":-76.14148513028145},{\"lat\":-13.43186783564032,\"lng\":-76.14151568678194},{\"lat\":-13.43209779071466,\"lng\":-76.14154688631356},{\"lat\":-13.432316282284344,\"lng\":-76.14160116890653},{\"lat\":-13.432460605478823,\"lng\":-76.14163020347496},{\"lat\":-13.432640165099093,\"lng\":-76.14166067581897},{\"lat\":-13.433040609813451,\"lng\":-76.14173155551013},{\"lat\":-13.433027907544068,\"lng\":-76.14152687769943},{\"lat\":-13.433096863018928,\"lng\":-76.14083251722793},{\"lat\":-13.433114165545456,\"lng\":-76.14068500565318},{\"lat\":-13.43311411855701,\"lng\":-76.14036960743805},{\"lat\":-13.433125663895277,\"lng\":-76.14011081678927},{\"lat\":-13.433142716551538,\"lng\":-76.13960611376044},{\"lat\":-13.433160369702975,\"lng\":-76.13916971646069},{\"lat\":-13.433166565669492,\"lng\":-76.13894567056735},{\"lat\":-13.433186784179503,\"lng\":-76.13848280411092},{\"lat\":-13.4331883701862,\"lng\":-76.13842340558057},{\"lat\":-13.433544072817309,\"lng\":-76.13848709065564},{\"lat\":-13.433873791357895,\"lng\":-76.13854460193664},{\"lat\":-13.434152474763927,\"lng\":-76.13859249305827},{\"lat\":-13.434649238928195,\"lng\":-76.13864956148092},{\"lat\":-13.43507013192764,\"lng\":-76.13869912386878},{\"lat\":-13.435392674121912,\"lng\":-76.13873430165465},{\"lat\":-13.435626737754681,\"lng\":-76.13876137397241},{\"lat\":-13.435914978205565,\"lng\":-76.13879402566766},{\"lat\":-13.435925080705669,\"lng\":-76.13850238073883},{\"lat\":-13.435916520552734,\"lng\":-76.13813182413303},{\"lat\":-13.435906579169794,\"lng\":-76.13775174890131},{\"lat\":-13.435897239615535,\"lng\":-76.13731518026161},{\"lat\":-13.435881846366009,\"lng\":-76.13672601789371},{\"lat\":-13.435875955664716,\"lng\":-76.13650549966516},{\"lat\":-13.43585837381956,\"lng\":-76.13628542982858},{\"lat\":-13.435790675696168,\"lng\":-76.13617136823542},{\"lat\":-13.435718281501014,\"lng\":-76.13608084368117},{\"lat\":-13.43560216406234,\"lng\":-76.13599959856396},{\"lat\":-13.435179368926303,\"lng\":-76.13587664948845},{\"lat\":-13.435090589754216,\"lng\":-76.1358511375393},{\"lat\":-13.434718460051263,\"lng\":-76.13571366289305},{\"lat\":-13.434641267165127,\"lng\":-76.13565609117506},{\"lat\":-13.434639165338949,\"lng\":-76.13545809622491},{\"lat\":-13.434698814455901,\"lng\":-76.13517139242205},{\"lat\":-13.434764002308944,\"lng\":-76.13460018331341},{\"lat\":-13.434743907804355,\"lng\":-76.13438201156796},\r\n{\"lat\": -13.434734030451873, \"lng\": -76.13421704743513},\r\n{\"lat\": -13.434759221839306, \"lng\": -76.13409254807357}]', '2025-02-19 10:03:34', NULL, NULL, 1, NULL, NULL, 'S'),
(148, 25, 140, '[{\"lat\":-13.437133579813938,\"lng\":-76.11335096388657},{\"lat\":-13.436853135281435,\"lng\":-76.11432192354997},{\"lat\":-13.436678596684905,\"lng\":-76.1149435206351},{\"lat\":-13.436566418698423,\"lng\":-76.11542765936228},{\"lat\":-13.436525642509173,\"lng\":-76.11557899992972},{\"lat\":-13.436515533442149,\"lng\":-76.11560146343022},{\"lat\":-13.43649988069235,\"lng\":-76.11560280453473},{\"lat\":-13.43649155645403,\"lng\":-76.11561077808115}]', '2025-02-19 10:06:07', NULL, NULL, 1, NULL, NULL, 'C'),
(149, 25, 141, '[{\"lat\":-13.438055685548077,\"lng\":-76.1101002274427},{\"lat\":-13.437896110638613,\"lng\":-76.11079403784113},{\"lat\":-13.43773958399585,\"lng\":-76.11157724287348},{\"lat\":-13.437525664085493,\"lng\":-76.11207076933222},{\"lat\":-13.437296091286486,\"lng\":-76.1126984062417},{\"lat\":-13.43717086966713,\"lng\":-76.11318120386439},{\"lat\":-13.437139564252067,\"lng\":-76.11332067873316},{\"lat\":-13.436731233717277,\"lng\":-76.11476721926716},{\"lat\":-13.43657470631418,\"lng\":-76.11542835083151},{\"lat\":-13.43656166235931,\"lng\":-76.11545785513067},{\"lat\":-13.436547015446212,\"lng\":-76.11550287205476},{\"lat\":-13.436523210225296,\"lng\":-76.11558635581035},{\"lat\":-13.436513427257122,\"lng\":-76.11560110795993},{\"lat\":-13.436499731100978,\"lng\":-76.11560144323606},{\"lat\":-13.43649155645403,\"lng\":-76.11561077808115}]', '2025-02-19 10:21:19', NULL, NULL, 1, NULL, NULL, 'C'),
(150, 26, 142, '[{\"lat\":-13.42504137582312,\"lng\":-76.14200881808364},{\"lat\":-13.425171821603143,\"lng\":-76.14105663388335},{\"lat\":-13.425316174218619,\"lng\":-76.14001284505925},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:34:36', NULL, NULL, 1, NULL, NULL, 'C'),
(151, 26, 143, '[{\"lat\":-13.425226040667317,\"lng\":-76.14436863882796},{\"lat\":-13.425121684072556,\"lng\":-76.14436327440993},{\"lat\":-13.424683943993692,\"lng\":-76.14438445859291},{\"lat\":-13.424627199972749,\"lng\":-76.14441530399658},{\"lat\":-13.424888458425961,\"lng\":-76.14289167353951},{\"lat\":-13.425105503360857,\"lng\":-76.14165702893438},{\"lat\":-13.425256712697879,\"lng\":-76.14039776062486},{\"lat\":-13.425317615684968,\"lng\":-76.1399783452847},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:36:13', NULL, NULL, 1, NULL, NULL, 'C'),
(152, 25, 144, '[{\"lat\":-13.436317767425896,\"lng\":-76.11689551536871},{\"lat\":-13.436398640016897,\"lng\":-76.11644892756773},{\"lat\":-13.436453424659822,\"lng\":-76.1161422386888},{\"lat\":-13.436501687311084,\"lng\":-76.11590754539999},{\"lat\":-13.436527775226628,\"lng\":-76.11574929506811},{\"lat\":-13.436525465527463,\"lng\":-76.11568791177017},{\"lat\":-13.436521591322977,\"lng\":-76.11566317259644},{\"lat\":-13.43651767813573,\"lng\":-76.11564339130496},{\"lat\":-13.43650398197984,\"lng\":-76.11562930970763},{\"lat\":-13.436490611922148,\"lng\":-76.1156202572522},{\"lat\":-13.43649155645403,\"lng\":-76.11561077808115}]', '2025-02-19 10:36:16', NULL, NULL, 1, NULL, NULL, 'C'),
(153, 26, 145, '[{\"lat\":-13.425439504465244,\"lng\":-76.1449246895465},{\"lat\":-13.42546820249533,\"lng\":-76.14438422443},{\"lat\":-13.425109476872613,\"lng\":-76.14435069681731},{\"lat\":-13.42467743835219,\"lng\":-76.14438573064456},{\"lat\":-13.424623425081721,\"lng\":-76.14441850293589},{\"lat\":-13.424847322490189,\"lng\":-76.14312153576375},{\"lat\":-13.425006511314244,\"lng\":-76.14220618401144},{\"lat\":-13.42508527237981,\"lng\":-76.14171449973645},{\"lat\":-13.425147805575586,\"lng\":-76.1412509389684},{\"lat\":-13.425215509589504,\"lng\":-76.14072594160598},{\"lat\":-13.425282957867642,\"lng\":-76.14023788774753},{\"lat\":-13.425317973766266,\"lng\":-76.13997523269445},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:37:42', NULL, NULL, 1, NULL, NULL, 'C'),
(154, 26, 146, '[{\"lat\":-13.425585818554579,\"lng\":-76.1435446233033},{\"lat\":-13.425497115584866,\"lng\":-76.14437610809792},{\"lat\":-13.425113598066394,\"lng\":-76.14436923990648},{\"lat\":-13.424679061230227,\"lng\":-76.14438334165636},{\"lat\":-13.424623295553467,\"lng\":-76.14442391006772},{\"lat\":-13.424683821763256,\"lng\":-76.14405161485244},{\"lat\":-13.424850442268262,\"lng\":-76.14310889796677},{\"lat\":-13.42500807965003,\"lng\":-76.14220170136936},{\"lat\":-13.42505210036321,\"lng\":-76.14194945647947},{\"lat\":-13.425090572140304,\"lng\":-76.14166956095619},{\"lat\":-13.4251748046315,\"lng\":-76.14101559398334},{\"lat\":-13.42527248728254,\"lng\":-76.1403311976275},{\"lat\":-13.425315878631274,\"lng\":-76.13997567045763},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:38:53', NULL, NULL, 1, NULL, NULL, 'C'),
(155, 25, 147, '[{\"lat\":-13.436142321058245,\"lng\":-76.11938318771783},{\"lat\":-13.436142321058245,\"lng\":-76.11894866985742},{\"lat\":-13.436207540939535,\"lng\":-76.1183693127102},{\"lat\":-13.436228411297803,\"lng\":-76.11792993168783},{\"lat\":-13.436225802503131,\"lng\":-76.1174578629012},{\"lat\":-13.436280587185532,\"lng\":-76.11706626038503},{\"lat\":-13.43633015426836,\"lng\":-76.11692142109823},{\"lat\":-13.436379721340932,\"lng\":-76.11658882718038},{\"lat\":-13.436515378539811,\"lng\":-76.11588756738067},{\"lat\":-13.43652819238823,\"lng\":-76.11571581647075},{\"lat\":-13.436508626036808,\"lng\":-76.11563689594567},{\"lat\":-13.436490038395775,\"lng\":-76.11562214379609},{\"lat\":-13.43649155645403,\"lng\":-76.11561077808115}]', '2025-02-19 10:41:16', NULL, NULL, 1, NULL, NULL, 'C'),
(156, 26, 148, '[{\"lat\":-13.426895138582891,\"lng\":-76.14359787002896},{\"lat\":-13.426232798370156,\"lng\":-76.14354690805767},{\"lat\":-13.42587363502868,\"lng\":-76.14358468457989},{\"lat\":-13.425582386092485,\"lng\":-76.14355642795647},{\"lat\":-13.425501770113545,\"lng\":-76.14437644631174},{\"lat\":-13.425260120841475,\"lng\":-76.14437012694583},{\"lat\":-13.425115505920695,\"lng\":-76.14436658317975},{\"lat\":-13.424904659676537,\"lng\":-76.14437819549997},{\"lat\":-13.424680882624163,\"lng\":-76.14439009571582},{\"lat\":-13.42461810557506,\"lng\":-76.14442071126771},{\"lat\":-13.424729748011782,\"lng\":-76.1438065148389},{\"lat\":-13.424913392102436,\"lng\":-76.14272569307904},{\"lat\":-13.425102875912916,\"lng\":-76.14161484265131},{\"lat\":-13.425220855611508,\"lng\":-76.1406783842679},{\"lat\":-13.425314924740473,\"lng\":-76.1400116135803},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:41:40', NULL, NULL, 1, NULL, NULL, 'C'),
(157, 26, 149, '[{\"lat\":-13.427876387910972,\"lng\":-76.14294282832999},{\"lat\":-13.427358596630688,\"lng\":-76.14291853344267},{\"lat\":-13.426943851979651,\"lng\":-76.14289665347165},{\"lat\":-13.426462172557695,\"lng\":-76.14287211545897},{\"lat\":-13.426221401209604,\"lng\":-76.14286001709974},{\"lat\":-13.426227463858668,\"lng\":-76.14354541963871},{\"lat\":-13.42587383770249,\"lng\":-76.14358692705052},{\"lat\":-13.425582088851037,\"lng\":-76.14355241197245},{\"lat\":-13.425500614491202,\"lng\":-76.14437833535989},{\"lat\":-13.425112111893748,\"lng\":-76.14436503543341},{\"lat\":-13.42468194858442,\"lng\":-76.14438789918087},{\"lat\":-13.42461998672129,\"lng\":-76.14442209734581},{\"lat\":-13.424889097109304,\"lng\":-76.14287765158322},{\"lat\":-13.42501788469273,\"lng\":-76.14212658838511},{\"lat\":-13.42508862020391,\"lng\":-76.14167091867255},{\"lat\":-13.425182972421934,\"lng\":-76.14096380611046},{\"lat\":-13.42530340480509,\"lng\":-76.14007038712063},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:47:30', NULL, NULL, 1, NULL, NULL, 'C'),
(158, 25, 150, '[{\"lat\":-13.437393628598901,\"lng\":-76.12260638803308},{\"lat\":-13.437173679850568,\"lng\":-76.12254521313096},{\"lat\":-13.437163244712789,\"lng\":-76.12231990757371},{\"lat\":-13.437173679850568,\"lng\":-76.12181565227891},{\"lat\":-13.437173679850568,\"lng\":-76.12147769394304},{\"lat\":-13.437121504157147,\"lng\":-76.12124165954972},{\"lat\":-13.43703280545228,\"lng\":-76.12088760795976},{\"lat\":-13.436771926718405,\"lng\":-76.12069985332872},{\"lat\":-13.436438001524952,\"lng\":-76.12041017475511},{\"lat\":-13.436349302567294,\"lng\":-76.12004539432908},{\"lat\":-13.436203210094925,\"lng\":-76.11966452064897},{\"lat\":-13.436140599008096,\"lng\":-76.11948213043596},{\"lat\":-13.436224742421214,\"lng\":-76.11810146208798},{\"lat\":-13.436229960010575,\"lng\":-76.11746041413342},{\"lat\":-13.436314745821825,\"lng\":-76.11691967987726},{\"lat\":-13.436326485393323,\"lng\":-76.11686201238344},{\"lat\":-13.436498665709317,\"lng\":-76.11593764068625},{\"lat\":-13.436513014063415,\"lng\":-76.11584778668426},{\"lat\":-13.43650849067239,\"lng\":-76.11566315166347},{\"lat\":-13.436506532839871,\"lng\":-76.11563745618376},{\"lat\":-13.436487619099708,\"lng\":-76.1156180101684},{\"lat\":-13.43649155645403,\"lng\":-76.11561077808115}]', '2025-02-19 10:47:30', NULL, NULL, 1, NULL, NULL, 'C');
INSERT INTO `tb_lineas` (`id_linea`, `id_mufa`, `id_caja`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`, `tipo_linea`) VALUES
(159, 26, 151, '[{\"lat\":-13.427917762945745,\"lng\":-76.14386586687952},{\"lat\":-13.427912121381194,\"lng\":-76.14366950828402},{\"lat\":-13.427926325673264,\"lng\":-76.14338444422587},{\"lat\":-13.427877901508587,\"lng\":-76.14294231683556},{\"lat\":-13.427391213244633,\"lng\":-76.14291750075527},{\"lat\":-13.426220415608977,\"lng\":-76.14285835570573},{\"lat\":-13.426229259514983,\"lng\":-76.14354566388417},{\"lat\":-13.425874599436849,\"lng\":-76.14358605671448},{\"lat\":-13.42558301348982,\"lng\":-76.1435533822197},{\"lat\":-13.42550057820961,\"lng\":-76.14437915465724},{\"lat\":-13.425112679338989,\"lng\":-76.14436150655358},{\"lat\":-13.424681382642003,\"lng\":-76.14438401877963},{\"lat\":-13.424620399124057,\"lng\":-76.14442425191486},{\"lat\":-13.424765569936142,\"lng\":-76.14360224721486},{\"lat\":-13.424898721241545,\"lng\":-76.14280023105617},{\"lat\":-13.425013626105768,\"lng\":-76.14214533790867},{\"lat\":-13.42507380123826,\"lng\":-76.14181753108372},{\"lat\":-13.425101103007895,\"lng\":-76.14160529049803},{\"lat\":-13.425134571377413,\"lng\":-76.14134083945231},{\"lat\":-13.425221611810544,\"lng\":-76.14066439082114},{\"lat\":-13.425315983350542,\"lng\":-76.13997931141272},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:49:54', NULL, NULL, 1, NULL, NULL, 'C'),
(160, 26, 152, '[{\"lat\":-13.426836992268354,\"lng\":-76.13771379872061},{\"lat\":-13.426720645849144,\"lng\":-76.13837675514785},{\"lat\":-13.426670433573664,\"lng\":-76.13876349035253},{\"lat\":-13.426579385684608,\"lng\":-76.13932821010555},{\"lat\":-13.42653985670072,\"lng\":-76.14023339013194},{\"lat\":-13.426487481906431,\"lng\":-76.14060259118186},{\"lat\":-13.426375415263038,\"lng\":-76.1413334211177},{\"lat\":-13.426338716188551,\"lng\":-76.14158502801894},{\"lat\":-13.426249366074776,\"lng\":-76.14219495140314},{\"lat\":-13.426220668138084,\"lng\":-76.14238371186256},{\"lat\":-13.42622326613876,\"lng\":-76.142862771931},{\"lat\":-13.42622753054462,\"lng\":-76.14354672564824},{\"lat\":-13.42587494607291,\"lng\":-76.14358809369213},{\"lat\":-13.425587451974526,\"lng\":-76.14355488277242},{\"lat\":-13.425498999325104,\"lng\":-76.14437589293306},{\"lat\":-13.425350736967994,\"lng\":-76.1443756076405},{\"lat\":-13.425122685192864,\"lng\":-76.14436895147215},{\"lat\":-13.424803799961818,\"lng\":-76.14438062452273},{\"lat\":-13.424674955874426,\"lng\":-76.14438427433664},{\"lat\":-13.424619545822685,\"lng\":-76.14442331504303},{\"lat\":-13.424814249972966,\"lng\":-76.14329458426496},{\"lat\":-13.424957594242724,\"lng\":-76.1424732842358},{\"lat\":-13.425075432421544,\"lng\":-76.14174516207373},{\"lat\":-13.425138126240736,\"lng\":-76.14128613983885},{\"lat\":-13.425316820217098,\"lng\":-76.13997685258863},{\"lat\":-13.425324433258302,\"lng\":-76.13996886427672}]', '2025-02-19 10:54:17', NULL, NULL, 1, NULL, NULL, 'C'),
(162, 29, 154, '[{\"lat\":-13.435902739910853,\"lng\":-76.13733810022276},{\"lat\":-13.435892630817571,\"lng\":-76.1373035667817},{\"lat\":-13.43589586829866,\"lng\":-76.13726496209013}]', '2025-02-19 11:03:00', NULL, NULL, 1, NULL, NULL, 'C'),
(164, 29, 156, '[{\"lat\":-13.437940986758287,\"lng\":-76.13764273356978},{\"lat\":-13.437391222114588,\"lng\":-76.13755408820673},{\"lat\":-13.43684198736415,\"lng\":-76.13746508717682},{\"lat\":-13.436389593318177,\"lng\":-76.13739349607877},{\"lat\":-13.43589508102259,\"lng\":-76.13731675660273},{\"lat\":-13.43589586829866,\"lng\":-76.13726496209013}]', '2025-02-19 11:05:55', NULL, NULL, 1, NULL, NULL, 'C'),
(165, 29, 157, '[{\"lat\":-13.438220601665263,\"lng\":-76.13694187670025},{\"lat\":-13.43819689586378,\"lng\":-76.13768431905271},{\"lat\":-13.43796079942942,\"lng\":-76.13764680951007},{\"lat\":-13.437355737708453,\"lng\":-76.13754637350897},{\"lat\":-13.43672805380494,\"lng\":-76.13744879080976},{\"lat\":-13.435899891584192,\"lng\":-76.13731501221764},{\"lat\":-13.43589586829866,\"lng\":-76.13726496209013}]', '2025-02-19 11:07:55', NULL, NULL, 1, NULL, NULL, 'C'),
(166, 27, 158, '[{\"lat\":-13.430744626237484,\"lng\":-76.1219213806365},{\"lat\":-13.430785063475872,\"lng\":-76.1214721106265},{\"lat\":-13.430825500707432,\"lng\":-76.1212736271594},{\"lat\":-13.430817674147027,\"lng\":-76.12110196578244},{\"lat\":-13.430811553014383,\"lng\":-76.12083034721675},{\"lat\":-13.430810248587576,\"lng\":-76.12068282572093},{\"lat\":-13.430802422026664,\"lng\":-76.12050177661243},{\"lat\":-13.430819379574988,\"lng\":-76.12027249685656},{\"lat\":-13.430860027594107,\"lng\":-76.12010020371126},{\"lat\":-13.430879593991214,\"lng\":-76.11999023314165},{\"lat\":-13.430913509075753,\"lng\":-76.11980784292864},{\"lat\":-13.430959163989684,\"lng\":-76.11965361591028},{\"lat\":-13.431002210043435,\"lng\":-76.11957314963983},{\"lat\":-13.431023671800734,\"lng\":-76.1195046747947}]', '2025-02-19 11:09:17', NULL, NULL, 1, NULL, NULL, 'C'),
(167, 29, 159, '[{\"lat\":-13.43835730579954,\"lng\":-76.13534143424863},{\"lat\":-13.438265346586164,\"lng\":-76.13533674038285},{\"lat\":-13.438253873321925,\"lng\":-76.13576406687828},{\"lat\":-13.438235133820536,\"lng\":-76.13635570465563},{\"lat\":-13.438222872750167,\"lng\":-76.13693381360115},{\"lat\":-13.438197573412621,\"lng\":-76.13768569226713},{\"lat\":-13.437467866195124,\"lng\":-76.13756572454757},{\"lat\":-13.437162496890009,\"lng\":-76.13751802961377},{\"lat\":-13.436773021112742,\"lng\":-76.13745524057842},{\"lat\":-13.436382090616952,\"lng\":-76.1373911322749},{\"lat\":-13.436036232460678,\"lng\":-76.1373356034204},{\"lat\":-13.43590023580589,\"lng\":-76.13731579921317},{\"lat\":-13.43589586829866,\"lng\":-76.13726496209013}]', '2025-02-19 11:09:41', NULL, NULL, 1, NULL, NULL, 'C'),
(168, 27, 160, '[{\"lat\":-13.429937414574562,\"lng\":-76.12128675039799},{\"lat\":-13.430215258332323,\"lng\":-76.12132966574222},{\"lat\":-13.430363963309942,\"lng\":-76.12135380562336},{\"lat\":-13.430601446041333,\"lng\":-76.12139001544506},{\"lat\":-13.430721453381143,\"lng\":-76.12140610869915},{\"lat\":-13.430801023432066,\"lng\":-76.12141817863971},{\"lat\":-13.430822457509123,\"lng\":-76.12127741813994},{\"lat\":-13.430823109722485,\"lng\":-76.1212693715129},{\"lat\":-13.430817239802145,\"lng\":-76.12115940094328},{\"lat\":-13.430816119698992,\"lng\":-76.12092451814809},{\"lat\":-13.430813510845452,\"lng\":-76.12083332304158},{\"lat\":-13.430803645758397,\"lng\":-76.12049804691472},{\"lat\":-13.430821907733378,\"lng\":-76.1202707297007},{\"lat\":-13.43090983711218,\"lng\":-76.1198507684912},{\"lat\":-13.430950739073577,\"lng\":-76.11969692693948},{\"lat\":-13.430965087759523,\"lng\":-76.11964797662496},{\"lat\":-13.431002263896382,\"lng\":-76.11958293305635},{\"lat\":-13.43100748159934,\"lng\":-76.11956147538423},{\"lat\":-13.431023786920349,\"lng\":-76.11950917230844},{\"lat\":-13.431023671800734,\"lng\":-76.1195046747947}]', '2025-02-19 11:10:32', NULL, NULL, 1, NULL, NULL, 'C'),
(169, 29, 161, '[{\"lat\":-13.433067050109404,\"lng\":-76.14183322924112},{\"lat\":-13.433037700780739,\"lng\":-76.14172225284312},{\"lat\":-13.43303020039618,\"lng\":-76.14152668979047},{\"lat\":-13.433111352012281,\"lng\":-76.14068375763094},{\"lat\":-13.43311078373736,\"lng\":-76.14036577381736},{\"lat\":-13.433169630880924,\"lng\":-76.13894587477557},{\"lat\":-13.433188455429912,\"lng\":-76.13842195368616},{\"lat\":-13.433923673106852,\"lng\":-76.13855126593381},{\"lat\":-13.434155038310552,\"lng\":-76.1385903031694},{\"lat\":-13.434930358746067,\"lng\":-76.13867965575527},{\"lat\":-13.435913576981958,\"lng\":-76.13879272714148},{\"lat\":-13.43589925718082,\"lng\":-76.1373153571766},{\"lat\":-13.43589586829866,\"lng\":-76.13726496209013}]', '2025-02-19 11:10:58', NULL, NULL, 1, NULL, NULL, 'C'),
(170, 27, 162, '[{\"lat\":-13.43212977758795,\"lng\":-76.11970787996609},{\"lat\":-13.431730624851124,\"lng\":-76.11960595602352},{\"lat\":-13.431130590075659,\"lng\":-76.1194933032449},{\"lat\":-13.431023671800734,\"lng\":-76.1195046747947}]', '2025-02-19 11:12:23', NULL, NULL, 1, NULL, NULL, 'C'),
(171, 29, 163, '[{\"lat\":-13.434475494216915,\"lng\":-76.13601594827195},{\"lat\":-13.43449179930221,\"lng\":-76.13594587556143},{\"lat\":-13.434634957903539,\"lng\":-76.13546307793875},{\"lat\":-13.434637566715526,\"lng\":-76.13565519115944},{\"lat\":-13.434721345882036,\"lng\":-76.13571243236206},{\"lat\":-13.435094633128982,\"lng\":-76.13584990249687},{\"lat\":-13.435599580834149,\"lng\":-76.13600188906914},{\"lat\":-13.43572022354035,\"lng\":-76.13607768143115},{\"lat\":-13.435790750956807,\"lng\":-76.13616738485497},{\"lat\":-13.435856616456944,\"lng\":-76.13628672942755},{\"lat\":-13.435879756632223,\"lng\":-76.13650744974328},{\"lat\":-13.435899294825088,\"lng\":-76.13725498582887},{\"lat\":-13.43589586829866,\"lng\":-76.13726496209013}]', '2025-02-19 11:13:28', NULL, NULL, 1, NULL, NULL, 'C'),
(172, 31, 164, '[{\"lat\":-13.434819751462658,\"lng\":-76.13329962565467},{\"lat\":-13.434811272830038,\"lng\":-76.13339551462695},{\"lat\":-13.43479303054456,\"lng\":-76.13369483648339},{\"lat\":-13.43477867698248,\"lng\":-76.13400178101348},{\"lat\":-13.434734129412224,\"lng\":-76.13421666889646}]', '2025-02-19 11:35:58', NULL, NULL, 1, NULL, NULL, 'C'),
(173, 31, 165, '[{\"lat\":-13.432757001283713,\"lng\":-76.13213336399158},{\"lat\":-13.432725458044226,\"lng\":-76.13230984165709},{\"lat\":-13.432696434777908,\"lng\":-76.13253313555758},{\"lat\":-13.43268063659651,\"lng\":-76.13272894139068},{\"lat\":-13.43267052736743,\"lng\":-76.13284662331121},{\"lat\":-13.432673371146624,\"lng\":-76.13316784295701},{\"lat\":-13.432674675563293,\"lng\":-76.13322215768956},{\"lat\":-13.432731309130629,\"lng\":-76.13340264843048},{\"lat\":-13.432730330818359,\"lng\":-76.13371210829557},{\"lat\":-13.432956333696332,\"lng\":-76.13376993948081},{\"lat\":-13.433188421404527,\"lng\":-76.13382348262736},{\"lat\":-13.433706684596801,\"lng\":-76.13395080216796},{\"lat\":-13.433970201944144,\"lng\":-76.13401523582755},{\"lat\":-13.434717707172217,\"lng\":-76.13421144810587},{\"lat\":-13.434734129412224,\"lng\":-76.13421666889646}]', '2025-02-19 11:37:20', NULL, NULL, 1, NULL, NULL, 'C'),
(174, 31, 166, '[{\"lat\":-13.431757160431712,\"lng\":-76.13002163201878},{\"lat\":-13.432084646633662,\"lng\":-76.13009834414719},{\"lat\":-13.432505182952744,\"lng\":-76.13019354929956},{\"lat\":-13.43297400808433,\"lng\":-76.13030015831113},{\"lat\":-13.432991652852982,\"lng\":-76.13078644997844},{\"lat\":-13.432797373722448,\"lng\":-76.1319219646145},{\"lat\":-13.43275791513539,\"lng\":-76.13214425268662},{\"lat\":-13.43272283002773,\"lng\":-76.13229931836095},{\"lat\":-13.432699234951851,\"lng\":-76.13252776023369},{\"lat\":-13.432667036463332,\"lng\":-76.13284258172288},{\"lat\":-13.43267881081123,\"lng\":-76.13321999842202},{\"lat\":-13.432728352953026,\"lng\":-76.13340282633231},{\"lat\":-13.432721308487228,\"lng\":-76.13371095437323},{\"lat\":-13.4336593843334,\"lng\":-76.13393831952148},{\"lat\":-13.434319672956425,\"lng\":-76.13410464709796},{\"lat\":-13.434734129412224,\"lng\":-76.13421666889646}]', '2025-02-19 11:39:01', NULL, NULL, 1, NULL, NULL, 'C'),
(175, 27, 167, '[{\"lat\":-13.433161125510397,\"lng\":-76.11879647143573},{\"lat\":-13.433158516682353,\"lng\":-76.11869156444669},{\"lat\":-13.433171560822293,\"lng\":-76.11861524750915},{\"lat\":-13.433257652128129,\"lng\":-76.11861256530014},{\"lat\":-13.4333046110092,\"lng\":-76.1185508744928},{\"lat\":-13.433335916924804,\"lng\":-76.1181002633783},{\"lat\":-13.433343743403071,\"lng\":-76.11773011853424},{\"lat\":-13.433288958049864,\"lng\":-76.11753699948517},{\"lat\":-13.432571529650792,\"lng\":-76.11760405471054},{\"lat\":-13.432352541225352,\"lng\":-76.1176684277269},{\"lat\":-13.43230819099523,\"lng\":-76.1179393308374},{\"lat\":-13.432198619803323,\"lng\":-76.11895320584503},{\"lat\":-13.43213078999278,\"lng\":-76.11955648284842},{\"lat\":-13.432116441376552,\"lng\":-76.1196771822541},{\"lat\":-13.431490000254959,\"lng\":-76.11955443310995},{\"lat\":-13.431065854194184,\"lng\":-76.11949415475107},{\"lat\":-13.431023671800734,\"lng\":-76.1195046747947}]', '2025-02-19 11:40:12', NULL, NULL, 1, NULL, NULL, 'C'),
(176, 27, 168, '[{\"lat\":-13.433071430033204,\"lng\":-76.11946271622385},{\"lat\":-13.433110562465114,\"lng\":-76.11906306708063},{\"lat\":-13.433135346335341,\"lng\":-76.11892895662989},{\"lat\":-13.433148356921615,\"lng\":-76.11886131709912},{\"lat\":-13.433160096648093,\"lng\":-76.11882376617291},{\"lat\":-13.43316531430413,\"lng\":-76.11868831461766},{\"lat\":-13.433175547062403,\"lng\":-76.1186201336964},{\"lat\":-13.433309901660317,\"lng\":-76.1185302796944},{\"lat\":-13.433343794007031,\"lng\":-76.1179775431211},{\"lat\":-13.433345098420038,\"lng\":-76.11772943878722},{\"lat\":-13.433290313067149,\"lng\":-76.11753497863364},{\"lat\":-13.432569003476699,\"lng\":-76.11760203385901},{\"lat\":-13.432353361194076,\"lng\":-76.11767388919198},{\"lat\":-13.432263105988966,\"lng\":-76.118384931939},{\"lat\":-13.432196580615917,\"lng\":-76.11898440565383},{\"lat\":-13.4321365949711,\"lng\":-76.11951446800241},{\"lat\":-13.432119637515887,\"lng\":-76.11967674164781},{\"lat\":-13.431763153491435,\"lng\":-76.11961165364946},{\"lat\":-13.431339390737968,\"lng\":-76.11952314075197},{\"lat\":-13.431073288110543,\"lng\":-76.1194922953483},{\"lat\":-13.431023671800734,\"lng\":-76.1195046747947}]', '2025-02-19 11:41:47', NULL, NULL, 1, NULL, NULL, 'C'),
(177, 31, 169, '[{\"lat\":-13.43491610304252,\"lng\":-76.1304779364157},{\"lat\":-13.434918268440098,\"lng\":-76.13086024114952},{\"lat\":-13.434922382121355,\"lng\":-76.13112506539468},{\"lat\":-13.4348653859179,\"lng\":-76.13159671294055},{\"lat\":-13.434880386572033,\"lng\":-76.13227855162462},{\"lat\":-13.434891234827738,\"lng\":-76.13268297755408},{\"lat\":-13.434845597494704,\"lng\":-76.1328888950594},{\"lat\":-13.434822021241029,\"lng\":-76.13330041920997},{\"lat\":-13.434810061654737,\"lng\":-76.1333941969149},{\"lat\":-13.434776658322551,\"lng\":-76.13400291737925},{\"lat\":-13.434734129412224,\"lng\":-76.13421666889646}]', '2025-02-19 11:42:17', NULL, NULL, 1, NULL, NULL, 'C'),
(178, 27, 170, '[{\"lat\":-13.433031951357611,\"lng\":-76.12025538032422},{\"lat\":-13.433029342528167,\"lng\":-76.12012797539602},{\"lat\":-13.433085432355089,\"lng\":-76.11970400928931},{\"lat\":-13.433103694156376,\"lng\":-76.11949479698615},{\"lat\":-13.433073692624957,\"lng\":-76.11945858716444},{\"lat\":-13.43316108837994,\"lng\":-76.11882969268997},{\"lat\":-13.433178045761542,\"lng\":-76.11862423529082},{\"lat\":-13.433236744380924,\"lng\":-76.1185840021556},{\"lat\":-13.433277181199252,\"lng\":-76.11855986227447},{\"lat\":-13.433311095944847,\"lng\":-76.11853840460235},{\"lat\":-13.433342195442311,\"lng\":-76.11796116514179},{\"lat\":-13.433340238822755,\"lng\":-76.11772848350975},{\"lat\":-13.433285453468757,\"lng\":-76.11754005832645},{\"lat\":-13.432573432968262,\"lng\":-76.11760614254807},{\"lat\":-13.432354509429926,\"lng\":-76.11767034352908},{\"lat\":-13.432315686120539,\"lng\":-76.11794290727047},{\"lat\":-13.432279755925263,\"lng\":-76.11822959506948},{\"lat\":-13.432236928334262,\"lng\":-76.11860756473052},{\"lat\":-13.43218996924419,\"lng\":-76.1190615286063},{\"lat\":-13.432118137289324,\"lng\":-76.11967438650612},{\"lat\":-13.43176452633359,\"lng\":-76.11961045291605},{\"lat\":-13.43148729417732,\"lng\":-76.11955894122929},{\"lat\":-13.431228367938333,\"lng\":-76.1195153553328},{\"lat\":-13.431126797710446,\"lng\":-76.11949657986969},{\"lat\":-13.431064185298593,\"lng\":-76.11949859152645},{\"lat\":-13.431023671800734,\"lng\":-76.1195046747947}]', '2025-02-19 11:43:29', NULL, NULL, 1, NULL, NULL, 'C'),
(179, 31, 171, '[{\"lat\":-13.438374075607406,\"lng\":-76.1291279497553},{\"lat\":-13.43789288831774,\"lng\":-76.12909964465841},{\"lat\":-13.437638123424898,\"lng\":-76.12908609846451},{\"lat\":-13.437554350849139,\"lng\":-76.12907915933314},{\"lat\":-13.437174561797226,\"lng\":-76.1290976204986},{\"lat\":-13.436787785407352,\"lng\":-76.1291146251542},{\"lat\":-13.436524077515154,\"lng\":-76.12912336493508},{\"lat\":-13.436408036881291,\"lng\":-76.12928569479631},{\"lat\":-13.436323903301442,\"lng\":-76.1296937258427},{\"lat\":-13.436210759604984,\"lng\":-76.1297051586854},{\"lat\":-13.435786542827094,\"lng\":-76.12965154759233},{\"lat\":-13.435499083536918,\"lng\":-76.12961244386887},{\"lat\":-13.435143554577172,\"lng\":-76.12956637718248},{\"lat\":-13.435068574143456,\"lng\":-76.12955860699199},{\"lat\":-13.4350171822749,\"lng\":-76.12960617093631},{\"lat\":-13.434959020615269,\"lng\":-76.13011891006232},{\"lat\":-13.43491806202509,\"lng\":-76.13047887186748},{\"lat\":-13.43492260474334,\"lng\":-76.13102935327865},{\"lat\":-13.434919816994693,\"lng\":-76.13112629639328},{\"lat\":-13.4348681714326,\"lng\":-76.1315978394931},{\"lat\":-13.434889402447489,\"lng\":-76.13255640622387},{\"lat\":-13.434893641762464,\"lng\":-76.1326828053237},{\"lat\":-13.434842805370149,\"lng\":-76.13288840443805},{\"lat\":-13.434823565397528,\"lng\":-76.13329978117666},{\"lat\":-13.434808376850471,\"lng\":-76.1333941505501},{\"lat\":-13.434777375723542,\"lng\":-76.13400478200498},{\"lat\":-13.434734129412224,\"lng\":-76.13421666889646}]', '2025-02-19 11:44:46', NULL, NULL, 1, NULL, NULL, 'C'),
(180, 15, 172, '[{\"lat\":-13.430029613694684,\"lng\":-76.11297304121621},{\"lat\":-13.430052870921358,\"lng\":-76.11323280182067},{\"lat\":-13.430034608887857,\"lng\":-76.11351577487174},{\"lat\":-13.429895034728704,\"lng\":-76.11377192583267},{\"lat\":-13.42971288862274,\"lng\":-76.11398321045326},{\"lat\":-13.429551138905545,\"lng\":-76.11419778717445},{\"lat\":-13.42942460880883,\"lng\":-76.11444589150832},{\"lat\":-13.429115457673337,\"lng\":-76.11496624005721},{\"lat\":-13.429007189459977,\"lng\":-76.11585807455467},{\"lat\":-13.429001971713523,\"lng\":-76.11591037763046},{\"lat\":-13.428916548940347,\"lng\":-76.11664247395002},{\"lat\":-13.428819226915824,\"lng\":-76.11744620353475},{\"lat\":-13.4287184546136,\"lng\":-76.11828341102645},{\"lat\":-13.428593228516672,\"lng\":-76.11938850880748},{\"lat\":-13.428558455640808,\"lng\":-76.11966527338899},{\"lat\":-13.428510191391508,\"lng\":-76.11988789673723},{\"lat\":-13.4284227939424,\"lng\":-76.11994019981302},{\"lat\":-13.427928872561518,\"lng\":-76.11979951712},{\"lat\":-13.42779581939358,\"lng\":-76.12037753316271},{\"lat\":-13.427505647453492,\"lng\":-76.12083480523168},{\"lat\":-13.427184497188687,\"lng\":-76.12139232220574},{\"lat\":-13.427089272574777,\"lng\":-76.12156130137367},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-20 09:27:33', NULL, NULL, 1, NULL, NULL, 'C'),
(181, 15, 173, '[{\"lat\":-13.42622807578486,\"lng\":-76.12283832786662},{\"lat\":-13.426285471653026,\"lng\":-76.12267739532572},{\"lat\":-13.42639113219264,\"lng\":-76.12228311060053},{\"lat\":-13.426498054765881,\"lng\":-76.12214823424611},{\"lat\":-13.426618064157783,\"lng\":-76.12197925507817},{\"lat\":-13.426793814948788,\"lng\":-76.12175300060967},{\"lat\":-13.426951653181186,\"lng\":-76.1215960913823},{\"lat\":-13.42698817771604,\"lng\":-76.12158804475526},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-20 09:30:03', NULL, NULL, 1, NULL, NULL, 'C'),
(182, 15, 174, '[{\"lat\":-13.427355523841037,\"lng\":-76.12398143483176},{\"lat\":-13.427196645289749,\"lng\":-76.12392023193985},{\"lat\":-13.427148380766566,\"lng\":-76.12390413868576},{\"lat\":-13.427037502771148,\"lng\":-76.12377271044403},{\"lat\":-13.426904449109042,\"lng\":-76.12361043679863},{\"lat\":-13.426824877766062,\"lng\":-76.12353667605072},{\"lat\":-13.42659076762576,\"lng\":-76.123268111053},{\"lat\":-13.426489020524924,\"lng\":-76.12319166809607},{\"lat\":-13.426374906773715,\"lng\":-76.12299851736671},{\"lat\":-13.426230684688255,\"lng\":-76.12284563145286},{\"lat\":-13.426385914389304,\"lng\":-76.12229033484755},{\"lat\":-13.42659593088388,\"lng\":-76.12201943173704},{\"lat\":-13.426774640427086,\"lng\":-76.12178607955275},{\"lat\":-13.42683334061298,\"lng\":-76.12172170653639},{\"lat\":-13.426953349837229,\"lng\":-76.12160234823523},{\"lat\":-13.427014918662907,\"lng\":-76.12160053041931},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-20 09:31:35', NULL, NULL, 1, NULL, NULL, 'C'),
(183, 15, 175, '[{\"lat\":-13.42896712685317,\"lng\":-76.12367536816973},{\"lat\":-13.428423033652114,\"lng\":-76.123577318207},{\"lat\":-13.428130838964606,\"lng\":-76.12349953414557},{\"lat\":-13.427664943579995,\"lng\":-76.1233627414858},{\"lat\":-13.427589285822124,\"lng\":-76.1235424494898},{\"lat\":-13.427526672487213,\"lng\":-76.12397696735022},{\"lat\":-13.427495365813632,\"lng\":-76.12403865815756},{\"lat\":-13.427166645494495,\"lng\":-76.12392600537893},{\"lat\":-13.42656820510305,\"lng\":-76.12327105681837},{\"lat\":-13.426502982601342,\"lng\":-76.12319220970403},{\"lat\":-13.42623590249495,\"lng\":-76.12284236364148},{\"lat\":-13.426397567819498,\"lng\":-76.12228707305222},{\"lat\":-13.426950654314746,\"lng\":-76.12161115638047},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-20 10:18:00', NULL, NULL, 1, NULL, NULL, 'C'),
(184, 15, 176, '[{\"lat\":-13.427756302048131,\"lng\":-76.12340173293555},{\"lat\":-13.42767379592166,\"lng\":-76.12337227658237},{\"lat\":-13.427592920389474,\"lng\":-76.12355064348186},{\"lat\":-13.427561613724542,\"lng\":-76.12378265456165},{\"lat\":-13.427505522606316,\"lng\":-76.12403075889553},{\"lat\":-13.427173161662528,\"lng\":-76.1239205597486},{\"lat\":-13.426703446089457,\"lng\":-76.12341550451919},{\"lat\":-13.426708663885883,\"lng\":-76.12341148120566},{\"lat\":-13.426563869992835,\"lng\":-76.12324652535125},{\"lat\":-13.426341466342585,\"lng\":-76.12297155061125},{\"lat\":-13.426234501329434,\"lng\":-76.12284682789206},{\"lat\":-13.426361447300303,\"lng\":-76.1223997624356},{\"lat\":-13.426392158475807,\"lng\":-76.12229013336632},{\"lat\":-13.426559128121864,\"lng\":-76.12208360327217},{\"lat\":-13.426723488753762,\"lng\":-76.12187036765549},{\"lat\":-13.426859836886555,\"lng\":-76.12170244252661},{\"lat\":-13.426913319259752,\"lng\":-76.12165282165984},{\"lat\":-13.426966801621013,\"lng\":-76.12159783637503},{\"lat\":-13.426999412811057,\"lng\":-76.12160722410658},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-20 10:19:23', NULL, NULL, 1, NULL, NULL, 'C'),
(185, 15, 177, '[{\"lat\":-13.428491602475926,\"lng\":-76.12081823457488},{\"lat\":-13.428414640538847,\"lng\":-76.12140429724464},{\"lat\":-13.428361074326215,\"lng\":-76.12181807132124},{\"lat\":-13.4283245500003,\"lng\":-76.12218687506079},{\"lat\":-13.42827498126338,\"lng\":-76.12261200518965},{\"lat\":-13.428263241297875,\"lng\":-76.12299287886977},{\"lat\":-13.428216281430108,\"lng\":-76.12324366541266},{\"lat\":-13.428196714815819,\"lng\":-76.12342113548638},{\"lat\":-13.428194800899341,\"lng\":-76.12344961851907},{\"lat\":-13.428245674093564,\"lng\":-76.12347509950472},{\"lat\":-13.428329158286347,\"lng\":-76.12350192159487},{\"lat\":-13.428436122365916,\"lng\":-76.1235448369391},{\"lat\":-13.428580915129372,\"lng\":-76.12355422467066},{\"lat\":-13.42878049420067,\"lng\":-76.12360250443292},{\"lat\":-13.428910937948421,\"lng\":-76.12364139646364},{\"lat\":-13.428924080434332,\"lng\":-76.12365480750871},{\"lat\":-13.428967764130697,\"lng\":-76.12367206882749},{\"lat\":-13.428761663025568,\"lng\":-76.12363585900579},{\"lat\":-13.42840424676536,\"lng\":-76.12356880378042},{\"lat\":-13.427926874707369,\"lng\":-76.12343681793554},{\"lat\":-13.427665313594074,\"lng\":-76.1233686704597},{\"lat\":-13.427592264724906,\"lng\":-76.12354167294116},{\"lat\":-13.427525738056861,\"lng\":-76.123964120861},{\"lat\":-13.42748731613106,\"lng\":-76.12402837216108},{\"lat\":-13.427172944713584,\"lng\":-76.123925107114},{\"lat\":-13.42657677999081,\"lng\":-76.12327736539395},{\"lat\":-13.42648807738732,\"lng\":-76.12316739482434},{\"lat\":-13.426343315731916,\"lng\":-76.12297258706786},{\"lat\":-13.426242872977813,\"lng\":-76.12283847661712},{\"lat\":-13.426398102670987,\"lng\":-76.12230069370963},{\"lat\":-13.426845634535987,\"lng\":-76.12172452637371},{\"lat\":-13.426974774887785,\"lng\":-76.12158907481846},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-20 13:05:00', NULL, NULL, 1, NULL, NULL, 'C'),
(186, 15, 178, '[{\"lat\":-13.427812303636289,\"lng\":-76.12041744406119},{\"lat\":-13.428128121010253,\"lng\":-76.12055746927192},{\"lat\":-13.428270305078343,\"lng\":-76.12061647787024},{\"lat\":-13.428446404495455,\"lng\":-76.12065805210997},{\"lat\":-13.428509176631582,\"lng\":-76.12066675870001},{\"lat\":-13.428500045556257,\"lng\":-76.12081830350935},{\"lat\":-13.428471347888703,\"lng\":-76.12099130599081},{\"lat\":-13.428381341545457,\"lng\":-76.1216202840048},{\"lat\":-13.428348730543208,\"lng\":-76.12189684012075},{\"lat\":-13.428312206215407,\"lng\":-76.12224284508368},{\"lat\":-13.428301770692167,\"lng\":-76.12233269908567},{\"lat\":-13.428284812965922,\"lng\":-76.12250301935812},{\"lat\":-13.428267855238479,\"lng\":-76.12292278506895},{\"lat\":-13.428265884950054,\"lng\":-76.12304739268953},{\"lat\":-13.428250231661991,\"lng\":-76.12307287367517},{\"lat\":-13.4282058806736,\"lng\":-76.12324721726114},{\"lat\":-13.42820066290973,\"lng\":-76.12329683812791},{\"lat\":-13.428192836263692,\"lng\":-76.12337556882702},{\"lat\":-13.428192836263692,\"lng\":-76.12342921300731},{\"lat\":-13.4282058806736,\"lng\":-76.12344798847042},{\"lat\":-13.428576994498124,\"lng\":-76.1235567529954},{\"lat\":-13.428792275940928,\"lng\":-76.12360934357203},{\"lat\":-13.428910979748453,\"lng\":-76.12363884787119},{\"lat\":-13.428937068489493,\"lng\":-76.12365225891627},{\"lat\":-13.428798798129673,\"lng\":-76.1236401889757},{\"lat\":-13.428077485030425,\"lng\":-76.12347536289693},{\"lat\":-13.427664872963476,\"lng\":-76.12335397171691},{\"lat\":-13.42758746088954,\"lng\":-76.12353551534608},{\"lat\":-13.42756267644623,\"lng\":-76.12378227857545},{\"lat\":-13.42751310755195,\"lng\":-76.12401831296876},{\"lat\":-13.427500063104384,\"lng\":-76.12403574732735},{\"lat\":-13.427180473917558,\"lng\":-76.12392041233971},{\"lat\":-13.426897031184001,\"lng\":-76.12360927609399},{\"lat\":-13.42650041978324,\"lng\":-76.1231613471885},{\"lat\":-13.426249965209323,\"lng\":-76.1228381410022},{\"lat\":-13.426406594011159,\"lng\":-76.12228042364514},{\"lat\":-13.426774079055317,\"lng\":-76.12179370448298},{\"lat\":-13.426984280472864,\"lng\":-76.12159822328053},{\"lat\":-13.427070341153938,\"lng\":-76.12160938811361}]', '2025-02-20 13:07:12', NULL, NULL, 1, NULL, NULL, 'C');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_marca`
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
) ENGINE=InnoDB AUTO_INCREMENT=12;

--
-- Volcado de datos para la tabla `tb_marca`
--

INSERT INTO `tb_marca` (`id_marca`, `marca`, `inactive_at`, `iduser_inactive`, `create_at`, `update_at`, `iduser_create`, `iduser_update`) VALUES
(1, 'TP-Link', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(3, 'Satra', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(4, 'CDATA', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(5, 'Huawei', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(6, 'Microtics', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(7, 'Phyhome', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(8, 'Omega', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(9, 'V-SOL', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(10, 'Generico', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL),
(11, 'Sin Marca', NULL, NULL, '2025-01-26 09:45:35', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_mufas`
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
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `mufa_uk_mufa` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=32;

--
-- Volcado de datos para la tabla `tb_mufas`
--

INSERT INTO `tb_mufas` (`id_mufa`, `nombre`, `descripcion`, `coordenadas`, `direccion`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'MF-DIST_3-MON', 'Mufa de particion', '-13.41893458450332,-76.15628775042316', 'Condominio Santa Rosa Sunampe', '2025-02-06 16:27:35', NULL, NULL, 1, NULL, NULL),
(2, 'MF-DIST-SF-004', 'Por Snata Fe Peru', '-13.429959657496903,-76.17500280539561', 'Baja del Socorro', '2025-02-06 16:46:11', NULL, NULL, 1, NULL, NULL),
(3, 'MF-DIST-SF-003', 'Por el estadio de Sunampe', '-13.428284134347114,-76.1669445824996', 'Av Primavera', '2025-02-06 17:24:40', NULL, NULL, 1, NULL, NULL),
(4, 'MF-DIST-SF-002', 'Av. Tupac Amaru', '-13.42838530966998,-76.16417511096424', 'Intersección', '2025-02-07 16:48:31', NULL, NULL, 1, NULL, NULL),
(5, 'MF-DIST-SF-001', 'Calle San Jose', '-13.42997295622689,-76.1606390029192', 'Calle San Jose', '2025-02-07 17:07:39', NULL, NULL, 1, NULL, NULL),
(6, 'MF-DIST_1', 'Carretera Sunampe', '-13.425586778170786,-76.15919738646637', 'Carretera Sunampe', '2025-02-07 17:18:10', NULL, NULL, 1, NULL, NULL),
(7, 'MF-DIST_2', 'Pasaje Paso De Gomez', '-13.424015750480569,-76.15558438514931', 'Pasaje Paso De Gomez', '2025-02-07 17:55:41', NULL, NULL, 1, NULL, NULL),
(8, 'MF-DIST_4', 'Av Huascar', '-13.418638744527968,-76.15257416912958', 'Av Huascar', '2025-02-07 23:39:16', NULL, NULL, 1, NULL, NULL),
(9, 'MF-DIST_5', 'Pasaje Villa Julia', '-13.417810575768458,-76.14785821873483', 'Pasaje Villa Julia', '2025-02-07 23:50:33', NULL, NULL, 1, NULL, NULL),
(10, 'MF-DIST-GR-001', 'Avenida Paraiso', '-13.418220058830505,-76.16001531792023', 'Avenida Paraiso', '2025-02-08 00:08:22', NULL, NULL, 1, NULL, NULL),
(11, 'MF-DIST-GR-002', 'Por el parque', '-13.416762383533575,-76.16649798276468', 'Capilla San pedro', '2025-02-08 01:06:10', NULL, NULL, 1, NULL, NULL),
(12, 'MF-DIST_8', 'Avenida Idelfonso', '-13.424019208853661,-76.1347292327218', 'Avenida Idelfonso', '2025-02-08 01:11:04', NULL, NULL, 1, NULL, NULL),
(13, 'MF-DIST-GR-003', 'Chinchaisuyo', '-13.40906226013356,-76.16084502097766', 'Chinchaisuyo', '2025-02-08 08:04:45', NULL, NULL, 1, NULL, NULL),
(14, 'MF-DIST-GR-006', 'Calle Rosario', '-13.397947884875087,-76.15653437875416', 'Calle Rosario', '2025-02-11 09:54:32', NULL, NULL, 1, NULL, NULL),
(15, 'MF-DIST_10', 'Av Cruz Blanca', '-13.427070341153938,-76.12160938811361', 'Av Cruz Blanca', '2025-02-11 10:13:45', NULL, NULL, 1, NULL, NULL),
(16, 'MF-DIST_9', 'Avenida Victoria', '-13.424995627543906,-76.12673610758547', 'Avenida Victoria', '2025-02-12 09:52:26', NULL, NULL, 1, NULL, NULL),
(17, 'MF-DIST-GR-008', 'Jiron Lima', '-13.396481312431991,-76.13858343011884', 'Avenida Bolognesi', '2025-02-12 10:16:39', NULL, NULL, 1, NULL, NULL),
(18, 'MF-DIST-GR-009', 'union de fibra principal', '-13.398442409195512,-76.13165742273162', '9 diciembre', '2025-02-12 12:10:37', NULL, NULL, 1, NULL, NULL),
(19, 'MF-DIST-GR-005', 'Calle Gonzales', '-13.403743713169362,-76.15877517687947', 'Calle Gonzales', '2025-02-13 08:41:06', NULL, NULL, 1, NULL, NULL),
(20, 'MF-DIST_12', 'Yendo para la izquierda en Av Progreso', '-13.434411463009098,-76.11637908656142', 'Avenida Progreso', '2025-02-13 10:31:02', NULL, NULL, 1, NULL, NULL),
(21, 'CajaMufa', 'Esquina de la plaza melchorita - salvador', '-13.391675931886226,-76.14800487132105', 'Jr. Sebastian Barranca', '2025-02-14 13:35:01', NULL, NULL, 1, NULL, NULL),
(22, 'MF-DIST-GR-007', 'por la Jr. Sebastian Barranca ', '-13.394009271568539, -76.14575381259645', 'C.15', '2025-02-14 14:01:02', NULL, NULL, 1, NULL, NULL),
(23, 'MF-DIST-GR-011', 'Avenida Satélite', '-13.385411929856193,-76.1201644457893', 'Avenida Satélite', '2025-02-14 16:06:24', NULL, NULL, 1, NULL, NULL),
(24, 'MF-DIST_7', 'Calle Jose Mariategui', '-13.42122479147426,-76.13957744506519', 'Calle Jose Mariategui', '2025-02-19 09:27:05', NULL, NULL, 1, NULL, NULL),
(25, 'MF-MINI_DIST_13', 'Avenida Progreso', '-13.43649155645403,-76.11561077808115', 'Condorillo Alto, Avenida Progreso', '2025-02-19 09:39:55', NULL, NULL, 1, NULL, NULL),
(26, 'MF-DIST_CHAC_1', 'Miguel Grau', '-13.425324433258302,-76.13996886427672', 'Miguel Grau', '2025-02-19 10:20:53', NULL, NULL, 1, NULL, NULL),
(27, 'MF-DIST_11', 'MF-DIST_11', '-13.431023671800734,-76.1195046747947', 'C. El Carmen', '2025-02-19 10:55:08', NULL, NULL, 1, NULL, NULL),
(28, 'MF-DIST_CHAC_2', 'Avenida San Martin', '-13.433040109910264,-76.1417313488188', 'Avenida San Martin', '2025-02-19 10:57:09', NULL, NULL, 1, NULL, NULL),
(29, 'MF-DIST_CHAC_3', 'Avenida Urbine Julve', '-13.43589586829866,-76.13726496209013', 'Avenida Urbine Julve', '2025-02-19 11:02:31', NULL, NULL, 1, NULL, NULL),
(31, 'MF-DIST_CHAC_4', 'Avenida Progreso', '-13.434734129412224,-76.13421666889646', 'Avenida Progreso', '2025-02-19 11:35:22', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_paquetes`
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
) ENGINE=InnoDB AUTO_INCREMENT=120;

--
-- Volcado de datos para la tabla `tb_paquetes`
--

INSERT INTO `tb_paquetes` (`id_paquete`, `id_servicio`, `paquete`, `precio`, `velocidad`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(48, '{\"id_servicio\":[3]}', 'Plan Internet 10MB', 50.00, '{\"bajada\":{\"maxima\":\"10\",\"minima_garantizada\":\"7\"},\"subida\":{\"maxima\":\"10\",\"minima_garantizada\":\"7\"}}', '2025-02-11 11:21:06', '2025-02-27 17:58:47', NULL, 1, 1, NULL),
(49, '{\"id_servicio\":[3]}', 'Plan Internet Duplica X6 180MB  50', 50.00, '{\"bajada\":{\"maxima\":\"180\",\"minima_garantizada\":\"126\"},\"subida\":{\"maxima\":\"180\",\"minima_garantizada\":\"126\"}}', '2025-02-11 11:26:29', '2025-02-27 17:53:50', NULL, 1, 1, NULL),
(50, '{\"id_servicio\":[1,3]}', 'Plan Internet Duo Bronce 110MB  80', 80.00, '{\"bajada\":{\"maxima\":\"110\",\"minima_garantizada\":\"77\"},\"subida\":{\"maxima\":\"110\",\"minima_garantizada\":\"77\"}}', '2025-02-12 10:25:10', '2025-02-27 17:53:37', NULL, 1, 1, NULL),
(51, '{\"id_servicio\":[3]}', 'Plan Internet 20MB', 50.00, '{\"bajada\":{\"maxima\":\"20\",\"minima_garantizada\":\"14\"},\"subida\":{\"maxima\":\"20\",\"minima_garantizada\":\"14\"}}', '2025-02-12 10:45:59', '2025-02-27 17:53:29', NULL, 1, 1, NULL),
(52, '{\"id_servicio\":[3]}', 'Plan Internet 30MB', 50.00, '{\"bajada\":{\"maxima\":\"30\",\"minima_garantizada\":\"21\"},\"subida\":{\"maxima\":\"30\",\"minima_garantizada\":\"21\"}}', '2025-02-12 11:28:46', '2025-02-27 17:53:19', NULL, 1, 1, NULL),
(53, '{\"id_servicio\":[3]}', 'Plan Internet 40MB', 70.00, '{\"bajada\":{\"maxima\":\"40\",\"minima_garantizada\":\"28\"},\"subida\":{\"maxima\":\"40\",\"minima_garantizada\":\"28\"}}', '2025-02-12 11:30:38', '2025-02-27 17:53:11', NULL, 1, 1, NULL),
(54, '{\"id_servicio\":[3]}', 'Plan Internet 50MB', 60.00, '{\"bajada\":{\"maxima\":\"50\",\"minima_garantizada\":\"35\"},\"subida\":{\"maxima\":\"50\",\"minima_garantizada\":\"35\"}}', '2025-02-12 11:32:02', '2025-02-27 17:53:00', NULL, 1, 1, NULL),
(55, '{\"id_servicio\":[3]}', 'Plan Internet 60MB', 50.00, '{\"bajada\":{\"maxima\":\"60\",\"minima_garantizada\":\"42\"},\"subida\":{\"maxima\":\"60\",\"minima_garantizada\":\"42\"}}', '2025-02-12 11:34:11', '2025-02-27 17:52:47', NULL, 1, 1, NULL),
(56, '{\"id_servicio\":[3]}', 'Plan Internet Games 70MB', 80.00, '{\"bajada\":{\"maxima\":\"70\",\"minima_garantizada\":\"49\"},\"subida\":{\"maxima\":\"70\",\"minima_garantizada\":\"49\"}}', '2025-02-12 11:35:02', '2025-02-27 17:52:28', NULL, 1, 1, NULL),
(57, '{\"id_servicio\":[3]}', 'Plan Internet 70MB', 60.00, '{\"bajada\":{\"maxima\":\"70\",\"minima_garantizada\":\"49\"},\"subida\":{\"maxima\":\"70\",\"minima_garantizada\":\"49\"}}', '2025-02-12 11:35:53', '2025-02-27 17:52:21', NULL, 1, 1, NULL),
(58, '{\"id_servicio\":[3]}', 'Plan Internet 80MB', 60.00, '{\"bajada\":{\"maxima\":\"80\",\"minima_garantizada\":\"56\"},\"subida\":{\"maxima\":\"80\",\"minima_garantizada\":\"56\"}}', '2025-02-12 11:37:36', '2025-02-27 17:52:15', NULL, 1, 1, NULL),
(59, '{\"id_servicio\":[3]}', 'Plan Internet Promo 85MB 3M', 50.00, '{\"bajada\":{\"maxima\":\"85\",\"minima_garantizada\":\"59\"},\"subida\":{\"maxima\":\"85\",\"minima_garantizada\":\"59\"}}', '2025-02-12 11:38:27', '2025-02-27 17:52:07', NULL, 1, 1, NULL),
(60, '{\"id_servicio\":[1]}', 'SERVICIO DIGITAL  CATV CATV 3 TV  BASICO', 50.00, '[]', '2025-02-12 12:16:05', '2025-02-13 17:13:53', NULL, 1, 1, NULL),
(61, '{\"id_servicio\":[3]}', 'Plan Internet 100MB', 80.00, '{\"bajada\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"},\"subida\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"}}', '2025-02-12 12:53:51', '2025-02-27 17:51:55', NULL, 1, 1, NULL),
(62, '{\"id_servicio\":[1]}', 'JUN056 PLAN DUO  01 TV   CATV  4 TV  BASICO  1 APL', 40.00, '[]', '2025-02-13 18:53:32', NULL, NULL, 1, NULL, NULL),
(63, '{\"id_servicio\":[1]}', 'MAY053 NUEVO SERVICIO CATV  3 TV  BASICO  50', 30.00, '[]', '2025-02-13 18:54:07', NULL, NULL, 1, NULL, NULL),
(64, '{\"id_servicio\":[1]}', 'MAY054 NUEVO SERVICIO SOLO CATV  3 TV  BASICO  1 APL', 40.00, '[]', '2025-02-13 18:58:10', NULL, NULL, 1, NULL, NULL),
(65, '{\"id_servicio\":[1]}', 'MAY055 NUEVO SERVICIO DUO CATV  4 TV  BASICO  1 APL', 30.00, '[]', '2025-02-13 18:58:38', NULL, NULL, 1, NULL, NULL),
(66, '{\"id_servicio\":[1]}', 'NUEVO SERVICIO AA  TV  2 DEC  1 ALP', 55.00, '[]', '2025-02-13 18:59:02', NULL, NULL, 1, NULL, NULL),
(67, '{\"id_servicio\":[1]}', 'NUEVO SERVICIO DUO TV 1 BASICO  1 DEC  1 APL', 35.00, '[]', '2025-02-13 19:00:50', NULL, NULL, 1, NULL, NULL),
(68, '{\"id_servicio\":[1]}', 'NUEVO SERVICIO DUO TV 2 BASICO  2 DEC  1 APL', 45.00, '[]', '2025-02-13 19:01:05', NULL, NULL, 1, NULL, NULL),
(69, '{\"id_servicio\":[1]}', 'NUEVO SERVICIO DUO TV 4 BASICO  2 DEC  1 APL ANT', 30.00, '[]', '2025-02-13 19:01:36', NULL, NULL, 1, NULL, NULL),
(70, '{\"id_servicio\":[1]}', 'RN051 SERV_DIGITAL 1T BASICO  20', 20.00, '[]', '2025-02-13 19:02:02', NULL, NULL, 1, NULL, NULL),
(71, '{\"id_servicio\":[1]}', 'SERVICIO A   TV    2 DEC   1  ALP', 35.00, '[]', '2025-02-13 19:02:16', NULL, NULL, 1, NULL, NULL),
(72, '{\"id_servicio\":[1]}', 'SERVICIO C  TV  4 DEC  1 ALP', 45.00, '[]', '2025-02-13 19:02:32', NULL, NULL, 1, NULL, NULL),
(73, '{\"id_servicio\":[1]}', 'SERVICIO DUO TV 1 BASICO   1 DEC 1 APL', 20.00, '[]', '2025-02-13 19:02:48', NULL, NULL, 1, NULL, NULL),
(74, '{\"id_servicio\":[1]}', 'SERVICIO DUO TV 3 BASICO   3 DEC 1 APL', 30.00, '[]', '2025-02-13 19:03:08', NULL, NULL, 1, NULL, NULL),
(75, '{\"id_servicio\":[3]}', 'Plan Internet Promo 100MB  3M', 60.00, '{\"bajada\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"},\"subida\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"}}', '2025-02-13 19:08:40', '2025-02-27 17:51:43', NULL, 1, 1, NULL),
(76, '{\"id_servicio\":[3]}', 'Plan Internet 110MB', 100.00, '{\"bajada\":{\"maxima\":\"110\",\"minima_garantizada\":\"77\"},\"subida\":{\"maxima\":\"110\",\"minima_garantizada\":\"77\"}}', '2025-02-13 19:10:09', '2025-02-27 17:51:36', NULL, 1, 1, NULL),
(77, '{\"id_servicio\":[3]}', 'Plan Internet MAR  120MB  55', 55.00, '{\"bajada\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"},\"subida\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"}}', '2025-02-13 19:10:48', '2025-02-27 17:51:29', NULL, 1, 1, NULL),
(78, '{\"id_servicio\":[3]}', 'Plan Internet Promo 150MB  3M', 95.00, '{\"bajada\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"},\"subida\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"}}', '2025-02-13 19:11:35', '2025-02-27 17:51:23', NULL, 1, 1, NULL),
(79, '{\"id_servicio\":[1,3]}', 'Plan Internet Full Duo 3  250MB  119', 119.00, '{\"bajada\":{\"maxima\":\"250\",\"minima_garantizada\":\"175\"},\"subida\":{\"maxima\":\"250\",\"minima_garantizada\":\"175\"}}', '2025-02-13 19:14:19', '2025-02-27 17:51:10', NULL, 1, 1, NULL),
(80, '{\"id_servicio\":[3]}', 'Plan Internet 105MB', 90.00, '{\"bajada\":{\"maxima\":\"105\",\"minima_garantizada\":\"74\"},\"subida\":{\"maxima\":\"105\",\"minima_garantizada\":\"74\"}}', '2025-02-13 19:15:38', '2025-02-27 17:50:54', NULL, 1, 1, NULL),
(81, '{\"id_servicio\":[3]}', 'Plan Internet 150MB', 110.00, '{\"bajada\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"},\"subida\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"}}', '2025-02-13 19:16:45', '2025-02-27 17:50:45', NULL, 1, 1, NULL),
(82, '{\"id_servicio\":[3]}', 'Plan Internet 220MB', 150.00, '{\"bajada\":{\"maxima\":\"220\",\"minima_garantizada\":\"154\"},\"subida\":{\"maxima\":\"220\",\"minima_garantizada\":\"154\"}}', '2025-02-13 19:17:53', '2025-02-27 17:50:33', NULL, 1, 1, NULL),
(83, '{\"id_servicio\":[3]}', 'Plan Internet 90MB', 70.00, '{\"bajada\":{\"maxima\":\"90\",\"minima_garantizada\":\"63\"},\"subida\":{\"maxima\":\"90\",\"minima_garantizada\":\"63\"}}', '2025-02-16 16:17:25', '2025-02-27 17:50:25', NULL, 1, 1, NULL),
(84, '{\"id_servicio\":[3]}', 'Plan Internet 125MB', 95.00, '{\"bajada\":{\"maxima\":\"125\",\"minima_garantizada\":\"88\"},\"subida\":{\"maxima\":\"125\",\"minima_garantizada\":\"88\"}}', '2025-02-16 16:19:04', '2025-02-27 17:50:17', NULL, 1, 1, NULL),
(85, '{\"id_servicio\":[3]}', 'Plan Internet 80MB  55', 55.00, '{\"bajada\":{\"maxima\":\"80\",\"minima_garantizada\":\"56\"},\"subida\":{\"maxima\":\"80\",\"minima_garantizada\":\"56\"}}', '2025-02-16 16:20:02', '2025-02-27 17:50:07', NULL, 1, 1, NULL),
(86, '{\"id_servicio\":[3]}', 'Plan Internet 100MB  65', 65.00, '{\"bajada\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"},\"subida\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"}}', '2025-02-16 16:20:47', '2025-02-27 17:50:00', NULL, 1, 1, NULL),
(87, '{\"id_servicio\":[3]}', 'Plan Internet 150MB  85', 85.00, '{\"bajada\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"},\"subida\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"}}', '2025-02-16 16:22:19', '2025-02-27 17:49:52', NULL, 1, 1, NULL),
(88, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA   200MB  90', 90.00, '{\"bajada\":{\"maxima\":\"200\",\"minima_garantizada\":\"140\"},\"subida\":{\"maxima\":\"200\",\"minima_garantizada\":\"140\"}}', '2025-02-16 16:22:55', '2025-02-27 17:49:45', NULL, 1, 1, NULL),
(89, '{\"id_servicio\":[3]}', 'Plan Internet Corporativo 300MB – 270', 270.00, '{\"bajada\":{\"maxima\":\"300\",\"minima_garantizada\":\"210\"},\"subida\":{\"maxima\":\"300\",\"minima_garantizada\":\"210\"}}', '2025-02-16 16:24:33', '2025-02-27 17:49:35', NULL, 1, 1, NULL),
(90, '{\"id_servicio\":[3]}', 'Plan Internet 280MB  150', 150.00, '{\"bajada\":{\"maxima\":\"280\",\"minima_garantizada\":\"196\"},\"subida\":{\"maxima\":\"280\",\"minima_garantizada\":\"196\"}}', '2025-02-16 16:26:52', '2025-02-27 17:49:28', NULL, 1, 1, NULL),
(91, '{\"id_servicio\":[1,3]}', 'Plan Internet Duo Bronce 110MB  80', 80.00, '{\"bajada\":{\"maxima\":\"77\",\"minima_garantizada\":0},\"subida\":{\"maxima\":\"77\",\"minima_garantizada\":0}}', '2025-02-16 16:28:06', NULL, '2025-02-16 16:50:40', 1, NULL, 1),
(92, '{\"id_servicio\":[1,3]}', 'Plan Internet Duo Oro 210MB  120', 120.00, '{\"bajada\":{\"maxima\":\"210\",\"minima_garantizada\":\"147\"},\"subida\":{\"maxima\":\"210\",\"minima_garantizada\":\"147\"}}', '2025-02-16 16:29:37', '2025-02-27 17:49:21', NULL, 1, 1, NULL),
(93, '{\"id_servicio\":[1,3]}', 'Plan Internet Full Duo 1  120MB   79', 79.00, '{\"bajada\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"},\"subida\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"}}', '2025-02-16 16:30:12', '2025-02-27 17:49:15', NULL, 1, 1, NULL),
(94, '{\"id_servicio\":[3]}', 'Plan Internet Full 100MB  55', 55.00, '{\"bajada\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"},\"subida\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"}}', '2025-02-16 16:31:58', '2025-02-27 17:49:08', NULL, 1, 1, NULL),
(95, '{\"id_servicio\":[3]}', 'Plan Internet Full 150MB  65', 65.00, '{\"bajada\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"},\"subida\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"}}', '2025-02-16 16:32:39', '2025-02-27 17:48:54', NULL, 1, 1, NULL),
(96, '{\"id_servicio\":[3]}', 'Plan Internet MAR 400MB  130', 130.00, '{\"bajada\":{\"maxima\":\"400\",\"minima_garantizada\":\"280\"},\"subida\":{\"maxima\":\"400\",\"minima_garantizada\":\"280\"}}', '2025-02-16 16:33:18', '2025-02-27 17:48:45', NULL, 1, 1, NULL),
(97, '{\"id_servicio\":[3]}', 'Plan Internet MAR 160MB  65', 65.00, '{\"bajada\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"},\"subida\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"}}', '2025-02-16 16:34:35', '2025-02-27 17:48:38', NULL, 1, 1, NULL),
(98, '{\"id_servicio\":[3]}', 'Plan Internet MAR 230MB  85', 85.00, '{\"bajada\":{\"maxima\":\"230\",\"minima_garantizada\":\"161\"},\"subida\":{\"maxima\":\"230\",\"minima_garantizada\":\"161\"}}', '2025-02-16 16:35:15', '2025-02-27 17:48:27', NULL, 1, 1, NULL),
(99, '{\"id_servicio\":[1,3]}', 'Plan Internet Full Duo 2  190MB  99', 99.00, '{\"bajada\":{\"maxima\":\"190\",\"minima_garantizada\":\"133\"},\"subida\":{\"maxima\":\"190\",\"minima_garantizada\":\"133\"}}', '2025-02-16 16:37:26', '2025-02-27 17:48:19', NULL, 1, 1, NULL),
(100, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 120MB  55', 55.00, '{\"bajada\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"},\"subida\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"}}', '2025-02-16 16:38:08', '2025-02-27 17:48:09', NULL, 1, 1, NULL),
(101, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 120MB  60', 60.00, '{\"bajada\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"},\"subida\":{\"maxima\":\"120\",\"minima_garantizada\":\"84\"}}', '2025-02-16 16:40:00', '2025-02-27 17:48:01', NULL, 1, 1, NULL),
(102, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 150MB  70', 70.00, '{\"bajada\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"},\"subida\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"}}', '2025-02-16 16:40:58', '2025-02-27 17:47:51', NULL, 1, 1, NULL),
(103, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 160MB  80', 80.00, '{\"bajada\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"},\"subida\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"}}', '2025-02-16 16:41:47', '2025-02-27 17:47:43', NULL, 1, 1, NULL),
(104, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 200MB  95', 95.00, '{\"bajada\":{\"maxima\":\"200\",\"minima_garantizada\":\"140\"},\"subida\":{\"maxima\":\"200\",\"minima_garantizada\":\"140\"}}', '2025-02-16 16:42:44', '2025-02-27 17:47:33', NULL, 1, 1, NULL),
(105, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 200MB  100', 100.00, '{\"bajada\":{\"maxima\":\"200\",\"minima_garantizada\":\"140\"},\"subida\":{\"maxima\":\"200\",\"minima_garantizada\":\"140\"}}', '2025-02-16 16:43:34', '2025-02-27 17:47:23', NULL, 1, 1, NULL),
(106, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 210MB  115', 115.00, '{\"bajada\":{\"maxima\":\"210\",\"minima_garantizada\":\"147\"},\"subida\":{\"maxima\":\"210\",\"minima_garantizada\":\"147\"}}', '2025-02-16 16:44:26', '2025-02-27 17:47:14', NULL, 1, 1, NULL),
(107, '{\"id_servicio\":[3]}', 'Plan Internet MAR 100MB  50', 50.00, '{\"bajada\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"},\"subida\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"}}', '2025-02-16 16:45:01', '2025-02-27 17:47:04', NULL, 1, 1, NULL),
(108, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 100MB  50', 50.00, '{\"bajada\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"},\"subida\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"}}', '2025-02-16 16:45:26', '2025-02-27 17:42:08', NULL, 1, 1, NULL),
(109, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 150MB  65', 65.00, '{\"bajada\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"},\"subida\":{\"maxima\":\"150\",\"minima_garantizada\":\"105\"}}', '2025-02-16 16:46:00', '2025-02-27 17:46:51', NULL, 1, 1, NULL),
(110, '{\"id_servicio\":[3]}', 'Plan Internet MIGRA 350MB  150', 150.00, '{\"bajada\":{\"maxima\":\"245\",\"minima_garantizada\":\"172\"},\"subida\":{\"maxima\":\"245\",\"minima_garantizada\":\"172\"}}', '2025-02-16 16:46:52', '2025-02-27 17:26:02', NULL, 1, 1, NULL),
(111, '{\"id_servicio\":[3]}', 'Plan Internet Corporativo 100MB', 80.00, '{\"bajada\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"},\"subida\":{\"maxima\":\"100\",\"minima_garantizada\":\"70\"}}', '2025-02-16 16:47:27', '2025-02-27 17:45:46', NULL, 1, 1, NULL),
(112, '{\"id_servicio\":[3]}', 'Plan Internet Corporativo 160MB', 150.00, '{\"bajada\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"},\"subida\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"}}', '2025-02-16 16:48:07', '2025-02-27 17:45:38', NULL, 1, 1, NULL),
(113, '{\"id_servicio\":[3]}', 'Plan Internet Corporativo 220MB', 210.00, '{\"bajada\":{\"maxima\":\"220\",\"minima_garantizada\":\"154\"},\"subida\":{\"maxima\":\"220\",\"minima_garantizada\":\"154\"}}', '2025-02-16 16:48:45', '2025-02-27 17:45:27', NULL, 1, 1, NULL),
(114, '{\"id_servicio\":[3]}', 'Plan Internet Corporativo 280MB', 250.00, '{\"bajada\":{\"maxima\":\"280\",\"minima_garantizada\":\"196\"},\"subida\":{\"maxima\":\"280\",\"minima_garantizada\":\"196\"}}', '2025-02-16 16:49:37', '2025-02-27 17:45:15', NULL, 1, 1, NULL),
(115, '{\"id_servicio\":[3]}', 'Plan Internet Duplica X6 280MB  60', 60.00, '{\"bajada\":{\"maxima\":\"280\",\"minima_garantizada\":\"196\"},\"subida\":{\"maxima\":\"280\",\"minima_garantizada\":\"196\"}}', '2025-02-16 16:51:35', '2025-02-27 17:45:01', NULL, 1, 1, NULL),
(116, '{\"id_servicio\":[3]}', 'Plan Internet Duplica X6 400MB  70', 70.00, '{\"bajada\":{\"maxima\":\"400\",\"minima_garantizada\":\"280\"},\"subida\":{\"maxima\":\"400\",\"minima_garantizada\":\"280\"}}', '2025-02-16 16:53:33', '2025-02-27 17:44:52', NULL, 1, 1, NULL),
(117, '{\"id_servicio\":[1,3]}', 'Plan Internet Duplica X6 Duo 1 160MB  79', 79.00, '{\"bajada\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"},\"subida\":{\"maxima\":\"160\",\"minima_garantizada\":\"112\"}}', '2025-02-16 16:54:18', '2025-02-27 17:44:37', NULL, 1, 1, NULL),
(118, '{\"id_servicio\":[1,3]}', 'Plan Internet Duplica X6 Duo 2 250MB  99', 99.00, '{\"bajada\":{\"maxima\":\"250\",\"minima_garantizada\":\"175\"},\"subida\":{\"maxima\":\"250\",\"minima_garantizada\":\"175\"}}', '2025-02-16 16:55:26', '2025-02-27 17:44:28', NULL, 1, 1, NULL),
(119, '{\"id_servicio\":[1,3]}', 'Plan Internet Duplica X6 Duo 3 350MB  119', 119.00, '{\"bajada\":{\"maxima\":\"350\",\"minima_garantizada\":\"245\"},\"subida\":{\"maxima\":\"350\",\"minima_garantizada\":\"245\"}}', '2025-02-16 16:56:08', '2025-02-27 17:44:19', NULL, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_personas`
--

DROP TABLE IF EXISTS `tb_personas`;
CREATE TABLE IF NOT EXISTS `tb_personas` (
  `id_persona` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_doc` char(3) NOT NULL,
  `nro_doc` varchar(15) NOT NULL,
  `apellidos` varchar(80) NOT NULL,
  `nombres` varchar(80) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=1156;

--
-- Volcado de datos para la tabla `tb_personas`
--

INSERT INTO `tb_personas` (`id_persona`, `tipo_doc`, `nro_doc`, `apellidos`, `nombres`, `telefono`, `nacionalidad`, `email`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'DNI', '41821854', 'De la Cruz Napa', 'Jose Ivan', '987654321', 'Peruano', 'delatelperu@gmail.com', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(2, 'DNI', '47110220', 'SANTOS HUAMAN', 'KATHERINE NEDDA', '923128301', 'Peruano', 'katherine20@gmail.com', '2025-02-08 00:35:09', NULL, NULL, 1, NULL, NULL),
(3, 'DNI', '21847928', 'DE LA CRUZ QUISPE', 'FRANCISCO', '945780584', 'Peruano', 'francisco28@hotmail.com', '2025-02-11 09:21:05', NULL, NULL, 1, NULL, NULL),
(4, 'DNI', '75862528', 'SOTELO ORELLANA', 'GLADYS DAYANA', '920587039', 'Peruano', 'lucas092522@gmail.com', '2025-02-11 10:39:06', NULL, NULL, 1, NULL, NULL),
(5, 'DNI', '46993859', 'VILLALOBOS ECHANDIA', 'ROBERTH JEFFERSON', '990533519', 'Peruano', 'ryve12@gmail.com', '2025-02-11 11:08:39', NULL, NULL, 1, NULL, NULL),
(6, 'DNI', '73605210', 'TOSCANO ERAZO', 'RODOLFO ANDRES', '995236149', 'Peruano', NULL, '2025-02-11 11:33:55', NULL, NULL, 12, NULL, NULL),
(7, 'DNI', '75423110', 'VENTURA VELASQUEZ', 'ALMENDRA MARYLIN', '915238410', 'Peruano', 'venturavelasquezalmendra@gmail.com', '2025-02-11 22:27:46', NULL, NULL, 1, NULL, NULL),
(8, 'DNI', '76430115', 'DE LA CRUZ NAPA', 'CRISTIAN JESUS', '962882183', 'Peruano', 'jesusdelacruznapa@gmail.com', '2025-02-11 22:29:08', NULL, NULL, 1, NULL, NULL),
(9, 'DNI', '48105695', 'DE LA CRUZ LEVANO', 'LUIS ENRIQUE', '904765268', 'Peruano', 'luisdelacruzlevano3@gmail.com', '2025-02-11 22:31:11', NULL, NULL, 1, NULL, NULL),
(10, 'DNI', '73884605', 'MATTA RAMOS', 'JESUS EDUARDO', '904217929', 'Peruano', 'Matta@gmail.com', '2025-02-12 09:29:43', '2025-02-26 17:28:53', NULL, 1, 1, NULL),
(11, 'DNI', '21815544', 'COLLACHAGUA TAYPE', 'PATRICIA ESTHER', '933513255', 'Peruano', NULL, '2025-02-12 10:25:36', NULL, NULL, 1, NULL, NULL),
(12, 'DNI', '70170364', 'SARAVIA DE LA CRUZ', 'GIOVANA FIORELLA', '954979068', 'Peruano', NULL, '2025-02-12 12:08:17', NULL, NULL, 12, NULL, NULL),
(13, 'DNI', '72845296', 'DE LA CRUZ PEÑALOZA', 'ELOY ALEXANDER', '920522529', 'Peruano', NULL, '2025-02-12 18:16:12', NULL, NULL, 14, NULL, NULL),
(14, 'DNI', '44195560', 'FLORES LOYOLA ', 'HENRY PAUL', '907324022', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(15, 'DNI', '43312934', 'FACHO LOZADA ', 'AUGUSTO IGNACIO', '998530990', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(16, 'DNI', '40339325', 'BARRUTIA NAPA ', 'GERMAN YSAIAS', '979420182', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(17, 'DNI', '21869870', 'BEGAZO PEÑALOZA ', 'MILAGROS LUCIA', '925019236', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(18, 'DNI', '21782120', 'RIQUELME APOLAYA VDA DE PEREZ ', 'GREGORIA ELISA', '956698366', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(19, 'DNI', '41576648', 'TASAYCO MAGALLANES ', 'ALICIA MARIA', '945857289', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(20, 'DNI', '75347649', 'CAMPOS VILLA ', 'JOHN WILLIAMS', '967061773', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(21, 'DNI', '80043769', 'MENDIGUETE CABRERA ', 'JUAN CARLOS', '957680344', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(22, 'DNI', '47516353', 'LOYOLA SARAVIA ', 'ROBERTO CARLOS', '928894378', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(23, 'DNI', '41639088', 'TUEROS DE LA CRUZ ', 'DAVID', '922641749', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(24, 'DNI', '32872532', 'PONTE CERNA ', 'MARIBEL RUDI', '923757401', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(25, 'DNI', '77564718', 'ABREGU NAPA ', 'FRANK ENRIQUE', '918104510', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(26, 'DNI', '40231558', 'GARCIA CASTILLA ', 'MARITZA', '917631665', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(27, 'DNI', '42567350', 'GIRAO ATUNCAR', 'JAVIER ORLANDO', '987013897', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(28, 'DNI', '45123518', 'CHAVEZ MARTINEZ ', 'MARTHA MARIA', '985192082', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(29, 'DNI', '41164414', 'TORRES DEL AGUILA ', 'DORA ESTHER', '991427548', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(30, 'DNI', '21878769', 'MAGALLANES ALMEYDA ', 'MARIA MIRTHA', '988564849', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(31, 'DNI', '21862703', 'GARCIA CARBAJAL ', 'MILAGRO MELCHORA', '966242063', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(32, 'DNI', '21854378', 'DE LA CRUZ MANRIQUE ', 'NOLBERTO FLORECINDO', '938429070', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(33, 'DNI', '46928659', 'TORRES TASAYCO ', 'CARLOS EDUARDO', '945170253', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(34, 'DNI', '21848813', 'ALMEYDA DE NAPA ', 'MARGARITA VICTORIA', '965189450', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(35, 'DNI', '46250661', 'PACHAS DIAZ', 'DAVID ERNESTO', '956022078', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(36, 'DNI', '21854605', 'ESPINOZA MUÑOZ ', 'LILIANA LASTENIA', '922393873', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(37, 'DNI', '21874058', 'SANCHEZ CRISOSTOMO ', 'JOSE ANTONIO', '922732835', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(38, 'DNI', '21854743', 'ALMEYDA GARCIA ', 'ABEL ARTURO', '914013935', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(39, 'DNI', '46175442', 'MAGALLANES CRISOSTOMO ', 'KATHERIN CINTHIA', '902642312', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(40, 'DNI', '47144583', 'GIRAO ATUNCAR ', 'LUIS CARLOS', '923311111', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(41, 'DNI', '41971143', 'SARAVIA YATACO ', 'ARMANDO FELIX', '979645543', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(42, 'DNI', '42050064', 'MARTINEZ CANCHARI ', 'JIMMY JOSSEF', '973997756', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(43, 'DNI', '21797192', 'DIAZ MAGALLANES ', 'SANTOS MANUEL', '925064547', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(44, 'DNI', '45082671', 'MESIAS GONZALES ', 'DIANA FIORELLA', '960544540', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(45, 'DNI', '21869687', 'SARAVIA BENDEZU', ' LUIS RICHARD', '975537912', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(46, 'DNI', '21877560', 'CONTRERAS ENRIQUEZ ', 'CARLOS JAVIER', '956118797', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(47, 'DNI', '44318338', 'SANDIGA DUEÑAS ', 'MARGARITA', '946312329', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(48, 'DNI', '46294714', 'TORRES ROMAN', ' KATHERINE MILAGROS', '938358973', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(49, 'DNI', '21845817', 'TASAYCO GARCIA ', 'DANIEL', '922771211', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(50, 'DNI', '41615897', 'ABURTO DE LA CRUZ ', 'CARMEN ROSA', '936972485', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(51, 'DNI', '41874688', 'BALLARTA BACA ', 'KATTY KARINA', '947107155', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(52, 'DNI', '47163450', 'GARCIA CASTILLA', 'JUAN JOSE', '977787595', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(53, 'DNI', '40521896', 'ROJAS AVALOS ', 'CARMEN ISABEL', '925286131', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(54, 'DNI', '46530930', 'UGAZ TORRES', 'HILDA ISABEL', '993253153', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(55, 'DNI', '79463514', 'TANIGUCHI CARDENAS ', 'JOSUE ALVARO', '902936610', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(56, 'DNI', '41300828', 'MAGALLANES TASAYCO', 'LUIS RAUL', '984262279', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(57, 'DNI', '73472203', 'MAGALLANES MURILLO ', 'MIOSIRY LILIANA', '902492034', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(58, 'DNI', '72761675', 'YATACO LEVANO ', 'JOSE LUIS', '915384222', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(59, 'DNI', '40149369', 'TORRES MARTINEZ ', 'YESENIA ALICSON', '923327015', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(60, 'DNI', '21856980', 'LAZARO CANCHARI ', 'NESTOR BALVIS', '930506450', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(61, 'DNI', '76564222', 'CARBAJAL NAVARRO', 'CRISTHIAN JUNIOR', '924343517', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(62, 'DNI', '70401928', 'SOTELO MATTA ', 'GUISELLA ESPERANZA', '929564075', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(63, 'DNI', '43350897', 'CHAVEZ YATACO ', 'JESUS ALBERTO', '921159983', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(64, 'DNI', '43073315', 'PAEZ SOTELO ', 'HELLEN VICTORIA', '991881274', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(65, 'DNI', '43081077', 'GARCIA GARIBAY ', 'EMILIA MELCHORITA', '977207233', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(66, 'DNI', '76699951', 'LEVANO VERGARA', 'PIERO ALEXANDER', '927288221', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(67, 'DNI', '21861430', 'TASAYCO TORRES ', 'MARITZA LILIANA', '904712454', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(68, 'DNI', '42697575', 'GONZALES NAPA ', 'WALTER MARTIN', '980105151', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(69, 'DNI', '21811546', 'DE LA CRUZ OLIVARES ', 'ROSA ALBINA', '984786637', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(70, 'DNI', '41413801', 'MARTINEZ QUIROGA ROMAIN ', 'VICTOR HUGO', '917631684', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(71, 'DNI', '70366439', 'SEBASTIAN SARAVIA ', 'JUNIOR RAFAEL', '968246931', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(72, 'DNI', '21866027', 'BELLEZA CARPIO VDA DE AROSTEGUI ', 'MARIBEL VIOLETA', '965808498', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(73, 'DNI', '21860894', 'HERRERA CASAS DE CHINCHAY ', 'MARIA ANTONIETA', '992870887', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(74, 'DNI', '46927424', 'CARBAJAL CASIANO ', 'NATHALY ROSSIEL', '916486489', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(75, 'DNI', '43097840', 'SANCHEZ MENDOZA ', 'SILVANA TEODORA', '966954909', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(76, 'DNI', '70365697', 'MESIAS TORRES ', 'MIRIAM MARLENI', '923160732', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(77, 'DNI', '21846794', 'CRISOSTOMO CUELLA ', 'LUIS ALFONSO', '949645226', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(78, 'DNI', '21866012', 'CHAVEZ ALMEYDA ', 'CAROLINA', '953309019', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(79, 'DNI', '72801045', 'BONIFACIO QUISPE ', 'EVER PABLO', '955182946', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(80, 'DNI', '06799544', 'DE LA CRUZ QUISPE ', 'LILIANA', '977265651', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(81, 'DNI', '45271647', 'MENDOZA VELASQUEZ', 'MARICRUZ', '998223499', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(82, 'DNI', '28296257', 'VENEGAS CHAUPIN ', 'PABLO', '998862290', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(83, 'DNI', '75813760', 'NESTAREZ MARTINEZ ', 'MERLY CANDY', '946046303', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(84, 'DNI', '44051352', 'QUISPE PAUCAR SANTA ', 'LUCIA EUGENIA', '921517689', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(85, 'DNI', '21881060', 'GONZALES FUENTES DE BONIFACIO ', 'AIDA JULIA', '902952341', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(86, 'DNI', '71616237', 'SARAVIA MEDINA ', 'LUIS', '977537270', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(87, 'DNI', '43650440', 'NAPA PRADO ', 'CESAR MARTIN ', '943395596', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(88, 'DNI', '43413495', 'MARTINEZ CASTILLA ', 'ANA CECILIA', '934981060', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(89, 'DNI', '44077389', 'FUENTES CHAVEZ ', 'LUIS ARMANDO', '937002689', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(90, 'DNI', '40956555', 'PACHAS LEVANO ', 'PATRICIA DEL PILAR', '964901936', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(91, 'DNI', '21880000', 'SARAVIA PACHAS ', 'LIDIA', '944804574', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(92, 'DNI', '48477799', 'PADILLA ACEVEDO', 'ARALI NERIDA', '997216682', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(93, 'DNI', '44071823', 'NAVARRETE QUISPE ', 'NELSON NOEL', '986252415', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(94, 'DNI', '21852326', 'GONZALES PEÑA', ' ANA YSABEL', '933227205', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(95, 'DNI', '41951909', 'SOTA PACHECO ', 'HARRY ANGEL', '934439107', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(96, 'DNI', '77100370', 'CASTAÑEDA SULCA', ' BRIGIDA DIONICIA', '991902168', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(97, 'DNI', '21879925', 'UCEDA GONZALES VDA DE PALOMINO ', 'TERESA SILVANA', '918709040', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(98, 'DNI', '44699525', 'CHACALIAZA CASTILLA ', 'MARIA ELENA', '989525107', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(99, 'DNI', '71717330', 'CURACA CUSIPUMA ', 'MANUEL ENRIQUE', '923144872', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(100, 'DNI', '41764623', 'CHUMBIAUCA ALMEYDA ', 'MARCELO', '933396143', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(101, 'DNI', '44338673', 'CHUMBIAUCA LEVANO ', 'LUIS', '971054315', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(102, 'DNI', '21882415', 'DE LA CRUZ HERNANDEZ ', 'RICHARD LEONARDO', '951138073', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(103, 'DNI', '73339209', 'ROJAS ALMEYDA ', 'ANNIE ARACELY', '981298961', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(104, 'DNI', '43271704', 'ALFONSO TORRES ', 'NOEMI MARLENY', '943699490', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(105, 'DNI', '46865852', 'TORRES SANCHEZ ', 'HUGO ALBERTO', '944323513', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(106, 'DNI', '42652351', 'NAPA ROJAS', ' HUGO EDUARDO', '969681623', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(107, 'DNI', '75449009', 'QUISPE VASQUEZ ', 'JOSE ALEXANDER', '939584261', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(108, 'DNI', '45470570', 'CHACALIAZA ATUNCAR ', 'HEBER TOMAS', '955974625', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(109, 'DNI', '06093318', 'YATACO VIDAL ', 'JAIME JUAN', '989058641', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(110, 'DNI', '70401918', 'VILLA CASTILLA ', 'NANCY', '947151746', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(111, 'DNI', '45851431', 'GALINDO SALAS ', 'LIZET', '972841510', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(112, 'DNI', '45715311', 'CARBAJAL SANCHEZ DE MARTINEZ ', 'ROSA ERLINDA', '952567956', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(113, 'DNI', '41731879', 'MARTINEZ MARTINEZ ', 'SONIA', '977873933', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(114, 'DNI', '46869547', 'DE LA CRUZ ABREGU ', 'GIAN CARLOS', '924144569', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(115, 'DNI', '43221317', 'VELASQUEZ DE LA CRUZ ', 'LUISA HERMELINDA', '969738812', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(116, 'DNI', '21869218', 'VASQUEZ MARTINEZ ', 'LUIS ALBERTO', '947821195', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(117, 'DNI', '46952075', 'SOTO NAPA ', 'OSWALDO GUSTAVO', '921574409', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(118, 'DNI', '45200955', 'GARCIA BAUTISTA ', 'MIRIAM LIZET', '975342591', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(119, 'DNI', '44483361', 'PEREZ ROMERO ', 'NELBIS MARIA', '934453865', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(120, 'DNI', '73479221', 'BONIFACIO BALLARTA ', 'SANDRA GIANELLA', '962496422', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(121, 'DNI', '21790332', 'GARCIA DE GARCIA ', 'GLADYS', '936707747', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(122, 'DNI', '21868131', 'MARCOS YATACO ', 'PILAR NELLY', '957727000', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(123, 'DNI', '46981135', 'DE LA CRUZ MESIAS ', 'ALEX GABRIEL', '955737034', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(124, 'DNI', '43515540', 'MAGALLANES GARCIA ', 'MARITZA', '912570529', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(125, 'DNI', '45442612', 'ORTIZ HERNANDEZ ', 'MARIANELLA', '946916479', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(126, 'DNI', '21861580', 'BALLENAS DELGADO ', 'ANA ETELVINA', '917289473', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(127, 'DNI', '74060396', 'HUAMAN VILLA ', 'ALINA JANETH', '923289467', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(128, 'DNI', '75675848', 'FELIX GARCIA ', 'DIEGO ERNESTO', '971110476', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(129, 'DNI', '21854655', 'LOPEZ MATEO ', 'SONIA ROSA', '953619455', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(130, 'DNI', '41721338', 'DE LA CRUZ MESIAS ', 'KARINA ORIELE', '945964998', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(131, 'DNI', '21883163', 'REBATTA MURGUEYTIO ', 'FERNANDO JAVIER', '968448124', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(132, 'DNI', '40730622', 'HERRERA BELLEZA ', 'LILIAM MELCHORITA', '961009005', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(133, 'DNI', '21884554', 'TASAYCO BAUTISTA ', 'OSWALDO ERNESTO', '946044404', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(134, 'DNI', '73879367', 'QUISPE NIETO ', 'MERLYN EDITH', '923965159', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(135, 'DNI', '75473800', 'TASAYCO MUÑOZ ', 'TANIA JAHAYRA', '945111670', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(136, 'DNI', '43085081', 'SARAVIA SEBASTIAN ', 'VERONICA', '984964759', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(137, 'DNI', '76920562', 'CLAROS MAGALLANES ', 'JERSON JESUS', '970855964', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(138, 'DNI', '42517738', 'NAPA CARBAJAL DE MENESES ', 'MARIA ELENA', '940088604', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(139, 'DNI', '72675040', 'MEDINA HUALLANCA ', 'MARIA ROCIO', '924930796', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(140, 'DNI', '47123316', 'ALMEYDA CAMPOS ', 'KARLA PAOLA', '984143087', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(141, 'DNI', '46096445', 'CRISOSTOMO CAMPOS ', 'RAUL', '963964118', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(142, 'DNI', '21866009', 'ARIAS ARENAS ', 'MARTHA MARIA', '945842114', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(143, 'DNI', '75660424', 'CHAVEZ YAURICASA ', 'MARCO ANTONIO', '906735817', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(144, 'DNI', '44840113', 'MEDINA ATUNCAR ', 'ANDY NOEL', '936474324', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(145, 'DNI', '71539460', 'CANTO PACHAS', ' DANIELA ELIZABETH', '938185031', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(146, 'DNI', '21882687', 'FUENTES HUAROTE ', 'PEDRO JOSHELIN', '936975821', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(147, 'DNI', '21808481', 'ATUNCAR DE LA CRUZ ', 'LUZ MARLENE', '965696392', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(148, 'DNI', '41784560', 'ALMEYDA SARAVIA ', 'PEDRO FERNANDO', '989621952', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(149, 'DNI', '40024626', 'ROQUE ARZAPALO ', 'CLAUDIO', '934223941', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(150, 'DNI', '43656887', 'SARAVIA MENDOZA', ' LIZ AURORA', '912649846', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(151, 'DNI', '45472467', 'HUAMAN GONZALES ', 'JOSE MANUEL', '958525363', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(152, 'DNI', '73822413', 'MARCOS MAGALLANES ', 'JESUS ALEXANDER', '957238058', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(153, 'DNI', '41008421', 'MAGALLANES LUDEÑA', ' ALEX', '960490261', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(154, 'DNI', '21883633', 'QUISPE DE LA CRUZ', ' JUAN MARCELINO', '982006028', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(155, 'DNI', '41525338', 'GONZALES FUENTES', ' JAVIER WILLIAM', '960687397', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(156, 'DNI', '42912738', 'CHICO YATACO ', 'MARISELA', '955267416', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(157, 'DNI', '41777372', 'CORDERO MURILLO ', 'MARIA ELENA', '982750916', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(158, 'DNI', '42139473', 'MIRNA PASACHE', ' LEGUA', '984001622', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(159, 'DNI', '73208845', 'VILLA TASAYCO ', 'JEISON JOSE', '919712420', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(160, 'DNI', '21846070', 'ALMEYDA LOPEZ ', 'LIVIA MARISOL', '981489826', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(161, 'DNI', '21873759', 'MATIAS PEÑALOZA ', 'JUAN CARLOS', '956894087', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(162, 'DNI', '42876347', 'ROJAS GUERRA ', 'EDGAR EDUARDO', '960329089', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(163, 'DNI', '73071885', 'MOQUILLAZA LEVANO ', 'CINTHIA JOHANNA', '991488690', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(164, 'DNI', '62723842', 'MOSCAYZA PEREZ ', 'JEREMI POOL', '997310787', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(165, 'DNI', '45204141', 'QUISPE MALDONADO ', 'JHONY', '981696000', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(166, 'DNI', '21870467', 'ROJAS TELLO ', 'YULIANA ELENA', '955928615', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(167, 'DNI', '21885316', 'TAIPE BONIFACIO', 'RUTH KARINA', '955227823', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(168, 'DNI', '21830221', 'CASTILLA HUAROTE ', 'FELIX', '914853211', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(169, 'DNI', '74417191', 'PACHAS PASACHE ', 'KAREN JACKELINE', '960636093', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(170, 'DNI', '41191803', 'TIPISMANA QUISPE ', 'RAMON DANIEL', '981088324', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(171, 'DNI', '43907394', 'FELIX GARCIA FLOR ', 'MEDALY', '976531454', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(172, 'DNI', '60752783', 'MAGALLANES APOLAYA', ' JULIANA HAYDEE', '986716266', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(173, 'DNI', '40607609', 'GARCIA URIBE ', 'GIOVANNY ALEXIS', '936451639', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(174, 'DNI', '21884053', 'CASTILLA ALMEYDA ', 'GIANINA', '926405217', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(175, 'DNI', '21783726', 'REYES APONTE ', 'LUIS MANUEL', '936457904', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(176, 'DNI', '72485056', 'MARTINEZ DE LA CRUZ', 'CARMEN DEL ROSARIO ', '933826012', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(177, 'DNI', '40597904', 'NUÑEZ CALDERON ', 'ISABEL ALICIA', '939309903', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(178, 'DNI', '21788723', 'PACHAS MARTINEZ ', 'JUANA', '991488690', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(179, 'DNI', '70312121', 'PACHAS ALBINO', 'CRISTIAN DANIEL ', '924244471', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(180, 'DNI', '17877650', 'MARTINEZ MARCHAN ', 'SUNILDA ISABEL', '961902563', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(181, 'DNI', '42508966', 'MENESES CRISOSTOMO ', 'MARITZA', '937337247', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(182, 'DNI', '42698548', 'ALMEIDA GARCIA', 'KATI NELLY', '980783090', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(183, 'DNI', '21519428', 'YARASCA PURAY', 'MANUEL YSMAEL ', '940380734', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(184, 'DNI', '41538126', 'TOVAR HUAMAN ', 'LIZ JESUS', '945506447', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(185, 'DNI', '40011025', 'MARCA MARCOS ', 'ELVIS VICTOR', '921796516', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(186, 'DNI', '71616251', 'CRISOSTOMO LEVANO', 'PEDRO MANUEL', '955127262', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(187, 'DNI', '41509694', 'CARBAJAL YATACO ', 'MIRTHA', '906877348', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(188, 'DNI', '75423421', 'CARDENAS TORRES ', 'NATALY PAMELA', '974310231', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(189, 'DNI', '76527110', 'BENDEZU FLORES', 'LUCIA MABEL', '994986103', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(190, 'DNI', '40907806', 'QUISPE PAUCAR ', 'MIRIAN ROXANA', '904275168', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(191, 'DNI', '70192574', 'TORRES RAMIREZ ', 'CHRISTIAN RONALD', '966649320', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(192, 'DNI', '75064714', 'LEVANO YATACO ', 'LIZETH MILAGROS', '956501165', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(193, 'DNI', '41440625', 'GARCIA GARCIA', 'JENY CECILIA', '923584871', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(194, 'DNI', '21859806', 'TORRES HUAMAN ', 'MARIA ISABEL', '904612007', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(195, 'DNI', '21799902', 'CESPEDES CANELO', 'GLADYS DORA', '932233737', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(196, 'DNI', '21815108', 'HERRERA TALLA', 'JOSE FREDY', '923014014', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(197, 'DNI', '21782325', 'HERRERA TALLA ', 'EDNA CLEMENCIA', '936301541', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(198, 'DNI', '44570382', 'TASAYCO DE LA CRUZ ', 'PEDRO JUAN', '952911138', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(199, 'DNI', '44310344', 'HERRERA MARTINEZ ', 'LUZ MILAGROS', '936706095', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(200, 'DNI', '44221625', 'VENTURA SALDAÑA', 'JUISSELLA', '949474917', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(201, 'DNI', '21847118', 'ROJAS BACIGALUPO ', 'CARMELA LEONOR', '950902644', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(202, 'DNI', '75800215', 'CRUZ SALAZAR ', 'ANDREA KINBERLY', '934907696', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(203, 'DNI', '47871520', 'CASTILLON CANCHERO', 'MELISSA JOHAN', '955444012', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(204, 'DNI', '21878465', 'LLIUYA PEVE', 'JAVIER WILIAN', '924638884', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(205, 'DNI', '41886432', 'NAPA MENESES ', 'MARITZA LUZ', '902746205', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(206, 'DNI', '08998598', 'VIOLETA GUTIERREZ ', 'GUILLERMO FELICIANO', '997588370', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(207, 'DNI', '41637533', 'SANCHEZ ARIAS ', 'RICHARD', '918058219', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(208, 'DNI', '40803237', 'AYBAR VALENCIA ', 'MARIN', '956287582', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(209, 'DNI', '21866433', 'CHUQUISPUMA PEVE ', 'FLOR MARLENE', '980574228', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(210, 'DNI', '75832418', 'SALDAÑA CHUQUISPUMA ', 'DIANA ROSMERY', '918572837', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(211, 'DNI', '40117370', 'GUERRA DE LA CRUZ ', 'MARIA YSABEL', '924428077', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(212, 'DNI', '41096335', 'VILLAR CASTILLO ', 'GUILIANA BERENIZ', '976790809', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(213, 'DNI', '06567453', 'JANAMPA GOMEZ', 'MAXIMO', '902102201', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(214, 'DNI', '40798009', 'JANAMPA QUISPE ', 'MARISOL', '933716900', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(215, 'DNI', '46411847', 'MANRIQUE GUERRA ', 'JOSE JOEL', '902288927', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(216, 'DNI', '42064586', 'AVALOS SARAVIA', 'RODOLFO AGUSTIN', '944706287', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(217, 'DNI', '44353513', 'CHACALIAZA ABREGU ', 'MARIA ROSAURA', '912796500', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(218, 'DNI', '48947197', 'RIOJAS PEREZ ', 'CATHERINE YAJAYRA', '955295107', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(219, 'DNI', '70051411', 'TASAYCO PEÑALOZA ', 'MIGUEL ANGEL', '912209926', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(220, 'DNI', '42360247', 'NAVARRO SARAVIA ', 'JUAN RONALD', '917695094', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(221, 'DNI', '76000980', 'MAGALLANES CASAS ', 'VICTOR ALEXANDER', '912616041', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(222, 'DNI', '45361929', 'CASTILLA MESIAS ', 'LETICIA LISSET', '994479206', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(223, 'DNI', '48224177', 'TELLO ARMAS ', 'JULIAN', '971344982', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(224, 'DNI', '40554177', 'LAZARO CANCHARI ', 'DELFIN EDGAR', '956790341', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(225, 'DNI', '40055313', 'QUISPE CHUQUISPUMA ', 'SANTA SILVESTRA', '934666371', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(226, 'DNI', '47519367', 'TORRES BARRIOS ', 'DANIEL GERARDO', '996285735', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(227, 'DNI', '41785064', 'ALMEYDA MAGALLANES', 'YSABEL', '959920227', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(228, 'DNI', '42277973', 'CORDERO MURILLO ', 'MARGARITA', '937061341', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(229, 'DNI', '44338677', 'MANRIQUE CHUQUISPUMA ', 'LUIS WALTER', '961760053', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(230, 'DNI', '47822603', 'DOZA MELO ', 'KATERINE JANET', '998133221', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(231, 'DNI', '21862344', 'HERRERA VILLA ', 'JORGE LUIS', '996003661', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(232, 'DNI', '21859950', 'CHUQUISPUMA ', 'PEVE JUANA', '961760053', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(233, 'DNI', '45879381', 'LLIUYA CHUQUISPUMA ', 'MARIA ESTHER', '982013421', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(234, 'DNI', '21881530', 'AVILES CASTILLA ', 'NECY ARIANA', '938865246', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(235, 'DNI', '48014534', 'MATEO CABRERA ', 'LOURDES ISABEL', '959932272', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(236, 'DNI', '21846225', 'ROSAS ROJAS ', 'JAVIER ELMER', '956946577', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(237, 'DNI', '60610091', 'MARTINEZ LUIS ', 'NEYRA LESLIE', '935267119', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(238, 'DNI', '73753896', 'PADILLA CASTILLA ', 'MONICA YASMIN', '918890415', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(239, 'DNI', '21887823', 'MAGALLANES GARCIA', 'JULIO CESAR', '953433332', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(240, 'DNI', '21887537', 'VILLA CASTILLA ', 'MAGDALENA', '955063711', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(241, 'DNI', '21883620', 'PAUCAR CASTILLON ', 'DIONISIA CECILIA', '952695823', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(242, 'DNI', '72628484', 'NAVARRETE QUISPE ', 'LUZ ELENA', '963276494', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(243, 'DNI', '21846318', 'NAPA CRISOSTOMO ', 'RUBEN BAUTISTA', '902874390', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(244, 'DNI', '70365628', 'GARCIA YATACO ', 'RONALD STALIN', '954642849', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(245, 'DNI', '41869258', 'ATUNCAR DE LA CRUZ ', 'VICTOR CESAR', '902051563', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(246, 'DNI', '21846116', 'CRISOSTOMO CUELLAR ', 'ARNALDO', '955017366', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(247, 'DNI', '21577420', 'RAMOS AQUIJE ', 'EDDY GILMORE', '936932786', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(248, 'DNI', '47123327', 'ALMEYDA DE LA CRUZ ', 'JHONY JAVIER', '947398631', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(249, 'DNI', '41130761', 'MALLQUI ANAYA ', 'SALUSTIA', '906520807', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(250, 'DNI', '48615183', 'ATUNCAR ROJAS ', 'MARIA LUISA', '938606559', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(251, 'DNI', '47711960', 'LLANOS CHUQUISPUMA', 'JESUS ALBERTO', '970671187', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(252, 'DNI', '46657184', 'ALMEYDA MAGALLANES ', 'ALEJANDRO', '981557714', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(253, 'DNI', '42027104', 'MARTINEZ CASTILLA ', 'MARIA YSABEL', '943594389', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(254, 'DNI', '21877465', 'OLIVERO TORRES ', 'GLORIA YSABEL', '977349625', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(255, 'DNI', '74069744', 'OCHOA ALMEYDA', 'JOSE LUIS', '946215112', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(256, 'DNI', '41398673', 'ALMEYDA PACHAS ', 'MAGALY TRIPSY', '993059870', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(257, 'DNI', '41394395', 'MAGALLANES ALMEYDA ', 'VICTOR', '912389935', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(258, 'DNI', '41256049', 'GONZALES ATUNCAR ', 'MARIA VICTORIA', '924052883', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(259, 'DNI', '41159105', 'ROJAS MAGALLANES ', 'OLGA', '900544587', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(260, 'DNI', '73195681', 'TORRES ATUNCAR ', 'FRANK LUIS', '944209364', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(261, 'DNI', '21817739', 'PEVE GUTIERREZ ', 'JHON ROBINSON', '971906846', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(262, 'DNI', '71592530', 'HUAMAN TASAYCO ', 'ANGEL GIOMAR', '970555978', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(263, 'DNI', '21867429', 'FELIX ATUNCAR ', 'WALTER ALFREDO', '933094403', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(264, 'DNI', '43904616', 'PEÑA VERA ', 'MARIELLA ROSALIA', '963512439', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(265, 'DNI', '43145534', 'SANTIAGO NAPA ', 'JHON ROBERT', '921430485', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(266, 'DNI', '74277308', 'APOLAYA CUBILLAS ', 'ODALINA ESTEFANY', '945633600', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(267, 'DNI', '72919856', 'TASAYCO HERNANDEZ ', 'JESSICA FABIOLA', '900773704', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(268, 'DNI', '44774398', 'ECHABAUTIS NAVARRO ', 'CINTHYA VANESSA', '983154132', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(269, 'DNI', '41171884', 'HUAMAN HUARAKCA ', 'CARMEN ', '917812810', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(270, 'DNI', '48001247', 'VILCAMIZA QUISPE ', 'YESSICA LOURDES', '982442867', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(271, 'DNI', '46128265', 'VALENZUELA VILCAS ', 'CARLOS DAVID', '962632282', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(272, 'DNI', '77273006', 'AZURIN QUISPE ', 'LUIS ANGEL', '940707598', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(273, 'DNI', '21864746', 'YATACO HERRERA ', 'LUIS EDUARDO', '920314089', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(274, 'DNI', '41536457', 'MESIAS MAGALLANES ', 'ROBERT', '980520938', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(275, 'DNI', '44249106', 'TASAYCO LOPEZ ', 'CARMEN DEL ROSARIO ', '926265816', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(276, 'DNI', '09267192', 'PRIETO LOYOLA', 'REYNALDO', '941310699', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(277, 'DNI', '71572853', 'SIFUENTES CRISOSTOMO ', 'MARYORI DARLIN', '933866327', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(278, 'DNI', '40734466', 'MORON TIPIANI ', 'YSABEL', '971756497', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(279, 'DNI', '41996473', 'SALDAÑA CHUQUISPUMA', 'SARA LUZ', '997134524', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(280, 'DNI', '80060253', 'MENESES TORRES ', 'VICTOR', '954494022', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(281, 'DNI', '41676070', 'LEVANO CANTO ', 'CARLOS ALBERTO', '960581966', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(282, 'DNI', '45123508', 'AVALOS MENDOZA ', 'YENY LISSET', '964970347', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(283, 'DNI', '70605584', 'ABREGU MAGALLANES ', 'FERNANDO ALEXANDER', '921393880', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(284, 'DNI', '70099633', 'VILLA MAGALLANES ', 'CARMEN RUBI', '943076964', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(285, 'DNI', '77501764', 'AQUINO MAGALLANES', 'JASON', '902244127', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(286, 'DNI', '41112617', 'HUAMAN VILLA ', 'CARLOS ALBERTO', '969553656', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(287, 'DNI', '76598077', 'LEVANO PEÑA', 'DANIEL ALBERTO', '936353217', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(288, 'DNI', '72288789', 'BELINSKY PACHECO ', 'ALEXANDRA', '924658925', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(289, 'DNI', '42408411', 'VILLA TASAYCO', 'JOSE', '987776269', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(290, 'DNI', '44889335', 'CASTILLA ALMEYDA ', 'EVELYN LISSETE', '998002707', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(291, 'DNI', '77813385', 'TORRES MENDOZA ', 'FELICITA BEATRIZ', '919703341', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(292, 'DNI', '75780955', 'NAVARRETE CARBAJAL ', 'ROSARIO DEL PILAR', '950922462', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(293, 'DNI', '40088068', 'CASTILLA MUNAYCO ', 'MANUEL ELISBAN', '956053142', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(294, 'DNI', '21886108', 'NAPA YATACO ', 'ZULLY TERESA', '955918541', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(295, 'DNI', '44080780', 'VILLAVICENCIO SALVADOR ', 'MARTIN GUILLERMO', '961616597', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(296, 'DNI', '21885259', 'PEÑA YATACO ', 'JUAN CESAR', '981474206', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(297, 'DNI', '46363463', 'MATIAS ALMEYDA ', 'MIGUEL ANGEL', '908537121', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(298, 'DNI', '21851670', 'SAENZ MAGALLANES', 'JULIO CESAR', '944121137', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(299, 'DNI', '45828199', 'DE LA CRUZ LEVANO ', 'FIORELLA DAMARI', '916435601', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(300, 'DNI', '42286515', 'FELIPA LOPEZ ', 'JORGE LUIS', '995533288', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(301, 'DNI', '76481774', 'DE LA CRUZ ALMEYDA ', 'SUSANA JASMIN', '979952853', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(302, 'DNI', '21863667', 'GONZALES PEÑA ', 'MARIA ESTHER', '947265609', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(303, 'DNI', '21860997', 'SANCHEZ NAPA ', 'PAUL ANTONIO', '980375431', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(304, 'DNI', '48674029', 'GUEVARA ORTIZ ', 'KARLA MELISSA', '928787131', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(305, 'DNI', '21851781', 'CASACHAGUA LARA ', 'LILIANA ALICIA', '928270969', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(306, 'DNI', '70098756', 'YATACO MAGALLANES ', 'MILAGROS MARCELA', '912363109', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(307, 'DNI', '21819456', 'SARAVIA DE YATACO ', 'MARITSA YSABEL', '922706526', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(308, 'DNI', '21838938', 'MORON RONCEROS ', 'ADALBERTO GUILLERMO', '933142570', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(309, 'DNI', '76307312', 'SARAVIA LEVANO ', 'MARYORI', '943735454', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(310, 'DNI', '72784530', 'VASQUEZ VELASQUEZ ', 'ALEXANDRA LISSETH', '935553369', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(311, 'DNI', '21886051', 'PACHAS SANCHEZ ', 'ALFREDO CARLOS', '940601252', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(312, 'DNI', '45027045', 'CORDOVA DE LA CRUZ ', 'ABIMAEL FERNANDO', '971202140', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(313, 'DNI', '21807490', 'VILLAVICENCIO GONZALES ', 'ORLANDO LUIS', '955939014', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(314, 'DNI', '61722783', 'HUARANGA GARCIA ', 'YULIANA MAGDALENA', '973471423', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(315, 'DNI', '74171164', 'GUERRA MARTINEZ ', 'MARIA MILAGROS', '937339253', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(316, 'DNI', '46416248', 'RUIZ CLAVIJO ', 'PAOLA', '942592138', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(317, 'DNI', '41756071', 'OLIVA NUÑEZ ', 'NEY SIGILFREDO', '962462961', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(318, 'DNI', '21873605', 'SOLARI MAGALLANES', 'JULIO CESAR', '956682879', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(319, 'DNI', '21785115', 'MAGALLANES ROSSI', 'PAULO FELIX', '942811373', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(320, 'DNI', '46690623', 'SANCHEZ ALMEYDA ', 'WILLIAM ARMANDO', '930999115', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(321, 'DNI', '41794523', 'MAGALLANES PEREZ', 'ZOILA', '987820479', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(322, 'DNI', '70249186', 'PACHAS YATACO ', 'MIRTHA YESENIA', '920787827', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(323, 'DNI', '73146866', 'ATUNCAR MENESES ', 'BRYAN ALEXANDER', '931220798', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(324, 'DNI', '70746467', 'GARCIA OCHOA ', 'ERICK MIGUEL', '902257913', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(325, 'DNI', '21784064', 'CARBAJAL TASAYCO ', 'ALBERTO', '930647571', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(326, 'DNI', '21868987', 'YATACO GONZALES ', 'ROSA ESTHER', '950008220', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(327, 'DNI', '22303840', 'SARAVIA VELA ', 'ROCIO HAYDEE', '981168789', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(328, 'DNI', '46113663', 'AVALOS MUÑOZ ', 'CYNTHIA MARIBEL', '998980535', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(329, 'DNI', '45048639', 'RODRIGUEZ PEÑA ', 'PEDRO CLAUDIO ALEJANDRO', '934573535', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(330, 'DNI', '72671572', 'TIPIAN ROJAS ', 'SONIA THALIA', '936083538', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(331, 'DNI', '44953237', 'ROJAS QUISPE ', 'KARY DEL ROCIO', '959207013', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(332, 'DNI', '40552662', 'SARAVIA SOLARI ', 'YULIANA SARITA', '947502742', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(333, 'DNI', '44749019', 'DE LA CRUZ CONTRERAS ', 'RICHARD JESUS', '944498166', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(334, 'DNI', '21869970', 'SALVADOR ABURTO ', 'ANA MARIA', '960295992', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(335, 'DNI', '21867558', 'YATACO MAGALLANES ', 'JORGE', '956615324', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(336, 'DNI', '44602371', 'GONZALES AQUIJE ', 'ANGELINA CAROLINA NATHALY', '930595896', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(337, 'DNI', '70312540', 'MAGALLANES GARCIA', 'LUZ MARLENY', '972016952', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(338, 'DNI', '43083022', 'TORRES BELLEZA ', 'SAYRA ELIZABETH', '933390388', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(339, 'DNI', '42739534', 'CORDOVA DE LA CRUZ ', 'JORGE LUIS', '952037051', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(340, 'DNI', '44535961', 'CHUMBIAUCA ALMEYDA ', 'ELIZABETH', '978741188', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(341, 'DNI', '41774253', 'MORAN MEJIA ', 'PEDRO PABLO', '925673523', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(342, 'DNI', '61298144', 'DAGA MENDOZA ', 'WALTER JESUS', '970991577', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(343, 'DNI', '72872536', 'VALENCIA SARAVIA', 'ELIZABETH', '950162295', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(344, 'DNI', '73438744', 'ALMEYDA APOLAYA ', 'LUCERO JANET', '984190711', 'Peruano', NULL, '2025-02-13 15:49:26', NULL, NULL, 1, NULL, NULL),
(345, 'DNI', '21873758', 'ROJAS RAMOS', 'SONIA MAGALY', '955366521', 'Peruano', NULL, '2025-02-13 17:39:58', NULL, NULL, 14, NULL, NULL),
(347, 'DNI', '47335674', 'PALOMINO CHUQUISPUMA', 'PATRICIA EVELYN', '995231528', 'Peruano', NULL, '2025-02-14 10:44:56', NULL, NULL, 12, NULL, NULL),
(348, 'DNI', '45991585', 'MARTINEZ LOZANO', 'DENIS IVAN', '955519879', 'Peruano', NULL, '2025-02-14 14:25:48', NULL, NULL, 1, NULL, NULL),
(349, 'DNI', '73175109', 'MATIAS ROMERO', 'BLANCA ROSA', '912095908', 'Peruano', NULL, '2025-02-17 12:52:50', NULL, NULL, 12, NULL, NULL),
(350, 'DNI', '76079364', 'FUENTES DE LA CRUZ ', 'FATIMA DEL ROSARIO', '971900192', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(351, 'DNI', '74624844', 'TORRES ROMAN ', 'JUNIOR SMITH', '993219508', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(352, 'DNI', '46932240', 'YATACO NAVARRETE ', 'MARIA JULIA', '937602720', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(353, 'DNI', '44321772', 'ALMEYDA AMORETTI ', 'YESSYCA', '936761846', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(354, 'DNI', '73261084', 'GARCIA HERNANDEZ ', 'LEYLA CONSUELO', '972159681', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(355, 'DNI', '21849573', 'TORRES AVALOS ', 'ALEJANDRO', '998232755', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL);
INSERT INTO `tb_personas` (`id_persona`, `tipo_doc`, `nro_doc`, `apellidos`, `nombres`, `telefono`, `nacionalidad`, `email`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(356, 'DNI', '77227968', 'TIPISMANA PACHAS', 'CARMEN LUCERO', '993874055', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(357, 'DNI', '21845970', 'PACHAS SANCHEZ ', 'DORIS MARLENE', '993448961', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(358, 'DNI', '44857660', 'GUTIERREZ PACHAS ', 'CESAR FERNANDO', '966739081', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(359, 'DNI', '76933413', 'MELO YATACO ', 'MAYRA ALEJANDRA', '956561140', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(360, 'DNI', '70051105', 'VILLA SARAVIA ', 'MARIA GLADYS', '925452697', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(361, 'DNI', '42704332', 'MAGALLANES TASAYCO', 'JUAN JESUS', '984202663', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(362, 'DNI', '43107478', 'NAPA AVALOS ', 'JUAN JOSE', '946132109', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(363, 'DNI', '73648566', 'CARBAJAL PACHAS ', 'FIORELLA RUBI', '951875925', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(364, 'DNI', '21815052', 'ROJAS MARCELO ', 'AQUILES', '998322738', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(365, 'DNI', '41445602', 'PARIONA POMA', 'LUIS ALBERTO', '946414460', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(366, 'DNI', '61577404', 'CHIQUILLAN CUYA MAYUMI ', 'GLADYS ZADITH', '918893400', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(367, 'DNI', '42827804', 'PORTILLA NAPA ', 'MARIA ESTHER', '946186473', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(368, 'DNI', '45537164', 'MOLINA CENTURION ', 'MARIA EDITHA', '958905246', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(369, 'DNI', '71605480', 'CORDOVA DE LA CRUZ ', 'JUNIOR GIANCARLOS', '935266044', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(370, 'DNI', '72382087', 'MUÑOZ ATUNCAR ', 'RUBEN CARLOS', '938606559', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(371, 'DNI', '46698006', 'ROMERO ROJAS', 'JOHANNY CAROLINA', '977693143', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(372, 'DNI', '21786233', 'ATUNCAR TASAYCO ', 'GILDA ESTHER', '958608401', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(373, 'DNI', '74723667', 'GUERRA TAIPE ', 'WILLIAMS ALBERTO', '956322166', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(374, 'DNI', '21851052', 'ALMEYDA SOLARI ', 'BERTHA GLADYS', '948643610', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(375, 'DNI', '77707275', 'FELIX TASAYCO ', 'YANELLA CRISTEL', '904712454', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(376, 'DNI', '45852739', 'DE LA CRUZ JACOBO ', 'JULIO CESAR', '902575234', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(377, 'DNI', '43560624', 'ALMEYDA AMORETTI ', 'EDGAR', '955618902', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(378, 'DNI', '43683214', 'HERRERA QUISPE ', 'LUIS GUINER', '973686147', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(379, 'DNI', '21807491', 'SALVADOR DE VILLAVICENCIO ', 'ANA GLADYS', '955939014', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(380, 'DNI', '70394563', 'TORRES LUJAN ', 'ALEJANDRO JUNIOR', '967858313', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(381, 'DNI', '47689502', 'CHACALIAZA GUERRA ', 'ANDERSON', '915144529', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(382, 'DNI', '70312109', 'MAGALLANES SALVADOR ', 'VICTOR ALEXIS', '993189596', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(383, 'DNI', '42501542', 'MARTINEZ SARAVIA ', 'KARINA JHOANNA', '932425236', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(384, 'DNI', '21867380', 'AVALOS MENDOZA ', 'MARIA DEL ROSARIO', '945695618', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(385, 'DNI', '46956509', 'CHAVEZ NEYRA ', 'VICTOR EUSEBIO', '969187145', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(386, 'DNI', '72888104', 'MAGALLANES OLIVERO', 'JAVIER ENRIQUE', '983771337', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(387, 'DNI', '71592476', 'ALMEYDA ATUNCAR ', 'MIRIAN LUCIA', '977988671', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(388, 'DNI', '71787045', 'MEDRANO SALDAÑA ', 'MARIA DEL CARMEN', '956782898', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(389, 'DNI', '45712101', 'MENDIGUETE ALMEYDA ', 'LUIS ALBERTO', '922101351', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(390, 'DNI', '07597465', 'LEVANO DE LA CRUZ ', 'FRANCISCA ESTHER', '956505830', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(391, 'DNI', '21863308', 'CASAS ANTON ', 'MARIA JESUS', '934499161', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(392, 'DNI', '41878632', 'MATIAS MATIAS ', 'ANIBAL', '956149489', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(393, 'DNI', '76033387', 'AVALOS FLORES ', 'YENNY LISETH', '934604492', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(394, 'DNI', '45749438', 'RAMOS GONZALES ', 'ALVARO', '969741529', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(395, 'DNI', '46145068', 'YATACO VELASQUEZ ', 'ANGEL DOMINGO', '906144833', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(396, 'DNI', '71652939', 'LEVANO ALMEYDA ', 'GIANELLA ANGELINA', '966116387', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(397, 'DNI', '21849411', 'ROJAS PACHAS ', 'JACINTO', '997007429', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(398, 'DNI', '42791418', 'MATIAS PEÑALOZA ', 'CRISTIAN GUSTAVO', '982856336', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(399, 'DNI', '45669104', 'HERRERA MARTINEZ ', 'AUGUSTO ALFREDO', '960468616', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(400, 'DNI', '76427502', 'RAMOS BALTAZAR', ' MAGDIEL', '952354786', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(401, 'DNI', '45751439', 'ALFONSO HUAMAN ', 'YOEL ALFREDO', '942635751', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(402, 'DNI', '47259336', 'LOYOLA RAMOS ', 'MARTIN', '977321025', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(403, 'DNI', '74077126', 'LUNA SANCHEZ ', 'EVA PATRICIA', '901357088', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(404, 'DNI', '46237598', 'MAMANI GUTIERREZ ', 'MARIA ALEJANDRA', '974458138', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(405, 'DNI', '75961820', 'MAGALLANES HUAMAN ', 'MIRIAM ELIZABETH', '918717283', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(406, 'DNI', '43780022', 'MAGALLANES HERRERA ', 'MARITZA', '989975830', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(407, 'DNI', '42023932', 'TORRES RAMOS ', 'HENRY', '987820479', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(408, 'DNI', '74151769', 'FELIX LEVANO ', 'EDWIN EDUARDO', '974341388', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(409, 'DNI', '70482572', 'VASQUEZ ZAPATA ', 'JESSICA KATHERINE', '956271875', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(410, 'DNI', '41004962', 'CARBAJAL HERRERA ', 'PABLO ADOLFO', '939110955', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(411, 'DNI', '70096168', 'ABREGU SALVADOR ', 'LEONARDO', '904950388', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(412, 'DNI', '71615898', 'ALMEYDA TORRES ', 'NICOLL DAYANNA', '955336277', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(413, 'DNI', '43510116', 'TORRES TASAYCO ', 'VICTOR HUGO', '922397715', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(414, 'DNI', '21817823', 'CANCHERO PABLO ', 'FLOR VERONICA', '966131936', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(415, 'DNI', '80085329', 'NAPA FUENTES', ' DAVID', '981000846', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(416, 'DNI', '74841780', 'YATACO RAMIREZ ', 'ADRIANA NICOLE', '921083607', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(417, 'DNI', '15359608', 'PALLIN HUARCAYA ', 'CARLOS AURELIO', '918102342', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(418, 'DNI', '73262665', 'CASTILLA YATACO ', 'MARIA ESTHEFANI', '980539380', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(419, 'DNI', '21847790', 'CRISOSTOMO RIVADENEYRA', 'GLADYS', '912344640', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(420, 'DNI', '45900579', 'ROJAS TORNERO ', 'ENERT JOEL', '956646869', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(421, 'DNI', '74684837', 'REQUEJO GUERRA ', 'JANNET', '922306155', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(422, 'DNI', '29714569', 'LEON CHAMBI', 'JUANA ROSA', '934325672', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(423, 'DNI', '41872411', 'DE LA CRUZ GONZALES ', 'KARINA HILDA', '946307544', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(424, 'DNI', '74684828', 'CUADROS ECHANDIA ', 'SEBASTIAN YAIR', '912405510', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(425, 'DNI', '48591427', 'MARTINEZ DE LA CRUZ ', 'RICHARD ANTHONY', '946489470', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(426, 'DNI', '40461640', 'DIAZ ROJAS ', 'ENEIDA ZULEMA', '975290503', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(427, 'DNI', '21859181', 'CASTRO AVALOS ', 'LUIS FERNANDO', '924213934', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(428, 'DNI', '43550706', 'FLORES VALENZUELA ', 'MARIA JACKELINE', '955552511', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(429, 'DNI', '21881200', 'CASAS DE LA CRUZ ', 'ELIZABETH', '998350397', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(430, 'DNI', '75187066', 'CASTILLA MARCOS ', 'DIANA CAROLINA', '907063071', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(431, 'DNI', '21878192', 'FELIX MARCOS ', 'VERONICA GLORIA', '965691720', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(432, 'DNI', '45106081', 'BENDEZU INCACUTIPA ', 'RAUL ALDO', '999563187', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(433, 'DNI', '72857031', 'VASCONSUELOS NAPA ', 'DENILSON ADAMIR', '934752206', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(434, 'DNI', '46614328', 'SARAVIA YATACO ', 'MARIA ELISETH', '922424182', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(435, 'DNI', '42433139', 'CARDENAS GONZALES ', 'MARISSA CRISTINA', '991398572', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(436, 'DNI', '40928463', 'YATACO PACHAS ', 'KARINA DEL PILAR', '946971404', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(437, 'DNI', '21881638', 'FLORES CHAVEZ ', 'GIOVANNA MARISOL', '956004149', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(438, 'DNI', '45200880', 'CHAVEZ CONTRERAS ', 'DORA ESTHER', '955582387', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(439, 'DNI', '21811821', 'SANCHEZ NAPA ', 'ROCIO PATRICIA', '967775894', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(440, 'DNI', '44545567', 'CALDERON TASAYCO ', 'BIANCA FABIOLA', '913598494', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(441, 'DNI', '74866616', 'ANTON QUISPE ', 'BRITNEY ROSALINDA', '904659396', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(442, 'DNI', '21875905', 'HUARANCCA ESPINOZA ', 'EVER', '939843367', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(443, 'DNI', '75832428', 'YATACO MAGALLANES ', 'ANGEL DAVID', '906800381', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(444, 'DNI', '44533511', 'MARALLANO FLORES ', 'CATHERIN JULISSA', '931260639', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(445, 'DNI', '45200940', 'PAUCAR CASTILLON', 'ANGEL GABINO', '976317985', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(446, 'DNI', '41407576', 'DIAZ MOREYRA ', 'JESUS ANGEL', '931272155', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(447, 'DNI', '15359111', 'ROMERO GARRIAZO ', 'JOSE ALBERTO', '981295133', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(448, 'DNI', '47501937', 'MENDOZA ALMEYDA ', 'VICTOR JEAN PIERRE', '943899710', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(449, 'DNI', '32135963', 'TASAYCO YOVERA ', 'ERIKA MELCHORITA', '950579561', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(450, 'DNI', '43610105', 'AMARO FERNANDEZ CORNEJO', ' LUIS MIGUEL', '995389364', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(451, 'DNI', '21813235', 'DE LA CRUZ LUYO ', 'ALCIDES', '936436485', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(452, 'DNI', '43718176', 'MUCHAYPIÑA AGUILAR ', 'WILMER OMAR', '993900359', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(453, 'DNI', '21810864', 'AGUILAR HERNANDEZ DE MUCHAYPIÑA ', 'MARIA ELIZABETH', '956791396', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(454, 'DNI', '75667436', 'PACHAS ALARCON ', 'JOSELYN JANET', '997923269', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(455, 'DNI', '45725093', 'MONTOYA CARDENAS ', 'LUIS ENRIQUE', '989357193', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(456, 'DNI', '80689141', 'MORALES CAMACHO ', 'MARLENI FLOR', '986221665', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(457, 'DNI', '73211691', 'CHUQUISPUMA RAMOS ', 'BRYAN ANTHONY', '961760002', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(458, 'DNI', '72517098', 'PASTOR ROJAS ', 'PATRICIA DEL  PILAR', '924594304', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(459, 'DNI', '44591663', 'MARTINEZ YATACO ', 'VERONICA LISSET', '903045849', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(460, 'DNI', '21879894', 'ATUNCAR ROJAS ', 'ARMANDO FRANCISCO', '954076020', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(461, 'DNI', '73102201', 'ROSAS LAY ', 'KEVIN', '986233200', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(462, 'DNI', '45906527', 'SOTELO LOAYZA', 'ANGELA ADRIANA', '941853932', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(463, 'DNI', '73424093', 'SARAVIA MUNAYCO ', 'JORGE ARTURO', '923161067', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(464, 'DNI', '71460150', 'ALBINO YATACO ', 'JERSON ALEXANDER', '923984492', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(465, 'DNI', '70480530', 'ROJAS ALMEYDA ', 'MARTIN ARMANDO', '927796090', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(466, 'DNI', '21875575', 'GONZALES ATUNCAR ', 'CARLOS JOSE', '937650700', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(467, 'DNI', '41181909', 'HUAMAN SARAVIA ', 'WILLIAM MIGUEL', '922854023', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(468, 'DNI', '76172948', 'HERNANDEZ NAPA ', 'CARLOS EDUARDO', '982692592', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(469, 'DNI', '75842283', 'MARTINEZ MACHARI ', 'ALEXANDER ANDERSON', '926767635', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(470, 'DNI', '42981781', 'HERRERA LEVANO ', 'ANA MARIA', '975338281', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(471, 'DNI', '75509612', 'GALLEGOS SANCHEZ ', 'CARMEN DEL ROSARIO', '974088503', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(472, 'DNI', '40969839', 'CUEVA RICOPA ', 'SEGUNDO DAVID', '983112493', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(473, 'DNI', '41739278', 'CHACALIAZA CASTILLA ', 'EDITH MARYSOL', '970370666', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(474, 'DNI', '75833408', 'MAURICIO SARAVIA ', 'RENZO', '918737827', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(475, 'DNI', '48510379', 'SOTELO RAMOS ', 'WILLIAN ALEXANDER', '922095735', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(476, 'DNI', '76242101', 'ALVAREZ CHUQUISPUMA ', 'LUZ MARIA', '939497895', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(477, 'DNI', '43976098', 'SEBASTIAN FLORES ', 'DEYCI YOVANA', '955401079', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(478, 'DNI', '76568304', 'CHUQUISPUMA QUISPE', 'SANDRA CAROLINA', '984393444', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(479, 'DNI', '75891442', 'GUERRA QUISPE ', 'ANA GABRIELA', '981558182', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(480, 'DNI', '61659340', 'SAYRITUPAC DIAZ ', 'MELUSCA', '942625411', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(481, 'DNI', '21868569', 'GUTIERREZ QUISPE', 'SOFIA EDITH', '941026194', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(482, 'DNI', '72966586', 'LEVANO DE LA CRUZ ', 'DEXTER JAIR', '923441928', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(483, 'DNI', '21873647', 'RAMIREZ TASAYCO ', 'OSWALDO', '954952739', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(484, 'DNI', '21852100', 'ALFONSO TORRES ', 'GREGORIO ALFREDO', '954052720', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(485, 'DNI', '46496820', 'DE LA CRUZ TASAYCO ', 'GILBERTO', '992863041', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(486, 'DNI', '21886144', 'SARAVIA SEBASTIAN ', 'YANNINA', '934102473', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(487, 'DNI', '45098503', 'CONDEÑA ESPINOZA ', 'WALTER AQUILES', '989846043', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(488, 'DNI', '46699310', 'MENDOZA YATACO ', 'CYNTHIA NATALY', '946092056', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(489, 'DNI', '21877109', 'SOLANO DE LA CRUZ ', 'MIGUEL', '933852105', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(490, 'DNI', '40860292', 'NAPA CASTILLA ', 'GUSTAVO ANTONIO', '902712199', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(491, 'DNI', '78825818', 'MAGALLANES CASAS ', 'STEFANY BRIDID', '974714703', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(492, 'DNI', '22309356', 'ORTIZ CASTILLA ', 'YESENIA', '900776069', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(493, 'DNI', '74033840', 'CALDERON NUÑEZ ', 'JHON MARCOS', '959870368', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(494, 'DNI', '62721790', 'SARAVIA ATUNCAR ', 'ANGELO ALEXANDER', '', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(495, 'DNI', '74143501', 'GARCIA MENDOZA ', 'WALTER FELIPE', '', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(496, 'DNI', '45747936', 'HUAMAN SARAVIA ', 'JULIO MARTIN', '993506186', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(497, 'DNI', '75661021', 'GARCIA MENDIGUETE ', 'ELISET', '990345375', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(498, 'DNI', '45048431', 'MAGALLANES HUAMAN ', 'CAROL JUDITH', '933451565', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(499, 'DNI', '74945376', 'ORMEÑO YATACO ', 'ARACELY MILAGROS ', '960333676', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(500, 'DNI', '75901224', 'ALVARADO JUAREZ ', 'ANTHONY JACOB', '967591253', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(501, 'DNI', '21847095', 'ROJAS BACIGALUPO ', 'CESAR ANTONIO', '956064829', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(502, 'DNI', '40813108', 'SARAVIA TORRES ', 'TERESA YSABEL', '951679716', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(503, 'DNI', '09736546', 'BENITES BOCANEGRA ', 'FRANCISCO HERMAN', '993656810', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(504, 'DNI', '40679555', 'NAPA MARTINEZ ', 'MARIA', '923694440', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(505, 'DNI', '75178691', 'ATUNCAR ALMEYDA ', 'ANGEL JESUS', '977655697', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(506, 'DNI', '41834203', 'ROJAS CONTRERAS ', 'CECILIA', '943326467', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(507, 'DNI', '46132681', 'TORRES FAJARDO ', 'ERICK JOHANY', '902301220', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(508, 'DNI', '41405135', 'ROJAS PACHAS ', 'YOVANA VANESA', '904410306', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(509, 'DNI', '75957606', 'CASTAÑEDA SULCA ', 'ROSA LINDA', '900648734', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(510, 'DNI', '71440787', 'ATUNCAR ALMEYDA ', 'DIEGO ALFONSO', '949792659', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(511, 'DNI', '62892038', 'ALVAREZ CHUQUISPUMA ', 'JHAN MARTIN', '924702432', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(512, 'DNI', '44521340', 'BOGA SIGUAS ', 'GIANCARLO', '995734338', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(513, 'DNI', '21882395', 'HUARANCA DURAND ', 'VICTOR', '932904801', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(514, 'DNI', '42777407', 'DIAZ TASAYCO ', 'CARLOS YVAN', '908601428', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(515, 'DNI', '74035877', 'DAVILA DIAZ ', 'HILDA XIOMARA', '904354801', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(516, 'DNI', '80487137', 'DE LA CRUZ ABREGU ', 'MIGUEL ANGEL', '917163741', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(517, 'DNI', '45682504', 'TASAYCO ARIAS ', 'GREGORIO JHONATHAN', '947700239', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(518, 'DNI', '21873544', 'CASTILLA RIQUELME ', 'ALEXANDER', '952683121', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(519, 'DNI', '41748230', 'ANGULO LOYOLA ', 'JHAN CARLOS', '998308628', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(520, 'DNI', '44771538', 'ALMEYDA NAPA ', 'GLORIA', '942370984', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(521, 'DNI', '48040901', 'MATIAS CRISOSTOMO ', 'ANGEL ALBERTO', '933241678', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(522, 'DNI', '48222293', 'APOLAYA ROMERO ', 'NELZI KATHERINY', '922693855', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(523, 'DNI', '71789730', 'CUADROS SARAVIA ', 'DIANA CAROLINA', '927744936', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(524, 'DNI', '23019806', 'JUAREZ TORRES ', 'LUCY YAMALI', '967591253', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(525, 'DNI', '21794453', 'MELO GUERRA ', 'ANSELMO', '904830949', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(526, 'DNI', '44972815', 'NAPA CASTILLA ', 'OSCAR JAVIER', '908696006', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(527, 'DNI', '45778769', 'BRICEÑO DEL RIO ', 'FREDY JHON', '906166950', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(528, 'DNI', '72977459', 'AVILES GUZMAN ', 'SERGIO JHOSSUA ', '904587978', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(529, 'DNI', '21857534', 'VELARDE ORTIZ ', 'SANTA ANGELICA', '960999975', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(530, 'DNI', '21881955', 'TASAYCO MENDOZA ', 'LILIANA CATALINA', '912180079', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(531, 'DNI', '21794090', 'MAGALLANES ORTIZ ', 'VICTOR LUIS', '912074015', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(532, 'DNI', '41075262', 'QUISPE PACHAS ', 'RONNY PAUL', '994980680', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(533, 'DNI', '60454449', 'PEREZ TERRONES ', 'GRETY', '912143217', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(534, 'DNI', '44364538', 'VASQUEZ CHUQUISPUMA ', 'RUTH ESTHER', '972573295', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(535, 'DNI', '21876020', 'ALVAREZ CUEVA ', 'MARTIN WILLIAM', '964347449', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(536, 'DNI', '41455781', 'MENESES TASAYCO ', 'BLANCA MARIBEL', '947102131', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(537, 'DNI', '41637529', 'QUISPE SANCHEZ ', 'LINO', '945160889', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(538, 'DNI', '21862542', 'YATACO GARCIA DE GARCIA ', 'NELLY', '912707222', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(539, 'DNI', '41730654', 'CASTILLA MATEO ', 'JUAN CARLOS', '', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(540, 'DNI', '41893651', 'MENESES CRISOSTOMO ', 'MARILU', '916728107', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(541, 'DNI', '43210229', 'PEVE GUERRA ', 'OSWALDO EFRAIN', '914717616', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(542, 'DNI', '21879369', 'HUANQUI TRILLO ', 'JUAN JOSE', '956487878', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(543, 'DNI', '71835943', 'QUISPE SOTELO ', 'LAURO FIDEL', '966727569', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(544, 'DNI', '21846189', 'PACHAS SANCHEZ', 'LUIS ARMANDO', '947146086', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(545, 'DNI', '42869491', 'DE LA CRUZ TORRES', 'LUIS ALBERTO', '937233140', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(546, 'DNI', '41854580', 'MARTINEZ MINAYA ', 'HUGO ANDRES', '', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(547, 'DNI', '42416159', 'ATUNCAR ALMEYDA ', 'MARIA FRANCISCA', '960481575', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(548, 'DNI', '47140229', 'BAUTISTA TAYPE', 'JOEL ANGEL', '904370223', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(549, 'DNI', '74375228', 'LLOYSE ATHALY ', 'MELO LOZA', '', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(550, 'DNI', '21850623', 'DE LA CRUZ PACHAS ', 'PEDRO ENRIQUE', '906071409', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(551, 'DNI', '45255187', 'CENTENO VALENCIA ', 'KARINA ABIGAI', '982904223', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(552, 'DNI', '15439628', 'CAMPOS BARRIOS ', 'JUANA MILAGROS', '956517578', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(553, 'DNI', '40905473', 'MARTINEZ VILLAR ', 'EPIFANIA CLEMENCIA', '971615965', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(554, 'DNI', '45252181', 'DIAZ REBATTA', 'EDDER RUBEN', '994323996', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(555, 'DNI', '72082086', 'LOBO MENESES ', 'LUIS ALFONSO', '930197086', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(556, 'DNI', '41135592', 'HUANQUI TRILLO ', 'NAYADE SAIDA ', '960169072', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(557, 'DNI', '47898813', 'GENTILLE GUTARRA ', 'CRISTAL', '934444810', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(558, 'DNI', '44176871', 'BARILLAS PEVE ', 'DANIEL CERAFIN', '995029580', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(559, 'DNI', '21866254', 'GARCIA MARTINEZ ', 'CECILIA PATRICIA', '947929771', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(560, 'DNI', '43628022', 'SANTIAGO SARAVIA ', 'VICTOR HUGO', '920654635', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(561, 'DNI', '21815949', 'YATACO GARCIA ', 'MARIA SANTOS', '965696054', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(562, 'DNI', '21867629', 'LEVANO TORRES ', 'MARITZA', '955446960', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(563, 'DNI', '40956921', 'TASAYCO LEVANO ', 'MIGUEL ANGEL', '962278152', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(564, 'DNI', '47934103', 'ANCHANTE RICALES ', 'ROBERTO CARLOS', '935252637', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(565, 'DNI', '21781164', 'YATACO GARCIA ', 'MOISES', '944420613', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(566, 'DNI', '21811430', 'CASTILLA VILCHEZ ', 'RICARDO ANTONIO', '933212718', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(567, 'DNI', '73753884', 'NAPA ABREGU ', 'ANGEL DANIEL', '966557234', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(568, 'DNI', '73587616', 'MAGALLANES MAGALLANES ', 'MIGUEL ANGEL', '', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(569, 'DNI', '75724634', 'VILLALOBOS RAMOS ', 'KATI LUCERO', '926791781', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(570, 'DNI', '76953577', 'YATACO JACOBO', 'YERSON LEONEL', '978787582', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(571, 'DNI', '40845052', 'CLEMENTE VILA ', 'MIGUEL ANGEL', '936199249', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(572, 'DNI', '21785244', 'DE LA CRUZ MENDOZA ', 'ROSA ELVIRA', '968416588', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(573, 'DNI', '21866147', 'MENDIGUETE LOYOLA ', 'MARIA JULIA', '962402706', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(574, 'DNI', '43451897', 'TORRES DE LA CRUZ ', 'DENISSE ANGELITA', '944197332', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(575, 'DNI', '21887938', 'CHOQUEZ PAREDES ', 'ANA CECILIA', '902403264', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(576, 'DNI', '21863844', 'LEVANO TORRES ', 'VICTOR MANUEL', '922261999', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(577, 'DNI', '40676826', 'SOTELO TASAYCO ', 'BRUCE YENSON', '965781887', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(578, 'DNI', '41379748', 'RAMIREZ RONCEROS ', 'YSMELDA YSABEL', '966615223', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(579, 'DNI', '21869367', 'LEGUA GIRAO ', 'ANA CECILIA', '983512122', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(580, 'DNI', '21819087', 'FERNANDEZ MEZA ', 'HEBER ANDER', '902779650', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(581, 'DNI', '40036264', 'VILLA GOMEZ ', 'GIOVANNA ESTHER ', '954849614', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(582, 'DNI', '21864136', 'SOTELO TASAYCO ', 'MERLY JANNET ', '956448235', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(583, 'DNI', '70312599', 'RAMOS ALMEYDA ', 'ROCIO BEATRIZ', '962120170', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(584, 'DNI', '76022500', 'FELIX GARAY ', 'DANIELA MILAGROS', '906234378', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(585, 'DNI', '72675038', 'MENESES LEVANO ', 'DEYSI LILIANA', '902473696', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(586, 'DNI', '71447384', 'BOGA MESIAS', 'JAIR FRANCISCO', '986178947', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(587, 'DNI', '45507136', 'ROJAS LAPA ', 'GINO PERCY', '981210264', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(588, 'DNI', '41334643', 'LOPEZ YATACO ', 'YENY YOLANDA', '937037075', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(589, 'DNI', '43949731', 'AGUILAR CHUMPITAZ ', 'GIOVANA', '907525014', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(590, 'DNI', '70394627', 'SOTELO DE LA CRUZ ', 'JANPOOL ALEXANDRO', '988638758', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(591, 'DNI', '21845027', 'CANCHARI QUISPE ', 'JHONY ANGEL', '963847560', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(592, 'DNI', '21807868', 'IBARRA SALAZAR ', 'CIRO WILLMAN', '956562524', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(593, 'DNI', '21850170', 'ALMEYDA SANCHEZ ', 'PABLO LUIS ', '952354023', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(594, 'DNI', '21829438', 'SANABRIA CONISLLA ', 'ERLINDA SONIA', '972027085', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(595, 'DNI', '21870818', 'CARBAJAL SARAVIA ', 'CARLOS WILLIAM', '934210395', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(596, 'DNI', '70774425', 'ANCHANTE GALLEGOS ', 'IAN CARLOS', '955217427', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(597, 'DNI', '71479672', 'APOLAYA VALDEZ ', 'FRESIA FIORELLA', '957211141', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(598, 'DNI', '45247751', 'GARCIA GARCIA ', 'SERGIO ALEXANDER', '936813055', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(599, 'DNI', '74060377', 'OSTIA MENDIGUETE', ' LEONARDO ', '965220433', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(600, 'DNI', '42557418', 'SALVADOR TORRES', 'SANDRA MILAGROS', '992008034', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(601, 'DNI', '70249354', 'VELASQUEZ CONDORI', 'ELVIS AMILCAR', '940583772', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(602, 'DNI', '45149626', 'CALDERON FLORES ', 'NATALI', '981279249', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(603, 'DNI', '21834851', 'MAGALLANES ALMEYDA ', 'JUAN PABLO', '912275894', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(604, 'DNI', '21875978', 'SIHUIN ECHEVARRIA ', 'ROSIO ROSAURA', '930719756', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(605, 'DNI', '43220061', 'QUISPE CONISLLA ', 'HUBER BASILIO', '913747534', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(606, 'DNI', '21830368', 'MAGALLANES LOYOLA ', 'JOSE FELIX', '925691543', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(607, 'DNI', '70260176', 'MADRID CANDIOTE ', 'JINA EMILY', '937683979', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(608, 'DNI', '21885325', 'GUTIERREZ CASTILLA ', 'WALTHER ANTONIO', '907538170', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(609, 'DNI', '21869888', 'TASAYCO HUAROTE ', 'MARIA ELENA', '933396531', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(610, 'DNI', '48441618', 'GENTILLE GUTARRA ', 'DOMINGO', '966187404', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(611, 'DNI', '41004968', 'SOTELO LUNA ', 'MIRIAN SANDRA', '953607996', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(612, 'DNI', '21864471', 'DIAZ NOVA ', 'ANGELICA DEL CARMEN', '937218206', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(613, 'DNI', '47385982', 'ALMEYDA MENDOZA ', 'JOSSELIN JANETH', '997600039', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(614, 'DNI', '75985857', 'DIAZ CHUMBIAUCA ', 'GIANCARLO', '955158903', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(615, 'DNI', '40405047', 'CHUMBIAUCA ', 'LOZA CECILIA', '986174876', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(616, 'DNI', '40866289', 'CENTENO VALENCIA ', 'FABIO QUICO', '932904801', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(617, 'DNI', '21876735', 'AVALOS MENDOZA ', 'MARIA ESTHER', '954670384', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(618, 'DNI', '71479657', 'ALVAREZ HERNANDEZ ', 'ANA LUCERO', '902835010', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(619, 'DNI', '21846042', 'MENDOZA DE ALMEYDA ', 'MARITZA', '952031848', 'Peruano', NULL, '2025-02-18 14:28:18', NULL, NULL, 1, NULL, NULL),
(620, 'DNI', '21861508', 'GARCIA LY FRIEDA ', 'VERONICA', '956319825', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(621, 'DNI', '42102284', 'PATRICIA MELINA', 'DONAYRE LOPEZ', '979309471', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(622, 'DNI', '21887388', 'MALASQUEZ CHICO', 'JUAN EDUARDO ', '952631213', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(623, 'CAR', '004039538', 'FLOR DEL VALLE', 'RODRIGUEZ GARELLI', '917638838', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(624, 'CAR', '004377762', 'TIMAURE CAMACHO', 'CAROLINA COROMOTO', '902253434', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(625, 'DNI', '21850270', 'DE LA CRUZ QUISPE', 'VICTORIA YSABEL', '997067532', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(626, 'DNI', '44057603', 'GONZALES FUENTES', 'PABLO ALEXANDER', '947884142', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(627, 'DNI', '71928024', 'DIAZ QUISPE', 'KAROLAY MIRELLA', '904277253', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(628, 'DNI', '72852730', 'APOLAYA MARCOS', 'PAMELA', '967236405', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(629, 'DNI', '42166322', 'CARPIO MOSQUERA', 'MANUEL RUFINO', '977715499', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(630, 'DNI', '08347575', 'CONOCC HUAMAN', 'MANUEL MARINO', '945301046', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(631, 'DNI', '45774250', 'VELASQUEZ ROJAS', 'HENRY DANIEL', '983030188', 'Peruano', NULL, '2025-02-20 14:19:24', NULL, NULL, 1, NULL, NULL),
(632, 'DNI', '21854794', 'ROJAS RAMOS', 'CESAR AGUSTO', '968682700', 'Peruano', NULL, '2025-02-21 10:09:52', NULL, NULL, 12, NULL, NULL),
(633, 'DNI', '41538473', 'ITURRIZAGA SULCA', 'RUBEN', '965161138', 'Peruano', NULL, '2025-02-25 09:38:49', NULL, NULL, 14, NULL, NULL),
(1044, 'DNI', '40637649', 'MARTINEZ VILLA', 'JOSE EDUARDO', '964775243', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1045, 'DNI', '44960165', 'HUASASQUICHE MAGALLANES', 'MIGUEL', '993440006', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1046, 'DNI', '73204307', 'HUAYTA HUILLCA', 'ANTOANET MIRIAM', '933900019', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1047, 'DNI', '44219860', 'ANTON NAVARRO', 'CINDY ANALI', '969971167', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1048, 'DNI', '45220774', 'VICENTE ARIAS', 'ROSA DELIA', '923501124', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1049, 'DNI', '43620732', 'ROJAS CHUQUICAHUANA', 'JORGE LUIS', '978476787', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1050, 'DNI', '21866464', 'FLORES LA ROSA', 'JESSICA MARGARITA', '951506348', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1051, 'DNI', '42434792', 'YAURI CANDIOTTE', 'ELIZABETH', '998579720', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1052, 'DNI', '73972845', 'MANCILLA CAJA', 'CRISTIAN JOSE', '981515239', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1053, 'DNI', '74561589', 'MUÑOZ CHIARA', 'EDINSON JOSEFT', '971720162', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1054, 'DNI', '21884660', 'PABLO SOLIS', 'FLOR GIOVANNA (WALTER VIZARRETA)', '995471012', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1055, 'DNI', '41286561', 'VILCAPUMA HUAMAN', 'PHAMELA ELUVINA', '956560777', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1056, 'DNI', '43508567', 'PAREDES TIRADO', 'JULIO ALBERTO', '904737859', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1057, 'DNI', '44732272', 'LEON MERCADO', 'HERMES LIZANDRO', '916729081', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1058, 'DNI', '76872573', 'HUAHUATICO PALOMINO', 'NILDA', '994043628', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1059, 'DNI', '73391124', 'RAFAEL ASENCIOS', 'IRMA SHELLY', '994071850', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1060, 'DNI', '75800208', 'POMALAZA MUÑOZ', 'SANDRA ARANCELI', '902247802', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1061, 'DNI', '70507481', 'VASQUEZ VASQUEZ', 'LUISA BRILLYD', '969994573', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1062, 'DNI', '47930212', 'MUÑOZ VICENTE', 'WILTON RAUL', '985383437', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1063, 'DNI', '44818839', 'ACEVEDO MARTINEZ', 'YOVANA', '984607910', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1064, 'DNI', '21857342', 'HUAMAN AGUIRRE', 'TEODORA REVECA', '914066332', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1065, 'DNI', '45114263', 'QUISPE ROMERO', 'ROSA', '970101201', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1066, 'DNI', '73025320', 'TEJADA SIHUIN', 'ANGEL DEL ROSARIO', '930719756', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1067, 'DNI', '46981139', 'GONZALES HERRERA', 'GERSON', '947403872', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1068, 'DNI', '21881405', 'MOREYRA LLANCARI DE GARCIA', 'CLARISA SUSANA', '955209605', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1069, 'DNI', '42688215', 'VARGAS RICALES', 'CARLOS', '957411267', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1070, 'DNI', '21876900', 'GUERRA DE LA CRUZ', 'WILBER', '942136159', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1071, 'DNI', '41240115', 'MESIAS MAGALLANES', 'BLANCA NELLY', '987136251', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1072, 'DNI', '21814478', 'DE LA CRUZ HUASASQUICHE', 'MARIA EMILIA', '970479863', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1073, 'DNI', '15431743', 'ORMEÑO ARZAPALO', 'JESSENIA MARIBEL', '960846450', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1074, 'DNI', '21792478', 'DURAN BLANCO', 'ELENA EVA LORENZA', '984399198', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1075, 'DNI', '43353994', 'ANCHANTE RICALES', 'ARTURO OMAR', '935252637', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1076, 'DNI', '47750177', 'HUAMAN QUISPE', 'FLORIANO GEANNENE', '957757236', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1077, 'DNI', '21866885', 'HUAMAN RAMOS', 'CIRO', '934695614', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1078, 'DNI', '21869727', 'VARGAS QUIROZ', 'MARIA SALOME', '924435266', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1079, 'DNI', '42193216', 'VENTURA SALDAÑA', 'PATRICIA', '984957004', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1080, 'DNI', '73904016', 'FLORES SANABRIA', 'MEYBY ESPERANZA', '987140176', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1081, 'DNI', '76566228', 'GONZALES ASTORAYME', 'PEDRO JHOSEP', '917443551', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1082, 'DNI', '21818918', 'CASTILLON CHUQUISPUMA', 'LIZANDRO HERCULES', '978934930', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1083, 'DNI', '42023169', 'CHUQUISPUMA MANRIQUE', 'JUAN ANTONIONE', '955086285', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1084, 'DNI', '21870361', 'ANTON VIGO', 'MARTIN', '970705100', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1085, 'DNI', '47071800', 'LOPEZ MAMANI', 'RENE', '913079273', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1086, 'DNI', '44423966', 'VASQUEZ VALENCIA', 'JESUS MARTIN', '934160348', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1087, 'DNI', '70122246', 'GRADOS ARANDA', 'GREYSH DANNAE 01', '984335993', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1088, 'DNI', '42086543', 'HUAMAN QUISPE', 'WALMER ALEXANDER', '980221807', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1089, 'DNI', '71472263', 'ACHARTE MOREYRA', 'YOSELIN ALICIA 02', '930581819', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1090, 'DNI', '40540779', 'ESPINOZA PAUCAR', 'IRMA LIDIA', '922918771', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1091, 'DNI', '21881419', 'ORMEÑO ROJAS', 'ANA VERONICA', '956434279', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1092, 'DNI', '42139491', 'MAGALLANES TORRES', 'MARIA OLGA', '981972951', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1093, 'DNI', '09436528', 'ARANGO ESCOBAR', 'TEOFILO GENARO', '995719091', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1094, 'DNI', '21829129', 'CONTRERAS HUAMAN DE VICERREL', 'FLOR DE LOURDES', '956975545', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1095, 'DNI', '42975549', 'NAPA YEREN', 'KARINA', '902565502', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1096, 'DNI', '01248667', 'HUATTA HUATTA', 'FRANCISCO FABIO', '939210983', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1097, 'DNI', '42522787', 'HUAYTA LEYVA', 'CARMEN', '954579757', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1098, 'DNI', '75874825', 'GARCIA APOLAYA', 'CARLOS EDUARDO', '907096188', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1099, 'DNI', '42605824', 'SAAVEDRA ADVINCULA', 'JEYMI YULIANA', '933433628', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1100, 'DNI', '43510119', 'ZUÑIGA GOYAS', 'NATALY DEL CARMEN', '912433212', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1101, 'DNI', '77464373', 'AQUIJE CASTILLA', 'FREDY JOEL', '994848235', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1102, 'DNI', '21824486', 'ANCHANTE BOADA', 'IVAN MOISES', '923288466', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1103, 'DNI', '46455388', 'CHAVEZ TANTACHUCO', 'LILIBET KATHERINE', '970327519', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1104, 'DNI', '72757929', 'MEDINA PINTO', 'ROSSMERY', '944049975', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1105, 'DNI', '41256038', 'PACHAS TIPISMANA', 'ELIA', '976916535', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1106, 'DNI', '21868165', 'CARDENAS PEÑA', 'SARA ESTHER', '936619041', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1107, 'DNI', '21854034', 'MENESES CANELO', 'LUIS NICOLAS', '994281157', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1108, 'DNI', '21886438', 'MATTA GUERRERO', 'JESUS YTALO', '947308069', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1109, 'DNI', '21886411', 'TORRES NAVARRETE', 'CESAR JHONNY', '988529924', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1110, 'DNI', '43362314', 'MENESES CANELO', 'GLORIA MARIA', '923069145', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1111, 'DNI', '21884421', 'MARCOS MENESES', 'MAGALY AMPARO', '966978545', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1112, 'DNI', '44411741', 'TORRES SALVADOR', 'FERNANDO', '975067710', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1113, 'DNI', '71521763', 'RODRIGUEZ TORRES', 'JHOSELYN MILAGROS', '977458482', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1114, 'DNI', '43648801', 'CHUQUISPUMA PEVE', 'GEORGE EDDIE', '991789434', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1115, 'DNI', '46996225', 'LEON AVALOS', 'JOSE LUIS', '912863678', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1116, 'DNI', '21884429', 'HUAMANI MOSQUERA', 'RAUL', '954670384', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1117, 'DNI', '21794408', 'PEREZ HERNANDEZ', 'JORGE ISIDORO', '924422788', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1118, 'DNI', '76438478', 'ARIAS BOGA', 'ANGELA FABIOLA', '923143087', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1119, 'DNI', '42636719', 'ALMEYDA MELO DE ALBINO', 'DELICIA YSABEL', '902043510', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1120, 'DNI', '45155894', 'CASTILLA YATACO', 'HUGO IVAN', '962372477', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL);
INSERT INTO `tb_personas` (`id_persona`, `tipo_doc`, `nro_doc`, `apellidos`, `nombres`, `telefono`, `nacionalidad`, `email`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1121, 'DNI', '21814474', 'GILARDINO LUY DE REYNAGA', 'MILAGRITOS DE JESUS', '956835450', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1122, 'DNI', '21879865', 'FUENTES CHAVEZ', 'JOSE', '954662593', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1123, 'DNI', '22318174', 'CUADROS OSTIA', 'FELIX EDUARDO', '923716112', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1124, 'DNI', '21873717', 'ALMEYDA JACOBO', 'CARLOS ALBERTO', '977905532', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1125, 'DNI', '40870868', 'ROJAS RAMOS', 'KARINA', '902650710', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1126, 'DNI', '45148456', 'YALLE PAUCAR', 'LISVET ERIKA', '988580062', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1127, 'DNI', '21886081', 'MUNAYCO PEÑALOZA', 'GLORIA YSABEL', '998375132', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1128, 'DNI', '40753258', 'ALMEYDA ESTEBAN', 'ANA MARIA', '933815652', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1129, 'DNI', '40698791', 'ZAMBRANO ÑACARE', 'MARIA ISABEL', '970012066', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1130, 'DNI', '42873960', 'GARAY TORRES', 'JUAN CARLOS', '921424974', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1131, 'DNI', '41730647', 'DE LA CRUZ PEREZ', 'CARMEN DEL ROSARIO', '964428233', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1132, 'DNI', '41781117', 'TIPICIANO QUISPE', 'JAIME HERNAN', '907158395', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1133, 'DNI', '09756783', 'RAMOS RIOS', 'MOISES MATEO', '960106705', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1134, 'DNI', '73503256', 'DE LA CRUZ MUNAYCO', 'ANLLY NOEMI', '949799352', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1135, 'DNI', '43092297', 'ROJAS RAMOS', 'DIANA CAROLINA', '956499148', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1136, 'DNI', '40476139', 'MUÑOZ VICENTE', 'RITA MAGDALENA', '977723525', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1137, 'DNI', '44879432', 'PEREZ TALLA', 'FABIOLA', '906192714', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1138, 'DNI', '45841421', 'MATOS MENESES', 'EVELYN YURISAN', '981150457', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1139, 'DNI', '70460727', 'PINEDO FELIPA', 'JEREMY TOBARIS', '970559726', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1140, 'DNI', '40146976', 'ATUNCAR PERALTA', 'MARIA ESPERANZA', '924256300', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1141, 'DNI', '70460220', 'DE LOS RIOS PINEDO', 'CRISTHIAN ALEXIS', '977408606', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1142, 'DNI', '16013293', 'RODRIGUEZ LOPEZ', 'LORENA CAROLINA', '907377901', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1143, 'DNI', '75570741', 'AGUILAR LACHUMA', 'PAMELA', '903218708', 'Peruano', 'NULL', '2025-02-25 16:00:00', NULL, NULL, 1, NULL, NULL),
(1144, 'DNI', '47958853', 'MATEO PASACHE', 'MELCHORITA KARINA', '978497653', 'Peruano', NULL, '2025-02-25 18:50:07', NULL, NULL, 14, NULL, NULL),
(1145, 'DNI', '73083678', 'CHAVEZ DIAZ', 'KAROLING OLENKA MILAGROS', '991049089', 'Peruano', NULL, '2025-02-26 10:59:52', NULL, NULL, 12, NULL, NULL),
(1152, 'DNI', '71592495', 'TALLA SARAVIA', 'ALEXIS ALEXANDER', '907277520', 'Peruano', 'alexis.talla.srv2608@gmai.com', '2025-02-28 12:40:53', NULL, NULL, 1, NULL, NULL),
(1153, 'DNI', '71817032', 'VASQUEZ LUY JON', 'ANGELO FERNANDO', '970012066', 'Peruano', NULL, '2025-03-01 12:46:52', NULL, NULL, 12, NULL, NULL),
(1154, 'DNI', '44658446', 'AGUILAR RIVERA', 'NATALY CRISS', '957408746', 'Peruano', NULL, '2025-03-03 12:15:27', NULL, NULL, 12, NULL, NULL),
(1155, 'DNI', '47154415', 'SARAVIA TASAYCO', 'ANA MELCHORITA', '955435167', 'Peruano', NULL, '2025-03-04 09:27:57', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_productos`
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
) ENGINE=InnoDB AUTO_INCREMENT=31;

--
-- Volcado de datos para la tabla `tb_productos`
--

INSERT INTO `tb_productos` (`id_producto`, `id_marca`, `id_tipo`, `id_unidad`, `modelo`, `precio_actual`, `codigo_barra`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(23, 11, 1, 1, 'BT213XR', 160.00, '60D2DD', '2025-02-11 12:22:13', NULL, NULL, 1, NULL, NULL),
(24, 9, 1, 1, 'V2804NZ', 165.00, '6C68A4', '2025-02-18 11:33:40', NULL, NULL, 1, NULL, NULL),
(25, 1, 1, 1, 'Archer C24ES', 130.00, '3C64CF', '2025-02-18 11:41:19', NULL, NULL, 1, NULL, NULL),
(27, 9, 1, 1, 'V28044ACZ', 165.00, '4CD7C8', '2025-02-18 12:39:42', NULL, NULL, 1, NULL, NULL),
(28, 5, 1, 1, 'EchoLife EG8145V5', 145.00, '389052', '2025-02-27 18:17:57', NULL, NULL, 1, NULL, NULL),
(29, 9, 1, 1, 'XPON1GE3FEWIFIUSB', 145.00, '1CEF03', '2025-02-27 18:25:59', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_provincias`
--

DROP TABLE IF EXISTS `tb_provincias`;
CREATE TABLE IF NOT EXISTS `tb_provincias` (
  `id_provincia` int(11) NOT NULL,
  `provincia` varchar(45) NOT NULL,
  `id_departamento` int(11) NOT NULL,
  PRIMARY KEY (`id_provincia`),
  KEY `provi_fk_id_departamento` (`id_departamento`)
) ENGINE=InnoDB;

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
) ENGINE=InnoDB AUTO_INCREMENT=18;

--
-- Volcado de datos para la tabla `tb_responsables`
--

INSERT INTO `tb_responsables` (`id_responsable`, `id_usuario`, `id_rol`, `fecha_inicio`, `update_at`, `fecha_fin`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 1, 1, '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(10, 11, 8, '2025-02-08 00:35:10', NULL, NULL, 1, NULL, NULL),
(11, 12, 10, '2025-02-11 14:21:05', NULL, NULL, 1, NULL, NULL),
(12, 13, 8, '2025-02-11 15:39:07', NULL, NULL, 1, NULL, NULL),
(13, 14, 12, '2025-02-11 16:08:39', NULL, NULL, 1, NULL, NULL),
(14, 15, 8, '2025-02-12 03:27:46', NULL, NULL, 1, NULL, NULL),
(15, 16, 12, '2025-02-12 03:29:09', NULL, NULL, 1, NULL, NULL),
(16, 17, 12, '2025-02-12 03:31:11', NULL, NULL, 1, NULL, NULL),
(17, 18, 12, '2025-02-13 23:49:15', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_roles`
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
) ENGINE=InnoDB AUTO_INCREMENT=14;

--
-- Volcado de datos para la tabla `tb_roles`
--

INSERT INTO `tb_roles` (`id_rol`, `rol`, `permisos`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'Administrador', '{\"actividad\":\"Mapa\", \"administracion\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true}, \"soporte\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"contratos\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"inventariado\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"personas\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"roles\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"usuarios\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"reportes\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"paquetes\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true},\"ticket\":{\"leer\":true,\"crear\":true,\"actualizar\":true,\"eliminar\":true}}', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(6, 'VENTAS', '{\"actividad\":\"\",\"administracion\":[],\"contratos\":[],\"inventariado\":[],\"personas\":[],\"ticket\":[],\"roles\":[],\"soporte\":[],\"usuarios\":[],\"reportes\":[],\"paquetes\":[]}', '2025-02-07 12:28:07', NULL, '2025-02-07 17:28:43', 1, NULL, 1),
(8, 'Servicio al Cliente', '{\"actividad\":\"Mapa\",\"administracion\":{\"leer\":\"1\"},\"contratos\":{\"leer\":\"1\",\"crear\":\"1\",\"actualizar\":\"1\",\"eliminar\":\"1\"},\"inventariado\":[],\"personas\":{\"leer\":\"1\",\"crear\":\"1\",\"actualizar\":\"1\",\"eliminar\":\"1\"},\"ticket\":{\"leer\":\"1\"},\"roles\":[],\"soporte\":[],\"usuarios\":[],\"reportes\":{\"leer\":\"1\",\"crear\":\"1\",\"actualizar\":\"1\",\"eliminar\":\"1\"},\"paquetes\":{\"leer\":\"1\"}}', '2025-02-07 21:06:20', '2025-02-11 10:19:31', NULL, 1, 1, NULL),
(10, 'Asesor Ventas', '{\"actividad\":\"Mapa\",\"administracion\":{\"leer\":\"1\"},\"contratos\":[],\"inventariado\":[],\"personas\":[],\"ticket\":[],\"roles\":[],\"soporte\":[],\"usuarios\":[],\"reportes\":[],\"paquetes\":[]}', '2025-02-11 09:17:46', '2025-02-11 22:15:14', NULL, 1, 1, NULL),
(12, 'Tecnicos de Campo', '{\"actividad\":\"Fichas\",\"administracion\":{\"leer\":\"1\"},\"contratos\":{\"leer\":\"1\",\"crear\":\"1\",\"actualizar\":\"1\"},\"inventariado\":[],\"personas\":[],\"ticket\":{\"leer\":\"1\"},\"roles\":[],\"soporte\":{\"leer\":\"1\",\"crear\":\"1\"},\"usuarios\":[],\"reportes\":{\"leer\":\"1\"},\"paquetes\":[]}', '2025-02-11 11:04:01', '2025-02-13 18:31:20', NULL, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_sectores`
--

DROP TABLE IF EXISTS `tb_sectores`;
CREATE TABLE IF NOT EXISTS `tb_sectores` (
  `id_sector` int(11) NOT NULL AUTO_INCREMENT,
  `id_distrito` int(11) NOT NULL,
  `sector` varchar(60) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `coordenadas` varchar(50) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_sector`),
  UNIQUE KEY `sector` (`sector`),
  UNIQUE KEY `secto_uk_sector` (`sector`),
  KEY `secto_fk_id_distrito` (`id_distrito`)
) ENGINE=InnoDB AUTO_INCREMENT=34;

--
-- Volcado de datos para la tabla `tb_sectores`
--

INSERT INTO `tb_sectores` (`id_sector`, `id_distrito`, `sector`, `descripcion`, `direccion`, `coordenadas`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 110210, 'Colegio', 'Cerca de la central', NULL, '-13.42530296658907,-76.1582517093059', '2025-02-06 16:40:56', NULL, NULL, 1, NULL, NULL),
(2, 110210, 'StaRosa', 'Entre el Porvenir y Pje Noras', NULL, '-13.42286859459925,-76.15639249784172', '2025-02-06 16:41:58', NULL, NULL, 1, NULL, NULL),
(3, 110210, 'San Ignacio', 'Al lado de la Av. Huascar', NULL, '-13.418687959032848,-76.15378068041177', '2025-02-06 16:43:16', NULL, NULL, 1, NULL, NULL),
(4, 110210, 'Villa Julia', 'Por la Botica OrikaFarma', NULL, '-13.417258421765702,-76.14826526915628', '2025-02-06 16:44:48', NULL, NULL, 1, NULL, NULL),
(5, 110210, 'Santa Fe', 'Sta. Teresa', NULL, '-13.42729384356362,-76.1759368433823', '2025-02-06 16:47:52', NULL, NULL, 1, NULL, NULL),
(6, 110210, 'Lima', 'C. Lima', NULL, '-13.427060295798464,-76.16912512175875', '2025-02-06 17:12:29', NULL, NULL, 1, NULL, NULL),
(7, 110210, 'SECTOR_SIMON', 'San Alejandro', NULL, '-13.429864604499569,-76.16318797395762', '2025-02-07 16:50:16', NULL, NULL, 1, NULL, NULL),
(8, 110210, 'Huaca Grande', 'Cerca del Pasaje Canelo', NULL, '-13.429176855094521,-76.15760449242305', '2025-02-07 17:06:52', NULL, NULL, 1, NULL, NULL),
(9, 110210, 'Paraiso', 'Paraiso', NULL, '-13.421666981582725,-76.16739355188244', '2025-02-08 00:55:40', NULL, NULL, 1, NULL, NULL),
(10, 110210, 'Pilpa', 'Sector Pilpa', NULL, '-13.415342237907714,-76.16360087550551', '2025-02-08 01:01:48', NULL, NULL, 1, NULL, NULL),
(11, 110206, 'Mejilloneros', 'Mejilloneros', NULL, '-13.407217842485572,-76.16096292678283', '2025-02-11 09:29:29', NULL, NULL, 1, NULL, NULL),
(12, 110206, 'Plaza de armas Grocio', 'Plaza de armas Grocio', NULL, '-13.397468146204712,-76.15984778976538', '2025-02-11 09:56:14', NULL, NULL, 1, NULL, NULL),
(13, 110201, 'Cruz Blanca', 'Cruz Blanca', NULL, '-13.428763849090112,-76.1197821642444', '2025-02-11 10:21:01', NULL, NULL, 1, NULL, NULL),
(14, 110201, 'Oruro', 'Oruro', NULL, '-13.429203358245806,-76.11554211388557', '2025-02-11 10:24:59', NULL, NULL, 1, NULL, NULL),
(15, 110206, 'Centenario', 'Centenario', NULL, '-13.405162449680406,-76.14781583908933', '2025-02-11 11:08:51', NULL, NULL, 1, NULL, NULL),
(16, 110207, 'Salvador', 'Salvador', NULL, '-13.391084060439578,-76.14777566035887', '2025-02-11 11:11:34', NULL, NULL, 1, NULL, NULL),
(17, 110201, 'Olaya', 'Olaya', NULL, '-13.42686170802311,-76.12914564158439', '2025-02-12 09:55:55', NULL, NULL, 1, NULL, NULL),
(19, 110201, 'Sector Olaya', 'Olaya', NULL, '-13.42686170802311,-76.12914564158439', '2025-02-12 09:57:25', NULL, NULL, 1, NULL, NULL),
(20, 110206, 'Centro Chincha', 'Centro Chincha', NULL, '-13.414623353976006,-76.1327306399624', '2025-02-12 10:11:21', NULL, NULL, 1, NULL, NULL),
(21, 110206, 'SECTOR_TECHO.MAX', 'pueblo nuevo  techo propio  pedro moreno', NULL, '-13.402849714590792,-76.1426242189739', '2025-02-12 10:40:15', NULL, NULL, 1, NULL, NULL),
(22, 110206, 'El Porvenir', 'El Porvenir', NULL, '-13.403251942865218,-76.163406154616', '2025-02-13 09:37:40', NULL, NULL, 1, NULL, NULL),
(24, 110201, 'COND_PBAJA', 'Condorillo Pbaja', NULL, '-13.435516567002058,-76.1152250679795', '2025-02-13 10:01:56', NULL, NULL, 1, NULL, NULL),
(25, 110207, 'SECTOR_AMERICA', 'Por la 2 de mayo', NULL, '-13.397009888827162,-76.13165902160145', '2025-02-14 15:15:19', NULL, NULL, 1, NULL, NULL),
(26, 110207, 'SECTOR_SATELITE.1', 'SATELITE', NULL, '-13.385848208926236,-76.11895382918556', '2025-02-14 16:04:10', NULL, NULL, 1, NULL, NULL),
(27, 110207, 'SECTOR_SATELITE.2', 'SATELITE', NULL, '-13.38431252423856,-76.12203097844181', '2025-02-14 16:04:44', NULL, NULL, 1, NULL, NULL),
(28, 110210, 'Mina de Oro', 'Mina de Oro', NULL, '-13.42641719262991,-76.14317521897418', '2025-02-19 10:34:19', NULL, NULL, 1, NULL, NULL),
(29, 110201, 'SECTOR_COND_P.ALTA', 'Condorillo Alto', NULL, '-13.437561251410981,-76.11502520116245', '2025-02-19 10:35:06', NULL, NULL, 1, NULL, NULL),
(30, 110210, 'Chacarita', 'Chacarita', NULL, '-13.43699347295546,-76.13723728177847', '2025-02-19 10:55:07', NULL, NULL, 1, NULL, NULL),
(31, 110201, 'SECTOR_CB_CAMPO', 'SECTOR_CB_CAMPO', NULL, '-13.432434324249392,-76.12062088952639', '2025-02-19 11:11:17', NULL, NULL, 1, NULL, NULL),
(32, 110201, 'Progreso', 'Progreso', NULL, '-13.434024697260941,-76.13122177612175', '2025-02-19 11:12:00', NULL, NULL, 1, NULL, NULL),
(33, 110201, 'VIRGEN_CARMEN', 'Estadio Cruz blanca Chincha', NULL, '-13.428129709976465,-76.1232501050596', '2025-02-20 09:32:46', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_servicios`
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
) ENGINE=InnoDB AUTO_INCREMENT=4;

--
-- Volcado de datos para la tabla `tb_servicios`
--

INSERT INTO `tb_servicios` (`id_servicio`, `tipo_servicio`, `servicio`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 'CABL', 'Cable', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(2, 'WISP', 'Wireless Internet Service Provider', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(3, 'FIBR', 'Fibra Óptica', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_soporte`
--

DROP TABLE IF EXISTS `tb_soporte`;
CREATE TABLE IF NOT EXISTS `tb_soporte` (
  `id_soporte` int(11) NOT NULL AUTO_INCREMENT,
  `id_contrato` int(11) NOT NULL,
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
  KEY `sopor_fk_id_tecnico` (`id_tecnico`)
) ENGINE=InnoDB AUTO_INCREMENT=4;

--
-- Volcado de datos para la tabla `tb_soporte`
--

INSERT INTO `tb_soporte` (`id_soporte`, `id_contrato`, `id_tecnico`, `fecha_hora_solicitud`, `fecha_hora_asistencia`, `descripcion_problema`, `descripcion_solucion`, `estaCompleto`, `prioridad`, `soporte`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(3, 17, NULL, '2025-02-27 19:08:24', NULL, 'Colocar Router repetidor en el primero piso\nsin costo, el cliente compro el equipo externamente', NULL, 0, 'Media', '{}', '2025-02-27 19:08:24', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_subbase`
--

DROP TABLE IF EXISTS `tb_subbase`;
CREATE TABLE IF NOT EXISTS `tb_subbase` (
  `id_sub_base` int(11) NOT NULL AUTO_INCREMENT,
  `id_base` int(11) NOT NULL,
  `nombre_sub_base` varchar(50) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_sub_base`),
  KEY `fk_id_base` (`id_base`)
) ENGINE=InnoDB AUTO_INCREMENT=15;

--
-- Volcado de datos para la tabla `tb_subbase`
--

INSERT INTO `tb_subbase` (`id_sub_base`, `id_base`, `nombre_sub_base`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 1, 'Chincha', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(2, 1, 'Rosedal', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(3, 1, 'Señor de los Milagros', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(4, 1, 'Cruz Blanca', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(5, 1, 'Condorillo', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(6, 2, 'Salvador', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(7, 2, 'Satélite', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(8, 3, 'Grocio', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(9, 4, 'Tambo de Mora', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(10, 4, 'Tambo Plaza Antiguo', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(11, 5, 'Sunampe', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(12, 5, 'San Ignacio', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(13, 5, 'San Pilpa', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(14, 5, 'Chacarita', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_tipooperacion`
--

DROP TABLE IF EXISTS `tb_tipooperacion`;
CREATE TABLE IF NOT EXISTS `tb_tipooperacion` (
  `id_tipooperacion` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(55) NOT NULL,
  `movimiento` char(1) NOT NULL,
  PRIMARY KEY (`id_tipooperacion`),
  UNIQUE KEY `tipoop` (`descripcion`)
) ENGINE=InnoDB AUTO_INCREMENT=13;

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

DROP TABLE IF EXISTS `tb_tipoproducto`;
CREATE TABLE IF NOT EXISTS `tb_tipoproducto` (
  `id_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_nombre` varchar(250) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `update_at` datetime DEFAULT NULL,
  `inactive_at` datetime DEFAULT NULL,
  `iduser_inactive` int(11) DEFAULT NULL,
  `iduser_create` int(11) NOT NULL,
  `iduser_update` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tipo`),
  UNIQUE KEY `uk_tipopro` (`tipo_nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=14;

--
-- Volcado de datos para la tabla `tb_tipoproducto`
--

INSERT INTO `tb_tipoproducto` (`id_tipo`, `tipo_nombre`, `create_at`, `update_at`, `inactive_at`, `iduser_inactive`, `iduser_create`, `iduser_update`) VALUES
(1, 'Router', '2025-01-26 09:45:35', NULL, NULL, NULL, 1, NULL),
(2, 'sintonizador', '2025-01-26 09:45:35', NULL, NULL, NULL, 1, NULL),
(3, 'modem', '2025-01-26 09:45:35', NULL, NULL, NULL, 1, NULL),
(4, 'repetidor', '2025-01-26 09:45:35', NULL, NULL, NULL, 1, NULL),
(5, 'triplexor', '2025-01-26 09:45:35', NULL, NULL, NULL, 1, NULL),
(6, 'consumibles', '2025-01-26 09:45:35', NULL, NULL, NULL, 1, NULL),
(7, 'Herramientas', '2025-01-26 09:45:35', NULL, NULL, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_unidadmedida`
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
) ENGINE=InnoDB AUTO_INCREMENT=3;

--
-- Volcado de datos para la tabla `tb_unidadmedida`
--

INSERT INTO `tb_unidadmedida` (`id_unidad`, `unidad_nombre`, `create_at`, `update_at`, `iduser_create`, `iduser_update`) VALUES
(1, 'Unidades', '2025-01-26 09:45:35', NULL, 1, NULL),
(2, 'Metros', '2025-01-26 09:45:35', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_usuarios`
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
) ENGINE=InnoDB AUTO_INCREMENT=19;

--
-- Volcado de datos para la tabla `tb_usuarios`
--

INSERT INTO `tb_usuarios` (`id_usuario`, `id_persona`, `nombre_user`, `pass`, `create_at`, `update_at`, `inactive_at`, `iduser_create`, `iduser_update`, `iduser_inactive`) VALUES
(1, 1, 'IvanJose', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', '2025-01-26 09:45:35', NULL, NULL, 1, NULL, NULL),
(11, 2, 'katherine', '$2y$10$NO9PzTs/9WLMME3Etq5VyeWPgW14HQsyj7ilYLRAsCo4qkxt2fX9m', '2025-02-08 00:35:10', NULL, '2025-02-11 22:26:38', 1, NULL, 1),
(12, 3, 'francisco', '$2y$10$DeIGN0rYXDSvX9t2Wastw.xTUWXlhORTCbjZKync0h7VhwIwZ1S3q', '2025-02-11 09:21:05', NULL, '2025-02-11 22:26:33', 1, NULL, 1),
(13, 4, 'DayanaS', '$2y$10$CAcUULm/I/mbGuit9G1bTO1Ii5LH/seSYcT72JLKsxCN6x2u.bwbW', '2025-02-11 10:39:07', NULL, NULL, 1, NULL, NULL),
(14, 5, 'RoberthV', '$2y$10$A6Ut2UAH.hHGdIaro7W9ju91tBHg4cEt6cEcvl7e2.p4UrB/Kh6mW', '2025-02-11 11:08:39', NULL, NULL, 1, NULL, NULL),
(15, 7, 'AlmendraV', '$2y$10$FYWXDNJRRkOG2wWE3aqZoeALwH6XCfLwebVImgxdQoTgehx3NNp0a', '2025-02-11 22:27:46', NULL, NULL, 1, NULL, NULL),
(16, 8, 'CristianJ', '$2y$10$fuK..aiqZc1j7NixJNae7u2iaNxGEoVTjYDfETFpb5pm0.6pN4746', '2025-02-11 22:29:09', NULL, NULL, 1, NULL, NULL),
(17, 9, 'LuisE', '$2y$10$kr2sJJA27eQY80lrNlO7SuydrtZmTapFDChxD8cr8zYaty7clpFVi', '2025-02-11 22:31:11', NULL, NULL, 1, NULL, NULL),
(18, 10, 'T123', '$2y$10$9jlvc0toVlvzPRNMi2c1CO9qlAUxKUlXgwmCatUMWmxDRqo7CKNkq', '2025-02-13 18:49:16', NULL, NULL, 1, NULL, NULL);

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
-- Estructura Stand-in para la vista `vw_averias_contar_ficha_vacia`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_averias_contar_ficha_vacia`;
CREATE TABLE IF NOT EXISTS `vw_averias_contar_ficha_vacia` (
`total_averias_ficha_vacia` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_averias_listar_ficha_null`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_averias_listar_ficha_null`;
CREATE TABLE IF NOT EXISTS `vw_averias_listar_ficha_null` (
`id_soporte` int(11)
,`id_contrato` int(11)
,`nombre_cliente` varchar(161)
,`descripcion_problema` text
,`fecha_creacion` datetime
,`sector_cliente` varchar(60)
,`tipo_servicio` char(4)
,`coordenada` varchar(50)
,`nrodocumento` varchar(15)
,`prioridad` varchar(50)
,`telefono` char(9)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_clientes_contar_con_ficha_llena`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_clientes_contar_con_ficha_llena`;
CREATE TABLE IF NOT EXISTS `vw_clientes_contar_con_ficha_llena` (
`total_clientes_con_ficha_llena` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_clientes_obtener`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_clientes_obtener`;
CREATE TABLE IF NOT EXISTS `vw_clientes_obtener` (
`id_cliente` int(11)
,`nombre_cliente` varchar(162)
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
,`nombre_contacto` varchar(161)
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
-- Estructura Stand-in para la vista `vw_contratos_contar_ficha_vacia`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_contratos_contar_ficha_vacia`;
CREATE TABLE IF NOT EXISTS `vw_contratos_contar_ficha_vacia` (
`total_contratos_ficha_vacia` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_contratos_listar`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_contratos_listar`;
CREATE TABLE IF NOT EXISTS `vw_contratos_listar` (
`id_contrato` int(11)
,`nombre_cliente` varchar(162)
,`num_identificacion` varchar(15)
,`direccion_servicio` varchar(200)
,`paquete` varchar(250)
,`precio` decimal(7,2)
,`tipos_servicio` longtext
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_contratos_listar_ficha_null`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_contratos_listar_ficha_null`;
CREATE TABLE IF NOT EXISTS `vw_contratos_listar_ficha_null` (
`id_contrato` int(11)
,`nombre_cliente` varchar(161)
,`nombre_paquete` varchar(250)
,`nombre_sector` varchar(60)
,`nombre_tecnico_registro` varchar(161)
,`telefono` char(9)
,`direccion_servicio` varchar(200)
,`referencia` varchar(200)
,`ficha_instalacion` longtext
,`coordenada` varchar(50)
,`fecha_inicio` date
,`fecha_registro` date
,`fecha_fin` date
,`nota` text
,`create_at` datetime
,`update_at` datetime
,`inactive_at` datetime
,`iduser_update` int(11)
,`iduser_inactive` int(11)
,`tipos_servicio` longtext
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
,`tipos_servicio` longtext
,`servicios` longtext
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
,`tipo_producto` varchar(250)
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
,`creado_por` varchar(161)
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
,`servicios` longtext
,`tipos_servicio` longtext
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
,`Nombre_Completo` varchar(162)
,`telefono` char(9)
,`nacionalidad` varchar(40)
,`email` varchar(100)
,`direccion_contacto` varchar(250)
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
,`tipo_nombre` varchar(250)
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
,`direccion` varchar(200)
,`coordenadas` varchar(50)
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
-- Estructura Stand-in para la vista `vw_servicios_listarTotal`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_servicios_listarTotal`;
CREATE TABLE IF NOT EXISTS `vw_servicios_listarTotal` (
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
,`nro_doc` varchar(15)
,`id_cliente` int(11)
,`direccion_servicio` varchar(200)
,`id_tecnico` int(11)
,`tecnico_nombres` varchar(80)
,`tecnico_apellidos` varchar(80)
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
-- Estructura Stand-in para la vista `vw_tipo_productos`
-- (Véase abajo para la vista actual)
--
DROP VIEW IF EXISTS `vw_tipo_productos`;
CREATE TABLE IF NOT EXISTS `vw_tipo_productos` (
`id_tipo` int(11)
,`tipo_nombre` varchar(250)
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
,`nombre` varchar(162)
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
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_almacen`  AS SELECT `tb_almacen`.`id_almacen` AS `id_almacen`, `tb_almacen`.`nombre_almacen` AS `nombre_almacen`, `tb_almacen`.`iduser_create` AS `iduser_create`, `tb_almacen`.`iduser_update` AS `iduser_update` FROM `tb_almacen` WHERE `tb_almacen`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_averias_contar_ficha_vacia`
--
DROP TABLE IF EXISTS `vw_averias_contar_ficha_vacia`;

DROP VIEW IF EXISTS `vw_averias_contar_ficha_vacia`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_averias_contar_ficha_vacia`  AS SELECT count(0) AS `total_averias_ficha_vacia` FROM `tb_soporte` WHERE `tb_soporte`.`estaCompleto` = 0 AND `tb_soporte`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_averias_listar_ficha_null`
--
DROP TABLE IF EXISTS `vw_averias_listar_ficha_null`;

DROP VIEW IF EXISTS `vw_averias_listar_ficha_null`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_averias_listar_ficha_null`  AS SELECT `s`.`id_soporte` AS `id_soporte`, `s`.`id_contrato` AS `id_contrato`, concat(`p`.`nombres`,' ',`p`.`apellidos`) AS `nombre_cliente`, `s`.`descripcion_problema` AS `descripcion_problema`, `s`.`create_at` AS `fecha_creacion`, `sec`.`sector` AS `sector_cliente`, `sv`.`tipo_servicio` AS `tipo_servicio`, `c`.`coordenada` AS `coordenada`, coalesce(`p`.`nro_doc`,`e`.`ruc`) AS `nrodocumento`, `s`.`prioridad` AS `prioridad`, `p`.`telefono` AS `telefono` FROM (((((((`tb_soporte` `s` join `tb_contratos` `c` on(`s`.`id_contrato` = `c`.`id_contrato`)) join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) left join `tb_empresas` `e` on(`cl`.`id_empresa` = `e`.`id_empresa`)) join `tb_sectores` `sec` on(`c`.`id_sector` = `sec`.`id_sector`)) join `tb_paquetes` `pk` on(`c`.`id_paquete` = `pk`.`id_paquete`)) join `tb_servicios` `sv` on(json_contains(`pk`.`id_servicio`,concat('{"id_servicio":',`sv`.`id_servicio`,'}')))) WHERE `s`.`estaCompleto` = 0 AND `s`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_clientes_contar_con_ficha_llena`
--
DROP TABLE IF EXISTS `vw_clientes_contar_con_ficha_llena`;

DROP VIEW IF EXISTS `vw_clientes_contar_con_ficha_llena`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_clientes_contar_con_ficha_llena`  AS SELECT count(distinct `c`.`id_cliente`) AS `total_clientes_con_ficha_llena` FROM `tb_contratos` AS `c` WHERE `c`.`ficha_instalacion` is not null AND `c`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_clientes_obtener`
--
DROP TABLE IF EXISTS `vw_clientes_obtener`;

DROP VIEW IF EXISTS `vw_clientes_obtener`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_clientes_obtener`  AS SELECT `c`.`id_cliente` AS `id_cliente`, coalesce(concat(`p`.`nombres`,', ',`p`.`apellidos`),`e`.`razon_social`) AS `nombre_cliente`, coalesce(`p`.`nro_doc`,`e`.`ruc`) AS `codigo_cliente`, coalesce(`p`.`email`,`e`.`email`) AS `email_cliente`, coalesce(`p`.`telefono`,`e`.`telefono`) AS `telefono_cliente`, `c`.`direccion` AS `direccion_cliente`, `c`.`referencia` AS `referencia_cliente`, `c`.`coordenadas` AS `coordenadas_cliente` FROM ((`tb_clientes` `c` left join `tb_personas` `p` on(`c`.`id_persona` = `p`.`id_persona` and `p`.`inactive_at` is null)) left join `tb_empresas` `e` on(`c`.`id_empresa` = `e`.`id_empresa` and `e`.`inactive_at` is null)) WHERE `c`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_contactabilidad_listar`
--
DROP TABLE IF EXISTS `vw_contactabilidad_listar`;

DROP VIEW IF EXISTS `vw_contactabilidad_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_contactabilidad_listar`  AS SELECT `c`.`id_contactabilidad` AS `id_contactabilidad`, concat(`p`.`nombres`,' ',`p`.`apellidos`) AS `nombre_contacto`, `p`.`telefono` AS `telefono`, `p`.`email` AS `email`, `pk`.`paquete` AS `paquete`, `pk`.`precio` AS `precio`, `c`.`create_at` AS `fecha_hora_contacto`, `c`.`direccion_servicio` AS `direccion_servicio`, `c`.`nota` AS `nota`, `c`.`fecha_limite` AS `fecha_limite`, `u1`.`nombre_user` AS `usuario_creador`, `c`.`iduser_update` AS `iduser_update`, `u2`.`nombre_user` AS `usuario_modificador`, `c`.`iduser_inactive` AS `iduser_inactive`, `u3`.`nombre_user` AS `usuario_inactivador` FROM (((((`tb_contactabilidad` `c` join `tb_personas` `p` on(`c`.`id_persona` = `p`.`id_persona`)) join `tb_paquetes` `pk` on(`c`.`id_paquete` = `pk`.`id_paquete`)) left join `tb_usuarios` `u1` on(`c`.`iduser_create` = `u1`.`id_usuario`)) left join `tb_usuarios` `u2` on(`c`.`iduser_update` = `u2`.`id_usuario`)) left join `tb_usuarios` `u3` on(`c`.`iduser_inactive` = `u3`.`id_usuario`)) WHERE !(`p`.`id_persona` in (select `tb_clientes`.`id_persona` from `tb_clientes` where `tb_clientes`.`id_persona` is not null)) ORDER BY `c`.`id_contactabilidad` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_contratos_contar_ficha_vacia`
--
DROP TABLE IF EXISTS `vw_contratos_contar_ficha_vacia`;

DROP VIEW IF EXISTS `vw_contratos_contar_ficha_vacia`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_contratos_contar_ficha_vacia`  AS SELECT count(0) AS `total_contratos_ficha_vacia` FROM `tb_contratos` WHERE json_unquote(json_extract(`tb_contratos`.`ficha_instalacion`,'$.id_ficha')) is null AND json_length(`tb_contratos`.`ficha_instalacion`) = 1 AND `tb_contratos`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_contratos_listar`
--
DROP TABLE IF EXISTS `vw_contratos_listar`;

DROP VIEW IF EXISTS `vw_contratos_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_contratos_listar`  AS SELECT `c`.`id_contrato` AS `id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN concat(`p`.`apellidos`,', ',`p`.`nombres`) ELSE `e`.`razon_social` END AS `nombre_cliente`, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nro_doc` ELSE `e`.`ruc` END AS `num_identificacion`, `c`.`direccion_servicio` AS `direccion_servicio`, `t`.`paquete` AS `paquete`, `t`.`precio` AS `precio`, group_concat(`sv`.`tipo_servicio` separator ',') AS `tipos_servicio` FROM (((((`tb_contratos` `c` join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) left join `tb_empresas` `e` on(`cl`.`id_empresa` = `e`.`id_empresa`)) join `tb_paquetes` `t` on(`c`.`id_paquete` = `t`.`id_paquete`)) join `tb_servicios` `sv` on(json_contains(`t`.`id_servicio`,json_object('id_servicio',`sv`.`id_servicio`)))) WHERE `c`.`inactive_at` is null GROUP BY `c`.`id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN concat(`p`.`apellidos`,', ',`p`.`nombres`) ELSE `e`.`razon_social` END, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nro_doc` ELSE `e`.`ruc` END, `c`.`direccion_servicio`, `t`.`paquete`, `t`.`precio` ORDER BY `c`.`id_contrato` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_contratos_listar_ficha_null`
--
DROP TABLE IF EXISTS `vw_contratos_listar_ficha_null`;

DROP VIEW IF EXISTS `vw_contratos_listar_ficha_null`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_contratos_listar_ficha_null`  AS SELECT `c`.`id_contrato` AS `id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN concat(`p`.`apellidos`,' ',`p`.`nombres`) ELSE `e`.`razon_social` END AS `nombre_cliente`, `p2`.`paquete` AS `nombre_paquete`, `s`.`sector` AS `nombre_sector`, concat(`rp`.`apellidos`,' ',`rp`.`nombres`) AS `nombre_tecnico_registro`, `rp`.`telefono` AS `telefono`, `c`.`direccion_servicio` AS `direccion_servicio`, `c`.`referencia` AS `referencia`, `c`.`ficha_instalacion` AS `ficha_instalacion`, `c`.`coordenada` AS `coordenada`, `c`.`fecha_inicio` AS `fecha_inicio`, `c`.`fecha_registro` AS `fecha_registro`, `c`.`fecha_fin` AS `fecha_fin`, `c`.`nota` AS `nota`, `c`.`create_at` AS `create_at`, `c`.`update_at` AS `update_at`, `c`.`inactive_at` AS `inactive_at`, `c`.`iduser_update` AS `iduser_update`, `c`.`iduser_inactive` AS `iduser_inactive`, group_concat(`sv`.`tipo_servicio` separator ', ') AS `tipos_servicio` FROM (((((((((`tb_contratos` `c` join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) left join `tb_empresas` `e` on(`cl`.`id_cliente` = `e`.`id_empresa`)) join `tb_paquetes` `p2` on(`c`.`id_paquete` = `p2`.`id_paquete`)) join `tb_sectores` `s` on(`c`.`id_sector` = `s`.`id_sector`)) join `tb_responsables` `r` on(`c`.`id_usuario_registro` = `r`.`id_responsable`)) join `tb_usuarios` `u` on(`r`.`id_usuario` = `u`.`id_usuario`)) join `tb_personas` `rp` on(`u`.`id_persona` = `rp`.`id_persona`)) left join `tb_servicios` `sv` on(json_contains(`p2`.`id_servicio`,json_object('id_servicio',`sv`.`id_servicio`)))) WHERE json_unquote(json_extract(`c`.`ficha_instalacion`,'$.id_ficha')) is null AND json_length(`c`.`ficha_instalacion`) = 1 AND `c`.`inactive_at` is null GROUP BY `c`.`id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN concat(`p`.`apellidos`,' ',`p`.`nombres`) ELSE `e`.`razon_social` END, `p2`.`paquete`, `s`.`sector`, concat(`rp`.`apellidos`,' ',`rp`.`nombres`), `c`.`direccion_servicio`, `c`.`referencia`, `c`.`ficha_instalacion`, `c`.`coordenada`, `c`.`fecha_inicio`, `c`.`fecha_registro`, `c`.`fecha_fin`, `c`.`nota`, `c`.`create_at`, `c`.`update_at`, `c`.`inactive_at`, `c`.`iduser_update`, `c`.`iduser_inactive` ORDER BY `c`.`id_contrato` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_empresas_listar`
--
DROP TABLE IF EXISTS `vw_empresas_listar`;

DROP VIEW IF EXISTS `vw_empresas_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_empresas_listar`  AS SELECT `e`.`id_empresa` AS `id_empresa`, `e`.`ruc` AS `ruc`, `e`.`representante_legal` AS `representante_legal`, `e`.`razon_social` AS `razon_social`, `e`.`nombre_comercial` AS `nombre_comercial`, `e`.`telefono` AS `telefono`, `e`.`email` AS `email`, `e`.`create_at` AS `create_at`, `e`.`update_at` AS `update_at`, `e`.`inactive_at` AS `inactive_at`, `e`.`iduser_create` AS `iduser_create`, `e`.`iduser_update` AS `iduser_update`, `e`.`iduser_inactive` AS `iduser_inactive` FROM `tb_empresas` AS `e` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_fichainstalacion_filtrar`
--
DROP TABLE IF EXISTS `vw_fichainstalacion_filtrar`;

DROP VIEW IF EXISTS `vw_fichainstalacion_filtrar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_fichainstalacion_filtrar`  AS SELECT `c`.`id_contrato` AS `id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nombres` ELSE `e`.`razon_social` END AS `nombre_cliente`, `c`.`direccion_servicio` AS `direccion_servicio`, group_concat(`sv`.`tipo_servicio` separator ',') AS `tipos_servicio`, group_concat(`sv`.`servicio` separator ',') AS `servicios`, cast(`c`.`create_at` as date) AS `fecha_creacion` FROM (((((`tb_contratos` `c` join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) left join `tb_empresas` `e` on(`cl`.`id_cliente` = `e`.`id_empresa`)) join `tb_paquetes` `t` on(`c`.`id_paquete` = `t`.`id_paquete`)) join `tb_servicios` `sv` on(json_contains(`t`.`id_servicio`,concat('{"id_servicio":',`sv`.`id_servicio`,'}')))) WHERE `c`.`inactive_at` is null AND `c`.`ficha_instalacion` is null GROUP BY `c`.`id_contrato`, CASE WHEN `cl`.`id_persona` is not null THEN `p`.`nombres` ELSE `e`.`razon_social` END, `c`.`direccion_servicio`, `c`.`create_at` ORDER BY `c`.`create_at` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_kardex_listar`
--
DROP TABLE IF EXISTS `vw_kardex_listar`;

DROP VIEW IF EXISTS `vw_kardex_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_kardex_listar`  AS SELECT `k`.`id_kardex` AS `id_kardex`, `p`.`id_producto` AS `id_producto`, `p`.`modelo` AS `modelo`, `p`.`id_tipo` AS `id_tipo_producto`, `tp`.`tipo_nombre` AS `tipo_producto`, `p`.`id_marca` AS `id_marca`, `m`.`marca` AS `nombre_marca`, `p`.`precio_actual` AS `precio_actual`, `k`.`fecha` AS `fecha`, `k`.`id_tipooperacion` AS `id_tipo_operacion`, `toper`.`descripcion` AS `tipo_operacion`, `k`.`cantidad` AS `cantidad`, `k`.`saldo_total` AS `saldo_total`, `k`.`valor_unico_historico` AS `valor_unico_historico`, `k`.`create_at` AS `fecha_creacion`, `k`.`id_almacen` AS `id_almacen`, `a`.`nombre_almacen` AS `nombre_almacen`, concat(`pe`.`nombres`,' ',`pe`.`apellidos`) AS `creado_por`, CASE WHEN `toper`.`movimiento` = 'E' THEN 'ENTRADA' WHEN `toper`.`movimiento` = 'S' THEN 'SALIDA' END AS `tipo_movimiento` FROM ((((((`tb_productos` `p` join `tb_kardex` `k` on(`p`.`id_producto` = `k`.`id_producto`)) join `tb_tipoproducto` `tp` on(`p`.`id_tipo` = `tp`.`id_tipo`)) join `tb_marca` `m` on(`p`.`id_marca` = `m`.`id_marca`)) join `tb_tipooperacion` `toper` on(`k`.`id_tipooperacion` = `toper`.`id_tipooperacion`)) join `tb_almacen` `a` on(`k`.`id_almacen` = `a`.`id_almacen`)) left join `tb_personas` `pe` on(`k`.`iduser_create` = `pe`.`id_persona`)) ORDER BY `k`.`create_at` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_marca`
--
DROP TABLE IF EXISTS `vw_marca`;

DROP VIEW IF EXISTS `vw_marca`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_marca`  AS SELECT `tb_marca`.`id_marca` AS `id_marca`, `tb_marca`.`marca` AS `marca`, `tb_marca`.`create_at` AS `create_at`, `tb_marca`.`iduser_create` AS `iduser_create` FROM `tb_marca` WHERE `tb_marca`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_paquetes_listar`
--
DROP TABLE IF EXISTS `vw_paquetes_listar`;

DROP VIEW IF EXISTS `vw_paquetes_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_paquetes_listar`  AS SELECT `p`.`id_paquete` AS `id_paquete`, `p`.`id_servicio` AS `id_servicio`, group_concat(`s`.`servicio` separator ',') AS `servicios`, group_concat(`s`.`tipo_servicio` separator ',') AS `tipos_servicio`, `p`.`paquete` AS `paquete`, `p`.`precio` AS `precio`, `p`.`velocidad` AS `velocidad`, `p`.`create_at` AS `create_at`, `p`.`update_at` AS `update_at`, `p`.`inactive_at` AS `inactive_at`, `p`.`iduser_create` AS `iduser_create`, `p`.`iduser_update` AS `iduser_update` FROM (`tb_paquetes` `p` join `tb_servicios` `s` on(json_contains(`p`.`id_servicio`,concat('{"id_servicio":',`s`.`id_servicio`,'}')))) GROUP BY `p`.`id_paquete` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_personas_listar`
--
DROP TABLE IF EXISTS `vw_personas_listar`;

DROP VIEW IF EXISTS `vw_personas_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_personas_listar`  AS SELECT `p`.`id_persona` AS `id_persona`, `p`.`tipo_doc` AS `tipo_doc`, `p`.`nro_doc` AS `nro_doc`, concat(`p`.`apellidos`,', ',`p`.`nombres`) AS `Nombre_Completo`, `p`.`telefono` AS `telefono`, `p`.`nacionalidad` AS `nacionalidad`, `p`.`email` AS `email`, `cl`.`direccion` AS `direccion_contacto` FROM (`tb_personas` `p` left join `tb_clientes` `cl` on(`p`.`id_persona` = `cl`.`id_persona`)) WHERE `p`.`id_persona` <> 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_productos_detalle`
--
DROP TABLE IF EXISTS `vw_productos_detalle`;

DROP VIEW IF EXISTS `vw_productos_detalle`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_productos_detalle`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`modelo` AS `modelo`, `p`.`precio_actual` AS `precio_actual`, `p`.`codigo_barra` AS `codigo_barra`, `m`.`marca` AS `marca`, `m`.`id_marca` AS `id_marca`, `t`.`tipo_nombre` AS `tipo_nombre`, `t`.`id_tipo` AS `id_tipo`, `u`.`unidad_nombre` AS `unidad_nombre`, `u`.`id_unidad` AS `id_unidad`, `p`.`create_at` AS `create_at`, `p`.`update_at` AS `update_at`, `p`.`inactive_at` AS `inactive_at`, `p`.`iduser_create` AS `iduser_create`, `p`.`iduser_update` AS `iduser_update`, `p`.`iduser_inactive` AS `iduser_inactive` FROM (((`tb_productos` `p` join `tb_marca` `m` on(`p`.`id_marca` = `m`.`id_marca`)) join `tb_tipoproducto` `t` on(`p`.`id_tipo` = `t`.`id_tipo`)) join `tb_unidadmedida` `u` on(`p`.`id_unidad` = `u`.`id_unidad`)) WHERE `p`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_rolesdetallado_listar`
--
DROP TABLE IF EXISTS `vw_rolesdetallado_listar`;

DROP VIEW IF EXISTS `vw_rolesdetallado_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_rolesdetallado_listar`  AS SELECT `r`.`id_rol` AS `id_rol`, `r`.`rol` AS `rol`, `r`.`permisos` AS `permisos`, `r`.`create_at` AS `create_at`, `r`.`update_at` AS `update_at`, `r`.`inactive_at` AS `inactive_at`, `r`.`iduser_create` AS `iduser_create`, `u1`.`nombre_user` AS `usuario_creador`, `r`.`iduser_update` AS `iduser_update`, `u2`.`nombre_user` AS `usuario_modificador`, `r`.`iduser_inactive` AS `iduser_inactive`, `u3`.`nombre_user` AS `usuario_inactivador` FROM (((`tb_roles` `r` left join `tb_usuarios` `u1` on(`r`.`iduser_create` = `u1`.`id_usuario`)) left join `tb_usuarios` `u2` on(`r`.`iduser_update` = `u2`.`id_usuario`)) left join `tb_usuarios` `u3` on(`r`.`iduser_inactive` = `u3`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_roles_listar`
--
DROP TABLE IF EXISTS `vw_roles_listar`;

DROP VIEW IF EXISTS `vw_roles_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_roles_listar`  AS SELECT `r`.`id_rol` AS `id_rol`, `r`.`rol` AS `rol`, `r`.`create_at` AS `create_at`, `r`.`update_at` AS `update_at`, `r`.`iduser_create` AS `iduser_create`, `r`.`inactive_at` AS `inactive_at` FROM `tb_roles` AS `r` WHERE `r`.`rol` <> 'Administrador' ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_sectores_listar`
--
DROP TABLE IF EXISTS `vw_sectores_listar`;

DROP VIEW IF EXISTS `vw_sectores_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_sectores_listar`  AS SELECT `tb_sectores`.`id_sector` AS `id_sector`, `tb_sectores`.`sector` AS `sector` FROM `tb_sectores` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_sectores_obtener`
--
DROP TABLE IF EXISTS `vw_sectores_obtener`;

DROP VIEW IF EXISTS `vw_sectores_obtener`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_sectores_obtener`  AS SELECT `s`.`id_sector` AS `id_sector`, `s`.`sector` AS `sector`, `s`.`id_distrito` AS `id_distrito`, `s`.`descripcion` AS `descripcion`, `s`.`direccion` AS `direccion`, `s`.`coordenadas` AS `coordenadas`, `d`.`distrito` AS `distrito`, `s`.`create_at` AS `create_at`, `s`.`update_at` AS `update_at`, `s`.`inactive_at` AS `inactive_at`, `s`.`iduser_create` AS `iduser_create`, `s`.`iduser_update` AS `iduser_update`, `s`.`iduser_inactive` AS `iduser_inactive` FROM (`tb_sectores` `s` left join `tb_distritos` `d` on(`s`.`id_distrito` = `d`.`id_distrito`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_servicios_listar`
--
DROP TABLE IF EXISTS `vw_servicios_listar`;

DROP VIEW IF EXISTS `vw_servicios_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_servicios_listar`  AS SELECT `s`.`id_servicio` AS `id_servicio`, `s`.`tipo_servicio` AS `tipo_servicio`, `s`.`servicio` AS `servicio`, `s`.`inactive_at` AS `inactive_at` FROM `tb_servicios` AS `s` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_servicios_listarTotal`
--
DROP TABLE IF EXISTS `vw_servicios_listarTotal`;

DROP VIEW IF EXISTS `vw_servicios_listarTotal`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_servicios_listarTotal`  AS SELECT `s`.`id_servicio` AS `id_servicio`, `s`.`servicio` AS `servicio`, `s`.`create_at` AS `create_at`, `s`.`update_at` AS `update_at`, `s`.`inactive_at` AS `inactive_at`, `s`.`iduser_create` AS `iduser_create`, `s`.`iduser_update` AS `iduser_update`, `s`.`iduser_inactive` AS `iduser_inactive` FROM `tb_servicios` AS `s` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_soporte_detalle`
--
DROP TABLE IF EXISTS `vw_soporte_detalle`;

DROP VIEW IF EXISTS `vw_soporte_detalle`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_soporte_detalle`  AS SELECT `s`.`id_soporte` AS `id_soporte`, `c`.`coordenada` AS `coordenada`, `s`.`id_contrato` AS `id_contrato`, `c`.`id_sector` AS `id_sector`, `sct`.`sector` AS `sector`, `s`.`fecha_hora_solicitud` AS `fecha_hora_solicitud`, `s`.`fecha_hora_asistencia` AS `fecha_hora_asistencia`, `s`.`prioridad` AS `prioridad`, `s`.`soporte` AS `soporte`, `s`.`descripcion_problema` AS `descripcion_problema`, `s`.`descripcion_solucion` AS `descripcion_solucion`, coalesce(`p_cliente`.`nro_doc`,`emp`.`ruc`) AS `nro_doc`, `c`.`id_cliente` AS `id_cliente`, `c`.`direccion_servicio` AS `direccion_servicio`, `r`.`id_usuario` AS `id_tecnico`, `p_tecnico`.`nombres` AS `tecnico_nombres`, `p_tecnico`.`apellidos` AS `tecnico_apellidos`, `pk`.`id_paquete` AS `id_paquete`, `pk`.`id_servicio` AS `id_servicio` FROM (((((((((`tb_soporte` `s` left join `tb_contratos` `c` on(`s`.`id_contrato` = `c`.`id_contrato`)) join `tb_sectores` `sct` on(`c`.`id_sector` = `sct`.`id_sector`)) left join `tb_responsables` `r` on(`s`.`id_tecnico` = `r`.`id_responsable`)) left join `tb_usuarios` `u` on(`r`.`id_usuario` = `u`.`id_usuario`)) left join `tb_personas` `p_tecnico` on(`u`.`id_persona` = `p_tecnico`.`id_persona`)) left join `tb_paquetes` `pk` on(`c`.`id_paquete` = `pk`.`id_paquete`)) left join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) left join `tb_empresas` `emp` on(`cl`.`id_empresa` = `emp`.`id_empresa`)) left join `tb_personas` `p_cliente` on(`cl`.`id_persona` = `p_cliente`.`id_persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_soporte_fichadatos`
--
DROP TABLE IF EXISTS `vw_soporte_fichadatos`;

DROP VIEW IF EXISTS `vw_soporte_fichadatos`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_soporte_fichadatos`  AS SELECT `p`.`nro_doc` AS `nro_doc`, `s`.`id_soporte` AS `id_soporte`, `s`.`soporte` AS `soporte`, `s`.`descripcion_problema` AS `descripcion_problema`, `s`.`descripcion_solucion` AS `descripcion_solucion`, `s`.`update_at` AS `update_at`, `sv`.`tipo_servicio` AS `tipo_servicio`, `c`.`coordenada` AS `coordenada`, `sv`.`servicio` AS `servicio` FROM (((((`tb_soporte` `s` join `tb_contratos` `c` on(`s`.`id_contrato` = `c`.`id_contrato`)) join `tb_clientes` `cl` on(`c`.`id_cliente` = `cl`.`id_cliente`)) join `tb_personas` `p` on(`cl`.`id_persona` = `p`.`id_persona`)) join `tb_paquetes` `pk` on(`c`.`id_paquete` = `pk`.`id_paquete`)) join `tb_servicios` `sv` on(json_contains(`pk`.`id_servicio`,concat('{"id_servicio":',`sv`.`id_servicio`,'}')))) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_tipo_productos`
--
DROP TABLE IF EXISTS `vw_tipo_productos`;

DROP VIEW IF EXISTS `vw_tipo_productos`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_tipo_productos`  AS SELECT `tb_tipoproducto`.`id_tipo` AS `id_tipo`, `tb_tipoproducto`.`tipo_nombre` AS `tipo_nombre`, `tb_tipoproducto`.`iduser_create` AS `iduser_create`, `tb_tipoproducto`.`iduser_update` AS `iduser_update` FROM `tb_tipoproducto` WHERE `tb_tipoproducto`.`inactive_at` is null ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_unidadmedida`
--
DROP TABLE IF EXISTS `vw_unidadmedida`;

DROP VIEW IF EXISTS `vw_unidadmedida`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_unidadmedida`  AS SELECT `tb_unidadmedida`.`id_unidad` AS `id_unidad`, `tb_unidadmedida`.`unidad_nombre` AS `unidad_nombre`, `tb_unidadmedida`.`create_at` AS `create_at`, `tb_unidadmedida`.`update_at` AS `update_at`, `tb_unidadmedida`.`iduser_create` AS `iduser_create`, `tb_unidadmedida`.`iduser_update` AS `iduser_update` FROM `tb_unidadmedida` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_usuarios_listar`
--
DROP TABLE IF EXISTS `vw_usuarios_listar`;

DROP VIEW IF EXISTS `vw_usuarios_listar`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_usuarios_listar`  AS SELECT `res`.`id_responsable` AS `id_responsable`, `us`.`id_usuario` AS `id_usuario`, `ro`.`id_rol` AS `id_rol`, coalesce(concat(`pe`.`nombres`,', ',`pe`.`apellidos`)) AS `nombre`, `us`.`nombre_user` AS `nombre_user`, `ro`.`rol` AS `Cargo`, `us`.`create_at` AS `create_at`, `us`.`inactive_at` AS `inactive_at` FROM (((`tb_responsables` `res` join `tb_usuarios` `us` on(`res`.`id_usuario` = `us`.`id_usuario`)) join `tb_personas` `pe` on(`us`.`id_persona` = `pe`.`id_persona`)) join `tb_roles` `ro` on(`res`.`id_rol` = `ro`.`id_rol`)) WHERE `us`.`inactive_at` is null AND `us`.`id_usuario` <> 1 ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tb_antenas`
--
ALTER TABLE `tb_antenas`
  ADD CONSTRAINT `fk_sector_antena` FOREIGN KEY (`id_distrito`) REFERENCES `tb_distritos` (`id_distrito`);

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
  ADD CONSTRAINT `sopor_fk_id_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `tb_responsables` (`id_responsable`);

--
-- Filtros para la tabla `tb_subbase`
--
ALTER TABLE `tb_subbase`
  ADD CONSTRAINT `fk_id_base` FOREIGN KEY (`id_base`) REFERENCES `tb_base` (`id_base`);

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
CREATE EVENT `ev_inhabilitar_contactos` ON SCHEDULE EVERY 1 DAY STARTS '2025-01-26 09:55:53' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    CALL spu_contactabilidad_inhabilitar(); 
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
