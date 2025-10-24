import { uploadToGetUrl } from "../service/uploadService.js";

export const uploadImage = async (req, res) => {
    const file = req.file; 

    if (!file) {
        return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah.' });
    }

    try {
        // Panggil service untuk mendapatkan URL tiruan
        const imageUrl = await uploadToGetUrl(file);

        // Mengembalikan URL publik ke frontend
        return res.status(200).json({ 
            message: 'Gambar berhasil diunggah.', 
            imageUrl: imageUrl // <--- URL Tiruan ini yang disimpan Drizzle
        });

    } catch (error) {
        console.error("Error upload image:", error); 
        return res.status(500).json({ message: 'Gagal Upload!' });
    }
};