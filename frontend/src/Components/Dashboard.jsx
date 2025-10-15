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
import { Card } from "@/Components/ui/Card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");

  // Combined fetch profile function that supports both token and session auth
  const fetchProfile = async () => {
    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { "x-auth-token": token },
        credentials: 'include', // Support session-based auth
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.errors?.[0]?.msg || "Failed to load profile");

      // Normalize the profile data structure for consistent UI
      const normalizedProfile = {
        ...data,
        avatar: data.avatar || `https://api.dicebear.com/6.x/micah/svg?seed=${data.name || 'user'}`,
        socialLinks: data.socialLinks || {},
        platforms: data.platforms || [],
        activity: data.activity || []
      };

      setProfile(normalizedProfile);
      setGoals(normalizedProfile.goals || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    const githubToken = params.get("github_token");
    
    // Handle token from URL params (for OAuth flows)
    if (oauthToken) {
      try {
        localStorage.setItem("token", oauthToken);
        console.log("OAuth token stored in localStorage");
        
        // Clean up URL after capturing token (avoid keeping token in address bar)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {
        console.error("Failed to persist OAuth token:", e);
      }
    }
    
    // Handle GitHub token separately (for GitHub OAuth flow)
    if (githubToken) {
      try {
        sessionStorage.setItem("github_token", githubToken);
        console.log("GitHub token stored in sessionStorage");
      } catch (e) {
        console.error("Failed to persist GitHub token:", e);
      }
    }

    const fetchAndUpdateProfile = async () => {
      await fetchProfile();

      // After profile is loaded, add today to activity if not present
      if (profile && profile.activity) {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        if (!profile.activity.includes(today)) {
          handleActivityAdd(today);
        }
      }
    };

    fetchAndUpdateProfile();

    fetchAndUpdateProfile();
  }, [navigate]);

  // --- Handlers for real-time updates ---
  const handleGoalsChange = async (updatedGoals) => {
    setGoals(updatedGoals);
    try {
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/profile/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ notes: updatedNotes }),
      });
    } catch (err) {
      console.error("Error updating notes:", err);
    }
  };

  const handleActivityAdd = async (date) => {
    setProfile((prev) => ({ ...prev, activity: [...prev.activity, date] }));
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/profile/activity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-auth-token": token },
        body: JSON.stringify({ date }),
      });
    } catch (err) {
      console.error("Error updating activity:", err);
    }
  };

  const handleTimeUpdate = async (newTime) => {
    setProfile((prev) => ({ ...prev, timeSpent: newTime }));
    try {
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

  // Safely destructure with default values
  const {
    socialLinks = {},
    streak = 0,
    timeSpent = "0 minutes",
    activity = [],
    notes = [],
  } = profile;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ScrollArea className="flex-1 h-full p-4 sm:p-6 bg-muted/30">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 auto-rows-max">
            {/* Row 1 */}
            <ProfileCard user={profile} className="col-span-1" />
            <PlatformLinks platforms={profile?.platforms || profile?.socialLinks || {}} className="col-span-1" />
            <StreakCard streak={streak} className="col-span-1" />

            {/* Row 2 */}
            <GoalsCard goals={goals} onGoalsChange={handleGoalsChange} />
            <TimeSpentCard time={timeSpent} onTimeUpdate={handleTimeUpdate} />
            <NotesCard notes={notes} onNotesChange={handleNotesChange} />

            {/* Row 3: Heatmap full width */}
            <div className="col-span-full">
              <ActivityHeatmap
                activityData={activity}
                onAddActivity={async (day) => {
                  try {
                    const token = localStorage.getItem("token");
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
