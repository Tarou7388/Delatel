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
    $query = $this->pdo->prepare("SELECT * FROM tb_productos ORDER BY id_producto DESC");
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function add($params = []): bool
  {
    $status = false;
    try {
      $query = $this->pdo->prepare("CALL spu_productos_agregar(?,?,?,?,?,?)");
      $status = $query->execute(
        [
          $params['marca'],
          $params['tipo_producto'],
          $params['modelo'],
          $params['precio_actual'],
          $params['Codigo_Barras'],
          $params["iduser_create"]
          
        ]
      );
      return $status;
    } catch (Exception $e) {
      return $status = false;
    }

    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function updateProducto($data = []): bool
  {
    try {
      $query = $this->pdo->prepare("CALL spu_productos_actualizar(?, ?, ?, ?, ?, ?,?)");
      $status = $query->execute(
        [
          $data["id_producto"],
          $data["marca"],
          $data["tipo_producto"],
          $data["modelo"],
          $data["precio_actual"],
          $data["codigo_barra"],
          $data["iduser_update"]
        ]
      );
      return $status;
    } catch (Exception $e) {
      error_log($e->getMessage()); // Opcional: Para registrar errores
      return false;
    }
  }
}
