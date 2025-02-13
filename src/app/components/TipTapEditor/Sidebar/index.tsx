"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Tag,
  Textarea,
  Spinner,
  Stack,
  List,
  ListItem,
  FormLabel,
  FormControl,
  Icon,
  InputRightElement,
  InputGroup,
  Text,
  HStack,
  Switch,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import { SectionCard } from "@/src/app/components/Dashboard/SectionCard";

import {
  LuEye,
  LuPin,
  LuCheck,
  LuFileText,
  LuType,
  LuMessageSquare,
  LuRadioReceiver,
  LuClock,
} from "react-icons/lu";
import { FeaturedImageCard } from "@/src/app/components/TipTapEditor/FeaturedImageCard";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { Editor } from "@tiptap/react";
import { useRouter } from "next/navigation";
import { PermissionGuard } from "../../PermissionGuard";
import { format } from "date-fns";
import { CalendarPicker } from "../CalendarPicker";
import { CategorySection } from "./CategorySection";
import { TagsSection } from "./TagsSection";
import { PostInsert } from "@/src/types";
import { SEOSection } from "./SEOSection";
import { ActionButtons } from "./components/ActionButtons";
import { MetricsItem } from "./components/MetricsItem";

export const SidebarContent = () => {
  const { activePost, isSaving, updateField } = useCustomEditorContext();
  const [isSlugEditable, setIsSlugEditable] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const router = useRouter();
  const { isOpen, onClose, onToggle } = useDisclosure();
  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });

  function onDraft() {
    updateField("status", "draft", undefined, () => {
      toast({
        title: "Draft saved successfully",
      });
    });
  }
  function onPublish() {
    setIsPublishing(true);
    updateField("status", "published", undefined, () => {
      toast({
        title: "Post published successfully",
      });
      setTimeout(() => {
        router.push("/dashboard/posts");
        setIsPublishing(false);
      }, 2000);
    });
  }
  function onDelete() {
    updateField("status", "deleted", undefined, () => {
      toast({
        title: "Post deleted successfully",
      });
      setTimeout(() => {
        router.replace("/dashboard/posts");
      }, 2000);
    });
  }
  function handleChange(
    evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = evt.target;
    updateField(name as keyof PostInsert, value);
  }

  return (
    <>
      <Stack
        gap={3}
        flexShrink={0}
        maxW={360}
        minW={300}
        width={{ base: "100%" }}
        overflowY={"auto"}
      >
        <SectionCard
          title="Publish"
          header={
            <>
              <HStack>
                {" "}
                {isSaving ? (
                  <Spinner size="xs" />
                ) : (
                  <Stack
                    align={"center"}
                    justify={"center"}
                    w={"14px"}
                    h={"14px"}
                    rounded="full"
                    bg="green.400"
                  >
                    <LuCheck size={12} color="white" />
                  </Stack>
                )}
                <Text as="span" color={isSaving ? "gray.300" : undefined}>
                  {" "}
                  {isSaving ? "Saving..." : "Saved"}
                </Text>
              </HStack>
            </>
          }
          footer={
            <ActionButtons
              onDelete={onDelete}
              onDraft={onDraft}
              onPublish={onPublish}
              isPublishing={isPublishing}
            />
          }
        >
          <Box p={4} pb={0}>
            <Stack as={List} fontSize={14} gap={2}>
              <ListItem>
                <HStack>
                  <Text as={"span"} color="gray.500">
                    <Icon as={LuRadioReceiver} mr={1} />
                    Status:
                  </Text>
                  <Text
                    as={"span"}
                    fontWeight="semibold"
                    textTransform={"capitalize"}
                  >
                    {activePost?.status}
                  </Text>
                </HStack>
              </ListItem>
              <ListItem>
                <HStack justify={"space-between"}>
                  <HStack>
                    <Text as={"span"} color="gray.500">
                      <Icon as={LuEye} mr={1} />
                      Visibility:
                    </Text>
                    <Text
                      as={"span"}
                      fontWeight="semibold"
                      textTransform={"capitalize"}
                    >
                      {activePost?.visibility}
                    </Text>
                  </HStack>
                  <Button variant={"ghost"} size={"xs"}>
                    Edit
                  </Button>
                </HStack>
              </ListItem>
              <PermissionGuard requiredPermission={"posts:publish"}>
                <ListItem>
                  <HStack justify={"space-between"}>
                    <HStack>
                      <Text as={"span"} color="gray.500">
                        <Icon as={LuClock} mr={1} />
                        Schedule:
                      </Text>
                      <Text
                        as={"span"}
                        fontWeight="semibold"
                        textTransform={"capitalize"}
                      >
                        {activePost?.scheduled_at ? (
                          <>
                            <Text fontSize={"small"}>
                              {format(
                                new Date(activePost?.scheduled_at as Date),
                                "MMM d, yyyy hh:mm a"
                              )}
                            </Text>
                          </>
                        ) : (
                          "Off"
                        )}
                      </Text>
                    </HStack>
                    <CalendarPicker
                      defaultValue={
                        activePost?.scheduled_at
                          ? new Date(activePost.scheduled_at as Date)
                          : undefined
                      }
                      isOpen={isOpen}
                      onClose={onClose}
                      trigger={
                        <Button
                          variant={"ghost"}
                          size={"xs"}
                          onClick={() => onToggle()}
                        >
                          Edit
                        </Button>
                      }
                    />
                  </HStack>
                </ListItem>
              </PermissionGuard>
              <MetricsItem />
              <PermissionGuard requiredPermission="posts:publish">
                <ListItem>
                  <HStack>
                    <Text as={"span"} color="gray.500">
                      <Icon as={LuMessageSquare} mr={1} />
                      Allow Comments:
                    </Text>
                    <Switch
                      isChecked={activePost?.allow_comments as boolean}
                      onChange={() => {
                        updateField(
                          "allow_comments",
                          !activePost?.allow_comments
                        );
                      }}
                    />
                  </HStack>
                </ListItem>
              </PermissionGuard>
              <PermissionGuard requiredPermission="posts:publish">
                <ListItem>
                  <HStack>
                    <Text as={"span"} color="gray.500">
                      <Icon as={LuPin} mr={1} />
                      Pinned:
                    </Text>
                    <Switch
                      isChecked={activePost?.is_sticky as boolean}
                      onChange={() => {
                        updateField("is_sticky", !activePost?.is_sticky);
                      }}
                    />
                  </HStack>
                </ListItem>
              </PermissionGuard>
            </Stack>
          </Box>
        </SectionCard>
        <SectionCard title="SEO">
          <SEOSection activePost={activePost} updateField={updateField} />
        </SectionCard>
        <CategorySection />
        <TagsSection />
      </Stack>
    </>
  );
};
SidebarContent.displayName = "SidebarContent";
