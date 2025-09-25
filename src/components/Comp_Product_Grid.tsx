import ProductCard from './Comp_Product_Card';

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
        {
        id: 4,
        name: 'Kostum Astronaut Anak',
        description: 'Kostum profesi astronaut untuk anak-anak yang bercita-cita ke luar angkasa.',
        price: 135000,
        imageUrl: 'https://via.placeholder.com/400x300.png/6f42c1/ffffff?text=Astronaut',
        sizes: ['S', 'M', 'L'],
        category: { age: 'Anak-anak', gender: 'Pria' },
    } as const,
    {
        id: 5,
        name: 'Gaun Putri Salju',
        description: 'Gaun cantik bertema putri salju, cocok untuk pesta ulang tahun.',
        price: 180000,
        imageUrl: 'https://via.placeholder.com/400x300.png/e83e8c/ffffff?text=Putri',
        sizes: ['XS', 'S', 'M'],
        category: { age: 'Anak-anak', gender: 'Wanita' },
    } as const,
    {
        id: 6,
        name: 'Kostum Dokter Dewasa',
        description: 'Kostum profesi dokter lengkap dengan jas putih dan stetoskop mainan.',
        price: 160000,
        imageUrl: 'https://via.placeholder.com/400x300.png/20c997/ffffff?text=Dokter',
        sizes: ['M', 'L', 'XL'],
        category: { age: 'Dewasa', gender: 'Pria' },
    } as const,
    {
        id: 7,
        name: 'Kostum Hewan Panda',
        description: 'Kostum lucu berbentuk panda, cocok untuk anak-anak yang suka binatang.',
        price: 110000,
        imageUrl: 'https://via.placeholder.com/400x300.png/f8f9fa/000000?text=Panda',
        sizes: ['S', 'M'],
        category: { age: 'Anak-anak', gender: 'Pria' },
    } as const,
    {
        id: 8,
        name: 'Kostum Fantasi Elf',
        description: 'Kostum elf dengan jubah hijau dan aksesoris telinga, cocok untuk cosplay atau pesta tema.',
        price: 200000,
        imageUrl: 'https://via.placeholder.com/400x300.png/17a2b8/ffffff?text=Elf',
        sizes: ['M', 'L', 'XL'],
        category: { age: 'Dewasa', gender: 'Wanita' },
    } as const,
    {
        id: 9,
        name: 'Kostum Putri Duyung',
        description: 'Kostum cantik dengan ekor berkilau, cocok untuk pesta tema laut.',
        price: 175000,
        imageUrl: 'https://via.placeholder.com/400x300.png/ff69b4/ffffff?text=Putri+Duyung',
        sizes: ['S', 'M', 'L'],
        category: { age: 'Anak-anak', gender: 'Wanita' },
    } as const,
    {
        id: 10,
        name: 'Kostum Ninja Hitam',
        description: 'Kostum ninja serba hitam dengan sabuk dan penutup wajah.',
        price: 140000,
        imageUrl: 'https://via.placeholder.com/400x300.png/343a40/ffffff?text=Ninja',
        sizes: ['M', 'L', 'XL'],
        category: { age: 'Dewasa', gender: 'Pria' },
    } as const,
    {
        id: 11,
        name: 'Kostum Dokter Anak',
        description: 'Kostum profesi dokter untuk anak-anak lengkap dengan jas putih mini.',
        price: 130000,
        imageUrl: 'https://via.placeholder.com/400x300.png/17a2b8/ffffff?text=Dokter+Anak',
        sizes: ['S', 'M'],
        category: { age: 'Anak-anak', gender: 'Wanita' },
    } as const,
    {
        id: 12,
        name: 'Kostum Zombie Seram',
        description: 'Kostum horor dengan efek sobekan dan darah palsu, cocok untuk Halloween.',
        price: 160000,
        imageUrl: 'https://via.placeholder.com/400x300.png/6c757d/ffffff?text=Zombie',
        sizes: ['M', 'L', 'XL'],
        category: { age: 'Dewasa', gender: 'Pria' },
    } as const,
    {
        id: 13,
        name: 'Kostum Petani Tradisional',
        description: 'Kostum petani lengkap dengan caping dan sarung, cocok untuk pertunjukan budaya.',
        price: 145000,
        imageUrl: 'https://via.placeholder.com/400x300.png/198754/ffffff?text=Petani',
        sizes: ['L', 'XL', 'XXL'],
        category: { age: 'Dewasa', gender: 'Pria' },
    } as const
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
