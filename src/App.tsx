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
import RecurringTodos from "./pages/RecurringTodos";
import { getRecurringTodos } from "./Query/recurringQuery";
import { getTodayMission, addTodayMission } from "./Query/todayQuery";

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

  // When a user logs in, ensure recurring todos are instantiated for today
  useEffect(() => {
    if (!user) return;

    const processRecurring = async () => {
      try {
        // prevent running more than once per day per user
        const key = `recurring_last_run_${user.uid}`;
        const lastRun = localStorage.getItem(key);
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        if (lastRun === today) return;

        const recRes: any = await getRecurringTodos(user.uid);
        const todayRes: any = await getTodayMission(user.uid);
        const todays = todayRes?.data || [];

        if (recRes?.data && Array.isArray(recRes.data)) {
          for (const template of recRes.data) {
            const alreadyAdded = todays.find((t: any) => t.recurringId === template.id);
            if (!alreadyAdded) {
              const payload = {
                title: template.title,
                completed: false,
                exp: template.exp ?? 15,
                email: user.email,
                uid: user.uid,
                recurringId: template.id,
              };
              await addTodayMission(payload);
            }
          }
        }

        localStorage.setItem(key, today);
      } catch (err) {
        console.error("Error processing recurring todos:", err);
      }
    };

    processRecurring();
  }, [user]);

  if (loading) {
    return <Loading/>
  }

  return (
    <main className="content-offset">
      <Navbar user={user} setSidebar={setShowSidebar} showSidebar={showSidebar} />
      <div onClick={() => setShowSidebar(false)}>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/stats" element={<Stats user={user} />} />
        <Route path="/recurring" element={<RecurringTodos user={user} />} />
      </Routes>
      </div>
    </main>
  );
}
