<?php

require_once 'Conexion.php';

class Producto extends Conexion{

    private $pdo; 

    //Constructor
    public function __CONSTRUCT(){
        $this->pdo = parent::getConexion(); 
    }

    //Función para registrar el producto
    public function add($params = []):int{
        $idproducto = null;
        try{
            $query = $this->pdo->prepare("call spu_productos_registrar(?,?,?,?)");
            $query->execute(
                array(
                    $params['idmarca'],
                    $params['idtipoproducto'],
                    $params['descripcion'],
                    $params['modelo']
                )
            );
            $row = $query->fetch(PDO::FETCH_ASSOC);
            $idproducto = $row['idproducto'];
        }
        catch(Exception $e){
            $idproducto = -1;
        }
        return $idproducto; 
    }
}