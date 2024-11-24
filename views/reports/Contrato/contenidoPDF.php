<?php
$HOST = "http://localhost/DELATEL/";
?>

<table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
  <colgroup>
    <col style="width: 50%;">
    <col style="width: 50%;">
  </colgroup>
  <thead></thead>
  <tbody>
    <tr>
      <!-- Primer Contenedor -->
      <td style="vertical-align: top; padding-right: 5px;">
        <table>
          <colgroup>
            <col style="width: 50%;">
            <col style="width: 50%;">
          </colgroup>
          <thead></thead>
          <tbody>
            <tr>
              <td><img src="<?= $HOST; ?>image/Logo_Empresa_Delatel.svg" class="logo" alt="Logo"></td>
              <td>
                <h3 style="margin: 10px 0; flex-grow: 1;">CONTRATO DE PRESTACIÓN DEL SERVICIO DE ACCESO A INTERNET FIJO POSTPAGO</h3>
              </td>
            </tr>
          </tbody>
        </table>

        <h3>Reporte Generado el día: <?= $fechaActual; ?></h3>

        <h4><img src="<?= $HOST; ?>image/iconoLista.png" class="icono" alt=""> 1) ¿QUÉ ESTÁS CONTRATANDO?</h4>
        <p><strong>DELAFIBER (DELATEL PERU)</strong>, con domicilio en Calle San Jose 103 – Grocio Prado - Chincha – Ica con RUC; se compromete a prestar el Servicio de acceso a internet fijo Postpago</p>

        <h4><img src="<?= $HOST; ?>image/iconoUsuario.png" class="icono" alt=""> 2) DATOS DEL ABONADO</h4>
        <p><b>Nombre / Razón Social:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['NombreCliente']; ?></span></p>
        <p><b>Tipo y Número de documento de Identificación:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['NumeroDocumento']; ?></span></p>
        <p><b>Nacionalidad:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['Nacionalidad']; ?></span></p>
        <p><b>Representante legal o apoderado:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['RepresentanteLegal']; ?></span></p>
        <!-- <p>Tipo y número de documento de identificación <br> del representante legal o apoderado:</p>
        <p><span class="caja-texto2"></span></p> -->
        <p><b>Correo electrónico:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['Correo']; ?></span></p>
        <p><b>Número de contacto:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['Telefono']; ?></b></span></p>
        <p><b>Dirección de Instalación:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['DireccionContrato']; ?></span></p>
        <p><b>Dirección de Facturación:</b></p>
        <p><span class="caja-texto2"><?= $resultado[0]['DireccionPersona']; ?></span></p>

        <br>
        <h4><img src="<?= $HOST; ?>image/iconoCelular.png" class="icono" alt=""> 3) SERVICIO CONTRATADO</h4>
        <p><b>Código de cliente:</b> <?= $resultado[0]['IdCliente']; ?></p>
        <p><b>Nombre del Plan tarifario:</b> <?= $resultado[0]['NombrePaquete']; ?></p>
        <p><b>Detalle del Servicio:</b> <?= $resultado[0]['nota']; ?></p>
        <strong class="radio">Nuevo Servicio <input type="checkbox" class="check"></strong>
        <strong class="radio">Recurrente <input type="checkbox" class="check" checked></strong>

      </td>

      <!-- Segundo Contenedor -->
      <td style="vertical-align: top; padding-left: 5px;">
        <h4><img src="<?= $HOST; ?>image/iconoLupa.png" class="icono" alt=""> 4) ¿QUÉ DEBES SABER DE TU PLAN?</h4>
        <p>Renta Fija: $/. <?= $resultado[0]['PrecioPaquete']; ?></p>
        <p>El pago se realiza por: </p>
        <strong class="radio">Mes Vencido <input type="checkbox" class="check"></strong>
        <strong class="radio">Mes Adelantado <input type="checkbox" class="check" checked></strong>
        <p>Costo de reconexión por falta de pago: <span class="caja-texto"></span></p>
        </p>
        <p>Último día de pago: <span class="caja-texto"></span></p>
        </p>
        <p>¿Existe plazo de permanencia?</p>
        <strong class="radio"><input type="checkbox" class="check" checked> Sí, 6 meses</strong>
        <strong class="radio"><input type="checkbox" class="check"> No</strong>
        <strong class="radio">Tarifa de Instalación:</strong>
        <p>Al contado: S/.<span class="caja-texto"></span></p>

        <h4 class="tltplan"><img src="<?= $HOST; ?>image/iconoCheckBlanco.png" class="icono" alt=""> 5) ¿QUÉ INCLUYE TU PLAN?</h4>
        <p>- Los precios incluyen IGV</p>
        <p>- Velocidad del Internet fijo:</p>
        <p>- La Velocidad mínima garantizada es el 70% de la Velocidad Máxima</p>
        <table class="tabla" style="width: 100%; border-collapse: collapse;">
          <colgroup>
            <col style="width: 50%;">
            <col style="width: 50%;">
          </colgroup>
          <thead>
            <tr class="bg-info tex-light">
              <th colspan="2" class="text-center">Bajada (Descarga) Mbp/s <img src="<?= $HOST; ?>image/iconoFlechaAbajo.png" class="icono" alt=""> </th>
              <th colspan="2" class="text-center">Subida (Carga) Mbp/s <img src="<?= $HOST; ?>image/iconoFlechaArriba.png" class="icono" alt=""></th>
            </tr>
          </thead>
          <tbody>
            <tr style="border: 1px solid #fff;">
              <td style="border: 1px solid #fff;" class="text-center">Máxima</td>
              <td style="border: 1px solid #fff;" class="text-center">Mínima Garantizada</td>
              <td style="border: 1px solid #fff;" class="text-center">Máxima</td>
              <td style="border: 1px solid #fff;" class="text-center">Mínima Garantizada</td>
            </tr>
            <tr style="border: 1px solid #fff;">
              <td style="border: 1px solid #fff;" class="input text-center"><?= $velocidadPaquete['bajada']['maxima']; ?></td>
              <td style="border: 1px solid #fff;" class="input text-center"><?= $velocidadPaquete['bajada']['minima_garantizada']; ?></td>
              <td style="border: 1px solid #fff;" class="input text-center"><?= $velocidadPaquete['subida']['maxima']; ?></td>
              <td style="border: 1px solid #fff;" class="input text-center"><?= $velocidadPaquete['subida']['minima_garantizada']; ?></td>
            </tr>
          </tbody>
        </table>

        <p>- El servicio contratado es simétrico (la misma para la subida y la bajada).</p>
        <p>- El Ancho de banda mínimo asegurado se mide mediante cable Ethernet.</p>
        <p>- La velocidad de transmisión y acceso estará en función a la capacidad y correcta configuración, así como también al buen funcionamiento de todos los dispositivos del cliente.</p>
        <p>- El Cliente podrá conectarse a Internet de manera inalámbrica (WIFI) y alámbrica (LAN). Se recomienda hacer el test de velocidad con un cable directo y sin ningún equipo conectado para ver la capacidad total contratada.</p>
        <p>- Costo por reconexión: S/.10.00</p>

      </td>
    </tr>


    <tr>
      <td style="vertical-align: top; padding-right: 5px;">
        <h4><img src="<?= $HOST; ?>image/iconoHerramienta.png" class="icono" alt=""> 6) INSTALACIÓN DEL SERVICIO</h4>
        <p>En caso el servicio requiera de instalación, se realiza en el plazo máximo de 15 días hábiles desde la contratación, previa coordinación con el cliente.</p>
        <h4><img src="<?= $HOST; ?>image/iconoBoleta.png" class="icono" alt=""> 7) RECIBO Y PAGO DEL SERVICIO</h4>
        <p>- Tu recibo incluye la facturación de: a) Cargo fijo según tu plan tarifario contratado, b) Consumos adicionales y/o c) Servicios adicionales y equipos adquiridos, de ser el caso.</p>
        <p>- Tus recibos serán emitidos mensualmente por mensajería de acuerdo al plan contratado.</p>
        <p>- Debes efectuar los pagos o cargos por la prestación del servicio, hasta la fecha de vencimiento indicada de tu servicio en los lugares de pago y/o formas de pagos brindado.</p>
        <p>- Si no pagas a tiempo tu recibo o realizas un pago parcial, podría cobrar intereses y tu servicio será suspendido, en cuyo caso podrías pagar un monto por reconexión ya establecido.</p>

        <h4><img src="<?= $HOST; ?>image/iconoExclamacion.png" class="icono" alt=""> 8) DERECHOS Y OBLIGACIONES</h4>
        <p>- En la sección “Información Abonados y Usuarios” de la página web delatelperu/información-abonados encontrarás información sobre tus derechos, el procedimiento de reclamo, casos de uso indebido, indicadores de calidad de DELATEL y otros.</p>
        <p>- Eres responsable por el uso del servicio la cual no se puede comercializar, ni usarlo indebidamente.</p>
        <p>- Si se detecta que empleas el servicio para fines ilícitos o presentaste información falsa, DELATEL podrá suspender el servicio y/o terminar este contrato.</p>
        <p>- Debes permitir al personal de DELATEL, el ingreso a tu domicilio para la instalación, verificación o reparación del servicio, así como el retiro de los equipos si fuera el caso.</p>

      </td>
      <td style="vertical-align: top; padding-left: 5px;">
        <p>- Se te entregara los equipos de comunicación en perfecto estado y se compromete a devolver en las mismas condiciones, salvo el desgaste que el uso normal del tiempo.</p>
        <p>- Si el equipo se daña por descuido del usuario como son: golpes, caída de agua, cortó circuito y/o manipulaciones EL ARRENDATARIO asumirá el costo de la reparación y/o la totalidad del equipo.</p>
        <h4><img src="<?= $HOST; ?>image/iconoRegistro.png" class="icono" alt=""> 9) MODIFICACIÓN DEL CONTRATO</h4>
        <p>- DELATEL solo podrá modificar este contrato por: a) Aumento o reducción de las tarifas y/o atributos del servicio como datos, velocidad y/u otros y b) Aumento de beneficios.</p>
        <p>- Previamente al aumento de tarifas y/o reducción de atributos del servicio, la empresa te remitirá una comunicación (llamadas telefónicas, mensajes de texto, audio u otros). Si no estás de acuerdo, podrás solicitar la terminación de este contrato sin pago de penalidades, ni cobros similares, aún en caso te encuentres dentro del plazo forzoso.</p>
        <p>- Usted no podrá traspasar este contrato ni sub-arrendar todos y/o algunos de los equipos de comunicación en materia del presente del contrato.</p>
        <h4><img src="<?= $HOST; ?>image/iconoDislike.png" class="icono" alt=""> 10) BAJA DE TU SERVICIO</h4>
        <p>Si deseas dar por terminado este contrato, puedes solicitarlo a DELATEL y la baja se ejecutará en un plazo máximo de 5 días hábiles. También podrás indicar la fecha en la cual requieres la ejecución de la baja, con 1 mes de anticipación.</p>

        <table class="tabla">
          <colgroup>
            <col style="width: 50%;">
            <col style="width: 50%;">
          </colgroup>
          <thead>
            <tr>
              <th class="text-center" colspan="2"><img src="<?= $HOST; ?>image/iconoTelefono.png" class="icono" alt="">11) COMUNICATE CON DELATEL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">Canal Telefónico</td>
              <td class="text-center">948 629 625</td>
            </tr>

            <tr>
              <td class="text-center">Página Web</td>
              <td class="text-center">www.delatel.com</td>
            </tr>
            <tr>
              <td class="text-center">Correo</td>
              <td class="text-center">Ventasdt@delatel.com</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>



    <tr>
      <td style="vertical-align: top; padding-left: 5px;">
        <h4><img src="<?= $HOST; ?>image/iconoUsuario.png" class="icono" alt=""> 12) USO DE TUS DATOS PERSONALES</h4>
        <p><strong>DELATEL realiza el tratamiento de tus datos personales </strong>para la ejecución y prestación del servicio.
          Para ello, debe informarte sobre las condiciones para el tratamiento de tus datos personales y debe solicitar tu consentimiento
          para enviarte información comercial, publicidad u otra finalidad.
        </p>

        <h4><img src="<?= $HOST; ?>image/iconoCheck.png" class="icono" alt=""> 13) ACEPTACIÓN DEL CONTRATO</h4>
        <p>
          La aceptación de este contrato se realizará con la firma manuscrita del presente documento, al obtener la información biométrica
          de tu huella dactilar o mediante otro tipo de firma digital en la versión digital del presente contrato. <strong>La cartilla y anexo
            adjunto forma parte del contrato.</strong>
        </p>
        <br>
        <p><strong>Fecha del Contrato:</strong> <?= $resultado[0]['FechaCreacion']; ?></p>

        <br>
        <br>
        <br>
        <br>
        <table>
          <colgroup>
            <col style="width: 50%;">
            <col style="width: 50%;">
          </colgroup>
          <thead>
          </thead>
          <tbody>
            <tr>
              <td>
                <p class="label" style="margin-left: 25px;">_______________</p>
              </td>
              <td>
                <p class="label" style="margin-left: 25px;">_______________</p>
              </td>
            </tr>
            <tr>
              <td>
                <p class="label" style="margin-left: 25px;">DELATEL</p>
              </td>
              <td>
                <p class="label" style="margin-left: 25px;">ABONADO</p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>

      <td style="vertical-align: top; padding-left: 5px;">

        <table class="tabla">
          <colgroup>
            <col style="width: 100%;">
          </colgroup>
          <thead>
            <tr class="bg-info tex-light">
              <th class="text-center" colspan="1">ANEXO - CONTENIDO ADICIONALES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="contenido-anexo">
                <strong>SECCIÓN.-</strong>
                <p>
                  La instalación será realizada por Fibra Óptica hasta el equipo emisor a instalar, Instalación no comprende canalizado interno.
                  El servicio comprende modem óptico – WIFI (calidad de comodato).
                  La facturación iniciará finalizada la instalación y al día siguiente de firmada en el acta de conformidad.
                  Se brindará el servicio de soporte de manera remota 24 x 7 llamando al NOC 7480600
                  Las configuraciones se podrán hacer vía online de acuerdo con el requerimiento.
                </p>
                <strong>EQUIPOS.-</strong>
                <p>
                  Los Equipos te serán entregados en Comoda- to, debiendo proceder a la devolución de los mismos una vez concluido el presente Contrato,
                  sin más deterioro que el uso normal del mismo. La devolución la deberá realizar previa coordinación con los técnicos y/o personal autorizado
                  de la empresa.
                </p>

                <strong>PENALIDADES APLICABLES</strong>
                <p>
                  En caso el Cliente opte por la contratación del Servicio a plazo forzoso y decida poner término al presente Contrato con anterioridad
                  a su fecha de vencimiento, DELATEL podrá requerir el pago de una penalidad equivalente a la contraprestación mensual de los cargos fijos
                  vigentes multiplicados por el número de meses que falten para que venza dicho plazo forzoso.
                </p>

                <strong>OTRO EJEMPLO:</strong>
                <p>
                  Si por causas no atribuibles a DELATEL, hubieras contratado a plazo forzoso y decidieras resolver el contrato durante su vigencia,
                  o si DELATEL lo resolviera por falta de pago, siguiendo el procedimiento establecido en el artículo 75° de las Condiciones de Uso,
                  deberás abonar por concepto de penalidad el equivalente a las mensualidades dejadas de pagar.
                  EL CLIENTE no podrá ceder sus derechos u obligaciones contractuales, sin el consentimiento previo, expreso y por escrito de DELATEL.
                  DELATEL, podrá ceder su posición contractual o cualquiera de sus derechos u obligaciones, durante la vigencia del presente Contrato.
                  Para ello, EL CLIENTE otorga, de manera anticipada, su conformidad.
                </p>
              </td>
            </tr>
          </tbody>
        </table>

      </td>
    </tr>

  </tbody>

</table>