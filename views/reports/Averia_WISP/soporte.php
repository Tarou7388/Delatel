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

$nombreCliente = $resultado[0]['NombreCliente'];
$nombreArchivo = $nombreCliente . '.pdf';

$nombreArchivo = preg_replace('/[^A-Za-z0-9_\-ñÑ]/', '_', $nombreArchivo);

// Decodificar el JSON anidado en FichaAveria
if (isset($resultado[0]['FichaAveria'])) {
  $resultado[0]['FichaAveria'] = json_decode($resultado[0]['FichaAveria'], true);
}

ob_start();
include 'averiaWisp.php';
include 'estilos.html';
$content = ob_get_clean();

$dompdf->loadHtml($content);
$dompdf->render();

// Obtener el objeto Canvas
$canvas = $dompdf->getCanvas();

// Añadir numeración de páginas en la cabecera a la izquierda
$canvas->page_text(50, 30, "Página {PAGE_NUM} de {PAGE_COUNT}", null, 9, array(0, 0, 0));

$dompdf->stream($nombreArchivo, array('Attachment' => 0));
