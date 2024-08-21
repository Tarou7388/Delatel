<?php

/* Cargar la librerías */
require_once '../../vendor/autoload.php';


/* Espacios de nombres */
use Spipu\Html2Pdf\Html2Pdf;
use Spipu\Html2Pdf\Exception\Html2PdfException;
use Spipu\Html2Pdf\Exception\ExceptionFormatter;

try {
    ob_start();

    //include dirname(__FILE__).'/res/example08.php';
    //Contenido (archivos externos)
    //Estilos
    require_once './estilos.html';

    //Plantilla
    require_once './Contenido.php';

    $content = ob_get_clean();
    
    //Configuración PDF
    /* $html2pdf = new Html2Pdf('P|L', 'A4', 'fr', true, 'UTF-8', array(márgenes)); */

    $html2pdf = new Html2Pdf('P', 'A4', 'es', true, 'UTF-8', array(15,15,15,15));
    $html2pdf->writeHTML($content);
    $html2pdf->output('PDF-Generado-PHP.pdf');
} catch (Html2PdfException $e) {
    $html2pdf->clean();
    $formatter = new ExceptionFormatter($e);
    echo $formatter->getHtmlMessage();
}