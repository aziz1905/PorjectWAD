// Daftar produk (contoh data, bisa diganti dengan API/DB)
const products = [
  {
    id: '1',
    name: "Gaun Pesta Merah",
    description: "Gaun merah untuk pesta pernikahan.",
    price: 250000,
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AJfQ9KTuTEHqiPlDM0nfIehhjB391QFrA2cUqIKpJpccyQ8BeEitndPfvDahdZvMP21r3-Bki8Z3IgTXgFk6D57C1VTCdP-5mAwzlV5-5Nt_pfAHpMBvmv9eCOxJuOuFV2PlZAyGwSmtqFo8LrtjZOAncsRZ0RvjTqRR3VHstOAz8MExN3eajQ=s1024",
    sizes: ["S", "M", "L"],
    category: { age: "Dewasa", gender: "Wanita" },
  },
  {
    id: '2',
    name: "Kostum Superhero",
    description: "Kostum untuk sang penyelamat bumi.",
    price: 120000,
    imageUrl:
      "https://lh3.googleusercontent.com/gg-dl/AJfQ9KR_u9m2Y-sxXE_bt8wSx9GuPH6ujYuLm2i0PVZ-kzOoRKLWjmdjmn3s5LxWXxikeQRPLFy_Lanyq3Vp5n0IKL5QMU9gE9RF1FkhHu3b9UlcciAPiUiDsmnDY2LSReeTHAeiWmw61Q4SGGRqJ8O7qHlZ2sV8AXwRibc49dsTpzRhrX0ceg=s1024",
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
      "https://lh3.googleusercontent.com/gg-dl/AJfQ9KR_u9m2Y-sxXE_bt8wSx9GuPH6ujYuLm2i0PVZ-kzOoRKLWjmdjmn3s5LxWXxikeQRPLFy_Lanyq3Vp5n0IKL5QMU9gE9RF1FkhHu3b9UlcciAPiUiDsmnDY2LSReeTHAeiWmw61Q4SGGRqJ8O7qHlZ2sV8AXwRibc49dsTpzRhrX0ceg=s1024",
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
      "https://lh3.googleusercontent.com/gg-dl/AJfQ9KQbRJRQ5_bZ80j1uXAWRUr0wcDCMeSitAp1rNOLJm2SE2x3QeM_tIWJ7IWq5PqM_IR7oaPb2ErzIMmZECS0JhXCJmLgX-hQZ4Wr0I6LKRSpbrpz8XsqfTO5MjrMiSHgvB6iei03nU-6PH7rX85cbeEkRJH9QcPqHrYkGN1qvT0RpHYdWQ=s1024",
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
      "https://lh3.googleusercontent.com/gg-dl/AJfQ9KTn0LHFoHFK4cj29l4_ADEd19wS5Y3t1ZmotOtGtuLWGjJJQKna-PHyjF31cHX0iVUO9DAvsIfD8_6vBhk2VsQvLc46_8FECD_njrPXTUnS3JWt0ELLArOoWtnUsQsbKfHp8shx81wkBfRmNE90_aVFDBUzxcjEmYV6gQzrNvhpE5qI=s1024",
    sizes: ["XS", "S", "M"],
    category: { age: "Anak-anak", gender: "Wanita" },
  },
];

export default products;
