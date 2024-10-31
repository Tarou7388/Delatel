<?php
require_once 'Conexion.php';

class Movimiento extends Conexion
{
  private $pdo;
  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Filtra operaciones basadas en los parámetros proporcionados.
   *
   * Este método llama al procedimiento almacenado `spu_listar_tipo_operacion` con el parámetro dado.
   * El procedimiento almacenado filtra las operaciones según el tipo de movimiento ('S' o 'E') y devuelve
   * los registros coincidentes de la tabla `tb_tipooperacion`.
   *
   * @param array $params Un array asociativo que contiene la siguiente clave:
   *                      - 'movimiento' (char): El tipo de movimiento por el cual filtrar. Debe ser 'S' o 'E'.
   * 
   * @return array El conjunto de resultados del procedimiento almacenado, que incluye:
   *               - id_tipooperacion (int): El ID del tipo de operación.
   *               - descripcion (string): La descripción del tipo de operación.
   *               - movimiento (char): El tipo de movimiento ('S' o 'E').
   */
  public function filtroOperaciones($params = [])
  {
    $sql = "CALL spu_listar_tipo_operacion(?)";
    $values = array($params['movimiento']);
    return $this->consultaParametros($sql, $values);
  }
}
