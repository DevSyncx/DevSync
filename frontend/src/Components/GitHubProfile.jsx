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
      if (!username) {
        setError("No GitHub username provided");
        setLoading(false);
        return;
      }

      const normalizedUsername = username.split("/").pop();

      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(
          `${backendUrl}/api/github/${normalizedUsername}`
        );
        const json = await res.json();

        if (res.ok) setData(json);
        else setError(json.error || "Failed to fetch GitHub data");
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

  const {
    profile = {},
    topRepos = [],
    contributions = { weeks: [], totalContributions: 0, totalCommits: 0 },
    languages = {},
  } = data || {};

  const renderHeatmap = () => {
    if (!contributions?.weeks?.length)
      return <p className="text-gray-500">No contribution data available.</p>;

    return (
      <div className="flex space-x-0.5 overflow-x-auto py-2">
        {contributions.weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col space-y-0.5">
            {week?.contributionDays?.map((day, dIdx) => (
              <div
                key={dIdx}
                title={`${day?.date || "N/A"}: ${
                  day?.contributionCount ?? 0
                } contributions`}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: day?.color || "#ebedf0" }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderLanguages = () => {
    const langKeys = Object.keys(languages);
    if (!langKeys.length)
      return <p className="text-gray-500">No language data available.</p>;
    const totalSize = Object.values(languages).reduce(
      (sum, val) => sum + val,
      0
    );

    return (
      <div className="space-y-2">
        {langKeys
          .sort((a, b) => languages[b] - languages[a])
          .map((lang, idx) => {
            const size = languages[lang];
            const percentage = totalSize
              ? ((size / totalSize) * 100).toFixed(1)
              : 0;
            return (
              <div key={idx}>
                <p className="text-sm font-medium">
                  {lang} ({percentage}%)
                </p>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="h-2 rounded bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GitHub Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <img
            src={profile.avatarUrl || ""}
            alt={profile.login || "avatar"}
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-bold">
              {profile.name || profile.login || "N/A"}
            </h2>
            <p className="text-gray-600">@{profile.login || "N/A"}</p>
            <p>{profile.bio || "No bio available"}</p>
            <p className="text-sm text-gray-500">
              Followers: {profile.followers ?? 0} • Following:{" "}
              {profile.following ?? 0}
            </p>
            <p className="text-sm text-gray-500">
              Total Contributions: {contributions.totalContributions ?? 0} •
              Commits: {contributions.totalCommits ?? 0}
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

      <Card>
        <CardHeader>
          <CardTitle>Top Repositories</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {topRepos.length === 0 && (
            <p className="text-gray-500">No repositories available.</p>
          )}
          {topRepos.map((repo, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold">
                <a
                  href={repo.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {repo.name || "N/A"}
                </a>
              </h3>
              <p className="text-sm text-gray-600">
                {repo.description || "No description"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ⭐ {repo.stars ?? 0} | 🍴 {repo.forks ?? 0}
              </p>
              {repo.languages?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {repo.languages.map((l) => l.name).join(", ")}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contribution Heatmap</CardTitle>
        </CardHeader>
        <CardContent>{renderHeatmap()}</CardContent>
      </Card>

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
