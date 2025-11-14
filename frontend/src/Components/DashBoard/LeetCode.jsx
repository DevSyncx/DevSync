"use client";
import { motion, AnimatePresence } from "framer-motion";
import { SiLeetcode } from "react-icons/si";
import React,{ useEffect, useState, useRef, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltipJS,
  Legend,
} from "chart.js";

import { Link, useParams } from "react-router-dom";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import BackButton from "../ui/backbutton";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
   RadialBarChart,
  RadialBar,
   BarChart, Bar, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/Card";
import {
  ChartContainer,
  ChartTooltip,
} from "@/Components/ui/chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltipJS,
  Legend
);

export default function LeetCode({ platforms = {} }) {
  const [stats, setStats] = useState(null);
  const { leetUser } = useParams();

  useEffect(() => {
    const fetchStats = async () => {
      if (!leetUser) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/profile/leetcode/${leetUser}`,
          {
            method: "Get",
            headers: { "Content-Type": "application/json" },
          }
        );
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

  const attendedContests = contestHistory.filter((c) => c.attended);

  const rechartsData = attendedContests.map((c) => ({
    contestName: c.contest?.title || c.title || "Contest",
    date: c.contest?.startTime
      ? new Date(c.contest.startTime).toISOString().split("T")[0]
      : "Unknown",
    rating: Math.round(c.rating || 0),
  }));

  const difficultyColor = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  return (
    <>
    <Link to="/dashboard" ><BackButton /></Link>
      
      <div className="w-full min-h-screen p-10 bg-[var(--background)] rounded-lg shadow-lg border border-[var(--border)] space-y-6">
        {/* Profile Header */}
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
                      src={
                        icon && icon.startsWith("https://")
                          ? icon
                          : `https://leetcode.com${icon || ""}`
                      }
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
            className="bg-[var(--primary)] text-[var(--foreground)] px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition cursor-pointer"
          >
            View on LeetCode
          </a>
        </div>

        {/* Problems + Submissions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProblemsSolvedCard stats={stats} />


          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">
              Recent Submissions
            </h3>
            {recentSubmissions.length > 0 ? (
              <ul className="space-y-2 text-sm text-muted-foreground max-h-[130px] overflow-y-auto">
                {recentSubmissions.slice(0, 3).map(({ id, title, timestamp }) => (
                  <li key={id} className="flex justify-between whitespace-nowrap">
                    <span className="truncate">{title}</span>
                    <span className="ml-3 text-xs">
                      {new Date(timestamp).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                No recent activity found.
              </p>
            )}
          </div>
        </section>

        {/* Heatmap + Contest Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EnhancedHeatmap submissionCalendar={submissionCalendar} />
           <ContestStatsCard contestRating={contestRating} />

        </section>

        <ContestRatingHistory attendedContests={attendedContests} data={rechartsData} />
      </div>
    </>
  );
}
// 📊 ContestStatsCard component
function ContestStatsCard({ contestRating }) {
  const topPercentage = contestRating?.topPercentage
    ? parseFloat(contestRating.topPercentage.toFixed(2))
    : 0;

  const topPercentageData = [
    { name: "Top %", value: topPercentage },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] text-sm px-3 py-1.5 rounded-md shadow-lg">
          <p>
            Top %: <span className="font-semibold">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm transform transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-lg hover:border-[var(--primary)] cursor-pointer">
      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">
        Contest Stats
      </h3>

      {/* 🏅 Badge Section */}
      {contestRating?.badge && (
        <div className="flex items-center gap-3 mb-4 text-muted-foreground flex-wrap">
          {contestRating.badge.icon !== "/default_icon.png" && (
            <img
              src={"https://leetcode.com" + contestRating.badge.icon}
              alt={contestRating.badge.name}
              title={contestRating.badge.name}
              className="w-6 h-6"
            />
          )}
          <span className="font-medium">{contestRating.badge.name}</span>
          {contestRating.badge.expired && (
            <span className="text-red-400 text-sm">(Expired)</span>
          )}
        </div>
      )}

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {/* Contests */}
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-md p-3 hover:shadow-md transition">
          <p className="text-xs text-muted-foreground">Contests</p>
          <p className="text-lg font-semibold text-[var(--primary)] mt-1">
            {contestRating?.attendedContestsCount ?? "N/A"}
          </p>
        </div>

        {/* Rating */}
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-md p-3 hover:shadow-md transition">
          <p className="text-xs text-muted-foreground">Rating</p>
          <p className="text-lg font-semibold text-[var(--primary)] mt-1">
            {Math.round(contestRating?.rating ?? 0)}
          </p>
        </div>

        {/* Rank */}
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-md p-3 hover:shadow-md transition">
          <p className="text-xs text-muted-foreground">Rank</p>
          <p className="text-lg font-semibold text-[var(--primary)] mt-1">
            {contestRating?.globalRanking
              ? `#${contestRating.globalRanking}`
              : "N/A"}
          </p>
        </div>

        {/* Top % Vertical Bar */}
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-md p-3 hover:shadow-md transition flex flex-col justify-between">
          <p className="text-xs text-muted-foreground mb-1">Top %</p>

          <div className="flex items-end justify-center h-24">
            <ResponsiveContainer width="40%" height="100%">
              <BarChart data={topPercentageData}>
                <XAxis dataKey="name" hide />
                <YAxis type="number" domain={[0, 100]} hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                <Bar
                  dataKey="value"
                  fill="url(#colorBar)"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  animationDuration={1200}
                />
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm font-semibold text-[var(--primary)] text-center mt-2">
            {topPercentage ? `${topPercentage.toFixed(2)}%` : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ✅ EnhancedHeatmap Component (integrated inline) */
function EnhancedHeatmap({ submissionCalendar }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, date: "", count: 0 });
  const heatmapRef = useRef(null);

  const startDate = new Date(`${selectedYear}-01-01`);
  const endDate = new Date(`${selectedYear}-12-31`);

  // ✅ Process calendar data year-wise
  const calendarData = useMemo(() => {
    if (!submissionCalendar) return [];
    return Object.entries(submissionCalendar)
      .map(([timestamp, count]) => {
        const date = new Date(Number(timestamp) * 1000);
        if (date.getFullYear() === selectedYear) {
          return {
            date: date.toISOString().split("T")[0],
            count: parseInt(count, 10),
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [submissionCalendar, selectedYear]);

  const totalSubmissions = calendarData.reduce((sum, d) => sum + d.count, 0);

  const availableYears = [
    ...new Set(
      Object.keys(submissionCalendar || {}).map(
        (ts) => new Date(Number(ts) * 1000).getFullYear()
      )
    ),
  ].sort((a, b) => b - a);

  // ✅ Attach hover listeners directly to rects after rendering
  useEffect(() => {
    const container = heatmapRef.current;
    if (!container) return;

    const rects = container.querySelectorAll("rect[data-date]");
    rects.forEach((rect) => {
      rect.style.cursor = "pointer";
      rect.addEventListener("mouseenter", (e) => {
        const date = rect.getAttribute("data-date");
        const count = rect.getAttribute("data-count") || 0;
        const rectBox = rect.getBoundingClientRect();
        const containerBox = container.getBoundingClientRect();

        setTooltip({
          visible: true,
          x: rectBox.left - containerBox.left + rectBox.width / 2,
          y: rectBox.top - containerBox.top,
          date,
          count,
        });
      });

      rect.addEventListener("mouseleave", () => {
        setTooltip((t) => ({ ...t, visible: false }));
      });
    });

    return () => rects.forEach((r) => r.replaceWith(r.cloneNode(true)));
  }, [calendarData]);

  return (
    <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-sm overflow-hidden transform transition-transform transition-shadow duration-200 hover:scale-102 hover:shadow-lg hover:border-[var(--primary)] cursor-pointer">
      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)] flex justify-between items-center">
        Submission Heatmap
        {availableYears.length > 1 && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          >
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-[var(--card)] text-[var(--foreground)]">
                {y}
              </option>
            ))}
          </select>
        )}
      </h3>

      <p className="text-sm text-muted-foreground mb-3">
        📈 Total Submissions in {selectedYear}:{" "}
        <span className="font-semibold text-[var(--primary)]">{totalSubmissions}</span>
      </p>

      <div className="relative" ref={heatmapRef}>
        <ReactCalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={calendarData}
          showWeekdayLabels={false}
          classForValue={(value) => {
            if (!value) return "fill-[var(--bg)]";
            if (value.count >= 30) return "fill-[#15803d]";
            if (value.count >= 10) return "fill-[#16a34a]";
            if (value.count >= 5) return "fill-[#22c55e]";
            if (value.count >= 1) return "fill-[#4ade80]";
            return "fill-[var(--bg)]";
          }}
          transformDayElement={(rect, value, index) =>
            React.cloneElement(rect, {
              "data-date": value?.date,
              "data-count": value?.count ?? 0,
            })
          }
        />

        <AnimatePresence>
          {tooltip.visible && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute z-50 pointer-events-none bg-[var(--popover)] border border-[var(--border)] shadow-lg rounded-lg px-3 py-2 text-xs text-[var(--foreground)] backdrop-blur-sm"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: "translate(-50%, -110%)",
              }}
            >
              <p className="font-semibold text-[var(--primary)]">{tooltip.date}</p>
              <p className="text-[var(--muted-foreground)]">
                {tooltip.count} submission{tooltip.count > 1 ? "s" : ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .react-calendar-heatmap rect {
          cursor: pointer;
          transition: all 0.25s ease;
          rx: 3;
          ry: 3;
        }
        .react-calendar-heatmap rect:hover {
          stroke: var(--primary);
          stroke-width: 2px;
          filter: drop-shadow(0 0 8px var(--primary));
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
/* ✅ ContestRatingHistory with fixed tooltip + integer Y-axis */
function CustomContestTooltip({ contest, position, containerRect }) {
  if (!contest || !position) return null;
  const tooltipWidth = 260;
  const padding = 12;
  let left = position.x - containerRect.left;
  if (left + tooltipWidth / 2 > containerRect.width - padding) {
    left = containerRect.width - padding - tooltipWidth / 2;
  } else if (left - tooltipWidth / 2 < padding) {
    left = tooltipWidth / 2 + padding;
  }
  const top = position.y - containerRect.top - 14;

  return (
    <AnimatePresence>
      <motion.div
        key={contest.contestName}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute z-50 pointer-events-none"
        style={{
          left: left,
          top: top,
          transform: "translate(-50%, -100%)",
          width: tooltipWidth,
        }}
      >
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl p-4 text-sm text-white min-w-[220px] backdrop-blur-md">
          <p className="font-semibold text-[var(--primary)] text-base mb-1 truncate">
            {contest.contestName}
          </p>
          <p className="text-gray-300 mb-1">📅 {contest.date}</p>
          <p>
            ⭐ Rating:{" "}
            <span className="font-bold text-[var(--chart-1)] text-lg">
              {Math.round(contest.rating)}
            </span>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


//contest rating history component
export function ContestRatingHistory({ attendedContests = [], data = [] }) {
  const [activeDot, setActiveDot] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const onDocDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveDot(null);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const makePagePos = (cx, cy) => {
    const container = containerRef.current;
    if (!container) return { x: cx, y: cy };
    const rect = container.getBoundingClientRect();
    return { x: rect.left + cx, y: rect.top + cy, containerRect: rect };
  };

  const handleDotClick = (dotProps) => {
    const { cx, cy, index } = dotProps;
    const pagePos = makePagePos(cx, cy);
    if (activeDot?.index === index) {
      setActiveDot(null);
    } else {
      setActiveDot({
        index,
        contest: data[index],
        position: pagePos,
      });
    }
  };

  const handleDotLeave = (dotProps) => {
    if (activeDot?.index === dotProps.index) setActiveDot(null);
  };

  const chartConfig = { rating: { label: "Rating", color: "var(--chart-1)" } };

  return (
    <Card
      ref={containerRef}
      className="bg-[var(--card)] border border-[var(--border)] shadow-md relative overflow-visible transform transition-transform transition-shadow duration-200 hover:scale-102 hover:shadow-lg hover:border-[var(--primary)] cursor-pointer"
    >
      <CardHeader>
        <CardTitle className="text-[var(--primary)] text-lg">
          Contest Rating History
        </CardTitle>
        <CardDescription>Your progress across contests</CardDescription>
      </CardHeader>

      <CardContent>
        {attendedContests.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  tickFormatter={(v) => v?.slice(5)}
                  fontSize={11}
                  stroke="#aaa"
                />
                <YAxis
                  dataKey="rating"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  fontSize={11}
                  domain={["dataMin - 50", "dataMax + 50"]}
                  stroke="#aaa"
                  tickFormatter={(v) => Math.round(v)}
                />

                <ChartTooltip content={<></>} cursor={false} />

                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="var(--color-rating)"
                  strokeWidth={2.4}
                  dot={(dotProps) => {
                    const isActive = activeDot?.index === dotProps.index;
                    return (
                      <motion.circle
                        key={`dot-${dotProps.index}`}
                        cx={dotProps.cx}
                        cy={dotProps.cy}
                        r={isActive ? 7.5 : 5}
                        fill="var(--color-rating)"
                        stroke="#fff"
                        strokeWidth={1.6}
                        onClick={() => handleDotClick(dotProps)}
                        onMouseLeave={() => handleDotLeave(dotProps)}
                        whileHover={{
                          scale: 1.18,
                          filter:
                            "drop-shadow(0 0 8px var(--color-rating))",
                        }}
                        animate={{
                          filter: isActive
                            ? "drop-shadow(0 0 10px var(--color-rating))"
                            : "none",
                          scale: isActive ? 1.12 : 1,
                        }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="w-full h-24 bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-400">
            📊 No attended contests to show.
          </div>
        )}
      </CardContent>

      {activeDot && (
        <CustomContestTooltip
          contest={activeDot.contest}
          position={activeDot.position}
          containerRect={containerRef.current.getBoundingClientRect()}
        />
      )}

      {attendedContests.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium text-white">
            Trending up overall <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-gray-400 leading-none">
            Click on any dot to view contest details
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

//problem solved card component

function ProblemsSolvedCard({ stats }) {
  const totalSolved =
    stats.submitStatsGlobal?.reduce((sum, s) => sum + s.count, 0) || 0;

  const difficultyColors = {
    easy: "#10B981", // green
    medium: "#FBBF24", // yellow
    hard: "#EF4444", // red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] text-sm px-3 py-1.5 rounded-md shadow-lg">
          <p className="capitalize">{data.difficulty}</p>
          <p>
            Solved: <span className="font-semibold">{data.count}</span>
          </p>
          <p>
            Share:{" "}
            <span className="font-semibold">
              {((data.count / totalSolved) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">
        Problems Solved
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.submitStatsGlobal?.map(({ difficulty, count }) => {
          const percentage = totalSolved
            ? (count / totalSolved) * 100
            : 0;
          const chartData = [
            {
              name: difficulty,
              difficulty,
              count,
              fill: difficultyColors[difficulty.toLowerCase()] || "#8884d8",
              value: percentage,
            },
          ];

          return (
            <div
              key={difficulty}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-md p-4 flex flex-col items-center transform transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-lg hover:border-[var(--primary)] cursor-pointer"
               >

              <p className="capitalize text-sm text-muted-foreground mb-2">
                {difficulty}
              </p>

              <div className="w-24 h-24 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={12}
                    data={chartData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={8}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                  </RadialBarChart>
                </ResponsiveContainer>

                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--primary)]">
                  {count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
