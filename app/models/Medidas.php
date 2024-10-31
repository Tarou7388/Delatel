<?php
require_once 'Conexion.php';

class Medida extends Conexion
{
    private $pdo;
    public function __construct()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Listar todas las medidas desde la vista 'vw_unidadmedida'.
     *
     * Campos mostrados:
     * - id_unidad
     * - unidad_nombre
     * - create_at
     * - update_at
     * - iduser_create
     * - iduser_update
     *
     * @return array Un arreglo con los datos de las medidas.
     */
    public function listarMedidas()
    {
        $sql = "SELECT * FROM vw_unidadmedida";
        return $this->listarDatos($sql);
    }
}
