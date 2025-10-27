import multer from 'multer';

//Menyimpan file di memori (sebelum dikirim ke cloud)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pastikan folder ini ada di root project Anda
        cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
        // Membuat nama file yang unik dan bersih
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    }
});

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

