import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

type PayMethod = "card" | "upi" | "cod";

export default function CheckoutPage() {
  const { cart, navigate, placeOrder, user, profile } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upi: "",
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user || profile) {
      const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "";
      const parts = fullName.split(" ");
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ") || "";

      setForm((prev) => ({
        ...prev,
        firstName: prev.firstName || first,
        lastName: prev.lastName || last,
        email: prev.email || user?.email || profile?.email || "",
        phone: prev.phone || profile?.phone || "",
        address: prev.address || profile?.address || "",
        city: prev.city || profile?.city || "",
        state: prev.state || profile?.state || "",
        zip: prev.zip || profile?.zip || "",
      }));
    }
  }, [user, profile]);

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;

  const update = (f: string, v: string) => {
    setForm((prev) => ({ ...prev, [f]: v }));
    setErrors((e) => {
      const ne = { ...e };
      delete ne[f];
      return ne;
    });
    setOrderError("");
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (payMethod === "card") {
      if (!form.cardName.trim()) e.cardName = "Required";
      if (!form.cardNumber.trim()) e.cardNumber = "Required";
      else if (form.cardNumber.replace(/\s/g, "").length < 13) e.cardNumber = "Invalid card number";
      if (!form.expiry.trim()) e.expiry = "Required";
      if (!form.cvv.trim()) e.cvv = "Required";
    } else if (payMethod === "upi") {
      if (!form.upi.trim()) e.upi = "Required";
    }
    return e;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    const errs = validateStep2();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setOrderError("");

    try {
      await placeOrder({
        customer_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim() || "CA",
        zip: form.zip.trim(),
        country: form.country || "US",
        payment_method: payMethod,
      });

      navigate("order-success");
    } catch (err: any) {
      console.error("Order placement error:", err);
      setOrderError(err.message || "Failed to place order. Please check your connection and try again.");
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg mb-4" style={{ color: "var(--text-muted)" }}>Your cart is empty.</p>
        <button onClick={() => navigate("products")} className="btn-primary px-6 py-3 cursor-pointer">
          Browse Products
        </button>
      </div>
    );
  }

  const Field = ({
    name,
    label,
    placeholder,
    type = "text",
    half = false,
  }: {
    name: keyof typeof form;
    label: string;
    placeholder: string;
    type?: string;
    half?: boolean;
  }) => (
    <div className={half ? "flex-1 min-w-0" : "w-full"}>
      <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => update(name, e.target.value)}
        className={`input-field text-sm ${errors[name] ? "error" : ""}`}
      />
      {errors[name] && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: step >= s ? "var(--primary)" : "var(--border)",
                  color: step >= s ? "white" : "var(--text-muted)",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {step > s ? "✓" : s}
              </div>
              <span
                className="text-sm font-medium hidden sm:block"
                style={{ fontFamily: "Outfit, sans-serif", color: step >= s ? "var(--text)" : "var(--text-muted)" }}
              >
                {s === 1 ? "Delivery" : "Payment"}
              </span>
            </div>
            {s === 1 && <div className="w-12 sm:w-20 h-0.5" style={{ background: step > 1 ? "var(--primary)" : "var(--border)" }} />}
          </div>
        ))}
      </div>

      {orderError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <span className="flex-1">{orderError}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main form */}
        <div className="flex-1">
          {step === 1 ? (
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Delivery Address</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Where should we deliver your order?</p>
                </div>
                {!user && (
                  <button
                    onClick={() => navigate("login")}
                    className="text-xs font-semibold hover:underline cursor-pointer"
                    style={{ color: "var(--primary)" }}
                  >
                    Have an account? Sign In
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Field name="firstName" label="First Name" placeholder="Alex" half />
                  <Field name="lastName" label="Last Name" placeholder="Johnson" half />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Field name="email" label="Email Address" placeholder="you@example.com" type="email" half />
                  <Field name="phone" label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" half />
                </div>
                <Field name="address" label="Street Address" placeholder="123 College Ave, Apt 4B" />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Field name="city" label="City" placeholder="Berkeley" half />
                  <Field name="state" label="State / Province" placeholder="CA" half />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Field name="zip" label="ZIP / Postal Code" placeholder="94720" half />
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Country</label>
                    <select
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className="input-field text-sm"
                    >
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="btn-primary w-full py-3.5 text-base mt-8 cursor-pointer"
              >
                Proceed to Payment →
              </button>
            </div>
          ) : (
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div>
                  <h2 className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>Payment Method</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Select how you want to pay</p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs hover:underline cursor-pointer"
                  style={{ color: "var(--primary)" }}
                >
                  ← Edit Address
                </button>
              </div>

              {/* Delivery info snippet */}
              <div className="p-3.5 rounded-xl mb-6 flex items-start gap-3 text-xs" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <span>📍</span>
                <div className="flex-1 text-gray-700">
                  <p className="font-semibold text-gray-900">{form.firstName} {form.lastName} • {form.phone}</p>
                  <p>{form.address}, {form.city}, {form.state} {form.zip}</p>
                </div>
              </div>

              {/* Payment selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: "card" as PayMethod, label: "Credit Card", icon: "💳" },
                  { id: "upi" as PayMethod, label: "UPI / QR", icon: "📱" },
                  { id: "cod" as PayMethod, label: "Cash on Delivery", icon: "💵" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className="p-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5"
                    style={{
                      borderColor: payMethod === m.id ? "var(--primary)" : "var(--border)",
                      background: payMethod === m.id ? "var(--primary-light)" : "white",
                    }}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-xs font-semibold" style={{ fontFamily: "Outfit, sans-serif", color: payMethod === m.id ? "var(--primary)" : "var(--text)" }}>
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Card inputs */}
              {payMethod === "card" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      value={form.cardName}
                      onChange={(e) => update("cardName", e.target.value)}
                      className={`input-field text-sm ${errors.cardName ? "error" : ""}`}
                    />
                    {errors.cardName && <p className="text-xs mt-1 text-red-500">{errors.cardName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      maxLength={19}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        update("cardNumber", v);
                      }}
                      className={`input-field text-sm font-mono ${errors.cardNumber ? "error" : ""}`}
                    />
                    {errors.cardNumber && <p className="text-xs mt-1 text-red-500">{errors.cardNumber}</p>}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={form.expiry}
                        onChange={(e) => update("expiry", e.target.value)}
                        className={`input-field text-sm ${errors.expiry ? "error" : ""}`}
                      />
                      {errors.expiry && <p className="text-xs mt-1 text-red-500">{errors.expiry}</p>}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={form.cvv}
                        onChange={(e) => update("cvv", e.target.value)}
                        className={`input-field text-sm ${errors.cvv ? "error" : ""}`}
                      />
                      {errors.cvv && <p className="text-xs mt-1 text-red-500">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              {payMethod === "upi" && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={form.upi}
                    onChange={(e) => update("upi", e.target.value)}
                    className={`input-field text-sm ${errors.upi ? "error" : ""}`}
                  />
                  {errors.upi && <p className="text-xs mt-1 text-red-500">{errors.upi}</p>}
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Enter your UPI ID (e.g., mobile@upi, username@okaxis)</p>
                </div>
              )}

              {payMethod === "cod" && (
                <div className="p-4 rounded-xl" style={{ background: "var(--surface)" }}>
                  <p className="text-sm font-medium mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Cash on Delivery</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Pay with cash or UPI when your order is delivered. Verified via Supabase.</p>
                </div>
              )}

              <div className="mt-6 p-3 rounded-xl flex items-center gap-2 text-xs" style={{ background: "var(--surface)" }}>
                <span>🔒</span>
                <span style={{ color: "var(--text-muted)" }}>Your payment and order details are securely transmitted to Supabase.</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base mt-6 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order in Supabase...
                  </>
                ) : (
                  `Place Order • ₹${total.toFixed(2)}`
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <h3 className="text-base font-bold mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Order Summary</h3>
            <div className="flex flex-col gap-3 mb-4 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "#F3F4F6" }}>
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1" style={{ fontFamily: "Outfit, sans-serif" }}>{item.product.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex flex-col gap-2" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-muted)" }}>Delivery</span>
                <span style={{ color: delivery === 0 ? "var(--success)" : undefined }}>
                  {delivery === 0 ? "Free" : `₹${delivery.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t mt-1" style={{ borderColor: "var(--border)" }}>
                <span>Total</span>
                <span style={{ fontFamily: "Outfit, sans-serif" }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
