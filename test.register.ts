import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from './src/index';

const usuarioTest = {
    nombre: 'usuarioTest',
    apellido: 'TestApellido',
    contrasena: '12345678' // Contraseña en texto plano para pruebas
};

describe('Pruebas de Registro y Login', () => {
    beforeAll(async () => {
        // Registrar usuario antes de las pruebas de login
        await request(app)
            .post('/api/auth/registro')
            .send(usuarioTest);
    });

    it('Debería registrar un usuario correctamente', async () => {
        const response = await request(app)
            .post('/api/auth/registro')
            .send({
                nombre: 'usuarioNuevo',
                apellido: 'NuevoApellido',
                contrasena: '87654321'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('usuario');
        expect(response.body.usuario).toHaveProperty('id');
        expect(response.body.usuario).toHaveProperty('nombre', 'usuarioNuevo');
        expect(response.body.usuario).toHaveProperty('apellido', 'NuevoApellido');
    });

    it('Debería registrar un usuario administrador correctamente', async () => {
        const response = await request(app)
            .post('/api/auth/registro')
            .send({
                nombre: 'JoeAlcon',
                apellido: 'Admin',
                contrasena: 'JoeAlcon.99?',
                tipo_usuario: 'administrador'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('usuario');
        expect(response.body.usuario).toHaveProperty('nombre', 'JoeAlcon');
        expect(response.body.usuario).toHaveProperty('tipo_usuario', 'administrador');
    });

    it('Debería fallar al registrar un usuario con datos incompletos', async () => {
        const response = await request(app)
            .post('/api/auth/registro')
            .send({ nombre: 'usuarioTest' });
        expect([400, 500]).toContain(response.status);
    });

    it('Debería loguear un usuario correctamente', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                nombre: usuarioTest.nombre,
                contrasena: usuarioTest.contrasena
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.usuario).toHaveProperty('id');
    });

    it('Debería fallar al loguear con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                nombre: usuarioTest.nombre,
                contrasena: 'contrasenaIncorrecta'
            });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('mensaje', 'Credenciales inválidas');
    });
});