<?php
require_once 'Conexion.php';

class Almacen extends Conexion
{
    private $pdo;
    public function __construct()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Lista todos los registros del almacén.
     *
     * Este método ejecuta una consulta SQL para seleccionar todos los registros
     * de la vista `vw_almacen` y devuelve los datos obtenidos.
     *
     * @return array Los datos listados del almacén.
     */
    public function listarAlmacen()
    {
        $sql = "SELECT * FROM vw_almacen";
        return $this->listarDatos($sql);
    }
}
