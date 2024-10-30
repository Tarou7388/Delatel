<?php
require_once 'Conexion.php';

class Medida extends Conexion
{
    private $pdo;
    public function __construct()
    {
        $this->pdo = parent::getConexion();
    }

    public function listarMedidas()
    {
        $sql = "SELECT * FROM vw_unidadmedida";
        return $this->listarDatos($sql);
    }
}
