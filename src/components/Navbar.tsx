import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Settings, User } from "lucide-react";
import { useState } from "react";
import SideBar from "./SideBar";

export default function Navbar({ user }: any) {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center   shadow-md">
      <div className="flex gap-2 items-center py-2 px-4">
        <Link to="/">
          <img src="./main_logo.png" className="h-[23px]" />
        </Link>
      </div>
      <div className="relative py-2 px-4">
        {user ? (
          <div>
            <button
              className="hidden md:block lg:block px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 font-medium transition-all"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div
              className="md:hidden lg:hidden cursor-pointer px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 font-medium transition-all z-50"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <User />
            </div>
          </div>
        ) : (
          <button>
            <Link to="/login">Login</Link>
          </button>
        )}
        {showSidebar && <SideBar setSidebar={setShowSidebar}/>}
      </div>
    </div>
  );
}
