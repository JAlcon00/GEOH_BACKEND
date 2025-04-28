import { Sequelize } from 'sequelize';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Selección automática de archivo .env según NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'local'
    ? '.env.local'
    : '.env';
dotenv.config({ path: envFile });

// Variables obligatorias
const DB_NAME = process.env.DB_NAME!;
const DB_USER = process.env.DB_USER!;
const DB_PASSWORD = process.env.DB_PASSWORD!;
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const INSTANCE_CONNECTION_NAME = process.env.INSTANCE_CONNECTION_NAME;

// Lee rutas de certificados desde variables de entorno
const SSL_CA = process.env.SSL_CA;
const SSL_CERT = process.env.SSL_CERT;
const SSL_KEY = process.env.SSL_KEY;

// Construye las opciones de conexión
const sequelizeConfig: any = {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 20000,
  }
};

if (INSTANCE_CONNECTION_NAME) {
  sequelizeConfig.dialectOptions = {
    socketPath: `/cloudsql/${INSTANCE_CONNECTION_NAME}`
  };
} else {
  sequelizeConfig.host = DB_HOST;
  sequelizeConfig.port = DB_PORT;
  if (SSL_CA && SSL_CERT && SSL_KEY) {
    sequelizeConfig.dialectOptions = {
      ssl: {
        ca: fs.readFileSync(SSL_CA),
        cert: fs.readFileSync(SSL_CERT),
        key: fs.readFileSync(SSL_KEY),
      }
    };
  }
}

export const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  sequelizeConfig
);

// Función para testear la conexión con manejo de errores explícito
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (err: any) {
    if (err.name === 'SequelizeAccessDeniedError') {
      console.error('❌ Error de autenticación: usuario o contraseña incorrectos.');
    } else if (err.name === 'SequelizeHostNotFoundError') {
      console.error('❌ Error: host de base de datos no encontrado. Verifica DB_HOST o el socket.');
    } else if (err.name === 'SequelizeConnectionRefusedError') {
      console.error('❌ Error: conexión rechazada. El servicio de base de datos no está escuchando o hay un firewall.');
    } else if (err.name === 'SequelizeConnectionTimedOutError' || err.code === 'ETIMEDOUT') {
      console.error('❌ Error: tiempo de espera agotado al conectar. Verifica red, VPC, reglas de firewall o si la instancia está activa.');
    } else if (err.name === 'SequelizeConnectionError') {
      console.error('❌ Error general de conexión a la base de datos:', err.message);
    } else {
      console.error('❌ Error desconocido al conectar a la base de datos:', err);
    }
    process.exit(1);
  }
};