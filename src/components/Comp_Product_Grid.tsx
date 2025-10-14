import ProductCard from "./Comp_Product_Card";
import { useState, useEffect } from 'react';
import { Product } from "../type";



export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fungsi untuk mengambil data dari backend
    const fetchProducts = async () => {
      try {
        // Panggil API Produk Anda
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk dari server.');
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Terjadi kesalahan saat mengambil data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  if (loading) {
    return <div className="text-center py-12">Memuat produk...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">Error: {error}</div>;
  }
  
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.imageUrl}
          sizes={product.sizes}
          specification={product.specification}
          categoryId={product.categoryId}
        />
      ))}
    </div>
  );
}
