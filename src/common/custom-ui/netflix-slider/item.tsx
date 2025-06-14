import { getCssVar } from "@/common/styling/utils";
import { TimeoutId } from "@/common/toolkit/types";
import { once } from "es-toolkit";
import { AnimatePresence } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { twMerge } from "tailwind-merge";
import HoverCard from "./hover-card";

export default function Item({ source, className }: { source: string; className?: string }) {
  const [isHover, setHover] = useState(false);
  const timeoutRef = useRef<TimeoutId | null>(null);
  const rectRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setHover(true);
      timeoutRef.current = null;
    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setHover(false);
    }
  }, []);

  const getButtonWidth = useCallback(() => {
    const buttonWidth = getCssVar(rectRef.current!, "--button-width")!;
    return buttonWidth;
  }, []);

  const getRect = useCallback(() => rectRef.current!.getBoundingClientRect(), []);

  return (
    <li className={twMerge("w-(--item-width) cursor-pointer", className)}>
      <div className="w-full bg-red-400" />
      <img
        ref={rectRef}
        className="aspect-video w-full cursor-pointer rounded-xs"
        src={source}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {createPortal(
        <AnimatePresence>
          {isHover && (
            <HoverCard
              url={source}
              buttonWidth={getButtonWidth()}
              rect={getRect()}
              close={once(() => setHover(false))}
              onMouseLeave={() => setHover(false)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </li>
  );
}
