import { useQuery } from "react-query";
import { getUserStats } from "../Query/stats";
import { generateTitleAndLevel } from "../utils";

const useGetStats = (uid: string) => {
  return useQuery({
    queryKey: ["UserStats", uid],
    queryFn: () => getUserStats(uid),
  });
};

export default function Stats({ user }: any) {
  const { data: stats, isLoading } = useGetStats(user.uid);
  if (isLoading) return "Loading...";

  const title = generateTitleAndLevel(stats?.data && stats?.data!.exp)
  return (
    <main className="app-container pt-28 pb-8">
      <div className="max-w-lg mx-auto card text-center">
        <div className="h-[200px] w-[200px] mx-auto mb-4">
          <img src={`./stats/${title.level}.png`} alt="" className="pointer-events-none" />
        </div>
        <div>
          <h1 className="font-semibold text-xl">Title: <span className="font-medium">{title.title}</span></h1>
          <h2 className="font-semibold text-lg">Level: <span className="font-medium">{title.level}</span></h2>
          <h2 className="font-semibold text-lg">Exp: <span className="font-medium">{stats?.data && stats?.data!.exp}</span></h2>
          <p className="font-normal text-lg">Current Streak: {stats?.data && stats?.data!.streakCount}</p>
          <p className="font-normal text-lg">Max Streak: {stats?.data && stats?.data!.maxStreak}</p>
        </div>
      </div>
    </main>
  );
}
