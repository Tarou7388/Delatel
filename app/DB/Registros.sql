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
('DNI','73753884','NAPA ABREGU','ANGEL DANIEL','966557234','Peruano',NULL,1),
('DNI','21781164','YATACO GARCIA','MOISES','944420613','Peruano',NULL,1),
('DNI','73602072','MESIAS ALMEYDA','MARYORI ELIZABETH','985797500','Peruana',NULL,1),
('DNI','47934103','ANCHANTE RICALES','ROBERTO CARLOS','965973468','Peruano',NULL,1),
('DNI','40956921','TASAYCO LEVANO','MIGUEL ANGEL','962278152','Peruano',NULL,1),
('DNI','72517098','PASTOR ROJAS','PATRICIA','924594304','Peruana',NULL,1),
('DNI','41114586','GOITIA PEREZ','YHONSONN','946090592','Peruano',NULL,1),
('DNI','21866147','MENDIGUETE LOYOLA','MARIA JULIA','962402706','Peruana',NULL,1),
('DNI','22303840','SARAVIA VELA','ROCIO MAYDEE','981168789','Peruana',NULL,1),
('DNI','21861430','TASAYCO TORRES','MARITZA LILIANA','904712454','Peruana',NULL,1),
('DNI','21867629','LEVANO TORRES','MARITZA','955446960','Peruana',NULL,1),
('DNI','45715311','CARBAJAL SANCHEZ','ROSA','952567956','Peruana',NULL,1),
('DNI','70365628','GARCIA TASAYCO','RONALD STALIN','950639761','Peruano',NULL,1),
('DNI','43628022','SANTIAGO SARAVIA','VICTOR HUGO','948829288','Peruano',NULL,1),
('DNI','21825949','YATACO GARCIA','MARIA SANTOS','965696054','Peruana',NULL,1),
('DNI','21866254','GARCIA MARTINEZ','CECILIA PATRICIA','947929771','Peruana',NULL,1),
('DNI','47898813','GENTILLE GUTARRA','CRISTAL','934444810','Peruana',NULL,1),
('DNI','44176871','BARILLAS PEVE','DANIEL','962308941','Peruano',NULL,1),
('DNI','71616251','CRISOSTOMO LEVANO','PEDRO MANUEL','955127262','Peruano',NULL,1),
('DNI','41135592','HUANQUI TRILLO DE GARAY','NAYADE SAIDA','960169072','Peruana',NULL,1),
('DNI','72082086','LOBO MENESES','LUIS','930197086','Peruano',NULL,1),
('DNI','45252181','DIAZ REBATTA','EDDER RUBEN','994323996','Peruano',NULL,1),
('DNI','75234060','NAPA CASTILLO','DELIA LIBERTAD','928589038','Peruano',NULL,1),
('DNI','40905473','MARTINEZ VILLAR','EPIFANIA CLEMENCIA','971615965','Peruana',NULL,1),
('DNI','15439628','CAMPOS BARRIOS','JUANA MILAGROS','956517578','Peruana',NULL,1),
('DNI','41256049','GONZALES ATUNCAR','MARIA','924052883','Peruana',NULL,1),
('DNI','42869491','DE LA CRUZ TORRES','LUIS','937233140','Peruano',NULL,1),
('DNI','71616237','SARAVIA MEDINA','LUIS','977537270','Peruano',NULL,1),
('DNI','41893651','MENESES CRISOSTOMO','MARILU','916728107','Peruana',NULL,1),
('DNI','47841679','ATUNCAR MARQUEZ','HAROLD','906467373','Peruano',NULL,1),
('DNI','43210229','PEVE GUERRA','OSWALDO EFRAIN','914717616','Peruano',NULL,1),
('DNI','72872536','VALENCIA SARAVIA','ELIZABETH','950162295','Peruana',NULL,1),
('DNI','43510116','TORRES TASAYCO','VICTOR HUGO','922397715','Peruano',NULL,1),
('DNI','21862542','YATACO GARCIA DE GARCIA','NELLY','912700722','Peruana',NULL,1),
('DNI','41730654','CASTILLA MATEO','JUAN CARLOS','941327977','Peruano',NULL,1),
('DNI','41637529','QUISPE SANCHEZ','LINO','945160889','Peruano',NULL,1),
('DNI','41455781','MENESES TASAYCO','BLANCA MARIBEL','955962818','Peruana',NULL,1),
('DNI','21876020','ALVAREZ CUEVA','MARTIN WILLIAM','964347449','Peruano',NULL,1),
('DNI','44364538','VASQUEZ CHUQUISPUMA','RUTH ESTHER','972573295','Peruana',NULL,1),
('DNI','60454449','PEREZ TERRONES','GRETY','912143217','Peruana',NULL,1),
('DNI','09688142','GAMEZ CHACON','ERCELIZ','956138789','Peruana',NULL,1),
('DNI','41075262','QUISPE PACHAS','RONNY RAUL','994980680','Peruano',NULL,1),
('DNI','44972815','NAPA CASTILLA','OSCAR JAVIER','960162907','Peruano',NULL,1),
('DNI','45778769','BRICEÑO DEL RIO','FREDY JHON','952128903','Peruano',NULL,1),
('DNI','23019806','JUAREZ TORRES','LUCY YAMALI','967591253','Peruana',NULL,1),
('DNI','44136139','PAZ CASAVERDE','VANESSA','902226993','Peruana',NULL,1),
('DNI','71789780','CUADROS SARAVIA','DIANA','927744936','Peruana',NULL,1),
('DNI','48222293','APOLAYA ROMERO','NELZI','922693855','Peruana',NULL,1),
('DNI','48040901','MATIAS CRISOSTOMO','ANGEL ALBERTO','933241678','Peruano',NULL,1),
('DNI','73819477','ANTON OSTIA','BRYAN LUIS','955029880','Peruano',NULL,1),
('DNI','41748230','ANGULO LOYOLA','JHAN CARLOS','998308628','Peruano',NULL,1),
('DNI','21794090','MAGALLANES ORTIZ','VICTOR LUIS','912074015','Peruano',NULL,1),
('DNI','21881955','TASAYCO MENDOZA','LILIANA CATALINA','912180079','Peruana',NULL,1),
('DNI','75352738','MEREDIA MUÑOZ','GIANELA CORAIMA','997259195','Peruana',NULL,1),
('DNI','21857534','VALVERDE ORTIZ','SANTA ANGELICA','960999975','Peruana',NULL,1),
('DNI','45442612','ORTIZ HERNANDEZ','MARIANELLA','946916479','Peruano',NULL,1),
('DNI','21794453','MELO GUERRA','ANSELMO','977867820','Peruano',NULL,1),
('DNI','44771538','ALMEYDA NAPA','GLORIA','942370984','Peruana',NULL,1),
('DNI','74421607','DIAZ DE LA CRUZ','ARIANA','933155682','Peruana',NULL,1),
('DNI','21873544','CASTILLA RILQUELME','ALEXANDER','952683121','Peruano',NULL,1),
('DNI','45682504','TASAYCO ARIAS','GREGORIO JHONATHAN','947700239','Peruano',NULL,1),
('DNI','76307312','SARAVIA LEVANO','MARYORI','943735454','Peruana',NULL,1),
('DNI','80487137','DE LA CRUZ ABREGU','MIGUEL ANGEL','917163741','Peruano',NULL,1),
('DNI','21882395','HUARANCA DURAND','VCITOR','932904801','Peruano',NULL,1),
('DNI','44521340','BOGA SIGUAS','GIANCARLOS','995734338','Peruano',NULL,1),
('DNI','42777407','DIAZ TASAYCO','CARLOS YVAN','908601428','Peruano',NULL,1),
('DNI','74035877','DAVILA DIAZ','HILDA XIOMARA','904354801','Peruana',NULL,1),
('DNI','40907806','QUISPE PAUCAR','MIRIAN','904275168','Peruana',NULL,1),
('DNI','62892038','ALVAREZ CHIQUISPUMA','JHAN MARTINEZ','924702432','Peruano',NULL,1),
('DNI','42876347','ROJAS GUERRA','EDGAR','960329089','Peruano',NULL,1),
('DNI','73472203','MAGALLANES MURILLO','MIOSIRY LILIANA','902492034','Peruana',NULL,1),
('DNI','21887823','MAGALLANES GARCIA','JULIO CESAR','953433332','Peruano',NULL,1),
('DNI','44645111','DE LA CRUZ TORRES','MIRIAM','977393013','Peruana',NULL,1),
('DNI','71440787','ATUNCAR ALMEYDA','DIEGO ALFONSO','949792659','Peruano',NULL,1),
('DNI','42296834','HERNANDEZ NAPA','JOSE LUIS','902151026','Peruano',NULL,1),
('DNI','21850270','DE LA CRUZ QUISPE','VICTORIA ISABEL','997067532','Peruana',NULL,1),
('DNI','21846116','CRISOSTOMO CUELLAR','ARNALDO','955017366','Peruano',NULL,1),
('DNI','75957606','CASTAÑEDA SULCA','ROSA LINDA','900648734','Peruana',NULL,1),
('DNI','77923612','SARAVIA BONIFACIO','JENNIFER DENIS','907539262','Peruana',NULL,1),
('DNI','41405135','ROJAS PACHAS','YOVANA VANESA','904410306','Peruana',NULL,1),
('DNI','46132681','TORRES FAJARDO','ERICK JOHANY','902301220','Peruano',NULL,1),
('DNI','41834203','ROJAS CONTRERAS','CECILIA','943326467','Peruana',NULL,1),
('DNI','45852739','DE LA CRUZ JACOBO','JULIO CESAR','902572234','Peruano',NULL,1),
('DNI','75178691','ATUNCAR ALMEYDA','ANGEL JESUS','977655697','Peruano',NULL,1),
('DNI','42116747','ALVAREZ TOMASTO','JUAN MARTIN','904384806','Peruano',NULL,1),
('DNI','40679555','NAPA MARTINEZ','MARIA','902755736','Peruana',NULL,1),
('DNI','09736546','BENITES BOCANEGRA','FRANCISCO HERMAN','943656810','Peruano',NULL,1),
('DNI','40813108','SARAVIA TORRES','TERESA YSABEL','951679716','Peruana',NULL,1);
 

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
(2, 'Mramos', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(3, 'Mtasayco', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(4, 'Dpeñaloza', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1),
(5, 'Tsaravia', '$2y$10$v33I.gsFvcSz5fGO9zCD6OeTmL65ivYUP63ZlZ7xcQrv100eVaRRK', 1);

INSERT INTO tb_roles (rol, permisos, iduser_create) VALUES
('Administrador', '{"actividad":"Mapa", "administracion":{"leer":true,"crear":true,"actualizar":true,"eliminar":true}, "soporte":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"personas":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"roles":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"usuarios":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"reportes":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"paquetes":{"leer":true,"crear":true,"actualizar":true,"eliminar":true}}', 1),
('Tecnico Oficina', '{"actividad":"Soporte", "administracion":{},"soporte":false,"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"personas":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"roles":false,"usuarios":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"paquetes":false}', 1),
('Oficina', '{"actividad":"Contratos", "administracion":{},"soporte":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":false,"personas":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"roles":false,"usuarios":false,"paquetes":false}', 1),
('Tecnico Campo', '{"actividad":"Fichas", "administracion":{},"soporte":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"contratos":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"inventariado":false,"personas":false,"roles":false,"usuarios":false,"paquetes":false}', 1),
('Almacen - Tecnico', '{"actividad":"Kardex", "administracion":{},"soporte":false,"contratos":false,"inventariado":{"leer":true,"crear":true,"actualizar":true,"eliminar":true},"personas":false,"roles":false,"usuarios":false,"paquetes":false}', 1);

INSERT INTO tb_sectores (id_distrito, sector, descripcion, coordenadas, direccion, iduser_create) VALUES
(110210, 'COLEGIO', 'Descripción del sector', "-13.42544269617297, -76.15808116947606", 'Dirección del sector', 1),
(110210, 'SANTA ROSA', 'Descripción del sector', "-13.4236801469295, -76.15636428337336", 'Dirección del sector', 1),
(110210, 'SAN IGNACIO', 'Descripción del sector', "-13.42084308470873, -76.15172619142008", 'Dirección del sector', 1),
(110210, 'VILLA JULIA', 'Descripción del sector', "-13.41865293087071, -76.14804412727285", 'Dirección del sector', 1),
(110210, 'PARAISO', 'Descripción del sector', "-13.42056044489115, -76.1658703095588", 'Dirección del sector', 1),
(110210, 'SAN PILPA', 'Descripción del sector', "-13.41763371580861, -76.1636141502515", 'Dirección del sector', 1),
(110210, 'CRUZ BLANCA', 'Descripción del sector', "-13.4292202892175, -76.12004531160598", 'Dirección del sector', 1),
(110210, 'MINA ORO', 'Descripción del sector', "-13.42704443028948, -76.13963358072775", 'Dirección del sector', 1),
(110210, 'SANTA FE', 'Descripción del sector', "-13.42720878737056, -76.17156138732457", 'Dirección del sector', 1),
(110210, 'HUACA GRANDE', 'Descripción del sector', "-13.4288474271221, -76.15446500188271", 'Dirección del sector', 1),
(110206, 'MEJILLONEROS', 'Descripción del sector', "-13.40788239712879, -76.15983137626122", 'Dirección del sector', 1),
(110206, 'PORVENIR', 'Descripción del sector', "-13.40498211432371, -76.15983221931539", 'Dirección del sector', 1),
(110206, 'PROGRESO', 'Descripción del sector', "-13.4344505095856, -76.13017637387277", 'Dirección del sector', 1),
(110107, 'SALVADOR 1', 'Descripción del sector', "-13.39336425906626, -76.1488242018644", 'Dirección del sector', 1),
(110107, 'TECHO MAX', 'Descripción del sector', "-13.40220429678562, -76.13732471155042", 'Dirección del sector', 1),
(110107, 'SATELITE 1', 'Descripción del sector', "-13.38765487990007, -76.11958212522634", 'Dirección del sector', 1),
(110107, 'SATELITE 2', 'Descripción del sector', "-13.38534611704822, -76.12102025177141", 'Dirección del sector', 1),
(110107, 'ROSEDAL', 'Descripción del sector', "-13.399712698456614, -76.12151072760331", 'Dirección del sector', 1),
(110201, 'CRUZBLANCA', 'Descripción del sector', "-13.4292202892175, -76.12004531160598", 'Dirección del sector', 1),
(110201, 'ORURO', 'Descripción del sector', "-13.42999374526452, -76.11673399746118", 'Dirección del sector', 1),
(110201, 'VR DEL CARMEN', 'Descripción del sector', "-13.42802163353247, -76.12165813154482", 'Dirección del sector', 1),
(110201, 'CAMPO COND', 'Descripción del sector', "-13.4316581916571, -76.11842467768329", 'Dirección del sector', 1),
(110201, 'COND. ALTA', 'Descripción del sector', "-13.43669652995902, -76.11306320932194", 'Dirección del sector', 1),
(110201, 'COND. BAJA', 'Descripción del sector', "-13.43473693459032, -76.11455679499767", 'Dirección del sector', 1);

INSERT INTO tb_mufas (nombre, descripcion, coordenadas, direccion, create_at, iduser_create) VALUES
('Mufa 1', 'Cerca del estadio', '-13.41287751332741, -76.15387988372802', 'Av 123', NOW(), 1),
('Mufa 2', 'Plaza san Isidro', '-13.429027241634715, -76.14961981773376', 'Av 123456', NOW(), 1),
('Mufa 3', 'Cerca de la Plaza', '-13.404169746696624, -76.12736834665132', 'Av 123', NOW(), 1),
('Mufa 4', 'San Nicolas', '-13.42830253845429, -76.12306531088652', 'Av 123456', NOW(), 1);

INSERT INTO tb_cajas(nombre, descripcion, numero_entradas, id_sector, coordenadas, iduser_create) VALUES
('Caja 1', 'Cerca del estadio', 16, 11, '-13.390019838079903, -76.14898062581466', 1),
('Caja 2', 'Plaza san Isidro', 8, 11, '-13.396082705347906, -76.13534364004165', 1),
('Caja 3', 'Cerca de la Plaza', 8, 19, '-13.4277387660967, -76.16422117136221', 1),
('Caja 4', 'San Nicolas', 16, 19, '-13.432393655576314, -76.1627322889994', 1),
('Caja 5', 'Prolongacion Cañete', 16, 11, '-13.393627228237747, -76.14441531745013', 1),
('Caja 6', 'Tecnologico Chincha', 8, 6, '-13.404627155707574, -76.13712932116213', 1),
('Caja 7', 'Los Bancarios', 8, 6, '-13.42826126892918, -76.135733419194', 1),
('Caja 8', 'Plaza Chincha', 16, 6, '-13.41819520203595, -76.13222851544388', 1),
('Caja 9', 'Parque Toledo', 8, 19, '-13.417732015444551, -76.11985007949754', 1),
('Caja 10', 'Plaza de pueblo nuevo', 16, 19, '-13.404169746696624, -76.12736834665132', 1);

INSERT INTO tb_responsables (id_usuario, id_rol,iduser_create) VALUES
(1, 1,1),
(2, 2,1),
(3, 3,1),
(4, 4,1),
(5, 5,1);

INSERT INTO tb_clientes (id_persona, id_empresa, direccion, referencia, iduser_create, coordenadas) VALUES
(6, NULL, 'Av. Luis Alva Maurtua S/N', 'Cruz blanca 4ta cuadra - Oruro', 1, '-13.430139, -76.113639'), --ANGEL DANIEL NAPA ABREGU
(7, NULL, 'Calle San Luis #139', 'Chincha alta', 1, '-13.421583, -76.122361'), -- MOISES YATACO GARCIA
(8, NULL, 'AA.HH. Virgen Del Carmen Mz-G N-18 ', 'Chincha Alta', 1, '-13.427278, -76.124889'), -- MARYORI ELIZABETH MESIAS ALMEYDA
(9, NULL, 'Av San Martin #103', 'Sunampe', 1, '-13.433306, -76.137694'), -- ROBERTO CARLOS ANCHANTE RICALES
(10, NULL, 'Psj. Los Angeles S/N', 'Mina de oro', 1, '-13.431694, -76.144278'), --MIGUEL ANGEL TASAYCO LEVANO
(11, NULL, 'Av. Santa Rosa N° 312', 'Lomo largo', 1, '-13.424111, -76.168028'), --PATRICIA PASTOR ROJAS
(12, NULL, 'Psj. San Cosme #185', 'Calle Rosario 7ma Cuadra', 1, '-13.406222, -76.138167'), -- YHONSONN GOITIA PEREZ
(13, NULL, 'Psj. San Vicente Mz-P Lt-16', 'Sunampe', 1, '-13.411083, -76.163611'), -- MARIA JULIA MENDIGUETE LOYOLA
(14, NULL, 'Av. San Antonio', 'Santa Rosa - Sunampe', 1, '-13.421583, -76.157194'), -- ROCIO MAYDEE SARAVIA VELA
(15, NULL, 'PSj. Primaveral Lt-11022', 'Cruz Blanca', 1, '-13.430250, -76.121194'), -- MARITZA LILIANA TASAYCO TORRES
(16, NULL, 'Psj. Los Claveles N° 207', 'Cruz Blanca - Chinhca Alta', 1, '-13.423222, -76.123889'), -- MARITZA LEVANO TORRES
(17, NULL, 'Calle Parada de los amigos', 'Sunampe', 1, '-13.412833, -76.164778'), -- ROSA CARBAJAL SANCHEZ
(18, NULL, 'Barrio el por venir', 'Grocio Prado', 1, '-13.403472, -76.165472'), -- RONALD STALIN GARCIA TASAYCO
(19, NULL, 'Upis Divina Misericordia Mz-B Lt-6A', 'Chincha Alta', 1, '-13.416028, -76.144944'), -- VICTOR HUGO SANTIAGO SARAVIA
(20, NULL, 'Psj. 2 de mayo N°228', 'Cruz Blanca', 1, '-1'), -- MARIA SANTOS YATACO GARCIA
(21, NULL, 'Urb Los Viñedos N° UZ-12', 'Chincha Alta', 1, '-13.406250, -76.140111'), -- CECILIA PATRICIA GARCIA MARTINEZ
(22, NULL, 'Psj. San Jose Mz-H Lt-10', 'Sunampe', 1, '-13.421139, -76.169333'), -- CRISTAL GENTILLE GUTARRA
(23, NULL, 'Calle Sebastian Barranca Lt-14C', 'Grocio Prado', 1, '-13.382250, -76.156000'), -- DANIEL BARILLAS PEVE
(24, NULL, 'Psj. San Blas - Calle A Lt-02', 'Alfonso Ugarte Norte-Sunampe', 1, '-13.418639, -76.170583'), -- PEDRO MANUEL CRISOSTOMO LEVANO
(25, NULL, 'Av. Unión N°3A - Los Alamos', 'Pueblo Nuevo', 1, '-13.403750, -76.138222'), --NAYADE SAIDA HUANQUI TRILLO DE GARAY
(26, NULL, 'Psj. La frontera N° 257', 'Lomo Largo - Sunampe', 1, '-13.420250, -76.165306'), -- LUIS LOBO MENESES
(27, NULL, 'AA.HH El Salvador Mz-J Sub Lt-2-2', 'Pueblo Nuevo a 2 casas de la torre', 1, '-13.395750, -76.142361'), -- EDDER RUBEN DIAZ REBATTA
(28, NULL, 'Av. Alva Maurtua Mz-J Lt-16', 'Cruz Blanca', 1, '-13.428611, -76.117278'),-- DELIA LIBERTAD NAPA CASTILLO
(29, NULL, 'Upis San Andrés Mz-A Lt-6', 'Pueblo Nuevo', 1, '-13.392583, -76.139028'), --EPIFANIA CLEMENCIA MARTINEZ VILLAR
(30, NULL, 'Upis San Andrés Mz-I Lt-19', 'Pueblo Nuevo', 1, '-13.394111, -76.137361'), -- JUANA MILAGROS CAMPOS BARRIOS
(31, NULL, 'Calle Los Angeles N°368', 'Lomo Largo', 1, '-13.419361, -76.168944'), -- MARIA GONZALES ATUNCAR
(32, NULL, 'Calle Pedro Moreno N° 130', 'Grocio Prado', 1, '-13.410833, -76.140333'), -- LUIS DE LA CRUZ TORRES
(33, NULL, 'Av. Los Angeles #512 - Sunampe', 'Frente discoteca the boss', 1, '-13.419139, -76.170278'), -- LUIS SARAVIA MEDINA
(34, NULL, 'Condorillo alto Mz-I Lt-12', 'Chincha Alta', 1, '-1'),
(35, NULL, 'Psj. San gregorio S/N', 'Alameda - Sunampe', 1, '-1'),
(36, NULL, 'Psj. 2 de mayo #309', 'Cruz Blanca', 1, '-1'),
(37, NULL, 'Psj. San Juan de Dios', 'Cruz Blanca', 1, '-1'),
(38, NULL, 'AA.HH Jesús María y Jesús Mz-D Lt-02', 'Chincha Alta', 1, '-1'),
(39, NULL, 'Upis Biggio Mz-D Puerta 02', '', 1, '-1'),
(40, NULL, 'Calle El Carmen N°210', 'Cruz Blanca', 1, '-1'),
(41, NULL, 'C.P Condorillo alto Mz-T Lt-23', 'Chincha Alta', 1, '-1'),
(42, NULL, 'Calle Sebastion Barranca Lt-3 C-1', 'Fundo colorado - Grocio Prado', 1, '-1'),
(43, NULL, 'Calle Mina de oro Puerta 06 / Sin barrio', 'Mina de oro - cinco esquinas', 1, '-1'),
(44, NULL, 'AA.HH Jesus Maria y Jose #A-05', 'Chincha Alta', 1, '-1'),
(45, NULL, 'Prol. Juan Castilla Roncero Lt-3B', 'Grocio Prado - Barrio el por venir', 1, '-1'),
(46, NULL, 'Calle San Pedro de Pilpa #256-1', 'Sunampe', 1, '-1'),
(47, NULL, 'Condorillo Alto Mz-P Lt-15', 'Cruz Blanca', 1, '-1'),
(48, NULL, 'Av. Luis Alva Maurtua N° 525', 'Cruz Blanca - Chincha Alta', 1, '-1'),
(49, NULL, 'AA.HH Husares de Junin', 'Mz-C Lt-8', 1, '-1'),
(50, NULL, 'Psj. Anampa Puerta 160', 'Antiguo Sunampe', 1, '-1'),
(51, NULL, 'Calle Prol. Benavides', 'Grocio Prado', 1, '-1'),
(52, NULL, 'Av. Paraiso Lt. 5-B', 'Loimo Largo - Sunampe', 1, '-1'),
(53, NULL, 'AA.HH Virgen del Carmen - Cruz Blanca', 'Mz-D Lt-17', 1, '-1'),
(54, NULL, 'Luis Massaro ex Pilpa Plaza center', 'Chincha Frente SJB Stand 210-D', 1, '-1'),
(55, NULL, 'Calle El Carmen N° 196', 'Cruz Blanca - Chincha', 1, '-1'),
(56, NULL, 'Calle San Pedro de Pilpa #588', 'Sunampe',1,'-1'),
(57, NULL, 'Upis 15 de Noviembre', 'Jose olaya B-13-2 puertas',1,'-1'),
(58, NULL, 'AA.HH El milagro de San Judas Tadeo', 'Mz-D Lt-8 - Sunampe - Mina de Oro',1,'-1'),
(59, NULL, 'El por venir Mz-E Lt-19', 'Grocio Prado',1,'-1'),
(60, NULL, 'Av. Primavera #711', 'Antes de la baja del socorro - Sunampe',1,'-1'),
(61, NULL, 'Psj. San Martin  N°114', 'Mina de oro',1,'-1'),
(62, NULL, 'AA.HH Virgen del Carmen', 'Mz-B Lt-04',1,'-1'),
(63, NULL, 'Psj. Arena Costa Mz-D Lt-7', 'San Ignacio',1,'-1'),
(64, NULL, 'CP. Condorillo alto', 'Mz-U Lt-01',1,'-1'),
(65, NULL, 'Av. San Rafael #258 - Grocio Prado', 'Frente a los mejilloneros',1,'-1'),
(66, NULL, 'Barrio Cruz Blanca - Alva Maurtua', 'Ultimo paradero - Oruro',1,'-1'),
(67, NULL, 'AA.HH El salvador Mz-B Puerta 17', 'Pueblo Nuevo - El salvador',1,'-1'),
(68, NULL, 'AA.HH San Judas Tadeo Mz-E Lt-1', 'Sunampe',1,'-1'),
(69, NULL, 'AA.HH San Judas Tadeo Mz-E Lt-4', 'Sunampe',1,'-1'),
(70, NULL, 'AA.HH San Judas Tadeo Mz-E Lt-5', 'Sunampe',1,'-1'),
(71, NULL, 'Estadio Cruz blanca', 'Chincha Alta',1,'-1'),
(72, NULL, 'Condorillo alto N°15 primera cuadra', 'Antes de la posta',1,'-1'),
(73, NULL, 'Centro Poblado El Tigre 141', 'Int. O1 - Chincha Alta',1,'-1'),
(74, NULL, 'Calle El Carmen N° 190', 'Cruz blanca',1,'-1'),
(75, NULL, 'Toma de Cala', 'Cruz blanca',1,'-1'),
(76, NULL, 'Psj San Francisco N°111 Int-20', 'Sunampe',1,'-1'),
(77, NULL, 'Condominio San Pablo Mz S/N Lt-2-1', 'Sunampe',1,'-1'),
(78, NULL, 'Av. Victor Raúl Haya de la Torre Lt-2', 'Chacarita - Sunampe - Costado del grifo Green',1,'-1'),
(79, NULL, 'Av. Fátima N°373', 'Sunampe',1,'-1'),
(80, NULL, 'Psj. Santa Rosa S/N', 'Cruz Blanca',1,'-1'),
(81, NULL, 'AA.HH San Valentin Mz-I Lt-12', 'Condorillo bajo',1,'-1'),
(82, NULL, 'Barrio el por venir Psj. San vicente', 'Lt-35 Mz-G - Grocio Prado',1,'-1'),
(83, NULL, 'Psj. Sucre N° 470', 'Espalda de mina de oro',1,'-1'),
(84, NULL, 'Cale el por venir N° 1138 - D', 'Barrio el por venir - Grocio Prado',1,'-1'),
(85, NULL, 'Av. Monterrico #405 - Sunampe', 'Pasando el colegio Simón bolivar',1,'-1'),
(86, NULL, 'Av. Primavera N°300', 'Sunampe',1,'-1'),
(87, NULL, 'HU.CA Santa Teresa S/N', 'Sunampe',1,'-1'),
(88, NULL, 'AA.HH Las flores de mina Mz-A Lt-6', 'Grocio Prado - Mina de oro',1,'-1'),
(89, NULL, 'Calle Victor Haya de la Torre Lt-02', 'Chacarita Sunampe',1,'-1'),
(90, NULL, 'Psj. San Juan Lt-94A', 'Alfonso Ugarte - Sunampe',1,'-1'),
(91, NULL, 'Calle La Palma 114 cercado de grocio prado', 'Toma el carriso',1,'-1'),


INSERT INTO tb_contratos 
(id_cliente, id_paquete, id_sector, id_usuario_registro, id_usuario_tecnico, direccion_servicio, referencia, ficha_instalacion, coordenada, fecha_inicio, fecha_registro, nota) VALUES
(1,   8,  20, 1, NULL, 'Av. Siempre Viva 123, Springfield', 'Cerca de la plaza principal', NULL, '12.3456, -65.4321', '2024-01-15', '2024-01-01', 'Primer contrato: Servicio WISP Básico con 6 meses de duración'),
(2,   9,  20, 1, NULL, 'Calle Falsa 456, Gotham', 'Cerca del cine local', NULL, '34.5678, -76.5432', '2024-02-01', '2024-02-01', 'Renovación de contrato: Fibra + Cable por 6 meses'),
(3,   9,  20, 1, NULL, 'Av. Los Pinos 789, Lima', 'Esquina con Av. Las Flores', NULL, '23.4567, -54.3210', '2024-03-01', '2024-03-01', 'Contrato nuevo: Instalación de Fibra + revisión mensual'),
(4,   10, 20, 1, NULL, 'Jirón de la Unión 100, Lima', 'Frente a la Plaza Mayor', NULL, '45.6789, -43.2109', '2024-04-01', '2024-04-01', 'Renovación anual: Descuento aplicado por contrato anual'),
(5,   8,  20, 1, NULL, 'Calle Mayor 101, Barcelona', 'Cerca del mercado central', NULL, '56.7890, -32.1098', '2024-05-01', '2024-05-01', 'Contrato especial por volumen: Servicio completo por 1 año'),
(6,   8,  20, 1, NULL, 'Av. del Libertador 200, Buenos Aires', 'A la vuelta de la oficina', NULL, '12.0011, -66.1122', '2024-06-01', '2024-06-01', 'Servicio premium incluido en el contrato WISP'),
(7,   9,  20, 1, NULL, 'Calle de la Alegría 333, Bogotá', 'Cerca de la estación de buses', NULL, '34.3333, -76.6666', '2024-07-01', '2024-07-01', 'Contrato por 6 meses: Soporte técnico 24/7 incluido'),
(8,   11, 20, 1, NULL, 'Paseo del Prado 150, Madrid', 'Cerca del parque del Retiro', NULL, '23.8888, -54.7777', '2024-08-01', '2024-08-01', 'Contrato semestral: Mantenimiento semestral incluido'),
(9,   4,  20, 1, NULL, 'Av. de la Paz 400, Santiago', 'Frente al hotel Plaza', NULL, '45.2222, -43.8888', '2024-09-01', '2024-09-01', 'Promoción especial: Contrato de 6 meses con descuento'),
(10,  5,  20, 1, NULL, 'Calle del Comercio 789, Lima', 'Cerca de la Plaza San Martín', NULL, '56.4444, -32.5555', '2024-10-01', '2024-10-01', 'Contrato especial: Condiciones personalizadas aplicadas'),
(11,  2,  20, 1, NULL, 'Av. Principal 111, Quito', 'Frente al centro comercial', NULL, '11.1111, -66.6666', '2024-02-15', '2024-02-15', 'Contrato estándar de WISP con soporte adicional'),
(12,  3,  20, 1, NULL, 'Calle Secundaria 222, Caracas', 'Cerca del parque central', NULL, '22.2222, -55.5555', '2024-03-10', '2024-03-10', 'Contrato de Fibra: Instalación y soporte técnico semestral'),
(13,  4,  20, 1, NULL, 'Av. Terciaria 333, Montevideo', 'Frente al museo histórico', NULL, '33.3333, -44.4444', '2024-04-20', '2024-04-20', 'Renovación de contrato: Instalación de Fibra con soporte anual'),
(14,  5,  20, 1, NULL, 'Jirón Cuarto 444, Lima', 'Esquina con la calle Pinos', NULL, '44.4444, -33.3333', '2024-05-05', '2024-05-05', 'Contrato a medida: Servicio de Fibra + descuento corporativo'),
(15,  1,  20, 1, NULL, 'Calle Final 555, La Paz', 'Cerca del edificio principal', NULL, '55.5555, -22.2222', '2024-06-01', '2024-06-01', 'Contrato nuevo: Servicio WISP básico con soporte trimestral'),
(16,  42, 20, 1, NULL, 'Calle Estrella 111, Lima', 'Cerca de la Plaza de Armas', '{"cable":{"pagoinstalacion":30,"potencia":"-18","triplexor":{"requerido":"true","cargador":" true"},"conector":{"numeroconector":4,"precio":1.5},"spliter":[{"cantidad":2,"tipo":"1x3"}],"cable":{"metrosadicionales":50,"preciometro":1.1},"sintonizadores":[{"numero":1,"marcaModelo":"ASUS","serie":"1234567890"},{"numero":2,"marcaModelo":"ASUS","serie":"1234567890"}]},"costo":{"nap":{"gpon":"-18","catv":"-14"},"casa":{"gpon":"-15","catv":"-14"},"cableCosto":{"numerosintotizadores":2,"costoAlquilerSintotizador":80,"cantidadCable":"50","precioCable":"1.10","precioConector":"1.50","cantidadConector":"4"}}}', '55.5555, -22.2222', '2024-07-01', '2024-07-01', 'Contrato: Servicio WISP básico con soporte técnico mensual'),
(17,  2,  20, 1, NULL, 'Calle Estrella 222, Lima', 'Cerca del Parque Kennedy', NULL, '44.4444, -33.3333', '2024-08-01', '2024-08-01', 'Contrato: Servicio Cable estándar con revisión mensual'),
(18,  3,  20, 1, NULL, 'Calle Estrella 333, Lima', 'Cerca del Parque Universitario', NULL, '33.3333, -44.4444', '2024-09-01', '2024-09-01', 'Contrato: Instalación de Fibra con soporte semestral'),
(19,  9,  20, 1, NULL, 'Calle Estrella 444, Lima', 'Cerca del Centro Comercial', '{"fibraoptica":{"usuario":"VERQUI22","claveacceso":"@VERQUI22","plan":"Soporte 24\/7 para Clientes WISP","potencia":-7,"moden":{"ssid":"FAMILIA","seguridad":"123456","marca":"PHYHOME","serie":"P18","banda":["2G","5G"],"numeroantena":8,"catv":true},"detalles":"","repetidores":[{"numero":1,"ssid":"VERONICA","contrasenia":"123456","marca":"PHYHOME","ip":"192.168.100.20"}]},"cable":{"pagoinstalacion":30,"potencia":"-16","sintonizador":[],"triplexor":{"Cantidad": 1,"requerido":"true","cargador":"true"},"conector":{"numeroconector":4,"precio":1.5},"spliter":[{"cantidad":2,"tipo":"1x3"}],"cable":{"metrosadicionales":50,"preciometro":1.1},"sintonizadores":[{"numero":1,"marcaModelo":"ASUS","serie":"1234567890"}]},"costo":{"pagoAdelantado":"20","descuento":"0","nap":{"gpon":"-13","catv":"-13"},"casa":{"gpon":"-13","catv":"-14"},"cableCosto":{"numerosintotizadores":1,"costoAlquilerSintotizador":40,"cantidadCable":"50","precioCable":"1.10","precioConector":"1.50","cantidadConector":"4"}}}', '22.2222, -55.5555', '2024-10-01', '2024-10-01', 'Contrato: Contratación de Paquete Gpon con cable y fibra'),
(20,  5,  20, 1, NULL, 'Calle Estrella 555, Lima', 'Cerca del Aeropuerto', NULL, '11.1111, -66.6666', '2024-11-01', '2024-11-01', 'Contrato: Servicio especial por volumen, 12 meses');


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
