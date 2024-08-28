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

INSERT INTO tb_roles (rol, permisos) VALUES
('Administrador', '{"soporte": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "contratos": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "inventariado": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "personas": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "roles": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}}'),
('Tecnico Oficina', '{"soporte": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "contratos": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}, "inventariado": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}, "personas": {"crear": 0, "leer": 1, "actualizar": 0, "eliminar": 0}, "roles": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}}'),
('Oficina', '{"soporte": {"crear": 0, "leer": 1, "actualizar": 0, "eliminar": 0}, "contratos": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "inventariado": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}, "personas": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "roles": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}}'),
('Tecnico Campo', '{"soporte": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "contratos": {"crear": 0, "leer": 1, "actualizar": 0, "eliminar": 0}, "inventariado": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}, "personas": {"crear": 0, "leer": 1, "actualizar": 0, "eliminar": 0}, "roles": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}}'),
('Almacen - Tecnico', '{"soporte": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "contratos": {"crear": 0, "leer": 1, "actualizar": 0, "eliminar": 0}, "inventariado": {"crear": 1, "leer": 1, "actualizar": 1, "eliminar": 1}, "personas": {"crear": 0, "leer": 1, "actualizar": 0, "eliminar": 0}, "roles": {"crear": 0, "leer": 0, "actualizar": 0, "eliminar": 0}}');

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
(5, 'jfernandez', '$2y$10$3uS8rP3q14NxWtXEefIi3.7JuG3.xWMOo9UoLS53uK87YEfEIBGHm'),
(6, 'Example', '$2y$10$rVTflHuPt0btU6sXKBm/oOa8ZPSBV5x0doWaWyY9UoNXGleRcX7dG'); /*123456*/

INSERT INTO tb_responsables (id_usuario, id_rol) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 5);

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

INSERT INTO tb_contratos (id_cliente, id_tarifario, id_sector, id_usuario_registro, id_usuario_tecnico, direccion_servicio, referencia, coordenada, fecha_inicio, fecha_fin, fecha_registro, ficha_instalacion, pagos, nota, estado) VALUES 
(1, 1, 1, 1, NULL, 'Av. Siempre Viva 123, Springfield', 'Cerca de la plaza principal', '12.3456, -65.4321', '2024-01-15', '2024-06-15', '2024-01-01', '{"tipo":"electrico","voltaje":"220V"}', '{"monto":"200.00","metodo":"tarjeta","fecha":"2024-01-02"}', 'Primer contrato con cliente nuevo', 1),
(2, 2, 2, 3, NULL, 'Calle Falsa 456, Gotham', 'Cerca del cine local', '34.5678, -76.5432', '2024-02-01', '2024-07-01', '2024-02-01', '{"tipo":"hidraulico","presion":"1.5 bar"}', '{"monto":"300.00","metodo":"efectivo","fecha":"2024-02-03"}', 'Instalación programada', 1),
(3, 3, 3, 2, NULL, 'Av. Los Pinos 789, Lima', 'Esquina con Av. Las Flores', '23.4567, -54.3210', '2024-03-01', '2024-08-01', '2024-03-01', '{"tipo":"telecomunicacion","frecuencia":"2.4 GHz"}', '{"monto":"250.00","metodo":"transferencia","fecha":"2024-03-05"}', 'Revisión mensual incluida', 1),
(4, 4, 4, 5, NULL, 'Jirón de la Unión 100, Lima', 'Frente a la Plaza Mayor', '45.6789, -43.2109', '2024-04-01', '2024-09-01', '2024-04-01', '{"tipo":"seguridad","camaras":"4"}', '{"monto":"150.00","metodo":"tarjeta","fecha":"2024-04-06"}', 'Descuento aplicado por contrato anual', 0),
(5, 5, 5, 4, NULL, 'Calle Mayor 101, Barcelona', 'Cerca del mercado central', '56.7890, -32.1098', '2024-05-01', '2024-10-01', '2024-05-01', '{"tipo":"climatizacion","temperatura":"18-22°C"}', '{"monto":"350.00","metodo":"cheque","fecha":"2024-05-08"}', 'Contrato especial por volumen', 1);

INSERT INTO tb_contactabilidad (id_persona, id_tarifario, fecha_hora_contacto, direccion_servicio, dias_vigencia, nota) VALUES
(1, 1, '2024-01-10 14:30:00', 'Av. Siempre Viva 123, Springfield', 30, 'Contacto inicial realizado con éxito.'),
(2, 2, '2024-02-15 10:00:00', 'Calle Falsa 456, Gotham', 15, 'Se acordó la fecha para la instalación.'),
(3, 3, '2024-03-20 16:45:00', 'Av. Los Pinos 789, Lima', 45, 'Cliente solicitó información adicional sobre el servicio.'),
(4, 4, '2024-04-25 11:00:00', 'Jirón de la Unión 100, Lima', 60, 'Se discutieron los términos del contrato y se acordó una revisión futura.'),
(5, 5, '2024-05-30 09:30:00', 'Calle Mayor 101, Barcelona', 30, 'Se completó la verificación del servicio y se envió confirmación.'); 

INSERT INTO tb_soporte (id_contrato, id_tipo_soporte, id_tecnico, fecha_hora_solicitud, fecha_hora_asistencia, descripcion_problema, descripcion_solucion, prioridad, pagos) VALUES 
(1, 1, 1, '2024-01-10 15:00:00', '2024-01-10 16:00:00', 'Problema con el voltaje en el área principal.', 'Reemplazo del regulador de voltaje realizado.', 'Alta', '{"monto":"50.00","metodo":"tarjeta","fecha":"2024-01-11"}'),
(2, 2, 2, '2024-02-16 11:00:00', '2024-02-16 12:30:00', 'Fugas en la tubería principal.', 'Reparación de fugas y prueba de presión completada.', 'Media', '{"monto":"100.00","metodo":"efectivo","fecha":"2024-02-17"}'),
(3, 3, 3, '2024-03-21 09:30:00', '2024-03-21 10:00:00', 'Problemas de conectividad en la red.', 'Configuración y prueba de la red realizada.', 'Alta', '{"monto":"75.00","metodo":"transferencia","fecha":"2024-03-22"}'),
(4, 1, 4, '2024-04-26 14:00:00', '2024-04-26 15:30:00', 'Falla en el sistema de alarma.', 'Sustitución de los sensores defectuosos realizada.', 'Baja', '{"monto":"40.00","metodo":"tarjeta","fecha":"2024-04-27"}'),
(5, 2, 5, '2024-05-31 13:00:00', '2024-05-31 14:30:00', 'Sistema de climatización ineficiente.', 'Ajuste y mantenimiento del sistema completado.', 'Media', '{"monto":"120.00","metodo":"cheque","fecha":"2024-06-01"}');

INSERT INTO tb_productos (marca, tipo_producto, modelo, precio_actual, codigo_barra) VALUES 
("ASUS", "Router A", "RT-AX88U", 25.00, "12345678901234567890123456789012345"),
("Linksys", "Router B", "E8450", 26.00, "12345678901234567890123456789012346"),
("Huawei", "Router C", "WS5200", 27.00, "12345678901234567890123456789012347"),
("Netgear", "Router D", "Nighthawk X6", 28.00, "12345678901234567890123456789012348"),
("Cisco", "Router E", "ISR4331", 29.00, "12345678901234567890123456789012349");