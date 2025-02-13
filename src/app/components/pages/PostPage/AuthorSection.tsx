import React from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { PostSelect } from "@/src/types";
import { LuTwitter, LuGithub } from "react-icons/lu";

interface AuthorSectionProps {
  post: PostSelect;
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({ post }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.800");

  return (
    <Box
      p={4}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      mt={12}
    >
      <VStack align="start" spacing={4}>
        <Heading size="md">Written By</Heading>
        <HStack spacing={4} w="full" wrap={"wrap"}>
          <Link href={`/author/${post.author.username}`} alignSelf={"start"}>
            <Avatar
              size={{ base: "md", md: "lg" }}
              src={post.author.avatar}
              name={post.author.name}
            />
          </Link>
          <Box flex={1} minW={300}>
            <Link href={`/author/${post.author.username}`}>
              <Text fontWeight="bold" fontSize="xl">
                {post.author.name}
              </Text>
              <Text color="gray.500">@{post.author.username}</Text>
            </Link>
            {post?.author?.bio && (
              <Text mt={2} fontSize="small">
                {post.author.bio}
              </Text>
            )}
            <HStack mt={4} spacing={4}>
              <Button
                leftIcon={<LuTwitter />}
                size="sm"
                variant="ghost"
                colorScheme="twitter"
              >
                Follow
              </Button>
              <Button leftIcon={<LuGithub />} size="sm" variant="ghost">
                GitHub
              </Button>
            </HStack>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};
