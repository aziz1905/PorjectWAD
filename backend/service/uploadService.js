export const uploadToGetUrl = async (file) => {
    if (!file || !file.buffer) {
        // Memastikan file dan data binernya (buffer) ada
        throw new Error("Data file tidak valid dari Multer.");
    }
    
    // 1. Dapatkan tipe MIME untuk header data URI
    const mimeType = file.mimetype; 
    
    // 2. Konversi Buffer menjadi string Base64
    const base64String = file.buffer.toString('base64');
    
    // 3. Gabungkan menjadi format Data URI (yang dapat dibaca browser)
    const dataUri = `data:${mimeType};base64,${base64String}`;
    
    // Kembalikan Data URI (Ini adalah 'link' gambar yang sesungguhnya)
    return dataUri;
};