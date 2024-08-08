<?php

require_once 'Conexion.php';

class Kardex extends Conexion{
    
    private $pdo; 

    //Constructor
    public function __CONSTRUCT(){
        $this->pdo = parent::getConexion();
    }

    //Función para registrar el kardex 
    public function add($params = []):bool{
        $status = false; 
        try{
            $query = $this->pdo->prepare("call spu_kardex_registrar(?,?,?,?)"); 
            $query->execute(
                array(
                    $params['idcolaborador'],
                    $params['idproducto'],
                    $params['tipomovimiento'],
                    $params['cantidad']
                )
            );
            return $status; 
        }
        catch(Exception $e){
            die($e->getMessage());
        }
    }

    //Función para mostrar el stock actual del producto
    public function mostrarStockActual($params = []){
        try {
            $query = $this->pdo->prepare("SELECT stockactual FROM kardex WHERE idproducto = ? ORDER BY created_at DESC LIMIT 1");
            $query->execute(array($params['idproducto']));
            //Devuelve el valor de la primera columna 
            $stockactual = $query->fetchColumn();
            //Si el stock actual no tiene valor mostrará 0
            return $stockactual !== false ? $stockactual : 0; 
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }  

    //Función para el reporte Pdf del producto
    public function getkardex($params = []){
        try{
            $query = $this->pdo->prepare("call spu_producto_pdf(?)");
            $query->execute(array($params['idtipoproducto']));
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        catch(Exception $e){
            die($e->getMessage());
        }
    }
}