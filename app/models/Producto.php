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
   * Listar todos los productos.
   *
   * Este método ejecuta una consulta SQL para obtener todos los productos
   * desde la vista `vw_productos_detalle` y devuelve los resultados como
   * un array asociativo.
   *
   * @return array Un array asociativo que contiene los detalles de los productos.
   *               Si ocurre una excepción, se devuelve un array vacío.
   */
  public function listarProductos(): array
  {
    try {
      $cmd = $this->pdo->prepare("SELECT * FROM vw_productos_detalle");
      $cmd->execute();

      return $cmd->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      error_log($e->getMessage());
      return [];
      
    }
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
  public function registrarTipoproducto($params = [])
  {
    $sql = "CALL spu_registrar_tipo_producto(?,?)";
    $values = array(
      $params['tipoProducto'],
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

		public function BuscarProductoBarra($params = [])
		{
				$sql = "CALL	spu_productos_buscar_barra(?)";
				$values = array($params['codigoBarra']);
				return $this->consultaParametros($sql, $values);
		}

		public function BuscarProductoBarraSintonizador($params = [])
		{
				$sql = "CALL	spu_productos_buscar_barraSintonizador(?)";
				$values = array($params['codigoBarra']);
				return $this->consultaParametros($sql, $values);
		}
    
		public function BuscarProductoBarraRepetidor($params = [])
		{
				$sql = "CALL	spu_productos_buscar_barraRepetidor(?)";
				$values = array($params['codigoBarra']);
				return $this->consultaParametros($sql, $values);
		}

    public function BuscarProductoBarraRouter($params = [])
		{
				$sql = "CALL spu_productos_buscar_barraRouter(?)";
				$values = array($params['codigoBarra']);
				return $this->consultaParametros($sql, $values);
		}

}
