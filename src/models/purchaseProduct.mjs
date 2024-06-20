// models/purchaseProduct.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class PurchaseProduct extends Model {}

  PurchaseProduct.init({
    purchaseId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Purchases',
        key: 'id',
      },
      allowNull: false,
      field: 'PurchaseId', // Mapea purchaseId al campo PurchaseId en la base de datos
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id',
      },
      allowNull: false,
      field: 'ProductId', // Mapea productId al campo ProductId en la base de datos
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'PurchaseProduct',
    tableName: 'PurchaseProducts',
    timestamps: true,
  });

  return PurchaseProduct;
};
