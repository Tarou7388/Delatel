<?php
require '../../../vendor/autoload.php';
require_once '../../../app/models/Contrato.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);

$dompdf = new Dompdf($options);

date_default_timezone_set('America/Lima');
$fechaActual = date('d/m/Y');

$contrato = new Contrato();
$resultado = $contrato->obtenerPDF(["id" => $_GET['id']]);

if (empty($resultado)) {
  echo '<script>alert("No se encontraron registros para el producto seleccionado.");</script>';
  exit;
}

$nombreCliente = $resultado[0]['NombreCliente'];
$nombreArchivo = $nombreCliente . '.pdf';

$nombreArchivo = preg_replace('/[^A-Za-z0-9_\-ñÑ]/', '_', $nombreArchivo);

$velocidadPaqueteJson = $resultado[0]['VelocidadPaquete'];
$velocidadPaquete = json_decode($velocidadPaqueteJson, true);

ob_start();
include 'contenidoPDF.php';
include 'estilosPDF.html';
$content = ob_get_clean();

if ($content === false) {
  echo '<script>alert("Error al generar el contenido del PDF.");</script>';
  exit;
}

$dompdf->loadHtml($content);
$dompdf->render();
$dompdf->stream($nombreArchivo, array('Attachment' => 0));
?>