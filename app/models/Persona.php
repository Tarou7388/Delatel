<?php

require_once "Conexion.php";

class Persona extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function registrar($data = [])
    {
        try {
            $consulta = $this->pdo->prepare("CALL spu_personas_registrar(?,?,?,?,?,?,?,?)");
            $consulta->execute(array(
                $data["tipoDoc"],
                $data["nroDoc"],
                $data["apellidos"],
                $data["nombres"],
                $data["telefono"],
                $data["nacionalidad"],
                $data["email"],
                $data["iduser_create"]
            ));
            return $consulta->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function VerificarRegs($data = [])
    {
        try {
            $consulta = $this->pdo->prepare("CALL spu_personas_buscar_por_dni(?)");
            $consulta->execute(array($data["DNI"]));
            return $consulta->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
}
