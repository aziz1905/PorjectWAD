import React from 'react';

interface ButtonProps {
  buttonType: 'sewaSekarang' | 'p_masuk' | 'p_pesanSekarang' | string;
  logoChild?: React.ReactNode;
  fontChild: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ProductButton({ buttonType, logoChild, fontChild, onClick }: ButtonProps) {
  
  const getButtonClass = () => {
    let specificClass = '';
    if (buttonType === "masukanKeranjang") {
      specificClass = "py-3 px-10 items-start mr-30";
    } else if (buttonType === "p_masuk") {
      specificClass = "px-20 py-3";
    } else if (buttonType === "p_pesanSekarang") {
      specificClass = "px-20 py-3";
    }
    return `product-button ${specificClass}`;
  };

  return (
    <button className={getButtonClass()} onClick={onClick}>
      {logoChild}
      <span>{fontChild}</span>
    </button>
  );
}