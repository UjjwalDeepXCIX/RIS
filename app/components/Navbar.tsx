import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import InstructionsModal from "./InstructionsModal";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
  const seen = localStorage.getItem("seenInstructions");

  if (!seen) {
    setShowInstructions(true);
    localStorage.setItem("seenInstructions", "true");
  }
}, []);

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
        <p className="text-shadow-cyan-950 text-3xl">RIS</p>
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
        <button
    onClick={() => setShowInstructions(true)}
    className="w-6 h-6 flex items-center justify-center rounded-full 
    animate-in fade-in zoom-in duration-300
    bg-white/10 border border-white/20 text-gray-300 
    hover:bg-white/20 transition text-xs"
  >
    i
  </button>

      </div>
      <InstructionsModal
  open={showInstructions}
  onClose={() => setShowInstructions(false)}
/>
    </nav>
  );
};

export default Navbar;