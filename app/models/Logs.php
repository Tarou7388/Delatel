<?php

require_once 'Conexion.php';

class Logs extends Conexion
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }


    //ESTO ES EXPERIMENTAL, NO SE DEBE USAR
    public function obtenerRegistrosContrato($params = [])
    {
        $sql = "CALL sp_getlogs_by_table_and_id(?,?)";
        $values = array(
            $params['tbOption'], //esto para la tabla seleccionada 
            $params['idContrato']
        );
        return $this->consultaParametros($sql, $values);
    }
    public function obtenerDetallados($params = [])
    {
        $sql = "CALL sp_getlogs_cascade(?)";
        $values = array(
            $params['id']
        );
        return $this->consultaParametros($sql, $values);
    }
}
