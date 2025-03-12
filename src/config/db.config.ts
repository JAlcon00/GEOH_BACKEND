import { Sequelize } from 'sequelize';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

// Configurar la conexión con Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.PORTDB || '3306', 10),
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          ca: fs.readFileSync(process.env.SSL_CA as string),
          cert: fs.readFileSync(process.env.SSL_CERT as string),
          key: fs.readFileSync(process.env.SSL_KEY as string),
          rejectUnauthorized: true,
          servername: undefined, // Esto desactiva el ServerName
        },
        connectTimeout: 60000 // Aumenta el tiempo de espera de la conexión a 60 segundos
      },
      logging: false,
      pool: {
        max: 10,          // Aumenta el máximo de conexiones en el pool
        min: 0,
        acquire: 60000,   // Aumenta el tiempo máximo en ms para obtener una conexión
        idle: 20000       // Aumenta el tiempo máximo en ms que una conexión puede estar inactiva
      }
    }
  );

// Función para probar la conexión a la base de datos
export const testConnection = async () => {
  try {
    await sequelize.authenticate(); // Verifica la conexión
    console.log('✅ Conexión exitosa a la base de datos con SSL');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error);
    process.exit(1); // Finaliza el proceso si no se puede conectar
  }
};

// Exporta el objeto Sequelize para usarlo en otros módulos
export { sequelize };