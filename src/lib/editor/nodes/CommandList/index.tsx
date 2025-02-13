interface CommandListProps {
  items: Array<{
    title: string;
    command: (props: { editor: Editor; range: any }) => void;
  }>;
}

import { VStack, Text, Box, HStack } from "@chakra-ui/react";
import { Editor } from "@tiptap/core";
import { useState, useEffect } from "react";

export const CommandList = ({ items, command }: CommandListProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        e.preventDefault();
      }

      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % items.length);
        e.preventDefault();
      }

      if (e.key === "Enter") {
        const item = items[selectedIndex];
        if (item) {
          command(item);
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [items, selectedIndex, command]);

  return (
    <VStack
      spacing={1}
      align="stretch"
      bg="white"
      shadow="lg"
      rounded="md"
      p={2}
      maxH="300px"
      overflowY="auto"
    >
      {items.map((item, index) => (
        <Box
          key={index}
          px={4}
          py={2}
          cursor="pointer"
          bg={index === selectedIndex ? "gray.100" : "transparent"}
          _hover={{ bg: "gray.50" }}
          onClick={() => command(item)}
          rounded="md"
        >
          <HStack spacing={2}>
            <Text>{item.title}</Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};
