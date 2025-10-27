import { findAllCategories, findCategoryByid } from "../repository/categoryRepository.js";
import { insertCategory } from '../repository/categoryRepository.js';

export const createCategory = async (req, res) => {
    const {name} = req.body;

    if(!name || name.length === 0){
        return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    }
    try{
        const newCategory = await insertCategory(name);

        // Respon Sukses
        return res.status(201).json({ 
            message: 'Kategori berhasil ditambahkan!', 
            category: newCategory 
        });

    }catch (error) {
        console.error("Error createCategory:", error);
        // Nama sudah ada atau terjadi duplikasi
        if (error.message.includes('unique constraint')) {
            return res.status(409).json({ message: 'Kategori dengan nama ini sudah ada.' });
        }
        return res.status(500).json({ message: 'Gagal menambahkan kategori. Terjadi masalah pada server.' });
    }
}

export const getAllCategories = async (req, res) => {
    try{
        const categories = await findAllCategories();
        return res.status(200).json(categories);
    }catch(error){
        console.log("Gagal Menampilkan kategori: ", error.message); 
        return res.status(500).json({message : 'Gagal Memuat Daftar Kategori!'});
    }
};

export const getCategoryById = async (req, res) => {
    const categoryId = parseInt(req.params.id);

    if (isNaN(productId)) {
        return res.status(400).json({message: 'ID Tidak Valid.'});
        }

    try{
        const category = await findCategoryByid(categoryId)

        if (!categoryId) {
        return res.status(404).json({message: `Product dengan ID ${categoryId} Tidak Ditemukan.`});
        } else {
        res.status(200).json(category);
        }
    }catch(error){
        console.log("Gagal Menampilkan kategori ini. ", error.message); 
        return res.status(500).json({message : 'Gagal Memuat category!'});
    }
}
