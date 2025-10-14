import Product from '../model/productModel.js';
import ProductSize from '../model/productSizeModel.js'; 
import Category from '../model/categoryModel.js';     

const productAttributes = [
    'id', 'name', 'description', 'price', 'imageUrl', 'rating', 'sold', 'categoryId'
];


export const findAllProducts = async (categoryId) => {
    const whereCondition = categoryId ? { categoryId: categoryId } : {};

    try {
        const products = await Product.findAll({
            where: whereCondition,
            attributes: productAttributes,

        });
        return products.map(p => p.toJSON());
    } catch (error) {
        console.error("Error findAllProducts:", error);
        throw new Error('Gagal mengambil produk dari database.');
    }
};


export const findProductById = async (productId) => {
    try {
        const product = await Product.findByPk(productId, {
            attributes: productAttributes,
       
            include: [
                {
                    model: Category,
                    as: 'category', 
                    attributes: ['name']
                },
                {
                    model: ProductSize,
                    as: 'sizes', 
                    attributes: ['sizeName', 'stock']
                }
            ]
        });
        
        return product ? product.toJSON() : undefined;
    } catch (error) {
        console.error("Error findProductById:", error);
        throw new Error('Gagal mencari detail produk di database.');
    }
};