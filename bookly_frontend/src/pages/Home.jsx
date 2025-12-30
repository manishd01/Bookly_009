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
    if (
      !auth.loading &&
      auth.authenticated &&
      auth.user?.role !== prevRole.current
    ) {
      prevRole.current = auth.user.role;
      auth.user.role === "seller" ? navigate("/seller") : navigate("/buyer");
    }
  }, []);

  // Prevent rendering while auth is loading
  if (auth.loading) return null;

  return (
    <>
      <header>
        {auth.authenticated && auth.user ? (
          <>
            Hi {auth.user.email} ({auth.user.role})
            <button onClick={signOut}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setModal("login")}>Login</button>
            <button onClick={() => setModal("signup")}>Signup</button>
          </>
        )}
      </header>

      {!auth.authenticated && <h1>Welcome to Bookly 📚</h1>}

      {modal && <AuthModal type={modal} onClose={() => setModal(null)} />}
    </>
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
