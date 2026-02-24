import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithRole } from "../../lib/loginWithRole";
import BarberSpinner from "../../components/BarberSpinner";
import styles from "./login.module.css";

export default function LoginCustomer() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const result = await loginWithRole(email, password);

      // role-based redirect
      if (result.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/customer-dashboard");
      }

    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>

      {/* floating barber icons background */}
      <div className={styles.bgIcons}>
        <span>✂️</span>
        <span>🪒</span>
        <span>💈</span>
        <span>✂️</span>
        <span>🪒</span>
        <span>💈</span>
      </div>

      <form className={styles.card} onSubmit={handleLogin}>
        <h2 className={styles.title}>Let’s Get a Cut</h2>

        {/* email */}
        <input
          className={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* password */}
        <div className={styles.passWrap}>
          <input
            className={styles.input}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPass((v) => !v)}
            aria-label="toggle password"
          >
            {showPass ? "🙈" : "👁"}
          </button>
        </div>

        {/* submit */}
        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? <BarberSpinner /> : "Login"}
        </button>

        {/* links */}
        <p className={styles.switchText}>
          No account? <Link to="/register">Register</Link>
        </p>

        <p className={styles.switchText}>
          Shop owner? <Link to="/shop-setup">Owner Setup</Link>
        </p>

      </form>
    </div>
  );
}
