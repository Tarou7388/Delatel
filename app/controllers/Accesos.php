<?php
//IO JSON
header("Content-type: application/json; charset=utf-8");

require_once '../models/Conexion.php'; // Asegúrate de incluir tu archivo de conexión a la base de datos
require_once '../models/Rol.php'; // Asegúrate de incluir tu modelo de roles

session_start();

// Función para cargar permisos
function cargarPermisos($idRol)
{
    // Crear una instancia del modelo de roles
    $rolModel = new Rol();

    // Obtener los permisos desde la base de datos
    $params = ['idRol' => $idRol];
    $resultado = $rolModel->listarPermisosIdRol($params);

    // Convertir el resultado en un array de permisos
    $permisos = [];
    if (!empty($resultado)) {
        foreach ($resultado as $row) {
            $permisos = $row['permisos'];
        }
    }

    return $permisos;
}

// Función para obtener accesos filtrados
function obtenerAccesosFiltrados($idRol, $permissions)
{
    // Definir accesos basados en permisos
    $accesosV2 = [
        ["ruta" => "views", "texto" => "Actividades", "icono" => "fa-solid fa-chart-line"],
        ["ruta" => "Contratos", "texto" => "Contratos", "icono" => "fa-solid fa-file-contract"],
        ["ruta" => "Inventariado", "texto" => "Inventariado", "icono" => "fa-solid fa-warehouse"],
        ["ruta" => "Personas", "texto" => "Personas", "icono" => "fa-solid fa-user"],
        ["ruta" => "Productos", "texto" => "Productos", "icono" => "fa-solid fa-boxes-stacked"],
        ["ruta" => "Roles", "texto" => "Roles", "icono" => "fa-regular fa-address-card"],
        ["ruta" => "Soporte", "texto" => "Soporte", "icono" => "fa-solid fa-wrench"],
        ["ruta" => 'Usuarios', "texto" => "Usuarios", "icono" => "fa-solid fa-users"]
    ];

    // Filtrar accesos basados en permisos
    $accesosFiltrados = [];
    foreach ($accesosV2 as $acceso) {
        $modulo = strtolower($acceso['texto']);
        if (isset($permissions[$modulo]) && isset($permissions[$modulo]['leer']) && $permissions[$modulo]['leer']) {
            $accesosFiltrados[] = $acceso;
        }
    }

    return $accesosFiltrados;
}
