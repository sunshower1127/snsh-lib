"use client";

import { cn } from "@/common/styling/utils";
import { debounce } from "es-toolkit";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

export default function useDebouncedInput(delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setValueRef = useRef<Dispatch<SetStateAction<string>>>(() => {});

  const handleChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setDebouncedValue(e.target.value);
      setIsDebouncing(false);
    }, delay),
    [],
  );

  const setValue = useCallback(
    (newValue: string) => {
      setValueRef.current(newValue);
      setDebouncedValue(newValue);
      setIsDebouncing(false);
      handleChange.cancel(); // Cancel any pending debounced calls
    },
    [handleChange],
  );

  const InputBox = useCallback(
    ({
      className,
      label,
      placeholder,
      ...props
    }: {
      className?: string;
      label: string | React.ReactNode;
      placeholder: string | React.ReactNode;
    } & React.ComponentProps<"input">) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [value, setValue] = useState("");
      setValueRef.current = setValue; // Store the setter function for external use

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isFocused, setIsFocused] = useState(false);

      return (
        <div className={cn("relative rounded-md border", className)}>
          <input
            className="h-full w-full p-3"
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setIsDebouncing(true);
              handleChange(e);
              setValue(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <div
            className={cn(
              "absolute transition-all",
              !value
                ? "top-1/2 left-[1px] -z-10 -translate-y-1/2 p-3 text-base brightness-50"
                : "-top-0 left-2 z-10 -translate-y-1/2 bg-zinc-900 p-1 text-xs",
              isFocused ? "text-blue-200" : "text-white",
            )}
          >
            {!value ? placeholder : label}
          </div>
        </div>
      );
    },
    [handleChange],
  );

  return [InputBox, debouncedValue, setValue, isDebouncing] as const;
}
