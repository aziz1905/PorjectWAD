// Daftar produk (contoh data, bisa diganti dengan API/DB)
const products = [
  {
    id: '1',
    name: "Gaun Pesta Merah",
    description: "Gaun merah untuk pesta pernikahan.",
    price: 250000,
    imageUrl:
      "https://via.placeholder.com/400x300.png/007bff/ffffff?text=Sepatu",
    sizes: ["S", "M", "L"],
    category: { age: "Dewasa", gender: "Wanita" },
  },
  {
    id: '2',
    name: "Kostum Superhero",
    description: "Kostum untuk sang penyelamat bumi.",
    price: 120000,
    imageUrl:
      "https://via.placeholder.com/400x300.png/28a745/ffffff?text=Jam",
    sizes: ["M", "L", "XL"],
    category: { age: "Anak-anak", gender: "Pria" },
  },
  {
    id: '3',
    name: "Kostum Tradisional",
    description:
      "Kostum tradisional yang bisa digunakan untuk pesta pernikahan dan masih banyak lagi.",
    price: 150000,
    imageUrl:
      "https://via.placeholder.com/400x300.png/ffc107/000000?text=Tas",
    sizes: ["S", "L", "XL", "XXL"],
    category: { age: "Dewasa", gender: "Wanita" },
  },
  {
    id: '4',
    name: "Kostum Astronaut Anak",
    description:
      "Kostum profesi astronaut untuk anak-anak yang bercita-cita ke luar angkasa.",
    price: 135000,
    imageUrl:
      "https://via.placeholder.com/400x300.png/6f42c1/ffffff?text=Astronaut",
    sizes: ["S", "M", "L"],
    category: { age: "Anak-anak", gender: "Pria" },
  },
  {
    id: '5',
    name: "Gaun Putri Salju",
    description:
      "Gaun cantik bertema putri salju, cocok untuk pesta ulang tahun.",
    price: 180000,
    imageUrl:
      "https://via.placeholder.com/400x300.png/e83e8c/ffffff?text=Putri",
    sizes: ["XS", "S", "M"],
    category: { age: "Anak-anak", gender: "Wanita" },
  },
];

export default products;
