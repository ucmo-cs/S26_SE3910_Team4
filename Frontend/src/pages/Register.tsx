import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { page, stack, section, grid2 } from "../styles/layout";
import { button, buttonPrimary, divider, input, label, muted } from "../styles/ui";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

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
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setFormData({
      ...formData,
      [name]: nextValue,
    });

    if (name === "email") {
      setEmailError(value.trim() === "" || isValidEmail(value) ? "" : "Enter a valid email address");
    }

    if (name === "phone") {
      setPhoneError(nextValue.length === 0 || nextValue.length === 10 ? "" : "Phone number must be 10 digits");
    }
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

    if (!isValidEmail(formData.email)) {
      setEmailError("Enter a valid email address");
      setError("Enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.phone.length > 0 && formData.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits");
      setError("Phone number must be 10 digits");
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
            <form onSubmit={handleSubmit} className={stack} noValidate>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className={grid2}>
                <div>
                  <label className={label}>First Name <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
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
                  <label className={label}>Last Name <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
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
                <label className={label}>Email <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => {
                    setEmailError(
                      formData.email.trim() === "" || isValidEmail(formData.email) ? "" : "Enter a valid email address",
                    );
                  }}
                  className={input}
                  inputMode="email"
                  placeholder="name@example.com"
                  aria-invalid={emailError ? "true" : "false"}
                  required
                />
                {emailError ? <div className="mt-2 text-sm text-red-700">{emailError}</div> : null}
              </div>

              <div>
                <label className={label}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => {
                    setPhoneError(
                      formData.phone.length === 0 || formData.phone.length === 10 ? "" : "Phone number must be 10 digits",
                    );
                  }}
                  className={input}
                  placeholder="555-555 5555"
                  inputMode="numeric"
                  maxLength={10}
                  aria-invalid={phoneError ? "true" : "false"}
                />
                {phoneError ? <div className="mt-2 text-sm text-red-700">{phoneError}</div> : null}
              </div>

              <div>
                <label className={label}>Username <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
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
                <label className={label}>Password <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
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
                <label className={label}>Confirm Password <span className="text-red-600" title="Required field" aria-label="Required field">*</span></label>
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
