import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { User as UserIcon } from "lucide-react";
import SideBar from "./SideBar";

export default function Navbar({ user, setSidebar, showSidebar }: any) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="navbar-glass fixed top-0 left-0 right-0 z-40">
      <div className="app-container flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="./main_logo.png" alt="logo" className="h-8 w-8" />
            <span className="font-semibold text-lg">LevelUp</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="muted hover:accent">Home</Link>
          <Link to="/stats" className="muted hover:accent">Stats</Link>
          <Link to="/recurring" className="muted hover:accent">Recurring</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button className="hidden md:inline-block btn-accent" onClick={handleLogout}>Logout</button>
              <div className="md:hidden">
                <button onClick={() => setSidebar((prev: any) => !prev)} className="p-2 bg-white rounded-full shadow-sm">
                  <UserIcon />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-accent">Login</Link>
          )}
        </div>
      </div>
      {showSidebar && <SideBar setSidebar={setSidebar} />}
    </header>
  );
}
