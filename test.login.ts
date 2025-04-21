import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './src/index';

describe('Pruebas de Login', () => {
    it('Debería loguear un usuario correctamente', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                nombre: 'usuarioTest',
                contrasena: '12345678' // Contraseña en texto plano para pruebas
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.usuario).toHaveProperty('id');
    });

    it('Debería fallar al loguear con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                nombre: 'usuarioTest',
                contrasena: 'contraseñaIncorrectaCifradaBase64'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('mensaje', 'Credenciales inválidas');
    });
});