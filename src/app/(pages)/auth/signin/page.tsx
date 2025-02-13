"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Alert,
  AlertIcon,
  useToast,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      emailOrUsername: formData.get("emailOrUsername"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      if (result.error === "Please verify your email before signing in") {
        router.push(`/auth/verify?email=${formData.get("emailOrUsername")}`);
        return;
      }
      setError(result.error);
    } else if (result?.url) {
      router.push(result.url);
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="md" py={{ base: 12, md: 24 }}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={3}>
          <Heading size="xl">Sign in</Heading>
          <Text color="gray.500">Welcome back!</Text>
        </VStack>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Email or Username</FormLabel>
              <Input name="emailOrUsername" type="text" required size="lg" />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" required size="lg" />
            </FormControl>

            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Button type="submit" size="lg" width="full" isLoading={isLoading}>
              Sign in
            </Button>
          </VStack>
        </form>

        <Box position="relative" padding="10">
          <Divider />
          <AbsoluteCenter bg="white" px="4">
            <Text color="gray.500">or continue with</Text>
          </AbsoluteCenter>
        </Box>

        <Stack direction="row" spacing={4}>
          <Button
            onClick={() => signIn("github", { callbackUrl })}
            leftIcon={<FaGithub />}
            width="full"
            size="lg"
            colorScheme="blackAlpha"
          >
            GitHub
          </Button>
          <Button
            onClick={() => signIn("google", { callbackUrl })}
            leftIcon={<FaGoogle />}
            width="full"
            size="lg"
            borderRadius="xl"
            colorScheme="red"
          >
            Google
          </Button>
        </Stack>
      </VStack>
    </Container>
  );
}
