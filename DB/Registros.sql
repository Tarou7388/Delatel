USE Delatel;

INSERT INTO tb_tipo_soporte (tipo_soporte) VALUES
('Soporte Técnico'),
('Asesoría'),
('Mantenimiento'),
('Capacitación'),
('Consultoría');

INSERT INTO tb_departamentos (departamento) VALUES
('Lima'),
('Arequipa'),
('Cusco'),
('Trujillo'),
('Callao');

INSERT INTO tb_provincias (provincia, id_departamento) VALUES
('Lima Metropolitana', 1),
('Arequipa', 2),
('Cusco', 3),
('Trujillo', 4),
('Callao', 5);

INSERT INTO tb_distritos (distrito, id_provincia) VALUES
('Miraflores', 1),
('Arequipa Cercado', 2),
('Cusco Centro', 3),
('Trujillo Centro', 4),
('Callao Centro', 5);

INSERT INTO tb_roles (rol, create_at, update_at, inactive_at) VALUES
('Administrador', NOW(), NULL, NULL),       -- ID 1
('Soporte', NOW(), NULL, NULL),             -- ID 2
('Oficina', NOW(), NULL, NULL),             -- ID 3
('Tecnico Campo', NOW(), NULL, NULL),       -- ID 4
('Tecnico Oficina', NOW(), NULL, NULL),     -- ID 5
('Almacen - Tecnico', NOW(), NULL, NULL);   -- ID 6

INSERT INTO tb_servicios (servicio, create_at, update_at, inactive_at) VALUES
('Cable', NOW(), NULL, NULL),
('Fibra optica', NOW(), NULL, NULL),
('Antena', NOW(), NULL, NULL),
('Cable 2', NOW(), NULL, NULL),
('Fibra optica 2', NOW(), NULL, NULL),
('Antena 2', NOW(), NULL, NULL);

INSERT INTO tb_sectores (id_distrito, sector, create_at, update_at, inactive_at) VALUES
(1, 'Centro Histórico', NOW(), NULL, NULL),
(2, 'Zona Industrial', NOW(), NULL, NULL),
(3, 'Área Comercial', NOW(), NULL, NULL),
(4, 'Zona Residencial', NOW(), NULL, NULL),
(5, 'Parque Tecnológico', NOW(), NULL, NULL);

INSERT INTO tb_permisos (id_rol, modulo, permiso, create_at, update_at, inactive_at) VALUES
(1, 'Usuarios', 1, NOW(), NULL, NULL),
(1, 'Reportes', 0, NOW(), NULL, NULL),
(2, 'Usuarios', 0, NOW(), NULL, NULL),
(2, 'Reportes', 1, NOW(), NULL, NULL),
(3, 'Usuarios', 0, NOW(), NULL, NULL);

INSERT INTO tb_personas (tipo_doc, nro_doc, apellidos, nombres, telefono, email, create_at, update_at, inactive_at) VALUES
('DNI', '12345678', 'García', 'Luis', '987654321', 'luis.garcia@example.com', NOW(), NULL, NULL),
('DNI', '23456789', 'Martínez', 'Ana', '976543210', 'ana.martinez@example.com', NOW(), NULL, NULL),
('PAS', 'A12345678', 'Lopez', 'Carlos', '965432109', 'carlos.lopez@example.com', NOW(), NULL, NULL),
('DNI', '34567890', 'Pérez', 'María', '954321098', 'maria.perez@example.com', NOW(), NULL, NULL),
('DNI', '45678901', 'Fernández', 'José', '943210987', 'jose.fernandez@example.com', NOW(), NULL, NULL),
('DNI', '56789012', 'Castro', 'Claudia', '932109876', 'claudia.castro@example.com', NOW(), NULL, NULL),
('PAS', 'B23456789', 'Gómez', 'Fernando', '921098765', 'fernando.gomez@example.com', NOW(), NULL, NULL),
('DNI', '67890123', 'Mendoza', 'Sofía', '910987654', 'sofia.mendoza@example.com', NOW(), NULL, NULL),
('PAS', 'C34567890', 'Vega', 'Alejandro', '909876543', 'alejandro.vega@example.com', NOW(), NULL, NULL),
('DNI', '78901234', 'Morales', 'Laura', '898765432', 'laura.morales@example.com', NOW(), NULL, NULL);


INSERT INTO tb_empresas (ruc, representante_legal, razon_social, nombre_comercial, telefono, email, create_at, update_at, inactive_at) VALUES
('20123456789', 'Luis García', 'Servicios Informáticos S.A.', 'InfoTech', '987654321', 'info@infotech.com', NOW(), NULL, NULL),
('20234567890', 'Ana Martínez', 'Soluciones Empresariales S.R.L.', 'SolEmp', '976543210', 'contacto@solemp.com', NOW(), NULL, NULL),
('20345678901', 'Carlos Lopez', 'Desarrollo y Consultoría', 'DevConsult', '965432109', 'consultoria@devconsult.com', NOW(), NULL, NULL),
('20456789012', 'María Pérez', 'Tecnología Avanzada', 'TechAdvance', '954321098', 'info@techadvance.com', NOW(), NULL, NULL),
('20567890123', 'José Fernández', 'Consultores Asociados', 'ConAsociados', '943210987', 'contacto@conasociados.com', NOW(), NULL, NULL);

INSERT INTO tb_usuarios (id_persona, nombre_user, pass) VALUES
(1, 'lgarcia', '$2y$10$3uS8rP3q14NxWtXEefIi3.7JuG3.xWMOo9UoLS53uK87YEfEIBGHm'), 
(2, 'amartinez', '$2y$10$3uS8rP3q14NxWtXEefIi3.7JuG3.xWMOo9UoLS53uK87YEfEIBGHm'), 
(3, 'clopez', '$2y$10$3uS8rP3q14NxWtXEefIi3.7JuG3.xWMOo9UoLS53uK87YEfEIBGHm'), 
(4, 'mperez', '$2y$10$3uS8rP3q14NxWtXEefIi3.7JuG3.xWMOo9UoLS53uK87YEfEIBGHm'), 
(5, 'jfernandez', '$2y$10$3uS8rP3q14NxWtXEefIi3.7JuG3.xWMOo9UoLS53uK87YEfEIBGHm');

INSERT INTO tb_responsables (id_usuario, id_rol) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO tb_tarifarios (id_servicio, id_usuario, precio, fecha_inicio) VALUES
(1, 1, 150.00, '2024-01-01'),
(2, 2, 200.00, '2024-02-01'),
(3, 3, 175.50, '2024-03-01'),
(4, 4, 220.00, '2024-04-01'),
(5, 5, 190.00, '2024-05-01');

INSERT INTO tb_clientes (id_persona, id_empresa, direccion, referencia, estado, create_at, update_at, inactive_at) VALUES
(6, NULL, 'Av. Siempre Viva 123, Springfield', 'Frente al parque central', 1, NOW(), NULL, NULL),
(NULL, 2, 'Calle Falsa 456, Gotham', 'A una cuadra del cine', 1, NOW(), NULL, NULL),
(8, NULL, 'Av. Los Pinos 789, Lima', 'Esquina con Av. Las Flores', 1, NOW(), NULL, NULL),
(NULL, 4, 'Jirón de la Unión 100, Lima', 'A media cuadra de la Plaza Mayor', 0, NOW(), NULL, NULL),
(10, NULL, 'Calle Mayor 101, Barcelona', 'Cerca del mercado central', 1, NOW(), NULL, NULL);

INSERT INTO tb_contratos (id_cliente, id_tarifario, id_sector, id_usuario_registro, id_usuario_tecnico, direccion_servicio, referencia, coordenada, fecha_inicio, fecha_fin, fecha_registro, ficha_instalacion, descuento, monto_pagado, nota, estado) VALUES
(1, 1, 1, 1, NULL, 'Av. Siempre Viva 123, Springfield', 'Cerca de la plaza principal', '12.3456, -65.4321', '2024-01-15', '2024-06-15', '2024-01-01', '{"tipo":"electrico","voltaje":"220V"}', 10.00, 200.00, 'Primer contrato con cliente nuevo', 1),
(2, 2, 2, 3, NULL, 'Calle Falsa 456, Gotham', 'Cerca del cine local', '34.5678, -76.5432', '2024-02-01', '2024-07-01', '2024-02-01', '{"tipo":"hidraulico","presion":"1.5 bar"}', 15.00, 300.00, 'Instalación programada', 1),
(3, 3, 3, 2, NULL, 'Av. Los Pinos 789, Lima', 'Esquina con Av. Las Flores', '23.4567, -54.3210', '2024-03-01', '2024-08-01', '2024-03-01', '{"tipo":"telecomunicacion","frecuencia":"2.4 GHz"}', NULL, 250.00, 'Revisión mensual incluida', 1),
(4, 4, 4, 5, NULL, 'Jirón de la Unión 100, Lima', 'Frente a la Plaza Mayor', '45.6789, -43.2109', '2024-04-01', '2024-09-01', '2024-04-01', '{"tipo":"seguridad","camaras":"4"}', 5.00, 150.00, 'Descuento aplicado por contrato anual', 0),
(5, 5, 5, 4, NULL, 'Calle Mayor 101, Barcelona', 'Cerca del mercado central', '56.7890, -32.1098', '2024-05-01', '2024-10-01', '2024-05-01', '{"tipo":"climatizacion","temperatura":"18-22°C"}', 20.00, 350.00, 'Contrato especial por volumen', 1);

INSERT INTO tb_contactabilidad (id_persona, id_tarifario, fecha_hora_contacto, direccion_servicio, dias_vigencia, nota) VALUES
(1, 1, '2024-01-10 14:30:00', 'Av. Siempre Viva 123, Springfield', 30, 'Contacto inicial realizado con éxito.'),
(2, 2, '2024-02-15 10:00:00', 'Calle Falsa 456, Gotham', 15, 'Se acordó la fecha para la instalación.'),
(3, 3, '2024-03-20 16:45:00', 'Av. Los Pinos 789, Lima', 45, 'Cliente solicitó información adicional sobre el servicio.'),
(4, 4, '2024-04-25 11:00:00', 'Jirón de la Unión 100, Lima', 60, 'Se discutieron los términos del contrato y se acordó una revisión futura.'),
(5, 5, '2024-05-30 09:30:00', 'Calle Mayor 101, Barcelona', 30, 'Se completó la verificación del servicio y se envió confirmación.'); 

INSERT INTO tb_soporte (id_contrato, id_tipo_soporte, id_tecnico, fecha_hora_solicitud, fecha_hora_asistencia, descripcion_problema, descripcion_solucion, prioridad) VALUES
(1, 1, 1, '2024-01-10 15:00:00', '2024-01-10 16:00:00', 'Problema con el voltaje en el área principal.', 'Reemplazo del regulador de voltaje realizado.', 'Alta'),
(2, 2, 2, '2024-02-16 11:00:00', '2024-02-16 12:30:00', 'Fugas en la tubería principal.', 'Reparación de fugas y prueba de presión completada.', 'Media'),
(3, 3, 3, '2024-03-21 09:30:00', '2024-03-21 10:00:00', 'Problemas de conectividad en la red.', 'Configuración y prueba de la red realizada.', 'Alta'),
(4, 1, 4, '2024-04-26 14:00:00', '2024-04-26 15:30:00', 'Falla en el sistema de alarma.', 'Sustitución de los sensores defectuosos realizada.', 'Baja'),
(5, 2, 5, '2024-05-31 13:00:00', '2024-05-31 14:30:00', 'Sistema de climatización ineficiente.', 'Ajuste y mantenimiento del sistema completado.', 'Media');

CALL spu_productos_agregar("ASUS", "Router A", "RT-AX88U", 25.00, "12345678901234567890123456789012345");
CALL spu_productos_agregar("Linksys", "Router B", "E8450", 26.00, "12345678901234567890123456789012345");
CALL spu_productos_agregar("Huawei", "Router C", "WS5200", 27.00, "12345678901234567890123456789012345");
CALL spu_productos_agregar("Netgear", "Router D", "Nighthawk X6", 28.00, "12345678901234567890123456789012345");
CALL spu_productos_agregar("Cisco", "Router E", "ISR4331", 29.00, "12345678901234567890123456789012345");

CALL spu_kardex_registrar(1, '2024-08-12', 'ENTRADA', 'Compra Inicial', 100, 25.00);
CALL spu_kardex_registrar(2, '2024-08-13', 'ENTRADA', 'Reabastecimiento', 100, 26.00);
CALL spu_kardex_registrar(3, '2024-08-14', 'ENTRADA', 'Pedido Especial', 100, 27.00);
CALL spu_kardex_registrar(4, '2024-08-15', 'ENTRADA', 'Sustitución', 100, 28.00);
CALL spu_kardex_registrar(5, '2024-08-16', 'ENTRADA', 'Inventario Completo', 100, 29.00);

CALL spu_kardex_registrar(1, '2024-08-17', 'SALIDA', 'Venta', 50, 25.00);
CALL spu_kardex_registrar(1, '2024-08-17', 'SALIDA', 'Venta prueba', 65, 25.00);
CALL spu_kardex_registrar(2, '2024-08-18', 'SALIDA', 'Devolución', 50, 26.00);
CALL spu_kardex_registrar(3, '2024-08-19', 'SALIDA', 'Prueba de Cliente', 50, 27.00);
CALL spu_kardex_registrar(4, '2024-08-20', 'SALIDA', 'Muestra', 50, 28.00);
CALL spu_kardex_registrar(5, '2024-08-21', 'SALIDA', 'Exhibición', 50, 29.00);

