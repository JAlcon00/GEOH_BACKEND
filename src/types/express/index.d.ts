import { UsuarioAttributes } from '../../models/usuario.model';
import 'express';

declare module 'express' {
  export interface Request {
    user?: UsuarioAttributes;
  }
}
