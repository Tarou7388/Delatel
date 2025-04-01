<?php
require '../../../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);

$dompdf = new Dompdf($options);
date_default_timezone_set('America/Lima');
$fechaActual = date('d/m/Y H:i:s');

$contrato = new Contrato();
$resultado = $contrato->obtenerPDF(["id" => $_GET['id']]);

if (empty($resultado)) {
  echo '<script>alert("No se encontraron registros para el producto seleccionado.");</script>';
  exit;
}

$nombreCliente = $resultado[0]['NombreCliente'];
$nombreArchivo = $nombreCliente . '.pdf';

$nombreArchivo = preg_replace('/[^A-Za-z0-9_\-ñÑ]/', '_', $nombreArchivo);

// Obtener la ficha técnica
$fichaTecnicaJson = $resultado[0]['FichaTecnica'];
$fichaTecnica = json_decode($fichaTecnicaJson, true);

$caja = new Caja();
$cajaid=  intval($fichaTecnica['idcaja']);
$nombrecaja = $caja->cajaBuscar(['idCaja' =>$cajaid])[0]['nombre'];


if (empty($fichaTecnica)) {
  echo '<script>alert("La ficha técnica está vacía."); window.location.href = "../../Contratos/";</script>';
  exit;
}

ob_start();
include 'contenido.php';
include 'estilos.html';
$content = ob_get_clean();

$dompdf->loadHtml($content);
$dompdf->render();

// Obtener el objeto Canvas
$canvas = $dompdf->getCanvas();

// Añadir numeración de páginas en la parte inferior derecha
$canvas->page_text($canvas->get_width() - 100, $canvas->get_height() - 30, "Página {PAGE_NUM} de {PAGE_COUNT}", null, 9, array(0, 0, 0));

// Streaming del PDF
$dompdf->stream($nombreArchivo, array('Attachment' => 0));
