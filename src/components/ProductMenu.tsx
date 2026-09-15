import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, X, Menu } from 'lucide-react';
import { productData } from '../data/products';

export function ProductMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Desktop Mega Menu Trigger */}
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-1 text-[#0a192f] hover:text-[#1E90FF] transition-colors font-medium"
      >
        محصولات
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop Mega Menu Dropdown */}
      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute top-full right-0 mt-2 w-[800px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
        >
          <div className="flex">
            {/* Categories Sidebar */}
            <div className="w-64 bg-gray-50 border-l border-gray-200 p-4">
              <h3 className="text-sm font-bold text-[#0a192f] mb-3">دسته‌بندی محصولات</h3>
              <div className="space-y-1">
                {productData.map((category) => (
                  <button
                    key={category.slug}
                    onMouseEnter={() => setActiveCategory(category.slug)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                      activeCategory === category.slug
                        ? 'bg-[#1E90FF] text-white'
                        : 'text-[#0a192f] hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 p-6">
              {activeCategory ? (
                <div>
                  <h4 className="text-lg font-bold text-[#0a192f] mb-4">
                    {productData.find(c => c.slug === activeCategory)?.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {productData
                      .find(c => c.slug === activeCategory)
                      ?.items.map((item) => (
                        <Link
                          key={item.slug}
                          to={`/products/${activeCategory}/${item.slug}`}
                          className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-sm font-medium text-[#0a192f]">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                          )}
                        </Link>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  یک دسته‌بندی را انتخاب کنید
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-[#0a192f]"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 md:hidden overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Main Links */}
            <div className="space-y-2">
              <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-[#0a192f] font-medium">
                خانه
              </Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block py-2 text-[#0a192f] font-medium">
                درباره ما
              </Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-[#0a192f] font-medium">
                تماس با ما
              </Link>
            </div>

            {/* Products Accordion */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-bold text-[#0a192f] mb-3">محصولات</h3>
              <div className="space-y-2">
                {productData.map((category) => (
                  <div key={category.slug}>
                    <button
                      onClick={() => setExpandedCategory(
                        expandedCategory === category.slug ? null : category.slug
                      )}
                      className="w-full flex items-center justify-between py-2 text-[#0a192f]"
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedCategory === category.slug ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedCategory === category.slug && (
                      <div className="pr-6 pb-2 space-y-1">
                        {category.items.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/products/${category.slug}/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="block py-1 text-sm text-gray-600 hover:text-[#1E90FF]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
