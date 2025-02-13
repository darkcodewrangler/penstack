import {
  Divider,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { LuChevronsUpDown } from "react-icons/lu";
import { filterEditorActions } from "@/src/lib/editor/actions";
import React, { memo, useEffect, useMemo, useState } from "react";
import { MediaInsert } from "../MediaInsert";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import AccessibleDropdown from "../../../AccessibleDropdown";
import { EditorActionItem } from "@/src/types";
import { Editor } from "@tiptap/react";

function EditorActionsDropdown({ editor }: { editor: Editor | null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dropdownActions = useMemo(
    () =>
      filterEditorActions([
        "Paragraph",
        "Heading 1",
        "Heading 2",
        "Heading 3",
        "Bullet List",
        "Ordered List",
        "Insert Media",
      ]),
    []
  );

  if (!editor) return null;

  return (
    <>
      <AccessibleDropdown
        options={dropdownActions}
        onOpen={onOpen}
        editor={editor}
        defaultValue={dropdownActions[0]}
      />
      <Divider orientation="vertical" h={10} />

      <MediaInsert editor={editor} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
export default EditorActionsDropdown;
