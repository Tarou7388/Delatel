<?php
require_once "Conexion.php";

class Kardex extends Conexion
{
  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

 
  /**
   * Listar Kardex
   *
   * This method retrieves a list of records from the `vw_kardex_listar` view.
   *
   * @return array An array of associative arrays representing the records.
   *               Returns an empty array if an exception occurs.
   */
  public function listarKardex(): array
  {
    try {
      $cmd = $this->pdo->prepare("SELECT * FROM vw_kardex_listar");
      $cmd->execute();

      return $cmd->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      error_log($e->getMessage());
      return [];
    }
  }


  /**
   * Busca información de stock por ID de producto.
   *
   * Este método consulta la vista `vw_kardex_listar` para recuperar todos los registros
   * asociados con el ID de producto especificado.
   *
   * @param array $params Un array asociativo que contiene la siguiente clave:
   *                      - 'id_producto': El ID del producto a buscar.
   * 
   * @return mixed El resultado de la consulta, típicamente un array de registros.
   */
  public function buscarStockId($params = [])
  {
    $sql = "SELECT * FROM vw_kardex_listar WHERE id_producto = ? AND id_almacen= ?";
    $values = array(
      $params['idProducto'],
      $params['idAlmacen']
    );
    return $this->consultaParametros($sql, $values);
  }

  /**
   * Registra una nueva entrada en el Kardex.
   *
   * Este método llama a un procedimiento almacenado para registrar una nueva entrada en el Kardex
   * con los parámetros proporcionados.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'id_producto' (int): El ID del producto.
   *                      - 'fecha' (string): La fecha de la operación.
   *                      - 'tipo_operacion' (string): El tipo de operación.
   *                      - 'motivo' (string): El motivo de la operación.
   *                      - 'cantidad' (int): La cantidad involucrada en la operación.
   *                      - 'valor_unitario_historico' (float): El valor unitario histórico.
   *                      - 'iduser_create' (int): El ID del usuario que creó la entrada.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarKardex($params = [])
  {
    $sql = "CALL spu_kardex_registrar(?, ?, ?, ?, ?, ?, ?)";
    $values = array(
      $params['idAlmacen'],
      $params['idProducto'],
      $params['fecha'],
      $params['idtipoOperacion'],
      $params['cantidad'],
      $params['valorUnitarioHistorico'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Busca un producto por su ID en la vista vw_kardex_listar.
   *
   * @param array $params Arreglo asociativo que contiene el ID del producto con la clave 'id_producto'.
   * @return mixed Resultado de la consulta a la base de datos.
   */
  public function buscarProductoId($params = [])
  {
    $sql = "SELECT * FROM vw_kardex_listar WHERE id_producto = ?";
    $values = array($params['idProducto']);
    return $this->consultaParametros($sql, $values);
  }
}
