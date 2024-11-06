<?php

require_once 'Conexion.php';

class Producto extends Conexion
{

  private $pdo;

  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Busca un producto por su ID.
   *
   * Este método ejecuta una consulta SQL para buscar un producto en la tabla `tb_productos`
   * utilizando el ID del producto proporcionado en los parámetros.
   *
   * @param array $params Un array asociativo que contiene el ID del producto con la clave 'idProducto'.
   * @return mixed El resultado de la consulta, que puede ser un array de resultados o false en caso de error.
   */
  public function buscarProductoId($params = [])
  {
    $sql = "SELECT * FROM vw_productos_detalle WHERE id_producto = ?";
    $value = array($params['idProducto']);
    return $this->consultaParametros($sql, $value);
  }

  /**
   * Lista todos los productos.
   *
   * Esta función ejecuta una consulta SQL para obtener todos los productos
   * de la tabla 'tb_productos' ordenados por 'id_producto' en orden descendente.
   *
   * @return array Un array de productos obtenidos de la base de datos.
   */
  public function listarProductos($offset = 0, $limit = 10, $search = "")
  {
    $sql = "SELECT * FROM vw_productos_detalle ORDER BY id_producto DESC";
    $sqlCount = "SELECT COUNT(*) AS total FROM vw_productos_detalle";

    // Ajustar la búsqueda para los campos de vw_productos_detalle
    if ($search) {
      $sql .= " WHERE modelo LIKE :search OR marca LIKE :search OR tipo_nombre LIKE :search OR unidad_nombre LIKE :search OR codigo_barra LIKE :search";
      $sqlCount .= " WHERE modelo LIKE :search OR marca LIKE :search OR tipo_nombre LIKE :search OR unidad_nombre LIKE :search OR codigo_barra LIKE :search";
    }

    $sql .= " LIMIT :offset, :limit";
    $stmt = $this->pdo->prepare($sql);

    // Aplicar los valores de búsqueda, offset y limit
    if ($search) {
      $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
    }
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    // Obtener resultados y el total de registros
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmtCount = $this->pdo->prepare($sqlCount);
    if ($search) {
      $stmtCount->bindValue(':search', "%$search%", PDO::PARAM_STR);
    }
    $stmtCount->execute();
    $totalRegistros = $stmtCount->fetch(PDO::FETCH_ASSOC)['total'];

    return ['productos' => $productos, 'totalRegistros' => $totalRegistros];
  }

  /**
   * Registra un nuevo producto en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para agregar un nuevo producto con los parámetros proporcionados.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'marca' (string): La marca del producto.
   *                      - 'tipoProducto' (string): El tipo de producto.
   *                      - 'modelo' (string): El modelo del producto.
   *                      - 'precioActual' (float): El precio actual del producto.
   *                      - 'codigoBarra' (string): El código de barras del producto.
   *                      - 'idUsuario' (int): El ID del usuario que está creando el producto.
   *
   * @return bool El resultado será verdadero si se realiza correctamente o falso si falla.
   */
  public function registrarProducto($params = [])
  {
    $sql = "CALL spu_productos_registrar(?,?,?,?,?,?,?)";
    $values = array(
      $params['idmarca'],
      $params['idtipoProducto'],
      $params['idUnidad'],
      $params['modelo'],
      $params['precioActual'],
      $params['codigoBarra'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Actualiza un producto en la base de datos utilizando los parámetros proporcionados.
   *
   * Este método llama a un procedimiento almacenado `spu_productos_actualizar` para actualizar
   * los detalles del producto en la base de datos.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *  - 'idProducto' (int): El ID del producto a actualizar.
   *  - 'marca' (string): La marca del producto.
   *  - 'tipoProducto' (string): El tipo de producto.
   *  - 'modelo' (string): El modelo del producto.
   *  - 'precioActual' (float): El precio actual del producto.
   *  - 'codigoBarra' (string): El código de barras del producto.
   *  - 'idUsuario' (int): El ID del usuario que realiza la actualización.
   *
   * @return bool El resultado será verdadero si se realiza correctamente o falso si falla.
   */
  public function actualizarProducto($params = [])
  {
    $sql = "CALL spu_productos_actualizar(?,?,?,?,?,?,?)";
    $values = array(
      $params['idProducto'],
      $params['idmarca'],
      $params['idtipoProducto'],
      $params['idUnidad'],
      $params['modelo'],
      $params['precioActual'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  // AQUI COMIENZA LA DIVISION DE PRODUCTOS Y SUS TIPOS

  /**
   * Lista todos los tipos de productos.
   *
   * Esta función ejecuta una consulta SQL para seleccionar todos los registros
   * de la vista `vw_tipo_productos` y devuelve los resultados como un array.
   *
   * @return array Un array con los datos de los tipos de productos.
   */
  public function listarTipoProductos(): array
  {
    $sql = "SELECT * FROM vw_tipo_productos";
    return $this->listarDatos($sql);
  }

  public function EliminarProducto($params = []): bool
  {
    $sql = "CALL spu_productos_eliminar(?,?)";
    $values = array(
      $params['idProducto'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }
}
