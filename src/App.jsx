import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginCustomer from "./pages/auth/LoginCustomer";
import Register from "./pages/auth/Register";
import ShopSetup from "./pages/auth/ShopSetup";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import OwnerDashboard from "./pages/dashboard/OwnerDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

       
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginCustomer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop-setup" element={<ShopSetup />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
