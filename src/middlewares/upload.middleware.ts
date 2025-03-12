import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from './error.middleware';

// Configuración de tipos de archivo permitidos
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf'
};

// Configuración de límites
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10
};

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log('Archivo recibido:', file);
    const mimeType = MIME_TYPES[file.mimetype as keyof typeof MIME_TYPES];
    
    if (!mimeType) {
        cb(new AppError(400, 'Tipo de archivo no permitido'));
        return;
    }

    cb(null, true);
};

export const multerInstance = multer({
    storage,
    limits,
    fileFilter
});

/*
// Configuración de Multer
export const upload = multer({
    storage,
    limits,
    fileFilter
}).fields([
    { name: 'escritura', maxCount: 1 },
    { name: 'libertad_gravamen', maxCount: 1 },
    { name: 'avaluo', maxCount: 1 },
    { name: 'fotografia', maxCount: 1 }
]);
*/

// Middleware de manejo de errores de Multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        err.code === 'LIMIT_FILE_SIZE' ? res.status(400).json({
            success: false,
            message: 'El archivo excede el tamaño permitido (5MB)'
        }) :
        err.code === 'LIMIT_FILE_COUNT' ? res.status(400).json({
            success: false,
            message: 'Número máximo de archivos excedido'
        }) : next(err);
    } else {
        next(err);
    }
};
