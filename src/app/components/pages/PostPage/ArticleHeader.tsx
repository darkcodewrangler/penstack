import React from "react";
import {
  Box,
  Text,
  Heading,
  HStack,
  useColorModeValue,
  Stack,
  Avatar,
  Badge,
} from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import { Link } from "@chakra-ui/next-js";
import { formatDate } from "@/src/utils";
import { ShareButtons } from "./ShareButtons";

interface ArticleHeaderProps {
  post: PostSelect;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  const summaryColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.600", "gray.400");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Box mb={{ base: 6, md: 10 }} px={2}>
      <Stack
        align={"center"}
        as="header"
        mb={4}
        maxW={"5xl"}
        mx={"auto"}
        spacing={2}
      >
        {post?.category?.name && (
          <Badge as={"b"} px={3} py={1} mb={0} rounded={"xl"}>
            {post?.category?.name}
          </Badge>
        )}
        <Heading
          as="h1"
          mb={1}
          size="3xl"
          lineHeight={"1"}
          fontWeight={700}
          textAlign={"center"}
        >
          {post.title}
        </Heading>
        {post.summary && (
          <Text
            fontSize={{ base: "md", md: "lg" }}
            maxW={"3xl"}
            color={summaryColor}
            textAlign={"center"}
          >
            {post.summary}
          </Text>
        )}
      </Stack>
      <Stack align={"center"}>
        <HStack>
          <Text as="span">By</Text>
          {post.author.avatar && (
            <Avatar
              src={post.author.avatar}
              name={post.author.name}
              size={"sm"}
            />
          )}

          <Link
            href={"/author/" + post.author.username}
            fontWeight={500}
            textDecor={"underline"}
            lineHeight={"tighter"}
          >
            {post.author.name}
          </Link>
        </HStack>
        <HStack>
          <Text as={"span"} fontSize={"14px"}>
            {formatDate(
              new Date(
                (post.published_at
                  ? post?.published_at
                  : post.created_at) as Date
              )
            )}
          </Text>
          <Box w={1} h={1} rounded={"full"} bg={dividerColor}></Box>
          <Text as={"span"} fontSize={"14px"}>
            {post?.reading_time || 1} min read
          </Text>
        </HStack>

        <ShareButtons url={shareUrl} title={post.title || ""} />
      </Stack>
    </Box>
  );
};
