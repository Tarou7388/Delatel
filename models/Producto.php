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

  public function add($params = [])
  {
    $query = $this->pdo->prepare("CALL spu_productos_agregar(?,?,?,?,?)");
    $query->execute(
      [
        $params['marca'],
        $params['tipo_producto'],
        $params['modelo'],
        $params['precio_actual'],
        $params['Codigo_Barras'],
      ]
    );
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
}
