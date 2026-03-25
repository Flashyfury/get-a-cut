/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import styles from "./OwnerDashboard.module.css";
import heroimage from "../../assets/ownerd-bg.jpg";
import ShopSetup from "../auth/ShopSetup";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [_user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const initialize = async () => {
    const { data } = await supabase.auth.getUser();
    const currentUser = data?.user;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const { data: shopData, error } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", currentUser.id)
      .maybeSingle();

    if (error) console.log(error);

    setShop(shopData);
    setLoading(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className={styles.loader}>Loading your dashboard…</div>;

  return (
    <div className={styles.dashboard}>

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>GET-A-CUT</div>

        <ul className={styles.navLinks}>
          <li>Dashboard</li>
          <li>Bookings</li>
          <li>Barbers</li>
          <li>Services</li>
        </ul>

        <div className={styles.navRight}>
          <div
            className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <li>Dashboard</li>
          <li>Bookings</li>
          <li>Barbers</li>
          <li>Services</li>
        </div>
      )}

      {/* HERO */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${heroimage})` }}
      >
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Welcome Back, Boss 💈</h1>
          <p>Manage your shop, bookings &amp; barbers like a pro.</p>
        </div>
      </section>

      {/* IF NO SHOP */}
      {!shop && (
        <section className={styles.setupSection}>
          <h2>Create Your Shop</h2>
          <ShopSetup onShopCreated={initialize} />
        </section>
      )}

      {/* IF SHOP EXISTS */}
      {shop && (
        <>
          {/* Shop Info */}
          <section className={styles.shopInfo}>
            <h2>{shop.shop_name}</h2>
            <div className={styles.shopMeta}>
              <span className={styles.metaChip}>📍 {shop.address}</span>
              <span className={styles.metaChip}>🪑 {shop.total_seats} seats</span>
              <span className={styles.metaChip}>⏰ {shop.opening_time} – {shop.closing_time}</span>
            </div>
          </section>

          {/* Stats */}
          <section className={styles.stats}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📅</div>
              <h3>Today&apos;s Bookings</h3>
              <p>--</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>💰</div>
              <h3>Monthly Revenue</h3>
              <p>--</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>👨‍🔧</div>
              <h3>Active Barbers</h3>
              <p>--</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⭐</div>
              <h3>Rating</h3>
              <p>--</p>
            </div>
          </section>

          {/* Actions */}
          <section className={styles.actions}>
            <button>➕ Add Barber</button>
            <button>✂️ Manage Services</button>
            <button>📋 View Bookings</button>
            <button className={styles.logoutBtnMain} onClick={handleLogout}>
              🚪 Logout
            </button>
          </section>
        </>
      )}
    </div>
  );
}