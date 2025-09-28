import React from 'react';

// Defines the types for the component's props.
interface ButtonProps {
  buttonType: 'sewaSekarang' | 'p_masuk' | 'p_pesanSekarang' | string;
  logoChild?: React.ReactNode;
  fontChild: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ProductButton({ buttonType, logoChild, fontChild, onClick }: ButtonProps) {
  
  // This function correctly determines the CSS classes based on buttonType.
  const getButtonClass = () => {
    let specificClass = '';
    if (buttonType === "sewaSekarang") {
      specificClass = "py-3 px-10 items-start mr-35";
    } else if (buttonType === "p_masuk") {
      specificClass = "px-20 py-3";
    } else if (buttonType === "p_pesanSekarang") {
      specificClass = "p-20";
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