import ProductCard from "./Comp_Product_Card";
import Products from "../data/Produk";


export default function ProductGrid() {
  return (
    <div className="product-grid">
      {Products.map((product: any) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.imageUrl}
          sizes={product.sizes}
          specification={product.specification}
        />
      ))}
    </div>
  );
}
