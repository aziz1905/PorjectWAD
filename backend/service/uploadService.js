export const uploadToGetUrl = async (file) => {
    if (!file) {
        throw new Error("File tidak ditemukan.");
    }
    
    // Generate nama file unik (menggunakan timestamp dan nama asli)
    const originalName = file.originalname || 'unknown_file'; //Dapatkan nama file asli (misalnya, "Foto Kostum Baru.jpg")
    const cleanFileName = originalName.replace(/\s/g, '_');// Bersihkan Nama File (Hapus spasi dan karakter bermasalah)
    const uniqueFileName = `${Date.now()}_${cleanFileName}`; // Buat Nama File yang Unik dengan Timestamp
    
    // Kembalikan URL publik tiruan.
    const simulatedUrl = `https://cdn.kostumkita.com/products/${uniqueFileName}`;
    
    return simulatedUrl;
};