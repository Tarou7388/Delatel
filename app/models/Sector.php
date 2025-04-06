<?php
require_once 'Conexion.php';

class Sector extends Conexion
{
  private $pdo;

  public function __construct()
  {
    $this->pdo = parent::getConexion();
  }

  /**
   * Registra un nuevo sector en la base de datos.
   *
   * Este método llama a un procedimiento almacenado para insertar un nuevo registro de sector.
   *
   * @param array $params Un array asociativo que contiene las siguientes claves:
   *                      - 'id_distrito' (int): El ID del distrito.
   *                      - 'sector' (string): El nombre del sector.
   *                      - 'iduser_create' (int): El ID del usuario que crea el sector.
   *
   * @return bool El resultado sera verdadero si se realiza o falso si falla.
   */
  public function registrarSector($params = [])
  {
    $sql = "CALL spu_sectores_registrar(?,?,?,?,?)";
    $values = array(
      $params['idDistrito'],
      $params['sector'],
      $params['descripcion'],
      $params['coordenadas'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  /**
   * Listar todos los sectores.
   *
   * Este método ejecuta una consulta SQL para seleccionar todos los registros
   * de la vista 'vw_listar_sectores' y devuelve los datos obtenidos.
   *
   * @return array Un array con los datos de los sectores.
   */
  public function listarSectores()
  {
    $sql = "SELECT * FROM vw_sectores_listar";
    return $this->listarDatos($sql);
  }

  public function listarSectoresMapa()
  {
    $sql = "SELECT id_sector, sector as 'nombre', descripcion, coordenadas, direccion  FROM vw_sectores_obtener WHERE inactive_at IS NULL";
    return $this->listarDatos($sql);
  }

  public function listarSectoresPorDistrito($idDistrito)
  {
    $sql = "SELECT * FROM vw_sectores_listar WHERE id_distrito = ?";
    return $this->listarDatos($sql, [$idDistrito]);
  }

  public function desactivarSector($params = [])
  {
    $sql = "CALL spu_sector_desactivar(?,?)";
    $values = array(
      $params['idSector'],
      $params['idUsuario']
    );
    return $this->registrar($sql, $values);
  }

  public function sectoresBuscarMultiple($idsString)
  {
    try {
      $sql = "CALL spu_sectores_buscar_multiple(?)";
      return $this->consultaParametros($sql, [$idsString]);
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }

  public function buscarSector($params = [])
  {
    $sql = "SELECT * FROM vw_sectores_obtener WHERE id_sector = ?";
    return $this->consultaParametros($sql, [$params['idSector']]);
  }


  public function buscarCajasporSector($params = [])
  {
    $sql = "CALL spu_buscar_cajas_por_sector(?)";
    $values = array(
      $params['idSector']
    );
    return $this->consultaParametros($sql, $values);
  }
}
