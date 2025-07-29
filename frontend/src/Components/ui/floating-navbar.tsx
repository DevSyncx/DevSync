// src/Components/ui/floating-navbar.tsx
"use client";
import React, { JSX, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Props interface for the FloatingNav component.
 * 'link' is optional, and 'onClick' is added for custom navigation.
 */
interface NavItem {
  name: string;
  link?: string; // Optional: for external links or when no custom click handler
  icon?: JSX.Element;
  onClick?: () => void; // Optional: for internal, state-based navigation
}

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[]; // Use the defined interface
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  // Hook to listen to scroll progress changes and control visibility.
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      // Hide if at the very top, otherwise control visibility based on scroll direction.
      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) { // Scrolling up
          setVisible(true);
        } else { // Scrolling down
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: NavItem, idx: number) => (
          // Conditionally render a button if an onClick handler is provided (for internal navigation),
          // otherwise render an anchor tag (for external links or default behavior).
          navItem.onClick ? (
            <button
              key={`button-${idx}`} // Unique key for button
              onClick={navItem.onClick}
              className={cn(
                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 bg-transparent border-none cursor-pointer p-0" // Added p-0 for consistent styling
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </button>
          ) : (
            <a
              key={`link-${idx}`} // Unique key for anchor
              href={navItem.link}
              // If it's an external link, ensure it opens in a new tab.
              {...(navItem.link && navItem.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={cn(
                "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </a>
          )
        ))}
        {/* Login button - remains as is */}
        <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
