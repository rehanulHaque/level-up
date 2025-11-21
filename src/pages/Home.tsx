import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import MainQuest from "../components/MainQuest";
import SideQuest from "../components/SideQuest";
import TodayMission from "../components/TodayMission";
import { getUserStats } from "../Query/stats";
import { useQuery } from "react-query";

const useGetStats = (uid: string) => {
  return useQuery({
    queryKey: ["UserStats", uid],
    queryFn: () => getUserStats(uid),
  });
};

export default function Home({ user }: any) {

  const [showMainQuest, setShowMainQuest] = useState(false);
  const [showSideQuest, setShowSideQuest] = useState(false);
  const [showTodayMission, setShowTodayMission] = useState(true);

  // Fetch user Stats
  const { data: stats, isLoading: isLoading } = useGetStats(user.uid);

  return (
    <main className="app-container pt-24 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.displayName}</h1>
          <p className="muted">Keep your streak going</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <img src="./fire_gif.gif" alt="" className="h-10 w-10 mx-auto" />
            <div className="font-semibold text-lg">{isLoading ? "0" : stats?.data?.streakCount}</div>
            <div className="text-xs muted">Streak</div>
          </div>
          <div className="hidden md:block">
            <Button size={"sm"}>
              <Link to="/stats">Stats</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="col-span-1 md:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Today's Mission</h3>
            <div>
              <button className="p-2 bg-gray-100 rounded-full" onClick={() => setShowTodayMission((s) => !s)}>
                <img src="./arrow_down.svg" className={`h-4 w-4 transition-all ${showTodayMission ? "rotate-90" : ""}`} alt="" />
              </button>
            </div>
          </div>
          {showTodayMission && <TodayMission user={user} />}
        </section>

        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Main Quest</h3>
            <button className="p-2 bg-gray-100 rounded-full" onClick={() => setShowMainQuest((s) => !s)}>
              <img src="./arrow_down.svg" className={`h-4 w-4 transition-all ${showMainQuest ? "rotate-90" : ""}`} alt="" />
            </button>
          </div>
          {showMainQuest && <MainQuest user={user} />}
        </section>

        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Side Quest</h3>
            <button className="p-2 bg-gray-100 rounded-full" onClick={() => setShowSideQuest((s) => !s)}>
              <img src="./arrow_down.svg" className={`h-4 w-4 transition-all ${showSideQuest ? "rotate-90" : ""}`} alt="" />
            </button>
          </div>
          {showSideQuest && <SideQuest user={user} />}
        </section>
      </div>
    </main>
  );
}
