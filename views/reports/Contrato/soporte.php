<?php
require '../../../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);

$dompdf = new Dompdf($options);

ob_start();
include 'contenidoPDF.php';
include 'estilosPDF.html';

/* require_once '../models/Contrato.php';

$contrato = new Contrato();
$resultado = ($contrato->buscarId(["id" => $_GET['id']]));

$idContrato = $resultado['id_contrato'];
$fechaInicio = $resultado['fecha_inicio'];
$fechaFin = $resultado['fecha_fin'];
$nombreCliente = $resultado['nombre_cliente'];
$nombreServicio = $resultado['nombre_servicio'];
$nombreUsuarioRegistro = $resultado['nombre_usuario_registro'];
$nombreUsuarioTecnico = $resultado['nombre_usuario_tecnico'];
$direccionServicio = $resultado['direccion_servicio'];
$servicio = $resultado['servicio'];
$nombreSector = $resultado['nombre_sector'];
$referencia = $resultado['referencia'];
$numIdentificacion = $resultado['num_identificacion']; */


$content = ob_get_clean();
$dompdf->loadHtml($content);
$dompdf->render();
$dompdf->stream("delatel.pdf", array('Attachment' => 0));
