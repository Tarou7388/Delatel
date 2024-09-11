<?php

require_once 'Conexion.php';

class Contrato extends Conexion
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function add($datos = []): bool
    {
        try {
            $status = false;
            $query = "CALL spu_contratos_registrar(?,?,?,?,?,?,?,?,?,?,?,?)";
            $cmd = $this->pdo->prepare($query);
            $status = $cmd->execute(
                array(
                    $datos["idCliente"],
                    $datos["idTarifario"],
                    $datos["idSector"],
                    $datos["idUsuarioRegistro"],
                    $datos["direccion"],
                    $datos["referencia"],
                    $datos["coordenada"],
                    $datos["fechaInicio"],
                    $datos["fechaFin"],
                    $datos["fechaRegistro"],
                    $datos["fichaInstalacion"],
                    $datos["nota"]
                )
            );
            return $status;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
    public function getAll(): array
    {
        try {
            $query = $this->pdo->prepare("CALL spu_contratos_listar()");
            $query->execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
}
