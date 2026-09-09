import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function RegisterPage() {
  const { navigate, register } = useApp();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords don't match";
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
      await register(form.email, form.password, form.name);
      navigate("home");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setServerError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, val: string) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => {
      const ne = { ...e };
      delete ne[field];
      return ne;
    });
    setServerError("");
  };

  const strength = (() => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 6) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#EF4444", "#F97316", "#EAB308", "#10B981"][strength];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--surface)" }}>
      <div className="w-full max-w-md">
        <button onClick={() => navigate("home")} className="flex items-center gap-2 mb-8 cursor-pointer">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--primary)" }}>M</div>
          <span className="text-xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
            My<span style={{ color: "var(--primary)" }}>Shop</span>
          </span>
        </button>

        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Create your account</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <button onClick={() => navigate("login")} className="font-semibold cursor-pointer" style={{ color: "var(--primary)" }}>
              Sign in
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
              <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Full Name</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={`input-field ${errors.name ? "error" : ""}`}
              />
              {errors.name && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Email Address</label>
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
              <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className={`input-field ${errors.password ? "error" : ""}`}
              />
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-colors" style={{ background: i <= strength ? strengthColor : "var(--border)" }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
              {errors.password && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                className={`input-field ${errors.confirm ? "error" : ""}`}
              />
              {errors.confirm && <p className="text-xs mt-1.5" style={{ color: "var(--error)" }}>{errors.confirm}</p>}
              {form.confirm && form.confirm === form.password && !errors.confirm && (
                <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--success)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  Passwords match
                </p>
              )}
            </div>

            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              By creating an account, you agree to our{" "}
              <a href="#" className="underline" style={{ color: "var(--primary)" }}>Terms</a> and{" "}
              <a href="#" className="underline" style={{ color: "var(--primary)" }}>Privacy Policy</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Supabase Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
