export const uploadToGetUrl = async (file) => {
    if (!file || !file.filename) {
        // Memastikan file dan data binernya (buffer) ada
        throw new Error("Data file tidak valid dari Multer.");
    }
    
    const uniqueFileName = file.filename;
    
    // URL Lokal yang dapat diakses:
    const localUrl = `http://localhost:5000/uploads/${uniqueFileName}`;
    
    return localUrl;
};