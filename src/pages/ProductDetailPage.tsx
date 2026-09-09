import { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";

export default function ProductDetailPage() {
  const { selectedProductId, navigate, addToCart, products } = useApp();
  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate("products")} className="btn-primary px-6 py-2.5">
          Browse Products
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        <button onClick={() => navigate("home")} className="hover:underline">Home</button>
        <span>/</span>
        <button onClick={() => navigate("products")} className="hover:underline">Products</button>
        <span>/</span>
        <span className="line-clamp-1" style={{ color: "var(--text)" }}>{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Images */}
        <div className="lg:w-1/2 flex gap-4">
          <div className="hidden sm:flex flex-col gap-3 w-20">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className="w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors"
                style={{ borderColor: selectedImage === i ? "var(--primary)" : "var(--border)", background: "#F3F4F6" }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: "#F3F4F6", aspectRatio: "1/1" }}>
            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="lg:w-1/2">
          {/* Badge */}
          {product.badge && (
            <span className={`badge mb-3 inline-block ${product.badge === "Sale" ? "badge-sale" : product.badge === "New" ? "badge-new" : "badge-hot"}`}>
              {product.badge}
            </span>
          )}

          <p className="text-sm font-medium mb-1" style={{ color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>{product.category}</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug" style={{ fontFamily: "Outfit, sans-serif" }}>{product.name}</h1>

          <div className="flex items-center gap-3 mb-5">
            <StarRating rating={product.rating} size={16} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--text)" }}>
              ₹{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>₹{product.originalPrice.toFixed(2)}</span>
                <span className="badge badge-sale">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{product.description}</p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Color</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="w-8 h-8 rounded-full border-2 transition-all"
                    style={{
                      background: color,
                      borderColor: selectedColor === color ? "var(--primary)" : "transparent",
                      boxShadow: selectedColor === color ? "0 0 0 2px white, 0 0 0 4px var(--primary)" : "0 0 0 1.5px rgba(0,0,0,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Size</p>
                <button className="text-xs" style={{ color: "var(--primary)" }}>Size guide</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all"
                    style={{
                      borderColor: selectedSize === size ? "var(--primary)" : "var(--border)",
                      background: selectedSize === size ? "var(--primary-light)" : "white",
                      color: selectedSize === size ? "var(--primary)" : "var(--text)",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Quantity</p>
            <div className="flex items-center gap-0 border rounded-lg w-fit overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg transition-colors hover:bg-gray-50"
                style={{ color: "var(--text)" }}
              >
                −
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x" style={{ borderColor: "var(--border)", fontFamily: "Outfit, sans-serif" }}>
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-lg transition-colors hover:bg-gray-50"
                style={{ color: "var(--text)" }}
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 py-3.5 text-base"
            >
              {added ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => { addToCart(product, qty, selectedColor, selectedSize); navigate("checkout"); }}
              className="btn-secondary flex-1 py-3.5 text-base"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery info */}
          <div className="card p-4 flex flex-col gap-3">
            {[
              { icon: "🚚", text: `Free delivery in ${product.deliveryDays}–${product.deliveryDays + 2} business days` },
              { icon: "↩️", text: "30-day free returns" },
              { icon: "✅", text: "100% authentic products" },
              { icon: "🔒", text: "Secure checkout" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Outfit, sans-serif" }}>Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
