import { Router } from 'express';
import {

createCliente,
getAllClientes,
getClienteById,
getClienteByRFC,
updateCliente,
deleteCliente
} from '../controllers/clienteController';

const router = Router();

// Create a new cliente
router.post('/', createCliente);

// Get all clientes
router.get('/', getAllClientes);

// Get a single cliente by ID
router.get('/:id', getClienteById);

// Get cliente By RFC
router.get('/rfc/:rfc', getClienteByRFC);

// Update a cliente
router.put('/:id', updateCliente);

// Delete a cliente
router.delete('/:id', deleteCliente);

export default router;