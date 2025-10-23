import db from '../db/db.js'; 
import { eq } from 'drizzle-orm';
import { productsTable } from '../db/schema/productsSchema.js';  
import { productsSizesTable } from '../db/schema/productsSizeSchema.js';
import { categoriesTable } from '../db/schema/categoriesSchema.js';

const productReturnAttributes = {
    id: productsTable.id,
    categoryId: productsTable.categoryId,
    name: productsTable.name,
    description: productsTable.description,
    price: productsTable.price,
    imageUrl: productsTable.imageUrl,
    ageGroup: productsTable.age,
    gender: productsTable.gender,
    rating: productsTable.rating,
    rentCount: productsTable.rentCount
};


export const findAllProducts = async (categoryId) => {
    let whereClause = undefined;

    if(categoryId){
        whereClause = eq(productsTable.categoryId, categoryId);
    }

    try {
        const products = await db
        .select(productReturnAttributes)
        .from(productsTable)
        .where(whereClause);

        return products;

    } catch (error) {
        console.error("Error findAllProducts:", error);
        throw new Error('Gagal mengambil produk dari database.');
    }
};


export const findProductById = async (productId) => {
    try {
        const result = await db
        .select({
            product: productReturnAttributes,
            categoryName: categoriesTable.name,
            sizeName: productsSizesTable.name,
            stock: productsSizesTable.stock
        })
        .from(productsTable)
        .leftJoin(categoriesTable.eq(productsTable.categoryId, categoryId))
        .leftJoin(productsSizesTable.eq(productsSizesTable.productId, ProductId))
        .where(eq(productsTable.id, productId));

        return result.length > 0 ? result[0].product : undefined;
    } catch (error) {
        console.error("Error findProductById:", error);
        throw new Error('Gagal mencari detail produk di database.');
    }
};

export const insertProduct = async (productData, sizes) => {
    try{
        return await db.transaction(async (tx) => {
        
        const [newProduct] = await tx
            .insert(productsTable)
            .values(productData)
            .returning();

        // Cek dan mendapatkan ID
        if (!newProduct) {
            throw new Error('Failed to create product record.');
        }
        const newProductId = newProduct.id;
        
        const sizeInsertData = sizes.map(size => ({
            productId: newProductId,
            sizeName: size.sizeName,
            stock: size.stock,
        }));
        
        // 3. INSERT ke productsSizesTable
        await tx
            .insert(productsSizesTable)
            .values(sizeInsertData); 

        // Transaksi berhasil.
        return {
            ...newProduct,
            sizes: sizeInsertData,
        };
    });
    }catch(error){
        console.error("Error di addProduct repository:", error);
        throw new Error('Gagal menyimpan product ke database.'); 
    }
}