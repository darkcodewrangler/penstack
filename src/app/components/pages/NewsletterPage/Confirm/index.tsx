"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { LuCheckCircle, LuMailWarning } from "react-icons/lu";

export default function NewsletterConfirm() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const token = searchParams.get("token");

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `/api/newsletters/confirmation?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          toast({
            title: "Subscription confirmed",
            description: data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          setStatus("error");
          toast({
            title: "Error",
            description: data.error,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        setStatus("error");
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    confirmSubscription();
  }, [token, toast]);

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="center">
        {status === "loading" && (
          <Box textAlign="center">
            <Spinner size="xl" mb={4} color="brand.500" />
            <Heading size="lg" mb={4}>
              Confirming your subscription...
            </Heading>
            <Text color="gray.500">
              Please wait while we verify your email address.
            </Text>
          </Box>
        )}

        {status === "success" && (
          <Box textAlign="center">
            <Icon as={LuCheckCircle} w={16} h={16} color="green.500" mb={4} />
            <Heading size="lg" mb={4}>
              Subscription Confirmed!
            </Heading>
            <Text color="gray.500">
              Thank you for confirming your subscription to our newsletter.
            </Text>
            <Text color="gray.500" mt={2}>
              You will now receive our latest updates directly in your inbox.
            </Text>
          </Box>
        )}

        {status === "error" && (
          <Box textAlign="center">
            <Icon as={LuMailWarning} w={16} h={16} color="red.500" mb={4} />
            <Heading size="lg" mb={4}>
              Confirmation Failed
            </Heading>
            <Text color="gray.500">
              We couldn&apos;t confirm your subscription. The confirmation link
              might be expired or invalid.
            </Text>
            <Text color="gray.500" mt={2}>
              Please try subscribing again or contact support if the issue
              persists.
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
