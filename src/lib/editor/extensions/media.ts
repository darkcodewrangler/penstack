import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { MediaComp2 } from "../nodes/media/MediaComp2";
import { MediaComponent } from "../nodes/media/MediaComponent";

type MediaPosition = "inline" | "block" | "left" | "right" | "center";
type MediaAlign = "left" | "right" | "center";
type MediaSize = "small" | "large" | "full";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    media: {
      insertMedia: (options: {
        url?: string;
        type?: "image" | "video";
        position?: MediaPosition;
        align?: MediaAlign;
        size?: MediaSize;
        width?: number;
        height?: number;
        alt?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const MediaExtension = Node.create({
  name: "media",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      url: { default: null },
      type: { default: "image" },
      position: { default: "block" },
      size: { default: "large" },
      width: { default: null },
      height: { default: null },
      alt: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="media"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "media" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaComponent);
  },

  addCommands() {
    return {
      insertMedia:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { ...options },
          });
        },
    };
  },
});
