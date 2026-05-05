import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";

const Auth = ({ mode }) => {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = isRegister ? await register(form) : await login(form.email, form.password);
      navigate(user.isAdmin ? "/admin" : location.state?.from || "/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-page grid min-h-[720px] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Account</p>
        <h1 className="mt-2 font-display text-5xl font-bold">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-4 max-w-md leading-7 text-ink/60">
          Save your wishlist, checkout faster, and track every order from a polished account dashboard.
        </p>
      </section>
      <form onSubmit={submit} className="rounded-lg border border-black/10 bg-white p-6 shadow-premium">
        {error && <div className="mb-4"><ErrorState message={error} /></div>}
        {isRegister && (
          <label className="mb-4 block text-sm font-semibold">Name
            <input className="input mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
        )}
        <label className="mb-4 block text-sm font-semibold">Email
          <input className="input mt-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="mb-6 block text-sm font-semibold">Password
          <span className="relative mt-2 block">
            <input
              className="input w-full pr-12"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/45 transition hover:text-ink"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Please wait..." : isRegister ? "Create account" : "Login"}</button>
        <p className="mt-5 text-center text-sm text-ink/60">
          {isRegister ? "Already registered?" : "New here?"}{" "}
          <Link className="font-bold text-ink" to={isRegister ? "/login" : "/signup"}>{isRegister ? "Login" : "Create account"}</Link>
        </p>
      </form>
    </main>
  );
};

export default Auth;
