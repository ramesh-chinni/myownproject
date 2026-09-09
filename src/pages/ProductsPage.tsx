import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "newest", label: "Newest" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Books", "Accessories", "Sports", "Home"];

export default function ProductsPage() {
  const { searchQuery, setSearchQuery, products, loadingProducts } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const maxProductPrice = useMemo(() => {
    if (!products.length) return 5000;
    return Math.ceil(Math.max(...products.map((p) => p.price), 500));
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const PER_PAGE = 8;

  const filtered = useMemo(() => {
    let list = [...products];
    if (searchQuery) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return list;
  }, [products, searchQuery, selectedCategory, priceRange, sort]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleSearch = (e: React.FormEvent) => e.preventDefault();

  const Filters = () => (
    <aside className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Search</h3>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="input-field pl-8 text-sm"
            />
          </div>
        </form>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Category</h3>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left"
              style={{
                background: selectedCategory === cat ? "var(--primary-light)" : "transparent",
                color: selectedCategory === cat ? "var(--primary)" : "var(--text)",
                fontWeight: selectedCategory === cat ? "600" : "400",
              }}
            >
              {cat}
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--border)", color: "var(--text-muted)" }}>
                {cat === "All" ? products.length : products.filter((p) => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
          Price Range
          <span className="ml-2 font-normal text-xs" style={{ color: "var(--text-muted)" }}>
            ₹{priceRange[0]} – ₹{priceRange[1]}
          </span>
        </h3>
        <input
          type="range"
          min={0}
          max={maxProductPrice}
          step={10}
          value={priceRange[1]}
          onChange={(e) => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1); }}
          className="w-full"
          style={{ accentColor: "var(--primary)" }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          <span>₹0</span><span>₹{maxProductPrice}</span>
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Min Rating</h3>
        <div className="flex gap-2">
          {[4, 3, 2].map((r) => (
            <button key={r} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-colors" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              {r}+ ⭐
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>All Products</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {filtered.length} results {searchQuery ? `for "${searchQuery}"` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden btn-secondary px-4 py-2 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="input-field w-auto text-sm"
            style={{ paddingRight: "2rem" }}
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="lg:hidden card p-5 mb-6">
          <Filters />
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <Filters />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          {loadingProducts && products.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-500">Loading products from Supabase...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>No products found</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setPriceRange([0, maxProductPrice]); }}
                className="btn-primary px-6 py-2.5 text-sm cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 rounded-lg flex items-center justify-center border text-sm transition-colors disabled:opacity-40"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                      style={{
                        background: page === p ? "var(--primary)" : "transparent",
                        color: page === p ? "white" : "var(--text)",
                        border: page === p ? "none" : "1px solid var(--border)",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-9 h-9 rounded-lg flex items-center justify-center border text-sm transition-colors disabled:opacity-40"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
