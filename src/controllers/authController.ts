import { Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import { generateToken, decryptPassword } from '../config/jwt.config';

interface LoginRequest extends Request {
    body: {
        nombre: string;
        contrasena: string;
    }
}

interface RegistroRequest extends Request {
    body: {
        nombre: string;
        apellido: string;
        contrasena: string;
        tipo_usuario?: 'usuario' | 'administrador';
    }
}

export class AuthController {
    //funciona
    async login(req: LoginRequest, res: Response): Promise<void> {
        try {
            const { nombre, contrasena } = req.body;
            const usuario = await Usuario.findOne({ where: { nombre } });

            if (!usuario) {
                res.status(401).json({ mensaje: 'Credenciales inválidas' });
                return;
            }

            // Usar la contraseña directamente si parece texto plano
            let contrasenaProcesada = contrasena;
            // Si parece base64 (longitud múltiplo de 4 y solo caracteres base64), intenta desencriptar
            if (/^[A-Za-z0-9+/=]+$/.test(contrasena) && contrasena.length % 4 === 0) {
                try {
                    contrasenaProcesada = decryptPassword(contrasena);
                } catch (e) {
                    // Si falla la desencriptación, usa la contraseña original
                    contrasenaProcesada = contrasena;
                }
            }

            const esValido = await usuario.validarContrasena(contrasenaProcesada);
            if (!esValido) {
                res.status(401).json({ mensaje: 'Credenciales inválidas' });
                return;
            }

            const token = generateToken({
                id: usuario.id,
                tipo_usuario: usuario.tipo_usuario
            });

            res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    tipo_usuario: usuario.tipo_usuario
                }
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }

    //funciona
    async registro(req: RegistroRequest, res: Response): Promise<void> {
        try {
            const { nombre, apellido, contrasena, tipo_usuario = 'usuario' } = req.body;

            // Validación de datos obligatorios
            if (!nombre || !apellido || !contrasena) {
                res.status(400).json({ mensaje: 'Datos incompletos' });
                return;
            }

            const existe = await Usuario.findOne({ where: { nombre } });
            if (existe) {
                res.status(400).json({ mensaje: 'El usuario ya existe' });
                return;
            }

            // Usar la contraseña directamente si parece texto plano
            let contrasenaProcesada = contrasena;
            if (/^[A-Za-z0-9+/=]+$/.test(contrasena) && contrasena.length % 4 === 0) {
                try {
                    contrasenaProcesada = decryptPassword(contrasena);
                } catch (e) {
                    contrasenaProcesada = contrasena;
                }
            }

            const usuario = await Usuario.create({
                nombre,
                apellido,
                contrasena: contrasenaProcesada,
                tipo_usuario
            });

            const token = generateToken({
                id: usuario.id,
                tipo_usuario: usuario.tipo_usuario
            });

            res.status(201).json({
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    tipo_usuario: usuario.tipo_usuario
                }
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }

    //funciona
    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const usuario = req.usuario;
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }
    //funciona
    actualizar = async (req: Request, res: Response): Promise<void> => {
        await this.actualizarUsuarioGenerico(req, res, req.usuario?.id?.toString());
    }

    //funciona
    eliminar = async (req: Request, res: Response): Promise<void> => {
        await this.eliminarUsuarioGenerico(req, res, req.usuario?.id?.toString());
    }

    //funciona
    async listarUsuarios(req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await Usuario.findAll({
                attributes: { exclude: ['contrasena'] }
            });
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }

    //funciona
    async obtenerUsuario(req: Request, res: Response): Promise<void> {
        try {
            const usuario = await Usuario.findByPk(req.params.id, {
                attributes: { exclude: ['contrasena'] }
            });

            if (!usuario) {
                res.status(404).json({ mensaje: 'Usuario no encontrado' });
                return;
            }

            res.json(usuario);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }

    //funciona
    actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
        await this.actualizarUsuarioGenerico(req, res, req.params.id);
    }

    //funciona

    eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
        await this.eliminarUsuarioGenerico(req, res, req.params.id);
    }

    //funciona

    private actualizarUsuarioGenerico = async (req: Request, res: Response, id: string | undefined): Promise<void> => {
        try {
            const { nombre, apellido } = req.body;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                res.status(404).json({ mensaje: 'Usuario no encontrado' });
                return;
            }

            await usuario.update({ nombre, apellido });
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }

    //funciona

    private eliminarUsuarioGenerico = async (req: Request, res: Response, id: string | undefined): Promise<void> => {
        try {
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                res.status(404).json({ mensaje: 'Usuario no encontrado' });
                return;
            }

            await usuario.destroy();
            res.json({ mensaje: 'Usuario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error en el servidor' });
        }
    }
}

export default new AuthController();