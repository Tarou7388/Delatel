<?php
require '../../../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

// Configurar opciones de Dompdf
$options = new Options();
$options->set('isRemoteEnabled', true);
$dompdf = new Dompdf($options);

date_default_timezone_set('America/Lima');
$fechaActual = date('d/m/Y');

// Obtener datos del Kardex
$kardex = new Kardex();
$resultado = $kardex->totalProductosKardex();

if (empty($resultado)) {
    die('<script>alert("No se pudo cargar los datos");</script>');
}

// Generar nombre del archivo
$nombreArchivo = "Listado_Kardex_" . date('Ymd_His') . ".pdf";

// Capturar contenido del HTML
ob_start();
include 'contenido.php';
include 'estilos.html';
$content = ob_get_contents();
ob_end_clean();

if (empty($content)) {
    die('<script>alert("Error al generar el contenido del PDF.");</script>');
}

// Generar PDF
$dompdf->setPaper('A4', 'landscape');
$dompdf->loadHtml($content);
$dompdf->render();

// Obtener objeto Canvas para añadir paginación
$canvas = $dompdf->getCanvas();
$canvas->page_text($canvas->get_width() - 90, $canvas->get_height() - 30, "Página {PAGE_NUM} de {PAGE_COUNT}", null, 9, array(0, 0, 0));

// Mostrar el PDF en el navegador sin descarga automática
$dompdf->stream($nombreArchivo, array('Attachment' => false));
?>
