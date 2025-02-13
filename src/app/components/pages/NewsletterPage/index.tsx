"use client";
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  Stack,
  Icon,
  Container,
  Badge,
  Avatar,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuSend, LuCode, LuZap, LuBookOpen, LuQuote } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import isEmpty from "just-is-empty";
import { Newsletter } from "../../NewsLetter";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer at Google",
    avatar: "/api/placeholder/40/40",
    content:
      "This newsletter helped me stay ahead of React trends. The weekly deep dives are gold!",
  },
  {
    name: "Mike Peterson",
    role: "Tech Lead at Microsoft",
    avatar: "/api/placeholder/40/40",
    content:
      "Best tech newsletter I've subscribed to. Clear, concise, and always relevant.",
  },
  {
    name: "Emma Rodriguez",
    role: "Fullstack Developer",
    avatar: "/api/placeholder/40/40",
    content:
      "The performance tips alone have saved me countless hours of debugging.",
  },
];

const Feature = ({
  icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
  <Stack direction="row" align="center" spacing={2}>
    <Icon as={icon} color="brand.500" boxSize={5} />
    <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
      {title}
    </Text>
  </Stack>
);

const Testimonial = ({
  content,
  name,
  role,
  avatar,
}: {
  content: string;
  name: string;
  role: string;
  avatar: string;
}) => (
  <Stack
    bg={useColorModeValue("white", "gray.800")}
    p={6}
    rounded="xl"
    border="1px"
    borderColor={useColorModeValue("gray.100", "gray.700")}
    spacing={3}
    _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
    transition="all 0.3s"
  >
    <Icon as={LuQuote} color="brand.500" boxSize={6} />
    <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
      &apos;{content}&apos;
    </Text>
    <HStack spacing={3}>
      <Avatar src={avatar} size="sm" name={name} />
      <Box>
        <Text fontWeight="bold" fontSize="sm">
          {name}
        </Text>
        <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.400")}>
          {role}
        </Text>
      </Box>
    </HStack>
  </Stack>
);

export const NewsletterPage = ({ title }: { title?: string }) => {
  const [status, setStatus] = useState("");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Container maxW="5xl" py={12}>
      <Box
        borderRadius="2xl"
        overflow="hidden"
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        p={8}
      >
        <VStack spacing={8} align="center" textAlign="center">
          <Badge colorScheme="brand" fontSize="sm" px={3} py={1} rounded="full">
            Join 10,000+ Developers
          </Badge>

          <Heading size="lg" color={useColorModeValue("gray.900", "white")}>
            {title || "Level Up Your Dev Game"}
          </Heading>

          <Text color={textColor} maxW="2xl">
            Get weekly insights on latest tech trends, coding best practices,
            and career growth opportunities. No spam, just pure value delivered
            to your inbox.
          </Text>

          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={8}
            justify="center"
            w="full"
            maxW="2xl"
            py={4}
          >
            <Feature icon={LuCode} title="Latest Tech Deep Dives" />
            <Feature icon={LuZap} title="Performance Tips" />
            <Feature icon={LuBookOpen} title="Tutorial Collections" />
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
            {testimonials.map((testimonial, idx) => (
              <Testimonial key={idx} {...testimonial} />
            ))}
          </SimpleGrid>

          <HStack w={"full"} mx={"auto"} justify={"center"} pt={4}>
            <Newsletter isDark={false} />
          </HStack>

          {status === "success" && (
            <Text color="green.500" fontWeight="medium">
              🎉 Welcome aboard! Check your inbox to confirm subscription.
            </Text>
          )}

          <Text fontSize="sm" color={textColor}>
            Join developers from Google, Microsoft, Amazon, and other top
            companies.
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};
