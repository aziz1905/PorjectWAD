import { findAllProducts, findProductById } from "../repository/productRepository.js";



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

        if (!productId) {
        return res.status(404).json({message: `Product dengan ID ${ProductId} Tidak Ditemukan.`});
        } else {
        res.status(200).json(product);
        }
    }catch(error){
        console.log("Gagal Menampilkan Product ini. ", error.message); 
        return res.status(500).json({message : 'Gagal Memuat Product!'});
    }
    
};
