<?php
require '../../../vendor/autoload.php';
require_once '../../../app/models/Cliente.php';
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


//obtener datos del contrato
$cliente = new Cliente();
$resultado = ($cliente->buscarClientebyId(["id" => $_GET['id']]));

//si no se encuentra el contrato
if (empty($resultado)) {
  echo '<script>alert("No se encontraron registros para el producto seleccionado.");</script>';
  exit;
} 

$nombreCliente = $resultado[0]['nombre_cliente'];
$nombreArchivo = $nombreCliente . '.pdf';
$nombreArchivo = preg_replace('/[^A-Za-z0-9_\-ñÑ]/', '_', $nombreArchivo);

//obtener datos del contrato
ob_start();
include 'clientes.php';
include 'estilos.html';
$content = ob_get_clean();

if ($content === false) {
  echo '<script>alert("Error al generar el contenido del PDF.");</script>';
  exit;
}

$dompdf->loadHtml($content);
$dompdf->render();
$dompdf->stream($nombreArchivo, array('Attachment' => 0));
?>