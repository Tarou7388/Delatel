<?php

require_once 'Conexion.php';

class Cliente extends Conexion
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Registra un nuevo cliente en la base de datos.
     *
     * Este método utiliza un procedimiento almacenado para registrar un cliente
     * con los datos proporcionados en el arreglo de parámetros.
     *
     * @param array $params Arreglo asociativo que contiene los siguientes elementos:
     * - idPersona: int Identificador de la persona.
     * - idPaquete: int Identificador del paquete.
     * - direccion: string Dirección del cliente.
     * - nota: string Nota adicional sobre el cliente.
     * - idUsuario: int Identificador del usuario que realiza la operación.
     * - fechaLimite: string Fecha límite para alguna acción relacionada con el cliente.
     * - iduser_create: int Identificador del usuario que crea el registro.
     *
     * @return bool El resultado sera verdadero si se realiza o falso si falla.
     */
    public function registrarCliente($params = [])
    {
        $sql = "CALL spu_clientes_registrar(?,?,?,?,?,?)";
        $values = array(
            $params['idPersona'],
            $params['idEmpresa'],
            $params['direccion'],
            $params['referencia'],
            $params['idUsuario'],
            $params['coordenadas']
        );
        return $this->registroValorDevolvido($sql, $values);
    }

    /**
     * Actualiza la información de un cliente en la base de datos.
     *
     * Este método llama a un procedimiento almacenado para actualizar los datos de un cliente
     * utilizando los parámetros proporcionados.
     *
     * @param array $params Arreglo asociativo que contiene los siguientes elementos:
     *  - idCliente (int): Identificador del cliente.
     *  - nombre (string): Nombre del cliente.
     *  - apellidos (string): Apellidos del cliente.
     *  - email (string): Correo electrónico del cliente.
     *  - telefono (string): Número de teléfono del cliente.
     *  - direccion (string): Dirección del cliente.
     *  - referencia (string): Referencia de la dirección del cliente.
     *  - coordenadas (string): Coordenadas geográficas de la dirección del cliente.
     *  - idUsuario (int): Identificador del usuario que realiza la actualización.
     *
     * @return mixed Resultado de la operación de actualización.
     */
    public function actualizarClienteNumdoc($params = [])
    {
        $sql = "CALL spu_clientesPersonas_actualizar(?,?,?,?,?,?,?,?,?)";
        $values = array(
            $params['identificador'],
            $params['nombre'],
            $params['apellidos'],
            $params['email'],
            $params['telefono'],
            $params['direccion'],
            $params['referencia'],
            $params['coordenadas'],
            $params['idUsuario']
        );
        return $this->registrar($sql, $values);
    }

    /**
     * Elimina un cliente de la base de datos.
     *
     * Este método llama a un procedimiento almacenado para eliminar un cliente
     * utilizando los parámetros proporcionados.
     *
     * @param array $params Arreglo asociativo que contiene los siguientes elementos:
     *                      - 'idCliente': Identificador del cliente a eliminar.
     *                      - 'idUsuario': Identificador del usuario que realiza la eliminación.
     * @return mixed Resultado de la operación de eliminación.
     */
    public function eliminarClienteNumdoc($params = [])
    {
        $sql = "CALL spu_clientes_eliminar(?,?)";
        $values = array(
            $params['idCliente'],
            $params['idUsuario']
        );
        return $this->registrar($sql, $values);
    }

    /**
     * Busca un cliente por su número de documento.
     *
     * Esta función ejecuta un procedimiento almacenado para buscar un cliente
     * en la base de datos utilizando su número de documento.
     *
     * @param array $params Parámetros para la búsqueda, debe contener:
     *                      - 'numDoc': El número de documento del cliente.
     * @return mixed El resultado de la consulta.
     */
    public function buscarClienteNumdoc($params = [])
    {
        $sql = "CALL spu_cliente_buscar_nrodoc(?)";
        $values = array(
            $params['numDoc']
        );
        return $this->consultaParametros($sql, $values);
    }

    /**
     * Busca un cliente por su número de RUC.
     *
     * @param array $params Parámetros de búsqueda, debe contener el índice 'numDoc' con el número de RUC del cliente.
     * @return mixed Resultado de la consulta.
     */
    public function buscarCLienteRuc($params = [])
    {
        $sql = "CALL spu_cliente_buscar_nrodoc(?)";
        $values = array(
            $params['numDoc']
        );
        return $this->consultaParametros($sql, $values);
    }

    /**
     * Lista todos los clientes.
     *
     * Esta función ejecuta una consulta SQL para obtener todos los registros
     * de la vista 'vw_clientes_obtener' y devuelve los datos obtenidos.
     *
     * @return array Los datos de los clientes listados.
     */
    public function listarClientes()
    {
        $sql = "SELECT * FROM vw_clientes_obtener";
        return $this->listarDatos($sql);
    }

    public function buscarNombreyApellido($params = [])
    {
        $sql = "CALL spu_cliente_buscar_nombreapp(?,?)";
        $values = array(
            $params['nombres'],
            $params['apellidos']
        );
        return $this->consultaParametros($sql, $values);
    }

    public function buscarClientebyId($params = [])
    {
        $sql = "CALL spu_buscar_datos_cliente_id(?)";
        $values = array(
            $params['idCliente']
        );
        return $this->consultaParametros($sql, $values);
    }
}
