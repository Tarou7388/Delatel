<?php

session_start();

require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['HOST'];

if (!isset($_SESSION['login']) || $_SESSION['login']['estado'] == false) {
  header("Location: $host");
  exit();
} else {
  $url = $_SERVER['REQUEST_URI'];
  $rutaCompleta = explode("/", $url);
  $rutaCompleta = array_filter($rutaCompleta);
  $totalElementos = count($rutaCompleta);

  $vistaActual = parse_url(end($rutaCompleta), PHP_URL_PATH);
  $listaAcceso = $_SESSION['login']['accesos'];
  $nombreUser = $_SESSION['login']['nombreUser'];
  $cargo = $_SESSION['login']['Cargo'];

  $i = 0;
  $encontrado = false;

  while (($i < count($listaAcceso)) && !$encontrado) {
    if ($listaAcceso[$i]['ruta'] == $vistaActual) {
      $encontrado = true;
      break;
    } elseif (isset($listaAcceso[$i]['rutasAnexas']) && in_array($vistaActual, $listaAcceso[$i]['rutasAnexas'])) {
      $encontrado = true;
      break;
    }
    $i++;
  }

  if (!$encontrado) {
    header("Location: $host");
    exit();
  }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="" />
  <meta name="author" content="" />
  <title>DELATEL</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" />
  <link href="https://cdn.datatables.net/v/dt/dt-2.1.3/datatables.min.css" rel="stylesheet">
  <link href="<?= $host ?>/css/styles.css" rel="stylesheet" />
  <link rel="stylesheet" href="<?= $host ?>/css/estilos.css">
</head>

<body class="sb-nav-fixed">

  <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
    <a class="navbar-brand ps-3" href="<?= $host; ?>dashboard.php">DELAFIBER</a>
    <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>

    <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
    </form>
    <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i>
          <?= $nombreUser ?> (<?= $cargo ?>)
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li><a class="dropdown-item" href="<?= $host ?>app/controllers/Usuario.controllers.php?operacion=cerrarSesion"><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a></li>
        </ul>
      </li>
    </ul>
  </nav>
  <div id="layoutSidenav">
    <div id="layoutSidenav_nav">
      <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div class="sb-sidenav-menu">
          <div class="nav">
            <div class="sb-sidenav-menu-heading">Inicio</div>
            <?php
            foreach ($listaAcceso as $acceso) {
              if (strpos($acceso['ruta'], 'views') !== false) {
                echo "
                <a class='nav-link' href='http://localhost/Delatel/{$acceso['ruta']}'>
                  <div class='sb-nav-link-icon'><i class='fa-solid {$acceso['icono']}'></i></div>
                  {$acceso['texto']}
                </a>
                ";
              }
            }
            ?>
            <div class="sb-sidenav-menu-heading">Módulos</div>

            <?php
            foreach ($listaAcceso as $acceso) {
              if (strpos($acceso['ruta'], 'views') === false) {
                echo "
              <a class='nav-link' href='http://localhost/Delatel/views/{$acceso['ruta']}'>
                <div class='sb-nav-link-icon'><i class='fa-solid {$acceso['icono']}'></i></div>
                {$acceso['texto']}
              </a>
              ";
              }
            }
            ?>
          </div>
        </div>
        <div class="sb-sidenav-footer">
        </div>
      </nav>
    </div>
    <div id="layoutSidenav_content">
      <main>
        <script>
          const user = <?php echo json_encode($_SESSION['login']); ?>;
        </script>