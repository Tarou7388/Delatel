<?php
session_start();

require __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$host = $_ENV['HOST'];

if (isset($_SESSION['login']) && $_SESSION['login']['estado']) {
	header("Location: $host/views");
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
	<title>Login - SB Admin</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
	<link href="css/styles.css" rel="stylesheet" />
	<script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
</head>

<body id="fondo-login">
	<div id="layoutAuthentication">
		<div id="layoutAuthentication_content">
			<main>
				<div class="container">
					<div class="row justify-content-center">
						<div class="col-lg-4">
							<div class="card shadow-lg border-0 rounded-lg custom-margin">
								<div class="card-body">
									<div class="text-center mb-4">
										<img src="./image/Logotipo.png" class="Logo" alt="Logo">
										<h3 class="mt-3 fw-normal">Iniciar sesión</h3>
									</div>
									<form id="frmLogin">
										<div class="form-floating mb-3">
											<input type="text" class="form-control" id="txtNomUser" placeholder="Nombre Usuario">
											<label for="lblNomUser"><i class="bi bi-person"></i> Nombre de Usuario</label>
										</div>
										<div class="form-floating mb-3 position-relative">
											<input type="password" class="form-control" id="txtPassUser" placeholder="Clave de Acceso">
											<label for="lblPassUser"><i class="bi bi-lock"></i> Clave de Acceso</label>
											<button type="button" class="btn position-absolute end-0 top-0 mt-2 me-3" id="togglePassword">
												<i class="bi bi-eye" id="eyeIcon"></i>
											</button>
										</div>
										<button class="btn btn-custom w-100 py-2" id="btnIniciar" type="submit">Iniciar Sesión</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
	<script src="js/scripts.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
	<script src="http://localhost/DELATEL/js/swalcustom.js"></script>
	<script type="module" src="http://localhost/DELATEL/js/Login.js"></script>
</body>

</html>