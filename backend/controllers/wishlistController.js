import { addToWishlist, getWishlistByUserId, removeFromWishlist } from "../repository/wishlistRepository.js";

export const getWishlist = async (req, res) => {
    const userId = req.user.id; // Diambil dari token JWT

    try {
        const wishlist = await getWishlistByUserId(userId);
        return res.status(200).json(wishlist);
    } catch (error) {
        console.error("Error getWishlist:", error);
        return res.status(500).json({ message: 'Gagal memuat wishlist.' });
    }
};

export const addProductToWishlist = async (req, res) => {
    const userId = req.user.id;
    const productId = req.body.productId; 

    if (!productId) {
        return res.status(400).json({ message: 'Product ID wajib diisi.' });
    }
    
    try {
        const item = await addToWishlist(userId, productId);
        return res.status(201).json({ message: 'Produk berhasil ditambahkan ke wishlist.', item });
    } catch (error) {
        // Menangani error jika user mencoba menambah produk yang sudah ada (Primary Key Conflict)
        if (error.message.includes('unique constraint')) {
            return res.status(409).json({ message: 'Produk sudah ada di wishlist.' });
        }
        console.error("Error adding to wishlist:", error);
        return res.status(500).json({ message: 'Gagal menambah item ke wishlist.' });
    }
};

export const deleteProductFromWishlist = async (req, res) => {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId); 

    if (isNaN(productId)) {
        return res.status(400).json({ message: 'Product ID tidak valid.' });
    }

    try {
        const rowsDeleted = await removeFromWishlist(userId, productId);

        if (rowsDeleted === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan di wishlist Anda.' });
        }
        
        return res.status(200).json({ message: 'Produk berhasil dihapus dari wishlist.' });
    } catch (error) {
        console.error("Error deleting from wishlist:", error);
        return res.status(500).json({ message: 'Gagal menghapus item dari wishlist.' });
    }
};