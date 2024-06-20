import request from 'supertest';
import app from '../app.mjs';
import db from '../models/index.mjs';

const { sequelize, User } = db;

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (err) {
    console.error('Error synchronizing the database:', err);
  }

  // Crear un usuario para las pruebas
  await User.create({
    username: 'testuser',
    password: 'testpassword',
    role: 'CLIENT',
  });
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        password: 'newpassword',
        role: 'CLIENT',
      });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
