import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Purchase extends Model {}

  Purchase.init({
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'Purchases'
  });

  Purchase.associate = (models) => {
    Purchase.belongsTo(models.User, { foreignKey: 'clientId' });
    Purchase.belongsToMany(models.Product, { through: models.PurchaseProduct, foreignKey: 'purchaseId' });
  };

  return Purchase;
};
