import { cn } from "@/common/styling/utils";
import useError from "@/common/toolkit/hooks/use-error";
import useRefCallback from "@/common/toolkit/hooks/use-ref-callback";
import { delay } from "es-toolkit";
import { ComponentProps, useState } from "react";

export interface OnSlideProps {
  prevIndex: number;
  prevElement: Element;
  index: number;
  element: Element;
  container: Element;
}

/** onSlide는 useCallback 권장 */
export default function AutoScrollSlider({
  onSlide,
  className,
  children,
  ...props
}: ComponentProps<"section"> & {
  onSlide: ({ prevIndex, prevElement, index, element, container }: OnSlideProps) => number | Promise<number>;
}) {
  useError({ onInfiniteRendering: "throwError" });
  const [index, setIndex] = useState(0);

  const handleRef = useRefCallback<"div">(
    async ({ element: container, getMounted }) => {
      const itemCount = container.childElementCount;
      if (itemCount === 0) return;
      const prevIndex = (index - 1 + itemCount) % itemCount;
      const prevElement = container.children[prevIndex];
      const element = container.children[index];

      element.scrollIntoView({ behavior: "smooth" });
      const duration = await Promise.resolve(onSlide({ prevIndex, prevElement, index, element, container }));

      if (!getMounted()) return;
      await delay(duration);

      if (!getMounted()) return;
      setIndex((prev) => (prev + 1) % itemCount);
    },
    [onSlide, index],
  );

  return (
    <section aria-label="slider" className={cn("flex flex-row gap-[10px] overflow-hidden", className)} ref={handleRef} {...props}>
      {children}
    </section>
  );
}
