import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <h3
          className="text-xl font-semibold text-indigo-600 cursor-pointer hover:text-indigo-700 transition"
          onClick={() => navigate("/")}
        >
          📚 Bookly
        </h3>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {auth.authenticated ? (
            <>
              <span className="text-sm text-gray-700">
                Hello{" "}
                <span className="font-medium text-gray-900">
                  {auth.user?.email}
                </span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">
                  {auth.user?.role}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg
                           hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <span className="text-sm text-gray-600">Hello Guest 👋</span>
          )}
        </div>
      </div>
    </header>
  );
}
