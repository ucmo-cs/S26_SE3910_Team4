import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { button, buttonPrimary, input } from "../styles/ui";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname ?? "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authUser", data.username);
        localStorage.setItem("userProfile", JSON.stringify(data));
        navigate(redirectPath, { replace: true });
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 px-4 py-10 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-[2rem] bg-white/10 p-6 shadow-2xl shadow-slate-950/20 ring-1 ring-white/10 backdrop-blur-xl sm:p-10 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100 shadow-sm shadow-black/10">
            Secure banking portal
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back to Commerce Bank</h1>
            <p className="max-w-xl text-sm text-emerald-100/90 sm:text-base">
              Sign in to view appointments, manage your profile, and access personalized banking services.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-5 shadow-sm ring-1 ring-white/10">
              <p className="text-sm font-semibold text-white">Fast access</p>
              <p className="mt-2 text-sm text-emerald-100/85">Login quickly and keep your session secure with modern authentication.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 shadow-sm ring-1 ring-white/10">
              <p className="text-sm font-semibold text-white">Appointment tools</p>
              <p className="mt-2 text-sm text-emerald-100/85">Reserve services, check schedules, and manage your appointments from one dashboard.</p>
            </div>
          </div>
        </div>

        <section className="rounded-[1.75rem] bg-white p-8 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-900/5 sm:p-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Member login</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-500">Enter the credentials provided by your branch or account administrator.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                className={`${input} border-slate-300 bg-slate-50 text-slate-900`}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className={`${input} border-slate-300 bg-slate-50 text-slate-900`}
                required
              />
            </div>

            <button
              type="submit"
              className={`${button} ${buttonPrimary} w-full justify-center text-sm font-semibold`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Create one
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
