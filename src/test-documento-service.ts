import { Documento } from './models/documento.model';
import { sequelize } from './config/db.config';
import { DocumentoService } from './services/documento.service';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const initDatabase = async () => {
    try {
        console.log('🗄 Inicializando base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida con la base de datos');
        await sequelize.sync(); // Sincronizar modelos con la base de datos sin eliminar tablas existentes
        console.log('✅ Base de datos sincronizada');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
};

const testDocumentoService = async () => {
    try {
        // Inicializar base de datos
        await initDatabase();
        console.log('🚀 Iniciando pruebas de DocumentoService...');
        const documentoService = new DocumentoService();

        // Crear archivo de prueba
        const testFilePath = path.join(__dirname, 'test-escritura.pdf');
        fs.writeFileSync(testFilePath, 'Contenido de escritura de prueba');

        // Preparar archivo simulado
        const mockFile: Express.Multer.File = {
            fieldname: 'documento',
            originalname: 'test-escritura.pdf',
            encoding: '7bit',
            mimetype: 'application/pdf',
            buffer: fs.readFileSync(testFilePath),
            size: fs.statSync(testFilePath).size,
            destination: '',
            filename: 'test-escritura.pdf',
            path: testFilePath,
            stream: fs.createReadStream(testFilePath)
        };

        // Probar subida de documento
        console.log('📝 Subiendo documento...');
        const documentoCreado = await documentoService.subirDocumento(
            mockFile,
            6, // inmuebleId de prueba
            'escritura'
        );
        console.log('✅ Documento creado:', documentoCreado.toJSON());

        // Limpiar archivo de prueba
        fs.unlinkSync(testFilePath);
        console.log('🧹 Archivo de prueba eliminado');

    } catch (error) {
        console.error('❌ Error en pruebas:', error);
    } finally {
        // Cerrar conexión a base de datos
        await sequelize.close();
        console.log('🔌 Conexión a base de datos cerrada');
    }
};

testDocumentoService();