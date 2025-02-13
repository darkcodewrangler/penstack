import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { MiniPostCard } from "../nodes/MiniPostCard/MiniPostCard";
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    post: {
      insertPostCard: (postIds?: string | null) => ReturnType;
    };
  }
}
export const PostCardExtension = Node.create({
  name: "postCard",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      postIds: {
        default: null,
      },
      customTitle: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="post-card"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "post-card" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MiniPostCard);
  },

  addCommands() {
    return {
      insertPostCard:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { postIds: null },
          });
        },
    };
  },
});
