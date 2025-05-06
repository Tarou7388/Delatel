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
$caja = new Caja();
$soporte = new Soporte();

// Obtener datos del soporte o contrato
$resultado = $soporte->ultimoSoporteIdContrato(["idContrato" => $_GET['id']]);
if (empty($resultado)) {
    $resultado = $contrato->obtenerPDF(["id" => $_GET['id']]);
}

$nombreCliente = $resultado[0]['NombreCliente'];
$nombreArchivo = preg_replace('/[^A-Za-z0-9_\-ñÑ]/', '_', $nombreCliente) . '.pdf';

// Decodificar Ficha Técnica
$fichaTecnicaRaw = $resultado[0]['FichaTecnica'];
$fichaTecnica = json_decode($fichaTecnicaRaw, true);

// Normalizar si es formato antiguo
if (isset($fichaTecnica['fibraoptica']) && !isset($fichaTecnica['fibr'])) {
    $fibra = $fichaTecnica['fibraoptica'];
    $fichaTecnica['fibr']['parametrosgpon'] = [
        'pppoe' => $fibra['usuario'],
        'clave' => $fibra['claveacceso'],
        'potencia' => $fibra['potencia'],
        'router' => $fibra['router'],
        'repetidores' => $fibra['repetidores'] ?? [],
        'catv' => $fibra['router']['catv'] ?? false,
    ];
    $fichaTecnica['idcaja'] = $fichaTecnica['idcaja'] ?? 0;
    $fichaTecnica['vlan'] = $fichaTecnica['vlan'] ?? '';
}

// Validar que ficha técnica no esté vacía
if (empty($fichaTecnica)) {
    echo '<script>alert("La ficha técnica está vacía."); window.location.href = "../../Contratos/";</script>';
    exit;
}

// Buscar caja si existe id
$cajaid = intval($fichaTecnica['idcaja'] ?? 0);
$nombrecaja = 'Sin caja asignada';

if ($cajaid > 0) {
    $resultadoCaja = $caja->cajaBuscar(['idCaja' => $cajaid]);
    if (!empty($resultadoCaja)) {
        $nombrecaja = $resultadoCaja[0]['nombre'];
    }
}

// Incluir contenido HTML y estilos para PDF
ob_start();
include 'contenido.php';  // Aquí deberías usar los datos de $fichaTecnica ya normalizados
include 'estilos.html';
$content = ob_get_clean();

if ($content === false) {
    echo '<script>alert("Error al generar el contenido del PDF.")</script>';
    exit;
}

$dompdf->loadHtml($content);
$dompdf->render();

// Agregar número de páginas
$canvas = $dompdf->getCanvas();
$canvas->page_text(50, 30, "Página {PAGE_NUM} de {PAGE_COUNT}", null, 9, array(0, 0, 0));

// Mostrar PDF en el navegador (sin descargar)
$dompdf->stream($nombreArchivo, array('Attachment' => 0));
