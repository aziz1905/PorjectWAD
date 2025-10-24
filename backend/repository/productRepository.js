import db from '../db/db.js'; 
import { eq } from 'drizzle-orm';
import { productAgeEnum, productsTable } from '../db/schema/productsSchema.js';  
import { productsSizesTable } from '../db/schema/productsSizeSchema.js';
import { categoriesTable } from '../db/schema/categoriesSchema.js';
import { select } from '@nextui-org/react';


const productReturnAttributes = {
    id: productsTable.id,
    categoryId: productsTable.categoryId,
    name: productsTable.name,
    description: productsTable.description,
    price: productsTable.price,
    imageUrl: productsTable.imageUrl,
    age: productsTable.age,
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
        .select({
            ...productReturnAttributes,
            sizeName: productsSizesTable.sizeName,
        })
        .from(productsTable)
        .leftJoin(productsSizesTable, eq(productsSizesTable.productId, productsTable.id)) 
        .where(whereClause);
        
        if (products.length === 0) {
            return undefined;
        }

        // pengelompokkan
        const groupProducts = products.reduce((acc, row) => {
            const productId = row.id;

            // Inisialisasi Produk jika belum ada di objek akumulator
            if(!acc[productId]){
                acc[productId] = {
                    ...row,
                    sizes: []
                }
            }

            const sizeName = row.sizeName;

            

            // Tambahkan ukuran ke array sizes jika sizeName ada
        if (row.sizeName && typeof row.sizeName === 'string' && !acc[productId].sizes.includes(sizeName)) {
            acc[productId].sizes.push(row.sizeName);
        }
            return acc;
        },{});

        const rawSizes = products
        .filter(row => row.sizeName !== null) 
        .map(row => row.sizeName);

        const uniqueSizes = [...new Set(rawSizes)];

        const finalProducts =Object.values(groupProducts).map(product => ({
            ...product,
            sizes: uniqueSizes.length > 0 ? uniqueSizes : "Stok Habis"
        }));
        
        return finalProducts;
    } catch (error) {
        console.error("Error findAllProducts:", error);
        throw new Error('Gagal mengambil produk dari database.');
    }
};


export const findProductById = async (productId) => {
    const id = parseInt(productId);
    if (isNaN(id)) return undefined;

    try {
        const result = await db
            .select({
                ...productReturnAttributes,
                categoryName: categoriesTable.name,
                sizeName: productsSizesTable.sizeName
            })
            .from(productsTable)
            .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id)) 
            .leftJoin(productsSizesTable, eq(productsSizesTable.productId, productsTable.id)) 
            .where(eq(productsTable.id, id));


        const firstRow = result[0];

        const sizesArray = result
            .filter(row => row.sizeName !== null) 
            .map(row => row.sizeName); 

            

        if (result.length === 0) {
            return undefined;
        }
        
        
    const finalProduct = {
        id: firstRow.id,
        name: firstRow.name,
        description: firstRow.description,
        price: firstRow.price,
        imageUrl: firstRow.imageUrl,
        age: firstRow.age,
        gender: firstRow.gender,
        categoryName: firstRow.categoryName,
        sizes: sizesArray.length > 0 ? sizesArray : "Stok Habis",
    };

    return finalProduct;
        

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


export const removeFromProduct = async(productId) => {
    const result = await db
    .delete(productsTable)
    .where(eq(productsTable.id, productId))
    .returning({id: productsTable.id});

    return result.length;
}