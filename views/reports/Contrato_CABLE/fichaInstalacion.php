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

// Intentamos obtener soporte primero
$resultado = $soporte->ultimoSoporteIdContrato(["idContrato" => $_GET['id']]);

// Si no hay soporte, usamos los datos del contrato
if (empty($resultado)) {
    $resultado = $contrato->obtenerPDF(["id" => $_GET['id']]);
}

$nombreCliente = $resultado[0]['NombreCliente'];
$nombreArchivo = preg_replace('/[^A-Za-z0-9_\-ñÑ]/', '_', $nombreCliente) . '.pdf';

$velocidadPaqueteJson = $resultado[0]['VelocidadPaquete'];
$velocidadPaquete = json_decode($velocidadPaqueteJson, true);

// Obtener la ficha técnica
$fichaTecnicaJson = $resultado[0]['FichaTecnica'];
$fichaTecnica = json_decode($fichaTecnicaJson, true);

// 🚧 Normalizar estructura si proviene de soporte técnico
if (isset($fichaTecnica['cabl']['cambioscable'])) {
    $datosCable = $fichaTecnica['cabl']['cambioscable'];

    $fichaTecnica['cable'] = [
        'periodo' => $fichaTecnica['periodo'] ?? '',
        'pagoinstalacion' => $datosCable['costo']['pagoinstalacion'] ?? '', // Puedes personalizar si quieres incluir este valor
        'potencia' => $datosCable['potencia'] ?? '',
        'triplexor' => [
            'requerido' => $datosCable['triplexor'] ?? 'N/A',
            'cargador' => 'N/A'
        ],
        'conector' => $datosCable['conector'] ?? [],
        'splitter' => $datosCable['splitter'] ?? [],
        'cable' => $datosCable['cable'] ?? [],
        'sintonizadores' => $datosCable['sintonizadores'] ?? []
    ];

    $fichaTecnica['costo'] = $datosCable['costo'] ?? [];

    // Asegurar idcaja y puerto
    $fichaTecnica['idcaja'] = isset($fichaTecnica['idcaja']) ? intval($fichaTecnica['idcaja']) : 0;
    $fichaTecnica['puerto'] = isset($fichaTecnica['puerto']) ? intval($fichaTecnica['puerto']) : 0;
}

// Validar si hay ficha técnica
if (empty($fichaTecnica)) {
    echo '<script>alert("La ficha técnica está vacía."); window.location.href = "../../Contratos/";</script>';
    exit;
}

// Buscar nombre de la caja
$cajaid = intval($fichaTecnica['idcaja']);
$nombrecaja = 'Sin caja asignada';

if ($cajaid > 0) {
    $resultadoCaja = $caja->cajaBuscar(['idCaja' => $cajaid]);
    if (!empty($resultadoCaja)) {
        $nombrecaja = $resultadoCaja[0]['nombre'];
    }
}

// Generar PDF
ob_start();
include 'contenido.php';
include 'estilos.html';
$content = ob_get_clean();

$dompdf->loadHtml($content);
$dompdf->render();

// Añadir numeración de página
$canvas = $dompdf->getCanvas();
$canvas->page_text(50, 30, "Página {PAGE_NUM} de {PAGE_COUNT}", null, 9, array(0, 0, 0));

// Mostrar PDF en navegador (no descargar automáticamente)
$dompdf->stream($nombreArchivo, array('Attachment' => 0));
