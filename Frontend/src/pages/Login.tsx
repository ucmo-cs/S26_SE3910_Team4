import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title as any}>Welcome Back</h2>
        <p style={styles.subtitle as any}>Sign in to your Commerce Bank account</p>
        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ color: "#dc2626", marginBottom: "16px", padding: "12px", backgroundColor: "#fee2e2", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            style={styles.input}
            required
          />

          <button type="submit" style={{...styles.button, opacity: loading ? 0.7 : 1}} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <span style={{ color: "#666", fontSize: "14px" }}>Don't have an account? </span>
          <Link to="/register" style={styles.link as any} onMouseEnter={(e: any) => (e.currentTarget.style.color = "#047857")} onMouseLeave={(e: any) => (e.currentTarget.style.color = "#059669")}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
  },
  card: {
    padding: "40px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#065f46",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#059669",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
  link: {
    color: "#059669",
    textDecoration: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.2s",
  },
};

export default Login;
