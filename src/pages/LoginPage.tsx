import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const { navigate, login } = useApp();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("home");
    } catch (err: any) {
      console.error("Login failed:", err);
      setServerError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, val: string | boolean) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => {
      const ne = { ...e };
      delete ne[field];
      return ne;
    });
    setServerError("");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--surface)" }}>
      {/* Left panel – desktop only */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(135deg, #312E81 0%, #4F46E5 100%)" }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full" style={{ background: "white", filter: "blur(60px)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full" style={{ background: "#F97316", filter: "blur(80px)" }} />
        </div>
        <div className="relative text-center px-12">
          <div className="text-6xl mb-6">🛍️</div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Welcome back to MyShop
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)" }}>
            Your go-to marketplace for quality products at student-friendly prices.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[["10K+", "Happy Customers"], ["500+", "Products"], ["4.8★", "Rating"], ["30-day", "Returns"]].map(([n, l]) => (
              <div key={l} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{n}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 mb-8 cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--primary)" }}>M</div>
            <span className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
              My<span style={{ color: "var(--primary)" }}>Shop</span>
            </span>
          </button>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Sign in to your account</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <button onClick={() => navigate("register")} className="font-semibold cursor-pointer" style={{ color: "var(--primary)" }}>
              Create one free
            </button>
          </p>

          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span className="flex-1">{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={`input-field ${errors.email ? "error" : ""}`}
              />
              {errors.email && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium" style={{ fontFamily: "Outfit, sans-serif" }}>Password</label>
                <button type="button" onClick={() => alert("To reset password, check your email or contact support.")} className="text-xs hover:underline cursor-pointer" style={{ color: "var(--primary)" }}>
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className={`input-field ${errors.password ? "error" : ""}`}
              />
              {errors.password && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.password}</p>}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => update("remember", e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--primary)" }}
              />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-1 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in with Supabase...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
            By signing in, you agree to our{" "}
            <a href="#" className="underline" style={{ color: "var(--primary)" }}>Terms of Service</a> and{" "}
            <a href="#" className="underline" style={{ color: "var(--primary)" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
