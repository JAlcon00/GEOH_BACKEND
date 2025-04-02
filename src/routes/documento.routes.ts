import { Router } from 'express';
import DocumentoController from '../controllers/documentoController';
//import multer from 'multer';
import { multerInstance, handleUploadError } from '../middlewares/upload.middleware';

//const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/', multerInstance.single('file'), handleUploadError, DocumentoController.subirDocumento);
router.post('/multi', multerInstance.array('files'), handleUploadError, DocumentoController.subirMultiplesDocumentos);
router.get('/:id', DocumentoController.obtenerDocumento);
router.get('/inmueble/:inmuebleId', DocumentoController.obtenerDocumentosPorInmueble);
router.delete('/:id', DocumentoController.eliminarDocumento);
router.put('/:id', multerInstance.single('file'), handleUploadError, DocumentoController.actualizarDocumento);
router.put('/:id/estatus', DocumentoController.actualizarEstatusDocumento);

export default router;