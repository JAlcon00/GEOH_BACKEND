import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para permitir solo a administradores acceder a ciertas rutas.
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    // Se asume que req.user está definido por un middleware de autenticación previo
    if (req.user && req.user.tipo_usuario === 'administrador') {
        return next();
    }
    return res.status(403).json({ mensaje: 'Acceso denegado: solo administradores.' });
}
