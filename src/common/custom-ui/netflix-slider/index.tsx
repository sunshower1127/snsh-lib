import { BREAKPOINT_LIST } from "@/common/styling/constants";
import { cn, getCssVar } from "@/common/styling/utils";
import useRefCallback from "@/common/toolkit/hooks/use-ref-callback";
import React, { useState } from "react";
import ScrollableSlider from "./scrollable-slider";
import classes from "./slider.module.css";
import StaticSlider from "./static-slider";

export default function NetflixSlider({
  sources,
  className,
  headerText,
}: React.ComponentProps<"div"> & { sources: string[]; headerText: string }) {
  const [itemCapacity, setItemCapacity] = useState(2);

  const handleBreakpoint = useRefCallback(({ defer, element }) => {
    const mediaQueries = BREAKPOINT_LIST.map((bp) => window.matchMedia(`(min-width: ${bp}px)`));
    const handleMediaChange = () => {
      setItemCapacity(getCssVar(element, "--item-capacity") || 2);
    };
    mediaQueries.forEach((mql) => mql.addEventListener("change", handleMediaChange));
    defer(() => {
      mediaQueries.forEach((mql) => mql.removeEventListener("change", handleMediaChange));
    });
    handleMediaChange();
  }, []);

  return (
    <article className={cn("flex flex-col pt-6", classes["responsive"], className)} ref={handleBreakpoint}>
      {sources.length > itemCapacity ? (
        <ScrollableSlider headerText={headerText} sources={sources} itemCapacity={itemCapacity} />
      ) : (
        <StaticSlider headerText={headerText} sources={sources} />
      )}
    </article>
  );
}
