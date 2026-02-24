import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import BarberMap from "../../components/BarberMap";

import styles from "./CustomerDashboard.module.css";
import heroImage from "../../assets/barber-bg.jpg";

export default function CustomerDashboard() {

  const [shops, setShops] = useState([]);
  const [user, setUser] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    getUser();
    fetchShops();
  }, []);

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

  const fetchMyBookings = async (userId) => {
    const { data } = await supabase
      .from("bookings")
      .select("*, shops(shop_name)")
      .eq("user_id", userId);

    setMyBookings(data || []);
  };

  // BOOKING LOGIC (auto accept if seats available)
  const handleBooking = async (shopId) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    // Count accepted bookings
    const { data: accepted } = await supabase
      .from("bookings")
      .select("*")
      .eq("shop_id", shopId)
      .eq("status", "accepted");

    // Get total seats
    const { data: shop } = await supabase
      .from("shops")
      .select("total_seats")
      .eq("id", shopId)
      .single();

    let bookingStatus = "pending";

    if (accepted.length < shop.total_seats) {
      bookingStatus = "accepted";
    }

    // Insert booking
    const { error } = await supabase.from("bookings").insert({
      shop_id: shopId,
      user_id: user.id,
      status: bookingStatus
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

  useEffect(() => {
    if (user) fetchMyBookings(user.id);
  }, [user]);

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

          <p>
            Premium grooming experience. Find the best barbers near you.
          </p>

          <button className={styles.ctaBtn}>
            Explore Services
          </button>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className={styles.mapSection}>
        <h2 className={styles.mapTitle}>Find Barbers Near You</h2>

        <BarberMap
          shops={shops}
          onBook={handleBooking}
        />
      </section>

      {/* MY BOOKINGS */}
      <section className={styles.myBookings}>
        <h2>My Bookings</h2>

        {myBookings.length === 0 && (
          <p>No bookings yet.</p>
        )}

        {myBookings.map((booking, i) => (
          <div key={i} className={styles.bookingCard}>
            <h4>{booking.shops?.shop_name}</h4>
            <p>
              Status:{" "}
              <span
                className={
                  booking.status === "accepted"
                    ? styles.accepted
                    : styles.pending
                }
              >
                {booking.status}
              </span>
            </p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            <h3>GET-A-CUT</h3>
            <p>Premium grooming experience. Stay sharp.</p>
          </div>

          <div>
            <p>© 2026 GET-A-CUT</p>
          </div>
        </div>
      </footer>

    </div>
  );
}