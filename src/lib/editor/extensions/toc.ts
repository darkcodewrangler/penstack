// TableOfContents.ts
import { JSONContent, Node, mergeAttributes } from "@tiptap/core";

export interface TableOfContentsOptions {
  maxLevel: number;
}

interface HeadingItem {
  level: number;
  text: string;
  id: string;
  items?: HeadingItem[];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tableOfContents: {
      insertTableOfContents: () => ReturnType;
    };
  }
}

export const TableOfContents = Node.create<TableOfContentsOptions>({
  name: "tableOfContents",
  group: "block",
  atom: true,
  draggable: true,
  content: "block+",

  addOptions() {
    return {
      maxLevel: 3,
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="table-of-contents"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "table-of-contents" }),
    ];
  },

  addCommands() {
    return {
      insertTableOfContents:
        () =>
        ({ editor, commands }) => {
          // First, collect all headings in a flat array
          const flatHeadings: HeadingItem[] = [];
          editor.state.doc.descendants((node: any, pos: number) => {
            if (
              node.type.name === "heading" &&
              node.attrs.level <= this.options.maxLevel
            ) {
              const id = `heading-${pos}`;
              flatHeadings.push({
                level: node.attrs.level,
                text: node.textContent,
                id,
                items: [],
              });
              return false;
            }
          });

          // Convert flat array to nested structure
          const buildNestedHeadings = (
            headings: HeadingItem[]
          ): HeadingItem[] => {
            const root: HeadingItem[] = [];
            const stack: HeadingItem[] = [];

            headings.forEach((heading) => {
              while (
                stack.length > 0 &&
                stack[stack.length - 1].level >= heading.level
              ) {
                stack.pop();
              }

              if (stack.length === 0) {
                root.push(heading);
              } else {
                const parent = stack[stack.length - 1];
                if (!parent.items) {
                  parent.items = [];
                }
                parent.items.push(heading);
              }

              stack.push(heading);
            });

            return root;
          };

          const nestedHeadings = buildNestedHeadings(flatHeadings);

          // Create nested bullet list nodes
          const createTocContent = (items: HeadingItem[]): JSONContent[] => {
            if (!items.length) return [];

            return [
              {
                type: "bulletList",
                content: items.map((item) => ({
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: item.text,
                          marks: [
                            {
                              type: "link",
                              attrs: { href: `#${item.id}` },
                            },
                          ],
                        },
                      ],
                    },
                    ...(item.items && item.items.length
                      ? createTocContent(item.items)
                      : []),
                  ],
                })),
              },
            ];
          };

          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "Table of Contents" }],
              },
              ...createTocContent(nestedHeadings),
            ],
          });
        },
    };
  },
});
