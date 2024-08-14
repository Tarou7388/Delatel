const fs = require('fs-extra');
const dotenv = require('dotenv');
const path = require('path');

// Cargar el archivo .env
dotenv.config();

// Leer el archivo .env directamente
const envFilePath = path.resolve(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

// Generar el contenido del archivo env.js solo con las variables del .env
const configContent = `
const config = {
${Object.keys(envConfig).map(key => `    ${key}: "${envConfig[key]}"`).join(',\n')}
};

export default config;
`;

// Escribir el archivo env.js en la ruta correcta
fs.writeFileSync('./env.js', configContent, 'utf8');
