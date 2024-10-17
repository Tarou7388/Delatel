<?php

require_once "Conexion.php";

class Usuario extends Conexion
{

  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Inicia sesión de un usuario.
   *
   * Este método llama al procedimiento almacenado `spu_usuarios_login` 
   * para autenticar a un usuario basado en el nombre de usuario proporcionado.
   *
   * @param array $params Arreglo asociativo que contiene el nombre de usuario 
   *                      bajo la clave 'nombreUser'.
   * @return mixed El resultado de la consulta al procedimiento almacenado.
   */
  public function login($params = [])
  {
    $sql = "CALL spu_usuarios_login(?)";
    $values = array($params['nombreUser']);
    return $this->buscarObjeto($sql, $values);
  }

  /**
   * Registra un nuevo usuario en la base de datos.
   *
   * Este método llama al procedimiento almacenado `spu_usuarios_registrar` para registrar un nuevo usuario.
   *
   * @param array $params Arreglo asociativo con los siguientes índices:
   *                      - 'idPersona' (int): ID de la persona.
   *                      - 'nombreUser' (string): Nombre de usuario.
   *                      - 'pass' (string): Contraseña del usuario.
   *                      - 'iduser_create' (int): ID del usuario que crea el nuevo registro.
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarUsuarios($params = [])
  {
    $sql = "CALL spu_usuarios_registrar(?,?,?,?)";
    $values = array(
      $params['idPersona'],
      $params['nombreUsuario'],
      $params['clave'],
      $params['idUsuario']
    );
    return $this->registroValorDevolvido($sql, $values);
  }

  /**
   * Método para listar todos los usuarios.
   *
   * Este método ejecuta una consulta SQL para obtener todos los registros
   * de la vista 'vw_usuarios_listar' y devuelve los datos obtenidos.
   *
   * @return array Un arreglo con los datos de los usuarios.
   */
  public function listarUsuarios()
  {
    $sql = "SELECT * FROM vw_usuarios_listar";
    return $this->listarDatos($sql);
  }

  /**
   * Método para actualizar a un usuario.
   * 
   * @param array $params Arreglo asociativo con los siguientes índices:
   *                      - 'nombreUsuario' (string): Nombre de usuario.
   *                      - 'clave' (string): Contraseña del usuario.
   *                      - 'idUsuarioUpdate' (int): ID del usuario que actualiza el registro.
   *                      - 'idUsuario' (int): ID del usuario que se está actualizando.
   * 
   * @return bool El resultado será verdadero si la operación se realiza con éxito o falso si falla.
   */
  public function actualizarUsuarios($params = [])
  {
    $sql = "CALL spu_usuario_actualizar(?,?,?,?)";
    $values = array(
      $params['nombreUsuario'],
      $params['clave'],
      $params['idUsuarioUpdate'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Método para eliminar lógicamente a un usuario.
   * 
   * Este método inhabilita un usuario en lugar de eliminarlo físicamente, actualizando los campos
   * `inactive_at` y `iduser_inactive` en la base de datos.
   * 
   * @param array $params Arreglo asociativo con los siguientes índices:
   *                      - 'idUsuario' (int): ID del usuario que se está inhabilitando.
   *                      - 'idUsuarioEliminador' (int): ID del usuario que realiza la inhabilitación.
   * 
   * @return bool El resultado será verdadero si la operación se realiza con éxito o falso si falla.
   */
  public function eliminarUsuario($params = [])
  {
    $sql = "CALL sp_usuario_eliminar(?,?)";
    $values = array(
      $params['idUsuario'],
      $params['idUsuarioEliminador'],
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Buscar Nombre de Usuario para verificar
   *
   * Este método llama al procedimiento almacenado `spu_usuario_buscar_username` 
   * para verificar a un usuario basado en el nombre de usuario proporcionado.
   *
   * @param array $params Arreglo asociativo que contiene el nombre de usuario 
   *                      bajo la clave 'nombreUser'.
   * @return mixed El resultado de la consulta
   */
  public function buscarNombre($params = [])
  {
    $sql = "CALL spu_usuario_buscar_username(?)";
    $values = array($params['nombreUser']);
    return $this->buscarObjeto($sql, $values);
  }
}
