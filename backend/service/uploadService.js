export const getFilenameFromUpload = (file) => {
    if (!file || !file.filename) {
        throw new Error("Informasi file tidak valid.");
    }
    // Cukup kembalikan nama file unik yang dibuat multer
    return file.filename; 
};