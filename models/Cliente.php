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
        try {
            $consulta = $this->pdo->prepare("CALL spu_clientes_registrar(?,?,?,?,?)");
            $consulta->execute(array(
                $data["idPersona"],
                $data["idempresa"],
                $data["direccion"],
                $data["referencia"],
                $data["iduser_create"]
            ));
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

    public function getByDoc($params = [])
    {
        $consulta = $this->pdo->prepare("CALL sp_buscar_cliente_doc (?)");
        $consulta->execute(
            [$params['doc']]
        );
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
}
