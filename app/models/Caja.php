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

  public function registrarCaja($params = [])
  {
    $sql = "CALL spu_cajas_registrar(?,?,?,?,?,?)";
    $params = [
      $params['nombre'],
      $params['descripcion'],
      $params['numeroEntradas'],
      $params['idMufa'],
      $params['coordenadas'],
      $params['idUsuario']
    ];
    return $this->registrar($sql, $params);
  }

  public function registrarLinea($params = [])
  {
    $sql = "CALL spu_lineas_registrar(?,?,?)";
    $params = [
      $params['idSector'],
      $params['coordenadas'],
      $params['idUser']
    ];
    return $this->registrar($sql, $params);
  }

  public function descontarEspacioCaja($idContrato)
  {
    $sql = "CALL spu_descontar_espacio_caja(?)";
    $resultado = $this->registrar($sql, [$idContrato]);

    if ($resultado) {
      return ["status" => "success", "message" => "Espacio descontado correctamente"];
    } else {
      return ["status" => "error", "message" => "No se pudo descontar el espacio"];
    }
  }
}


