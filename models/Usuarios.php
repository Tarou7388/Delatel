<?php

require_once "Conexion.php";

class Usuario extends Conexion
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function login($data = [])
    {
        try {
            $consulta = $this->pdo->prepare("CALL spu_login_usuarios(?)");
            $consulta->execute(
                array($data['nombreUser'])
            );

            return $consulta->fetch(PDO::FETCH_ASSOC);
        } 
        catch(Exception $e){
            die($e->getMessage());
        }
    }
}