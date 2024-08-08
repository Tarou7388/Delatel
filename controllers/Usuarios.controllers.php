<?php
session_start();
require_once '../Models/Gerencia.php';

$usuario = new Usuario();

if(isset($_GET["Operacion"])){
    if($_GET["Operacion"] == "Login"){
        $resultado = $usuario->login(["nombreUser", $_GET["NombreUser"]]);
        $Login = [
            "estado" => false,
            "nombres" => "",
            "apellidos" => "",
            "idrol" => -1,
            "idUsuario" => -1,
            "mensaje" => ""
        ];
        if ($resultado != false){
            if (password_verify($_GET['pass'], $resultado["pass"])) {
                $Login['estado'] = true;
                $Login['idrol'] = $resultado['id_rol'];
                $Login['idUsuario'] = $resultado['id_usuario'];
                $Login['mensaje'] = "Bienvenido";
                $_SESSION['login'] = $Login;
            }
        }
    }
}