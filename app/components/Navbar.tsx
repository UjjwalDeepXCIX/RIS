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
    <nav className="navbar flex items-center justify-between">
      
      {/* Left */}
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">RIS</p>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>

        {/* Wipe Button */}
        <Link
          to="/wipe"
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Wipe
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;