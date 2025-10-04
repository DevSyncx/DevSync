import { motion, useScroll } from "motion/react";

import { cn } from "@/lib/utils"

export function ScrollProgress({
  className,
  ref,
  ...props
}) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-[#7cd3f8] via-[#443a8a] to-[#0379e0]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props} />
  );
}
