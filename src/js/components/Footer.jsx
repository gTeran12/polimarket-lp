import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="site-footer bg-dark text-white p-4 text-center">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} PoliMarket. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
