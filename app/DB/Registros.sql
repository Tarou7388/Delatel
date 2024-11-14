USE Delatel;

INSERT INTO tb_tipo_soporte (tipo_soporte, iduser_create) VALUES
('Instalación de servicio', 1),
('Mantenimiento preventivo', 1),
('Problema de conexión', 1),
('Soporte técnico', 1),
('Consulta de facturación', 1),
('Cambio de plan', 1),
('Reinstalación de equipos', 1),
('Consulta de saldo', 1),
('Reportar caída de servicio', 1),
('Activación de servicio', 1),
('Desactivación de servicio', 1),
('Actualización de datos', 1),
('Asistencia en instalación de router', 1),
('Problema con el router', 1),
('Configuración de red', 1),
('Consulta sobre promociones', 1),
('Cambio de dirección de servicio', 1),
('Aumento de velocidad', 1),
('Sugerencias y quejas', 1),
('Desbloqueo de cuenta', 1);

INSERT INTO tb_servicios (tipo_servicio, servicio, iduser_create) VALUES
  ('CABL','Cable', 1),
  ('WISP','Wireless Internet Service Provider', 1),
  ('FIBR','Fibra Óptica', 1);

INSERT INTO tb_paquetes (id_servicio, paquete, precio, iduser_create) VALUES
('{"id_servicio": [1]}', 'Internet Básico Residencial', '100.00', 1),
('{"id_servicio": [3]}', 'Internet Avanzado Fibra', '150.00', 1),
('{"id_servicio": [2]}', 'Internet Empresarial WISP', '200.00', 1),
('{"id_servicio": [2]}', 'Televisión por Cable WISP', '50.00', 1),
('{"id_servicio": [3]}', 'Telefonía Fija Fibra', '30.00', 1),
('{"id_servicio": [2]}', 'Paquete Doble: Internet + TV WISP', '120.00', 1),
('{"id_servicio": [2]}', 'Paquete Triple: Internet + TV + Telefonía WISP', '180.00', 1),
('{"id_servicio": [3]}', 'Internet Móvil Prepago Fibra', '20.00', 1),
('{"id_servicio": [2]}', 'VPN Empresarial WISP', '80.00', 1),
('{"id_servicio": [1]}', 'Hosting Web Empresarial Cable', '60.00', 1),
('{"id_servicio": [3]}', 'Correo Electrónico Empresarial Fibra', '40.00', 1),
('{"id_servicio": [2]}', 'Dominios Web WISP', '10.00', 1),
('{"id_servicio": [2]}', 'Soporte Técnico WISP', '50.00', 1),
('{"id_servicio": [3]}', 'Mantenimiento de Equipos de Red Fibra', '40.00', 1),
('{"id_servicio": [2]}', 'Instalación de Equipos de Internet WISP', '40.00', 1),
('{"id_servicio": [1]}', 'Configuración de Router y Modem Cable', '60.00', 1),
('{"id_servicio": [3]}', 'Internet para Eventos Especiales Fibra', '200.00', 1),
('{"id_servicio": [2]}', 'Plan de Seguridad en Línea WISP', '150.00', 1),
('{"id_servicio": [1]}', 'Backup en la Nube Cable', '70.00', 1),
('{"id_servicio": [3]}', 'Monitoreo de Red Empresarial Fibra', '120.00', 1),
('{"id_servicio": [2]}', 'Análisis de Conectividad WISP', '80.00', 1),
('{"id_servicio": [1]}', 'Instalación de CCTV Cable', '150.00', 1),
('{"id_servicio": [3]}', 'Teleasistencia Técnica Fibra', '60.00', 1),
('{"id_servicio": [2]}', 'Acceso a Wi-Fi Público WISP', '30.00', 1),
('{"id_servicio": [1, 3]}', 'Streaming de Video HD', '20.00', 1),
('{"id_servicio": [3]}', 'Streaming de Música Fibra', '15.00', 1),
('{"id_servicio": [2]}', 'Capacitación en Tecnología Digital WISP', '100.00', 1),
('{"id_servicio": [1, 3]}', 'Gestión de Redes Sociales', '200.00', 1),
('{"id_servicio": [3, 1]}', 'Publicidad en Línea Fibra', '300.00', 1),
('{"id_servicio": [1, 3]}', 'Soporte 24/7 para Clientes WISP', '250.00', 1),
('{"id_servicio": [1, 3]}', 'Desarrollo de Aplicaciones Web', '500.00', 1),
('{"id_servicio": [3, 1]}', 'Plataforma de E-learning Empresarial Fibra', '400.00', 1),
('{"id_servicio": [1]}', 'Internet Básico Residencial', '100.00', 1),
('{"id_servicio": [3]}', 'Internet Avanzado Fibra', '150.00', 1),
('{"id_servicio": [2]}', 'Internet Empresarial WISP', '200.00', 1),
('{"id_servicio": [2]}', 'Televisión por Cable WISP', '50.00', 1),
('{"id_servicio": [3]}', 'Telefonía Fija Fibra', '30.00', 1),
('{"id_servicio": [2]}', 'Paquete Doble: Internet + TV WISP', '120.00', 1),
('{"id_servicio": [2]}', 'Paquete Triple: Internet + TV + Telefonía WISP', '180.00', 1),
('{"id_servicio": [3]}', 'Internet Móvil Prepago Fibra', '20.00', 1),
('{"id_servicio": [2]}', 'VPN Empresarial WISP', '80.00', 1),
('{"id_servicio": [1]}', 'Hosting Web Empresarial Cable', '60.00', 1),
('{"id_servicio": [3]}', 'Correo Electrónico Empresarial Fibra', '40.00', 1),
('{"id_servicio": [2]}', 'Dominios Web WISP', '10.00', 1),
('{"id_servicio": [2]}', 'Soporte Técnico WISP', '100.00', 1),
('{"id_servicio": [3]}', 'Mantenimiento de Equipos de Red Fibra', '70.00', 1),
('{"id_servicio": [2]}', 'Instalación de Equipos de Internet WISP', '90.00', 1),
('{"id_servicio": [1]}', 'Configuración de Router y Modem Cable', '50.00', 1),
('{"id_servicio": [3]}', 'Internet para Eventos Especiales Fibra', '200.00', 1),
('{"id_servicio": [2]}', 'Plan de Seguridad en Línea WISP', '150.00', 1),
('{"id_servicio": [1]}', 'Backup en la Nube Cable', '70.00', 1),
('{"id_servicio": [3]}', 'Monitoreo de Red Empresarial Fibra', '120.00', 1),
('{"id_servicio": [2]}', 'Análisis de Conectividad WISP', '80.00', 1),
('{"id_servicio": [1]}', 'Instalación de CCTV Cable', '150.00', 1),
('{"id_servicio": [3]}', 'Teleasistencia Técnica Fibra', '60.00', 1),
('{"id_servicio": [2]}', 'Acceso a Wi-Fi Público WISP', '30.00', 1),
('{"id_servicio": [1, 3]}', 'Streaming de Video HD', '20.00', 1),
('{"id_servicio": [3]}', 'Streaming de Música Fibra', '15.00', 1),
('{"id_servicio": [2]}', 'Capacitación en Tecnología Digital WISP', '100.00', 1),
('{"id_servicio": [1, 3]}', 'Gestión de Redes Sociales', '200.00', 1),
('{"id_servicio": [3, 1]}', 'Publicidad en Línea Fibra', '300.00', 1),
('{"id_servicio": [1, 3]}', 'Soporte 24/7 para Clientes WISP', '250.00', 1),
('{"id_servicio": [1, 3]}', 'Desarrollo de Aplicaciones Web', '500.00', 1),
('{"id_servicio": [3, 1]}', 'Plataforma de E-learning Empresarial Fibra', '400.00', 1);


INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, nacionalidad, email, iduser_create) VALUES
('DNI', '12345678', 'Pérez García', 'Juan', '987654321', 'Peruano', 'juan.perezgarcia@example.com', 1),
('DNI', '23456789', 'González López', 'María', '987654322', 'Peruana', 'maria.gonzalezlopez@example.com', 1),
('DNI', '34567890', 'Rodríguez Ríos', 'Luis', '987654323', 'Peruano', 'luis.rodriguezrios@example.com', 1),
('DNI', '45678901', 'Martínez Soto', 'Ana', '987654324', 'Peruana', 'ana.martinezsoto@example.com', 1),
('DNI', '56789012', 'López Mendoza', 'Carlos', '987654325', 'Peruano', 'carlos.lopezmendoza@example.com', 1),
('DNI', '67890123', 'García Torres', 'Sofía', '987654326', 'Peruana', 'sofia.garciatorres@example.com', 1),
('DNI', '78901234', 'Fernández Ruiz', 'Andrés', '987654327', 'Peruano', 'andres.fernandezruiz@example.com', 1),
('DNI', '89012345', 'Morales Salazar', 'Patricia', '987654328', 'Peruana', 'patricia.moralessalazar@example.com', 1),
('DNI', '90123456', 'Cruz González', 'Fernando', '987654329', 'Peruano', 'fernando.cruzgonzalez@example.com', 1),
('DNI', '01234567', 'Díaz Arévalo', 'Lucía', '987654330', 'Peruana', 'lucia.diazarevalo@example.com', 1),
('DNI', '12345679', 'Hernández Espinoza', 'Diego', '987654331', 'Peruano', 'diego.hernandezespinoza@example.com', 1),
('DNI', '23456780', 'Rojas Morales', 'Valentina', '987654332', 'Peruana', 'valentina.rojasmorales@example.com', 1),
('DNI', '34567891', 'Torres Quiroz', 'Javier', '987654333', 'Peruano', 'javier.torresquiroz@example.com', 1),
('DNI', '45678902', 'Ramírez Córdova', 'Isabel', '987654334', 'Peruana', 'isabel.ramirezcordova@example.com', 1),
('DNI', '56789013', 'Vásquez Beltrán', 'Sergio', '987654335', 'Peruano', 'sergio.vasquezbeltran@example.com', 1),
('DNI', '67890124', 'Cano Paredes', 'Claudia', '987654336', 'Peruana', 'claudia.canoparedes@example.com', 1),
('DNI', '78901235', 'Aguirre Ríos', 'Raúl', '987654337', 'Peruano', 'raul.aguirrrios@example.com', 1),
('DNI', '89012346', 'Mendoza Silva', 'Natalia', '987654338', 'Peruana', 'natalia.mendozasilva@example.com', 1),
('DNI', '90123457', 'Salazar Huerta', 'Gustavo', '987654339', 'Peruano', 'gustavo.salazarhuerta@example.com', 1),
('DNI', '01234568', 'Palacios Fernández', 'Elena', '987654340', 'Peruana', 'elena.palaciosfernandez@example.com', 1),
('DNI', '12345680', 'Soto Carranza', 'Mario', '987654341', 'Peruano', 'mario.sotocarranza@example.com', 1),
('DNI', '23456781', 'Aguilar Castro', 'Angela', '987654342', 'Peruana', 'angela.aguilarcastro@example.com', 1),
('DNI', '34567892', 'Maldonado León', 'Renato', '987654343', 'Peruano', 'renato.maldonadoleon@example.com', 1),
('DNI', '45678903', 'Quiroz Alvarado', 'Verónica', '987654344', 'Peruana', 'veronica.quirozalvarado@example.com', 1),
('DNI', '56789014', 'Peña Medina', 'Oscar', '987654345', 'Peruano', 'oscar.penamedina@example.com', 1),
('DNI', '67890125', 'Pineda Mendoza', 'Carmen', '987654346', 'Peruana', 'carmen.pinedamendoza@example.com', 1),
('DNI', '78901236', 'Beltrán Aguirre', 'Iván', '987654347', 'Peruano', 'ivan.beltranaguirre@example.com', 1),
('DNI', '89012347', 'Acuña Ramírez', 'Silvia', '987654348', 'Peruana', 'silvia.acunaramirez@example.com', 1),
('DNI', '90123458', 'Bermúdez Chacón', 'Antonio', '987654349', 'Peruano', 'antonio.bermudezchacon@example.com', 1),
('DNI', '01234569', 'Carranza Torres', 'Rocío', '987654350', 'Peruana', 'rocio.carranzatorres@example.com', 1),
('DNI', '12345681', 'Cuadra Álvarez', 'Julián', '987654351', 'Peruano', 'julian.cuadraalvarez@example.com', 1),
('DNI', '23456782', 'Alvarado Vera', 'Gabriela', '987654352', 'Peruana', 'gabriela.alvaradovera@example.com', 1),
('DNI', '34567893', 'Espinoza Silva', 'Fernando', '987654353', 'Peruano', 'fernando.espinozasilva@example.com', 1),
('DNI', '45678904', 'Córdova Méndez', 'Ricardo', '987654354', 'Peruano', 'ricardo.cordovamendez@example.com', 1),
('DNI', '56789015', 'Zapata Ramos', 'Daniela', '987654355', 'Peruana', 'daniela.zapataramos@example.com', 1),
('DNI', '67890126', 'Villanueva Castillo', 'Saúl', '987654356', 'Peruano', 'saul.villanuevacastillo@example.com', 1),
('DNI', '78901237', 'Rivas Salas', 'Paola', '987654357', 'Peruana', 'paola.rivassalas@example.com', 1),
('DNI', '89012348', 'Medina López', 'Marcos', '987654358', 'Peruano', 'marcos.medinalopez@example.com', 1),
('DNI', '90123459', 'Linares Gómez', 'Yolanda', '987654359', 'Peruana', 'yolanda.linaresgomez@example.com', 1),
('DNI', '01234570', 'Córdova Bravo', 'Gonzalo', '987654360', 'Peruano', 'gonzalo.cordovabravo@example.com', 1);

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
('Almacen 1', "Av 123","-1", NOW(), 1),
('Almacen 2', "Av 123456","-1", NOW(), 1);


INSERT INTO tb_marca (marca, create_at, iduser_create) VALUES
('TP Link', NOW(), 1),
('Logitech', NOW(), 1),
('Satra', NOW(), 1),
('Epson', NOW(), 1),
('Kingston', NOW(), 1),
('Micronics', NOW(), 1),
('Canon', NOW(), 1),
('Omega', NOW(), 1),
('Genius', NOW(), 1),
('Generico',NOW(),1),
('Sin Marca', NOW(), 1);


INSERT INTO tb_tipoproducto (tipo_nombre, create_at, iduser_create) VALUES
('Redes', NOW(), 1),
('Accesorios', NOW(), 1),
('Consumibles', NOW(), 1),
('Componentes', NOW(), 1);

INSERT INTO tb_unidadmedida (unidad_nombre, create_at, iduser_create) VALUES
('Unidades', NOW(), 1),
('Metros', NOW(), 1);


INSERT INTO tb_productos (id_marca, id_tipo, id_unidad, modelo, precio_actual, codigo_barra, create_at, iduser_create) VALUES 
(1, 1, 1, 'Router', 150.00, '1234567890123', NOW(), 1),
(2, 2, 1, 'Teclado USB', 25.00, '1234567890124', NOW(), 1),
(3, 1, 2, 'Cable UTP Cat. 6', 1.50, '1234567890125', NOW(), 1),
(4, 3, 1, 'Tinta Magenta', 10.00, '1234567890126', NOW(), 1),
(5, 4, 1, 'Memoria RAM', 80.00, '1234567890127', NOW(), 1),
(6, 2, 1, 'Cámara Web MIC W360 + micrófono', 45.00, '1234567890128', NOW(), 1),
(7, 3, 1, 'Tinta Yellow', 10.00, '1234567890129', NOW(), 1),
(8, 2, 1, 'Supresor de Pisco', 15.00, '1234567890130', NOW(), 1),
(9, 2, 1, 'Mouse', 8.00, '1234567890131', NOW(), 1);


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
(2, 'Mmartinez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(3, 'Jlopez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(4, 'Srodriguez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(5, 'Ahernandez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(6, 'Bcontreras', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(7, 'Cfernandez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(8, 'Dmartinez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(9, 'Egarcia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(10, 'Frojas', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1);

INSERT INTO tb_roles (rol, permisos, iduser_create) VALUES
('Administrador', '{"actividad":"Mapa","soporte":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"productos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"personas":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"roles":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"usuarios":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"reportes":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"paquetes":{"leer":true,"crear":true,"actualizar":true,"eliminar":true}}', 1),
('Tecnico Oficina', '{"actividad":"Soporte","soporte":false,"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"productos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"personas":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"roles":false,"usuarios":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"paquetes":false}', 1),
('Oficina', '{"actividad":"Contratos","soporte":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":false,"productos":false,"personas":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"roles":false,"usuarios":false,"paquetes":false}', 1),
('Tecnico Campo', '{"actividad":"Fichas","soporte":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":false,"productos":false,"personas":false,"roles":false,"usuarios":false,"paquetes":false}', 1),
('Almacen - Tecnico', '{"actividad":"Kardex","soporte":false,"contratos":false,"inventariado":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"productos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"personas":false,"roles":false,"usuarios":false,"paquetes":false}', 1);

INSERT INTO tb_sectores (id_distrito, sector, iduser_create) VALUES
(110201, 'Tupac Amaru', 1),
(110201, 'San Agustín', 1),
(110201, 'San José', 1),
(110201, 'Nazareno', 1),
(110201, 'Chacarilla', 1),
(110201, 'Sunampe', 1),
(110201, 'San Juan de Yanac', 1),
(110201, 'Carmen Alto', 1),
(110201, 'Rinconada', 1),
(110201, 'Lurinchincha', 1),
(110201, 'Grocio Prado', 1), 
(110201, 'Hoja Redonda', 1),
(110201, 'Hacienda San Pedro', 1),
(110201, 'Cañete', 1),
(110201, 'El Molino', 1),
(110201, 'San Hilarión', 1),
(110201, 'Los Laureles', 1),
(110201, 'Las Casuarinas', 1),
(110201, 'San Isidro', 1), 
(110201, 'Chincha Baja', 1),
(110201, 'El Carmen', 1),
(110201, 'Las Pampas', 1),
(110201, 'La Victoria', 1),
(110201, 'San Andrés', 1),
(110201, 'Río Seco', 1),
(110201, 'Pueblo Nuevo', 1),
(110201, 'Tambo de Mora', 1),
(110201, 'San Benito', 1),
(110201, 'Los Jardines', 1),
(110201, 'Miraflores', 1),
(110201, 'Fundo Santa Rosa', 1),
(110201, 'Loma Blanca', 1),
(110201, 'Viña Vieja', 1),
(110201, 'Casa Blanca', 1),
(110201, 'Villa Sol', 1),
(110201, 'La Cumbe', 1),
(110201, 'Cruz Verde', 1),
(110201, 'Callejón Blanco', 1),
(110201, 'Santa Bárbara', 1),
(110201, 'Rincón del Prado', 1),
(110201, 'La Concepción', 1),
(110201, 'Los Ángeles', 1);

INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_sector, coordenadas, iduser_create) VALUES
("Caja 1", "Cerca del estadio", 16, 11, "-13.390019838079903, -76.14898062581466", 1),
("Caja 2", "Plaza san Isidro", 8, 19, "-13.396082705347906, -76.13534364004165", 1),
("Caja 3", "Cerca de la Plaza", 8, 6, "-13.4277387660967, -76.16422117136221", 1),
("Caja 4", "San Nicolas", 16, 6, "-13.432393655576314, -76.1627322889994", 1),
("Caja 5", "Prolongacion Cañete", 16, 11, "-13.393627228237747, -76.14441531745013", 1),
("Caja 6", "Tecnologico Chincha", 8, 19, "-13.404627155707574, -76.13712932116213", 1),
("Caja 7", "Los Bancarios", 8, 20,"-13.42826126892918, -76.135733419194", 1),
("Caja 8", "Plaza Chincha", 16, 20, "-13.41819520203595, -76.13222851544388", 1),
("Caja 9", "Parque Toledo", 8, 20, "-13.417732015444551, -76.11985007949754", 1),
("Caja 10", "Plaza de pueblo nuevo", 16, 26, "-13.404169746696624, -76.12736834665132", 1);



INSERT INTO tb_responsables (id_usuario, id_rol,iduser_create) VALUES
(1, 1,1),
(2, 2,1),
(3, 3,1),
(4, 4,1),
(5, 5,1),
(6, 5,1);

INSERT INTO tb_clientes (id_persona, id_empresa, direccion, referencia, iduser_create, coordenadas) VALUES
(6, NULL, 'Av. Siempre Viva 123, Springfield', 'Frente al parque central', 1, '-1'),
(NULL, 2, 'Calle Falsa 456, Gotham', 'A una cuadra del cine', 1, '-1'),
(8, NULL, 'Av. Los Pinos 789, Lima', 'Esquina con Av. Las Flores', 1, '-1'),
(NULL, 4, 'Jirón de la Unión 100, Lima', 'A media cuadra de la Plaza Mayor', 1, '-1'),
(10, NULL, 'Calle Mayor 101, Barcelona', 'Cerca del mercado central', 1, '-1'),
(11, NULL, 'Av. Principal 500, Ciudad de México', 'Cerca de la estación del metro', 1, '-1'),
(12, NULL, 'Calle de los Sueños 123, Madrid', 'Al lado del parque Retiro', 1, '-1'),
(13, NULL, 'Blvd. de los Héroes 222, Buenos Aires', 'Cerca de la Plaza de Mayo', 1, '-1'),
(14, NULL, 'Paseo del Río 45, Santiago', 'Frente al mall Costanera', 1, '-1'),
(15, NULL, 'Calle de la Amistad 789, Bogotá', 'Cerca del centro comercial', 1, '-1'),
(16, NULL, 'Av. de la Independencia 90, Quito', 'A dos cuadras del parque El Ejido', 1, '-1'),
(17, NULL, 'Calle de la Esperanza 321, Caracas', 'Cerca de la Plaza Bolívar', 1, '-1'),
(18, NULL, 'Av. de la Libertad 654, Lima', 'Cerca de la embajada', 1, '-1'),
(19, NULL, 'Calle del Comercio 555, La Paz', 'Cerca de la Plaza Murillo', 1, '-1'),
(20, NULL, 'Calle de la Cultura 888, San José', 'Frente al Museo Nacional', 1, '-1'),
(21, NULL, 'Av. de los Árboles 100, Montevideo', 'Cerca del Parque Rodó', 1, '-1'),
(22, NULL, 'Calle de la Innovación 400, Asunción', 'Al lado de la Universidad', 1, '-1'),
(23, NULL, 'Av. de la Tecnología 234, Lima', 'Frente al Polideportivo', 1, '-1'),
(24, NULL, 'Calle de la Creatividad 567, Santiago', 'Cerca del centro cultural', 1, '-1'),
(25, NULL, 'Calle de los Recuerdos 890, Madrid', 'A una cuadra del teatro', 1, '-1');

INSERT INTO tb_contratos (id_cliente, id_paquete, id_sector, id_usuario_registro, id_usuario_tecnico, direccion_servicio, referencia,ficha_instalacion, coordenada, fecha_inicio, fecha_fin, fecha_registro, nota) VALUES
(1, 1, 20, 1, NULL, 'Av. Siempre Viva 123, Springfield', 'Cerca de la plaza principal',NULL, '12.3456, -65.4321', '2024-01-15', '{"FIBR": 24, "CABL": 12}', '2024-01-01', 'Primer contrato: Servicio WISP Básico con 6 meses de duración'),
(2, 4, 20, 1, NULL, 'Calle Falsa 456, Gotham', 'Cerca del cine local',NULL, '34.5678, -76.5432', '2024-02-01', '{"FIBR": 24, "CABL": 12}', '2024-02-01', 'Renovación de contrato: Fibra + Cable por 6 meses'),
(3, 3, 20, 1, NULL, 'Av. Los Pinos 789, Lima', 'Esquina con Av. Las Flores',NULL, '23.4567, -54.3210', '2024-03-01', '{"FIBR": 24, "CABL": 12}', '2024-03-01', 'Contrato nuevo: Instalación de Fibra + revisión mensual'),
(4, 4, 20, 1, NULL, 'Jirón de la Unión 100, Lima', 'Frente a la Plaza Mayor',NULL, '45.6789, -43.2109', '2024-04-01', '{"FIBR": 24, "CABL": 12}', '2024-04-01', 'Renovación anual: Descuento aplicado por contrato anual'),
(5, 5, 20, 1, NULL, 'Calle Mayor 101, Barcelona', 'Cerca del mercado central',NULL, '56.7890, -32.1098', '2024-05-01', '{"FIBR": 24, "CABL": 12}', '2024-05-01', 'Contrato especial por volumen: Servicio completo por 1 año'),
(6, 1, 20, 1, NULL, 'Av. del Libertador 200, Buenos Aires', 'A la vuelta de la oficina',NULL, '12.0011, -66.1122', '2024-06-01', '{"FIBR": 24, "CABL": 12}', '2024-06-01', 'Servicio premium incluido en el contrato WISP'),
(7, 2, 20, 1, NULL, 'Calle de la Alegría 333, Bogotá', 'Cerca de la estación de buses', NULL, '34.3333, -76.6666', '2024-07-01', '{"FIBR": 24, "CABL": 12}', '2024-07-01', 'Contrato por 6 meses: Soporte técnico 24/7 incluido'),
(8, 3, 20, 1, NULL, 'Paseo del Prado 150, Madrid', 'Cerca del parque del Retiro', NULL, '23.8888, -54.7777', '2024-08-01', '{"FIBR": 24, "CABL": 12}', '2024-08-01', 'Contrato semestral: Mantenimiento semestral incluido'),
(9, 4, 20, 1, NULL, 'Av. de la Paz 400, Santiago', 'Frente al hotel Plaza', NULL, '45.2222, -43.8888', '2024-09-01', '{"FIBR": 24, "CABL": 12}', '2024-09-01', 'Promoción especial: Contrato de 6 meses con descuento'),
(10, 5, 20, 1, NULL, 'Calle del Comercio 789, Lima', 'Cerca de la Plaza San Martín', NULL,'56.4444, -32.5555', '2024-10-01', '{"FIBR": 24, "CABL": 12}', '2024-10-01', 'Contrato especial: Condiciones personalizadas aplicadas'),
(11, 2, 20, 1, NULL, 'Av. Principal 111, Quito', 'Frente al centro comercial', NULL, '11.1111, -66.6666', '2024-02-15', '{"FIBR": 24, "CABL": 12}', '2024-02-15', 'Contrato estándar de WISP con soporte adicional'),
(12, 3, 20, 1, NULL, 'Calle Secundaria 222, Caracas', 'Cerca del parque central', NULL, '22.2222, -55.5555', '2024-03-10', '{"FIBR": 24, "CABL": 12}', '2024-03-10', 'Contrato de Fibra: Instalación y soporte técnico semestral'),
(13, 4, 20, 1, NULL, 'Av. Terciaria 333, Montevideo', 'Frente al museo histórico', NULL, '33.3333, -44.4444', '2024-04-20', '{"FIBR": 24, "CABL": 12}', '2024-04-20', 'Renovación de contrato: Instalación de Fibra con soporte anual'),
(14, 5, 20, 1, NULL, 'Jirón Cuarto 444, Lima', 'Esquina con la calle Pinos', NULL, '44.4444, -33.3333', '2024-05-05', '{"FIBR": 24, "CABL": 12}', '2024-05-05', 'Contrato a medida: Servicio de Fibra + descuento corporativo'),
(15, 1, 20, 1, NULL, 'Calle Final 555, La Paz', 'Cerca del edificio principal', NULL, '55.5555, -22.2222', '2024-06-01', '{"FIBR": 24, "CABL": 12}', '2024-06-01', 'Contrato nuevo: Servicio WISP básico con soporte trimestral'),
(16, 1, 20, 1, NULL, 'Calle Estrella 111, Lima', 'Cerca de la Plaza de Armas','{"cable":{"pagoinstalacion":30,"potencia":"-18","triplexor":{"requerido":"true","cargador":" true"},"conector":{"numeroconector":4,"precio":1.5},"spliter":[{"cantidad":2,"tipo":"1x3"}],"cable":{"metrosadicionales":50,"preciometro":1.1},"sintonizadores":[{"numero":1,"marcaModelo":"ASUS","serie":"1234567890"},{"numero":2,"marcaModelo":"ASUS","serie":"1234567890"}]},"costo":{"nap":{"gpon":"-18","catv":"-14"},"casa":{"gpon":"-15","catv":"-14"},"cableCosto":{"numerosintotizadores":2,"costoAlquilerSintotizador":80,"cantidadCable":"50","precioCable":"1.10","precioConector":"1.50","cantidadConector":"4"}}}', '55.5555, -22.2222', '2024-07-01', '{"FIBR": 24, "CABL": 12}', '2024-07-01', 'Contrato: Servicio WISP básico con soporte técnico mensual'),
(17, 2, 20, 1, NULL, 'Calle Estrella 222, Lima', 'Cerca del Parque Kennedy', NULL, '44.4444, -33.3333', '2024-08-01', '{"FIBR": 24, "CABL": 12}', '2024-08-01', 'Contrato: Servicio Cable estándar con revisión mensual'),
(18, 3, 20, 1, NULL, 'Calle Estrella 333, Lima', 'Cerca del Parque Universitario', NULL, '33.3333, -44.4444', '2024-09-01', '{"FIBR": 24, "CABL": 12}', '2024-09-01', 'Contrato: Instalación de Fibra con soporte semestral'),
(19, 28, 20, 1, NULL, 'Calle Estrella 444, Lima', 'Cerca del Centro Comercial', '{"fibraoptica":{"usuario":"VERQUI22","claveacceso":"@VERQUI22","plan":"Soporte 24\/7 para Clientes WISP","potencia":-7,"moden":{"ssid":"FAMILIA","seguridad":"123456","marca":"PHYHOME","serie":"P18","banda":["2G","5G"],"numeroantena":8,"catv":true},"detalles":"","repetidores":[{"numero":1,"ssid":"VERONICA","contrasenia":"123456","marca":"PHYHOME","ip":"192.168.100.20"}]},"cable":{"pagoinstalacion":30,"potencia":"-16","sintonizador":[],"triplexor":{"requerido":"true","cargador":"true"},"conector":{"numeroconector":4,"precio":1.5},"spliter":[{"cantidad":2,"tipo":"1x3"}],"cable":{"metrosadicionales":50,"preciometro":1.1},"sintonizadores":[{"numero":1,"marcaModelo":"ASUS","serie":"1234567890"}]},"costo":{"pagoAdelantado":"20","descuento":"0","nap":{"gpon":"-13","catv":"-13"},"casa":{"gpon":"-13","catv":"-14"},"cableCosto":{"numerosintotizadores":1,"costoAlquilerSintotizador":40,"cantidadCable":"50","precioCable":"1.10","precioConector":"1.50","cantidadConector":"4"}}}', '22.2222, -55.5555', '2024-10-01', '{"CABL":4,"FIBR":10}', '2024-10-01', 'Contrato: Contratación de Paquete Gpon con cable y fibra'),
(20, 5, 20, 1, NULL, 'Calle Estrella 555, Lima', 'Cerca del Aeropuerto', NULL, '11.1111, -66.6666', '2024-11-01', '{"FIBR": 24, "CABL": 12}', '2024-11-01', 'Contrato: Servicio especial por volumen, 12 meses');

INSERT INTO tb_contactabilidad (id_persona, id_empresa, id_paquete, fecha_hora_contacto, direccion_servicio, nota, iduser_create) VALUES
(20, NULL, 1, '2024-01-10 14:30:00', 'Av. San Martín 500, Chincha Alta', 'Se realizó la instalación del servicio.', 1),
(NULL, 21, 2, '2024-01-12 10:15:00', 'Calle Ayacucho 345, Chincha Alta', 'Cliente solicitó soporte técnico.', 1),
(22, NULL, 3, '2024-01-14 11:45:00', 'Calle Grau 125, Chincha Alta', 'Se acordó la renovación del contrato.', 1),
(NULL, 23, 4, '2024-01-16 13:00:00', 'Av. Benavides 567, Chincha Alta', 'Se envió la propuesta de nuevos servicios.', 1),
(24, NULL, 5, '2024-01-18 09:30:00', 'Calle Libertad 890, Chincha Alta', 'Cliente solicitó información adicional.', 1),
(NULL, 25, 6, '2024-01-20 12:00:00', 'Jirón Pisco 300, Chincha Alta', 'Se confirmó la fecha de instalación.', 1),
(26, NULL, 7, '2024-01-22 14:45:00', 'Av. América 444, Chincha Alta', 'Se realizó el seguimiento al cliente.', 1),
(NULL, 27, 8, '2024-01-24 10:00:00', 'Calle Bolognesi 678, Chincha Alta', 'Cliente solicitó una ampliación del servicio.', 1),
(28, NULL, 9, '2024-01-26 16:15:00', 'Av. Progreso 234, Chincha Alta', 'Se completó la instalación del servicio adicional.', 1),
(NULL, 29, 10, '2024-01-28 11:30:00', 'Calle Comercio 123, Chincha Alta', 'Cliente confirmó su satisfacción con el servicio.', 1),
(30, NULL, 11, '2024-01-30 15:00:00', 'Av. Victoria 876, Chincha Alta', 'Se acordó una visita técnica para revisar el servicio.', 1),
(NULL, 31, 12, '2024-02-01 09:45:00', 'Calle Callao 789, Chincha Alta', 'Cliente solicitó una mejora en el plan contratado.', 1),
(32, NULL, 13, '2024-02-03 13:15:00', 'Jirón Lima 321, Chincha Alta', 'Se finalizó la modificación solicitada.', 1),
(NULL, 33, 14, '2024-02-05 16:00:00', 'Calle Loreto 654, Chincha Alta', 'Se discutió la posibilidad de un nuevo contrato.', 1),
(34, NULL, 15, '2024-02-07 11:45:00', 'Av. Mariscal Castilla 555, Chincha Alta', 'Se realizó una revisión técnica.', 1),
(NULL, 35, 16, '2024-02-09 14:30:00', 'Calle Zepita 412, Chincha Alta', 'Cliente aceptó el nuevo contrato propuesto.', 1),
(36, NULL, 17, '2024-02-11 12:15:00', 'Jirón Túpac Amaru 876, Chincha Alta', 'Se confirmó el pago del nuevo contrato.', 1),
(NULL, 37, 18, '2024-02-13 09:30:00', 'Calle Junín 210, Chincha Alta', 'Se discutió un posible cambio en los términos del contrato.', 1),
(38, NULL, 19, '2024-02-15 15:45:00', 'Av. Nicolás de Piérola 654, Chincha Alta', 'Cliente solicitó una visita técnica adicional.', 1),
(NULL, 39, 20, '2024-02-17 13:00:00', 'Calle Sucre 444, Chincha Alta', 'Se realizó el mantenimiento solicitado.', 1),
(40, NULL, 21, '2024-02-19 10:30:00', 'Av. Arica 765, Chincha Alta', 'Se acordó una renovación del plan actual.', 1);

INSERT INTO tb_soporte (id_contrato, id_tipo_soporte, id_tecnico, fecha_hora_solicitud, fecha_hora_asistencia, descripcion_problema, descripcion_solucion, prioridad, soporte, iduser_create) VALUES 
(1, 1, 1, '2024-01-10 15:00:00', '2024-10-09 17:05:29', "Daños en el cable", "Reemplazo del cable", 'Alta', 
  '{"parametroscable":{"periodo":["mensual"],"potencia":4,"sintonizador":2,"triplexor":{"requiere":true,"cantidad":1,"tipo":["activo","pasivo"]},"spliter":[{"cantidad":1,"tipo":"1x3"},{"cantidad":1,"tipo":"1x5"},{"cantidad":1,"tipo":"1x8"}],"cable":10,"conectores":1},"cambioscable":{"periodo":["mensual","contado"],"potencia":4,"sintonizador":2,"triplexor":{"requiere":true,"cantidad":1,"tipo":["activo","pasivo"]},"spliter":[{"cantidad":1,"tipo":"1x3"},{"cantidad":1,"tipo":"1x5"},{"cantidad":1,"tipo":"1x8"}],"cable":10,"conectores":1},"ajustes":["revisión","optimización"]}', 1),
(16, 1, 1, '2024-01-10 15:00:00', '2024-10-09 17:05:29', "Daños en el cable", "Reemplazo del cable", 'Media', 
  '{"parametroscable":{"periodo":["contado"],"potencia":4,"sintonizador":2,"triplexor":{"requiere":true,"cantidad":1,"tipo":["activo","pasivo"]},"spliter":[{"cantidad":1,"tipo":"1x3"},{"cantidad":1,"tipo":"1x5"},{"cantidad":1,"tipo":"1x8"}],"cable":10,"conectores":1},"cambioscable":{"periodo":["mensual","contado"],"potencia":4,"sintonizador":2,"triplexor":{"requiere":true,"cantidad":1,"tipo":["activo","pasivo"]},"spliter":[{"cantidad":1,"tipo":"1x3"},{"cantidad":1,"tipo":"1x5"},{"cantidad":1,"tipo":"1x8"}],"cable":10,"conectores":1},"ajustes":["revisión","optimización"]}', 1),
(12,null,null,"2024-10-09 17:05:29",null,"No funciona C",null,"Incidencia",null,1),
(13,null,null,"2024-10-09 17:05:29",null,"No funciona B",null,"Incidencia",null,1),
(14,null,null,"2024-10-09 17:05:29",null,"No funciona D",null,"Incidencia",null,1),
(15,null,null,"2024-10-09 17:05:29",null,"No funciona E",null,"Incidencia",null,1);
