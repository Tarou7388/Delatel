<?php
require_once 'Conexion.php';

class Soporte extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un registro de soporte en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para insertar un nuevo registro de soporte.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *  - id_contrato (int): El ID del contrato.
   *  - id_tipo_soporte (int): El ID del tipo de soporte.
   *  - id_tecnico (int): El ID del técnico.
   *  - fecha_hora_solicitud (string): La fecha y hora de la solicitud.
   *  - fecha_hora_asistencia (string): La fecha y hora de la asistencia.
   *  - descripcion_problema (string): La descripción del problema.
   *  - descripcion_solucion (string): La descripción de la solución.
   *  - prioridad (string): La prioridad del soporte.
   *  - soporte (array): Un array que contiene información adicional de soporte.
   *  - iduser_create (int): El ID del usuario que creó el registro.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarSoporte($params = [])
  {
    $sql = "CALL spu_registrar_fichasoporte(?,?,?,?,?,?,?,?)";
    $soporteJson = json_encode($params['soporte']);
    $values = array(
      $params['idContrato'],
      $params['idTipoSoporte'],
      $params['idTecnico'],
      $params['fechaHoraSolicitud'],
      $params['fechaHoraAsistencia'],
      $params['prioridad'],
      $soporteJson,
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  public function listarTipoSoporte()
  {
    $sql = "SELECT * FROM vw_tiposoporte_listar";
    return $this->listarDatos($sql);
  }
}
