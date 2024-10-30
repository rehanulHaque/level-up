import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import MainQuest from "../components/MainQuest";
import SideQuest from "../components/SideQuest";
import TodayMission from "../components/TodayMission";

export default function Home({ user }: any) {
  const [showMainQuest, setShowMainQuest] = useState(false);
  const [showSideQuest, setShowSideQuest] = useState(false);
  const [showTodayMission, setShowTodayMission] = useState(true);

  return (
    <main className="p-4 md:p-8 xl:py-16">
      <div className="flex justify-between mb-2">
        <div className="flex gap-2 items-center">
          <h1 className="text-3xl font-bold">{user.displayName}</h1>
          <img src="./fire_gif.gif" alt="" className="h-8 w-8" />
        </div>
        <div className="hidden md:block lg:block">
          <Button size={"sm"}>
            <Link to="/stats">Stats</Link>
          </Button>
        </div>
      </div>
      <hr />
      <div className="mt-4 md:mt-8">
        <h3 className="font-semibold text-xl flex gap-2 items-center my-4">
          <button
            className="p-2 bg-gray-100 rounded-full"
            onClick={() => setShowMainQuest(!showMainQuest)}
          >
            <img
              src="./arrow_down.svg"
              className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-200 ${
                showMainQuest ? "rotate-90" : ""
              }`}
              alt=""
            />
          </button>
          Main Quest
        </h3>
        {showMainQuest && <MainQuest user={user} />}
      </div>
      <hr />
      <div>
        <h3 className="font-semibold text-xl flex gap-2 items-center my-4">
          <button
            className="p-2 bg-gray-100 rounded-full"
            onClick={() => setShowSideQuest(!showSideQuest)}
          >
            <img
              src="./arrow_down.svg"
              className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-200 ${
                showSideQuest ? "rotate-90" : ""
              }`}
              alt=""
            />
          </button>
          Side Quest
        </h3>
        {showSideQuest && <SideQuest user={user} />}
      </div>
      <hr />
      <div>
        <h3 className="font-semibold text-xl flex gap-2 items-center my-4">
          <button
            className="p-2 bg-gray-100 rounded-full"
            onClick={() => setShowTodayMission(!showTodayMission)}
          >
            <img
              src="./arrow_down.svg"
              className={`h-4 w-4 md:h-5 md:w-5 transition-all duration-200 ${
                showTodayMission ? "rotate-90" : ""
              }`}
              alt=""
            />
          </button>
          Today's Mission
        </h3>
        {showTodayMission && <TodayMission user={user} />}
      </div>
    </main>
  );
}
