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
   * Lista los registros de Kardex.
   *
   * Este método recupera todos los registros de la vista 'vw_kardex_listar'.
   *
   * @param array $params Parámetros opcionales para la consulta (actualmente no utilizados).
   * @return array La lista de registros de Kardex.
   */
  public function listarKardex($offset = 0, $limit = 10, $search = "")
  {
    // Consulta SQL para obtener los datos del kardex
    $sql = "SELECT * FROM vw_kardex_listar";

    // Consulta para contar el total de registros
    $sqlCount = "SELECT COUNT(*) AS total FROM vw_kardex_listar";

    // Si hay búsqueda, se filtran los campos
    if ($search) {
      $sql .= " WHERE id_kardex LIKE :search 
                  OR id_producto LIKE :search 
                  OR modelo LIKE :search 
                  OR tipo_producto LIKE :search 
                  OR nombre_marca LIKE :search 
                  OR tipo_operacion LIKE :search 
                  OR tipo_movimiento LIKE :search 
                  OR nombre_almacen LIKE :search";
      $sqlCount .= " WHERE id_kardex LIKE :search 
                       OR id_producto LIKE :search 
                       OR modelo LIKE :search 
                       OR tipo_producto LIKE :search 
                       OR nombre_marca LIKE :search 
                       OR tipo_operacion LIKE :search 
                       OR tipo_movimiento LIKE :search 
                       OR nombre_almacen LIKE :search";
    }

    // Agregamos el LIMIT y OFFSET para la paginación
    $sql .= " LIMIT :offset, :limit";

    // Preparamos la consulta para obtener los resultados
    $stmt = $this->pdo->prepare($sql);

    // Enlazamos los valores de búsqueda si se proporcionan
    if ($search) {
      $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
    }

    // Enlazamos los valores de offset y limit para la paginación
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);

    // Ejecutamos la consulta
    $stmt->execute();

    // Recuperamos los resultados en un arreglo asociativo
    $kardex = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Preparamos la consulta para contar el total de registros
    $stmtCount = $this->pdo->prepare($sqlCount);

    // Enlazamos los valores de búsqueda también en la consulta de contar registros
    if ($search) {
      $stmtCount->bindValue(':search', "%$search%", PDO::PARAM_STR);
    }

    // Ejecutamos la consulta de contar registros
    $stmtCount->execute();

    // Obtenemos el total de registros
    $totalRegistros = $stmtCount->fetch(PDO::FETCH_ASSOC)['total'];

    // Devolvemos los resultados y el total de registros
    return ['kardex' => $kardex, 'totalRegistros' => $totalRegistros];
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
