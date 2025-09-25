// src/components/ProductCard.tsx
import ProductButton from './Comp_Button';
import {Icon} from '@iconify/react';

type ProductProps = {
  imageUrl: string;
  name: string;
  price: number;
  description: string;
  sizes?: readonly string [] | "Stok Habis";
  category: {
    age: 'Dewasa' | 'Remaja' |'Anak-anak',
    gender: 'Pria' | 'Wanita',
  };
};

const ProductCard = ({
  name,
  description,
  price, 
  imageUrl,
  sizes,
  category
}: ProductProps) => {
  return (
    
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-info">
      <div className="flex items-center my-2">
          {Array.from({ length: 5}).map((_, index) => (
            <Icon key={index} icon="mdi:star" className="text-yellow-400 mr-1" />
          ))}
        </div>
      <h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>
      <p> <b className="product-price">Rp {price.toLocaleString('id-ID')}</b>/hari</p>
      <p> Kategori: {category.age}, {category.gender} </p>
      <p> Ukuran: {Array.isArray(sizes) ? sizes.join(', ') : sizes} </p>
        <ProductButton 
        logoChild={<Icon icon="mdi:cart-plus" className="text-white text-2xl" />}
        fontChild="Sewa Sekarang"
        />
        
      </div>
    </div>
  );
};

export default ProductCard;