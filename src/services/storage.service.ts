import { Storage } from '@google-cloud/storage';
import { AppError } from '../middlewares/error.middleware';
import path from 'path';


export class StorageService {
    private storage: Storage;
    private bucket: string;

    constructor() {
        if (!process.env.GOOGLE_BUCKET_NAME) {
            throw new AppError(500, 'GOOGLE_BUCKET_NAME no configurado');
        }

        try {
            this.storage = new Storage({
                projectId: process.env.GOOGLE_PROJECT_ID
            });

            this.bucket = process.env.GOOGLE_BUCKET_NAME;

            // Verificar acceso al bucket
            this.verifyBucketAccess().catch(error => {
                console.error('Error verificando acceso al bucket:', error);
                throw new AppError(500, `Error de configuración: ${error.message}`);
            });
        } catch (error: any) {
            console.error('Error inicializando Storage:', error);
            throw new AppError(500, `Error de configuración: ${error.message}`);
        }
    }

    private async verifyBucketAccess(): Promise<void> {
        try {
            const [exists] = await this.storage.bucket(this.bucket).exists();
            if (!exists) {
                throw new AppError(500, `Bucket ${this.bucket} no existe`);
            }
            console.log('✅ Conexión a bucket verificada');
        } catch (error: any) {
            throw new AppError(500, `Error accediendo al bucket: ${error.message}`);
        }
    }
    private verificarArchivoNoVacio(file: Express.Multer.File): void {
        if (file.size === 0) {
            throw new AppError(400, 'El archivo está vacío');
        }
    }


    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        try {
            this.verificarArchivoNoVacio(file);
            console.log('Iniciando carga de archivo:', file.originalname);
            console.log('Folder:', folder);

            const bucket = this.storage.bucket(this.bucket);
            const fileName = `${folder}/${Date.now()}-${file.originalname}`;
            const blob = bucket.file(fileName);

            return new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream({
                    resumable: false,
                    metadata: {
                        contentType: file.mimetype
                    }
                });

                blobStream.on('error', (error) => {
                    console.error('❌ Error en stream:', error);
                    reject(new AppError(500, `Error al subir archivo: ${error.message}`));
                });

                // filepath: c:\Users\cjalm\OneDrive\Escritorio\Proyectos de desarrollo\GarantiasHipotecarias\backend\src\services\storage.service.ts
                blobStream.on('finish', async () => {
                    try {
                        // Calcular 100 años en milisegundos
                        const oneHundredYearsMs = 100 * 365 * 24 * 60 * 60 * 1000;
                        // Generar signed URL con expiración de 100 años
                        const [signedUrl] = await blob.getSignedUrl({
                            action: 'read',
                            expires: Date.now() + oneHundredYearsMs
                        });
                        console.log('✅ Archivo subido. Signed URL generado:', signedUrl);
                        resolve(signedUrl);
                    }
                    catch (error: any) {
                        console.error('❌ Error al generar signed URL:', error.message);
                        console.error(error.stack);
                        reject(new AppError(500, `Error al generar signed URL: ${error.message}`));
                    }
                });
                blobStream.end(file.buffer);
            });
        } catch (error: any) {
            console.error('❌ Error en uploadFile:', error);
            throw new AppError(500, `Error en el servicio de almacenamiento: ${error.message}`);
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            // Extraer nombre del archivo de la URL
            const fileName = fileUrl.split(`${this.bucket}/`)[1];
            if (!fileName) {
                throw new AppError(400, 'URL de archivo inválida');
            }

            const file = this.storage.bucket(this.bucket).file(fileName);
            const [exists] = await file.exists();

            if (!exists) {
                // Lanzar error 404 si el archivo no existe
                throw new AppError(404, 'Archivo no encontrado en Storage');
            }

            await file.delete();
            console.log(`✅ Archivo ${fileName} eliminado correctamente`);
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('❌ Error al eliminar archivo:', error);
            throw new AppError(500, 'Error al eliminar archivo de Storage');
        }
    }
}