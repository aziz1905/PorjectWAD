export default function ProductButton({ logoChild, fontChild }) {
  return (
    <button className="product-button">
      {/* Gunakan nama props yang sudah benar */}
      {logoChild}
      {fontChild}
    </button>
    );
}