import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Loading from "./components/Loading";
import Signup from "./pages/Signup";
import Stats from "./pages/Stats";

export default function App() {
  const [user, setUser] = useState<User | null>(null); // Explicitly define the type
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading/>
  }

  return (
    <main>
      <Navbar user={user} setSidebar={setShowSidebar} showSidebar={showSidebar} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stats" element={<Stats user={user} />} />
      </Routes>
    </main>
  );
}
