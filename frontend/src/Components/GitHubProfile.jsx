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
          import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${backendUrl}/api/github/${normalizedUsername}`
        );
        const json = await res.json();

        if (res.ok) setData(json);
        else setError(json.error || "Failed to fetch GitHub data");
      } catch (err) {
        console.error(err);
        setError("User not found or an error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Loading...
      </p>
    );
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const {
    profile = {},
    topRepos = [],
    contributions = { weeks: [], totalContributions: 0, totalCommits: 0 },
    languages = {},
  } = data || {};

  // Heatmap renderer with dark/light mode colors
  const renderHeatmap = () => {
    if (!contributions?.weeks?.length)
      return (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No contribution data available.
        </p>
      );

    return (
      <div className="flex flex-col items-center">
        <div className="flex space-x-0.5 overflow-x-auto py-2">
          {contributions.weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col space-y-0.5">
              {week?.contributionDays?.map((day, dIdx) => {
                // default fallback color for empty contributions
                const lightModeBg = "#ebedf0"; // light square for light mode
                // const darkModeBg = "#1f2937";
                const color = day?.color || lightModeBg;

                return (
                  <div
                    key={dIdx}
                    title={`${day?.date || "N/A"}: ${
                      day?.contributionCount ?? 0
                    } contributions`}
                    className={`w-3 h-3 rounded-sm
                    ${
                      !day?.contributionCount
                        ? "bg-gray-200 dark:bg-gray-700"
                        : ""
                    }
                  `}
                    style={{
                      backgroundColor: day?.contributionCount
                        ? color
                        : undefined, // use Tailwind classes for empty days
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Languages renderer
  const renderLanguages = () => {
    const langKeys = Object.keys(languages);
    if (!langKeys.length)
      return (
        <p className="text-gray-600 dark:text-gray-400">
          No language data available.
        </p>
      );

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
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {lang} ({percentage}%)
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
                  <div
                    className="h-2 rounded bg-[var(--primary)]"
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
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 space-y-8">
      {/* Profile + Languages side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <img
              src={profile.avatarUrl || ""}
              alt={profile.login || "avatar"}
              className="w-32 h-32 rounded-full border-4 border-[var(--primary)] shadow"
            />
            <h2 className="text-xl font-bold mt-4">
              {profile.name || profile.login || "N/A"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              @{profile.login || "N/A"}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {profile.bio || "No bio available"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Followers: {profile.followers ?? 0} • Following:{" "}
              {profile.following ?? 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Contributions: {contributions.totalContributions ?? 0} •
              Commits: {contributions.totalCommits ?? 0}
            </p>
            <a
              href={`https://github.com/${profile.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block bg-[var(--primary)] text-black px-4 py-2 rounded-lg font-semibold shadow hover:bg-[var(--primary-foreground)] transition"
            >
              View on GitHub
            </a>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <CardHeader>
            <CardTitle>Languages Used</CardTitle>
          </CardHeader>
          <CardContent>{renderLanguages()}</CardContent>
        </Card>
      </div>

      {/* Repositories */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <CardHeader>
          <CardTitle>Top Repositories</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRepos.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              No repositories available.
            </p>
          )}
          {topRepos.map((repo, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
            >
              <h3 className="font-semibold text-[var(--primary)]">
                <a
                  href={repo.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.name || "N/A"}
                </a>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                {repo.description || "No description"}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                stars {repo.stars ?? 0} | fork {repo.forks ?? 0}
              </p>
              {repo.languages?.length > 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                  {repo.languages.map((l) => l.name).join(", ")}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card
        className="shadow-lg rounded-xl p-6
  bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 flex flex-col items-center"
      >
        <CardHeader className="w-full flex justify-center">
          <CardTitle className="text-center">Contribution Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          {contributions?.weeks?.length ? (
            <div className="flex justify-center space-x-1 overflow-x-auto py-2">
              {contributions.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col space-y-1">
                  {week?.contributionDays?.map((day, dIdx) => {
                    const emptyClass = !day?.contributionCount
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "";
                    return (
                      <div
                        key={dIdx}
                        title={`${day?.date || "N/A"}: ${
                          day?.contributionCount ?? 0
                        } contributions`}
                        className={`w-4 h-4 rounded-sm ${emptyClass}`}
                        style={{
                          backgroundColor: day?.contributionCount
                            ? day.color
                            : undefined,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No contribution data available.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <Link to="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default GitHubProfile;