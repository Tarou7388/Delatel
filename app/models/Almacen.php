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

    public function listarAlmacenPorId($id)
    {
        $sql = "SELECT * FROM vw_almacen WHERE id_almacen = ?";
        return $this->consultaParametros($sql, [$id]);
    }

    public function registrarAlmacen($params = [])
    {
        $sql = "CALL spu_registrar_almacen(?, ?, ?, ?)";
        $datos = array($params['nombre'], $params['ubicacion'], $params['coordenada'], $params['idUsuario']);
        return $this->registrar($sql, $datos);
    }

    public function actualizarAlmacen($params = [])
    {
        $sql = "CALL spu_actualizar_almacen(?, ?, ?, ?, ?)";
        $datos = array($params['id'], $params['nombre'], $params['ubicacion'], $params['coordenada'], $params['idUsuario']);
        return $this->registrar($sql, $datos);
    }

    public function eliminarAlmacen($id)
    {
        $sql = "CALL spu_eliminar_almacen(?)";
        return $this->registrar($sql, [$id]);
    }
}
