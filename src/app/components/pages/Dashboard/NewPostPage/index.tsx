"use client";
import { Box, Spinner, Stack, Text } from "@chakra-ui/react";
import { usePost } from "@/src/hooks";
import { redirect, useParams } from "next/navigation";
import Loader from "../../../Loader";
import { decode, encode } from "html-entities";
import TipTapEditor from "@/src/app/components/TipTapEditor";
import {
  AppEditorContextProvider,
  useCustomEditorContext,
} from "@/src/context/AppEditor";
import { PermissionGuard } from "../../../PermissionGuard";
import { useAuth } from "@/src/hooks/useAuth";
import { usePenstackEditorStore } from "@/src/state/penstack-editor";
import { motion } from "framer-motion";

export default function NewPostPage() {
  const postId = useParams().postId as string;
  const { post, loading } = usePost(postId);

  if (loading) {
    return (
      <Stack h="full" align="center" justify="center">
        <Stack h={"full"} align={"center"} justify={"center"} spacing={4}>
          <motion.div
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Text
              as={motion.p}
              style={{ fontSize: "large", fontWeight: "medium" }}
            >
              Loading editor...
            </Text>
          </motion.div>
          <Spinner />
        </Stack>
      </Stack>
    );
  }
  if (!loading && !post) redirect("/not-found");
  return (
    <AppEditorContextProvider post={post!}>
      <PostEditor />
    </AppEditorContextProvider>
  );
}

export function PostEditor() {
  const { activePost, setEditorContent, updateField } =
    useCustomEditorContext();
  const editor = usePenstackEditorStore((state) => state.editor);
  console.log("editor", editor);

  const { user } = useAuth();
  function onEditorUpdate(content: { html: string; text?: string }) {
    setEditorContent(content);

    updateField("content", encode(content.html), true);
  }
  return (
    <PermissionGuard
      requiredPermission={"posts:create"}
      isOwner={activePost?.author?.auth_id === user?.id}
    >
      <Box h="full" overflowY="auto">
        <TipTapEditor
          onUpdate={onEditorUpdate}
          initialContent={decode(activePost?.content) || ""}
        />
      </Box>
    </PermissionGuard>
  );
}
