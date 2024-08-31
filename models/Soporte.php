<?php
require_once 'Conexion.php';

class Soporte extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function addSoporte($params = []): bool
  {
    try {
      $status = false;
      $query = $this->pdo->prepare("CALL spu_registrar_fichasoporte(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
      $pagosJson = json_encode($params['pagos']);
      $soporteJson = json_encode($params['soporte']);
      $status = $query->execute([
        $params['id_contrato'],
        $params['id_tipo_soporte'],
        $params['id_tecnico'],
        $params['fecha_hora_solicitud'],
        $params['fecha_hora_asistencia'],
        $params['descripcion_problema'],
        $params['descripcion_solucion'],
        $params['prioridad'],
        $pagosJson,
        $soporteJson
      ]);
      return $status;
    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
}
