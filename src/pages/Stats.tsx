import { useQuery } from "react-query";
import { getUserStats } from "../Query/stats";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { generateTitleAndLevel } from "../utils";

const useGetStats = (uid: string) => {
  return useQuery({
    queryKey: ["UserStats", uid],
    queryFn: () => getUserStats(uid),
  });
};

export default function Stats() {
  const [user, setUser] = useState({ email: "", uid: "", displayName: "" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // setUser(user?.displayName || user?.email || "");
      setUser({
        displayName: user?.displayName ?? "",
        uid: user?.uid ?? "",
        email: user?.email ?? "",
      });
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);
  const { data: stats, isLoading } = useGetStats(user.uid);
  if (isLoading || loading) return "Loading...";

  const title = generateTitleAndLevel(stats?.data && stats?.data!.exp)
  return (
    <main className="p-4 md:p-8 xl:py-16">
      <div>
        <h1 className="font-bold text-2xl mb-4">Stats</h1>
      </div>
      <hr />
      <div className="mt-2">
        <h1 className="font-semibold text-lg">
          Level: <span>{title.level}</span>
        </h1>
        <h1 className="font-semibold text-lg">
          EXP: <span>{stats?.data && stats?.data!.exp}</span>
        </h1>
        <h1 className="font-semibold text-lg">
          Title: <span>{title.title}</span>
        </h1>
      </div>
    </main>
  );
}
