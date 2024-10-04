<?php
require_once 'Conexion.php';

class Paquete extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un nuevo paquete utilizando los parámetros proporcionados.
   *
   * Este método llama a un procedimiento almacenado `spu_paquetes_registrar` para insertar un nuevo paquete
   * en la base de datos. Los parámetros requeridos para el procedimiento almacenado se pasan como un
   * array asociativo.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'idServicio' (int): El ID del servicio.
   *                      - 'precio' (float): El precio del paquete.
   *                      - 'fechaInicio' (string): La fecha de inicio del paquete.
   *                      - 'fechaFin' (string): La fecha de fin del paquete.
   *                      - 'idUsuario' (int): El ID del usuario.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarPaquete($params = [])
  {
    $sql = "CALL spu_paquete_registrar(?,?,?,?,?,?)";
    $values = array(
      $params['idServicio'],
      $params['precio'],
      $params['tipoPaquete'],
      $params['fechaInicio'],
      $params['fechaFin'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Recupera una lista de paquetes de la base de datos.
   *
   * Este método ejecuta una consulta SQL para seleccionar todos los registros 
   * de la vista 'view_paquetes_info' y devuelve el resultado.
   *
   * @return array La lista de paquetes recuperados de la base de datos.
   */
  public function listarPaquetes(){
    $sql = "SELECT * FROM vw_paquetes_listar";
    return $this->listarDatos($sql);
  }
}
