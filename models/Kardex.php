<?php
require_once "Conexion.php";

class Kardex extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function getAll($params = [])
    {
        $query = $this->pdo->prepare("SELECT * FROM vs_kardex WHERE producto = ?");
        $query->execute([$params['producto']]);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function add($params = [])
    {
        try {
            $query = $this->pdo->prepare("CALL spu_registrar_kardex(?, ?, ?, ?, ?, ?)");
            $query->execute([
                $params['id_producto'],
                $params['fecha'],
                $params['tipo_operacion'],
                $params['motivo'],
                $params['cantidad'],
                $params['valor_unitario_historico']
            ]);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
