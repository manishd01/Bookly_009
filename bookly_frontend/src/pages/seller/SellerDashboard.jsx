import SellerBooks from "./SellerBooks";
import { useAuth } from "../../context/AuthContext";
export default function SellerDashboard() {
  const { auth } = useAuth();
  return (
    <>
      <div className="text-center mb-6 mt-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Seller Dashboard for [
          <span className="text-base text-gray-600">{auth.user?.email}</span>]
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your books and uploads
        </p>
      </div>
      <SellerBooks />
    </>
  );
}
