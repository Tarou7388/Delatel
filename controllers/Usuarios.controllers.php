<?php
session_start();


require_once '../Models/Usuarios.php';

$usuario = new Usuario();

if (isset($_GET["Operacion"])) {
    if ($_GET["Operacion"] == "Login") {
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
    if ($_GET["Operacion"] == "CerrarSesion") {
        session_unset();
        session_destroy();
        header("Location: http://localhost/delatel");
    }

    if ($_GET["Operacion"] == "getAll") {
        $resultado = $usuario->getUser();
        echo json_encode($resultado);
    }
}

if (isset($_POST["Operacion"])) {
    if ($_POST["Operacion"] == "Registrar") {
        $contrasenia = password_hash($_POST["pass"], PASSWORD_BCRYPT);
        $data = [
            "idPersona" => $_POST["idPersona"],
            "nombreUser" => $_POST["nombreUser"],
            "pass" => $contrasenia,
            "iduser_create"         => $_POST["iduser_create"]
        ];
        $resultado = $usuario->registrar($data);
        echo json_encode(["guardado" => $resultado]);
    }
}

//EN TESTEO
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $inputData = file_get_contents('php://input');
    $data = json_decode($inputData, true);


    if (isset($data['identificador']) && isset($data['iduser_update'])) {
        $datos = [
            "identificador"   => $data['identificador'],
            "nombre"         => $data['nombre'],
            "apellidos"      => $data['apellidos'],
            "email"          => $data['email'],
            "telefono"       => $data['telefono'],
            "direccion"      => $data['direccion'],
            "referencia"     => $data['referencia'],
            "coordenadas"    => $data['coordenadas'],
            "iduser_update"  => $data['iduser_update']
        ];

        $estado = $cliente->update($datos);
        echo json_encode(["Actualizado" => $estado]);
        return;
    }
}
