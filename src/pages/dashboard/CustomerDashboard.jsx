/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import BarberMap from "../../components/BarberMap";

import styles from "./CustomerDashboard.module.css";
import heroImage from "../../assets/barber-bg.jpg";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  const fetchShops = async () => {
    const { data, error } = await supabase
      .from("shops")
      .select("*");
    if (!error) setShops(data);
  };

  useEffect(() => {
    getUser();
    fetchShops();
  }, []);

  const fetchMyBookings = async (userId) => {
    const { data } = await supabase
      .from("bookings")
      .select("*, shops(shop_name)")
      .eq("user_id", userId);
    setMyBookings(data || []);
  };

  useEffect(() => {
    if (user) fetchMyBookings(user.id);
  }, [user]);

  const handleBooking = async (shopId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const { data: accepted } = await supabase
      .from("bookings")
      .select("*")
      .eq("shop_id", shopId)
      .eq("status", "accepted");

    const { data: shop } = await supabase
      .from("shops")
      .select("total_seats")
      .eq("id", shopId)
      .single();

    let bookingStatus = "pending";
    if (accepted.length < shop.total_seats) {
      bookingStatus = "accepted";
    }

    const { error } = await supabase.from("bookings").insert({
      shop_id: shopId,
      user_id: user.id,
      status: bookingStatus,
    });

    if (error) {
      alert(error.message);
    } else {
      alert(
        bookingStatus === "accepted"
          ? "Booking Confirmed ✅"
          : "Added to Queue ⏳"
      );
      fetchMyBookings(user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className={styles.dashboard}>

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>GET-A-CUT</div>

        <ul className={styles.navLinks}>
          <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</li>
          <li onClick={() => document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" })}>Find Barbers</li>
          <li onClick={() => document.getElementById("bookings-section")?.scrollIntoView({ behavior: "smooth" })}>My Bookings</li>
        </ul>

        <div className={styles.navRight}>
          {user && (
            <span className={styles.greeting}>
              👋 {user.email?.split("@")[0]}
            </span>
          )}
          <button
            className={styles.bookBtn}
            onClick={() => document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Book Now
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>
            STYLE BETTER <br />
            <span>STAY SHARP</span>
          </h1>
          <p>Premium grooming experience. Find the best barbers near you.</p>
          <button
            className={styles.ctaBtn}
            onClick={() => document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore Barbers Near You →
          </button>
        </div>
      </section>

      {/* MAP SECTION */}
      <section id="map-section" className={styles.mapSection}>
        <h2 className={styles.mapTitle}>Find Barbers Near You</h2>
        <p className={styles.mapSubtitle}>Tap a pin to see shop details and book your slot instantly.</p>
        <div className={styles.mapContainer}>
          <BarberMap shops={shops} onBook={handleBooking} />
        </div>
      </section>

      {/* MY BOOKINGS */}
      <section id="bookings-section" className={styles.myBookings}>
        <h2>My Bookings</h2>
        <p className={styles.sectionSubtitle}>Track all your appointments in one place.</p>

        {myBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✂️</div>
            <p>No bookings yet — find a barber and book your first slot!</p>
          </div>
        ) : (
          <div className={styles.bookingsGrid}>
            {myBookings.map((booking, i) => (
              <div key={i} className={styles.bookingCard}>
                <div className={styles.bookingShopIcon}>💈</div>
                <h4>{booking.shops?.shop_name}</h4>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Status:</span>
                  {booking.status === "accepted" ? (
                    <span className={styles.badgeAccepted}>✅ Confirmed</span>
                  ) : (
                    <span className={styles.badgePending}>⏳ Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            <h3>GET-A-CUT</h3>
            <p>Premium grooming experience. Stay sharp.</p>
          </div>
          <div>
            <p>© 2026 GET-A-CUT. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}