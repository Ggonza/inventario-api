import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.mjs';
import productRoutes from './routes/productRoutes.mjs';
import purchaseRoutes from './routes/purchaseRoutes.mjs';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/apidoc', express.static('apidoc'));

export default app;
