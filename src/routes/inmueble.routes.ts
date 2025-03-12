import { Router } from 'express';
import InmuebleController from '../controllers/inmuebleController';
import { multerInstance } from '../middlewares/upload.middleware';

const router = Router();

router.post('/', multerInstance.single('file'), InmuebleController.crearInmueble);
router.get('/:id', InmuebleController.obtenerInmueble);
router.get('/', InmuebleController.obtenerInmuebles);
router.get('/cliente/:clienteId', InmuebleController.obtenerInmueblesPorCliente);
router.put('/:id', multerInstance.single('file'), InmuebleController.actualizarInmueble);
router.delete('/:id', InmuebleController.eliminarInmueble);

export default router;