import { Button, Text } from "@chakra-ui/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Navbar() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user?.displayName || user?.email || "");
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="flex justify-between items-center px-4 py-2 shadow-md">
      <div className="flex gap-2 items-center">
        <Text fontWeight="bold" className="font-bold text-xl">Level UP</Text>
        {/* <p>{user}</p> */}
      </div>
      <div>
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
