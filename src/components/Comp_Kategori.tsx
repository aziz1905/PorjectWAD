import { Icon } from '@iconify/react';

// Anda bisa mengganti data ini dengan data dari API di kemudian hari
const categories = [
  { name: 'Princess', icon: 'mdi:crown-outline' },
  { name: 'Superhero', icon: 'game-icons:bat-mask' },
  { name: 'Horor', icon: 'mdi:ghost-outline' },
  { name: 'Tradisional', icon: 'mdi:drama-masks' },
  { name: 'Profesi', icon: 'mdi:briefcase-outline' },
  { name: 'Hewan', icon: 'mdi:dog' },
  { name: 'Fantasi', icon: 'mdi:magic-staff' },
  { name: 'Anime', icon: 'mdi:pokeball' },
];

const CompKategori = () => {
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

export default CompKategori;