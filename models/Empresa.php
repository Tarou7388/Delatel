<?php

require_once "Conexion.php";

class Empresa extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function registrar($data = []){
        try{
            $consulta = $this->pdo->prepare("CALL spu_empresas_registrar(?,?,?,?,?,?,?)");
            $consulta->execute(array(
                $data["ruc"],
                $data["representante_legal"],
                $data["razon_social"],
                $data["nombre_comercial"],
                $data["telefono"],
                $data["email"],
                $data["iduser_create"]
            ));
            return $consulta->fetch(PDO::FETCH_ASSOC);;
        }
        catch(Exception $e){
            die($e->getMessage());
        }
    }
}
