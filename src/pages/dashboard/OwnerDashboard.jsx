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
  const [shopBookings, setShopBookings] = useState([]);
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

  const fetchShopBookings = async (shopId) => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setShopBookings(data);
    }
  };

  useEffect(() => {
    if (shop) {
      fetchShopBookings(shop.id);
    }
  }, [shop]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);
      
    if (error) {
      alert("Error updating booking status");
    } else {
      fetchShopBookings(shop.id);
    }
  };

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
              <h3>Total Bookings</h3>
              <p>{shopBookings.length}</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⏳</div>
              <h3>Pending Quotes</h3>
              <p>{shopBookings.filter(b => b.status === "pending").length}</p>
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

          {/* Bookings Section */}
          <section id="bookings-section" className={styles.myBookings}>
            <h2>Shop Bookings</h2>
            <p className={styles.sectionSubtitle}>Manage appointments and customer requests.</p>
            
            {shopBookings.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>✂️</div>
                <p>No bookings yet for {shop.shop_name}!</p>
              </div>
            ) : (
              <div className={styles.bookingsGrid}>
                {shopBookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.bookingCardHeader}>
                      <div className={styles.bookingShopIcon}>🧑‍🦱</div>
                      <span className={styles.statusLabel}>
                        {booking.status === "accepted" ? (
                          <span className={styles.badgeAccepted}>✅ Accepted</span>
                        ) : booking.status === "completed" ? (
                          <span className={styles.badgeCompleted}>🏁 Completed</span>
                        ) : (
                          <span className={styles.badgePending}>⏳ Pending</span>
                        )}
                      </span>
                    </div>
                    <h4>Customer ID: {booking.user_id?.substring(0, 8)}...</h4>
                    <p className={styles.bookingDate}>
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className={styles.bookingActions}>
                      {booking.status === "pending" && (
                        <button 
                          className={styles.acceptBtn}
                          onClick={() => handleUpdateBookingStatus(booking.id, "accepted")}
                        >
                          Accept
                        </button>
                      )}
                      {booking.status === "accepted" && (
                        <button 
                          className={styles.completeBtn}
                          onClick={() => handleUpdateBookingStatus(booking.id, "completed")}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Actions */}
          <section className={styles.actions}>
            <button>➕ Add Barber</button>
            <button>✂️ Manage Services</button>
            <button className={styles.logoutBtnMain} onClick={handleLogout}>
              🚪 Logout
            </button>
          </section>
        </>
      )}
    </div>
  );
}