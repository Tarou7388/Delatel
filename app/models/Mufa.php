<?php

require_once 'Conexion.php';

class Mufa extends Conexion
{

  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function listarMufas()
  {
    $sql = "CALL spu_mufas_listar()";
    return $this->listarDatos($sql);
  }
  public function registrarMufa($params = [])
  {
    $sql = "CALL spu_mufa_registrar(?,?,?,?,?)";
    $array = [
      $params['nombre'],
      $params['descripcion'],
      $params['coordenadas'],
      $params['direccion'],
      $params['id_usuario']
    ];
    return $this->registrar($sql, $array);
  }

  public function mufaUso($params = [])
  {
    $sql = "CALL spu_mufa_uso(?)";
    $array = [
      $params['idMufa']
    ];
    return $this->consultaParametros($sql, $array);
  }

  public function eliminarMufa($params = [])
  {
    $sql = "CALL spu_mufa_eliminar(?, ?)";
    $array = [
      $params['idMufa'],
      $params['idUsuario']
    ];
    return $this->registrar($sql, $array);
  }

}
