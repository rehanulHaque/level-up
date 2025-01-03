import { signOut } from "firebase/auth";
import { User as Usericon, ChartLine, Hammer, LogOutIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

interface SidebarProps {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const links = [
  {
    id: 0,
    name: "Stats",
    path: "/stats",
    icon: <ChartLine/>
  },
  {
    id: 1,
    name: "Punishment",
    path: "/punishment",
    icon: <Hammer/>
  }
]
export default function SideBar({ setSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  return (
    <div className="h-screen bg-gray-100 absolute w-[200px] top-0 right-0 flex flex-col gap-3">
      <div
        className="cursor-pointer px-3 py-4 rounded-b-md font-medium transition-all flex items-center gap-2"
        onClick={() => setSidebar((prev: any) => !prev)}
      >
        <Usericon />
        <span>Profile</span>
      </div>
      {links.map((link) => (
        <div className="cursor-pointer px-3 py-2 rounded-md font-medium transition-all" key={link.id}>
        <Link to={link.path} className="flex gap-2">
          <span>{link.icon}</span>
         <span>{link.name}</span>
         </Link>
      </div>
      ))}
      <button onClick={handleLogout} className="flex items-center gap-2 justify-center absolute bottom-0 left-0 px-4 py-3 bg-gray-500  rounded-t-md text-white font-medium transition-all w-full">
        <LogOutIcon/> Logout
      </button>
    </div>
  );
}