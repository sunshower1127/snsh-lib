import { createStore } from "zustand";
import { devtools } from "zustand/middleware";

interface ExampleState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useExampleStore = createStore(
  devtools<ExampleState>((set) => ({
    // 마지막 middleware에 타입 지정 해주면 됨.
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  })),
);
