<?php

session_start();

$permisos = $_SESSION['permisos'];

require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['HOST'];

/* if (!isset($_SESSION['login']) || (isset($_SESSION['login']) && !$_SESSION['login']['estado'])) {
  //Te vas a tu casa...
  header("Location: $host");
} */


?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="" />
  <meta name="author" content="" />
  <title>Dashboard - SB Admin</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" />
  <link href="https://cdn.datatables.net/v/dt/dt-2.1.3/datatables.min.css" rel="stylesheet">
  <link href="<?= $host ?>/css/styles.css" rel="stylesheet" />
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
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li><a class="dropdown-item" href="<?= $host ?>app/controllers/Usuarios.controllers.php?Operacion=CerrarSesion"><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</a></li>
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
            <a class="nav-link" href="<?= $host; ?>dashboard.php">
              <div class="sb-nav-link-icon"><i class="fa-solid fa-chart-line"></i></div>
              Actividades
            </a>
            <div class="sb-sidenav-menu-heading">Módulos</div>

            <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapseExample" id=molSoporte>
              <div class="sb-nav-link-icon"><i class="fa-solid fa-wrench"></i></div>
              Soporte Tecnico
            </a>

            <div class="collapse" id="collapse1">
              <div class="ps-4">
                <a class="nav-link" href="<?= $host; ?>views/Soporte/index.php">
                  <div class="sb-nav-link-icon"><i class="fa-solid fa-wrench"></i></div>
                  Ficha de Soporte
                </a>
                <!-- <a class="nav-link" href="<?= $host; ?>views/Soporte/SoporteEscritorio.php">
                  <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                  Ficha Soporte Escritorio
                </a> -->
              </div>
            </div>
            <a class="nav-link" href="<?= $host; ?>views/Contactabilidad/">
              <div class="sb-nav-link-icon"><i class="fa-solid fa-phone"></i></div>
              Contactabilidad
            </a>
            <!-- <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapseExample" id=molContratos >
              <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
              Contactabilidad
            </a> -->
            <!-- <div class="collapse" id="collapse5">
              <div class="ps-4">
                
              </div>
            </div> -->


            <a class="nav-link" href="<?= $host; ?>views/Contratos/" id=molContratos>
              <div class="sb-nav-link-icon"><i class="fa-solid fa-file-contract"></i></div>
              Contratos
            </a>


            <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapseExample" id=molInventariado>
              <div class="sb-nav-link-icon"><i class="fa-solid fa-warehouse"></i></div>
              Inventariado
            </a>

            <div class="collapse" id="collapse3">
              <div class="ps-4">
                <a class="nav-link" href="<?= $host; ?>views/Inventariado/">
                  <div class="sb-nav-link-icon"><i class="fa-solid fa-cart-flatbed"></i></div>
                  Kardex
                </a>
                <a class="nav-link" href="<?= $host; ?>views/Productos/">
                  <div class="sb-nav-link-icon"><i class="fa-solid fa-boxes-stacked"></i></div>
                  Productos
                </a>
              </div>
            </div>


            <a class="nav-link" href="<?= $host; ?>views/Usuarios/">
              <div class="sb-nav-link-icon"><i class="fa-solid fa-users"></i></div>
              Usuarios
            </a>
            <a class="nav-link" href="<?= $host; ?>views/Personas/">
              <div class="sb-nav-link-icon"><i class="fa-solid fa-user"></i></div>
              Clientes
            </a>
            <!-- <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapseExample" id=molPersonas>
              <div class="sb-nav-link-icon"><i class="fa-solid fa-person"></i></div>
              Personas
            </a>

            <div class="collapse" id="collapse4">
              <div class="ps-4">
                
              </div>
            </div> -->

            <a class="nav-link" href="<?= $host; ?>views/Roles/" id=molRoles>
              <div class="sb-nav-link-icon"><i class="fa-regular fa-address-card"></i></div>
              Roles
            </a>

          </div>
        </div>
        <div class="sb-sidenav-footer">
        </div>
      </nav>
    </div>
    <div id="layoutSidenav_content">
      <main>
        <!-- <script>
          const permisos = <?php echo json_encode($permisos); ?>;
          const user = <?php echo json_encode($_SESSION['login']); ?>;
        </script> -->
        <script src="<?= $host ?>js/Header.js"></script>