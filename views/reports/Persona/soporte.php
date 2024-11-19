<?php
require '../../../vendor/autoload.php';
require_once '../../../app/models/Contrato.php';

//extensiones de dompdf
use Dompdf\Dompdf;
use Dompdf\Options;

//instancia 
$options = new Options();
$options->set('isRemoteEnabled', true);

//instanciar dompdf
$dompdf = new Dompdf($options);

//fecha y hora actual
date_default_timezone_set('America/Lima');
$fechaActual = date('d/m/Y');
$horaActual = date('H:i:s');

//obtener datos del contrato
$contrato = new Contrato();
$resultado = ($contrato->obtenerPDF(["id" => $_GET['id']]));

//si no se encuentra el contrato
if (empty($resultado)) {
  echo '<script>alert("No se encontraron registros para el producto seleccionado.");</script>';
  exit;
}

//obtener datos del contrato
ob_start();
include 'contenidoPDF.php';
include 'estilosPDF.html';
$content = ob_get_clean();

//nombre del documento
$dompdf->loadHtml($content);
$dompdf->render();
$dompdf->stream("delatel.pdf", array('Attachment' => 0));