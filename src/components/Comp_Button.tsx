export default function ProductButton({buttonType, logoChild, fontChild }) {
  return (
    <button className={`product-button ${buttonType ==="sewaSekarang"?"py-3 px-10 items-start mr-35":"p_masuk"?"px-20 py-3":"p_pesanSekarang"?"p-20":""}`}>
      {logoChild}
      {fontChild}
    </button>
    );
}