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
import GithubRepoCard from "./DashBoard/GithubRepoCard";
import { useNavigate } from "react-router-dom";
import { logInfo, logDebug } from "../lib/debug";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]); // stateful goals
  const navigate= useNavigate();
  
  useEffect(() => {
    // Check if there's a token in the URL params (from GitHub auth)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      console.log("Found token in URL parameters");
      // Store the token temporarily for GitHub API calls
      sessionStorage.setItem("github_token", urlToken);
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const fetchProfile = async () => {
      try {
        // First check for token-based auth
        const token = localStorage.getItem("token");
        
        // Create headers based on authentication method
        const headers = {};
        if (token) {
          headers["x-auth-token"] = token;
        }

        // For session auth, we need to include credentials
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: headers,
          credentials: 'include', // Important for session-based auth
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.errors?.[0]?.msg || "Failed to load profile");
        
        // Log profile data
        logInfo("Loaded profile data");
        
        // Use DevSync activity data or initialize empty array
        if (!data.activity || !Array.isArray(data.activity)) {
          data.activity = [];
        }

        setProfile(data);
        setGoals(data.goals || []);
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
            <ProfileCard 
              user={profile} 
              className="col-span-1" 
              onSyncGithub={async () => {
                try {
                  // Just display message that GitHub sync is temporarily disabled
                  alert('GitHub sync is temporarily disabled in the backend server.');
                  console.log('GitHub sync is disabled - backend route is commented out');
                  
                  // Just refresh the profile without GitHub sync
          const headers = {};
          const token = localStorage.getItem("token");
          if (token) {
            headers["x-auth-token"] = token;
          }
          
          const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
            headers: headers,
            credentials: 'include'
          });
          
          if (profileRes.ok) {
            const updatedProfile = await profileRes.json();
            setProfile(updatedProfile);
          }
        } catch (err) {
          console.error('Error:', err);
        }
      }}
      syncingGithub={false}
    />
    <PlatformLinks platforms={profile?.platforms || []} className="col-span-1" />
    <StreakCard streak={profile?.streak || 0} className="col-span-1" />

    {/* Row 2: Goals, Time Spent, Notes */}
    <GoalsCard goals={goals} onGoalsChange={setGoals} />
    <TimeSpentCard time={profile?.timeSpent || "0 minutes"} />
    {/* Add NotesCard here */}
    <NotesCard notes={profile?.notes || []} onNotesChange={(n) => setProfile({ ...profile, notes: n })} />

    {/* Row 3: Activity heatmap with static data (no GitHub sync) */}
    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
      <ActivityHeatmap />
    </div>
    
    {/* Row 4: GitHub repositories - only show if we have repository data */}
    {profile?.repositories && profile.repositories.length > 0 && (
      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <GithubRepoCard repositories={profile.repositories || []} />
      </div>
    )}
  </div>
</main>
      </div>
    </div>
  );
}
