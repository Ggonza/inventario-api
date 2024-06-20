import { Product } from '../models/index.mjs';

export const createProduct = async (req, res) => {
    const { lotNumber, name, price, quantity, entryDate } = req.body;
    try {
        const product = await Product.create({ lotNumber, name, price, quantity, entryDate });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error creating product' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching product' });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { lotNumber, name, price, quantity, entryDate } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.update({ lotNumber, name, price, quantity, entryDate });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error updating product' });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};
