import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, PropsWithChildren } from "react";

interface Props {
  id: UniqueIdentifier;
}

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li className="cursor-grab list-none active:cursor-grabbing" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </li>
  );
}
