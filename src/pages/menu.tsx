import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatKES, siteConfig, type MenuCategory, type MenuItem } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';
import { DishVisual } from '@/components/dish-visual';
import { DishDetailModal } from '@/components/dish-detail-modal';
import { useCart } from '@/components/cart-provider';

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

  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Main grill');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { count, total } = useCart();

  const filteredItems = useMemo(() => {
    return siteConfig.menu.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      // If user typed a search query, show all matching categories; otherwise filter by activeCategory
      if (searchQuery.trim().length > 0) {
        return matchesSearch;
      }
      return item.category === activeCategory;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-[74px]">
      {/* Menu Header Hero */}
      <section className="border-b border-[#C9A24B]/20 bg-[#120B08] py-14 sm:py-20">
        <div className="container-hacienda">
          <SectionLabel number="Menu">The Kitchen & The Bar</SectionLabel>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[#F3E9D2]">
                Our Daily Cuts & Pours
              </h1>
              <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
                Every plate is roasted fresh over charcoal or shaken to order at the bar.
                Tap any dish to select your cooking style, add hot accompaniments, and send
                directly to your table.
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full sm:w-80">
              <div className="flex h-12 items-center border border-[#C9A24B]/30 bg-[#0D0B09]/80 px-4 focus-within:border-[#C9A24B]">
                <Search size={16} className="text-[#C9A24B] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cuts, wings, cocktails..."
                  aria-label="Search menu items"
                  className="w-full bg-transparent px-3 text-xs text-[#F3E9D2] outline-none placeholder:text-[#F3E9D2]/35"
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
        </div>
      </section>

      {/* Sticky Category Tabs */}
      <div className="sticky top-[74px] z-30 border-b border-[#C9A24B]/20 bg-[#0D0B09]/95 backdrop-blur-md">
        <div className="container-hacienda overflow-x-auto py-3">
          <div className="flex min-w-max items-center gap-2">
            <SlidersHorizontal size={13} className="mr-2 text-[#C9A24B]/70" />
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
                  className={`min-h-[38px] px-4 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                    isSelected
                      ? 'border border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09] font-bold'
                      : 'border border-[#C9A24B]/20 bg-transparent text-[#F3E9D2]/60 hover:border-[#C9A24B]/50 hover:text-[#C9A24B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dishes Gallery */}
      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda">
          {searchQuery && (
            <div className="mb-8 flex items-center justify-between border-b border-[#C9A24B]/20 pb-4">
              <span className="text-xs text-[#F3E9D2]/70">
                Search results for: <strong className="text-[#C9A24B]">"{searchQuery}"</strong>
              </span>
              <span className="font-mono text-xs text-[#C9A24B]">
                {filteredItems.length} items found
              </span>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="border border-dashed border-[#C9A24B]/30 p-16 text-center">
              <p className="font-cormorant text-2xl italic text-[#F3E9D2]/70">
                No plates match your search criteria.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="button-gold mt-5 text-[10px]"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between border-b border-[#C9A24B]/20 pb-6 text-left"
                >
                  <div>
                    {/* Floating Plate / Glass */}
                    <div
                      onClick={() => setSelectedItem(item)}
                      className="cursor-pointer"
                    >
                      <DishVisual
                        src={item.image}
                        alt={`${item.name} illustrative food presentation`}
                        label={item.name}
                        size="medium"
                      />
                    </div>

                    {/* Header: Title and Price */}
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="text-left font-playfair text-xl sm:text-2xl text-[#F3E9D2] transition group-hover:text-[#C9A24B]"
                      >
                        {item.name}
                      </button>
                      <span className="shrink-0 pt-1 font-mono text-xs font-semibold text-[#C9A24B]">
                        {item.price ? formatKES(item.price) : item.priceLabel}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-2 text-xs leading-relaxed text-[#F3E9D2]/60 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-[#C9A24B]/15 bg-[#17100B] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#C9A24B]/75"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order / Inquire Button */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#C9A24B]/15 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C9A24B] transition hover:text-[#DFBA67]"
                    >
                      <span>{item.price ? 'Customize & Order' : 'Ask Staff'}</span>
                      <ArrowRight size={13} />
                    </button>

                    {item.cookingStyles && (
                      <span className="text-[10px] text-[#F3E9D2]/40">
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

      {/* Floating Bottom Cart Bar if items in cart */}
      {count > 0 && (
        <div className="fixed bottom-6 inset-x-4 z-40 mx-auto max-w-lg">
          <Link
            to="/order"
            className="flex items-center justify-between border border-[#C9A24B] bg-[#160E0A] px-5 py-3.5 shadow-2xl backdrop-blur-md transition hover:border-[#DFBA67] hover:bg-[#24160F]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A24B] text-[#0D0B09] font-bold text-xs">
                {count}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#F3E9D2]">
                  Your Order Cart
                </p>
                <p className="text-[10px] text-[#F3E9D2]/50">
                  Ready to review or send to kitchen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#C9A24B]">
                {formatKES(total)}
              </span>
              <span className="button-gold min-h-[36px] px-3.5 text-[10px]">
                Review <ArrowRight size={12} className="ml-1" />
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Dish Detail & Customization Modal */}
      <DishDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
