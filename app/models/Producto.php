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
    $sql = "SELECT * FROM tb_productos WHERE id_producto = ?";
    $value = array($params['idProducto']);
    return $this->consultaParametros($sql, $value);
  }
  
  /**
   * Listar todos los productos.
   *
   * Esta función ejecuta una consulta SQL para obtener todos los productos
   * de la tabla 'tb_productos' ordenados por 'id_producto' en orden descendente.
   *
   * @return array Un array de productos obtenidos de la base de datos.
   */
  public function listarProductos()
  {
    $sql = "SELECT * FROM tb_productos ORDER BY id_producto DESC";
    return $this->listarDatos($sql);
  }

  /**
   * Registra un nuevo producto en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para agregar un nuevo producto con los parámetros proporcionados.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'marca' (string): La marca del producto.
   *                      - 'tipo_producto' (string): El tipo de producto.
   *                      - 'modelo' (string): El modelo del producto.
   *                      - 'precio_actual' (float): El precio actual del producto.
   *                      - 'codigo_barra' (string): El código de barras del producto.
   *                      - 'iduser_create' (int): El ID del usuario que está creando el producto.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarProducto($params = [])
  {
    $sql = "CALL spu_productos_registrar(?,?,?,?,?,?)";
    $values = array(
      $params['marca'],
      $params['tipo_producto'],
      $params['modelo'],
      $params['precio_actual'],
      $params['codigo_barra'],
      $params['iduser_create']
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
   *  - 'id_producto' (int): El ID del producto a actualizar.
   *  - 'marca' (string): La marca del producto.
   *  - 'tipo_producto' (string): El tipo de producto.
   *  - 'modelo' (string): El modelo del producto.
   *  - 'precio_actual' (float): El precio actual del producto.
   *  - 'codigo_barra' (string): El código de barras del producto.
   *  - 'iduser_update' (int): El ID del usuario que realiza la actualización.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function actualizarProducto($params = [])
  {
    $sql = "CALL spu_productos_actualizar(?,?,?,?,?,?,?)";
    $values = array(
      $params['idProducto'],
      $params['marca'],
      $params['tipoProducto'],
      $params['modelo'],
      $params['precioActual'],
      $params['codigoBarra'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }
}