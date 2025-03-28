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
        return $this->registrar($sql, $values);
    }

    public function actualizarMarca($params = [])
    {
        $sql = "CALL spu_marcas_actualizar(?, ?, ?)";
        $values = array(
            $params['idmarca'],
            $params['marca'],
            $params['iduserUpdate']
        );
        return $this->registrar($sql, $values);
    }

    // public function eliminarMarca($params = [])
    // {
    //     $sql = "CALL spu_marcas_eliminar(?, ?)";
    //     $values = array(
    //         $params['id_marca'],
    //         $params['iduserDelete']
    //     );
    //     return $this->consultaParametros($sql, $values);
    // }

    public function listarMarcaPorId($params = [])
    {
        $sql = "SELECT * FROM vw_marca WHERE id_marca = ?";
        $values = array(
            $params['idMarca']
        );
        return $this->consultaParametros($sql, $values);
    }
}
