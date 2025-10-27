export const uploadToGetUrl = async (file) => {
    if (!file) {
        throw new Error("File objek tidak ditemukan.");
    }
    
    // Pastikan nama file selalu ada, jika Multer tidak menyediakannya (kasus ekstrem)
    const originalName = file.originalname || 'temp_file.bin';
    const cleanFileName = originalName.replace(/\s/g, '_');// Bersihkan Nama File (Hapus spasi dan karakter bermasalah)
    const uniqueFileName = `${Date.now()}_${cleanFileName}`; // Buat Nama File yang Unik dengan Timestamp
    
    // Kembalikan URL publik tiruan.
    const simulatedUrl = `https://cdn.kostumkita.com/products/${uniqueFileName}`;
    
    return simulatedUrl;
};