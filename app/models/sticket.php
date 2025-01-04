<?php
require_once 'Conexion.php';

class Sticket extends Conexion {
  private $pdo;

  public function __construct() {
    $this->pdo = parent::getConexion();
  }
  
  /**
   * Listar todos los contratos pendientes.
   *
   * Este método ejecuta una consulta SQL para obtener todos los registros
   * de la vista 'vw_contratos_listar_ficha_null' que representan contratos pendientes.
   *
   * @return array Un arreglo de los registros obtenidos de la base de datos.
   */
  public function listarContratosPendientes() {
    $sql = "SELECT * FROM vw_contratos_listar_ficha_null";
    return $this->listarDatos($sql);
  }

  /**
   * Cuenta el número de clientes que tienen una ficha llena.
   *
   * Este método ejecuta una consulta SQL para contar los clientes que tienen una ficha llena
   * utilizando la vista `vw_clientes_contar_con_ficha_llena`.
   *
   * @return array Un arreglo con los datos de los clientes que tienen una ficha llena.
   */
  public function contarClientes(){
    $sql = "SELECT * FROM vw_clientes_contar_con_ficha_llena";
    return $this->listarDatos($sql);
  }

  /**
   * Cuenta el número de contratos pendientes.
   *
   * Esta función ejecuta una consulta SQL para contar los contratos pendientes
   * utilizando la vista `vw_contratos_contar_ficha_vacia`.
   *
   * @return array Lista de datos obtenidos de la consulta SQL.
   */
  public function contarContratosPendientes(){
    $sql = "SELECT * FROM vw_contratos_contar_ficha_vacia";
    return $this->listarDatos($sql);
  }
}
?>