import {
  BubbleMenu,
  FloatingMenu,
  mergeAttributes,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import { Box, Flex, Hide } from "@chakra-ui/react";

import { useMemo } from "react";

import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

import { TableOfContents } from "@/src/lib/editor/extensions/toc";
import { MediaExtension } from "@/src/lib/editor/extensions/media";
import MenuBar from "./MenuBar";
import { SidebarContent } from "./Sidebar";
import { EditorWrapper } from "./Wrapper";
import EditorHeader from "./Header";
import ContentArea from "./ContentArea";
import React from "react";
import { debounce } from "lodash";
import { PostCardExtension } from "@/src/lib/editor/extensions/mini-post-card";
import { PenstackYouTubeExtension } from "@/src/lib/editor/extensions/youtube-embed";
import { PenstackTwitterExtension } from "@/src/lib/editor/extensions/tweet-embed";

import Heading from "@tiptap/extension-heading";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

import { CodeBlock } from "@tiptap/extension-code-block";
import { usePenstackEditorStore } from "@/src/state/penstack-editor";
import { PenstackSlashCommandExtension } from "@/src/lib/editor/extensions/slash-command";
import { PenstackCodeBlockRenderer } from "../Renderers/PenstackCodeBlockRenderer";
import { generateSlug } from "@/src/utils";
function TipTapEditor({
  onUpdate,
  initialContent,
}: {
  onUpdate?: (content: { html: string; text?: string }) => void;
  initialContent?: string;
}) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      CodeBlock.extend({
        addNodeView() {
          return ReactNodeViewRenderer(PenstackCodeBlockRenderer);
        },
      }),
      Heading.extend({
        priority: 1000,
        addProseMirrorPlugins() {
          return [
            new Plugin({
              key: new PluginKey("heading-ids"),
              appendTransaction: (transactions, oldState, newState) => {
                const docChanged = transactions.some((tr) => tr.docChanged);
                if (!docChanged) return;

                const tr = newState.tr;
                let modified = false;

                newState.doc.descendants((node, pos) => {
                  if (node.type.name === "heading") {
                    const newId = generateSlug(node.textContent);

                    if (newId && node.attrs.id !== newId) {
                      tr.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        id: newId,
                      });
                      modified = true;
                    }
                  }
                });

                return modified ? tr : null;
              },
            }),
          ];
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            id: {
              default: null,
              parseHTML: (element) => element.getAttribute("id"),
              renderHTML: (attributes) => ({
                id: attributes.id,
              }),
            },
          };
        },
      }),

      Placeholder.configure({
        placeholder: "Write something…",
      }),
      Link.configure({
        HTMLAttributes: {
          rel: "noopener noreferrer",
        },
        openOnClick: false,
        autolink: true,
      }),
      Typography,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      CharacterCount,
      TableOfContents,
      MediaExtension,
      PostCardExtension,
      PenstackYouTubeExtension,
      PenstackTwitterExtension,
      PenstackSlashCommandExtension,
    ],
    []
  );
  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (content: { html: string; text?: string }) => onUpdate?.(content),
        750
      ),
    [onUpdate]
  );
  const setEditor = usePenstackEditorStore((state) => state.setEditor);
  const editor = useEditor({
    editorProps: { attributes: { class: "penstack-post-editor" } },
    enablePasteRules: true,
    extensions: extensions,
    content: initialContent,
    onCreate: ({ editor }) => {
      setEditor(editor);
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      debouncedUpdate({
        html,
        text,
      });
    },
  });
  return (
    <>
      <EditorHeader />
      <Flex gap={4} py={4} px={{ base: 3, md: 4 }}>
        <EditorWrapper>
          <MenuBar editor={editor} />
          <ContentArea editor={editor} />

          {/* <FloatingMenu editor={editor}>
            <MenuBar editor={editor} />
          </FloatingMenu> */}
        </EditorWrapper>
        <Hide below="lg">
          <SidebarContent />
        </Hide>
        {/* <Box display={{ base: "none", lg: "block" }} maxW={320}></Box> */}
      </Flex>
    </>
  );
}
export default TipTapEditor;
