import { useApp } from "../context/AppContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, navigate } = useApp();

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const delivery = subtotal > 499 ? 0 : (subtotal > 0 ? 49 : 0);
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>Your cart is empty</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Looks like you haven't added anything yet. Browse our products to find something you'll love!
        </p>
        <button onClick={() => navigate("products")} className="btn-primary px-8 py-3 text-base">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: "Outfit, sans-serif" }}>
        Shopping Cart
        <span className="ml-2 text-lg font-normal" style={{ color: "var(--text-muted)" }}>({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cart.map((item) => {
            const discount = item.product.originalPrice
              ? Math.round((1 - item.product.price / item.product.originalPrice) * 100)
              : null;
            return (
              <div key={item.product.id} className="card p-4 flex gap-4">
                <button
                  onClick={() => navigate("product-detail", item.product.id)}
                  className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: "#F3F4F6" }}
                >
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium" style={{ color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>{item.product.category}</p>
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2 mt-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {item.product.name}
                      </h3>
                      {item.selectedColor && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-3 h-3 rounded-full border" style={{ background: item.selectedColor, borderColor: "rgba(0,0,0,0.1)" }} />
                          {item.selectedSize && <span className="text-xs" style={{ color: "var(--text-muted)" }}>Size: {item.selectedSize}</span>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-0 border rounded-lg overflow-hidden" style={{ borderColor: "var(--border)" }}>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-base hover:bg-gray-50"
                        style={{ color: "var(--text)" }}
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x" style={{ borderColor: "var(--border)", fontFamily: "Outfit, sans-serif" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-base hover:bg-gray-50"
                        style={{ color: "var(--text)" }}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-base" style={{ fontFamily: "Outfit, sans-serif" }}>
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {discount && (
                        <p className="text-xs" style={{ color: "var(--success)" }}>
                          Save {discount}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-5" style={{ fontFamily: "Outfit, sans-serif" }}>Order Summary</h2>

            <div className="flex flex-col gap-3 mb-5">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Delivery</span>
                <span className="font-medium" style={{ color: delivery === 0 ? "var(--success)" : undefined }}>
                  {delivery === 0 ? "Free 🎉" : `₹${delivery.toFixed(2)}`}
                </span>
              </div>
              {delivery > 0 && (
                <p className="text-xs p-2.5 rounded-lg" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                  Add ₹{(499 - subtotal > 0 ? (499 - subtotal).toFixed(2) : "0")} more to get free delivery!
                </p>
              )}
              <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-5">
              <input type="text" placeholder="Coupon code" className="input-field flex-1 text-sm" />
              <button className="btn-secondary px-4 py-2 text-sm flex-shrink-0">Apply</button>
            </div>

            <button
              onClick={() => navigate("checkout")}
              className="btn-primary w-full py-3.5 text-base"
            >
              Proceed to Checkout →
            </button>
            <button
              onClick={() => navigate("products")}
              className="w-full py-3 text-sm text-center mt-3 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              ← Continue Shopping
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              {["🔒 Secure", "↩️ Returns", "🚚 Fast"].map((b) => (
                <span key={b} className="text-xs" style={{ color: "var(--text-muted)" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
