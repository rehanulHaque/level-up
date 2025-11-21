import { signOut } from "firebase/auth";
import { User as Usericon, ChartLine, LogOutIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

interface SidebarProps {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const links = [
  {
    id: 0,
    name: "Home",
    path: "/",
    icon: <Usericon />,
  },
  {
    id: 1,
    name: "Stats",
    path: "/stats",
    icon: <ChartLine />,
  },
  {
    id: 2,
    name: "Recurring",
    path: "/recurring",
    icon: <ChartLine />,
  },
];

export default function SideBar({ setSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 right-0 h-screen w-64 p-6 z-50">
      <div className="card h-full flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Account</h3>
            <p className="text-sm muted">Quick links</p>
          </div>

          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                to={link.path}
                key={link.id}
                onClick={() => setSidebar((prev: any) => !prev)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg"
          >
            <LogOutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}