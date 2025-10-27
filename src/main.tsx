import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; 
import './index.css';
import { AuthProvider } from './components/AuthContext.tsx';
import { SearchProvider } from './components/Comp_Search.tsx';
import { CategoryProvider } from './components/Comp_Kategori.tsx';
import { BrowserRouter } from 'react-router-dom'; // <-- Pastikan ini ada

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider>
        <SearchProvider>
          <CategoryProvider>
            <App />
          </CategoryProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);