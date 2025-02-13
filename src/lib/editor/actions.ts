import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuHighlighter,
  LuImagePlus,
  LuItalic,
  LuList,
  LuListOrdered,
  LuPilcrow,
  LuQuote,
  LuStrikethrough,
} from "react-icons/lu";
import { EditorActionItem } from "../../types";

export const editorButtonActions: EditorActionItem[] = [
  {
    id: "paragraph",
    label: "Paragraph",
    command: ({ editor }) => editor?.chain().focus().setParagraph().run(),
    icon: LuPilcrow,
    active: (editor) => editor.isActive("paragraph"),
  },
  {
    id: "heading-1",
    label: "Heading 1",
    command: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 1 }).run(),
    icon: LuHeading1,
    active: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    id: "heading-2",
    label: "Heading 2",
    command: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 2 }).run(),
    icon: LuHeading2,
    active: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    id: "heading-3",
    label: "Heading 3",
    command: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 3 }).run(),
    icon: LuHeading3,
    active: (editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    id: "heading-4",
    label: "Heading 4",
    command: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 4 }).run(),
    icon: LuHeading4,
    active: (editor) => editor.isActive("heading", { level: 4 }),
  },
  {
    id: "heading-5",
    label: "Heading 5",
    command: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 5 }).run(),
    icon: LuHeading5,
    active: (editor) => editor.isActive("heading", { level: 5 }),
  },
  {
    id: "heading-6",
    label: "Heading 6",
    command: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 6 }).run(),
    icon: LuHeading6,
    active: (editor) => editor.isActive("heading", { level: 6 }),
  },
  {
    id: "bold",
    label: "Bold",
    command: ({ editor }) => editor?.chain().focus().toggleBold().run(),
    icon: LuBold,
    active: (editor) => editor.isActive("bold"),
  },
  {
    id: "italic",
    label: "Italic",
    command: ({ editor }) => editor?.chain().focus().toggleItalic().run(),
    icon: LuItalic,
    active: (editor) => editor.isActive("italic"),
  },
  {
    id: "strikethrough",
    label: "Strikethrough",
    command: ({ editor }) => editor?.chain().focus().toggleStrike().run(),
    icon: LuStrikethrough,
    active: (editor) => editor.isActive("strike"),
  },
  {
    id: "highlight",
    label: "Highlight",
    command: ({ editor }) => editor?.chain().focus().toggleHighlight().run(),
    icon: LuHighlighter,
    active: (editor) => editor.isActive("highlight"),
  },
  {
    id: "bullet-list",
    label: "Bullet List",
    command: ({ editor }) => editor?.chain().focus().toggleBulletList().run(),
    icon: LuList,
    active: (editor) => editor.isActive("bulletList"),
  },
  {
    id: "ordered-list",
    label: "Ordered List",
    command: ({ editor }) => editor?.chain().focus().toggleOrderedList().run(),
    icon: LuListOrdered,
    active: (editor) => editor.isActive("orderedList"),
  },
  {
    id: "align-left",
    label: "Align Left",
    command: ({ editor }) => editor?.chain().focus().setTextAlign("left").run(),
    icon: LuAlignLeft,
    active: (editor) => editor.isActive({ textAlign: "left" }),
  },
  {
    id: "align-center",
    label: "Align Center",
    command: ({ editor }) =>
      editor?.chain().focus().setTextAlign("center").run(),
    icon: LuAlignCenter,
    active: (editor) => editor.isActive({ textAlign: "center" }),
  },
  {
    id: "align-right",
    label: "Align Right",
    command: ({ editor }) =>
      editor?.chain().focus().setTextAlign("right").run(),
    icon: LuAlignRight,
    active: (editor) => editor.isActive({ textAlign: "right" }),
  },
  {
    id: "justify",
    label: "Justify",
    command: ({ editor }) =>
      editor?.chain().focus().setTextAlign("justify").run(),
    icon: LuAlignJustify,
    active: (editor) => editor.isActive({ textAlign: "justify" }),
  },
  {
    id: "blockquote",
    label: "Blockquote",
    command: ({ editor }) => editor?.chain().focus().toggleBlockquote().run(),
    icon: LuQuote,
    active: (editor) => editor.isActive("blockquote"),
  },
  {
    id: "insert-media",
    label: "Insert Media",
    command: ({ open }) => open?.(),
    icon: LuImagePlus,
    active: (editor) => editor.isActive("img"),
  },
];
export const filterEditorActions = (labels: string[], pick: boolean = true) => {
  const actionMap = new Map(
    editorButtonActions.map((command) => [command.label, command])
  );

  if (pick) {
    return labels
      .map((label) => actionMap.get(label))
      .filter(
        (command): command is (typeof editorButtonActions)[number] =>
          command !== undefined
      );
  } else {
    const labelSet = new Set(labels);
    return editorButtonActions.filter(
      (command) => !labelSet.has(command.label)
    );
  }
};
