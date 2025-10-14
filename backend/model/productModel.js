import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.STRING(50), 
        primaryKey: true
    },

    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        field: 'category_id',
    },

    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT
    },

    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    imageUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'image_url'
    },

    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0.0
    },
    

    sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    tableName: 'products',
    timestamps: false
});

export default Product;