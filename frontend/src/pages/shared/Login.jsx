import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthTokens } from "../../api";

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      setAuthTokens(data.accessToken, data.refreshToken);
      onLogin(data.user);
      navigate(data.mustChangePassword ? "/change-password" : "/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">EMRS Login</h2>
        <p className="mt-2 text-sm text-slate-600">Sign in with your hospital role account.</p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="grid gap-1.5 text-sm">
            <span className="text-slate-700">Username</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              value={form.username}
              onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-slate-700">Password</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </label>
          <button
            className="h-10 rounded-lg bg-blue-700 text-white transition hover:bg-blue-800 disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}

export default Login;

