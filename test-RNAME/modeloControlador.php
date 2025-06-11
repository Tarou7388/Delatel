<?php

require_once "../app/models/Conexion.php";

class ModeloControlador extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = Conexion::getConexion();
  }
}

$objeto = new ModeloControlador();

if (isset($_GET["operacion"])) {
  $operacion = $_GET["operacion"];
  switch ($operacion) {
    case "buscarPersonaPaquete":
      $sql = "SELECT * FROM vw_clientes_contratos WHERE nombre_completo LIKE ?";
      $params = ["%" . $_GET["nombre"] . "%"];
      $resultado = $objeto->consultaParametros($sql, $params);
      echo json_encode($resultado);
      break;
    case "buscarPaquete":
      $sql = "SELECT * FROM vw_clientes_paquetes WHERE paquete LIKE ? LIMIT 10";
      $params = ["%" . $_GET["nombre"] . "%"];
      $resultado = $objeto->consultaParametros($sql, $params);
      echo json_encode($resultado);
      break;
    case "buscarPersonaCliente":
      $sql = "SELECT * FROM vw_clientes_personas_nombres WHERE nombre_completo LIKE ?";
      $params = ["%" . $_GET["nombre"] . "%"];
      $resultado = $objeto->consultaParametros($sql, $params);
      echo json_encode($resultado);
      break;
  }
}
