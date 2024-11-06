<?php

require_once 'Conexion.php';

class Contrato extends Conexion
{

    private $pdo;

    public function __CONSTRUCT()
    {
        $this->pdo = parent::getConexion();
    }

    /**
     * Registra un nuevo contrato en la base de datos llamando a un procedimiento almacenado.
     *
     * @param array $params Un array asociativo que contiene las siguientes claves:
     *                      - 'idCliente' (int): El ID del cliente.
     *                      - 'idTarifario' (int): El ID del tarifario.
     *                      - 'idSector' (int): El ID del sector.
     *                      - 'idUsuarioRegistro' (int): El ID del usuario que registra el contrato.
     *                      - 'direccion' (string): La dirección del contrato.
     *                      - 'referencia' (string): Una referencia para la dirección.
     *                      - 'coordenada' (string): Las coordenadas de la ubicación.
     *                      - 'fechaInicio' (string): La fecha de inicio del contrato.
     *                      - 'fechaFin' (string): La fecha de fin del contrato.
     *                      - 'fichaInstalacion' (string): El registro de instalación.
     *                      - 'nota' (string): Cualquier nota adicional.
     *                      - 'idUsuario' (int): El ID del usuario asociado con el contrato.
     *
     * @return bool El resultado sera verdadero si se realiza o falso si falla.
     */
    public function registrarContrato($params = [])
    {
        $sql = "CALL spu_contratos_registrar(?,?,?,?,?,?,?,?,?,?,?)";
        $values = array(
            $params['idCliente'],
            $params['idTarifario'],
            $params['idSector'],
            $params['direccion'],
            $params['referencia'],
            $params['coordenada'],
            $params['fechaInicio'],
            $params['fechaFin'],
            $params['fechaRegistro'],
            $params['nota'],
            $params['idUsuario']
        );
        return $this->registrar($sql, $values);
    }

    /**
     * Lista todos los contratos llamando al procedimiento almacenado 'vw_contratos_listar'.
     *
     * @return array El conjunto de resultados de la ejecución del procedimiento almacenado.
     */
    public function listarContratos($offset = 0, $limit = 10, $search = "")
    {
        $sql = "SELECT * FROM vw_contratos_listar";
        $sqlCount = "SELECT COUNT(*) AS total FROM vw_contratos_listar";
        if ($search) {
            $sql .= " WHERE nombre_cliente LIKE :search OR num_identificacion LIKE :search OR paquete LIKE :search OR direccion_servicio LIKE :search OR duracion LIKE :search";
            $sqlCount .= " WHERE nombre_cliente LIKE :search OR num_identificacion LIKE :search OR paquete LIKE :search OR direccion_servicio LIKE :search OR duracion LIKE :search";
        }
        $sql .= " LIMIT :offset, :limit";
        $stmt = $this->pdo->prepare($sql);
        if ($search) {
            $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
        }
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $contratos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmtCount = $this->pdo->prepare($sqlCount);
        if ($search) {
            $stmtCount->bindValue(':search', "%$search%", PDO::PARAM_STR);
        }
        $stmtCount->execute();
        $totalRegistros = $stmtCount->fetch(PDO::FETCH_ASSOC)['total'];

        return ['contratos' => $contratos, 'totalRegistros' => $totalRegistros];
    }

    /**
     * Elimina un contrato de la base de datos.
     *
     * Este método llama a un procedimiento almacenado para inactivar un contrato
     * específico basado en los parámetros proporcionados.
     *
     * @param array $params Arreglo asociativo que contiene los siguientes elementos:
     *                      - 'id' (int): El ID del contrato a eliminar.
     *                      - 'idUsuario' (int): El ID del usuario que realiza la eliminación.
     * @return mixed El resultado de la consulta a la base de datos.
     */
    public function eliminarContrato($params = [])
    {
        $sql = "CALL spu_contratos_eliminar(?,?)";
        $values = array(
            $params['id'],
            $params['idUsuario']
        );
        return $this->registrar($sql, $values);
    }

    /**
     * Busca un contrato por su ID.
     *
     * Esta función ejecuta un procedimiento almacenado para buscar un contrato
     * en la base de datos utilizando el ID proporcionado en los parámetros.
     *
     * @param array $params Un arreglo asociativo que contiene el ID del contrato a buscar.
     *                      Ejemplo: ['id' => 123]
     * @return mixed El resultado de la consulta a la base de datos.
     */
    public function buscarContratoId($params = [])
    {
        $sql = "CALL spu_contrato_buscar_id(?)";
        $values = array(
            $params['id']
        );
        return $this->consultaParametros($sql, $values);
    }

    /**
     * Busca la ficha de instalación por ID.
     *
     * Este método ejecuta un procedimiento almacenado para obtener la ficha técnica
     * de un contrato basado en el ID proporcionado en los parámetros.
     *
     * @param array $params Un array asociativo que contiene el ID de la ficha de instalación.
     *                      Ejemplo: ['id' => 123]
     * @return mixed El resultado de la consulta ejecutada.
     */
    public function buscarFichaInstalacionId($params = [])
    {
        $sql = "CALL spu_fichatecnica_buscar_id(?)";
        $values = array(
            $params['id']
        );
        return $this->consultaParametros($sql, $values);
    }

    /**
     * Guarda la ficha de instalación en la base de datos.
     *
     * Este método ejecuta un procedimiento almacenado para guardar la ficha técnica de instalación
     * en la base de datos utilizando los parámetros proporcionados.
     *
     * @param array $params Arreglo asociativo que contiene los siguientes elementos:
     *                      - 'id' (int): El ID del contrato.
     *                      - 'fichaInstalacion' (string): La ficha técnica de instalación.
     *                      - 'idUsuario' (int): El ID del usuario que realiza la operación.
     *
     * @return mixed El resultado de la consulta a la base de datos.
     */
    public function guardarFichaInstalacion($params = [])
    {
        $sql = "CALL spu_ficha_tecnica_registrar(?,?,?)";
        $values = array(
            $params['id'],
            $params['fichaInstalacion'],
            $params['idUsuario']
        );
        return $this->registrar($sql, $values);
    }


    /**
     * Busca los contratos asociados a un cliente por el por ID del cliente.
     *
     * Este método ejecuta un procedimiento almacenado para obtener el contrato 
     * mediante el ID del cliente proporcionado por el parametro
     *
     * @param array $params Un array asociativo que contiene el ID de la ficha de instalación.
     *                      Ejemplo: ['id' => 123]
     * @return mixed El resultado de la consulta ejecutada.
     */
    public function buscarContratoporClienteId($params = [])
    {
        $sql = "CALL spu_contratos_buscar_cliente(?)";
        $values = array(
            $params['id']
        );
        return $this->consultaParametros($sql, $values);
    }

    /**
     * Actualiza un contrato en la base de datos llamando a un procedimiento almacenado.
     *
     * @param array $params Un array asociativo que contiene las siguientes claves:
     *                      - 'idContrato' (int): El ID del contrato.
     *                      - 'idTarifario' (int): El ID del tarifario.
     *                      - 'idSector' (int): El ID del sector.
     *                      - 'direccionServicio' (string): La dirección del servicio.
     *                      - 'referencia' (string): Una referencia para la dirección.
     *                      - 'coordenada' (string): Las coordenadas de la ubicación.
     *                      - 'fechaInicio' (string): La fecha de inicio del contrato.
     *                      - 'fechaFin' (string): La fecha de fin del contrato.
     *                      - 'fechaRegistro' (string): La fecha de registro del contrato.
     *                      - 'nota' (string): Cualquier nota adicional.
     *                      - 'idUsuarioUpdate' (int): El ID del usuario que actualiza el contrato.
     *
     * @return bool El resultado será verdadero si se realiza o falso si falla.
     */
    public function actualizarContrato($params = [])
    {
        $sql = "CALL spu_contratos_actualizar(?,?,?,?,?,?,?)";
        $values = array(
            $params['idContrato'],
            $params['idPaquete'],
            $params['direccionServicio'],
            $params['referencia'],
            $params['coordenada'],
            $params['nota'],
            $params['idUsuarioUpdate']
        );
        return $this->registrar($sql, $values);
    }

    /**
     * Lista las fichas de instalación que están por completar.
     *
     * Este método ejecuta una consulta SQL para obtener todas las filas de la vista
     * `vw_fichainstalacion_filtrar`, que contiene las fichas de instalación que aún
     * no han sido completadas.
     *
     * @return array Un arreglo con los datos de las fichas de instalación filtradas.
     */
    public function listarFichaInstalacionFiltro()
    {
        $sql = "SELECT * FROM vw_fichainstalacion_filtrar";
        return $this->listarDatos($sql);
    }
}
