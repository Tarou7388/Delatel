<?php

require_once "Conexion.php";

class Empresa extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Registra una nueva empresa en la base de datos.
     *
     * Este método llama a un procedimiento almacenado para insertar un nuevo registro de empresa.
     *
     * @param array $params Un array asociativo que contiene las siguientes claves:
     *                      - 'ruc' (string): El RUC (Registro Único de Contribuyentes) de la empresa.
     *                      - 'representante_legal' (string): El representante legal de la empresa.
     *                      - 'razon_social' (string): La razón social de la empresa.
     *                      - 'nombre_comercial' (string): El nombre comercial de la empresa.
     *                      - 'telefono' (string): El número de teléfono de la empresa.
     *                      - 'email' (string): La dirección de correo electrónico de la empresa.
     *                      - 'iduser_create' (int): El ID del usuario que crea el registro.
     *
     * @return bool El resultado sera verdadero si se realiza o falso si falla.
     */
    public function registrarEmpresa($params =   [])
    {
        $sql = "CALL spu_empresas_registrar(?,?,?,?,?,?,?)";
        $values = array(
            $params['ruc'],
            $params['representanteLegal'],
            $params['razonSocial'],
            $params['nombreComercial'],
            $params['telefono'],
            $params['email'],
            $params['idUsuario']
        );
        return $this->registroValorDevolvido($sql, $values);
    }

    /**
     * Busca la existencia de una empresa cliente por su RUC.
     *
     * @param array $params Arreglo asociativo que contiene los siguientes campos:
     * - 'ruc' (string): El RUC de la empresa cliente a buscar.
     * 
     * @return mixed Resultado de la consulta a la base de datos.
     */
    public function buscarEmpresaClienteRuc($params = [])
    {
        $sql = "CALL spu_empresa_cliente_existencia(?)";
        $values = array(
            $params['ruc']
        );
        return $this->consultaParametros($sql, $values);
    }

    public function buscarEmpresaClienteId($params = [])
    {
        $sql = "CALL spu_empresa_cliente_idEmpresa(?)";
        $values = array(
            $params['id']
        );
        return $this->consultaParametros($sql, $values);
    }
}
