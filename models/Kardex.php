<?php
require_once "Conexion.php";

class Kardex extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    public function getAll()
    {
        $query = $this->pdo->prepare("SELECT * FROM vw_kardex");
        $query->execute();
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }


    public function getStockById($params = [])
    {
        $query = $this->pdo->prepare("SELECT saldo_total,precio_actual FROM vw_kardex WHERE id_producto = ?");

        $query->execute([$params['id_producto']]);

        return $query->fetch(PDO::FETCH_ASSOC);
    }

    public function add($params = []):bool
    {
        $status=false;
        try {
            $query = $this->pdo->prepare("CALL spu_kardex_registrar(?, ?, ?, ?, ?, ?,?)");
            $status = $query->execute([
                $params['id_producto'],
                $params['fecha'],
                $params['tipo_operacion'],
                $params['motivo'],
                $params['cantidad'],
                $params['valor_unitario_historico'],
                $params["iduser_create"]
            ]);
            return $status;
        } catch (Exception $e) {
            return $status = false;
            
        }
    }

    public function getbyidProducto($params = [])
    {
        try {
            $query = $this->pdo->prepare("CALL spu_kardex_filtrar(?)");
            $query->execute([
                $params['id_producto']
            ]);

            return $query->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
