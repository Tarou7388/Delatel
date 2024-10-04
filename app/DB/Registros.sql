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

INSERT INTO tb_servicios (servicio, iduser_create) VALUES
('Internet Residencial Básico', 1),
('Internet Residencial Avanzado', 1),
('Internet Empresarial', 1),
('Televisión por Cable', 1),
('Telefonía Fija', 1),
('Paquete Doble: Internet + Televisión', 1),
('Paquete Triple: Internet + Televisión + Telefonía', 1),
('Internet Móvil Prepago', 1),
('VPN para Empresas', 1),
('Hosting Web para Empresas', 1),
('Correo Electrónico Empresarial', 1),
('Dominios Web', 1),
('Servicio de Soporte Técnico', 1),
('Mantenimiento de Equipos de Red', 1),
('Instalación de Equipos de Internet', 1),
('Configuración de Router y Modem', 1),
('Internet para Eventos Especiales', 1),
('Plan de Seguridad en Línea', 1),
('Backup en la Nube', 1),
('Monitoreo de Red para Empresas', 1),
('Análisis de Conectividad', 1),
('Instalación de CCTV para Seguridad', 1),
('Teleasistencia Técnica', 1),
('Acceso a Wi-Fi Público', 1),
('Streaming de Video HD', 1),
('Streaming de Música', 1),
('Capacitación en Tecnología Digital', 1),
('Gestión de Redes Sociales', 1),
('Publicidad en Línea', 1),
('Soporte 24/7 para Clientes', 1),
('Desarrollo de Aplicaciones Web', 1),
('Plataforma de E-learning para Empresas', 1),
('Gestión de Proyectos TI', 1),
('Servicios de Cloud Computing', 1),
('Asesoría en Tecnología de la Información', 1),
('Instalación de Redes Inalámbricas', 1),
('Consultoría de Seguridad Informática', 1),
('Soluciones de Internet de las Cosas (IoT)', 1),
('Acceso a Contenido Premium', 1),
('Migración a la Nube', 1),
('Desarrollo de Sistemas de Gestión', 1);

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

INSERT INTO tb_productos (marca, tipo_producto, modelo, precio_actual, codigo_barra, iduser_create) VALUES
('TP-Link', 'Router', 'TL-WR841N', 79.99, '0123456789012', 1),
('TP-Link', 'Modem', 'TD-W8961N', 89.99, '0123456789013', 1),
('Netgear', 'Router', 'R6120', 99.99, '0123456789014', 1),
('Linksys', 'Router', 'EA7500', 129.99, '0123456789015', 1),
('ASUS', 'Router', 'RT-AC66U', 149.99, '0123456789016', 1),
('Motorola', 'Modem', 'MB7621', 119.99, '0123456789017', 1),
('Cisco', 'Router', 'ISR4321', 299.99, '0123456789018', 1),
('TP-Link', 'Extensor de rango', 'TL-WA855RE', 39.99, '0123456789019', 1),
('D-Link', 'Router', 'DIR-867', 109.99, '0123456789020', 1),
('Zyxel', 'Modem', 'C3000Z', 79.99, '0123456789021', 1),
('Tenda', 'Router', 'AC1200', 49.99, '0123456789022', 1),
('MikroTik', 'Router', 'hAP ac', 89.99, '0123456789023', 1),
('Linksys', 'Modem', 'CM3024', 149.99, '0123456789024', 1),
('Netgear', 'Extensor de rango', 'EX6200', 79.99, '0123456789025', 1),
('TP-Link', 'Switch', 'TL-SG108', 59.99, '0123456789026', 1),
('D-Link', 'Switch', 'DGS-108', 69.99, '0123456789027', 1),
('Cisco', 'Switch', 'SG350-10', 299.99, '0123456789028', 1),
('Ubiquiti', 'Punto de acceso', 'UAP-AC-LITE', 89.99, '0123456789029', 1),
('Netgear', 'Router', 'Nighthawk RAX40', 229.99, '0123456789030', 1),
('TP-Link', 'Router', 'Archer A7', 69.99, '0123456789031', 1),
('Zyxel', 'Router', 'Zywall USG20-VPN', 199.99, '0123456789032', 1),
('ASUS', 'Modem', 'DSL-AC68U', 149.99, '0123456789033', 1),
('Motorola', 'Router', 'MG7700', 199.99, '0123456789034', 1),
('Tenda', 'Modem', 'D301', 39.99, '0123456789035', 1),
('TP-Link', 'Router', 'TL-R605', 99.99, '0123456789036', 1),
('D-Link', 'Router', 'DIR-3060', 129.99, '0123456789037', 1),
('Linksys', 'Extensor de rango', 'RE7000', 79.99, '0123456789038', 1),
('Zyxel', 'Punto de acceso', 'NWA1123-AC', 69.99, '0123456789039', 1),
('Ubiquiti', 'Router', 'EdgeRouter X', 99.99, '0123456789040', 1),
('ASUS', 'Switch', 'GS308', 49.99, '0123456789041', 1),
('Cisco', 'Punto de acceso', 'AIR-AP1815I', 199.99, '0123456789042', 1),
('TP-Link', 'Modem', 'TD-8616', 39.99, '0123456789043', 1),
('D-Link', 'Extensor de rango', 'DAP-1610', 49.99, '0123456789044', 1),
('Netgear', 'Router', 'RAX80', 349.99, '0123456789045', 1),
('Linksys', 'Router', 'WRT3200ACM', 249.99, '0123456789046', 1),
('MikroTik', 'Modem', 'MikroTik RB951G-2HnD', 69.99, '0123456789047', 1),
('Ubiquiti', 'Switch', 'US-8-60W', 99.99, '0123456789048', 1),
('TP-Link', 'Router', 'Archer C7', 79.99, '0123456789049', 1),
('Cisco', 'Router', 'ISR4331', 399.99, '0123456789050', 1);


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
(10, 'Frojas', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(11, 'Glopez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(12, 'Hrodriguez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(13, 'Ihidalgo', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(14, 'Jtorres', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(15, 'Kvelasquez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(16, 'Lcampos', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(17, 'Mrojas', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(18, 'Ncontreras', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(19, 'Obernal', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(20, 'Pguerrero', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(21, 'Qalvarado', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(22, 'Rpeña', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(23, 'Sanchez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(24, 'Tgonzalez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(25, 'Ualmeida', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(26, 'Vtapia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(27, 'Wcardenas', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(28, 'Xvillanueva', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(29, 'Ygarcia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(30, 'Zmontoya', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(31, 'Aflores', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(32, 'Bperalta', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(33, 'Camarillo', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(34, 'Dzambrano', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(35, 'Egonzalez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(36, 'Hbenavides', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(37, 'Irodriguez', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(38, 'Jgarcia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(39, 'Kvidal', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(40, 'Lserrano', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1);

INSERT INTO tb_roles (rol, permisos, iduser_create) VALUES
('Administrador', '{"soporte": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "contratos": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "inventariado": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "personas": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "roles": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}}',1),
('Tecnico Oficina', '{"soporte": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "contratos": {}, "inventariado": {}, "personas": { "leer": true}, "roles": {}}',1),
('Oficina', '{"soporte": { "leer": true}, "contratos": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "inventariado": {}, "personas": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "roles": {}}',1),
('Tecnico Campo', '{"soporte": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "contratos": { "leer": true}, "inventariado": {}, "personas": { "leer": true}, "roles": {}}',1),
('Almacen - Tecnico', '{"soporte": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "contratos": { "leer": true}, "inventariado": {"crear": true, "leer": true, "actualizar": true, "eliminar": true}, "personas": { "leer": true}, "roles": {}}',1);


INSERT INTO tb_paquetes (id_servicio, precio, tipo_paquete, fecha_inicio, fecha_fin, iduser_create) VALUES
(1, 100.00, 'CABl', '2023-01-01', '2023-12-31', 1),
(2, 150.00, 'GPON', '2023-02-01', '2023-11-30', 1),
(3, 200.00, 'WISP', '2023-03-01', '2023-10-31', 1),
(4, 120.00, 'CABl', '2023-04-01', '2023-09-30', 1),
(5, 180.00, 'GPON', '2023-05-01', '2023-08-31', 1),
(6, 220.00, 'WISP', '2023-06-01', '2023-07-31', 1),
(7, 130.00, 'CABl', '2023-07-01', '2023-12-31', 1),
(8, 160.00, 'GPON', '2023-08-01', '2023-11-30', 1),
(9, 210.00, 'WISP', '2023-09-01', '2023-10-31', 1),
(10, 140.00, 'CABl', '2023-10-01', '2023-09-30', 1),
(11, 170.00, 'GPON', '2023-11-01', '2023-08-31', 1),
(12, 230.00, 'WISP', '2023-12-01', '2023-07-31', 1),
(13, 100.00, 'CABl', '2023-01-02', '2023-12-30', 1),
(14, 150.00, 'GPON', '2023-02-02', '2023-11-29', 1),
(15, 200.00, 'WISP', '2023-03-02', '2023-10-30', 1),
(16, 120.00, 'CABl', '2023-04-02', '2023-09-29', 1),
(17, 180.00, 'GPON', '2023-05-02', '2023-08-30', 1),
(18, 220.00, 'WISP', '2023-06-02', '2023-07-30', 1),
(19, 130.00, 'CABl', '2023-07-02', '2023-12-30', 1),
(20, 160.00, 'GPON', '2023-08-02', '2023-11-29', 1),
(21, 210.00, 'WISP', '2023-09-02', '2023-10-30', 1),
(22, 140.00, 'CABl', '2023-10-02', '2023-09-29', 1),
(23, 170.00, 'GPON', '2023-11-02', '2023-08-30', 1),
(24, 230.00, 'WISP', '2023-12-02', '2023-07-30', 1),
(25, 110.00, 'CABl', '2023-01-03', '2023-12-29', 1),
(26, 155.00, 'GPON', '2023-02-03', '2023-11-28', 1),
(27, 205.00, 'WISP', '2023-03-03', '2023-10-29', 1),
(28, 125.00, 'CABl', '2023-04-03', '2023-09-28', 1),
(29, 185.00, 'GPON', '2023-05-03', '2023-08-29', 1),
(30, 225.00, 'WISP', '2023-06-03', '2023-07-29', 1),
(31, 135.00, 'CABl', '2023-07-03', '2023-12-29', 1),
(32, 165.00, 'GPON', '2023-08-03', '2023-11-28', 1),
(33, 215.00, 'WISP', '2023-09-03', '2023-10-29', 1),
(34, 145.00, 'CABl', '2023-10-03', '2023-09-28', 1),
(35, 175.00, 'GPON', '2023-11-03', '2023-08-29', 1),
(36, 235.00, 'WISP', '2023-12-03', '2023-07-29', 1),
(37, 115.00, 'CABl', '2023-01-04', '2023-12-28', 1),
(38, 157.00, 'GPON', '2023-02-04', '2023-11-27', 1),
(39, 207.00, 'WISP', '2023-03-04', '2023-10-28', 1),
(40, 127.00, 'CABl', '2023-04-04', '2023-09-27', 1);


INSERT INTO tb_sectores (id_distrito, sector, iduser_create) VALUES
(110201, 'Las Flores', 1),
(110201, 'El Sol', 1),
(110201, 'El Jardín', 1),
(110201, 'La Esperanza', 1),
(110201, 'La Huerta', 1),
(110201, 'Los Pinos', 1),
(110201, 'El Mirador', 1),
(110201, 'Santa Rosa', 1),
(110201, 'Las Palmas', 1),
(110201, 'Villa Alegre', 1),
(110201, 'La Libertad', 1),
(110201, 'La Nueva Era', 1),
(110201, 'El Álamo', 1),
(110201, 'Los Olivos', 1),
(110201, 'El Pacífico', 1),
(110201, 'Los Andes', 1),
(110201, 'El Trébol', 1),
(110201, 'La Cima', 1),
(110201, 'Las Dunas', 1),
(110201, 'El Oasis', 1),
(110201, 'El Encanto', 1),
(110201, 'Las Estrellas', 1),
(110201, 'Rincón Verde', 1),
(110201, 'Los Arcos', 1),
(110201, 'Valle Sereno', 1),
(110201, 'El Horizonte', 1),
(110201, 'Cumbres Altas', 1),
(110201, 'El Recodo', 1),
(110201, 'Sierra Azul', 1),
(110201, 'Las Nubes', 1),
(110201, 'Brisas del Mar', 1),
(110201, 'El Paraíso', 1),
(110201, 'Los Samanes', 1),
(110201, 'La Colina', 1),
(110201, 'Bosque Encantado', 1),
(110201, 'La Senda', 1),
(110201, 'Río Sereno', 1),
(110201, 'Las Aguas Claras', 1),
(110201, 'El Sendero', 1),
(110201, 'Camino Verde', 1),
(110201, 'Los Cerezos', 1),
(110201, 'El Faro', 1),
(110201, 'La Sombra', 1);




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
('23345678901', 'Ricardo Salcedo', 'Soluciones de Recursos Humanos', 'RecursosHum', '665432109', 'contacto@recursoshum.com', 1);

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


INSERT INTO tb_contratos (id_cliente, id_paquete, id_sector, id_usuario_registro, id_usuario_tecnico, direccion_servicio, referencia, coordenada, fecha_inicio, fecha_fin, fecha_registro, nota) VALUES 
(1, 1, 1, 1, NULL, 'Av. Siempre Viva 123, Springfield', 'Cerca de la plaza principal', '12.3456, -65.4321', '2024-01-15', '2024-06-15', '2024-01-01', 'Primer contrato con cliente nuevo'),
(2, 2, 2, 1, NULL, 'Calle Falsa 456, Gotham', 'Cerca del cine local', '34.5678, -76.5432', '2024-02-01', '2024-07-01', '2024-02-01', 'Instalación programada'),
(3, 3, 3, 1, NULL, 'Av. Los Pinos 789, Lima', 'Esquina con Av. Las Flores', '23.4567, -54.3210', '2024-03-01', '2024-08-01', '2024-03-01', 'Revisión mensual incluida'),
(4, 4, 4, 1, NULL, 'Jirón de la Unión 100, Lima', 'Frente a la Plaza Mayor', '45.6789, -43.2109', '2024-04-01', '2024-09-01', '2024-04-01', 'Descuento aplicado por contrato anual'),
(5, 5, 5, 1, NULL, 'Calle Mayor 101, Barcelona', 'Cerca del mercado central', '56.7890, -32.1098', '2024-05-01', '2024-10-01', '2024-05-01', 'Contrato especial por volumen'),
(6, 1, 2, 1, NULL, 'Av. del Libertador 200, Buenos Aires', 'A la vuelta de la oficina', '12.0011, -66.1122', '2024-06-01', '2024-11-01', '2024-06-01', 'Servicio premium incluido'),
(7, 2, 3, 1, NULL, 'Calle de la Alegría 333, Bogotá', 'Cerca de la estación de buses', '34.3333, -76.6666', '2024-07-01', '2024-12-01', '2024-07-01', 'Soporte técnico 24/7'),
(8, 3, 4, 1, NULL, 'Paseo del Prado 150, Madrid', 'Cerca del parque del Retiro', '23.8888, -54.7777', '2024-08-01', '2024-09-01', '2024-08-01', 'Incluye mantenimiento semestral'),
(9, 4, 5, 1, NULL, 'Av. de la Paz 400, Santiago', 'Frente al hotel Plaza', '45.2222, -43.8888', '2024-09-01', '2024-12-01', '2024-09-01', 'Promoción de verano'),
(10, 5, 1, 1, NULL, 'Calle del Comercio 789, Lima', 'Cerca de la Plaza San Martín', '56.4444, -32.5555', '2024-10-01', '2025-03-01', '2024-10-01', 'Condiciones especiales aplicables');

INSERT INTO tb_contactabilidad (id_persona, id_paquete, fecha_hora_contacto, direccion_servicio, nota,iduser_create) VALUES
(1, 1, '2024-01-10 14:30:00', 'Av. Siempre Viva 123, Springfield', 'Contacto inicial realizado con éxito.',1),
(2, 2, '2024-02-15 10:00:00', 'Calle Falsa 456, Gotham', 'Se acordó la fecha para la instalación.',1),
(3, 3, '2024-03-20 16:45:00', 'Av. Los Pinos 789, Lima', 'Cliente solicitó información adicional sobre el servicio.',1),
(4, 4, '2024-04-25 11:00:00', 'Jirón de la Unión 100, Lima', 'Se discutieron los términos del contrato y se acordó una revisión futura.',1),
(5, 5, '2024-05-30 09:30:00', 'Calle Mayor 101, Barcelona', 'Se completó la verificación del servicio y se envió confirmación.',1); 

INSERT INTO tb_soporte (id_contrato, id_tipo_soporte, id_tecnico, fecha_hora_solicitud, fecha_hora_asistencia, descripcion_problema, descripcion_solucion, prioridad, soporte,iduser_create) VALUES 
(1, 1, 1, '2024-01-10 15:00:00', '2024-01-10 16:00:00', 'Problema con el voltaje en el área principal.', 'Reemplazo del regulador de voltaje realizado.', 'Alta', '{"monto":"50.00","metodo":"tarjeta","fecha":"2024-01-11"}',1),
(2, 2, 2, '2024-02-16 11:00:00', '2024-02-16 12:30:00', 'Fugas en la tubería principal.', 'Reparación de fugas y prueba de presión completada.', 'Media', '{"monto":"100.00","metodo":"efectivo","fecha":"2024-02-17"}',1),
(3, 3, 3, '2024-03-21 09:30:00', '2024-03-21 10:00:00', 'Problemas de conectividad en la red.', 'Configuración y prueba de la red realizada.', 'Alta', '{"monto":"75.00","metodo":"transferencia","fecha":"2024-03-22"}',1),
(4, 1, 4, '2024-04-26 14:00:00', '2024-04-26 15:30:00', 'Falla en el sistema de alarma.', 'Sustitución de los sensores defectuosos realizada.', 'Baja', '{"monto":"40.00","metodo":"tarjeta","fecha":"2024-04-27"}',1),
(5, 2, 5, '2024-05-31 13:00:00', '2024-05-31 14:30:00', 'Sistema de climatización ineficiente.', 'Ajuste y mantenimiento del sistema completado.', 'Media', '{"monto":"120.00","metodo":"cheque","fecha":"2024-06-01"}',1);
