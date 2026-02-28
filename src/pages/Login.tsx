import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "password") {
      navigate("/"); // redirect to home
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Commerce Bank Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
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
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "320px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#004b87",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;