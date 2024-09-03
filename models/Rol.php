<?php
require_once "Conexion.php";

class Rol extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function getAllRol()
  {
    $query  = $this->pdo->prepare("SELECT id_rol, rol from tb_roles WHERE inactive_at IS NULL");
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function addRol($params = []):bool
  {
    try {
      $status=false;
      $query = $this->pdo->prepare("CALL spu_registrar_roles(?,?)");
      $permisosJson = json_encode($params['permisos']);
      $status=$query->execute([
        $params['rol'],
        $permisosJson
      ]);
      return $status;
    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
  public function getPermisos($data = [])
  {
    try {
      $consulta = $this->pdo->prepare("CALL spu_listar_permisos(?)");
      $consulta->execute([
        $data['rol']
      ]);

      $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
      foreach ($resultado as &$row) {
        if (isset($row['permisos'])) {
          $row['permisos'] = json_decode($row['permisos'], true);
        }
      }
      return $resultado;
    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
  public function getRolPermisos($data = []){
    try{
      $consulta = $this->pdo->prepare("CALL spu_listar_permisos_id(?)");
      $consulta->execute(
        array(
          $data["idRol"]
        )
      );
      $resultado = $consulta->fetchAll(PDO::FETCH_ASSOC);
      foreach ($resultado as &$resultados) {
        $resultados['permisos'] = json_decode($resultados['permisos'], true);
      }
      return $resultado;

    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
  public function updatePermisos($data = []):bool{
    try{
      $status = false;
      $consulta = $this->pdo->prepare("CALL spu_actualizar_permisos_id(?,?)");
      $permisosJson = json_encode($data['permisos']);
      $status = $consulta->execute(
        array(
          $data["idRol"],
          $permisosJson
        )
      );
      return $status;

    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
}
