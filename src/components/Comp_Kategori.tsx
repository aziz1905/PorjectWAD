import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api'; 


interface Category {
  id: number; // Pastikan API mengirim ID
  name: string;
}

// Tipe untuk value context
interface CategoryContextType {
  selectedCategoryId: number | null; // ID kategori yang dipilih
  setSelectedCategoryId: (id: number | null) => void; // Fungsi untuk mengubah ID
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory harus digunakan di dalam CategoryProvider');
  }
  return context;
};

// Buat Provider untuk membungkus bagian aplikasi yang relevan (atau seluruh App)
interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const value = { selectedCategoryId, setSelectedCategoryId };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};


// --- BAGIAN 2: KOMPONEN TOMBOL KATEGORI (TAMPILAN) ---

const CompKategori = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategoryId, setSelectedCategoryId } = useCategory();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Pastikan endpoint '/categories' mengembalikan { id, name }
        const response = await api.get<Category[]>('/categories'); 
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    const newSelectedId = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newSelectedId); 
  };

  if (loading) {
    return <div className="text-center py-12">Memuat Kategori...</div>;
  }

  return (
    <section className="kategori-section my-12">
      <div className="kategori-container max-w-screen-xl mx-auto px-4">
        <h2 className="kategori-title text-2xl font-bold text-center mb-8 text-gray-800">
          Jelajahi Kategori Pilihan
        </h2>
        <div className="kategori-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`kategori-item group p-4 border rounded-lg flex flex-col items-center justify-center text-center transition duration-200 cursor-pointer ${
                // Styling aktif berdasarkan selectedCategoryId dari context
                selectedCategoryId === category.id
                ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:shadow-sm hover:border-blue-300'
              }`}
              // Panggil handler dengan ID saat diklik
              onClick={() => handleCategoryClick(category.id)}
            >
              <p className="kategori-name text-sm font-medium">{category.name}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompKategori;