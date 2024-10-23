<?php 
require_once 'Conexion.php';

class Averia extends Conexion{
    private $pdo;
    public function __construct()
    {   
        $this -> pdo = parent::getConexion();
    }
    public function buscarAveriaPorContrato($params=[]){
        $sql = "CALL spu_averias_contratos_listar(?)";
        $values = array(
            $params['idContrato']
        );
        return $this->consultaParametros($sql,$values);
    }   
}