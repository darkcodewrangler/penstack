"use client";
import { Box, HStack, Button, Skeleton } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import { PostsCards } from "../../../themes/smooth-land/PostsCards";
import { usePosts } from "@/src/hooks";
import { CategoryItemList } from "../../components/CategoryItemList";

export default function Posts() {
  const { posts, loading, updateParams } = usePosts();

  return (
    <PageWrapper>
      <Box py={8} px={{ base: 3, lg: 4 }} maxW={"container.xl"} mx="auto">
        <Box mt={0} mb={6}>
          <CategoryItemList
            onChange={(category) => updateParams({ category })}
          />
        </Box>
        <PostsCards posts={posts} loading={loading} />
      </Box>
    </PageWrapper>
  );
}
