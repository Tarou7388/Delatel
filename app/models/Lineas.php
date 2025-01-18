<?php 

require_once 'Conexion.php';

class Lineas extends Conexion{
  
  private $pdo;

  public function __construct(){
    $this->pdo = Conexion::getConexion();
  }

  public function getLineas(){
    $sql = "SELECT * FROM tb_lineas WHERE inactive_at IS NULL";
    $respuesta = $this->listarDatos($sql);
    foreach($respuesta as $key => $value){
      $respuesta[$key]['coordenadas'] = json_decode($value['coordenadas'], true);
    }
    return $respuesta;
  }

  public function actualizarLineas($params = []){
    $sql = "CALL spu_actualizar_linea(?,?,?)";
    $array = [
      $params['id'],
      $params['coordenadas'],
      $params['idUsuario']
    ];
    return $this->registrar($sql, $array);
  }
}