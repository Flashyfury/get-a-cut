import { useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./ShopSetup.module.css";

export default function ShopSetup({ onShopCreated }) {
  const [form, setForm] = useState({
    shop_name: "",
    total_seats: 1,
    opening_time: "",
    closing_time: "",
    address: "",
    lat: "",
    lng: ""
  });

  const [loading, setLoading] = useState(false);

  
  //  Convert address → lat/lng
  
  const getCoordinatesFromAddress = async () => {
    if (!form.address) return alert("Enter address first");

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          form.address
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );

      const data = await res.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;

        setForm((prev) => ({
          ...prev,
          lat: location.lat,
          lng: location.lng
        }));

        alert("Location detected successfully ✅");
      } else {
        alert("Unable to find location");
      }
    } catch (err) {
      alert("Error detecting location");
    }
  };

  
  //  Use browser GPS
  
  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));

        alert("Location captured from device 📍");
      },
      () => alert("Permission denied")
    );
  };

 
  //  Save Shop
  
  const saveShop = async () => {
    if (!form.shop_name || !form.address) {
      return alert("Please fill all required fields");
    }

    setLoading(true);

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not authenticated");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("shops").insert([
        {
          owner_id: user.id,
          shop_name: form.shop_name,
          total_seats: Number(form.total_seats),
          opening_time: form.opening_time,
          closing_time: form.closing_time,
          address: form.address,
          lat: form.lat || null,
          lng: form.lng || null
        }
      ]);

      if (error) {
        alert(error.message);
      } else {
        alert("Shop saved successfully ✅");

        // Refresh OwnerDashboard
        if (onShopCreated) {
          onShopCreated();
        }

        // Reset form
        setForm({
          shop_name: "",
          total_seats: 1,
          opening_time: "",
          closing_time: "",
          address: "",
          lat: "",
          lng: ""
        });
      }
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  
  //  UI
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Shop Setup</h2>

        <input
          placeholder="Shop Name"
          value={form.shop_name}
          onChange={(e) =>
            setForm({ ...form, shop_name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Total Seats"
          value={form.total_seats}
          onChange={(e) =>
            setForm({ ...form, total_seats: e.target.value })
          }
        />

        <input
          type="time"
          value={form.opening_time}
          onChange={(e) =>
            setForm({ ...form, opening_time: e.target.value })
          }
        />

        <input
          type="time"
          value={form.closing_time}
          onChange={(e) =>
            setForm({ ...form, closing_time: e.target.value })
          }
        />

        <input
          placeholder="Shop Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <div className={styles.locationBtns}>
          <button type="button" onClick={getCoordinatesFromAddress}>
            Detect From Address
          </button>

          <button type="button" onClick={useMyLocation}>
            Use My Location 📍
          </button>
        </div>

        <button
          className={styles.saveBtn}
          onClick={saveShop}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Shop"}
        </button>
      </div>
    </div>
  );
}