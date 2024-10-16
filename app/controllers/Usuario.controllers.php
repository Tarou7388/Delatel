<?php

use App\Controllers\Herramientas;

require_once './Accesos.php';
require_once '../models/Usuarios.php';
require_once './Herramientas.php';

$usuario = new Usuario();

if (isset($_GET["operacion"])) {
    $operacion = Herramientas::sanitizarEntrada($_GET["operacion"]);
    if ($operacion == "cerrarSesion") {
        session_unset();
        session_destroy();
        header("Location: http://localhost/Delatel");
    }

    if ($operacion == "listarUsuarios") {
        $resultado = $usuario->listarUsuarios();
        echo json_encode($resultado);
    }
}

if (isset($_POST['operacion'])) {
    $operacion = Herramientas::sanitizarEntrada($_POST["operacion"]);
    if ($operacion == "login") {
        $nombreUser = Herramientas::sanitizarEntrada($_POST["nombreUser"]);
        $registro = $usuario->login(["nombreUser" => $nombreUser]);

        $Login = [
            "estado" => false,
            "idRol" => -1,
            "idUsuario" => -1,
            "mensaje" => "",
            "accesos" => "",
        ];

        if ($registro) {
            $claveEncriptada = $registro["pass"];
            $claveIngresada = Herramientas::sanitizarEntrada($_POST["pass"]);

            if (password_verify($claveIngresada, $claveEncriptada)) {
                $resultados["login"] = true;
                $resultados["mensaje"] = "Bienvenido";

                $Login["estado"]    = true;
                $Login["inicio"]    = date("h:i:s d-m-Y");
                $Login["nombreUser"] = $registro['nombre_user'];
                $Login["pass"]      = $registro['pass'];
                $Login["idRol"]     = $registro['id_rol'];
                $Login["Cargo"]       = $registro['Cargo'];
                $Login["idUsuario"] = $registro['id_usuario'];

                // Obtener permisos y accesos filtrados
                $idRol = $registro['id_rol'];
                $permissions = cargarPermisos($idRol);
                $accesosFiltrados = obtenerAccesosFiltrados($idRol, $permissions);

                $Login["accesos"] = $accesosFiltrados;
            } else {
                $resultados["mensaje"] = "Contraseña Incorrecta";
                $Login["estado"] = false;
            }
        } else {
            $Login["mensaje"] = "No existe el Usuario";
            $Login["estado"] = false;
        }
        $_SESSION["login"] = $Login;
        echo json_encode($resultados);
    }

    if ($operacion == "registrarUsuarios") {
        $idPersona = Herramientas::sanitizarEntrada($_POST["idPersona"]);
        $nombreUsuario = Herramientas::sanitizarEntrada($_POST["nombreUsuario"]);
        $clave = password_hash($_POST["clave"], PASSWORD_BCRYPT);
        $idUsuario = Herramientas::sanitizarEntrada($_POST["idUsuario"]);
        $data = [
            "idPersona" => $idPersona,
            "nombreUsuario" => $nombreUsuario,
            "clave" => $clave,
            "idUsuario" => $idUsuario
        ];
        $resultado = $usuario->registrarUsuarios($data);
        echo json_encode($resultado);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);
    $operacion = Herramientas::sanitizarEntrada($datos['operacion']);

    switch ($operacion) {
        case 'actualizarUsuario':
            $parametros = [
                "nombreUsuario" => Herramientas::sanitizarEntrada($datos['parametros']['nombreUsuario']),
                "clave" => password_hash($datos['parametros']['clave'], PASSWORD_BCRYPT),
                "idUsuarioUpdate" => Herramientas::sanitizarEntrada($datos['parametros']['idUsuarioUpdate']),
                "idUsuario" => Herramientas::sanitizarEntrada($datos['parametros']['idUsuario'])
            ];

            $resultado = $usuario->actualizarUsuarios($parametros);
            echo json_encode(["actualizado" => $resultado]);
            break;

        case 'eliminarUsuario':
            $data = [
                "idUsuario" => Herramientas::sanitizarEntrada($datos['idUsuario']),
                "idUsuarioEliminador" => Herramientas::sanitizarEntrada($datos['idUsuarioEliminador'])
            ];
            $resultado = $usuario->eliminarUsuario($data);
            echo json_encode(["eliminado" => $resultado]);
            break;
    }
}
