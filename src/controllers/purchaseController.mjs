import { Purchase, PurchaseProduct, Product, sequelize, User } from '../models/index.mjs';

export const createPurchase = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { clientId, products } = req.body;

    let total = 0;
    let purchasedProducts = [];
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
      }
      if (product.price === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: `Product with ID ${item.productId} cannot be purchased at price 0` });
      }
      if (product.quantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ error: `Not enough quantity for product ID ${item.productId}` });
      }
      total += product.price * item.quantity;

      // Descontar la cantidad del producto
      await product.update({ quantity: product.quantity - item.quantity }, { transaction });

      // Agregar detalles del producto a la factura
      purchasedProducts.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      });
    }

    const purchase = await Purchase.create({ clientId, total }, { transaction });

    for (const item of products) {
      await PurchaseProduct.create({
        purchaseId: purchase.id,
        productId: item.productId,
        quantity: item.quantity,
      }, { transaction });
    }

    const client = await User.findByPk(clientId);

    await transaction.commit();

    // Generar la "factura"
    const invoice = {
      purchaseId: purchase.id,
      clientId: purchase.clientId,
      clientName: client.username, // Obtener el nombre del cliente
      date: purchase.createdAt, // Fecha y hora de la compra
      total: purchase.total,
      products: purchasedProducts,
    };

    res.status(201).json(invoice);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Error creating purchase' });
  }
};

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: User, as: 'client' },
        { model: Product, through: PurchaseProduct },
      ],
    });
    res.status(200).json(purchases);
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ error: 'Error fetching purchases' });
  }
};

export const getPurchaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByPk(id, {
      include: [
        { model: User, as: 'client' },
        { model: Product, through: PurchaseProduct },
      ],
    });
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    res.status(200).json(purchase);
  } catch (err) {
    console.error('Error fetching purchase:', err);
    res.status(500).json({ error: 'Error fetching purchase' });
  }
};

export const updatePurchase = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const existingProducts = await PurchaseProduct.findAll({ where: { purchaseId: id } });

    // Revertir las cantidades de los productos al estado antes de la compra
    for (const item of existingProducts) {
      const product = await Product.findByPk(item.productId);
      await product.update({ quantity: product.quantity + item.quantity }, { transaction });
    }

    // Eliminar los productos antiguos
    await PurchaseProduct.destroy({ where: { purchaseId: id } }, { transaction });

    // Crear y actualizar los nuevos productos
    for (const item of products) {
      if (item.quantity < 1) {
        await transaction.rollback();
        return res.status(400).json({ error: `Quantity for product ID ${item.productId} must be at least 1` });
      }

      const product = await Product.findByPk(item.productId);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
      }

      // Ajustar la cantidad del producto
      const existingProduct = existingProducts.find(p => p.productId === item.productId);
      if (existingProduct) {
        const quantityDifference = item.quantity - existingProduct.quantity;

        // Si la cantidad no ha cambiado, no hacer nada
        if (quantityDifference === 0) {
          continue;
        }

        if (product.quantity + existingProduct.quantity < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ error: `Not enough quantity for product ID ${item.productId}` });
        }
        await product.update({ quantity: product.quantity - quantityDifference }, { transaction });
      } else {
        if (product.quantity < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({ error: `Not enough quantity for product ID ${item.productId}` });
        }
        await product.update({ quantity: product.quantity - item.quantity }, { transaction });
      }

      await PurchaseProduct.create({
        purchaseId: purchase.id,
        productId: item.productId,
        quantity: item.quantity,
      }, { transaction });
    }

    await transaction.commit();
    res.status(200).json(purchase);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating purchase:', error);
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
    console.error('Error deleting purchase:', err);
    res.status(500).json({ error: 'Error deleting purchase' });
  }
};

export const getPurchasesByClient = async (req, res) => {
  const { clientId } = req.params;
  try {
    const purchases = await Purchase.findAll({
      where: { clientId },
      include: [
        { model: Product, through: { attributes: ['quantity'] } },
      ],
    });
    if (purchases.length === 0) {
      return res.status(404).json({ error: 'No purchases found for this client' });
    }
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Error fetching purchases' });
  }
};

export const getPurchaseTotalByClient = async (req, res) => {
  const { clientId } = req.params;
  try {
    const purchases = await Purchase.findAll({
      where: { clientId },
    });
    if (purchases.length === 0) {
      return res.status(404).json({ error: 'No purchases found for this client' });
    }
    const total = purchases.reduce((acc, purchase) => acc + purchase.total, 0);
    res.status(200).json({ clientId, total });
  } catch (error) {
    console.error('Error fetching total purchases:', error);
    res.status(500).json({ error: 'Error fetching total purchases' });
  }
};

export const getPurchaseHistory = async (req, res) => {
  const { clientId } = req.params;
  try {
    const purchases = await Purchase.findAll({
      where: { clientId },
      include: [
        {
          model: Product,
          through: { attributes: ['quantity'] },
        },
      ],
    });
    if (purchases.length === 0) {
      return res.status(404).json({ error: 'No purchase history found for this client' });
    }
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ error: 'Error fetching purchase history' });
  }
};