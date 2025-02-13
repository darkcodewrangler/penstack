import { Editor } from "@tiptap/react";
import { useMemo, useState } from "react";

export const useSidebarState = (editor: Editor | null) => {
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const editorMeta = useMemo(
    () => ({
      wordCount: editor?.storage?.characterCount?.words() || 0,
      characterCount: editor?.storage?.characterCount?.characters() || 0,
    }),
    [
      editor?.storage?.characterCount?.words(),
      editor?.storage?.characterCount?.characters(),
    ]
  );

  return {
    isSlugEditable,
    setIsSlugEditable,
    isPublishing,
    setIsPublishing,
    editorMeta,
  };
};
