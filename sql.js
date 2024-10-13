const fs = require('fs');
const path = require('path');

// Función para leer y concatenar todos los archivos en un directorio
const concatenateFiles = (directoryPath, outputFilePath) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error leyendo el directorio:', err);
            return;
        }

        let content = '';

        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            content += fileContent + '\n';
        });

        fs.writeFileSync(outputFilePath, content, 'utf8');
        console.log('Contenido concatenado escrito en:', outputFilePath);
    });
};

// Ruta del directorio que contiene los archivos
const directoryPath = path.join(__dirname, 'app', 'DB', 'Procedimientos');
const outputFilePath = path.join(__dirname,'app', 'DB', 'output.sql'); // Cambiado para crear en 'db/'

// Leer y concatenar los archivos
concatenateFiles(directoryPath, outputFilePath);