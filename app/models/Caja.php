<?php

require_once 'Conexion.php';

class Caja extends Conexion
{

  private $pdo;

  public function __construct()
  {
    $this->pdo = Conexion::getConexion();
  }

  /**
   * Listar todas las cajas.
   *
   * Este método ejecuta un procedimiento almacenado para obtener una lista de todas las cajas.
   *
   * @return array Retorna un array con los datos de las cajas.
   */
  public function listarCajas()
  {
    $sql = "CALL spu_cajas_listar";
    return $this->listarDatos($sql);
  }

}