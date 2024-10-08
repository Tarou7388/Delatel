<?php
require_once 'Conexion.php';

class Sector extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un nuevo sector en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para insertar un nuevo registro de sector.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'id_distrito' (int): El ID del distrito.
   *                      - 'sector' (string): El nombre del sector.
   *                      - 'iduser_create' (int): El ID del usuario que crea el sector.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarSector($params = [])
  {
    $sql = "CALL spu_sectores_registrar(?,?,?)";
    $values = array(
      $params['idDistrito'],
      $params['sector'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Listar todos los sectores.
   *
   * Este método ejecuta una consulta SQL para seleccionar todos los registros
   * de la vista 'vw_listar_sectores' y devuelve los datos obtenidos.
   *
   * @return array Un array con los datos de los sectores.
   */
  public function listarSectores()
  {
    $sql = "SELECT * FROM vw_sectores_listar";
    return $this->listarDatos($sql);
  }

}