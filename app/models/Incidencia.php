<?php
require_once 'Conexion.php';

class Incidencia extends Conexion
{
  private $pdo;

  /**
   * Constructor de la clase Incidencia.
   * 
   * Inicializa la conexión a la base de datos usando el método getConexion() de la clase padre (Conexion).
   */
  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra una nueva incidencia en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para registrar una nueva incidencia
   * con los parámetros proporcionados.
   *
   * @param array $params Un array asociativo que contiene:
   *    - 'idCliente' (int): El ID del cliente relacionado con la incidencia.
   *    - 'fechaIncidencia' (string): La fecha de la incidencia en formato 'YYYY-MM-DD H:i:s'.
   *    - 'descripcion' (string): La descripción detallada de la incidencia.
   *    - 'solucion' (string): La solución aplicada para la incidencia.
   *    - 'idtecnico' (int): El ID del técnico que gestionó la incidencia.
   *    - 'idUsuario' (int): El ID del usuario que registra la incidencia.
   * 
   * @return bool Retorna `true` si la operación fue exitosa, o `false` en caso contrario.
   */
  public function registrarIncidencia($params = [])
  {
    $sql = "CALL spu_incidencia_registrar(?, ?, ?, ?, ?, ?)";
    $values = array(
      $params['idCliente'],
      $params['fechaIncidencia'],
      $params['descripcion'],
      $params['solucion'],
      $params['idtecnico'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Listar todas las incidencias desde la vista `vw_incidencias`.
   *
   * Este método obtiene todas las incidencias almacenadas en la vista creada en la base de datos.
   * 
   * @return array Retorna un array con los registros de incidencias.
   */
  public function listarIncidencia()
  {
    $sql = "SELECT * FROM vw_incidencias";
    return $this->listarDatos($sql);
  }

  /**
   * Elimina una incidencia de la base de datos.
   *
   * Este método llama a un procedimiento almacenado para eliminar una incidencia según el ID proporcionado.
   * 
   * @param array $params Un array asociativo que contiene:
   *    - 'idIncidencia' (int): El ID de la incidencia a eliminar.
   *    - 'idUsuario' (int): El ID del usuario que realiza la eliminación.
   * 
   * @return bool Retorna `true` si la operación fue exitosa, o `false` en caso contrario.
   */
  public function eliminarIncidencia($params = [])
  {
    $sql = "CALL spu_incidencia_eliminar(?, ?)";
    $values = array(
      $params['idIncidencia'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }
}
