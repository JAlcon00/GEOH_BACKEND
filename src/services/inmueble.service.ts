import { StorageService } from './storage.service';
import { MapsService } from './maps.service';
import Inmueble from '../models/inmueble.model';
import { AppError } from '../middlewares/error.middleware';
import { Op } from 'sequelize';
import Cliente from '../models/cliente.model';
import Documento, { Estatus } from '../models/documento.model';

export class InmuebleService {
    private storageService: StorageService;
    private mapsService: MapsService;

    constructor() {
        this.storageService = new StorageService();
        this.mapsService = new MapsService();
    }

    // Método para crear un inmueble
    async crearInmueble(
        data: any,
        foto: Express.Multer.File
    ): Promise<Inmueble> {
        try {
            // Verificar que el cliente existe
            const cliente = await Cliente.findByPk(data.clienteId);
            if (!cliente) {
                throw new AppError(404, 'Cliente no encontrado');
            }

            // Obtener coordenadas
            const [lat, lon] = await this.mapsService.getCoordinates(data.direccion);
            data.ubicacionGeografica = { type: 'Point', coordinates: [lon, lat] };

            // Subir foto
            if (foto) {
                data.foto = await this.storageService.uploadFile(foto, 'inmuebles');
            }

            // Crear inmueble
            const inmueble = await Inmueble.create(data);
            return inmueble;
        } catch (error: any) {
            throw new AppError(500, `Error al crear inmueble: ${error.message}`);
        }
    }

    // Método para obtener un inmueble por su ID
    async obtenerInmueble(id: number): Promise<Inmueble> {
        const inmueble = await Inmueble.findByPk(id);
        if (!inmueble) {
            throw new AppError(404, 'Inmueble no encontrado');
        }
        return inmueble;
    }

    // Método para obtener todos los inmuebles
    async obtenerInmuebles(): Promise<Inmueble[]> {
        return await Inmueble.findAll();
    }

    // Metodo para obtener inmuebles por cliente
    async obtenerInmueblesPorCliente(clienteId: number): Promise<Inmueble[]> {
        return await Inmueble.findAll({
            where: { clienteId }
        });
    }


    //Obtener inmuebles por rango de precio
    async obtenerInmueblesPorPrecio(min: number, max: number): Promise<Inmueble[]> {
        try {
            if (isNaN(min) || isNaN(max)) {
                throw new Error('Los parámetros min y max deben ser números válidos');
            }

            const inmuebles = await Inmueble.findAll({
                where: {
                    valorMercado: {
                        [Op.between]: [min, max], // Asegúrate de que esto sea válido
                    },
                },
            });

            console.log(`Consulta realizada con éxito: ${inmuebles.length} resultados encontrados`);
            return inmuebles;
        } catch (error) {
            console.error(`Error en obtenerInmueblesPorPrecio: ${(error as any).message}`);
            throw new Error(`Error al obtener inmuebles por precio: ${(error as any).message}`);
        }
    }



    // Metodo para obtener inmuebles por radio de distancia
    async obtenerInmueblesPorRadio(
        lat: number,
        lon: number,
        radio: number
    ): Promise<Inmueble[]> {
        return await Inmueble.findAll({
            where: {
                ubicacionGeografica: {
                    [Op.and]: {
                        ubicacionGeografica: {
                            $near: {
                                $geometry: {
                                    type: 'Point',
                                    coordinates: [lon, lat]
                                },
                                $maxDistance: radio
                            }
                        }
                    }
                }
            }
        });
    }



    // Método para actualizar un inmueble 
    async actualizarInmueble(
        id: number,
        data: any,
        foto?: Express.Multer.File
    ): Promise<Inmueble> {
        const inmueble = await Inmueble.findByPk(id);
        if (!inmueble) {
            throw new AppError(404, 'Inmueble no encontrado');
        }
    
        try {
            // Si hay nueva dirección, actualizar coordenadas
            if (data.direccion) {
                const coordenadas = await this.mapsService.getCoordinates(data.direccion);
                data.ubicacionGeografica = {
                    type: 'Point',
                    coordinates: [coordenadas[1], coordenadas[0]]
                };
            }
    
            // Si hay nueva foto, subir primero y luego eliminar la antigua si es diferente
            if (foto) {
                const newPhotoUrl = await this.storageService.uploadFile(foto, 'inmuebles');
                if (inmueble.foto && inmueble.foto !== newPhotoUrl) {
                    await this.storageService.deleteFile(inmueble.foto);
                }
                data.foto = newPhotoUrl;
            }
    
            await inmueble.update(data);
            return inmueble;
        } catch (error: any) {
            throw new AppError(500, `Error al actualizar inmueble: ${error.message}`);
        }
    }
    // Método para eliminar un inmueble por su ID
    async eliminarInmueble(id: number): Promise<void> {
        const inmueble = await Inmueble.findByPk(id);
        if (!inmueble) {
            throw new AppError(404, 'Inmueble no encontrado');
        }

        if (inmueble.foto) {
            try {
                await this.storageService.deleteFile(inmueble.foto);
            } catch (error: any) {
                if (error instanceof AppError && error.statusCode === 404) {
                    // Si la foto ya no existe, continuar (idempotente)
                } else {
                    throw error;
                }
            }
        }

        await inmueble.destroy();
    }

    // Metodo para recalcular el estatus de un inmueble según sus documentos
    async recalcularEstatusInmueble(inmuebleId: number): Promise<void> {
        // Consultar documentos asociados
        const documentos = await Documento.findAll({ where: { inmuebleId } });

        if (documentos.length === 0) {
            // Podrías definir un estatus por defecto o saltar la actualización
            return;
        }

        // Si todos los documentos están aceptados
        if (documentos.every(doc => doc.estatus === Estatus.ACEPTADO)) {
            await Inmueble.update({ estatus: Estatus.ACEPTADO }, { where: { id: inmuebleId } });
        }
        // Si todos los documentos están rechazados
        else if (documentos.every(doc => doc.estatus === Estatus.RECHAZADO)) {
            await Inmueble.update({ estatus: Estatus.RECHAZADO }, { where: { id: inmuebleId } });
        }
        // En cualquier otro caso, se considera pendiente
        else {
            await Inmueble.update({ estatus: Estatus.PENDIENTE }, { where: { id: inmuebleId } });
        }
    }
    
}

export default InmuebleService;