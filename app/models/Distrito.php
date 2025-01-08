<?php
require_once 'Conexion.php';

class Distritos extends Conexion{
    private $pdo;
    public function __construct()
    {   
        $this -> pdo = parent::getConexion();
    }

    public function buscarDistrito($params=[]){
        $sql = "CALL spu_buscar_distrito(?)";
        $values = array(
            $params['idProvincia']
        );
        return $this->consultaParametros($sql,$values);
    } 
    public function listarLimites($params=[]){
        $sql = "CALL spu_buscar_distrito(?)";
        $values = array(
            $params['idDistrito']
        );
        return $this->consultaParametros($sql,$values);
    }
}