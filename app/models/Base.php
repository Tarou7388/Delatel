<?php 
require_once 'Conexion.php';

class Base extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Método para listar las provincias.
   *
   * Este método ejecuta un procedimiento almacenado en la base de datos
   * para obtener una lista de provincias.
   *
   * @return array Retorna un array con los datos de las provincias.
   */
  public function listarBase()
  {
    $sql = "CALL spu_base_listar";
    return $this->listarDatos($sql);
  }

  /**
   * Listar base por ID.
   *
   * Este método ejecuta un procedimiento almacenado para listar las provincias
   * basadas en el ID proporcionado.
   *
   * @param int $id El ID de la provincia a listar.
   * @return array Los datos de la provincia correspondiente al ID proporcionado.
   */
  public function listarBasePorId($params = [])
  {
    $sql = "CALL spu_subBase_por_base(?)";
    $values = array($params['id']);
    return $this->consultaParametros($sql, $values);
  }
}