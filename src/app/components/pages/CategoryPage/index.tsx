"use client";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostSelect } from "@/src/types";
import { PostsCards } from "@/src/themes/smooth-land/PostsCards";
import PageWrapper from "../../PageWrapper";

export const CategoryPage = () => {
  const params = useParams();
  const categorySlug = params.slug;

  const { data: posts, isLoading } = useQuery({
    queryKey: ["category-posts", categorySlug],
    queryFn: async () => {
      const { data } = await axios.get<{ data: PostSelect[] }>(
        `/api/posts?category=${categorySlug}`
      );
      return data.data;
    },
  });

  return (
    <PageWrapper>
      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <Heading as="h1" size="2xl" mb={2}>
            {categorySlug}
          </Heading>
          <Text fontSize="lg">
            Posts in <Text as={"strong"}>&quot;{categorySlug}&quot; </Text>{" "}
            category
          </Text>
        </Box>

        <PostsCards loading={isLoading} posts={posts} />
      </Container>
    </PageWrapper>
  );
};

export default CategoryPage;
