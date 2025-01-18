<?php
require_once 'Conexion.php';

class Soporte extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un registro de soporte en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para insertar un nuevo registro de soporte.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *  - id_contrato (int): El ID del contrato.
   *  - id_tipo_soporte (int): El ID del tipo de soporte.
   *  - fecha_hora_solicitud (date): La fecha y hora de la solicitud.
   *  - descripcion_problema (string): La descripción del problema.
   *  - descripcion_solucion (string): La descripción de la solución.
   *  - prioridad (string): La prioridad del soporte.
   *  - iduser_create (int): El ID del usuario que creó el registro.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarSoporte($params = [])
  {
    $sql = "CALL spu_registrar_fichasoporte(?,?,?,?,?,?,?)";
    //$soporteJson = json_encode($params['soporte']);
    $values = array(
      $params['idContrato'],
      $params['id_tecnico'],
      $params['fechaHoraSolicitud'],
      $params['descripcionProblema'],
      $params['descripcionSolucion'],
      $params['prioridad'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Método para el listado de los tipos de soporte en la tabla
   *
   * Este método llama a un procedimiento almacenado para hacer el listado 
   * en la tabla de tipo_soporte
   * 
   */
  public function listarTipoSoporte()
  {
    $sql = "SELECT * FROM vw_tiposoporte_listar";
    return $this->listarDatos($sql);
  }

  /**
   * Filtra los soportes por prioridad.
   *
   * Este método ejecuta un procedimiento almacenado que filtra los soportes
   * según su prioridad.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *  - prioridad (string): La prioridad del soporte.
   *
   * @return mixed El resultado de la búsqueda de objetos filtrados por prioridad.
   */
  public function filtrarSoportePrioridad($params = [])
  {
    $sql = "CALL spu_soporte_filtrar_prioridad(?)";
    $values = array($params['prioridad']);
    return $this->consultaParametros($sql, $values);
  }

  public function listarSoporte()
  {
    $sql = "SELECT * FROM vw_soporte_detalle";
    return $this->listarDatos($sql);
  }

  public function ObtenerDatosSoporteByID($params = [])
  {
    $sql = "SELECT * FROM vw_soporte_detalle WHERE id_soporte = ?";
    $values = array($params['idSoporte']);
    return $this->consultaParametros($sql, $values);
  }

  public function obtenerServiciosId($params = [])
  {
    $sql = "SELECT id_servicio, tipo_servicio FROM vw_servicios_listar WHERE id_servicio = ?";
    $values = array($params['idservicio']);
    return $this->consultaParametros($sql, $values);
  }

  public function actualizarSoporte($params = [])
  {
    $sql = "CALL spu_soporte_actualizar(?, ?, ?, ?, ?, ?)";

    $values = [
      $params['idSoporte'],
      $params['idTecnico'],
      $params['fechaHoraAsistencia'],
      json_encode($params['soporte']),
      $params['idUserUpdate'],
      $params['descripcion_solucion']
    ];

    return $this->registrar($sql, $values);
  }

  public function inhabilitarSoportebyID($params = [])
  {
    $sql = "CALL spu_soporte_eliminarbyId(?, ?)";

    $values = [
      $params['idSoporte'],
      $params['idUserInactive']
    ];

    return $this->registrar($sql, $values);
  }

  public function obtenerfichaInstalacionporIdSoporte($params = [])
  {
    $sql = "CALL spu_instalacion_ficha_IdSoporte(?)";
    $values = array($params['idSoporte']);
    return $this->consultaParametros($sql, $values);
  }

  public function buscarUltimoSoportebyDNI($params = [])
  {
    $sql = "CALL spu_buscar_ficha_por_dni(?,?,?)";
    $values = [
      $params['nrodoc'],
      $params['tipoServicio'],
      $params['coordenada']
    ];
    return $this->consultaParametros($sql, $values);
  }

  public function completarSoportebyId($params = [])
  {
    $sql = "CALL spu_soporte_CompletarbyId(?,?)";
    $values = [
      $params['idSoporte'],
      $params['idUserUpdate']
    ];
    return $this->consultaParametros($sql, $values);
  }

  /**
   * Obtiene el PDF de soporte basado en el ID proporcionado.
   *
   * @param array $params Arreglo asociativo que contiene el ID del soporte.
   *                      Ejemplo: ['idSoporte' => 123]
   * @return mixed Resultado de la consulta que contiene el PDF del soporte.
   */
  public function obtenerPDFSoporte($params = [])
  {
    $sql = "CALL spu_soporte_pdf(?)";
    $values = array($params['idSoporte']);
    return $this->consultaParametros($sql, $values);
  }

  /**
   * Obtiene el historial de soporte basado en el documento del cliente.
   *
   * @param string $docCliente El documento del cliente.
   * @return mixed El historial de soporte del cliente.
   */
  public function obtenerHistorialSoporte($params = [])
  {
    $sql = "CALL ObtenerHistorialSoporte(?)";
    $values = array($params['docCliente']);
    return $this->consultaParametros($sql, $values);
  }
}
