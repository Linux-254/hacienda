import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, QrCode } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { formatKES } from '@/config/site.config';

const navLinks = [
  { href: '/menu', label: 'Menu' },
  { href: '/events', label: 'Match & Events' },
  { href: '/about', label: 'Our Story' },
  { href: '/info', label: 'Location & Info' },
  { href: '/qr', label: 'QR Tents' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { count, total, table } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#C9A24B]/20 bg-[#0D0B09]/90 backdrop-blur-md transition-all">
      <div className="container-hacienda flex h-[74px] items-center justify-between gap-6">
        {/* Brand Monogram & Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-3 text-left focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
          aria-label="Hacienda Sports Bar & Grill Home"
        >
          <div className="relative flex h-10 w-10 items-center justify-center border border-[#C9A24B] bg-[#160E0A] transition group-hover:border-[#E1BD65] group-hover:bg-[#2B1A12]">
            <span className="font-cinzel text-sm font-bold text-[#C9A24B]">H</span>
            <div className="pointer-events-none absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 bg-[#C9A24B]" />
          </div>
          <div>
            <span className="block font-cinzel text-[13px] font-bold tracking-[0.22em] text-[#F3E9D2] transition group-hover:text-[#C9A24B]">
              HACIENDA
            </span>
            <span className="block text-[8px] font-semibold uppercase tracking-[0.28em] text-[#C9A24B]/75">
              Sports Bar & Grill · Nairobi
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition duration-200 hover:text-[#C9A24B] ${
                isActive(link.href)
                  ? 'text-[#C9A24B] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#C9A24B]'
                  : 'text-[#F3E9D2]/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action: Table Tag + Cart CTA */}
        <div className="flex items-center gap-3">
          {table && (
            <div className="hidden items-center gap-1.5 border border-[#C9A24B]/30 bg-[#2B1A12]/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24B]" />
              Table {table}
            </div>
          )}

          <Link
            to="/order"
            className="button-gold relative flex min-h-[42px] items-center gap-2 px-4 text-[11px]"
            aria-label={`View order cart. ${count} items, total ${formatKES(total)}`}
          >
            <ShoppingBag size={14} className="text-[#0D0B09]" />
            <span className="hidden sm:inline">Order</span>
            {count > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0D0B09] px-1 text-[10px] font-bold text-[#C9A24B]">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#C9A24B]/30 text-[#C9A24B] transition hover:border-[#C9A24B] hover:bg-[#C9A24B]/10 lg:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#C9A24B]/20 bg-[#0D0B09] px-6 py-5 lg:hidden">
          {table && (
            <div className="mb-4 flex items-center justify-between border-b border-[#C9A24B]/20 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E9D2]/60">
                Active Dining Station:
              </span>
              <span className="font-mono text-xs font-bold text-[#C9A24B]">
                Table {table}
              </span>
            </div>
          )}
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center border-b border-[#C9A24B]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#F3E9D2]/80 hover:text-[#C9A24B]"
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-[44px] items-center border-b border-[#C9A24B]/10 text-xs font-semibold uppercase tracking-[0.2em] transition hover:text-[#C9A24B] ${
                  isActive(link.href) ? 'text-[#C9A24B]' : 'text-[#F3E9D2]/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/order"
              onClick={() => setMobileOpen(false)}
              className="button-gold mt-4 w-full"
            >
              Open Order ({count})
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
