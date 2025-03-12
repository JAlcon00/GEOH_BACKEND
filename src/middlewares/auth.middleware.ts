import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.model';

interface TokenPayload {
    id: number;
    tipo_usuario: string;
}

declare global {
    namespace Express {
        interface Request {
            usuario?: Usuario;
        }
    }
}

export const verifyToken = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            res.status(401).json({ message: 'No se proporcionó token' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            res.status(401).json({ message: 'Usuario no encontrado' });
            return;
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
        return;
    }
};

export const isAdmin = (
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    if (req.usuario?.tipo_usuario !== 'administrador') {
        res.status(403).json({ message: 'Acceso denegado' });
        return;
    }
    next();
};