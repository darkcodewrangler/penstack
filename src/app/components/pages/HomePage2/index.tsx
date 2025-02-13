"use client";
import React from "react";
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  useColorModeValue,
  LinkBox,
  LinkOverlay,
  Image,
} from "@chakra-ui/react";
import PostCard from "../../../../themes/smooth-land/PostCard";

const FrontPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const featuredPost = {
    id: 1,
    title: "Understanding React Server Components: A Deep Dive",
    summary:
      "Explore the revolutionary approach to building React applications with Server Components. Learn how they can improve your app's performance and developer experience.",
    category: { name: "React" },
    author: {
      name: "Sarah Chen",
      avatar: "https://picsum.photos/40/40",
      username: "sarahchen",
    },
    published_at: "2024-03-15",
    featured_image: {
      url: "https://picsum.photos/1200/600",
      alt_text: "React Server Components Diagram",
    },
  };

  const recentPosts = [
    {
      id: 2,
      title: "TypeScript 5.0 Features You Should Know About",
      category: { name: "TypeScript" },
      author: {
        name: "Alex Johnson",
        avatar: "https://picsum.photos/40/40",
        username: "alexj",
      },
      published_at: "2024-03-10",
      featured_image: {
        url: "https://picsum.photos/500/300",
        alt_text: "TypeScript Code",
      },
    },
    {
      id: 3,
      title: "Building Scalable APIs with GraphQL",
      category: { name: "Backend" },
      author: {
        name: "Maria Garcia",
        avatar: "https://picsum.photos/40/40",
        username: "mariag",
      },
      published_at: "2024-03-08",
      featured_image: {
        url: "https://picsum.photos/500/300",
        alt_text: "GraphQL Schema",
      },
    },
    {
      id: 4,
      title: "Modern CSS Layout Techniques",
      category: { name: "CSS" },
      author: {
        name: "David Kim",
        avatar: "https://picsum.photos/40/40",
        username: "davidk",
      },
      published_at: "2024-03-05",
      featured_image: {
        url: "https://picsum.photos/500/300",
        alt_text: "CSS Grid Layout",
      },
    },
  ];

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="7xl">
        {/* Featured Post Section */}
        <LinkBox mb={12}>
          <Box
            bg={cardBgColor}
            borderRadius="3xl"
            overflow="hidden"
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ boxShadow: "lg" }}
          >
            <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6}>
              <Box position="relative" height={{ base: "300px", lg: "auto" }}>
                <Image
                  src={featuredPost.featured_image.url}
                  alt={featuredPost.featured_image.alt_text}
                  className="w-full h-full object-cover"
                />
                <Tag position="absolute" top={4} left={4} size="lg">
                  Featured
                </Tag>
              </Box>
              <VStack align="start" spacing={4} p={6} justify="center">
                <Tag colorScheme="purple" borderRadius="full">
                  {featuredPost.category.name}
                </Tag>
                <LinkOverlay href={`/post/${featuredPost.id}`}>
                  <Heading size="2xl" mb={4}>
                    {featuredPost.title}
                  </Heading>
                </LinkOverlay>
                <Text color={textColor} fontSize="lg">
                  {featuredPost.summary}
                </Text>
                <HStack spacing={4} mt={4}>
                  <Image
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{featuredPost.author.name}</Text>
                    <Text color={textColor} fontSize="sm">
                      {new Date(featuredPost.published_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Grid>
          </Box>
        </LinkBox>

        {/* Recent Posts Section */}
        <VStack align="start" spacing={8}>
          <Heading size="xl">Recent Articles</Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={8}
            width="full"
          >
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FrontPage;
