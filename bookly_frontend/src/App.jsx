import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import "./index.css"; // ✅ MUST import CSS

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
