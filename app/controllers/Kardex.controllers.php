<?php

use App\Controllers\Herramientas;

require_once "../models/Kardex.php";
require_once "./Herramientas.php";

$kardex = new Kardex();

if (isset($_POST['operacion'])) {
  switch ($_POST['operacion']) {
    case 'registrarKardex':
      $datos = [
        "idAlmacen"            => Herramientas::sanitizarEntrada($_POST['idAlmacen']),
        "idProducto"            => Herramientas::sanitizarEntrada($_POST['idProducto']),
        "fecha"                 => Herramientas::sanitizarEntrada($_POST['fecha']),
        "idtipoOperacion"         => Herramientas::sanitizarEntrada($_POST['idtipoOperacion']),
        "cantidad"              => Herramientas::sanitizarEntrada($_POST['cantidad']),
        "valorUnitarioHistorico" => Herramientas::sanitizarEntrada($_POST['valorUnitarioHistorico']),
        "idUsuario"             => Herramientas::sanitizarEntrada($_POST["idUsuario"])
      ];
      $estado = $kardex->registrarKardex($datos);
      echo json_encode(["Guardado" => $estado]);
      break;
  }
}

if (isset($_GET["operacion"])) {
  switch ($_GET['operacion']) {
    case 'listarKardex':
      // Obtenemos los parámetros de inicio (start), longitud (length) y búsqueda (search) desde la URL
      $start = isset($_GET['start']) ? (int)$_GET['start'] : 0;
      $length = isset($_GET['length']) ? (int)$_GET['length'] : 10;
      $search = isset($_GET['search']['value']) ? $_GET['search']['value'] : "";

      // Llamamos al método listarKardex con los parámetros obtenidos
      $resultados = $kardex->listarKardex($start, $length, $search);

      // Estructura de la respuesta, similar al formato de listarContratos
      $response = [
        "draw" => isset($_GET['draw']) ? (int)$_GET['draw'] : 1, // Valor para la funcionalidad de DataTables (si usas DataTables en el frontend)
        "recordsTotal" => $resultados['totalRegistros'], // Total de registros sin filtrar
        "recordsFiltered" => $resultados['totalRegistros'], // Total de registros después de aplicar el filtro de búsqueda
        "data" => $resultados['kardex'] // Los registros de la consulta
      ];
      echo json_encode($response);
      break;

    case "buscarStockId":

      $idProducto = Herramientas::sanitizarEntrada($_GET['idProducto']);
      $idAlmacen =  Herramientas::sanitizarEntrada($_GET['idAlmacen']);

      echo json_encode($kardex->buscarStockId(["idProducto" => $idProducto, "idAlmacen" => $idAlmacen]));
      break;

    case "obtenerProducto":
      echo json_encode(["hola" => "mundo"]);
      //echo json_encode($kardex->buscarProductoId(["id_producto" => Herramientas::sanitizarEntrada($_GET['id_producto'])]));
      break;
  }
}
