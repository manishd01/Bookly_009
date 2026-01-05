import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const prevRole = useRef(null);

  // Redirect ONLY after loading is done
  useEffect(() => {
    if (!auth.loading && auth.authenticated) {
      console.log("Redirecting user with role:", auth.user.role);

      const currentPath = window.location.pathname.toLowerCase();

      if (auth.user.role === "seller" && currentPath !== "/seller") {
        prevRole.current = auth.user.role;
        navigate("/seller", { replace: true });
      } else if (auth.user.role === "buyer" && currentPath !== "/buyer") {
        prevRole.current = auth.user.role;
        navigate("/buyer", { replace: true });
      }
    }
  }, [auth, navigate]);

  // Prevent rendering while auth is loading
  if (auth.loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 space-y-10">
      {/* Header */}
      <header className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
        {auth.authenticated && auth.user ? (
          <>
            <div className="text-gray-800 font-medium">
              Hi <span className="font-semibold">{auth.user.email}</span> (
              <span className="capitalize">{auth.user.role}</span>)
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex justify-center gap-4 w-full">
            <button
              onClick={() => setModal("login")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
            >
              Login
            </button>
            <button
              onClick={() => setModal("signup")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition"
            >
              Signup
            </button>
          </div>
        )}
      </header>

      {/* Welcome Message */}
      {!auth.authenticated && (
        <h1 className="text-4xl font-bold text-gray-800 text-center mt-10">
          Welcome to Bookly 📚
        </h1>
      )}

      {/* Modal */}
      {modal && <AuthModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import AuthModal from "./AuthModal";
// import Books from "./Books";
// import { getCurrentUser, logout } from "../services/authService";
// import "./Home.css";

// function Home() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authModalType, setAuthModalType] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await getCurrentUser();
//         console.log(res, "fetched current user");
//         setUser(res);
//       } catch (err) {
//         console.log(err, "error fetching current user");
//         setUser({ authenticated: false, user: null });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     setUser({ authenticated: false, user: null });
//   };

//   if (loading) return null;

//   return (
//     <>
//       <header className="navbar">
//         {user && user.user ? (
//           <>
//             Hi {user.user.email} | role: {user.user.role} 👋
//           </>
//         ) : (
//           "Hi Guest 👋"
//         )}

//         <div className="nav-actions">
//           {user?.authenticated ? (
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           ) : (
//             <>
//               <button
//                 className="login-btn"
//                 onClick={() => setAuthModalType("login")}
//               >
//                 Login
//               </button>

//               <button
//                 className="signup-btn"
//                 onClick={() => setAuthModalType("signup")}
//               >
//                 Signup
//               </button>
//             </>
//           )}
//         </div>
//       </header>

//       <main className="content">
//         {user?.authenticated ? (
//           <Books auth={user} />
//         ) : (
//           <>
//             <h1>Welcome to Bookly 📚</h1>
//             <p>Please login or signup to continue</p>
//           </>
//         )}
//       </main>

//       {authModalType && (
//         <AuthModal
//           type={authModalType}
//           onClose={() => setAuthModalType(null)}
//           onLogin={(userData) => {
//             setUser({ authenticated: true, user: userData });
//             setAuthModalType(null);
//           }}
//         />
//       )}
//     </>
//   );
// }

// export default Home;

// // http://127.0.0.1:5173/ server running in this:
// //http://127.0.0.1:5173/ vs http://localhost:5173/ is different for cookies
//npx tailwindcss init
