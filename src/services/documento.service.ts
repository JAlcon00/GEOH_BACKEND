import { StorageService } from './storage.service';
import Inmueble from '../models/inmueble.model';
import { Estatus } from '../models/documento.model';
import InmuebleService from './inmueble.service';
import { Documento, TipoDocumento } from '../models/documento.model';
import { AppError } from '../middlewares/error.middleware';



export class DocumentoService {
    private storageService: StorageService;

    constructor() {
        this.storageService = new StorageService();
    }

    // Método para subir un documento a Google Cloud Storage y guardar la URL en la base de datos
    async subirDocumento(
        file: Express.Multer.File, 
        inmuebleId: number, 
        tipoDocumento: TipoDocumento
    ): Promise<Documento> {
        try {
            const inmueble = await Inmueble.findByPk(inmuebleId);
            if (!inmueble) {
                throw new Error(`El inmueble con ID ${inmuebleId} no existe`);
            }

            // Subir archivo a Google Cloud Storage
            const archivoUrl = await this.storageService.uploadFile(file, 'documentos');
            console.log('URL del archivo:', archivoUrl);

            try {
                // Crear registro en base de datos
                const documento = await Documento.create({
                    inmuebleId,
                    tipoDocumento,
                    archivoUrl
                });
                console.log('Documento creado:', documento.toJSON());
                return documento;
            } catch (dbError) {
                // Si falla la creación en BD, eliminar archivo
                await this.storageService.deleteFile(archivoUrl);
                console.error('Error BD:', dbError);
                throw new AppError(500, 'Error al guardar en base de datos');
            }
        } catch (error: unknown) {
            console.error('Error completo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new AppError(500, `Error al procesar documento: ${errorMessage}`);
        }
    }
    // Método para subir múltiples documentos a Google Cloud Storage y guardar las URLs en la base de datos
    async subirMultiplesDocumentos(
        files: Express.Multer.File[], 
        inmuebleId: number, 
        tipoDocumento: TipoDocumento
    ): Promise<Documento[]> {
        const documentos: Documento[] = [];

        for (const file of files) {
            try {
                // Subir archivo a Google Cloud Storage
                const archivoUrl = await this.storageService.uploadFile(file, 'documentos');
                console.log('URL del archivo:', archivoUrl);

                try {
                    // Crear registro en base de datos
                    const documento = await Documento.create({
                        inmuebleId,
                        tipoDocumento,
                        archivoUrl
                    });
                    console.log('Documento creado:', documento.toJSON());
                    documentos.push(documento);
                } catch (dbError) {
                    // Si falla la creación en BD, eliminar archivo
                    await this.storageService.deleteFile(archivoUrl);
                    console.error('Error BD:', dbError);
                    throw new AppError(500, 'Error al guardar en base de datos');
                }
            } catch (error: unknown) {
                console.error('Error completo:', error);
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                throw new AppError(500, `Error al procesar documento: ${errorMessage}`);
            }
        }

        return documentos;
    }

    // Método para obtener un documento por su ID

    async obtenerDocumento(id: number): Promise<Documento> {
        const documento = await Documento.findByPk(id);
        if (!documento) {
            throw new AppError(404, 'Documento no encontrado');
        }
        return documento;
    }

    async obtenerDocumentosPorInmueble(inmuebleId: number): Promise<Documento[]> {
        return await Documento.findAll({
            where: { inmuebleId }
        });
    }

    // Método para eliminar un documento por su ID
    async eliminarDocumento(id: number): Promise<void> {
        const documento = await Documento.findByPk(id);
        if (!documento) {
            throw new AppError(404, 'Documento no encontrado');
        }

        if (documento.archivoUrl) {
            await this.storageService.deleteFile(documento.archivoUrl);
        }

        await documento.destroy();
    }

    // Método para actualizar un documento por su ID
    async actualizarDocumento(
        id: number,
        file: Express.Multer.File,
        tipoDocumento?: TipoDocumento,
        // Puedes habilitar el cambio de estatus manualmente si lo requiere el usuario:
        estatus?: Estatus
    ): Promise<Documento> {
        const documento = await Documento.findByPk(id);
        if (!documento) {
            throw new AppError(404, 'Documento no encontrado');
        }

        try {
            // Si cambia el archivo, eliminar el anterior y subir el nuevo
            if (file) {
                if (documento.archivoUrl) {
                    await this.storageService.deleteFile(documento.archivoUrl);
                }
                documento.archivoUrl = await this.storageService.uploadFile(file, 'documentos');
            }

            // Permitir actualizar tipo de documento si se proporciona
            if (tipoDocumento && this.validarTipoDocumento(tipoDocumento)) {
                documento.tipoDocumento = tipoDocumento;
            }
            
            // Permitir que el usuario manipule directamente el estatus del documento
            if (estatus) {
                documento.estatus = estatus;
            }

            await documento.save();

            // Recalcular el estatus del inmueble asociado después del cambio
            const inmuebleService = new InmuebleService();
            if (documento.inmuebleId) {
                await inmuebleService.recalcularEstatusInmueble(documento.inmuebleId);
            }
            
            return documento;
        } catch (error) {
            throw new AppError(500, 'Error al actualizar documento');
        }
    }

    // Método para validar el tipo de documento

    private validarTipoDocumento(tipo: string): tipo is TipoDocumento {
        return ['escritura', 'libertad_gravamen', 'avaluo', 'fotografia'].includes(tipo);
    }
}

export default DocumentoService;