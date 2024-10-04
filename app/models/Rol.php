<?php
require_once "Conexion.php";

class Rol extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  public function listarRoles()
  {
    $sql = "SELECT id_rol, rol from vw_roles_listar";
    return $this->listarDatos($sql);
  }

  /**
   * Registra roles en la base de datos llamando a un procedimiento almacenado.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'rol': El nombre del rol a registrar.
   *                      - 'permisos': Un array de permisos asociados con el rol.
   *                      - 'isUsuario': Un indicador que señala si el rol es para un usuario.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarRoles($params = [])
  {
    $sql = "CALL spu_roles_registrar(?,?,?)";
    $permisosJson = json_encode($params['permisos']);
    $values = array(
      $params['rol'],
      $permisosJson,
      $params['isUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Método para listar los permisos asociados a un rol específico.
   *
   * @param array $params Parámetros para la consulta, debe incluir 'idRol'.
   * @return array Lista de permisos con los datos decodificados en formato de arreglo.
   */
  public function listarPermisos($params = [])
  {
    $sql = "CALL spu_permisos_listar_id(?)";
    $values = array(
      $params['idRol']
    );

    $resultado = $this->consultaParametros($sql, $values);
    foreach ($resultado as &$row) {
      if (isset($row['permisos'])) {
        $row['permisos'] = json_decode($row['permisos'], true);
      }
    }
    return $resultado;
  }

  /**
   * Busca un rol por su ID.
   *
   * Esta función ejecuta un procedimiento almacenado para listar los permisos
   * asociados a un rol específico identificado por su ID.
   *
   * @param array $params Un arreglo asociativo que contiene el ID del rol con la clave 'idRol'.
   * @return mixed El resultado de la consulta a la base de datos.
   */
  public function buscarRolId($params = [])
  {
    $sql = "CALL spu_permisos_listar_id(?)";
    $value = array($params['idRol']);
    return $this->consultaParametros($sql, $value);
  }

  /**
   * Actualiza los permisos para un rol dado.
   *
   * Este método llama a un procedimiento almacenado para actualizar los permisos asociados con un rol específico.
   * Los permisos se pasan como un array y se codifican en formato JSON antes de ser enviados a la base de datos.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'idRol' (int): El ID del rol a actualizar.
   *                      - 'permisos' (array): Un array de permisos para asignar al rol.
   *                      - 'idUsuario' (int): El ID del usuario que realiza la actualización.
   *
   * @return mixed El resultado del método `registrar`, que ejecuta la consulta SQL.
   */
  public function actualizarPermisos($params = [])
  {
    $sql = "CALL spu_permisos_actualizar_id(?,?,?)";
    $permisosJson = json_encode($params['permisos']);
    $values = array(
      $params['idRol'],
      $permisosJson,
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Actualiza un rol en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para actualizar la información de un rol.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'idRol' (int): El ID del rol a actualizar.
   *                      - 'rol' (string): El nuevo nombre del rol.
   *                      - 'iduser_update' (int): El ID del usuario que realiza la actualización.
   *
   * @return mixed El resultado del método registrar, que ejecuta la consulta SQL.
   */
  public function actualizarRol($params = [])
  {
    $sql = "CALL spu_roles_actualizar(?,?,?)";
    $values = array(
      $params['idRol'],
      $params['rol'],
      $params['iduser_update']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Elimina un rol de la base de datos.
   *
   * Este método llama a un procedimiento almacenado para eliminar un rol
   * específico de la base de datos utilizando el ID del rol proporcionado.
   *
   * @param array $params Arreglo asociativo que contiene el ID del rol a eliminar.
   *                      Ejemplo: ['idRol' => 1]
   * @return mixed El resultado de la operación de eliminación.
   */
  public function eliminarRol($params = [])
  {
    $sql = "CALL spu_roles_eliminar(?,?)";
    $values = array(
      $params['idRol'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

}