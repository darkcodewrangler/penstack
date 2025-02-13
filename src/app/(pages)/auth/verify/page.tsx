"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const toast = useToast({ position: "top", duration: 10000 });

  const initialEmail = searchParams.get("email");

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/send-verification", {
        email: email || initialEmail,
      });
      if (res.status >= 200 && res.status < 400) {
        toast({
          title: "Verification email sent",
          description: "Please check your inbox",
          status: "success",
        });
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={{ base: 12, md: 24 }}>
      <VStack spacing={8}>
        <VStack spacing={3} textAlign="center">
          <Heading size="xl">Verify Your Email</Heading>
          <Text color="gray.500">
            Please verify your email address to continue. Haven&apos;t received
            the email?
          </Text>
        </VStack>

        <VStack spacing={4} width="full">
          <Input
            placeholder="Enter your email"
            value={email || initialEmail || ""}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
          />
          <Button
            onClick={handleResend}
            isLoading={isLoading}
            size="lg"
            width="full"
          >
            Resend Verification Email
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
