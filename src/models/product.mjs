import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Product = sequelize.define('Product', {
        lotNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        entryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    return Product;
};
