import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import styles from "./OwnerDashboard.module.css";
import heroimage from "../../assets/ownerd-bg.jpg";
import ShopSetup from "../auth/ShopSetup";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

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
      .maybeSingle(); // ✅ FIXED

    if (error) console.log(error);

    setShop(shopData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>GET-A-CUT</div>

        <ul className={styles.navLinks}>
          <li>Home</li>
          <li>Services</li>
          <li>Barbers</li>
          <li>Bookings</li>
          <li>Profile</li>
        </ul>

        <button className={styles.bookBtn}>Book Now</button>

        <div
          className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {menuOpen && (
          <div className={styles.mobileMenu}>
            <li>Home</li>
            <li>Services</li>
            <li>Barbers</li>
            <li>Bookings</li>
            <li>Profile</li>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${heroimage})` }}
      >
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1>Welcome Back, Boss 💈</h1>
          <p>Manage your shop, bookings & barbers like a pro.</p>
        </div>
      </section>

      {/* IF NO SHOP */}
      {!shop && (
        <section className={styles.setupSection}>
          <h2>Create Your Shop</h2>
          <ShopSetup />
        </section>
      )}

      {/* IF SHOP EXISTS */}
      {shop && (
        <>
          <section className={styles.shopInfo}>
            <h2>{shop.shop_name}</h2>
            <p>📍 {shop.address}</p>
            <p>🪑 Seats: {shop.total_seats}</p>
            <p>⏰ {shop.opening_time} - {shop.closing_time}</p>
          </section>

          <section className={styles.stats}>
            <div className={styles.card}>
              <h3>📅 Today's Bookings</h3>
              <p>--</p>
            </div>

            <div className={styles.card}>
              <h3>💰 Monthly Revenue</h3>
              <p>--</p>
            </div>

            <div className={styles.card}>
              <h3>👨‍🔧 Active Barbers</h3>
              <p>--</p>
            </div>

            <div className={styles.card}>
              <h3>⭐ Rating</h3>
              <p>--</p>
            </div>
          </section>

          <section className={styles.actions}>
            <button>Add Barber</button>
            <button>Manage Services</button>
            <button>View Bookings</button>
          </section>
        </>
      )}
    </div>
  );
}