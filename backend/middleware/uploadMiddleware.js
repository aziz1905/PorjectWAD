import multer from 'multer';

//Menyimpan file di memori (sebelum dikirim ke cloud)
const storage = multer.memoryStorage();

// Batas ukuran maks 5MB dan hanya menerima format gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak didukung.'), false);
    }
};

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: fileFilter 
});

