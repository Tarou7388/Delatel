<?php 
require_once 'Conexion.php';

class Averia extends Conexion{
    private $pdo;
    public function __construct()
    {   
        $this -> pdo = parent::getConexion();
    }
    /**
     * Busca averías asociadas a un contrato específico.
     *
     * @param array $params Arreglo asociativo que contiene el ID del contrato.
     *     - 'idContrato' (int): El ID del contrato para buscar las averías.
     * @return mixed Resultado de la consulta a la base de datos.
     */
    public function buscarAveriaPorContrato($params=[]){
        $sql = "CALL spu_averias_contratos_listar(?)";
        $values = array(
            $params['idContrato']
        );
        return $this->consultaParametros($sql,$values);
    }   
}