import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ProductCard from '../components/Comp_Product_Card';
import CompReview from '../components/Comp_Review';
import { useAuth } from '../components/AuthContext';
import api from '../api';
import ProductGrid from '../components/Comp_Product_Grid';


// ==== Tipe Data ====
type ProductSize = {
size: string;
stock: number | 'Stok Habis';
};

type ProductFromAPI = {
id: number;
name: string;
description: string;
price: number;
imageUrl: string;
age: 'Anak' | 'Remaja' | 'Dewasa';
gender: 'Pria' | 'Wanita' | 'Unisex';
categoryId: number;
categoryName: string;
sizes: ProductSize[] | 'Stok Habis';
rating: string;
totalReviews: number;
};

type ReviewFromAPI = {
reviewId: number;
userName: string;
rating: string;
comment: string;
createdAt: string;
};

type RelatedProduct = {
id: number;
name: string;
description: string;
price: number;
imageUrl: string;
age: 'Anak' | 'Remaja' | 'Dewasa';
gender: 'Pria' | 'Wanita' | 'Unisex';
categoryId: number;
rating: string;
sizes: string[] | 'Stok Habis';
};

// ==== Komponen Utama ====
const DetailProduk = () => {
const { id } = useParams<{ id: string }>();
const { isAuthenticated, user } = useAuth();

const [product, setProduct] = useState<ProductFromAPI | null>(null);
const [reviews, setReviews] = useState<ReviewFromAPI[]>([]);
const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
const [wishlistProductIds, setWishlistProductIds] = useState(new Set<number>());
const [isWishlisted, setIsWishlisted] = useState(false);
const [quantity, setQuantity] = useState(1);
const [selectedSize, setSelectedSize] = useState<string>('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// ==== Ambil Data dari API ====
useEffect(() => {
if (!id) {
setError('ID Produk tidak valid.');
setLoading(false);
return;
}

const fetchProductData = async () => {
  setLoading(true);
  setError(null);

  try {
    const productPromise = api.get(`/products/${id}`);
    const reviewsPromise = api.get(`/products/${id}/reviews`);
    const wishlistPromise = isAuthenticated ? api.get('/wishlist') : Promise.resolve({ data: [] });

    const [productRes, reviewsRes, wishlistRes] = await Promise.all([
      productPromise,
      reviewsPromise,
      wishlistPromise,
    ]);

    const mainProduct: ProductFromAPI = productRes.data;
    setProduct(mainProduct);
    setReviews(reviewsRes.data.data || []);

    const wishlistItems: { id: number }[] = wishlistRes.data || [];
    const wishlistSet = new Set(wishlistItems.map(item => item.id));
    setWishlistProductIds(wishlistSet);
    setIsWishlisted(wishlistSet.has(mainProduct.id));

    if (Array.isArray(mainProduct.sizes) && mainProduct.sizes.length > 0) {
      const available = mainProduct.sizes.find(s => s.stock !== 'Stok Habis' && s.stock > 0);
      setSelectedSize(available ? available.size : mainProduct.sizes[0].size);
    }

    if (mainProduct.categoryId) {
      try {
        const relatedRes = await api.get(`/products?category=${mainProduct.categoryId}`);
        const allRelated: RelatedProduct[] = relatedRes.data || [];
        const filtered = allRelated.filter(p => p.id !== mainProduct.id).slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Gagal mengambil produk terkait:', err);
      }
    }
  } catch (err) {
    console.error('Gagal mengambil data produk:', err);
    setError('Produk tidak dapat ditemukan atau terjadi kesalahan server.');
  } finally {
    setLoading(false);
  }
};

fetchProductData();

}, [id, isAuthenticated]);

// ==== Fungsi Interaksi ====
const handleToggleWishlist = async () => {
if (!user || !product) {
alert('Harap login untuk menambahkan ke wishlist.');
return;
}

const originalStatus = isWishlisted;
setIsWishlisted(!originalStatus);

try {
  if (!originalStatus) {
    await api.post('/wishlist/addWishlist', { productId: product.id });
    setWishlistProductIds(prev => new Set(prev).add(product.id));
  } else {
    await api.delete(`/wishlist/${product.id}`);
    setWishlistProductIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(product.id);
      return newSet;
    });
  }
} catch (error) {
  console.error('Gagal update wishlist:', error);
  setIsWishlisted(originalStatus);
  alert('Gagal memperbarui wishlist. Coba lagi.');
}
};

const handleQuantityChange = (amount: number) => {
        // Dapatkan info stok untuk ukuran yang dipilih
        let maxStock = 1; // Default
        if (product && Array.isArray(product.sizes)) {
            const sizeData = product.sizes.find(s => s.size === selectedSize);
            if (sizeData && typeof sizeData.stock === 'number') {
                maxStock = sizeData.stock;
            } else if (sizeData && sizeData.stock === "Stok Habis") { //
              maxStock = 0;
            }
        } else if (product && product.sizes === "Stok Habis") { //
          maxStock = 0; // Jika semua stok habis
      }

        setQuantity(prev => {
            const newQuantity = prev + amount;

            // Batasi jumlah antara 1 dan stok maksimum
            if (newQuantity < 1) {
                return 1;
            }
            if (newQuantity > maxStock) {
                return maxStock;
            }
            return newQuantity;
        });
    };

// ==== Render Kondisional ====
if (loading) return <div className="text-center py-40">Memuat detail produk...</div>;
if (error) return <div className="text-center py-40 text-red-600">{error}</div>;
if (!product) return <div className="text-center py-40">Produk tidak ditemukan!</div>;

// ==== Render Halaman ====
return (
<div className="detail-bg">
<div className="detail-container pt-5">
{/* Bagian Utama Produk */}
<div className="detail-main-grid">
<div className="detail-image-wrapper">
<img src={product.imageUrl} alt={product.name} className="detail-image" />
</div>
      <div className="detail-info-wrapper">
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-10 p-1.5 bg-white bg-opacity-70 rounded-full text-gray-600 hover:text-red-500 hover:bg-opacity-100 transition duration-200"
          aria-label="Toggle Wishlist"
        >
          <Icon
            icon={isWishlisted ? 'mdi:heart' : 'mdi:heart-outline'}
            className={`w-6 h-6 ${isWishlisted ? 'text-red-500' : ''}`}
          />
        </button>

        <h1 className="detail-title">{product.name}</h1>
        <div className="detail-rating-info">
          <Icon icon="mdi:star" className="text-yellow-400" />
          <span>{parseFloat(product.rating).toFixed(1)}</span>
          <span className="text-gray-400 mx-2">|</span>
          <span>{product.totalReviews} Ulasan</span>
        </div>

        <p className="detail-price">
          {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} / hari
        </p>
        <div className="detail-divider" />

        {/* Pilihan Ukuran */}
        <div className="detail-options">
          <p className="option-label">Ukuran</p>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(product.sizes) ? (
              product.sizes.length > 0 ? (
                product.sizes.map(s => {
                  const habis = s.stock === 'Stok Habis' || s.stock === 0;
                  return (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      disabled={habis}
                      className={`size-button ${selectedSize === s.size ? 'active' : ''} ${habis ? 'disabled' : ''}`}
                    >
                      {s.size}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Ukuran tidak tersedia</p>
              )
            ) : (
              <p className="text-sm text-red-500 font-medium">{product.sizes}</p>
            )}
          </div>
        </div>

        {/* Jumlah Sewa */}
        <div className="detail-options">
          <p className="option-label">Jumlah Sewa</p>
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange(-1)} className="quantity-btn">-</button>
            <span className="quantity-display">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="quantity-btn">+</button>
          </div>
        </div>

        <Link to="/detail-penyewaan" state={{ product, selectedSize, quantity }}>
          <button className="sewa-button">
            <Icon icon="mdi:cart-plus" className="mr-2" />
            Sewa Sekarang
          </button>
        </Link>
      </div>
    </div>

    {/* Spesifikasi */}
    <div className="spec-card">
      <h2 className="section-heading">Spesifikasi Pakaian</h2>
      <p className="spec-text whitespace-pre-line">{product.description}</p>
    </div>

    {/* Review */}
    <div className="spec-card mt-8 ">
      <h2 className="section-heading">Ulasan Pelanggan ({product.totalReviews})</h2>
      {reviews.length > 0 ? (
        <div className="space-y-6 mt-6">
          {reviews.map(review => (
            <CompReview
              key={review.reviewId}
              userName={review.userName}
              rating={parseFloat(review.rating)}
              comment={review.comment}
              createdAt={review.createdAt}
              className="review-card rounded-b-2xl shadow-lg"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Belum ada ulasan untuk produk ini.</p>
      )}
    </div>

    {/* Produk Lainnya */}
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-heading">Mungkin Anda Suka</h2>
        <Link to="/" className="text-blue-600 font-semibold text-sm">Lihat Semua</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map(p => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            description={p.description}
            price={p.price}
            imageUrl={p.imageUrl}
            sizes={p.sizes}
            age={p.age}
            gender={p.gender}
            categoryId={p.categoryId}
            rating={parseFloat(p.rating)}
            wishlisted={wishlistProductIds.has(p.id)}
          />
        ))}
      </div>
    </div>
    <ProductGrid wishlistProductIds={wishlistProductIds} />
  </div>
</div>
);
};

export default DetailProduk;