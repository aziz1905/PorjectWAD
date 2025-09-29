import React, { useState, useEffect } from 'react'; 
import { Icon } from '@iconify/react';

interface Category { // Definisikan interface
  name: string;
  icon: string;
}


const CompKategori = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Panggil API Kategori Anda
        const response = await fetch('http://localhost:5000/categories');
        if (!response.ok) {
          throw new Error('Gagal memuat kategori dari server.');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Memuat Kategori...</div>;
  }

  return (
    <section className="kategori-section">
      <div className="kategori-container">
        <h2 className="kategori-title">Jelajahi Kategori Pilihan</h2>
        <div className="kategori-grid">
          {categories.map((category) => (
            <div key={category.name} className="kategori-item group">
              <div className="kategori-icon-wrapper">
                <Icon icon={category.icon} className="kategori-icon" /> 
              </div>
              <p className="kategori-name">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompKategori;