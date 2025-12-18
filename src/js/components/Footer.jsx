import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer bg-dark text-white p-4 text-center">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} PoliMarket. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
