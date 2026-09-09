import { useState } from "react";
import { useApp } from "../context/AppContext";
import { categories, testimonials } from "../data/products";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";

export default function HomePage() {
  const { navigate, setSearchQuery, products } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = products.slice(0, 4);
  const bestSellers = products.filter((p) => p.rating >= 4.5).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #312E81 0%, #4F46E5 50%, #7C3AED 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full" style={{ background: "white", filter: "blur(80px)" }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full" style={{ background: "#F97316", filter: "blur(100px)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "rgba(255,255,255,0.15)", color: "white", fontFamily: "Outfit, sans-serif" }}>
              🎓 Student-Friendly Prices • Free Delivery Over ₹499
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Everything you need,<br />
              <span style={{ color: "#FCD34D" }}>all in one place.</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.8)", maxWidth: "440px", margin: "0 auto 2rem" }}>
              MyShop brings the best deals on electronics, fashion, books and more — curated for college students and young adults.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navigate("products")}
                className="px-8 py-3.5 rounded-lg font-semibold text-base transition-all"
                style={{ background: "white", color: "var(--primary)", fontFamily: "Outfit, sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
              >
                Shop Now →
              </button>
              <button
                onClick={() => navigate("products")}
                className="px-8 py-3.5 rounded-lg font-semibold text-base transition-all"
                style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", fontFamily: "Outfit, sans-serif" }}
              >
                View Deals
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
              {[["10K+", "Happy Students"], ["500+", "Products"], ["4.8★", "Avg Rating"]].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{num}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&h=500&fit=crop&auto=format" alt="MyShop products" className="w-full h-full object-cover" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-6 card px-4 py-3 flex items-center gap-3" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
                <div className="w-10 h-10 rounded-full overflow-hidden"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" alt="" className="w-full h-full object-cover" /></div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text)", fontFamily: "Outfit, sans-serif" }}>Just ordered!</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Wireless Headphones</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 card px-3 py-2" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
                <p className="text-sm font-bold" style={{ color: "var(--success)", fontFamily: "Outfit, sans-serif" }}>🚀 Fast Delivery</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>2–5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ background: "var(--primary-light)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "On orders over ₹499" },
              { icon: "🔒", title: "Secure Payment", desc: "100% protected" },
              { icon: "↩️", title: "Easy Returns", desc: "30-day policy" },
              { icon: "🎓", title: "Student Deals", desc: "Exclusive discounts" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "Outfit, sans-serif" }}>{item.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--primary)" }}>Browse by</p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Popular Categories</h2>
          </div>
          <button onClick={() => navigate("products")} className="text-sm font-medium hidden sm:block" style={{ color: "var(--primary)" }}>
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { navigate("products"); }}
              className="card group overflow-hidden text-center p-0 hover:-translate-y-1"
              style={{ transition: "all 0.2s ease" }}
            >
              <div className="relative h-24 overflow-hidden" style={{ background: "#F3F4F6" }}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover product-card-img" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }} />
              </div>
              <div className="p-3">
                <div className="text-xl mb-1">{cat.icon}</div>
                <p className="text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{cat.name}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--primary)" }}>Hand-picked</p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Featured Products</h2>
            </div>
            <button onClick={() => navigate("products")} className="text-sm font-medium hidden sm:block" style={{ color: "var(--primary)" }}>
              See all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)", minHeight: "220px" }}>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden sm:block">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&auto=format" alt="Special offer" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #1A1A2E, transparent)" }} />
          </div>
          <div className="relative p-8 sm:p-12 max-w-md">
            <span className="badge badge-sale mb-4 inline-block">⚡ Limited Time</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
              Up to 40% off<br />Electronics
            </h2>
            <p className="mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
              Save big on headphones, keyboards, speakers, and more. Student ID gets you an extra 5% off.
            </p>
            <button
              onClick={() => navigate("products")}
              className="px-6 py-3 rounded-lg font-semibold text-sm"
              style={{ background: "var(--accent)", color: "white", fontFamily: "Outfit, sans-serif" }}
            >
              Grab the Deal →
            </button>
          </div>
          {/* Countdown */}
          <div className="absolute bottom-6 right-8 hidden lg:flex gap-3">
            {[["08", "Hours"], ["42", "Mins"], ["17", "Secs"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{ background: "rgba(255,255,255,0.1)", fontFamily: "Outfit, sans-serif" }}>{num}</div>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section style={{ background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>🔥 Trending</p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Best Sellers</h2>
            </div>
            <button onClick={() => navigate("products")} className="text-sm font-medium hidden sm:block" style={{ color: "var(--primary)" }}>
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--primary)" }}>Social proof</p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>What students say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Bought: {t.product}</p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={t.rating} size={13} />
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: "var(--primary-light)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-xl mx-auto px-4 py-14 text-center">
          <span className="text-3xl mb-4 block">📬</span>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Get deals in your inbox</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Join 8,000+ students who get weekly deals, new arrivals, and exclusive offers.
          </p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: "var(--success)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              You're subscribed! Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary px-5 py-2.5 text-sm flex-shrink-0">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
