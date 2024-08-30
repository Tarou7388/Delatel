<?php

require_once "Conexion.php";

class Empresa extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function registrar($data = []):bool{
        $status = false;
        try{
            $consulta = $this->pdo->prepare("CALL spu_empresas_registrar(?,?,?,?,?,?)");
            $status =$consulta->execute(array(
                $data["ruc"],
                $data["representante_legal"],
                $data["razon_social"],
                $data["nombre_comercial"],
                $data["telefono"],
                $data["email"]
            ));
            return $status;
        }
        catch(Exception $e){
            die($e->getMessage());
        }
    }
}
