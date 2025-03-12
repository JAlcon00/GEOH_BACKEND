import { Request, Response } from 'express';
import SearchService from '../services/search.service';

class SearchController {
    private searchService: SearchService;

    constructor() {
        this.searchService = new SearchService();
    }

    public buscarInmuebles = async (req: Request, res: Response): Promise<void> => {
        try {
            const { direccion, lat, lon, rfc } = req.query;
            
            const resultados = await this.searchService.buscarInmuebles({
                direccion: direccion as string,
                lat: lat ? Number(lat) : undefined,
                lon: lon ? Number(lon) : undefined,
                rfc: rfc as string
            });

            res.status(200).json(resultados);
        } catch (error: any) {
            res.status(500).json({ 
                mensaje: 'Error al buscar inmuebles', 
                error: error.message 
            });
        }
    };
}

export default new SearchController();