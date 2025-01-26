<?php

require_once 'Conexion.php';

class Antena extends Conexion
{

  private $pdo;

  public function __construct()
  {
    $this->pdo = Conexion::getConexion();
  }

  public function listarAntenas()
  {
    $sql = "CALL spu_antenas_listar()";
    return $this->listarDatos($sql);
  }

  public function registrarAntena($params = [])
  {
    $sql = "CALL spu_antenas_registrar(?,?,?,?,?,?)";
    $params = [
      $params['idDistrito'],
      $params['nombre'],
      $params['descripcion'],
      $params['coordenadas'],
      $params['direccion'],
      $params['idUsuario']
    ];
    return $this->registrar($sql, $params);
  }

  public function inhabilitarAntenas($params = [])
  {
    $sql = "CALL spu_antena_inhabilitar(?,?)";
    $params = array(
      $params['idAntena'],
      $params['idUsuario'],
    );
    return $this->registrar($sql, $params);
  }
}
