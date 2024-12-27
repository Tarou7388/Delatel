<?php
require '../../../vendor/autoload.php';
require '../../../app/models/Soporte.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);

$dompdf = new Dompdf($options);
date_default_timezone_set('America/Lima');
$fechaActual = date('d/m/Y');

$soporte = new Soporte();
$resultado = $soporte->obtenerPDFSoporte(["idSoporte" => $_GET['idSoporte']]);

ob_start();
include 'averiaGpon.php';
include 'estilos.html';
$content = ob_get_clean();

$dompdf->loadHtml($content);
$dompdf->render();
$dompdf->stream("delatel.pdf", array('Attachment' => 0));
?>