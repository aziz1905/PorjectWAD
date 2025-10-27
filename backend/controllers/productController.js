import { findAllProducts, findProductById, insertProduct, removeFromProduct } from "../repository/productRepository.js";
import { findReviewsByProductId } from "../repository/reviewsRepository.js";



export const getProduct = async (req, res) => {
    const categoryId = req.query.category ? parseInt(req.query.category) : null;

    try{
        const products = await findAllProducts(categoryId);
    
    if (products.length === 0 && categoryId){
        return res.status(404).json({message: 'Tidak ada Product di Kategori ini.'})
    }else{
        res.status(200).json(products);
    }
    }catch(error){
        console.log("Gagal Menampilkan Products: ", error.message); 
        return res.status(500).json({message : 'Gagal Memuat Daftar Product!'});
    }
};


// bagian pertama untuk detail product
export const getProductDetail = async (req, res) =>{
    const productId = parseInt(req.params.id); 

    if (isNaN(productId)) {
        return res.status(400).json({message: 'ID Tidak Valid.'});
        }
    
    try{
        const product = await findProductById(productId);

        if (!productId) {
        return res.status(404).json({message: `Product dengan ID ${productId} Tidak Ditemukan.`});
        } else {
        res.status(200).json(product);
        }
    }catch(error){
        console.log("Gagal Menampilkan Product ini. ", error.message); 
        return res.status(500).json({message : 'Gagal Memuat Product!'});
    }
};


// bagian ke 2 untuk detail product
export const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    try{

        const result = await findReviewsByProductId(productId);

        if (result.totalCount === 0) {
            return res.status(200).json({ 
                message: result.message, 
                data: []
            });
        }

        return res.status(200).json({
            message: result.message,
            data: result.data,
            totalCount: result.totalCount
        });

    }catch(error){
        console.error("Error di getProductReviews :", error.message);
        return res.status(500).json({ message: 'Gagal mengambil data review!' });
    }
}

export const createProduct = async (req, res) => {
    const {categoryId, name, description, price, imageUrl, age, gender, sizes } = req.body;

    if (!categoryId || !name || !price || !imageUrl || !sizes || sizes.length === 0) {
        return res.status(400).json({ message: 'Semua field produk (termasuk ukuran/stok) wajib diisi.' });
    }

    const newProductData = {
        categoryId: categoryId,
        name: name,
        description: description,
        price: price, 
        imageUrl: imageUrl,
        age: age, 
        gender: gender
    }

    try{
        const product = await insertProduct(newProductData, sizes);
        return res.status(201).json({ 
            message: 'Produk dan stok berhasil ditambahkan!', 
            product: product 
        });
    }catch (error) {
        console.error("Error createProduct:", error.message);

        // KOREKSI: Tambahkan penanganan error spesifik dari database
        const errorMessage = error.message;

        if (errorMessage.includes('violates foreign key constraint')) {
            return res.status(400).json({ message: 'Category ID tidak valid atau tidak ditemukan.' });
        }
        if (errorMessage.includes('violates not-null constraint')) {
            return res.status(400).json({ message: 'Data produk tidak lengkap: Field wajib tidak boleh kosong.' });
        }
        
        return res.status(500).json({ 
            message: 'Gagal menambahkan produk. Terjadi masalah database atau server yang tidak terduga.'
        });
    }
}



export const deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.productId); 

    if (isNaN(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid.' });
    }

    try{
        const deleteId = await removeFromProduct(productId);

        if (deleteId === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan di wishlist Anda.' });
        }
        return res.status(200).json({ message: 'Produk berhasil dihapus.' });
    }catch(error){
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: 'Gagal menghapus product.' });
    }
};