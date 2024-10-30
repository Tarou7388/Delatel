<?php
require_once 'Conexion.php';

class Servicio extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un nuevo servicio en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para registrar un nuevo servicio con los parámetros proporcionados.
   *
   * @param array $params Un array asociativo que contiene:
   *                      - 'servicio' (string): El nombre del servicio a registrar.
   *                      - 'idUsuario' (int): El ID del usuario que registra el servicio.
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarServicio($params = [])
  {
    $sql = "CALL spu_servicio_registrar(?,?,?)";
    $values = array(
      $params['tipo_servicio'],
      $params['servicio'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Actualiza un servicio existente en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para actualizar un servicio con los parámetros proporcionados.
   *
   * @param array $params Un array asociativo que contiene:
   *                      - 'idServicio' (int): El ID del servicio a actualizar.
   *                      - 'tipo_servicio' (string): El tipo de servicio a actualizar.
   *                      - 'servicio' (string): El nombre del servicio a actualizar.
   *                      - 'idUsuario' (int): El ID del usuario que actualiza el servicio.
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function actualizarServicio($params = [])
  {
    $sql = "CALL spu_servicio_actualizar(?,?,?,?)";
    $values = array(
      $params['idServicio'],
      $params['tipo_servicio'],
      $params['servicio'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Elimina un servicio existente en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para eliminar un servicio con el ID proporcionado.
   *
   * @param int $idServicio El ID del servicio a eliminar.
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function eliminarServicio($params = [])
  {
    $sql = "CALL spu_servicio_eliminar(?,?)";
    $values = array(
      $params['idServicio'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Reactiva un servicio existente en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para reactivar un servicio con el ID proporcionado.
   *
   * @param array $params Un array asociativo que contiene:
   *                      - 'idServicio' (int): El ID del servicio a reactivar.
   *                      - 'idUsuario' (int): El ID del usuario que reactiva el servicio.
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function reactivarServicio($params = [])
  {
    $sql = "CALL spu_servicio_reactivar(?,?)";
    $values = array(
      $params['idServicio'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Lista los servicios disponibles.
   *
   * Esta función ejecuta una consulta a la vista `vw_servicios_listar` para obtener
   * una lista de servicios disponibles.
   *
   * @return array Retorna un arreglo con los datos de los servicios listados.
   */
  public function listarServicio()
  {
    $sql = "SELECT * FROM vw_servicios_listar";
    return $this->listarDatos($sql);
  }

}
