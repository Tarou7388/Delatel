<?php
require_once "Conexion.php";

class Responsable extends Conexion
{

  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un nuevo responsable en la base de datos.
   * 
   * @param array $params Los parámetros requeridos para el registro:
   * - idUsuario: El ID del usuario a ser asignado como responsable.
   * - idRol: El ID del rol asignado al responsable.
   * - FechaInicio: La fecha en la que el responsable comienza sus funciones.
   * - idUsuarioCreador: El ID del usuario que realiza el registro.
   * 
   * @return mixed El resultado de la operación de registro.
   */
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

  /**
   * Actualiza los datos de un responsable existente en la base de datos.
   * 
   * @param array $params Los parámetros requeridos para la actualización:
   * - idUsuarioActualizador: El ID del usuario que está realizando la actualización.
   * - idRol: El nuevo ID de rol asignado al responsable.
   * - idResponsable: El ID del responsable que se va a actualizar.
   * 
   * @return mixed El resultado de la operación de actualización.
   */
  public function actualizarResponsable($params = [])
  {
    $sql = "CALL spu_responsablesUsuarios_actualizar(?,?,?)";
    $values = array(
      $params['idUsuarioActualizador'],
      $params['idRol'],
      $params['idResponsable']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Elimina (o desactiva) un responsable de la base de datos.
   * 
   * @param array $params Los parámetros requeridos para la eliminación:
   * - idResponsable: El ID del responsable a eliminar.
   * - idUsuarioEliminador: El ID del usuario que realiza la eliminación.
   * 
   * @return mixed El resultado de la operación de eliminación.
   */
  public function eliminarResponsable($params = [])
  {
    $sql = "CALL spu_responsables_eliminar(?,?)";
    $values = array(
      $params['idResponsable'],
      $params['idUsuarioEliminador']
    );
    return $this->registrar($sql, $values);
  }
}
