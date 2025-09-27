import React, { useState, useEffect } from "react";
import Sidebar from "./DashBoard/Sidebar";
import Topbar from "./DashBoard/Topbar";
import ProfileCard from "./DashBoard/ProfileCard";
import PlatformLinks from "./DashBoard/PlatformLinks";
import StreakCard from "./DashBoard/StreakCard";
import GoalsCard from "./DashBoard/GoalsCard";
import TimeSpentCard from "./DashBoard/TimeSpentCard";
import ActivityHeatmap from "./DashBoard/ActivityHeatMap";
import NotesCard from "./DashBoard/NotesCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]); // stateful goals
  const navigate= useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          setLoading(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { "x-auth-token": token },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.msg || "Failed to load profile");

        setProfile(data);
        setGoals(data.goals || []);   // ✅ sync backend goals into state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col h-screen">
      <Topbar />

      <div className="flex flex-1">
        <Sidebar />
<main className="flex-1 p-6 bg-[#d1e4f3]">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">

    {/* Row 1 */}
    <ProfileCard user={profile} className="col-span-1" />
    <PlatformLinks platforms={profile.socialLinks || []} className="col-span-1" />
    <StreakCard streak={profile.streak || 0} className="col-span-1" />

    {/* Row 2: Goals, Time Spent, Notes */}
    <GoalsCard goals={goals} onGoalsChange={setGoals} />
    <TimeSpentCard time={profile.timeSpent || "0 minutes"} />
    {/* Add NotesCard here */}
    <NotesCard notes={profile.notes || []} onNotesChange={(n) => setProfile({ ...profile, notes: n })} />

    {/* Row 3: Activity heatmap full width */}
    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
      <ActivityHeatmap activityData={profile.activity || []} />
    </div>
  </div>
</main>
      </div>
    </div>
  );
}
