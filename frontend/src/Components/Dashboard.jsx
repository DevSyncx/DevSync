import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./DashBoard/Sidebar";
import Topbar from "./DashBoard/Topbar";
import ProfileCard from "./DashBoard/ProfileCard";
import PlatformLinks from "./DashBoard/PlatformLinks";
import StreakCard from "./DashBoard/StreakCard";
import GoalsCard from "./DashBoard/GoalsCard";
import TimeSpentCard from "./DashBoard/TimeSpentCard";
import ActivityHeatmap from "./DashBoard/ActivityHeatMap";
import NotesCard from "./DashBoard/NotesCard";
import GitHubCard from "@/Components/GitHubCard";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Capture OAuth token from URL
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    if (oauthToken) {
      localStorage.setItem("token", oauthToken);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

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
        if (!res.ok) {
          throw new Error(data.errors?.[0]?.msg || "Failed to load profile");
        }

        setProfile(data || {});
        setGoals(data.goals || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p>No profile data available. Please try logging in again.</p>
      </div>
    );
  }

  // Safely destructure profile with defaults
  const {
    socialLinks = {},
    streak = 0,
    githubUsername = null,
    timeSpent = "0 minutes",
    activity = [],
    notes = []
  } = profile;

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-[#d1e4f3]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {/* Row 1 */}
            <ProfileCard user={profile} className="col-span-1" />
            <PlatformLinks platforms={socialLinks} className="col-span-1" />
            <StreakCard streak={streak} className="col-span-1" />

            {/* GitHub Card */}
            {githubUsername ? (
              <GitHubCard githubUsername={githubUsername} className="col-span-1" />
            ) : (
              <div className="col-span-1 p-4 border rounded-lg shadow-sm bg-gray-100 text-gray-500 flex items-center justify-center">
                GitHub profile not linked
              </div>
            )}

            {/* Row 2: Goals, Time Spent, Notes */}
            <GoalsCard goals={goals} onGoalsChange={setGoals} />
            <TimeSpentCard time={timeSpent} />
            <NotesCard
              notes={notes}
              onNotesChange={(updatedNotes) =>
                setProfile({ ...profile, notes: updatedNotes })
              }
            />

            {/* Row 3: Activity heatmap full width */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <ActivityHeatmap activityData={activity} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}