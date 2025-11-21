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
    <aside className="fixed top-0 left-0 h-screen w-64 z-50 bg-white border-r border-gray-200 shadow-lg flex flex-col">
      <div className="flex-1 flex flex-col justify-between h-full p-0">
        <div>
          <div className="px-6 py-8 border-b border-gray-100">
            <h3 className="text-xl font-semibold">Account</h3>
            <p className="text-sm muted">Quick links</p>
          </div>
          <nav className="flex flex-col gap-1 mt-2">
            {links.map((link) => (
              <Link
                to={link.path}
                key={link.id}
                onClick={() => setSidebar((prev: any) => !prev)}
                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-accent"
              >
                <span className="text-gray-600">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-6 pb-8">
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