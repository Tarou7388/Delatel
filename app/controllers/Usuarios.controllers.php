<?php
session_start();

require_once '../models/Usuarios.php';

$usuario = new Usuario();

if (isset($_GET["Operacion"])) {
    if ($_GET["Operacion"] == "login") {
        $resultado = $usuario->login(["nombreUser" => $_GET["nombreUser"]]);
        $Login = [
            "estado" => false,
            "idrol" => -1,
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
        $response = $Login;
        echo json_encode($response);
    }
    if ($_GET["Operacion"] == "cerrarSesion") {
        session_unset();
        session_destroy();
        header("Location: http://localhost/Delatel");
    }

    if ($_GET["Operacion"] == "listarUsuarios") {
        $resultado = $usuario->listarUsuarios();
        echo json_encode($resultado);
    }
}

if (isset($_POST["Operacion"])) {
    if ($_POST["Operacion"] == "registrarUsuarios") {
        $contrasenia = password_hash($_POST["pass"], PASSWORD_BCRYPT);
        $data = [
            "idPersona" => $_POST["idPersona"],
            "nombreUser" => $_POST["nombreUser"],
            "pass" => $contrasenia,
            "iduser_create"         => $_POST["iduser_create"]
        ];
        $resultado = $usuario->registrarUsuarios($data);
        echo json_encode(["guardado" => $resultado]);
    }
}

?>