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
    $sql = "CALL spu_servicio_registrar(?,?)";
    $values = array(
      $params['servicio'],
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
