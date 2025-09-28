import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Products from '../data/Produk.ts';
import ProductCard from "../components/Comp_Product_Card.tsx";

const DetailProduk = () => {
    const { id } = useParams<{ id: string }>(); 
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>('');

    useEffect(() => {
        const foundProduct = Products.find((p: Product) => p.id === id);
        setProduct(foundProduct || null);
        if (foundProduct && foundProduct.sizes.length > 0) {
            setSelectedSize(foundProduct.sizes[0]); 
        }
    }, [id]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount)); 
    };

    if (!product) {
        return <div className="text-center py-20">Produk tidak ditemukan!</div>;
    }

    return (
        <div className="detail-bg">
            <div className="detail-container">
                {/* Bagian Utama Produk */}
                <div className="detail-main-grid">
                    <div className="detail-image-wrapper">
                        <img src={product.imageUrl} alt={product.name} className="detail-image" />
                    </div>
                    <div className="detail-info-wrapper">
                        <h1 className="detail-title">{product.name}</h1>
                        <div className="detail-rating-info">
                            <Icon icon="mdi:star" className="text-yellow-400" />
                            <span>{product.rating}</span>
                            <span className="text-gray-400 mx-2">|</span>
                            <span>{product.sold} Terjual</span>
                        </div>
                        <p className="detail-price">
                            {product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                        </p>
                        <div className="detail-divider" />
                        <div className="detail-options">
                            <p className="option-label">Ukuran</p>
                            <div className="flex gap-2">
                                {product.sizes.map((size) => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`size-button ${selectedSize === size ? 'active' : ''}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="detail-options">
                            <p className="option-label">Jumlah Sewa</p>
                            <div className="quantity-selector">
                                <button onClick={() => handleQuantityChange(-1)} className="quantity-btn">-</button>
                                <span className="quantity-display">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="quantity-btn">+</button>
                            </div>
                        </div>
                        <button className="sewa-button">
                            <Icon icon="mdi:cart-plus" className="mr-2" />
                            Sewa Sekarang
                        </button>
                    </div>
                </div>

                {/* Spesifikasi Pakaian */}
                <div className="spec-card">
                    <h2 className="section-heading">Spesifikasi Pakaian</h2>
                    <p className="spec-text">{product.description}</p>
                </div>
                
                {/* Produk Lainnya */}
                <div className="mt-12">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="section-heading">Produk Lainnya</h2>
                        <Link to="/" className="text-blue-600 font-semibold text-sm">Lihat Semua</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* ✅ Tipe data langsung menggunakan "Product" */}
                        {Products.filter((p: Product) => p.id !== id).slice(0, 4).map((p: Product) => (
                            <ProductCard 
                                key={p.id} 
                                id={p.id} 
                                name={p.name} 
                                description={p.description} 
                                price={p.price} 
                                imageUrl={p.imageUrl} 
                                sizes={p.sizes} 
                                category={p.category} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailProduk;