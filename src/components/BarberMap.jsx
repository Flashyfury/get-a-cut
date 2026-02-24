
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function FlyToUser({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [position, map]);

  return null;
}

export default function BarberMap({ shops = [], onBook = () => {} }) {
  const [userLocation, setUserLocation] = useState(null);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => alert("Location access denied")
    );
  };

  // Prevent invalid lat/lng crash
  const validShops = shops.filter(
    (shop) =>
      shop.lat !== null &&
      shop.lng !== null &&
      !isNaN(shop.lat) &&
      !isNaN(shop.lng)
  );

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <button
        onClick={detectLocation}
        style={{
          position: "absolute",
          zIndex: 1000,
          margin: 10,
          padding: "8px 14px",
          borderRadius: "8px",
          border: "none",
          background: "#ff9800",
          color: "white",
          cursor: "pointer",
        }}
      >
        📍 Find Barbers Near Me
      </button>

      <MapContainer
        center={[22.5726, 88.3639]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validShops.map((shop) => (
          <Marker
            key={shop.id}
            position={[Number(shop.lat), Number(shop.lng)]}
          >
            <Popup>
              <h4>{shop.shop_name}</h4>
              <p>Seats: {shop.total_seats}</p>

              <button
                onClick={() => onBook(shop.id)}
                style={{
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Book Now
              </button>
            </Popup>
          </Marker>
        ))}

        {userLocation && <FlyToUser position={userLocation} />}
      </MapContainer>
    </div>
  );
}