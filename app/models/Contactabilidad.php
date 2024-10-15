<?php
require_once 'Conexion.php';

class Contactabilidad extends Conexion
{
  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un contacto en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para registrar un contacto con los parámetros proporcionados.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *  - 'idPersona' (int): El ID de la persona.
   *  - 'idPaquete' (int): El ID del paquete.
   *  - 'direccion' (string): La dirección.
   *  - 'nota' (string): Una nota o comentario.
   *  - 'idUsuario' (int): El ID del usuario.
   *  - 'fechaLimite' (string): La fecha límite.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarContacto($params)
  {
    $sql = "CALL spu_contactabilidad_registrar(?, ?, ?, ?, ?, ?, ?)";
    $values = array(
      $params['idPersona'],
      $params['idEmpresa'],
      $params['idPaquete'],
      $params['direccion'],
      $params['nota'],
      $params['idUsuario'],
      $params['fechaLimite']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Recupera una lista de personas de la vista 'vw_contactabilidad_listar'.
   *
   * Este método ejecuta una consulta SQL para seleccionar todos los registros de la 
   * vista 'vw_contactabilidad_listar' y devuelve el resultado.
   *
   * @return array La lista de personas recuperadas de la base de datos.
   */
  public function obtenerContactos()
  {
    $sql = "SELECT * FROM vw_contactabilidad_listar";
    return $this->listarDatos($sql);
  }
}
