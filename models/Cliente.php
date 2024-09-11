<?php

require_once 'Conexion.php';

class Cliente extends Conexion
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }


    public function add($data = [])
    {
        $status = false;
        try {
            $consulta = $this->pdo->prepare("CALL spu_clientes_registrar(?,?,?,?,?)");
            $status= $consulta->execute(array(
                $data["idPersona"],
                $data["idempresa"],
                $data["direccion"],
                $data["referencia"],
                $data["iduser_create"]
            ));
            return $status;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function update($data = []): bool
    {
        $status = false;
        try {
            $consulta = $this->pdo->prepare("CALL spu_clientes_actualizar(?,?,?,?,?,?)");
            $status = $consulta->execute(array(
                $data["id_persona"],
                $data["id_empresa"],
                $data["direccion"],
                $data["referencia"],
                $data["iduser_update"],
                $data["id_cliente"],
            ));
            return $status;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function getByDni($params = [])
    {
        $consulta = $this->pdo->prepare("CALL spu_cliente_dni_buscar (?)");
        $consulta->execute(
            [$params['dni']]
        );
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getByRuc($params=[]){
        $consulta = $this->pdo->prepare("CALL spu_cliente_ruc_buscar (?)");
        $consulta->execute(
            [$params['ruc']]
        );
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
}
