import { Request, Response, NextFunction } from 'express';
import DocumentoService from '../services/documento.service';
import { TipoDocumento } from '../models/documento.model';

const documentoService = new DocumentoService();

export class DocumentoController {
    async subirDocumento(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const { inmuebleId, tipoDocumento } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'No se ha subido ningún archivo' });
            return;
        }

        try {
            const documento = await documentoService.subirDocumento(file, Number(inmuebleId), tipoDocumento as TipoDocumento);
            res.status(201).json(documento);
        } catch (error) {
            next(error);
        }
    }

    async subirMultiplesDocumentos(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const { inmuebleId, tipoDocumento } = req.body;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ message: 'No se han subido archivos' });
        }

        try {
            const documentos = await documentoService.subirMultiplesDocumentos(files, Number(inmuebleId), tipoDocumento as TipoDocumento);
            res.status(201).json(documentos);
        } catch (error) {
            next(error);
        }
    }

    async obtenerDocumento(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const { id } = req.params;

        try {
            const documento = await documentoService.obtenerDocumento(Number(id));
            res.status(200).json(documento);
        } catch (error) {
            next(error);
        }
    }

    async obtenerDocumentosPorInmueble(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const { inmuebleId } = req.params;

        try {
            const documentos = await documentoService.obtenerDocumentosPorInmueble(Number(inmuebleId));
            res.status(200).json(documentos);
        } catch (error) {
            next(error);
        }
    }

    async eliminarDocumento(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const { id } = req.params;

        try {
            await documentoService.eliminarDocumento(Number(id));
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async actualizarDocumento(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const { id } = req.params;
        const { tipoDocumento, estatus } = req.body;
        const file = req.file;
    
        try {
            if (!file && !estatus && !tipoDocumento) {
                res.status(400).json({ message: 'No se ha enviado información para actualizar' });
                return;
            }
            const documento = await documentoService.actualizarDocumento(Number(id), file, tipoDocumento as TipoDocumento, estatus);
            res.status(200).json(documento);
        } catch (error) {
            next(error);
        }
    }

    async actualizarEstatusDocumento(req: Request, res: Response, next: NextFunction): Promise<void>  {
        const { id } = req.params;
        const { estatus } = req.body;

        try {
            if (!estatus) {
                res.status(400).json({ message: 'No se ha enviado el nuevo estatus' });
                return;
            }
            const documento = await documentoService.actualizarEstatusDocumento(Number(id), estatus);
            res.status(200).json(documento);
        } catch (error) {
            next(error);
        }
    }
}

export default new DocumentoController();