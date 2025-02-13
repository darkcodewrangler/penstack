import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Hide,
  IconButton,
  Show,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import DashHeader from "../../Dashboard/Header";
import { LuSettings } from "react-icons/lu";
import { Editor } from "@tiptap/react";
import { SidebarContent } from "../Sidebar";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { memo, useMemo } from "react";
import React from "react";
import { formatDate } from "@/src/utils";
import { UserInfoComp } from "../../Dashboard/UserInfoComp";

function EditorHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { activePost, hasError, isDirty } = useCustomEditorContext();
  const lastUpdate = useMemo(() => {
    return activePost?.updated_at;
  }, [activePost?.updated_at]);
  return (
    <>
      <DashHeader pos="sticky" top={0} zIndex={10}>
        <Stack gap={0}>
          <Text fontSize="lg" fontWeight={600} as="span">
            Create Post
          </Text>
          {hasError && (
            <Text as="span" fontSize="sm" color="red.500">
              Error saving post. Please try again.
            </Text>
          )}
          {!hasError && (
            <Text as="span" fontSize="sm" color="gray.500">
              Last saved:{" "}
              {lastUpdate
                ? formatDate(new Date(lastUpdate))
                : isDirty && "You have Unsaved changes..."}
            </Text>
          )}
        </Stack>
        <Hide below="md">
          <Button
            variant="outline"
            gap={2}
            size="sm"
            rounded="full"
            onClick={onOpen}
            display={{ base: "flex", lg: "none" }}
          >
            <LuSettings />
            <Text>Post Settings</Text>
          </Button>
        </Hide>
        <Show below="md">
          <IconButton
            icon={<LuSettings />}
            rounded={"full"}
            variant={"outline"}
            aria-label="Post Settings"
            onClick={onOpen}
          ></IconButton>
        </Show>
      </DashHeader>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Post Settings</DrawerHeader>
          <DrawerBody px={2} bg={useColorModeValue("gray.100", "gray.700")}>
            <Box display={"flex"} justifyContent={"center"} py={3}>
              <SidebarContent />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default memo(EditorHeader);
