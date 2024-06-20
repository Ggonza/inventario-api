import request from 'supertest';
import app from '../app.mjs';
import db from '../models/index.mjs';

const { sequelize, User, Product } = db;

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (err) {
    console.error('Error synchronizing the database:', err);
  }

  // Crear un usuario administrador para las pruebas
  await User.create({
    username: 'adminuser',
    password: 'adminpassword',
    role: 'ADMIN',
  });
});

describe('Product API', () => {
  it('should create a new product', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'adminuser',
        password: 'adminpassword',
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        lotNumber: 'A1',
        name: 'Test Product',
        price: 100,
        quantity: 50,
        entryDate: new Date(),
      });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('lotNumber', 'A1');
  });

  it('should get all products', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
