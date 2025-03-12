import { Client } from '@googlemaps/google-maps-services-js';
import { AppError } from '../middlewares/error.middleware';

export class MapsService {
    private client: Client;

    constructor() {
        if (!process.env.GOOGLE_MAPS_API_KEY) {
            throw new AppError(500, 'GOOGLE_MAPS_API_KEY no configurado');
        }
        this.client = new Client({});
    }

    async getCoordinates(direccion: string): Promise<[number, number]> {
        try {
            const response = await this.client.geocode({
                params: {
                    address: direccion,
                    key: process.env.GOOGLE_MAPS_API_KEY as string
                }
            });

            if (response.data.results.length === 0) {
                throw new AppError(404, 'No se encontraron coordenadas para la dirección proporcionada');
            }

            const { lat, lng } = response.data.results[0].geometry.location;
            return [lat, lng];
        } catch (error: any) {
            throw new AppError(500, `Error al obtener coordenadas: ${error.message}`);
        }
    }
}