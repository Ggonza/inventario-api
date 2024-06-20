import sequelize from '../config/database.mjs';
import userModel from './user.mjs';
import productModel from './product.mjs';
import purchaseModel from './purchase.mjs';
import purchaseProductModel from './purchaseProduct.mjs';

const User = userModel(sequelize);
const Product = productModel(sequelize);
const Purchase = purchaseModel(sequelize);
const PurchaseProduct = purchaseProductModel(sequelize);

// Relaciones
User.hasMany(Purchase, { as: 'purchases', foreignKey: 'clientId' });
Purchase.belongsTo(User, { as: 'client', foreignKey: 'clientId' });

Purchase.belongsToMany(Product, { through: PurchaseProduct, foreignKey: 'purchaseId' });
Product.belongsToMany(Purchase, { through: PurchaseProduct, foreignKey: 'productId' });

export { sequelize, User, Product, Purchase, PurchaseProduct };
