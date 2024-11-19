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
$horaActual = date('H:i:s');

$contrato = new Contrato();
$resultado = ($contrato->obtenerPDF(["id" => $_GET['id']]));

if (empty($resultado)) {
  echo '<script>alert("No se encontraron registros para el producto seleccionado.");</script>';
  exit;
}

ob_start();
include 'contenidoPDF.php';
include 'estilosPDF.html';
$content = ob_get_clean();

$dompdf->loadHtml($content);
$dompdf->render();
$dompdf->stream("delatel.pdf", array('Attachment' => 0));