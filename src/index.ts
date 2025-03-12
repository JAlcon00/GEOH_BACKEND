import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
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

// Verificar conexiones
const verificarConexiones = async () => {
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

// Iniciar servidor solo si las conexiones son exitosas
const iniciarServidor = async () => {
    try {
        await verificarConexiones();

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

        // Ruta de archivos estáticos
        app.listen(process.env.PORT || 3001, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${process.env.PORT || 3001}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
    }
};

iniciarServidor();

export default app;