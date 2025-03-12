import { Request, Response } from 'express';
import cliente from '../models/cliente.model';

// Create
export const createCliente = async (req: Request, res: Response) => {
    try {
        const newCliente = await cliente.create(req.body);
        res.status(201).json(newCliente);
    } catch (error) {
        console.error('Error creating cliente:', error);
        res.status(500).json({ message: 'Error creating cliente', error });
    }
};

// Read all
export const getAllClientes = async (_req: Request, res: Response) => {
    try {
        const clientes = await cliente.findAll();
        res.json(clientes);
    } catch (error) {
        console.error('Error fetching clientes:', error);
        res.status(500).json({ message: 'Error fetching clientes', error });
    }
};

// Read one
export const getClienteById = async (req: Request, res: Response) => {
    try {
        const foundCliente = await cliente.findByPk(req.params.id);
        foundCliente 
            ? res.json(foundCliente)
            : res.status(404).json({ message: 'Cliente not found' });
    } catch (error) {
        console.error('Error fetching cliente:', error);
        res.status(500).json({ message: 'Error fetching cliente', error });
    }
};

export const getClienteByRFC = async (req: Request, res: Response) => {
    try {
        const foundCliente = await cliente.findOne({ where: { rfc: req.params.rfc } });
        foundCliente 
            ? res.json(foundCliente)
            : res.status(404).json({ message: 'Cliente not found' });
    } catch (error) {
        console.error('Error fetching cliente:', error);
        res.status(500).json({ message: 'Error fetching cliente', error });
    }
};



// Update
export const updateCliente = async (req: Request, res: Response) => {
    try {
        const [updated] = await cliente.update(req.body, {
            where: { id: req.params.id }
        });
        updated 
            ? res.json(await cliente.findByPk(req.params.id))
            : res.status(404).json({ message: 'Cliente not found' });
    } catch (error) {
        console.error('Error updating cliente:', error);
        res.status(500).json({ message: 'Error updating cliente', error });
    }
};

// Delete
export const deleteCliente = async (req: Request, res: Response) => {
    try {
        const deleted = await cliente.destroy({
            where: { id: req.params.id }
        });
        deleted
            ? res.status(204).send()
            : res.status(404).json({ message: 'Cliente not found' });
    } catch (error) {
        console.error('Error deleting cliente:', error);
        res.status(500).json({ message: 'Error deleting cliente', error });
    }
};