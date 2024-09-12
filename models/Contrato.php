<?php

require_once 'Conexion.php';

class Contrato extends Conexion
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Agrega un nuevo contrato a la base de datos.
     *
     * @param array $datos Los datos del contrato.
     * @return bool Retorna true si el contrato se agregó correctamente, false en caso contrario.
     */
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
    
    /**
     * Obtiene todos los contratos de la base de datos.
     *
     * @return array Un array que contiene todos los contratos como arrays asociativos.
     * @throws Exception Si ocurre un error al obtener los contratos.
     */
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

    /**
     * Elimina de manera logica un contrato de la base de datos.
     *
     * @param array $params Los parámetros para eliminar el contrato.
     *                      - id: El ID del contrato a eliminar.
     * @return bool Retorna true si el contrato se elimina correctamente, false en caso contrario.
     * @throws Exception Si ocurre un error al eliminar el contrato.
     */
    public function delete($params = []){
        try {
            $query = $this->pdo->prepare("CALL spu_contratos_eliminar(?)");
            $query->execute(array(
                $params["id"]
            ));
            return true;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
}
