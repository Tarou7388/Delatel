<?php
require_once "Conexion.php";

class Kardex extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function getall($params = [])
    {
        $query = $this->pdo->prepare("SELECT * FROM vs_kardex WHERE producto = ?");
        $query->execute([$params['producto']]);
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function add($params = [])
    {
        $query = $this->pdo->prepare("CALL ");
        $query->execute([
            $params['idcolaborador'],
            $params['idproducto'],
            $params['tipomovimiento'],
            $params['cantidad']
        ]);

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function filter($params = [])
    {
        try {
            $query = $this->pdo->prepare("CALL ");
            $query->execute(
                array(
                    $params['producto'],
                    $params['limit_n']
                )
            );
            return $query->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
}
