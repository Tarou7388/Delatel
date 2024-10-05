
<?php

class Conexion
{

  private $servidor = "127.0.0.1";
  private $puerto = "3306";
  private $baseDatos = "Delatel";
  private $usuario = "root";
  private $clave = "";

  public function getConexion()
  {

    try {

      $pdo = new PDO(
        "mysql:host={$this->servidor};
        port={$this->puerto};
        dbname={$this->baseDatos};
        charset=UTF8",
        $this->usuario,
        $this->clave
      );

      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $pdo;
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }

  /**
   * Ejecuta una consulta SQL dada y devuelve el resultado como un array asociativo.
   *
   * @param string $sql La consulta SQL a ejecutar.
   * @return array El conjunto de resultados como un array asociativo.
   * @throws Exception Si hay un error al ejecutar la consulta.
   */
  public function listarDatos($sql)
  {
    try {
      $conexion = $this->getConexion();
      $consulta = $conexion->prepare($sql);
      $consulta->execute();
      return $consulta->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }

  /**
   * Ejecuta una declaración SQL preparada con los parámetros dados.
   *
   * @param string $sql La consulta SQL que se va a ejecutar.
   * @param array $params Un array de parámetros para enlazar a la consulta SQL.
   * @return bool Devuelve true en caso de ejecución exitosa, false en caso contrario.
   * @throws Exception Si ocurre un error durante la ejecución de la consulta.
   */
  public function registrar($sql, $params = [])
  {
    try {
      $status = false;
      $conexion = $this->getConexion();
      $consulta = $conexion->prepare($sql);

      foreach ($params as $index => $value) {
        $consulta->bindValue($index + 1, $value);
      }

      $status = $consulta->execute();
      return $status;
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }

  /**
   * Realiza una consulta SQL con parámetros y devuelve los resultados.
   *
   * @param string $sql La consulta SQL a ejecutar.
   * @param array $params (Opcional) Un array de parámetros para la consulta.
   * @return array Un array asociativo con los resultados de la consulta.
   * @throws Exception Si ocurre un error durante la ejecución de la consulta.
   */
  public function consultaParametros($sql, $params = [])
  {
    try {
      $conexion = $this->getConexion();
      $consulta = $conexion->prepare($sql);

      foreach ($params as $index => $value) {
        $consulta->bindValue($index + 1, $value);
      }

      $consulta->execute();
      return $consulta->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }

  public function buscarObjeto($sql, $params = [])
  {
    try {
      $conexion = $this->getConexion();
      $consulta = $conexion->prepare($sql);

      foreach ($params as $index => $value) {
        $consulta->bindValue($index + 1, $value);
      }

      $consulta->execute();
      return $consulta->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      die($e->getMessage());
    }
  }
  
}
