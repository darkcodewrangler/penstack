import { Box } from "@chakra-ui/react";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { PropsWithChildren } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

interface PenstackCodeBlockRendererProps {
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  updateAttributes?: (attrs: Record<string, any>) => void;
}
export const PenstackCodeBlockRenderer: React.FC<
  PropsWithChildren<PenstackCodeBlockRendererProps>
> = ({ node, isEditing = true, updateAttributes, children }) => {
  console.log(node);
  const content = (
    <SyntaxHighlighter
      showLineNumbers={!isEditing}
      language={node?.attrs?.language}
    >
      {isEditing ? (node?.textContent as string) : (children as string)}
    </SyntaxHighlighter>
  );
  return (
    <>
      {isEditing ? (
        <Box as={NodeViewWrapper} maxH={450} overflowY={"auto"}>
          {content}
        </Box>
      ) : (
        content
      )}
    </>
  );
};
