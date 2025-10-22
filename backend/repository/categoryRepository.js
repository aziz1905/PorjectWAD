import db from '../db/db.js'; 
import { eq } from 'drizzle-orm';
import { categoriesTable } from '../db/schema/categoriesSchema.js';

const categoriesReturnAttribut = {
    id: categoriesTable.id,
    name: categoriesTable.name
};

export const insertCategory = async(categoryName) =>{
    try{
    const newCategory = await db
    .insert(categoriesTable)
    .values({name: categoryName})
    .returning(categoriesReturnAttribut)

    return newCategory;
    }catch(error) {
        console.error("Error insert kategori:", error);
        throw new Error('Gagal membuat kategori.');
    }
}

export const findAllCategories = async () => {
    try {
        const categories = await db
        .select(categoriesReturnAttribut)
        .from(categoriesTable);

        return categories;
    } catch (error) {
        console.error("Error findAllCategories:", error);
        throw new Error('Gagal mengambil kategori dari database.');
    }
};
