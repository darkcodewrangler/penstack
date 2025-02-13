import {
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuTrash2,
} from "react-icons/lu";
import { Editor, NodeViewProps } from "@tiptap/react";

export const MediaComponentActions = ({
  editor,
  node,
}: {
  editor: Editor;
  node: NodeViewProps["node"];
}) => {
  const { updateAttributes, deleteNode } = editor.commands;

  return (
    <div className="absolute z-[1000] -top-12 left-0 flex items-center gap-2 bg-white shadow-lg rounded-lg p-2">
      <button
        onClick={() => updateAttributes("media", { position: "left" })}
        className={`p-1 rounded hover:bg-gray-100 ${
          node.attrs.position === "left" ? "bg-gray-200" : ""
        }`}
      >
        <LuAlignLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => updateAttributes("media", { position: "center" })}
        className={`p-1 rounded hover:bg-gray-100 ${
          node.attrs.position === "center" ? "bg-gray-200" : ""
        }`}
      >
        <LuAlignCenter className="w-4 h-4" />
      </button>
      <button
        onClick={() => updateAttributes("media", { position: "right" })}
        className={`p-1 rounded hover:bg-gray-100 ${
          node.attrs.position === "right" ? "bg-gray-200" : ""
        }`}
      >
        <LuAlignRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => deleteNode("media")}
        className="p-1 rounded hover:bg-red-100 text-red-600"
      >
        <LuTrash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
