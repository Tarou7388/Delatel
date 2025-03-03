<?php
require_once 'Conexion.php';

class Marca extends Conexion
{
    private $pdo;
    public function __construct()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Listar todas las marcas activas.
     *
     * Esta función ejecuta una consulta SQL para seleccionar todas las marcas
     * activas desde la vista `vw_marca`. La vista `vw_marca` se define como una
     * selección de las columnas `id_marca`, `marca`, `create_at` y `iduser_create`
     * de la tabla `tb_marca`, donde la columna `inactive_at` es NULL.
     *
     * @return array Un arreglo con los datos de las marcas activas.
     */
    public function listarMarcas()
    {
        $sql = "SELECT * FROM vw_marca";
        return $this->listarDatos($sql);
    }
    public function registrarMarca($params = [])
    {
        $sql = "CALL spu_registrar_marca(?, ?)";
        $values = array(
            $params['marca'], 
            $params['idUsuario']
        );
        return $this->consultaParametros($sql, $values);
    }
}
