<?php
require './vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

$options = new Options();
$options->set('isRemoteEnabled', true);

$dompdf = new Dompdf($options);

ob_start();
include 'averiaWisp.php';
include 'estilos.html';
$content = ob_get_clean();

$dompdf->loadHtml($content);
$dompdf->render();
$dompdf->stream("delatel.pdf", array('Attachment' => 0));
?>
