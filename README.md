# Delatel - Gestión de Contratos y Soporte Técnico

## Descripción

Delatel es un sistema diseñado para la gestión de contratos y soporte técnico. Permite llevar un control eficiente de los contratos, así como brindar soporte técnico a los usuarios.

## Miembros del Proyecto

- **Jesús Eduardo Matta Ramos**
- **Alexis Alexander Talla Saravia**
- **Eloy Alexander de la Cruz Peñaloza**
- **Brayan Mesías Tasayco**

## Requisitos

Antes de comenzar, asegúrate de tener los siguientes requisitos instalados en tu entorno de desarrollo:

- PHP
- Composer
- Node.js y npm




## Instalación

1. **Instalar dependencias de PHP**

   Ejecuta el siguiente comando para instalar las dependencias del proyecto:

   ```bash
   composer install
   npm install
   npm run generate-config
   ```

   Modificación en el PHP.ini - Lineas 931/938 quitar ;
   ```
   extension=fileinfo
   extension=gd
   extension=gettext
   extension=gmp
   extension=intl
   extension=imap
   extension=mbstring
   extension=exif
   extension=mysqli
   ```

   Instalación de Dompdf
   ```
   composer require dompdf/dompdf


   ```

# Avances
   ## 1. Soporte Tecnico
      - Ficha de control de averías -
      ### Avances
      Funciona todo lo que son buscadores, los botones de los contratos que hemos trabajado y nos muestra las plantillas asociadas
      ### Faltas
      1. Falta listar las fichas averias restantes
      2. Falta la ficha de averias 
   ## 2. Contratos
      ### Avances
      1. Funciona el asignarle un contrato a un cliente
      2. Funciona la validación de fecha 
      ### Falta
      1. Funcionalidad del botón editar
   ## 3. Inventariado
      ### Avances
      1. Funciona correctamente
      ### Falta
      1. Se harán cambios a futuro
   ## 4. Usuarios
      ### Avances
      1. Funciona las listas de los usuarios registrados
      ### Faltas
      1. Aún no se completa el registro de usuarios
      2. falta darle funcionalidades a los botones editar
   ## 5. Clientes
      ### Avances
      1. Funciona las listas y los cambios de tipo cliente
      ### Falta
      1. Registra incorrectamente al cliente
      2. No registra una empresa
   ## 6. Roles
      ### Avances
      1. 
      ### Faltas
      1. Registrar un rol
      2. Editar los permisos
   ## Datos adicionales
   * Falta implementar el mapa
   * Falta implementar los permisos en el login 
   * Terminar de corregir los scripts ya que se ha hecho una depuración de todo el código
   * usuario para entrar
   - user: lgarcia
   - password: 123456
    


