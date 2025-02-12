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
      $params['idSector'],
      $params['coordenadas'],
      $params['idUsuario']
    ];
    return $this->registroValorDevolvido($sql, $params);
  }

  public function registrarLinea($params = [])
  {
    $sql = "CALL spu_lineas_registrar(?,?,?,?,?)";
    $params = [
      $params['idMufa'],
      $params['idCaja'],
      $params['coordenadas'],
      $params['tipoLinea'],
      $params['idUser']
    ];
    return $this->registrar($sql, $params);
  }

  public function descontarEspacioCaja($params = [])
  {
    $sql = "CALL spu_descontar_espacio_caja(?)";
    $idCaja = $params['idCaja'];
    return $this->registrar($sql, [$idCaja]);
  }

  public function recontarEspacioCaja($params = [])
  {
    $sql = "CALL spu_recontar_espacio_caja(?)";
    $params = $params['idContrato'];
    return $this->registrar($sql, [$params]);
  }

  public function listarCajasSectorIdCaja($params = [])
  {
    $sql = "CALL spu_buscar_cajas_sector_idCaja(?)";
    $array = [
      $params['idCaja']
    ];
    return $this->datosPaginados($sql, $array);
  }

  public function cajaBuscar($params = [])
  {
    $sql = "CALL spu_buscar_caja_id(?)";
    $array = [
      $params['idCaja']
    ];
    return $this->consultaParametros($sql, $array);
  }

  public function cajaUso($params = [])
  {
    $sql = "CALL spu_caja_uso(?)";
    $idCaja = $params['idCaja'];
    return $this->consultaParametros($sql, [$idCaja]);
  }

  public function eliminarCaja($params = [])
  {
    $sql = "CALL spu_caja_eliminar(?, ?)";
    $datos = [
      $params['idCaja'],
      $params['idUsuario']
    ];
    return $this->registrar($sql, $datos);
  }
}