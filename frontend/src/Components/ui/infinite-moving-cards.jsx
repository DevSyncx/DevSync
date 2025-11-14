"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const clone = item.cloneNode(true);
        scrollerRef.current.appendChild(clone);
      });

      setScrollProperties();
      setStart(true);
    }
  }

  const setScrollProperties = () => {
    if (!containerRef.current) return;

    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );

    const duration =
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
    containerRef.current.style.setProperty("--animation-duration", duration);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={`${item.name}-${idx}`}
            className="relative w-[240px] shrink-0 rounded-2xl 
                       bg-[#111827] border border-[rgba(80,120,255,0.3)]
                       shadow-[0_0_20px_rgba(80,120,255,0.08)]
                       hover:shadow-[0_0_25px_rgba(80,120,255,0.15)]
                       transition-all duration-500 hover:scale-105
                       flex flex-col items-center justify-center p-5"
          >
            {/* Avatar */}
            {item.avatar && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-20 h-20 rounded-full border border-[rgba(80,120,255,0.3)] object-cover mb-3"
                />
              </a>
            )}

            {/* Name */}
            <p className="text-lg font-semibold text-white">{item.name}</p>

            {/* Contributions */}
            <p className="text-sm text-gray-400">{item.quote}</p>

            {/* Title / Role */}
            {item.title && (
              <p className="text-xs text-gray-500 mt-1">{item.title}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
