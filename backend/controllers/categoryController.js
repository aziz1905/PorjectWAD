import { findAllCategories } from "../repository/categoryRepository.js";

const categories = [
    { id: 1, name: 'Princess', icon: 'mdi:crown-outline' },
    { id: 2, name: 'Superhero', icon: 'game-icons:bat-mask' },
    { id: 3, name: 'Horor', icon: 'mdi:ghost-outline' },
    { id: 4, name: 'Tradisional', icon: 'mdi:drama-masks' },
    { id: 5, name: 'Profesi', icon: 'mdi:briefcase-outline' },
    { id: 6, name: 'Hewan', icon: 'mdi:dog' },
    { id: 7, name: 'Fantasi', icon: 'mdi:magic-staff' },
    { id: 8, name: 'Anime', icon: 'mdi:pokeball' }
];

export const getAllCategories = async (req, res) => {
    try{
        const categories = await findAllCategories();
        return res.status(200).json(categories);
    }catch(error){
        console.log("Gagal Menampilkan kategori: ", error.message); 
        return res.status(500).json({message : 'Gagal Memuat Daftar Kategori!'});
    }
    
};
