<?php

use App\Controllers\Herramientas;

session_start();

require_once '../models/Usuarios.php';
require_once './Herramientas.php';

$usuario = new Usuario();

if (isset($_GET["operacion"])) {
    $operacion = Herramientas::sanitizarEntrada($_GET["operacion"]);
    if ($operacion == "login") {
        $nombreUser = Herramientas::sanitizarEntrada($_GET["nombreUser"]);
        $pass = Herramientas::sanitizarEntrada($_GET["pass"]);
        $resultado = $usuario->login(["nombreUser" => $nombreUser]);
        $Login = [
            "estado" => false,
            "idRol" => -1,
            "idUsuario" => -1,
            "mensaje" => ""
        ];
        if ($resultado != false) {
            if (password_verify($pass, $resultado["pass"])) {
                $Login['estado'] = true;
                $Login['idRol'] = $resultado['id_rol'];
                $Login['idUsuario'] = $resultado['id_usuario'];
                $Login['mensaje'] = "Bienvenido";
                $_SESSION['login'] = $Login;
            } else {
                $Login['mensaje'] = "Contraseña Incorrecta";
            }
        } else {
            $Login["mensaje"] = "No existe";
        }
        echo json_encode($Login);
    }
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

if (isset($_POST["operacion"])) {
    $operacion = Herramientas::sanitizarEntrada($_POST["operacion"]);
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
                "idUsuarioInactive" => Herramientas::sanitizarEntrada($datos['idUsuarioInactive'])
            ];
            $resultado = $usuario->eliminarUsuario($data);
            echo json_encode(["eliminado" => $resultado]);
            break;
    }
}
