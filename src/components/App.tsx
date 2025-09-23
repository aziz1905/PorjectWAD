
import CompNavbar from "./Comp_Navbar";
import CompFooter from "./Comp_Footer";
import ProductGrid from "./Product_Grid";
import HeroProduct from "./Hero_Beranda";
import Reviews from "./Review";



function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="kostumkita-top">
        <CompNavbar />
      </header>
      
      <main className="kostumkita-main">
        <div className="relative bg-cover bg-center bg-no-repeat"></div>
        <HeroProduct />
        <ProductGrid />
        <Reviews />
      </main>
      <CompFooter/>
    </div>
  );
}



export default App

// rfc