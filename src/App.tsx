import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from '@/components/cart-provider';
import { SiteHeader } from '@/components/site-header';
import { Footer } from '@/components/footer';
import { HomePage } from '@/pages/home';
import { MenuPage } from '@/pages/menu';
import { OrderPage } from '@/pages/order';
import { ConfirmedPage } from '@/pages/confirmed';
import { EventsPage } from '@/pages/events';
import { AboutPage } from '@/pages/about';
import { InfoPage } from '@/pages/info';
import { QRPage } from '@/pages/qr';
import { NotFoundPage } from '@/pages/not-found';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="site-grain min-h-screen bg-[#0D0B09] text-[#F3E9D2] flex flex-col justify-between selection:bg-[#C9A24B] selection:text-[#0D0B09]">
          <ScrollToTop />
          <SiteHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/confirmed" element={<ConfirmedPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="/qr" element={<QRPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
