"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface NewPostRedirectProps {
  postId: string;
}

export function NewPostRedirect({ postId }: NewPostRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/dashboard/posts/new/${postId}`);
  }, [postId, router]);

  return (
    <Stack h={"full"} align={"center"} justify={"center"} spacing={4}>
      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <Text as={motion.p} style={{ fontSize: "large", fontWeight: "medium" }}>
          Creating post...
        </Text>
      </motion.div>
      <Spinner />
    </Stack>
  );
}
