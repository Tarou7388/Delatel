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
   extension=exif      ; Must be after mbstring as it depends on it
   extension=mysqli
   ```