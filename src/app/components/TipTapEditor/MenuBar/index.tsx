"use client";
import {
  HStack,
  IconButton,
  useDisclosure,
  Input,
  useColorModeValue,
  Tooltip,
  useOutsideClick,
  Box,
  Button,
  Stack,
} from "@chakra-ui/react";

import { Editor, useCurrentEditor } from "@tiptap/react";
import { useFormik } from "formik";
import React, { FormEvent, memo, useRef, useState } from "react";

import { LuLink, LuRedo2, LuUndo2 } from "react-icons/lu";
import EditorActionsDropdown from "./EditorActionsDropdown";
import { filterEditorActions } from "@/src/lib/editor/actions";
import { MediaInsert } from "./MediaInsert";
import { extractContentAndLinkMark } from "@/src/utils";
import { MiniPostCardButton } from "@/src/lib/editor/nodes/MiniPostCard/MiniPostCardButton";
import { MediaButton } from "@/src/lib/editor/nodes/media/MediaButton";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);
  const {
    isOpen: isMediaModalOpen,
    onClose: onMediaModalClose,
    onOpen: onMediaModalOpen,
  } = useDisclosure();

  const btnStyles = {
    size: "sm",
    fontSize: "medium",
  };
  const borderColorValue = useColorModeValue("gray.200", "gray.700");
  const bgColorValue = useColorModeValue("white", "gray.900");
  // const borderBottomColorValue = useColorModeValue("gray.300", "red");

  if (!editor) {
    return <></>;
  }

  const nonHeadingOrParagraphActions = filterEditorActions(
    [
      "Heading 1",
      "Heading 2",
      "Heading 3",
      "Heading 4",
      "Heading 5",
      "Heading 6",
      "Paragraph",
    ],
    false
  );

  return (
    <HStack
      wrap={"wrap"}
      gap={"6px"}
      pos={"sticky"}
      top={0}
      borderBottom={"1px"}
      borderColor={borderColorValue}
      bg={bgColorValue}
      zIndex={2}
      py={1}
      px={3}
    >
      <EditorActionsDropdown editor={editor} />

      {nonHeadingOrParagraphActions.map((item, index) =>
        item.label === "Insert Media" ? (
          <Box key={index}>
            <Tooltip label={item.label} hasArrow placement="top" rounded={"lg"}>
              <IconButton
                aria-label={item.label}
                {...btnStyles}
                variant={editor.isActive("img") ? "solid" : "ghost"}
                onClick={() => item.command({ open: onMediaModalOpen })}
              >
                <item.icon size={20} />
              </IconButton>
            </Tooltip>
            <MediaInsert
              editor={editor}
              isOpen={isMediaModalOpen}
              onClose={onMediaModalClose}
            />
          </Box>
        ) : (
          <Tooltip
            key={index}
            label={item.label}
            hasArrow
            placement="top"
            rounded={"lg"}
          >
            <IconButton
              aria-label={item.label}
              {...btnStyles}
              onClick={() => {
                item?.command({ editor });
              }}
              variant={item.active(editor) ? "solid" : "ghost"}
            >
              <item.icon size={20} />
            </IconButton>
          </Tooltip>
        )
      )}

      <Tooltip label="Insert Link" hasArrow placement="top" rounded={"lg"}>
        <Box pos={"relative"}>
          <IconButton
            aria-label=""
            onClick={() => {
              setIsLinkFormOpen(true);
            }}
            {...btnStyles}
            variant={editor.isActive("link") ? "solid" : "ghost"}
          >
            <LuLink size={20} />
          </IconButton>
          {isLinkFormOpen && (
            <LinkInputForm
              editor={editor}
              setIsLinkFormOpen={setIsLinkFormOpen}
            />
          )}
        </Box>
      </Tooltip>

      <Tooltip label="Undo" hasArrow placement="top" rounded={"lg"}>
        <IconButton
          aria-label=""
          {...btnStyles}
          isDisabled={!editor.can().undo()}
          variant={"ghost"}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <LuUndo2 size={20} />
        </IconButton>
      </Tooltip>
      <Tooltip label="Redo" hasArrow placement="top" rounded={"lg"}>
        <IconButton
          aria-label=""
          {...btnStyles}
          isDisabled={!editor.can().redo()}
          variant={"ghost"}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <LuRedo2 size={20} />
        </IconButton>
      </Tooltip>
      <MiniPostCardButton editor={editor} />
      <MediaButton editor={editor} />
    </HStack>
  );
};

export const LinkInputForm = ({
  editor,
  setIsLinkFormOpen,
}: {
  editor: Editor;
  setIsLinkFormOpen: (isOpen: boolean) => void;
}) => {
  const linkFormRef = useRef<HTMLDivElement | null>(null);

  const selectedContentJson = editor.state.selection.content().content.toJSON();
  useOutsideClick({
    ref: linkFormRef,
    handler() {
      setIsLinkFormOpen(false);
    },
  });
  const selectedContent = extractContentAndLinkMark(selectedContentJson);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      url: selectedContent?.linkMark?.attrs?.href || "",
      text: selectedContent?.text || "",
    },
    onSubmit(values) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: values.text,
          marks: [
            {
              type: "link",
              attrs: {
                href: values.url,
              },
            },
          ],
        })
        .run();
      setIsLinkFormOpen(false);
    },
  });
  return (
    <Stack
      ref={linkFormRef}
      shadow={"xl"}
      as={"form"}
      border={"1px"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      pos={"absolute"}
      bg={useColorModeValue("white", "gray.900")}
      mt={1}
      p={3}
      right={0}
      minW={250}
      zIndex={10}
      rounded="lg"
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
      }}
    >
      <Input
        placeholder="Enter text"
        rounded={"lg"}
        autoComplete="off"
        name="text"
        value={formik.values.text}
        onChange={formik.handleChange}
        size={"sm"}
      />
      <Input
        name="url"
        type="url"
        rounded={"lg"}
        autoComplete="off"
        value={formik.values.url}
        onChange={formik.handleChange}
        placeholder="https://example.com"
        size={"sm"}
      />
      <Button
        type="submit"
        rounded={"full"}
        size="sm"
        isDisabled={!(formik.values.url && formik.values.text)}
      >
        Insert
      </Button>
    </Stack>
  );
};
export default MenuBar;
