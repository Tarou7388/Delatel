<?php
require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['HOST'];
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
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  <link href="<?= $host ?>/css/styles.css" rel="stylesheet" />
  <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
</head>

<body class="sb-nav-fixed">

  <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
    <!-- Navbar Brand-->
    <a class="navbar-brand ps-3" href="<?= $host; ?>dashboard.php">Dashboard Delatel</a>
    <!-- Sidebar Toggle-->
    <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
    <!-- Navbar Search-->
    <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
      <div class="input-group">
        <input class="form-control" type="text" placeholder="Buscar cliente" aria-label="Search for..." aria-describedby="btnNavbarSearch" />
        <button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>
      </div>
    </form>
    <!-- Navbar-->
    <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li><a class="dropdown-item" href="#!">Configuracion</a></li>
          <li><a class="dropdown-item" href="#!">Cambiar contraseña</a></li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li><a class="dropdown-item" href="<?= $host ?>/controllers/Colaborador.controller.php?operacion=destroy">Cerrar Sesion</a></li>
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
              <div class="sb-nav-link-icon"><i class="fa-solid fa-house"></i></div>
              Dashboard
            </a>
            <div class="sb-sidenav-menu-heading">Módulos</div>

            <!-- Boton Desplegable para Soporte *Puede usarlo si lo necesitan!-->
            <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="false" aria-controls="collapseExample">
              <div class="sb-nav-link-icon"><i class="fa-solid fa-wrench"></i></div>
              Soporte 
            </a>
            <div class="collapse" id="collapse1">
              <div class="ps-4">
                <a class="nav-link" href="<?= $host; ?>views/Ficha_GPON.php">
                  <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                  Ficha Averias GPON
                </a>
                <a class="nav-link" href="<?= $host; ?>views/Ficha_WISP.php">
                  <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                  Ficha Averias WISP
                </a>
              </div>
            </div>

            <!-- Boton Desplegable para Instalaciones *Puede usarlo si lo necesitan!-->
            <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapseExample">
              <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
              Instalacion
            </a>
            <div class="collapse" id="collapse2">
              <div class="ps-4">
                <a class="nav-link" href="<?= $host; ?>views/instalacion_wisp.php">
                  <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                  Ficha Instalacion WISP
                </a>
                <a class="nav-link" href="<?= $host; ?>views/contratos.php">
                  <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                  Contratos
                </a>
              </div>
            </div>


            <!-- Boton Desplegable para Kardex/Productos *Puede usarlo si lo necesitan!-->
            <a class="nav-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapseExample">
              <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
              Inventariado
            </a>
            <div class="collapse" id="collapse3">
              <div class="ps-4">
                <!-- KARDEX!-->
                <a class="nav-link" href="<?= $host; ?>views/kardex.php">
                  <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                  Kardex
                </a>
                <!-- Productos!-->
                <a class="nav-link" href="<?= $host; ?>views/productos.php">
                  <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                  Productos
                </a>
              </div>
            </div>

            

            <!-- Empresas!-->
            <a class="nav-link" href="#">
              <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
              Empresas
            </a>
            <!-- Personas!-->
            <a class="nav-link" href="#">
              <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
              Personas
            </a>
            
            <!-- Roles!-->
            <a class="nav-link" href="<?= $host; ?>views/roles.php">
              <div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
              Roles
            </a>

          </div>
        </div>
        <div class="sb-sidenav-footer">
          <div class="small">Logged in as:</div>
          Start Bootstrap
        </div>
      </nav>
    </div>
    <div id="layoutSidenav_content">
      <main>