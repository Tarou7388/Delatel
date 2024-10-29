<?php
require_once 'Conexion.php';

class Medidas extends Conexion
{
    private $pdo;
    public function __construct()
    {
        $this->pdo = parent::getConexion();
    }

    public function listarClientes()
    {
        $sql = "SELECT * FROM vw_medidas";
        return $this->listarDatos($sql);
    }
}
