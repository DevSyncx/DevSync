import React, { useState, useEffect } from "react";
import Sidebar from "./DashBoard/Sidebar";
import Topbar from "./DashBoard/Topbar";
import ProfileCard from "./DashBoard/ProfileCard";
import PlatformLinks from "./DashBoard/PlatformLinks";
import StreakCard from "./DashBoard/StreakCard";
import GoalsCard from "./DashBoard/GoalsCard";
import TimeSpentCard from "./DashBoard/TimeSpentCard";
import ActivityHeatmap from "./DashBoard/ActivityHeatMap";
import FeedbackController from "./feedback/FeedbackController";
import { useNavigate } from "react-router-dom";
import { Card } from "@/Components/ui/Card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { useFeedback } from "@/context/FeedbackContext";
import TotalProblemsCard from "./DashBoard/NotesCard";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { openFeedbackPopup } = useFeedback();

  const getAuthToken = () => localStorage.getItem("token");

  const fetchProfile = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { "x-auth-token": token },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errors?.[0]?.msg || "Failed to load profile");

      setProfile(data);
      setGoals(data.goals || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const [streak, setStreak] = useState(0);

//for heatmap activity streak calculation
useEffect(() => {
  if (profile?.activity?.length) {
    setStreak(calculateStreak(profile.activity));
  } else {
    setStreak(0);
  }
}, [profile?.activity]);

// Handle OAuth token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    if (oauthToken) {
      try {
        localStorage.setItem("token", oauthToken);
      } catch (e) {
        console.error("Failed to persist OAuth token:", e);
      }
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
 fetchProfile();
}, [navigate]);

  // --- Handlers for real-time updates ---
  const handleGoalsChange = async (updatedGoals) => {
    setGoals(updatedGoals);
    try {
      const token = getAuthToken();
      await fetch(`${import.meta.env.VITE_API_URL}/api/profile/goals`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ goals: updatedGoals }),
      });
    } catch (err) {
      console.error("Error updating goals:", err);
    }
  };

  const handleNotesChange = async (updatedNotes) => {
    setProfile((prev) => ({ ...prev, notes: updatedNotes }));
    try {
      const token = getAuthToken();
      await fetch(`${import.meta.env.VITE_API_URL}/api/profile/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ notes: updatedNotes }),
      });
    } catch (err) {
      console.error("Error updating notes:", err);
    }
  };

// Calculate the user's current streak of activity
const calculateStreak = (activityDates) => {
  if (!Array.isArray(activityDates) || activityDates.length === 0) return 0;

  // Filter out invalid or falsy dates
  const validDates = activityDates
    .map((d) => {
      const date = new Date(d);
      return isNaN(date) ? null : date;
    })
    .filter(Boolean);

  if (validDates.length === 0) return 0;

  // Sort valid dates ascending
  const sorted = validDates.sort((a, b) => a - b);

  const today = new Date();
  const lastActivity = sorted[sorted.length - 1];

  // Normalize to remove time zone drift
  const diffDays = Math.floor(
    (today.setHours(0, 0, 0, 0) - lastActivity.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );

  // Missed a day → reset
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    const current = sorted[i];
    const prev = sorted[i - 1];
    const gap =
      (current.setHours(0, 0, 0, 0) - prev.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24);
    if (gap === 1) streak++;
    else if (gap > 1) break;
  }

  return streak;
};



  const handleTimeUpdate = async (newTime) => {
    setProfile((prev) => ({ ...prev, timeSpent: newTime }));
    try {
      const token = getAuthToken();
      await fetch(`${import.meta.env.VITE_API_URL}/api/profile/time`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ timeSpent: newTime }),
      });
    } catch (err) {
      console.error("Error updating time spent:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-6">
        <Alert variant="destructive" className="max-w-md w-full shadow-lg">
          <AlertTitle>Failed to Load Dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-shadow shadow-md"
          >
            Try Again
          </button>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-background p-6">
        <Card className="p-6 text-center shadow-lg border border-border">
          <p>No profile data available. Please try logging in again.</p>
        </Card>
      </div>
    );
  }

  const {
    socialLinks = {},
    timeSpent = "0 minutes",
    activity = [],
    notes = [],
  } = profile;

  return (
 
      <div className="flex flex-col h-screen bg-background text-foreground">
      <Topbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <ScrollArea className="flex-1 h-full p-4 sm:p-6 bg-muted/30 z-0">
          {/* Add FeedbackController with the user profile */}
          <FeedbackController user={profile} />
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 auto-rows-max">
            {/* Row 1 */}
            <ProfileCard user={profile} className="col-span-1" />
            <PlatformLinks platforms={socialLinks} className="col-span-1" />
            <StreakCard streak={streak} activity={activity} className="col-span-1" />

            {/* Row 2 */}
            <GoalsCard goals={goals} onGoalsChange={handleGoalsChange} />
            <TimeSpentCard time={timeSpent} onTimeUpdate={handleTimeUpdate} />
            <TotalProblemsCard profileData={profile} />

            {/* Row 3: Heatmap full width */}
            <div className="col-span-full">
              <ActivityHeatmap
                activityData={activity}
                onAddActivity={async (day) => {
                  try {
                    const token = getAuthToken();
                    const res = await fetch(
                      `${import.meta.env.VITE_API_URL}/api/profile/activity`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          "x-auth-token": token,
                        },
                        body: JSON.stringify({ date: day }),
                      }
                    );
                    if (res.ok) {
                      setProfile((prev) => ({
                        ...prev,
                        activity: [...prev.activity, day],
                      }));
                    }
                  } catch (err) {
                    console.error("Failed to add activity:", err);
                  }
                }}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
