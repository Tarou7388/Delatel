-- SQLBook: Code
USE Delatel;


INSERT INTO tb_servicios (tipo_servicio, servicio, iduser_create) VALUES
  ('CABL','Cable', 1),
  ('WISP','Wireless Internet Service Provider', 1),
  ('FIBR','Fibra Óptica', 1);

INSERT INTO tb_paquetes (id_servicio, paquete, precio, velocidad, iduser_create) VALUES
('{"id_servicio": [3]}', 'Plan Internet Corporativo 300MB - 270', '65.00', '{"bajada":{"maxima":300,"minima_garantizada":270},"subida":{"maxima":300,"minima_garantizada":270}}', 1),
('{"id_servicio": [3]}', 'Plan Internet 55MB - 50', '60.00', '{"bajada":{"maxima":55,"minima_garantizada":50},"subida":{"maxima":55,"minima_garantizada":50}}', 1),
('{"id_servicio": [3]}', 'Plan Internet 110MB - 70', '70.00', '{"bajada":{"maxima":110,"minima_garantizada":70},"subida":{"maxima":110,"minima_garantizada":70}}', 1),
('{"id_servicio": [3]}', 'Plan Internet 155MB - 90', '68.00', '{"bajada":{"maxima":155,"minima_garantizada":90},"subida":{"maxima":155,"minima_garantizada":90}}', 1),
('{"id_servicio": [3]}', 'Plan Internet 165MB - 95', '67.00', '{"bajada":{"maxima":165,"minima_garantizada":95},"subida":{"maxima":165,"minima_garantizada":95}}', 1),
('{"id_servicio": [3]}', 'Plan Internet MIGRA 210MB - 110', '69.00', '{"bajada":{"maxima":210,"minima_garantizada":110},"subida":{"maxima":210,"minima_garantizada":110}}', 1),
('{"id_servicio": [3]}', 'Plan Internet 280MB - 150', '66.00', '{"bajada":{"maxima":280,"minima_garantizada":150},"subida":{"maxima":280,"minima_garantizada":150}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Duo Bronce 110MB - 80', '100.00', '{"bajada":{"maxima":110,"minima_garantizada":80},"subida":{"maxima":110,"minima_garantizada":80}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Duo Plata', '105.00', '{"bajada":{"maxima":100,"minima_garantizada":80},"subida":{"maxima":100,"minima_garantizada":80}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Duo Oro 210MB - 120', '110.00', '{"bajada":{"maxima":210,"minima_garantizada":120},"subida":{"maxima":210,"minima_garantizada":120}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Duo 180MB - 100', '95.00', '{"bajada":{"maxima":180,"minima_garantizada":100},"subida":{"maxima":180,"minima_garantizada":100}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Duo 410MB - 140', '120.00', '{"bajada":{"maxima":410,"minima_garantizada":140},"subida":{"maxima":410,"minima_garantizada":140}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Full Duo 2 - 190MB - 99', '115.00', '{"bajada":{"maxima":190,"minima_garantizada":99},"subida":{"maxima":190,"minima_garantizada":99}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Full Duo 3 - 260MB - 120', '130.00', '{"bajada":{"maxima":260,"minima_garantizada":120},"subida":{"maxima":260,"minima_garantizada":120}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Full Duo 4 - 320MB - 135', '125.00', '{"bajada":{"maxima":320,"minima_garantizada":135},"subida":{"maxima":320,"minima_garantizada":135}}', 1),
('{"id_servicio": [1,3]}', 'Plan Internet Full Duo 5 - 410MB - 159', '140.00', '{"bajada":{"maxima":410,"minima_garantizada":159},"subida":{"maxima":410,"minima_garantizada":159}}', 1),
('{"id_servicio": [2]}', 'Plan TamboMora Residencial 40MB - 50', '120.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Techo Videna Residencial 20MB - 50', '110.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Salvador Residencial 20MB - 50', '115.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Sunampe Residencial 15MB', '105.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Chacarita Residencial 40MB - 50', '130.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Chacarita Residencial 40MB - 80', '140.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Satelite Residencial 40MB - 70', '125.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan TamboMora Residencial 40MB', '120.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Sunampe Corporativo 50MB - 210', '150.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Sunampe Corporativo 50MB - 280', '160.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Chincha Corporativo 50MB - 280', '170.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Grocio Residencial 10MB', '90.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Grocio Residencial 12MB', '95.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Grocio Residencial 20MB', '100.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan TechoPropio Residencial 10MB', '85.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan TechoPropio Residencial 20MB', '105.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Satelite Residencial 10MB', '80.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Satelite Residencial 12MB', '90.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Satelite Residencial 20MB', '110.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan CruzBlanca Residencial 10MB', '75.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan CruzBlanca Residencial 12MB', '85.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan CruzBlanca Residencial 20MB', '95.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Salvador Residencial 10MB', '70.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Salvador Residencial 20MB', '100.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [2]}', 'Plan Salvador Residencial 10MB', '75.00', '{"bajada":20,"subida":20}', 1),
('{"id_servicio": [1]}', 'ABRO1 SERVICIO CATV 2 TV-BASICO + 1 APL - DUO 80 ANTERIOR', '45.00', NULL, 1),
('{"id_servicio": [1]}', 'AGOS080 NUEVO SERVICIO SOLO CATV3 TV - BASICO + 1 APL', '50.00', NULL, 1),
('{"id_servicio": [1]}', 'JUN056 PLAN DUO + 01 TV = CATV 4 TV - BASICO + 1 APL', '48.00', NULL, 1),
('{"id_servicio": [1]}', 'MAY053 NUEVO SERVICIO CATV 3 TV - BASICO + 1 APL', '49.00', NULL, 1),
('{"id_servicio": [1]}', 'MAY054 NUEVO SERVICIO SOLO CATV 3 TV - BASICO + 1 APL', '47.00', NULL, 1),
('{"id_servicio": [1]}', 'MAY055 NUEVO SERVICIO DUO CATV 4 TV - BASICO + 1 APL', '46.00', NULL, 1);


INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, nacionalidad, email, iduser_create) VALUES
('DNI','12345678', 'PEREZ GARCIA', 'JUAN', '987654321', 'Peruano', 'juan.perezgarcia@example.com', 1),
('DNI','73884605','MATTA RAMOS','JESUS EDUARDO','904217929','Peruano',NULL,1),
('DNI','73310144','MESIAS TASAYCO','BRAYAN','933293445','Peruano',NULL,1),
('DNI','72845296','DE LA CRUZ PEÑALOZA','ELOY ALEXANDER','920520306','Peruano',NULL,1),
('DNI','71592495','TALLA SARAVIA','ALEXIS ALEXANDER','907277520','Peruano',NULL,1),
('DNI','41821854','DE LA CRUZ NAPA','JOSE IVAN','945780584','PERUANO',NULL,1)
 

INSERT INTO tb_empresas (ruc, representante_legal, razon_social, nombre_comercial, telefono, email, iduser_create) VALUES
('20123456789', 'Luis García', 'Servicios Informáticos S.A.', 'InfoTech', '987654321', 'info@infotech.com', 1),
('20234567890', 'Ana Martínez', 'Soluciones Empresariales S.R.L.', 'SolEmp', '976543210', 'contacto@solemp.com', 1),
('20345678901', 'Carlos Lopez', 'Desarrollo y Consultoría', 'DevConsult', '965432109', 'consultoria@devconsult.com', 1),
('20456789012', 'María Pérez', 'Tecnología Avanzada', 'TechAdvance', '954321098', 'info@techadvance.com', 1),
('20567890123', 'José Fernández', 'Consultores Asociados', 'ConAsociados', '943210987', 'contacto@conasociados.com', 1),
('20678901234', 'Claudia Torres', 'Innovación Digital S.A.C.', 'InnovaDigital', '932109876', 'info@innovadigital.com', 1),
('20789012345', 'Andrés Ruiz', 'Gestión de Proyectos S.R.L.', 'ProyGest', '921098765', 'contacto@proygest.com', 1),
('20890123456', 'Laura Sánchez', 'Soluciones Logísticas', 'LogiSol', '910987654', 'info@logisol.com', 1),
('20901234567', 'Ricardo Jiménez', 'Tecnologías de la Información', 'TechInfo', '909876543', 'contacto@techinfo.com', 1),
('21012345678', 'Patricia Silva', 'Estrategias Comerciales S.A.', 'EstrategiaCom', '898765432', 'info@estrategiacom.com', 1),
('21123456789', 'Javier Morales', 'Desarrollo Web S.R.L.', 'WebDev', '887654321', 'contacto@webdev.com', 1),
('21234567890', 'Verónica Castro', 'Consultoría Financiera', 'FinanConsult', '876543210', 'info@financonsult.com', 1),
('21345678901', 'Fernando Delgado', 'Servicios de Marketing', 'MarketServ', '865432109', 'contacto@marketserv.com', 1),
('21456789012', 'Mónica Herrera', 'Desarrollo de Software', 'SoftDev', '854321098', 'info@softdev.com', 1),
('21567890123', 'Santiago Castillo', 'Consultores de Negocios', 'ConNegocios', '843210987', 'contacto@connegocios.com', 1),
('21678901234', 'Elena Mendoza', 'Soluciones Ambientales', 'AmbiSol', '832109876', 'info@ambisol.com', 1),
('21789012345', 'Pablo Romero', 'Sistemas Integrales S.R.L.', 'SistInteg', '821098765', 'contacto@sistinteg.com', 1),
('21890123456', 'Gabriela López', 'Innovación Empresarial', 'InnovaEmp', '810987654', 'info@innovaemp.com', 1),
('21901234567', 'Hugo Pérez', 'Desarrollo Sostenible', 'DesaSostenible', '809876543', 'contacto@desasostenible.com', 1),
('22012345678', 'Raquel Salas', 'Tecnologías Avanzadas', 'TechAvan', '798765432', 'info@techavan.com', 1),
('22123456789', 'Diego García', 'Soluciones Creativas S.A.C.', 'CreaSol', '787654321', 'contacto@creasol.com', 1),
('22234567890', 'Susana Ríos', 'Asesoría en TI', 'AsesoriaTI', '776543210', 'info@asesoriati.com', 1),
('22345678901', 'Jorge Castro', 'Innovaciones Técnicas', 'InnovaTec', '765432109', 'contacto@innovatec.com', 1),
('22456789012', 'Carla Ramos', 'Desarrollo de Aplicaciones', 'AppDev', '754321098', 'info@appdev.com', 1),
('22567890123', 'Nicolás Mendoza', 'Gestión de Recursos S.R.L.', 'RecursosGest', '743210987', 'contacto@recursosgest.com', 1),
('22678901234', 'Marta Ortega', 'Consultoría en Procesos', 'ProcCon', '732109876', 'info@proccon.com', 1),
('22789012345', 'Mauricio López', 'Soluciones Educativas', 'EduSol', '721098765', 'contacto@edusol.com', 1),
('22890123456', 'Adriana Flores', 'Marketing Digital', 'DigitalMarket', '710987654', 'info@digitalmarket.com', 1),
('22901234567', 'Felipe Morales', 'Consultoría Jurídica', 'JuridConsult', '709876543', 'contacto@juridconsult.com', 1),
('23012345678', 'Olga Fernández', 'Estrategias de Ventas', 'EstrategiaVentas', '698765432', 'info@estrategiaventas.com', 1),
('23123456789', 'Ignacio Torres', 'Servicios de Diseño', 'DiseñoServ', '687654321', 'contacto@disenoserv.com', 1),
('23234567890', 'Natalia Guzmán', 'Innovación en Salud', 'SaludInnova', '676543210', 'info@saludinnova.com', 1),
('23345678901', 'Ricardo Salcedo', 'Soluciones de Recursos Humanos', 'RecursosHum', '665432109', 'contacto@recursoshum.com', 1),
('23456789012', 'Silvia Morales', 'Consultoría en Tecnologías', 'TecConsult', '654321098', 'info@tecconsult.com', 1),
('23567890123', 'Raúl Gutiérrez', 'Servicios de Ingeniería', 'EngiServ', '643210987', 'contacto@engiserv.com', 1),
('23678901234', 'Camila Sánchez', 'Innovación Empresarial S.R.L.', 'EmpInnova', '632109876', 'info@empinnova.com', 1),
('23789012345', 'Julio Ramírez', 'Gestión Ambiental S.A.C.', 'AmbientalGest', '621098765', 'contacto@ambientalgest.com', 1),
('23890123456', 'Sofía Herrera', 'Tecnologías Sustentables', 'SustenTech', '610987654', 'info@sustentech.com', 1),
('23901234567', 'David Torres', 'Asesoría Financiera S.A.', 'FinanAses', '609876543', 'contacto@finanases.com', 1),
('24012345678', 'María Vargas', 'Consultores Legales', 'LegalConsult', '598765432', 'info@legalconsult.com', 1),
('24123456789', 'Esteban Gálvez', 'Desarrollo de Proyectos', 'ProyectDev', '587654321', 'contacto@proyectdev.com', 1),
('24234567890', 'Daniela Ortiz', 'Servicios Médicos S.A.C.', 'MedServ', '576543210', 'info@medserv.com', 1),
('24345678901', 'Gustavo Peña', 'Consultores en Ventas', 'VentasConsult', '565432109', 'contacto@ventasconsult.com', 1);

INSERT INTO tb_almacen (nombre_almacen, ubicacion,coordenada, create_at, iduser_create) VALUES
('Almacen 1', "Av 123","-13.415960344185644, -76.13418174072265", NOW(), 1),
('Almacen 2', "Av 123456","-13.427602649212902, -76.13979326342246", NOW(), 1);


INSERT INTO tb_marca (marca, create_at, iduser_create) VALUES
('TP Link', NOW(), 1),
('Phyhome', NOW(), 1),
('VSOL', NOW(), 1),
('Ubiquiti', NOW(), 1),
('Huawei', NOW(), 1),
('Micronics', NOW(), 1),
('Mercusys', NOW(), 1),
('Generico',NOW(),1),
('Sin Marca', NOW(), 1);


INSERT INTO tb_tipoproducto (tipo_nombre, create_at, iduser_create) VALUES
('Router', NOW(), 1),
('Sintonizador', NOW(), 1),
('Repetidor', NOW(), 1),
('Consumibles', NOW(), 1),
('Herramientas', NOW(), 1);


INSERT INTO tb_unidadmedida (unidad_nombre, create_at, iduser_create) VALUES
('Unidades', NOW(), 1),
('Metros', NOW(), 1);

INSERT INTO tb_productos (id_marca, id_tipo, id_unidad, modelo, precio_actual, codigo_barra, create_at, iduser_create) VALUES
(1, 1, 1, 'Router TP-Link TL-WR940N', 120.00, '12879878974564654654', NOW(), 1),
(2, 2, 2, 'Sintonizador Phyhome PH-100', 80.00, 'AKJSBKJCKJ161', NOW(), 1),
(3, 3, 1, 'Repetidor VSOL VS-300', 150.00, 'AKJBAJBUIB1898', NOW(), 1),
(4, 4, 2, 'Consumibles Huawei HW-500', 50.00, 'ABC-abc-1234', NOW(), 1),
(5, 5, 1, 'Herramientas Micronics MC-200', 200.00, 'GAAK1129893J', NOW(), 1),
(6, 1, 2, 'Router Mercusys MR-70X', 130.00, 'JHAB1287297', NOW(), 1),
(7, 2, 1, 'Sintonizador Generico GN-100', 70.00, 'AJSFKA128763', NOW(), 1),
(8, 3, 2, 'Repetidor Sin Marca SM-300', 90.00, '69KAJSBKJB12', NOW(), 1),
(9, 4, 1, 'Consumibles TP-Link TL-500', 60.00, 'KJBKAJBKAJBC', NOW(), 1),
(9, 5, 2, 'Herramientas Phyhome PH-200', 110.00, 'KJASBFKJA9', NOW(), 1);

INSERT INTO tb_tipooperacion (descripcion, movimiento) VALUES
('Adquisición de activos', 'E'),
('Compra de materiales', 'E'),
('Recepción de suministros', 'E'),
('Recepción de dispositivos de red', 'E'),
('Recepción de componentes', 'E'),
('Recepción de equipos', 'E'),
('Devolución de equipos', 'S'),
('Pérdida de activos', 'S'),
('Equipos fuera de servicio', 'S'),
('Despacho de dispositivos de red', 'S'),
('Despacho de componentes', 'S'),
('Despacho de equipos', 'S');

INSERT INTO tb_usuarios (id_persona, nombre_user, pass, iduser_create) VALUES
(1, 'Lgarcia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1), -- 123456
(2, 'Mramos', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(3, 'Mtasayco', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(4, 'Dpeñaloza', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(5, 'Tsaravia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(6, 'JoseIvan','$2y$10$jK9ALyQ6CabQCH1U3PqajeqCJQrVflPVEAl0GIU1OLJpp9GsKXCEG',1);

INSERT INTO tb_roles (rol, permisos, iduser_create) VALUES
('Administrador', '{
  "actividad": "Mapa",
  "administracion": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "contratos": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "inventariado": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "personas": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "ticket": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "roles": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "soporte": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "usuarios": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "reportes": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "paquetes": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  }
}', 1),
('Tecnico Oficina', '{
  "actividad": "Soporte",
  "administracion": {},
  "contratos": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "inventariado": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "personas": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "ticket": {},
  "roles": {},
  "soporte": {},
  "usuarios": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "reportes": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "paquetes": {}
}', 1),
('Oficina', '{
  "actividad": "Contratos",
  "administracion": {},
  "contratos": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "inventariado": {},
  "personas": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "ticket": {},
  "roles": {},
  "soporte": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "usuarios": {},
  "reportes": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "paquetes": {}
}', 1),
('Tecnico Campo', '{
  "actividad": "Fichas",
  "administracion": {},
  "contratos": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "inventariado": {},
  "personas": {},
  "ticket": {},
  "roles": {},
  "soporte": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "usuarios": {},
  "reportes": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "paquetes": {}
}', 1),
('Almacen - Tecnico', '{
  "actividad": "Kardex",
  "administracion": {},
  "contratos": {},
  "inventariado": {
    "leer": true,
    "crear": true,
    "actualizar": true,
    "eliminar": true
  },
  "personas": {},
  "ticket": {},
  "roles": {},
  "soporte": {},
  "usuarios": {},
  "reportes": {},
  "paquetes": {}
}', 1);


INSERT INTO tb_lineas(coordenadas, iduser_create) VALUES 
('[
{ "lng": -76.15641392505843, "lat": -13.397719734585584 },
{ "lng": -76.16154547830996, "lat": -13.410886698897501 },
{ "lng": -76.14167574818575, "lat": -13.41583679233458 },
{ "lng": -76.14083525733821, "lat": -13.41600924539936 },
{ "lng": -76.13984845316173, "lat": -13.416401031545197 },
{ "lng": -76.13867616029974, "lat": -13.412289403614626 },
{ "lng": -76.13245952695715, "lat": -13.41515804681155 },
{ "lng": -76.13089498449008, "lat": -13.40911096082754 },
{ "lng": -76.12891921992468, "lat": -13.41029929944115 }
]', 1);

INSERT INTO tb_responsables (id_usuario, id_rol,iduser_create) VALUES
(1, 1,1),
(2, 2,1),
(3, 3,1),
(4, 4,1),
(5, 5,1);

INSERT INTO tb_base (nombre_base, iduser_create) VALUES
('Chincha', 1),
('Pueblo Nuevo', 1), 
('Grocio Prado', 1), 
('Tambo de Mora', 1),
('Sunampe', 1);

INSERT INTO tb_subbase (id_base, nombre_sub_base, iduser_create) VALUES 
(1, 'Chincha', 1),
(1, 'Rosedal', 1),
(1, 'Señor de los Milagros', 1),
(1, 'Cruz Blanca', 1),
(1, 'Condorillo', 1),
(2, 'Salvador', 1),
(2, 'Satélite', 1),
(3, 'Grocio', 1),
(4, 'Tambo de Mora', 1),
(4, 'Tambo Plaza Antiguo', 1),
(5, 'Sunampe', 1),
(5, 'San Ignacio', 1),
(5, 'San Pilpa', 1),
(5, 'Chacarita', 1);