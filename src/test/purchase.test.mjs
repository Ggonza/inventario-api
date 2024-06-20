import request from 'supertest';
import app from '../app.mjs';
import db from '../models/index.mjs';

const { sequelize, User, Product, Purchase } = db;

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (err) {
    console.error('Error synchronizing the database:', err);
  }

  // Crear un usuario administrador y un cliente para las pruebas
  await User.create({
    username: 'adminuser',
    password: 'adminpassword',
    role: 'ADMIN',
  });

  await User.create({
    username: 'clientuser',
    password: 'clientpassword',
    role: 'CLIENT',
  });

  // Crear un producto para las pruebas
  await Product.create({
    lotNumber: 'A1',
    name: 'Test Product',
    price: 100,
    quantity: 50,
    entryDate: new Date(),
  });
});

describe('Purchase API', () => {
  it('should create a new purchase', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'clientuser',
        password: 'clientpassword',
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/purchases')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: 2, // ID del usuario cliente creado en beforeAll
        products: [
          {
            productId: 1, // ID del producto creado en beforeAll
            quantity: 2,
          },
        ],
      });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('clientId', 2);
  });

  it('should get all purchases', async () => {
    const res = await request(app).get('/api/purchases');

    expect(res.status).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
