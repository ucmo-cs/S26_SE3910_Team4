import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section, grid2 } from "../styles/layout";
import { button, buttonPrimary, buttonGhost, divider, h2, input, label, muted } from "../styles/ui";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful - store both username and full profile
        if (data.username) {
          localStorage.setItem("authUser", data.username);
          localStorage.setItem("userProfile", JSON.stringify(data));
          // Navigate to home, which will show personalized welcome
          navigate("/");
        } else {
          setError("Registration response missing username");
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={page}>
      <div className={stack}>
        <PageHeader
          title="Create Account"
          subtitle="Join Commerce Bank to manage your appointments"
        />

        <Card>
          <div className={section}>
            <form onSubmit={handleSubmit} className={stack}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className={grid2}>
                <div>
                  <label className={label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>
                <div>
                  <label className={label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={input}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={input}
                  required
                />
              </div>

              <div>
                <label className={label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={input}
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label className={label}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={input}
                  required
                />
              </div>

              <div>
                <label className={label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={input}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className={label}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={input}
                  required
                />
              </div>

              <button
                type="submit"
                className={`${button} ${buttonPrimary}`}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className={`${divider} my-6`} />

            <div className="text-center">
              <span className={muted}>Already have an account? </span>
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;