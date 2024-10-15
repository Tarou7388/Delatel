<?php
require_once "Conexion.php";

class Responsable extends Conexion
{
  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  public function RegistrarResponsable($params = [])
  {
    $sql = "CALL spu_responsables_registrar(?,?,?,?)";
    $values = array(
      $params['idUsuario'],
      $params['idRol'],
      $params['FechaInicio'],
      $params['idUsuarioCreador']
    );
    return $this->registrar($sql, $values);
  }

  public function actualizarResponsable($params = [])
  {
    $sql = "CALL spu_responsables_actualizar(?,?,?,?)";
    $values = array(
      $params['idUsuario'],
      $params['idRol'],
      $params['FechaInicio'],
      $params['idUsuarioCreador']
    );
    return $this->registrar($sql, $values);
  }

  public function eliminarResponsable($params = [])
  {
    $sql = "CALL spu_responsables_eliminar(?,?,?,?)";
    $values = array(
      $params['idUsuario'],
      $params['idRol'],
      $params['idUsuarioEliminador'],
      $params['idUsuarioEliminador']
    );
    return $this->registrar($sql, $values);
  }
}
