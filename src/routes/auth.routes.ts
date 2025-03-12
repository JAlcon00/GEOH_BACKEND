import { Router } from 'express';
import AuthController from '../controllers/authController';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/login', AuthController.login);
router.post('/registro', AuthController.registro);

// Rutas protegidas
router.get('/profile', verifyToken, AuthController.getProfile);
router.put('/profile', verifyToken, AuthController.actualizar);
router.delete('/profile', verifyToken, AuthController.eliminar);

// Rutas de administrador
router.get('/usuarios', verifyToken, isAdmin, AuthController.listarUsuarios);
router.get('/usuarios/:id', verifyToken, isAdmin, AuthController.obtenerUsuario);
router.put('/usuarios/:id', verifyToken, isAdmin, AuthController.actualizarUsuario);
router.delete('/usuarios/:id', verifyToken, isAdmin, AuthController.eliminarUsuario);

const authRouter = router;
export default authRouter;