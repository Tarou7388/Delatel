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

/**
 * Normaliza la ficha técnica para que tenga la misma estructura,
 * sin importar si viene de soporte o de contrato.
 * Si falta una sección en soporte, la completa con los datos de contrato.
 */
function normalizarFichaTecnica($ficha, $fichaContrato = null) {
    // Si viene de soporte (estructura anidada)
    if (isset($ficha['cabl']) || isset($ficha['fibr'])) {
        $cable = isset($ficha['cabl']['cambioscable']) ? $ficha['cabl']['cambioscable'] : ($fichaContrato['cable'] ?? []);
        $fibraoptica = isset($ficha['fibr']['cambiosgpon']) ? $ficha['fibr']['cambiosgpon'] : ($fichaContrato['fibraoptica'] ?? []);
        $costo = isset($ficha['cabl']['cambioscable']['costo']) ? $ficha['cabl']['cambioscable']['costo'] : ($fichaContrato['costo'] ?? []);
        return [
            'idcaja' => $ficha['idcaja'] ?? ($fichaContrato['idcaja'] ?? null),
            'puerto' => $ficha['puerto'] ?? ($fichaContrato['puerto'] ?? null),
            'periodo' => $ficha['periodo'] ?? ($fichaContrato['periodo'] ?? null),
            'vlan' => $ficha['vlan'] ?? ($fichaContrato['vlan'] ?? null),
            'cable' => $cable,
            'fibraoptica' => $fibraoptica,
            'costo' => $costo,
        ];
    }
    // Si viene de contrato (estructura plana)
    return [
        'idcaja' => $ficha['idcaja'] ?? null,
        'puerto' => $ficha['puerto'] ?? null,
        'periodo' => $ficha['periodo'] ?? null,
        'vlan' => $ficha['vlan'] ?? null,
        'cable' => $ficha['cable'] ?? [],
        'fibraoptica' => $ficha['fibraoptica'] ?? [],
        'costo' => $ficha['costo'] ?? [],
    ];
}

// Intentamos obtener soporte primero
$resultado = $soporte->ultimoSoporteIdContrato(["idContrato" => $_GET['id']]);

// Si no hay soporte, usamos los datos del contrato
if (empty($resultado)) {
    $resultado = $contrato->obtenerPDF(["id" => $_GET['id']]);
}

// Obtener la ficha técnica del contrato para usar como respaldo
$resultadoContrato = $contrato->obtenerPDF(["id" => $_GET['id']]);
$fichaTecnicaContratoRaw = json_decode($resultadoContrato[0]['FichaTecnica'], true);

// Obtener la ficha técnica principal
$fichaTecnicaJson = $resultado[0]['FichaTecnica'];
$fichaTecnicaRaw = json_decode($fichaTecnicaJson, true);
$fichaTecnica = normalizarFichaTecnica($fichaTecnicaRaw, $fichaTecnicaContratoRaw);

$nombreCliente = $resultado[0]['NombreCliente'];
$nombreArchivo = $nombreCliente . '.pdf';

$nombreArchivo = preg_replace('/[^A-Za-z0-9_\-ñÑ]/', '_', $nombreArchivo);

$caja = new Caja();
$cajaid = intval($fichaTecnica['idcaja']);
$nombrecaja = 'Sin caja asignada';

if ($cajaid > 0) {
  $resultadoCaja = $caja->cajaBuscar(['idCaja' => $cajaid]);
  if (!empty($resultadoCaja)) {
    $nombrecaja = $resultadoCaja[0]['nombre'];
  }
}

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