import { Op } from 'sequelize';
import Inmueble from '../models/inmueble.model';
import Cliente from '../models/cliente.model';

export class SearchService {
  // Busca inmuebles por dirección (coincidencia parcial),
  // por geolocalización simple y por RFC de cliente
  public async buscarInmuebles(params: {
    direccion?: string;
    lat?: number;
    lon?: number;
    rfc?: string;
  }): Promise<Inmueble[]> {
    const { direccion, lat, lon, rfc } = params;

    // Construcción dinámica de "where" para inmuebles
    const whereInmueble: any = {};

    // Filtrar por dirección (LIKE)
    if (direccion) {
      whereInmueble.direccion = { [Op.like]: `%${direccion}%` };
    }

    // Aquí podrías implementar lógica de geolocalización
    // con bounding box o queries más avanzadas.
    // (Si usas PostGIS o similares, ajusta a tu necesidad)
    if (lat && lon) {
      // Ejemplo muy básico (puedes añadir tu lógica)
      whereInmueble.ubicacionGeografica = {
        [Op.ne]: null // Filtro simplificado; ajusta según tu requerimiento
      };
    }

    // Construcción dinámica de "where" para cliente, si se busca por RFC
    const whereCliente: any = {};
    if (rfc) {
      whereCliente.rfc = { [Op.eq]: rfc };
    }

    // Incluir relación con Cliente cuando haya búsqueda por RFC
    const includeArray = rfc
      ? [
          {
            model: Cliente,
            where: whereCliente
          }
        ]
      : [];

    // Ejecutar la búsqueda en base a la construcción dinámica
    const inmuebles = await Inmueble.findAll({
      where: whereInmueble,
      include: includeArray
    });

    return inmuebles;
  }
}

export default SearchService;