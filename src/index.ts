import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { sequelize, testConnection } from './config/db.config';
import documentoRoutes from './routes/documento.routes';
import clienteRoutes from './routes/cliente.routes';
import inmuebleRoutes from './routes/inmueble.routes';
import searchRoutes from './routes/search.routes';
import authRoutes from './routes/auth.routes';

// Configurar variables de entorno
dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Actualiza según la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 204
  };

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/documentos', documentoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/inmuebles', inmuebleRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Endpoint de prueba de conexión a la base de datos
app.get('/ping-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send({ status: 'DB OK' });
  } catch (err) {
    res.status(500).send({ error: (err as Error).message });
  }
});

// Verificar conexiones
export const verificarConexiones = async () => {
    try {
        // Verificar BD
        await testConnection();

        // Sincronizar modelos
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados correctamente.');

        return true;
    } catch (error) {
        console.error('❌ Error en las conexiones:', error);
        process.exit(1);
    }
};

// Utilidad para loguear en archivo y consola
const logStartup = (msg: string) => {
    const logPath = path.join(__dirname, '../logs/startup.log');
    const logMsg = `[${new Date().toISOString()}] ${msg}\n`;
    try {
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
        fs.appendFileSync(logPath, logMsg);
    } catch (e) {
        // Si falla el log en archivo, solo loguea en consola
    }
    console.log(msg);
};

// Iniciar servidor solo si las conexiones son exitosas
if (require.main === module) {
    (async () => {
        try {
            logStartup('⏳ Iniciando verificación de conexiones...');
            logStartup(`Variables de entorno: DB_HOST=${process.env.DB_HOST}, DB_USER=${process.env.DB_USER}, DB_NAME=${process.env.DB_NAME}, PORT=${process.env.PORT}`);
            await verificarConexiones();
            logStartup('✅ Conexiones verificadas. Iniciando servidor...');
            app.listen(process.env.PORT || 8080, () => {
                logStartup(`🚀 Servidor corriendo en el puerto ${process.env.PORT || 8080}`);
            });
        } catch (error) {
            logStartup('❌ Error al iniciar el servidor (bloque principal): ' + (error instanceof Error ? error.stack : String(error)));
        }
    })();
}

export default app;