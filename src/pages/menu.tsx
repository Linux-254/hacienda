import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Utensils, ShoppingBag, Truck } from 'lucide-react';
import { formatKES, siteConfig, type MenuCategory, type MenuItem } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';
import { DishVisual } from '@/components/dish-visual';
import { DishDetailModal } from '@/components/dish-detail-modal';
import { useCart } from '@/components/cart-provider';
import type { OrderMode } from '@/lib/types';

const categories: MenuCategory[] = [
  'Main grill',
  'Bites',
  'Breakfast',
  'Soups & hot drinks',
  'Cocktails',
  'Mocktails',
];

export function MenuPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const tableParam = searchParams.get('table');
  const modeParam = searchParams.get('mode') as OrderMode | null;

  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Main grill');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { count, total, diningMode, setDiningMode, table, setTable } = useCart();

  // Sync table & dining mode from QR code or direct link
  useEffect(() => {
    if (tableParam) {
      setTable(tableParam);
      setDiningMode('table');
    } else if (modeParam && ['table', 'pickup', 'delivery'].includes(modeParam)) {
      setDiningMode(modeParam);
    }
  }, [tableParam, modeParam, setTable, setDiningMode]);

  const filteredItems = useMemo(() => {
    return siteConfig.menu.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (searchQuery.trim().length > 0) {
        return matchesSearch;
      }
      return item.category === activeCategory;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-[74px]">
      {/* Menu Header */}
      <section className="border-b border-[#C9A24B]/20 bg-[#120B08] py-10 sm:py-16">
        <div className="container-hacienda">
          <SectionLabel number="Menu">The Kitchen & The Bar</SectionLabel>
          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
                Our Daily Cuts & Pours
              </h1>
              <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
                Every plate is roasted fresh over charcoal or shaken to order. Tap any plate to
                customize cooking style, accompaniments, and add to your table order.
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full sm:w-72">
              <div className="flex h-11 items-center border border-[#C9A24B]/30 bg-[#0D0B09]/80 px-3 focus-within:border-[#C9A24B]">
                <Search size={15} className="text-[#C9A24B] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cuts, wings, drinks..."
                  aria-label="Search menu items"
                  className="w-full bg-transparent px-2.5 text-xs text-[#F3E9D2] outline-none placeholder:text-[#F3E9D2]/35"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] uppercase text-[#C9A24B] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dining Preference Mode Switcher Banner */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded border border-[#C9A24B]/25 bg-[#1A110D]/80 p-3 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                Dining Preference:
              </span>
              {diningMode === 'table' && table && (
                <span className="font-mono text-[10px] text-[#F3E9D2]/80">
                  (Station: Table {table})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'table', label: 'Dine-In', icon: Utensils },
                { id: 'pickup', label: 'Takeaway', icon: ShoppingBag },
                { id: 'delivery', label: 'Delivery', icon: Truck },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = diningMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDiningMode(m.id as OrderMode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                      isSelected
                        ? 'bg-[#C9A24B] text-[#0D0B09]'
                        : 'border border-[#C9A24B]/20 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Category Navigation */}
      <div className="sticky top-[74px] z-30 border-b border-[#C9A24B]/20 bg-[#0D0B09]/95 backdrop-blur-md">
        <div className="container-hacienda overflow-x-auto py-2.5">
          <div className="flex min-w-max items-center gap-2">
            <SlidersHorizontal size={13} className="mr-1.5 text-[#C9A24B]/70" />
            {categories.map((cat) => {
              const isSelected = activeCategory === cat && !searchQuery;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery('');
                  }}
                  className={`min-h-[36px] px-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                    isSelected
                      ? 'border border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09] font-bold'
                      : 'border border-[#C9A24B]/20 bg-transparent text-[#F3E9D2]/65 hover:border-[#C9A24B]/50 hover:text-[#C9A24B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dishes Section — Responsive 2-Columns on Mobile (<768px) with Signature Floating Effect */}
      <section className="section-pad bg-[#0E0B09] py-10 sm:py-16">
        <div className="container-hacienda">
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between border-b border-[#C9A24B]/20 pb-3">
              <span className="text-xs text-[#F3E9D2]/70">
                Search results for: <strong className="text-[#C9A24B]">"{searchQuery}"</strong>
              </span>
              <span className="font-mono text-xs text-[#C9A24B]">
                {filteredItems.length} items
              </span>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="border border-dashed border-[#C9A24B]/30 p-12 text-center">
              <p className="font-cormorant text-xl italic text-[#F3E9D2]/70">
                No plates match your search in this section.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="button-gold mt-4 text-[10px]"
              >
                Reset Search
              </button>
            </div>
          ) : (
            /* 2-Column Responsive CSS Grid (screens under 768px) with Signature Floating Dish Presentation */
            <div className="menu-dish-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`group relative flex flex-col justify-between text-left cursor-pointer border-b border-[#C9A24B]/15 pb-4 transition-transform duration-300 ${
                    index % 2 === 1 ? 'md:translate-y-5' : ''
                  }`}
                >
                  <div>
                    {/* Floating Dish Visual Stage (Unboxed transparent cutout with soft ground shadow) */}
                    <div className="relative mb-2.5">
                      <DishVisual
                        src={item.image}
                        alt={`${item.name} plated at Hacienda`}
                        label={item.name}
                        size="responsive"
                      />
                    </div>

                    {/* Dish Title & Price */}
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="font-playfair text-xs xs:text-sm sm:text-lg font-medium text-[#F3E9D2] line-clamp-1 group-hover:text-[#C9A24B] transition-colors">
                        {item.name}
                      </h3>
                      <span className="shrink-0 font-mono text-[11px] xs:text-xs sm:text-sm font-bold text-[#C9A24B]">
                        {item.price ? formatKES(item.price) : item.priceLabel}
                      </span>
                    </div>

                    {/* Concise Narrative Description */}
                    <p className="mt-1 text-[10px] xs:text-[11px] sm:text-xs leading-relaxed text-[#F3E9D2]/60 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Tags (Desktop only to prevent clutter) */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-2 hidden sm:flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="border border-[#C9A24B]/15 bg-[#17100B] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#C9A24B]/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clean Editorial Action Trigger */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#C9A24B]/10 pt-2">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#C9A24B]/80 group-hover:text-[#C9A24B] transition-colors">
                      {item.price ? 'Order this ↗' : 'Ask staff ↗'}
                    </span>
                    {item.cookingStyles && (
                      <span className="hidden sm:inline text-[9px] text-[#F3E9D2]/40">
                        {item.cookingStyles.length} styles
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Bottom Cart Bar */}
      {count > 0 && (
        <div className="fixed bottom-4 inset-x-3 z-40 mx-auto max-w-md">
          <Link
            to="/order"
            className="flex items-center justify-between border border-[#C9A24B] bg-[#160E0A] px-4 py-3 shadow-2xl backdrop-blur-md transition hover:bg-[#20140D]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9A24B] text-[#0D0B09] font-bold text-xs">
                {count}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F3E9D2]">
                  Your Order Cart
                </p>
                <p className="text-[9px] uppercase tracking-wider text-[#C9A24B]">
                  {diningMode === 'table' ? `Table ${table || 'Dine-In'}` : diningMode === 'pickup' ? 'Takeaway' : 'Delivery'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#C9A24B]">
                {formatKES(total)}
              </span>
              <span className="button-gold min-h-[32px] px-3 text-[10px]">
                Review <ArrowRight size={11} className="ml-1" />
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Customization Modal with Sticky Footer */}
      <DishDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
