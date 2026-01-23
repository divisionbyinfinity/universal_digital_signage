import NavBar from "./NavBar";
import Footer from "./Footer";
import { useAuth } from "../contexts/AuthContext";
import "./component.css";

export default function Layout({ children }) {
  const { user, logoutUser } = useAuth();

  return (
    <div className="layout-container">
      {user && <NavBar user={user} onLogout={logoutUser} />}

      <div className="main-content">{children}</div>

      {user && <Footer />}
    </div>
  );
}
