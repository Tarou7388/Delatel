<?php

require_once 'Conexion.php';

class Producto extends Conexion
{

  private $pdo;

  //Constructor
  public function __CONSTRUCT()
  {
    $this->pdo = parent::getConexion();
  }
  public function getAll()
  {
    $query = $this->pdo->prepare("SELECT * FROM tb_productos");
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
  //Función para registrar el producto
  public function add($params = [])
  {
    $query = $this->pdo->prepare("CALL spu_productos_agregar(?,?,?,?)");
    $query->execute(
      [
        $params['tipo_producto'],
        $params['nombreProducto'],
        $params['marca'],
        $params['precio_actual']
      ]
    );
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
}
