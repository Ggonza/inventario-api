import request from 'supertest';
import { app } from '../app.mjs';
import { sequelize, User, Product, Purchase, PurchaseProduct } from '../models/index.mjs';

describe('Purchase Controller', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let token;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', password: 'password', role: 'CLIENT' });
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password' });
    token = response.body.token;

    await Product.create({ lotNumber: 'A123', name: 'Product 1', price: 100, quantity: 10, entryDate: '2024-06-19' });
    await Product.create({ lotNumber: 'B456', name: 'Product 2', price: 200, quantity: 20, entryDate: '2024-06-19' });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Purchase.destroy({ where: {} });
    await PurchaseProduct.destroy({ where: {} });
  });

  it('should create a purchase', async () => {
    const response = await request(app)
      .post('/api/purchases/newPurchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: 1,
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 }
        ]
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('purchaseId');
    expect(response.body.products).toHaveLength(2);
  });

  it('should get all purchases', async () => {
    await request(app)
      .post('/api/purchases/newPurchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: 1,
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 }
        ]
      });

    const response = await request(app)
      .get('/api/purchases/all')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should update a purchase', async () => {
    const purchase = await request(app)
      .post('/api/purchases/newPurchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: 1,
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 }
        ]
      });

    const response = await request(app)
      .put(`/api/purchases/update/${purchase.body.purchaseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        products: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 4 }
        ]
      });

    expect(response.status).toBe(200);
  });

  it('should delete a purchase', async () => {
    const purchase = await request(app)
      .post('/api/purchases/newPurchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: 1,
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 }
        ]
      });

    const response = await request(app)
      .delete(`/api/purchases/delete/${purchase.body.purchaseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should get purchase history for a client', async () => {
    await request(app)
      .post('/api/purchases/newPurchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: 1,
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 }
        ]
      });

    const response = await request(app)
      .get('/api/purchases/client/1/history')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should get total purchases for a client', async () => {
    await request(app)
      .post('/api/purchases/newPurchase')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: 1,
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 3 }
        ]
      });

    const response = await request(app)
      .get('/api/purchases/client/1/total')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
  });
});
