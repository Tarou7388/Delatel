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
            $consulta = $this->pdo->prepare("CALL spu_clientes_registrar(?,?,?,?,?,?)");
            $status = $consulta->execute(array(
                $data["idPersona"],
                $data["idempresa"],
                $data["direccion"],
                $data["referencia"],
                $data["iduser_create"],
                $data["coordenadas"]
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
            $consulta = $this->pdo->prepare("CALL spu_clientes_actualizar(?,?,?,?,?,?,?,?,?)");
            $status = $consulta->execute(array(
                $data["identificador"],
                $data["nombre"],
                $data["apellidos"],
                $data["email"],
                $data["telefono"],
                $data["direccion"],
                $data["referencia"],
                $data["coordenadas"],
                $data["iduser_update"]
            ));
            return $status;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }



    public function getByPersona($params = [])
    {
        $consulta = $this->pdo->prepare("CALL spu_cliente_persona_buscar (?)");
        $consulta->execute(
            [$params['numDoc']]
        );
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getByEmpresa($params = [])
    {
        $consulta = $this->pdo->prepare("CALL spu_cliente_empresa_buscar(?)");
        $consulta->execute(
            [$params['numDoc']]
        );
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAll()
    {
        $consulta = $this->pdo->prepare("SELECT * FROM vw_clientes_listar");
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_ASSOC);
    }
}
