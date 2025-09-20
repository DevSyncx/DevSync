// Components/GitHubProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/button";

const GitHubProfile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (!username) return;

      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/github/${username}`);
        const json = await res.json();

        if (res.ok) {
          setData(json);
        } else {
          setError(json.error || "Failed to fetch GitHub data");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const { profile, topRepos, contributions, languages } = data;

  const renderHeatmap = () => (
    <div className="flex space-x-0.5 overflow-x-auto py-2">
      {contributions.weeks.map((week, wIdx) => (
        <div key={wIdx} className="flex flex-col space-y-0.5">
          {week.contributionDays.map((day, dIdx) => (
            <div
              key={dIdx}
              title={`${day.date}: ${day.contributionCount} contributions`}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: day.color || "#ebedf0" }}
            />
          ))}
        </div>
      ))}
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-2">
      {Object.entries(languages).map(([lang, count], idx) => (
        <div key={idx}>
          <p className="text-sm font-medium">
            {lang} ({count})
          </p>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="h-2 rounded bg-yellow-400"
              style={{
                width: `${
                  (count / Math.max(...Object.values(languages))) * 100
                }%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl}
            alt={profile.login}
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">@{profile.login}</p>
            <p>{profile.bio}</p>
            <p className="text-sm text-gray-500">
              Followers: {profile.followers} • Following: {profile.following}
            </p>
            <p className="text-sm text-gray-500">
              Total Contributions: {contributions.totalContributions} • Commits:{" "}
              {contributions.totalCommits}
            </p>
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on GitHub
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Top Repos Section */}
      <Card>
        <CardHeader>
          <CardTitle>Top Repositories</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {topRepos.map((repo, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {repo.name}
                </a>
              </h3>
              <p className="text-sm text-gray-600">
                {repo.description || "No description"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ⭐ {repo.stars} | 🍴 {repo.forks} | {repo.language || "Unknown"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contributions Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution Heatmap</CardTitle>
        </CardHeader>
        <CardContent>{renderHeatmap()}</CardContent>
      </Card>

      {/* Languages Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Languages Used</CardTitle>
        </CardHeader>
        <CardContent>{renderLanguages()}</CardContent>
      </Card>

      <Link to="/dashboard">
        <Button variant="secondary">Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default GitHubProfile;
