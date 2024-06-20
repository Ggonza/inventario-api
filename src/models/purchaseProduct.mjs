import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class PurchaseProduct extends Model {}

  PurchaseProduct.init({
    purchaseProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Purchases',
        key: 'id'
      },
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PurchaseProduct',
    tableName: 'PurchaseProducts'
  });

  return PurchaseProduct;
};
