"use client";

import { EditorContent } from "@tiptap/react";
import useTiptap from "./use-tiptap";

export default function TitapViewer({ initialContent }: { initialContent?: string }) {
  const editor = useTiptap({ editable: false, initialContent });
  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
