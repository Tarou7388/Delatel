<?php

require_once 'Conexion.php';

class Cliente extends Conexion{
    
    private $pdo;

    public function add($data = []){
        try{
            $consulta = $this->pdo->prepare("CALL spu_clientes_registrar(?,?,?,?,?)");
            $consulta->execute(array(
                $data["idPersona"],
                $data["idempresa"],
                $data["direccion"],
                $data["referencia"],
                $data["estado"]
            ));
        }
        catch(Exception $e){
            die($e->getMessage());
        }
    }
    public function getByDoc($params=[]){
        $consulta = $this->pdo->prepare("CALL sp_buscar_cliente_doc (?)");
        $consulta->execute(
            [$params['doc']]
        );
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
}