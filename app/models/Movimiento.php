<?php
require_once 'Conexion.php';

class Movimiento extends Conexion
{
  private $pdo;
  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function filtroOperaciones($params = [])
  {
    $sql = "CALL spu_listar_tipo_operacion(?)";
    $values = array($params['movimiento']);
    return $this->consultaParametros($sql, $values);
  }
}
