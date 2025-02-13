"use client";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function DashHeader({
  children,
  isMinimized = false,
  showUserAvatar = false,
  ...rest
}: {
  children?: ReactNode;
  isMinimized?: boolean;
  showUserAvatar?: boolean;
  [key: string]: any;
}) {
  const bg = useColorModeValue("white", "gray.900");
  return (
    <Flex
      // ml={{ base: 0, md: isMinimized ? "var(--dash-sidebar-mini-w)" : "var(--dash-sidebar-w)" }}
      px={{ base: 4, md: 5 }}
      py={2}
      minH="12"
      maxH={"var(--dash-header-h)"}
      flexShrink={0}
      pos={"sticky"}
      top={0}
      zIndex={10}
      alignItems="center"
      bg={bg}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      {children}
    </Flex>
  );
}
