import { Router } from 'express';
import SearchController from '../controllers/searchController';

const router = Router();

router.get('/', SearchController.buscarInmuebles);

export default router;