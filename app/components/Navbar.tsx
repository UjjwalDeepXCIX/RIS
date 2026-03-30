import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Puter logout
      navigate("/auth");    // redirect after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

   return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/">
        <p className="text-xl font-normal">RIS</p>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-3">

        <Link to="/upload" className="nav-button">
          Upload
        </Link>

        <Link to="/wipe" className="nav-button nav-button-danger">
          Wipe
        </Link>

        <button onClick={handleLogout} className="nav-button">
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;