<?php

namespace App\Controllers;

class Herramientas
{
    // Método para formatear fechas
    public static function formatearFecha($fecha, $formato = 'Y-m-d')
    {
        $date = new \DateTime($fecha);
        return $date->format($formato);
    }

    // Método para sanitizar entradas de usuario
    public static function sanitizarEntrada($entrada)
    {
        $entrada = trim($entrada);
        $entrada = stripslashes($entrada);
        $entrada = htmlspecialchars($entrada);

        $entrada = str_replace('<script>', '', $entrada);
        $entrada = str_replace('</script>', '', $entrada);
        $entrada = str_replace('<script src', '', $entrada);
        $entrada = str_replace('<script type', '', $entrada);

        $entrada = str_replace('SELECT', '', $entrada);
        $entrada = str_replace('DELETE', '', $entrada);
        $entrada = str_replace('UPDATE', '', $entrada);
        $entrada = str_replace('INSERT', '', $entrada);
        $entrada = str_replace('DROP', '', $entrada);
        $entrada = str_replace('TRUNCATE', '', $entrada);
        $entrada = str_replace('ALTER', '', $entrada);
        $entrada = str_replace('CREATE', '', $entrada);
        $entrada = str_replace('RENAME', '', $entrada);
        $entrada = str_replace('REPLACE', '', $entrada);
        $entrada = str_replace('JOIN', '', $entrada);
        $entrada = str_replace('HAVING', '', $entrada); 
        
        $entrada = str_replace('<?php', '', $entrada);
        $entrada = str_replace('?>', '', $entrada);
        $entrada = str_replace('(', '', $entrada);
        $entrada = str_replace(')', '', $entrada);
        $entrada = str_replace('[', '', $entrada);
        $entrada = str_replace(']', '', $entrada);
        $entrada = str_replace(';', '', $entrada);
        $entrada = str_replace('--', '', $entrada);
        $entrada = str_replace('/*', '', $entrada);
        $entrada = str_replace('*/', '', $entrada);
        $entrada = str_replace('>', '', $entrada);
        $entrada = str_replace('<', '', $entrada);
        $entrada = str_replace('!', '', $entrada);
        $entrada = str_replace('=', '', $entrada);
        $entrada = str_replace('==', '', $entrada);
        $entrada = str_replace('===', '', $entrada);
        $entrada = str_replace('!==', '', $entrada);
        $entrada = str_replace('!=', '', $entrada);
        $entrada = str_replace('+', '', $entrada);
        $entrada = str_replace('-', '', $entrada);
        $entrada = str_replace('*', '', $entrada);
        $entrada = str_replace('/', '', $entrada);
        $entrada = str_replace('>=', '', $entrada);
        $entrada = str_replace('<=', '', $entrada);
        $entrada = str_replace('&&', '', $entrada);
        $entrada = str_replace('||', '', $entrada);
        $entrada = str_replace('+=', '', $entrada);
        $entrada = str_replace('-=', '', $entrada);
        $entrada = str_replace('*=', '', $entrada);
        $entrada = str_replace('/=', '', $entrada);
        $entrada = str_replace('%=', '', $entrada);
        $entrada = str_replace('::', '', $entrada);
        $entrada = str_replace('->', '', $entrada);

        $entrada = stripslashes($entrada);
        $entrada = trim($entrada);
        return $entrada;
    }
}