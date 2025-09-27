import { SiLeetcode } from "react-icons/si";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LeetCode({ platforms = {} }) {
  const [stats, setStats] = useState(null);
  const { leetUser } = useParams();

  useEffect(() => {
    const fetchStats = async () => {
      if (!leetUser) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/leetcode/${leetUser}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setStats(json.data);
      } catch (e) {
        console.error("LeetCode fetch error:", e);
        setStats(null);
      }
    };
    fetchStats();
  }, [leetUser]);

  if (!stats) return <p>Loading LeetCode data...</p>;

  const {
    username,
    profile,
    badges = [],
    contestRating,
    contestHistory = [],
    recentSubmissions = [],
    submissionCalendar,
  } = stats;

  const calendarData = Object.entries(submissionCalendar).map(([timestamp, count]) => ({
    date: new Date(Number(timestamp) * 1000).toISOString().split("T")[0],
    count: parseInt(count, 10),
  }));

  const startDate = new Date("2025-01-01");
  const endDate = new Date();

  const attendedContests = contestHistory.filter((c) => c.attended);

  const labels = attendedContests.map((c) =>
    new Date(c.contest.startTime).toLocaleDateString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Contest Rating",
        data: attendedContests.map((c) => c.rating),
        borderColor: "#FFA116",
        backgroundColor: "#FFA116",
        fill: false,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#FFA116", font: { size: 12 } } },
      title: {
        display: true,
        text: "LeetCode Contest Rating Over Time",
        color: "#FFA116",
        font: { size: 14 },
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: {
          color: "#FFA116",
          maxRotation: 45,
          minRotation: 45,
          font: { size: 11 },
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: { color: "#444" },
      },
      y: {
        ticks: { color: "#FFA116", font: { size: 11 } },
        grid: { color: "#444" },
        beginAtZero: false,
      },
    },
  };

  const difficultyColor = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 bg-[var(--card)] rounded-lg shadow-lg border border-[var(--border)] mt-20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={profile?.avatar || "/default-avatar.png"}
              alt={`${username || "LeetCode"} avatar`}
              className="w-16 h-16 rounded-full border-4 border-yellow-500"
            />
            <div>
              <h3 className="text-2xl font-semibold text-[#FFA116] flex items-center gap-2 truncate">
                <SiLeetcode size={28} /> {username || "LeetCode"}
              </h3>
              {profile?.ranking && (
                <p className="text-sm text-muted-foreground mt-1">
                  Global Rank: <span className="font-semibold">#{profile.ranking}</span>
                </p>
              )}
              {badges.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {badges.map(({ id, icon, displayName }) => (
                    <img
                      key={id}
                      src={icon && icon.startsWith("https://") ? icon : `https://leetcode.com${icon || ''}`}
                      alt={displayName}
                      title={displayName}
                      className="w-6 h-6 rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <a
            href={`https://leetcode.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FFA116] text-black px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition"
          >
            View on LeetCode
          </a>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Problems Solved</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {stats.submitStatsGlobal?.map(({ difficulty, count }) => (
                <div key={difficulty}>
                  <p className="text-sm capitalize text-muted-foreground">{difficulty}</p>
                  <p className={`text-2xl font-bold ${difficultyColor[difficulty] || ""}`}>{count}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Recent Submissions</h3>
            {recentSubmissions.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground max-h-[130px] overflow-y-auto">
                {recentSubmissions.slice(0, 3).map(({ id, title, timestamp }) => (
                  <li key={id} className="flex justify-between whitespace-nowrap">
                    <span className="truncate">{title}</span>
                    <span className="ml-3 text-xs">{new Date(timestamp).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No recent activity found.</p>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Submission Heatmap</h3>
            <ReactCalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={calendarData}
              showWeekdayLabels={false}
              classForValue={(value) => {
                if (!value) return "fill-inherit";
                if (value.count >= 10) return "fill-green-500";
                if (value.count >= 5) return "fill-green-400";
                return "fill-green-300";
              }}
              tooltipDataAttrs={(value) => ({
                "data-tip": value ? `Submissions: ${value.count}` : "No submissions",
              })}
            />
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Contest Stats</h3>
            {contestRating?.badge && (

              <div className="flex items-center gap-3 mb-3 text-muted-foreground flex-wrap">
                { contestRating.badge.icon != "/default_icon.png"  && <img
                  src={"https://leetcode.com" + contestRating.badge.icon}
                  alt={contestRating.badge.name}
                  title={contestRating.badge.name}
                  className="w-5 h-5"
                />}
                <span>{contestRating.badge.name}</span>
                {contestRating.badge.expired && <span className="text-red-400">(Expired)</span>}
              </div>
            )}

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Contests: {contestRating?.attendedContestsCount ?? "N/A"}</p>
              <p>Rating: {contestRating?.rating ?? "N/A"}</p>
              <p>Rank: {contestRating?.globalRanking ? `#${contestRating.globalRanking}` : "N/A"}</p>
              <p>
                Top %:{" "}
                {contestRating?.topPercentage ? `${contestRating.topPercentage.toFixed(2)}%` : "N/A"}
              </p>
            </div>
          </div>
        </section>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Contest Rating History</h3>
          {attendedContests.length > 0 ? (
            <div className="relative w-full h-[250px]">
              <Line data={data} options={options} />
            </div>
          ) : (
            <div className="w-full h-24 bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-400">
              📊 No attended contests to show.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
