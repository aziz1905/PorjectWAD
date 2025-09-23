import ProductCard from './Product_Card';

export default function ProductGrid() {
  // Example products array; replace with your actual data source as needed
    const products = [
    {
        id: 1,
        name: 'Gaun Pesta Merah',
        description: 'Gaun merah untuk pesta pernikahan.',
        price: 250000,
        imageUrl: 'https://via.placeholder.com/400x300.png/007bff/ffffff?text=Sepatu',
        sizes: ['S', 'M', 'L'],
        category: { age: 'Dewasa', gender: 'Wanita' },
    } as const,
    {
        id: 2,
        name: 'Kostum Superhero',
        description: 'Kostum untuk sang penyelamat bumi.',
        price: 120000,
        imageUrl: 'https://via.placeholder.com/400x300.png/28a745/ffffff?text=Jam',
        sizes: ['M', 'L', 'XL'],
        category: { age: 'Anak-anak', gender: 'Pria' },
    } as const,
    {
        id: 3,
        name: 'Kostum Tradisional',
        description: 'Kostum tradisional yang bisa di gunakan untuk Pesta pernikahan dan masih banyak lagi.',
        price: 150000,
        imageUrl: 'https://via.placeholder.com/400x300.png/ffc107/000000?text=Tas',
        sizes: ['S', 'L', 'XL', 'XXL'],
        category: { age: 'Dewasa', gender: 'Wanita' },
    } as const,
    ];

  return (
    <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
              sizes ={product.sizes}
              category={product.category}
            />
          ))}
        </div>
  )
}
