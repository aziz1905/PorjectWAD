import { insertReviewsAndUpdateRating, findRecentReviews } from "../repository/reviewsRepository.js";

export const createReviews = async (req, res) => {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!productId || typeof rating !== 'number' || rating < 1 || rating > 5 || !comment) {
        return res.status(400).json({ message: 'Product ID, rating (1-5), dan komentar wajib diisi.' });
    }

    const reviewData = {
        userId: userId,
        productId: productId,
        rating: rating,
        comment: comment,
    };

    try{
        const newReview = await insertReviewsAndUpdateRating(reviewData);
        
        return res.status(201).json({ 
            message: 'Ulasan dan rating berhasil ditambahkan.', 
            review: newReview 
        });
    }catch(error){
        console.error("Error create reviews process:", error); 
        return res.status(500).json({ message: 'Gagal memberi Ulasan!' });
    }
}

export const getRecentReviews = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    try {
        // Panggil repository untuk mendapatkan 3 ulasan terbaru
        const reviews = await findRecentReviews(limit);
        
        return res.status(200).json(reviews);

    } catch (error) {
        console.error("Error getRecentReviews:", error); 
        return res.status(500).json({ message: 'Gagal memuat ulasan.' });
    }
};