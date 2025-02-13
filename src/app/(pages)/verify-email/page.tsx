"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

export default function VerifyEmail() {
  const [status, setStatus] = useState("verifying");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    fetch("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.success ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack
        spacing={6}
        p={8}
        maxW="md"
        w="full"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading size="lg">Email Verification</Heading>
        {status === "verifying" && (
          <VStack>
            <Spinner size="xl" color="brand.500" />
            <Text>Verifying your email...</Text>
          </VStack>
        )}
        {status === "success" && (
          <Alert status="success">
            <AlertIcon />
            Email verified successfully! You can now close this window.
          </Alert>
        )}
        {status === "error" && (
          <Alert status="error">
            <AlertIcon />
            Invalid or expired verification link.
          </Alert>
        )}
      </VStack>
    </Box>
  );
}
