"use client";

import React from "react";

import { Users2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "./ui/tracing-beam";


const aboutPoints = [
  {
    badge: "Unified Dashboard",
    title: "Track GitHub, LeetCode, Codeforces, and more — all from one place.",
    description: "No more switching tabs. DevSync aggregates your coding life and shows your productivity stats clearly and beautifully.",
  },
  {
    badge: "Focus Tools",
    title: "Built-in Pomodoro Timer and Focus Logs.",
    description: "Boost your deep work sessions with built-in timers and log how you spend your dev time efficiently.",
  },
  {
    badge: "Personal Insights",
    title: "See your coding journey evolve in real time.",
    description: "Visualize your habits, identify patterns, and reflect on your growth as a developer.",
  },
  {
    badge: "Zero Context Switching",
    title: "Everything you need, where you need it.",
    description: "From open-source activity to interview prep stats — DevSync keeps you focused and synced.",
  },
];

const About = () => {
  return (
    <section id ="about "className="w-full mt-24 px-4">
      <TracingBeam className="px-4 md:px-10">
        <div className="max-w-3xl mx-auto antialiased pt-4 relative">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-10">
              <Users2 style={{ color: "var(--primary)" }} className="w-6 h-6" />
              <h2 className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>About DevSync</h2>
          </div>

          {/* Tracing Points */}
          {aboutPoints.map((item, index) => (
            <div key={index} className="mb-12">
              <span className="bg-black text-white rounded-full text-xs px-3 py-1 mb-3 inline-block tracking-wider uppercase">
                  {item.badge}
              </span>

              <p className={twMerge("text-xl font-semibold mb-2")} style={{ color: "var(--foreground)" }}>
                {item.title}
              </p>

              <p className="text-sm leading-relaxed prose" style={{ color: "var(--muted-foreground)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </TracingBeam>
    </section>
  );
};

export default About;
