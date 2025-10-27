import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; 
import './index.css';
import { AuthProvider } from './components/AuthContext.tsx';
import { SearchProvider } from './components/Comp_Search.tsx';
import { CategoryProvider } from './components/Comp_Kategori.tsx';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Import

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Bungkus semua provider dengan BrowserRouter */}
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