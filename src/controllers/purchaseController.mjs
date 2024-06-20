import { Purchase, PurchaseProduct, Product, User } from '../models/index.mjs';

export const createPurchase = async (req, res) => {
  try {
    const { clientId, products } = req.body;
    
    // Calculate total price of the purchase
    let total = 0;
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
      }
      total += product.price * item.quantity;
    }

    // Create purchase
    const purchase = await Purchase.create({ clientId, total });

    // Create PurchaseProducts entries
    for (const item of products) {
      await PurchaseProduct.create({
        purchaseId: purchase.id,
        productId: item.productId,
        quantity: item.quantity
      });
    }

    res.status(201).json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Error creating purchase' });
  }
};

export const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [
                { model: User, as: 'client' },
                { model: Product, through: PurchaseProduct }
            ]
        });
        res.status(200).json(purchases);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching purchases' });
    }
};

export const getPurchaseById = async (req, res) => {
    const { id } = req.params;
    try {
        const purchase = await Purchase.findByPk(id, {
            include: [
                { model: User, as: 'client' },
                { model: Product, through: PurchaseProduct }
            ]
        });
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        res.status(200).json(purchase);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching purchase' });
    }
};

export const updatePurchase = async (req, res) => {
    const { id } = req.params;
    const { products } = req.body;
    try {
        const purchase = await Purchase.findByPk(id);
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        await PurchaseProduct.destroy({ where: { purchaseId: id } });
        const purchaseProducts = products.map(product => ({
            purchaseId: id,
            productId: product.productId,
            quantity: product.quantity
        }));
        await PurchaseProduct.bulkCreate(purchaseProducts);
        res.status(200).json(purchase);
    } catch (err) {
        res.status(500).json({ error: 'Error updating purchase' });
    }
};

export const deletePurchase = async (req, res) => {
    const { id } = req.params;
    try {
        const purchase = await Purchase.findByPk(id);
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        await purchase.destroy();
        res.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting purchase' });
    }
};
