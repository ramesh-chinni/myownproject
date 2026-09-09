import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { navigate, cartCount, page, searchQuery, setSearchQuery, user, profile, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Home", page: "home" as const },
    { label: "Products", page: "products" as const },
    { label: "My Orders", page: "orders" as const },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("products");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split("@")[0] : "");
  const initial = displayName ? displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U");

  return (
    <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: "var(--border)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--primary)" }}>
              M
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>
              My<span style={{ color: "var(--primary)" }}>Shop</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigate(link.page)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                style={{
                  color: page === link.page ? "var(--primary)" : "var(--text-muted)",
                  background: page === link.page ? "var(--primary-light)" : "transparent",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search Bar – desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm border transition-all"
                style={{ borderColor: "var(--border)", outline: "none", fontFamily: "Inter, sans-serif" }}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.12)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("cart")}
              className="relative p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: page === "cart" ? "var(--primary)" : "var(--text-muted)" }}
              aria-label="Shopping Cart"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-xs font-bold text-white rounded-full flex items-center justify-center" style={{ background: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login – desktop */}
            {user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {initial}
                  </div>
                  <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate" style={{ fontFamily: "Outfit, sans-serif" }}>
                    {displayName || "Account"}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => { navigate("orders"); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span>📦</span> My Orders
                    </button>

                    <button
                      onClick={() => { navigate("cart"); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <span>🛒</span> Cart ({cartCount})
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("login")}
                className="hidden md:flex btn-primary px-4 py-2 text-sm cursor-pointer"
                style={{ background: page === "login" ? "var(--primary-dark)" : "var(--primary)" }}
              >
                Login
              </button>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm border"
                  style={{ borderColor: "var(--border)", outline: "none" }}
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { navigate(link.page); setMenuOpen(false); }}
                  className="px-3 py-2.5 rounded-lg text-left text-sm font-medium"
                  style={{ color: "var(--text)", fontFamily: "Outfit, sans-serif" }}
                >
                  {link.label}
                </button>
              ))}

              <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="px-3 py-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { navigate("login"); setMenuOpen(false); }}
                    className="btn-primary w-full py-2.5 text-sm"
                  >
                    Login
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
