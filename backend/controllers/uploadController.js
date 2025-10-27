export const uploadImage = async (req, res) => {
    const file = req.file; // File info from multer

    if (!file) {
        return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah.' });
    }

    try {
        // Langsung buat URL publik berdasarkan filename dari multer
        // Pastikan Express menyajikan folder 'public' atau 'uploads' secara statis
        // Contoh: http://localhost:5000/uploads/namafileunik.jpg
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`; 

        console.log("Generated public URL:", imageUrl); // Log URL yang benar

        // Mengembalikan URL publik ke frontend
        return res.status(200).json({ 
            message: 'Gambar berhasil diunggah.', 
            imageUrl: imageUrl // <-- Kembalikan URL yang BENAR
        });

    } catch (error) {
        console.error("Error processing uploaded image:", error); 
        // Hapus file jika ada error setelah multer menyimpan? (Opsional)
        // if (file && fs.existsSync(file.path)) { fs.unlinkSync(file.path); }
        return res.status(500).json({ message: 'Gagal memproses gambar!' });
    }
};