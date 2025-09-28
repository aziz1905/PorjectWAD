import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import ProductButton from "./Comp_Button";

type ProductProps = {
  id:number|string;
  imageUrl: string;
  name: string;
  price: number;
  description: string;
  sizes?: readonly string[] | "Stok Habis";
  category: {
    age: "Dewasa" | "Remaja" | "Anak-anak";
    gender: "Pria" | "Wanita";
  };
};

const ProductCard = ({
  id,
  name,
  description,
  price,
  imageUrl,
  sizes,
  category,
}: ProductProps) => {
  return (
    <Link
      to={`/detail-produk/${id}`}
      className="product-card group block rounded-lg shadow-md hover:shadow-lg transition"
    >
      {/* Gambar Produk */}
      <img
        src={imageUrl}
        alt={name}
        className="product-image w-full h-48 object-cover rounded-t-lg"
      />

      {/* Info Produk */}
      <div className="product-info p-4">
        {/* Rating Bintang */}
        <div className="flex items-center my-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icon
              key={index}
              icon="mdi:star"
              className="text-yellow-400 mr-1"
            />
          ))}
        </div>

        <h3 className="product-name text-lg font-semibold group-hover:text-blue-600">
          {name}
        </h3>
        <p className="product-description text-sm text-gray-600 mb-2">
          {description}
        </p>

        <p className="mb-1">
          <b className="product-price text-red-500">
            Rp {price.toLocaleString("id-ID")}
          </b>
          /hari
        </p>

        <p className="text-sm text-gray-700">
          Kategori: {category.age}, {category.gender}
        </p>

        <p className="text-sm text-gray-700">
          Ukuran: {Array.isArray(sizes) ? sizes.join(", ") : sizes}
        </p>
        <div className="mt-3">
          <ProductButton
            buttonType="masukanKeranjang"
            logoChild={
              <Icon icon="mdi:cart-plus" className="text-white text-2xl" />
            }
            fontChild=""
            onClick={(e: React.MouseEvent) => {
              e.preventDefault(); 
              alert(`Menambahkan ${name} ke keranjang`);
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
