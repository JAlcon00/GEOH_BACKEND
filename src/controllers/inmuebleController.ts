import { Request, Response, NextFunction } from 'express';
import InmuebleService from '../services/inmueble.service';

class InmuebleController {
  private inmuebleService: InmuebleService;

  constructor() {
    this.inmuebleService = new InmuebleService();
  }

  // Crear un nuevo inmueble
  public crearInmueble = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new Error('File is required');
      }
      const inmueble = await this.inmuebleService.crearInmueble(req.body, req.file);
      res.status(201).json(inmueble);
    } catch (error) {
      next(error);
    }
  };

  // Obtener un inmueble por su ID
  public obtenerInmueble = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inmueble = await this.inmuebleService.obtenerInmueble(Number(req.params.id));
      res.status(200).json(inmueble);
    } catch (error) {
      next(error);
    }
  };

  // Obtener todos los inmuebles
  public obtenerInmuebles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inmuebles = await this.inmuebleService.obtenerInmuebles();
      res.status(200).json(inmuebles);
    } catch (error) {
      next(error);
    }
  };

  // Obtener inmuebles por cliente
  public obtenerInmueblesPorCliente = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inmuebles = await this.inmuebleService.obtenerInmueblesPorCliente(Number(req.params.clienteId));
      res.status(200).json(inmuebles);
    } catch (error) {
      next(error);
    }
  };

  /*
  // Obtener inmuebles por rango de precio
  public obtenerInmueblesPorPrecio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { min, max } = req.query;
      console.log('Valores recibidos:', min, max);

      if (!min || !max) {
        return res.status(400).json({ error: 'Both min and max price are required' });
      }

      const minPrice = Number(min);
      const maxPrice = Number(max);

      isNaN(minPrice) || isNaN(maxPrice)
        ? res.status(400).json({ error: 'Min and max must be valid numbers' })
        : null;

      const inmuebles = await this.inmuebleService.obtenerInmueblesPorPrecio(minPrice, maxPrice);
      console.log('Resultados enviados al cliente:', inmuebles);

      return res.status(200).json(inmuebles);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Error capturado en el controlador:', errorMessage);
      return res.status(500).json({ error: errorMessage });
    }
  };
  */

  
  
  /*

  // Obtener inmuebles por radio de distancia
  public obtenerInmueblesPorRadio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lon, radio } = req.query;
      const inmuebles = await this.inmuebleService.obtenerInmueblesPorRadio(Number(lat), Number(lon), Number(radio));
      res.status(200).json(inmuebles);
    } catch (error) {
      next(error);
    }
  };
  */

  

  // Actualizar un inmueble
  public actualizarInmueble = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inmueble = await this.inmuebleService.actualizarInmueble(Number(req.params.id), req.body, req.file);
      res.status(200).json(inmueble);
    } catch (error) {
      next(error);
    }
  };

  // Eliminar un inmueble
  public eliminarInmueble = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.inmuebleService.eliminarInmueble(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new InmuebleController();