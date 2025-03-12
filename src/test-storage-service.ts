import { StorageService } from './services/storage.service';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar variables críticas
console.log('Variables de entorno cargadas:');
console.log('GOOGLE_BUCKET_NAME:', process.env.GOOGLE_BUCKET_NAME);
console.log('GOOGLE_PROJECT_ID:', process.env.GOOGLE_PROJECT_ID);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const testStorageService = async () => {
    try {
        // Crear instancia del servicio
        const storageService = new StorageService();

        // Crear archivo de prueba
        const testFilePath = path.join(__dirname, 'test-file.txt');
        fs.writeFileSync(testFilePath, 'Archivo de prueba para Google Cloud Storage');

        // Crear objeto de archivo simulado
        const mockFile: Express.Multer.File = {
            fieldname: 'archivo',
            originalname: 'test-file.txt',
            encoding: '7bit',
            mimetype: 'text/plain',
            buffer: fs.readFileSync(testFilePath),
            size: fs.statSync(testFilePath).size,
            destination: '',
            filename: 'test-file.txt',
            path: testFilePath,
            stream: fs.createReadStream(testFilePath)
        };

        // Intentar subir archivo
        console.log('Iniciando prueba de carga...');
        const fileUrl = await storageService.uploadFile(mockFile, 'pruebas');
        console.log('✅ Archivo subido exitosamente');
        console.log('URL del archivo:', fileUrl);

        // Limpiar archivo de prueba
        fs.unlinkSync(testFilePath);
        console.log('Archivo de prueba eliminado');

    } catch (error) {
        console.error('❌ Error en la prueba:', error);
        if (error instanceof Error) {
            console.error('Mensaje:', error.message);
            console.error('Stack:', error.stack);
        }
    }
};

testStorageService();