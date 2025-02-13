import { Extension, ReactNodeViewRenderer } from "@tiptap/react";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React, { memo, useState } from "react";
import { Select, Button, useColorModeValue } from "@chakra-ui/react";
import styles from "./CodeBlock.module.css";

const CustomCodeBlockView = memo(
  ({
    node: {
      attrs: { language: defaultLanguage },
    },
    updateAttributes,
    extension,
  }: NodeViewProps) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get the actual code content
    const codeContent = React.useRef<HTMLElement | null>(null);

    const handleCopy = () => {
      if (codeContent.current) {
        const text = codeContent.current.textContent || "";
        navigator.clipboard.writeText(text);
      }
    };

    const copyButtonBg = useColorModeValue("gray.100", "gray.700");
    const copyButtonHoverBg = useColorModeValue("gray.200", "gray.600");

    return (
      <NodeViewWrapper
        className={`code-block ${defaultLanguage ? `language-${defaultLanguage}` : ""} ${styles["code-block"]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
      >
        <Select
          contentEditable={false}
          defaultValue={defaultLanguage || "null"}
          onChange={(event) =>
            updateAttributes({ language: event.target.value })
          }
        >
          <option value="null">auto</option>
          <option disabled>—</option>
          {extension.options.lowlight
            .listLanguages()
            .map((lang: string, index: number) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
        </Select>

        {isHovered && (
          <Button
            size="xs"
            position="absolute"
            top={2}
            right={2}
            zIndex={10}
            bg={copyButtonBg}
            _hover={{ bg: copyButtonHoverBg }}
            onClick={handleCopy}
          >
            Copy
          </Button>
        )}

        <pre>
          <NodeViewContent
            as="code"
            ref={codeContent}
            className={defaultLanguage ? `language-${defaultLanguage}` : ""}
          />
        </pre>
      </NodeViewWrapper>
    );
  }
);
CustomCodeBlockView.displayName = "CustomCodeBlockView";
