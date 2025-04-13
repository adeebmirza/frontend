import React from 'react';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;