import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import SellerDashboard from "../pages/seller/SellerDashboard";
import BuyerDashboard from "../pages/buyer/BuyerDashboard";
import RoleGuard from "../guards/RoleGuard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/seller"
        element={
          <RoleGuard allow={["Seller"]}>
            <SellerDashboard />
          </RoleGuard>
        }
      />

      <Route
        path="/buyer"
        element={
          <RoleGuard allow={["Buyer"]}>
            <BuyerDashboard />
          </RoleGuard>
        }
      />
    </Routes>
  );
}
