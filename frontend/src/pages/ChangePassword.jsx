import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthTokens } from "../api";

function ChangePassword({ user, onPasswordChanged, onLogout }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setAuthTokens(data.accessToken, data.refreshToken);
      onPasswordChanged(data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Reset Password</h2>
        <p className="mt-2 text-sm text-slate-600">
          {user?.fullName}, you must set a new password before accessing the system.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="grid gap-1.5 text-sm">
            <span className="text-slate-700">Current Password</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              type="password"
              value={form.currentPassword}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-slate-700">New Password</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-slate-700">Confirm Password</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              required
            />
          </label>
          <button
            className="h-10 rounded-lg bg-blue-700 text-white transition hover:bg-blue-800 disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
          <button
            type="button"
            className="h-10 rounded-lg bg-slate-500 text-white transition hover:bg-slate-600"
            onClick={onLogout}
          >
            Logout
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </section>
    </div>
  );
}

export default ChangePassword;
