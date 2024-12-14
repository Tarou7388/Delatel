<?php
require '../../../vendor/autoload.php';

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

// Obtener la ficha técnica
$fichaTecnicaJson = $resultado[0]['FichaTecnica'];
$fichaTecnica = json_decode($fichaTecnicaJson, true);

if (empty($fichaTecnica)) {
  echo '<script>alert("La ficha técnica está vacía."); window.location.href = "../../Contratos/";</script>';
  exit;
}

ob_start();
include 'instalacionWisp.php';
include 'estilos.html';
$content = ob_get_clean();

if ($content === false) {
  echo '<script>alert("Error al generar el contenido del PDF.");</script>';
  exit;
}

$dompdf->loadHtml($content);
$dompdf->render();

// Obtener el objeto Canvas
$canvas = $dompdf->getCanvas();

// Añadir numeración de páginas en la cabecera a la izquierda
$canvas->page_text(33, 30, "Página {PAGE_NUM} de {PAGE_COUNT}", null, 9, array(0, 0, 0));

$dompdf->stream($nombreArchivo, array('Attachment' => 0));
?>