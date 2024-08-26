<?php
session_start();


require_once '../Models/Usuarios.php';

$usuario = new Usuario();

if(isset($_GET["Operacion"])){
    if($_GET["Operacion"] == "Login"){
        $resultado = $usuario->login(["nombreUser" => $_GET["nombreUser"]]);
        $Login = [
            "estado" => false,
            "idrol" => -1,
            "idUsuario" => -1,
            "mensaje" => ""
        ];
        if ($resultado != false){
            if (password_verify($_GET['pass'], $resultado["pass"])) {
                $Login['estado'] = true;
                $Login['idRol'] = $resultado['id_rol'];
                $Login['idUsuario'] = $resultado['id_usuario'];
                $Login['mensaje'] = "Bienvenido";
                $_SESSION['login'] = $Login;
            }else{
                $Login['mensaje'] = "Contraseña Incorrecta";
            }
        }else{
            $Login["mensaje"] = "No existe";
        }
        $response = $Login;
        echo json_encode($response);
    }
    if($_GET["Operacion"] == "CerrarSesion"){
        session_unset();
        session_destroy();
        header("Location: http://localhost/delatel");
    }
}