<?php
session_start();

require_once '../models/Usuarios.php';

$usuario = new Usuario();

if (isset($_GET["operacion"])) {
    if ($_GET["operacion"] == "login") {
        $resultado = $usuario->login(["nombreUser" => $_GET["nombreUser"]]);
        $Login = [
            "estado" => false,
            "idRol" => -1,
            "idUsuario" => -1,
            "mensaje" => ""
        ];
        if ($resultado != false) {
            if (password_verify($_GET['pass'], $resultado["pass"])) {
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
    if ($_GET["operacion"] == "cerrarSesion") {
        session_unset();
        session_destroy();
        header("Location: http://localhost/Delatel");
    }

    if ($_GET["operacion"] == "listarUsuarios") {
        $resultado = $usuario->listarUsuarios();
        echo json_encode($resultado);
    }
}

if (isset($_POST["operacion"])) {
    if ($_POST["operacion"] == "registrarUsuarios") {
        $clave = password_hash($_POST["clave"], PASSWORD_BCRYPT);
        $data = [
            "idPersona" => $_POST["idPersona"],
            "nombreUsuario" => $_POST["nombreUsuario"],
            "clave" => $clave,
            "idUsuario"         => $_POST["idUsuario"]
        ];
        $resultado = $usuario->registrarUsuarios($data);
        echo json_encode(["guardado" => $resultado]);
    }
}

?>