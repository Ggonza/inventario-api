// models/purchase.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Purchase extends Model {}

  Purchase.init({
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'Purchases',
    timestamps: true,
  });

  return Purchase;
};
