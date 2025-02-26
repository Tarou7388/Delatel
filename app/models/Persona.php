<?php

require_once "Conexion.php";

class Persona extends Conexion
{
    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Registra una nueva persona en la base de datos llamando a un procedimiento almacenado.
     *
     * @param array $params Un array asociativo que contiene las siguientes claves:
     *                      - 'tipoDoc' (string): El tipo de documento.
     *                      - 'nroDoc' (string): El número de documento.
     *                      - 'apellidos' (string): Los apellidos de la persona.
     *                      - 'nombres' (string): Los nombres de la persona.
     *                      - 'telefono' (string): El número de teléfono de la persona.
     *                      - 'nacionalidad' (string): La nacionalidad de la persona.
     *                      - 'email' (string): La dirección de correo electrónico de la persona.
     *                      - 'idUsuario' (int): El ID de usuario asociado con la persona.
     *
     * @return bool El resultado sera un ID de la persona si se realiza correctamente
     */
    public function registrarPersona($params = [])
    {
        $sql = "CALL spu_personas_registrar(?,?,?,?,?,?,?,?)";
        $values = array(
            $params['tipoDoc'],
            $params['nroDoc'],
            $params['apellidos'],
            $params['nombres'],
            $params['telefono'],
            $params['nacionalidad'],
            $params['email'],
            $params['idUsuario']
        );
        return $this->registroValorDevolvido($sql, $values);
    }

    /**
     * Busca una persona por su número de documento (DNI).
     *
     * Esta función ejecuta un procedimiento almacenado que busca una persona
     * en la base de datos utilizando su número de documento (DNI).
     *
     * @param array $params Un arreglo asociativo que contiene el número de documento (DNI) con la clave 'nroDoc'.
     * @return mixed El resultado de la consulta a la base de datos.
     */
    public function buscarPersonaDni($params = [])
    {
        $sql = "CALL spu_personas_buscar_dni(?)";
        $values = array(
            $params['dni']
        );
        return $this->consultaParametros($sql, $values);
    }

    /**
     * Busca la existencia de una persona cliente por su número de documento (DNI).
     *
     * @param array $params Arreglo asociativo que contiene el número de documento (DNI) con la clave 'nroDoc'.
     * @return mixed Resultado de la consulta a la base de datos.
     */
    public function buscarPersonaClienteDni($params = [])
    {
        $sql = "CALL spu_persona_cliente_existencia(?)";
        $values = array(
            $params['nroDoc']
        );
        return $this->consultaParametros($sql, $values);
    }

    
    public function buscarClientebyIdPersona($params = []) 
    {
        $sql = "CALL spu_buscar_datos_cliente_idPersona(?)";
        $values = array(
            $params['id']
        );
        return $this->consultaParametros($sql, $values);
    }

}
