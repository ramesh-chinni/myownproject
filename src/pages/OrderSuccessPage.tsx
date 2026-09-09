import { useApp } from "../context/AppContext";

export default function OrderSuccessPage() {
  const { navigate, lastOrderId, lastOrder } = useApp();
  const orderId = lastOrder?.id || lastOrderId || "ORD-" + Math.random().toString(36).slice(2, 10).toUpperCase();
  const recipientEmail = lastOrder?.email || "your email address";
  const estimatedDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "var(--surface)" }}>
      <div className="w-full max-w-lg text-center">
        {/* Success icon */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "#ECFDF5" }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Order Placed! 🎉</h1>
        <p className="text-base mb-8" style={{ color: "var(--text-muted)" }}>
          Thank you for shopping with MyShop. Your order has been recorded in Supabase and is now being processed.
        </p>

        {/* Order details card */}
        <div className="card p-6 mb-6 text-left">
          <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: "var(--text-muted)", fontFamily: "Outfit, sans-serif" }}>Order ID</p>
              <p className="text-lg font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "var(--primary)" }}>{orderId}</p>
            </div>
            <span className="badge badge-new">Confirmed</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: "📦", label: "Status", value: "Processing" },
              { icon: "💰", label: "Total Paid", value: lastOrder ? `₹${lastOrder.total.toFixed(2)} (${lastOrder.payment_method.toUpperCase()})` : "Paid" },
              { icon: "🚚", label: "Estimated Delivery", value: estimatedDate },
              { icon: "📧", label: "Confirmation sent to", value: recipientEmail },
              { icon: "📍", label: "Delivery Address", value: lastOrder ? `${lastOrder.address}, ${lastOrder.city}, ${lastOrder.state}` : "Standard Shipping Address" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{row.icon}</span>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "Outfit, sans-serif" }}>{row.label}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track order progress */}
        <div className="card p-5 mb-6">
          <p className="text-sm font-semibold mb-4 text-left" style={{ fontFamily: "Outfit, sans-serif" }}>Order Progress</p>
          <div className="flex items-center">
            {[
              { icon: "✅", label: "Confirmed" },
              { icon: "📦", label: "Packed" },
              { icon: "🚚", label: "Shipped" },
              { icon: "🏠", label: "Delivered" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: i === 0 ? "var(--success)" : i === 1 ? "var(--primary-light)" : "var(--border)",
                    }}
                  >
                    {i === 0 ? "✓" : step.icon}
                  </div>
                  <p className="text-xs mt-1 text-center" style={{ color: i === 0 ? "var(--success)" : "var(--text-muted)", fontFamily: "Outfit, sans-serif", fontSize: "0.625rem" }}>
                    {step.label}
                  </p>
                </div>
                {i < 3 && (
                  <div className="h-0.5 flex-1 -mt-4" style={{ background: i === 0 ? "var(--success)" : "var(--border)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("orders")}
            className="btn-primary flex-1 py-3.5 text-base cursor-pointer"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("products")}
            className="btn-secondary flex-1 py-3.5 text-base cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Need help? <button onClick={() => navigate("home")} className="underline cursor-pointer" style={{ color: "var(--primary)" }}>Contact support</button>
        </p>
      </div>
    </div>
  );
}
