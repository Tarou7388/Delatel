<?php
require_once 'Conexion.php';

class Marca extends Conexion
{
    private $pdo;
    public function __construct()
    {
        $this->pdo = parent::getConexion();
    }

    public function listarMarcas()
    {
        $sql = "SELECT * FROM vw_marca";
        return $this->listarDatos($sql);
    }
}
