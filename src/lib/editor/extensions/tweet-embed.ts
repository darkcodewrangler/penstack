// TwitterExtension.ts
import { mergeAttributes, Node, ReactNodeViewRenderer } from "@tiptap/react";
import { PenstackTwitterEmbed } from "@/src/app/components/Renderers/TwitterEmbedRenderer";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    twitter: {
      insertTweet: (tweetId: string) => ReturnType;
    };
  }
}

export const PenstackTwitterExtension = Node.create({
  name: "penstack-twitter",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      tweetId: { default: null },
      // Optional caption or note about the tweet
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="penstack-twitter-embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "penstack-twitter-embed",
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PenstackTwitterEmbed);
  },

  addCommands() {
    return {
      insertTweet:
        (tweetId: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { tweetId },
          });
        },
    };
  },

  // Paste handler for Twitter/X links
  addPasteRules() {
    return [
      {
        // Matches both twitter.com and x.com URLs
        find: /(?:https?:\/\/)?(?:www\.)?(twitter|x)\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/g,
        handler: ({ match, chain, range }) => {
          const tweetId = match[3];
          if (tweetId) {
            chain()
              .deleteRange(range)
              .insertContent({
                type: this.name,
                attrs: { tweetId },
              })
              .run();
          }
        },
      },
    ];
  },
});
