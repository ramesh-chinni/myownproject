import { useApp } from "../context/AppContext";

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer style={{ background: "#111827", color: "#D1D5DB" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--primary)" }}>M</div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                My<span style={{ color: "#818CF8" }}>Shop</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
              The go-to marketplace for college students and young adults. Quality products, student-friendly prices.
            </p>
            <div className="flex gap-3 mt-5">
              {["twitter", "instagram", "facebook"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: "#1F2937" }}>
                  <span className="text-xs capitalize" style={{ color: "#9CA3AF" }}>{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem" }}>Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", page: "home" as const },
                { label: "Products", page: "products" as const },
                { label: "My Cart", page: "cart" as const },
                { label: "Login", page: "login" as const },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={() => navigate(l.page)} className="text-sm hover:text-white transition-colors" style={{ color: "#9CA3AF" }}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem" }}>Categories</h3>
            <ul className="space-y-2.5">
              {["Electronics", "Fashion", "Books", "Accessories", "Sports", "Home & Living"].map((cat) => (
                <li key={cat}>
                  <button onClick={() => navigate("products")} className="text-sm hover:text-white transition-colors" style={{ color: "#9CA3AF" }}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "0.75rem" }}>Support</h3>
            <ul className="space-y-2.5">
              {["Help Center", "Track Order", "Returns & Refunds", "Shipping Info", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-white transition-colors" style={{ color: "#9CA3AF" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "#1F2937" }}>
          <p className="text-xs" style={{ color: "#6B7280" }}>© 2026 MyShop. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "PayPal", "UPI"].map((pm) => (
              <span key={pm} className="px-2 py-1 rounded text-xs font-medium" style={{ background: "#1F2937", color: "#9CA3AF", fontFamily: "Outfit, sans-serif" }}>
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
