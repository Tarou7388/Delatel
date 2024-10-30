<?php
require_once 'Conexion.php';

class Almacen extends Conexion
{
    private $pdo;
    public function __construct()
    {
        $this->pdo = parent::getConexion();
    }

    public function listarAlmacen()
    {
        $sql = "SELECT * FROM vw_almacen";
        return $this->listarDatos($sql);
    }
}
