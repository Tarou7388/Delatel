<?php 

require_once "Conexion.php";

class Persona extends Conexion{
    private $pdo;

    public function __CONSTRUCT(){
        $this->pdo = parent::getConexion();
    }

    public function registrar($data = []){
        try{
            $consulta = $this->pdo->prepare("CALL spu_personas_registrar(?,?,?,?,?,?)");
            $consulta->execute(array(
                $data["tipoDoc"],
                $data["nroDoc"],
                $data["apellidos"],
                $data["nombres"],
                $data["telefono"],
                $data["email"]
            ));
            return $consulta->fetch(PDO::FETCH_ASSOC);
        }
        catch(Exception $e){
            die($e->getMessage());
        }
    }
}
?>