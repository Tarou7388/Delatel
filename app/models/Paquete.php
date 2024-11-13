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
    $sql = "CALL spu_paquete_registrar(?,?,?,?)";
    $values = array(
      json_encode(['id_servicio' => $params['idServicio']]),
      $params['paquete'],
      $params['precio'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Recupera una lista de paquetes de la base de datos.
   *
   * Este método ejecuta una consulta SQL para seleccionar todos los registros 
   * de la vista 'view_paquetes_listar' y devuelve el resultado.
   *
   * @return array La lista de paquetes recuperados de la base de datos.
   */
  public function listarPaquetes()
  {
    $sql = "SELECT * FROM vw_paquetes_listar";
    return $this->listarDatos($sql);
  }


  /**
   * Actualiza un paquete existente utilizando los parámetros proporcionados.
   *
   * Este método llama a un procedimiento almacenado `spu_paquete_actualizar` para actualizar un paquete
   * en la base de datos. Los parámetros requeridos para el procedimiento almacenado se pasan como un
   * array asociativo.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'idPaquete' (int): El ID del paquete.
   *                      - 'idServicio' (int): El ID del servicio.
   *                      - 'precio' (float): El precio del paquete.
   *                      - 'fechaInicio' (string): La fecha de inicio del paquete.
   *                      - 'fechaFin' (string): La fecha de fin del paquete.
   *                      - 'idUsuario' (int): El ID del usuario.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function actualizarPaquete($params = [])
  {
    $sql = "CALL spu_paquete_actualizar(?,?,?,?,?)";
    $values = array(
      $params['idPaquete'],
      json_encode(['id_servicio' => $params['idServicio']]),
      $params['paquete'],
      $params['precio'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Elimina un paquete existente utilizando el ID proporcionado.
   *
   * Este método llama a un procedimiento almacenado `spu_paquete_eliminar` para eliminar un paquete
   * en la base de datos. El ID del paquete se pasa como un parámetro.
   *
   * @param int $idPaquete El ID del paquete a eliminar.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function eliminarPaquete($params = [])
  {
    $sql = "CALL spu_paquete_eliminar(?,?)";
    $values = array(
      $params['idPaquete'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Busca un paquete por su ID.
   *
   * Este método llama a un procedimiento almacenado `spu_paquete_buscar` para recuperar un paquete
   * de la base de datos utilizando su ID.
   *
   * @param int $idPaquete El ID del paquete a buscar.
   *
   * @return array|null Los datos del paquete si se encuentra, o null si no se encuentra.
   */
  public function buscarPaqueteId($params = [])
  {
    $sql = "CALL spu_paquete_buscar_id(?)";
    $values = array(
      $params['idPaquete']
    );
    return $this->consultaParametros($sql, $values);
  }

  /**
   * Busca paquetes por su ID de servicio.
   *
   * Este método llama a un procedimiento almacenado `spu_paquete_buscar_idServicio` para recuperar paquetes
   * de la base de datos utilizando el ID del servicio.
   *
   * @param int $idServicio El ID del servicio a buscar.
   *
   * @return array|null Los datos de los paquetes si se encuentran, o null si no se encuentran.
   */
  public function buscarPaquetePorIdServicio($params = [])
  {
    $sql = "CALL spu_paquete_buscar_idServicio(?)";
    $values = array(
      json_encode(array('id_servicio' => $params['idServicio']))
    );
    return $this->consultaParametros($sql, $values);
  }
}
