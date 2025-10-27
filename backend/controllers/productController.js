import { findAllProducts, findProductById, insertProduct, removeFromProduct, updateProduct } from "../repository/productRepository.js";
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





export const getProductByid = async (req, res) =>{
    const productId = parseInt(req.params.id); 

    if (isNaN(productId)) {
        return res.status(400).json({message: 'ID Tidak Valid.'});
        }
    
    try{
        const product = await findProductById(productId);

        if (!product) {
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
            // Error jika categoryId tidak ditemukan di tabel Categories
            return res.status(400).json({ message: 'Category ID tidak valid atau tidak ditemukan.' });
        }
        if (errorMessage.includes('violates not-null constraint')) {
            // Error jika field seperti description atau imageUrl dikirim sebagai null/undefined
            return res.status(400).json({ message: 'Data produk tidak lengkap: Field wajib tidak boleh kosong.' });
        }
        
        // Error default (misalnya, masalah koneksi atau error Drizzle internal)
        return res.status(500).json({ 
            message: 'Gagal menambahkan produk. Terjadi masalah database atau server yang tidak terduga.'
        });
    }
}





export const updateProductAndSizes = async (req, res) => {
    const productId = parseInt(req.params.productId); 
    const { name, description, price, imageUrl, age, gender, categoryId, sizes } = req.body;
    
    if (isNaN(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid.' });
    }

    // Hanya buat payload untuk productsTable
    const productData = { 
        categoryId,
        name, 
        description, 
        price, 
        imageUrl, 
        age, 
        gender
    };

    // Validasi minimum untuk update
    if (!sizes || sizes.length === 0) {
        return res.status(400).json({ message: 'Ukuran (sizes) dan stok wajib disertakan untuk update.' });
    }

    try {
        const updatedData = await updateProduct(productId, productData, sizes);

        if (updatedData === null) {
            return res.status(404).json({ message: `Produk dengan ID ${productId} tidak ditemukan.` });
        }

        return res.status(200).json({
            message: 'Produk dan stok berhasil diperbarui!',
            product: updatedData,
        });

    } catch (error) {
        console.error("Error updateProduct:", error.message);
        // Tangani error yang dilempar dari repository
        return res.status(500).json({ message: error.message || 'Gagal memperbarui produk.' });
    }
};





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