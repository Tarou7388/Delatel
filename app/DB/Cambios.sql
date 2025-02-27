-- Active: 1740619856376@@127.0.0.1@3306@delatel
use delatel;

ALTER TABLE tb_clientes 
ADD CONSTRAINT unique_id_persona UNIQUE (id_persona),
ADD CONSTRAINT unique_id_empresa UNIQUE (id_empresa);
DROP INDEX unique_persona_empresa;



DELIMITER $$

DROP PROCEDURE IF EXISTS spu_cargar_cliente_por_dniPersona $$

CREATE PROCEDURE spu_cargar_cliente_por_dniPersona(
    IN numero_documento VARCHAR(15),
    IN direccion VARCHAR(250),
    IN referencia VARCHAR(250),
    IN coordenadas VARCHAR(50),
    IN iduser_create INT
)
BEGIN
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

END $$

DELIMITER ;


CALL spu_registrar_empresa('20410275768', 'PSJ. SAN CRISTOBAL N°370 - VILLA JULIA - SUNAMPE (CASA HOGAR)', 'NINGUNA', '-13.418362643252138, -76.14625131804955', 1); 
CALL spu_registrar_empresa('20147673478', 'PZA. DE ARMAS NRO. 100 - ICA CHINCHA SUNAMPE', 'NINGUNA', '-13.427444185050662, -76.1636625574809', 1); 
CALL spu_registrar_empresa('20452777399', 'CL. SEÑOR DE LUNER N° 234 - C.P. LOMO LARGO - SUNAMPE', 'NINGUNA', '-13.41790720445856, -76.16727940737397', 1); 

--CALL spu_cargar_cliente_por_dniPersona('43081077', 'C.P. CONDORILLO ALTO, CRUZ DEL ROSARIO MZ A LT 12 - CHINCHA', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('46952075', 'Av. San Cristobal 155- San Ignacio-Sunampe', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('41721338', 'AV. Primavera 130', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('40597904', 'San Pedro De Pilpa Costado de la capilla', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('42698548', 'Asoc. Nueva generacion siglo 21', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('41538126', 'Av.Los Arenales #268', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('43145534', 'PSJ. SAN BLAS N241 - LOMO LARGO - SUNAMPE', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('21785115', 'AV. FATIMA S/N - SUNAMPE', 'NINGUNA', 'NULL', 1);
--CALL spu_cargar_cliente_por_dniPersona('21850270', 'AV. FATIMA N° 373 - SUNAMPE', 'NINGUNA', 'NULL', 1); 