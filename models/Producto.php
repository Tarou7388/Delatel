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


  public function getbyid($params = [])
  {

    $query = $this->pdo->prepare("SELECT * FROM tb_productos WHERE id_producto=?");
    $query->execute(
      [
        $params['id_producto']
      ]
    );
    return $query->fetch(PDO::FETCH_ASSOC);
  }

  public function getAll()
  {
    $query = $this->pdo->prepare("SELECT * FROM tb_productos");
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function add($params = []): bool
  {
    $status = false;
    try {
      $query = $this->pdo->prepare("CALL spu_productos_agregar(?,?,?,?,?)");
      $status = $query->execute(
        [
          $params['marca'],
          $params['tipo_producto'],
          $params['modelo'],
          $params['precio_actual'],
          $params['Codigo_Barras'],
        ]
      );
      return $status;
    } catch (Exception $e) {
      return $status = false;
    }

    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
}
