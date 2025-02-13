import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Box,
  Container,
  HStack,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Divider,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  Hide,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  LuMenu,
  LuChevronDown,
  LuGithub,
  LuTwitter,
  LuSearch,
} from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { LightDarkModeSwitch } from "../LightDarkModeSwitch";
import { AuthButtons } from "./AuthButtons";
import { useCategories } from "@/src/hooks/useCategories";
import { AppLogo } from "../AppLogoAndName/AppLogo";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteConfig } from "@/src/context/SiteConfig";
import { useQueryState } from "nuqs";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchValue, setSearchValue] = useState("");
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const navLinkHoverColor = useColorModeValue("brand.500", "brand.300");
  const siteConfig = useSiteConfig();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 60],
    [
      useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(26, 32, 44, 0.3)"),
      useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)"),
    ]
  );
  const navLinkColorBeforeScroll = useTransform(
    scrollY,
    [0, 60],
    [
      useColorModeValue("rgba(255, 255, 255, 0.2)", "rgba(26, 32, 44, 0.3)"),
      useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(26, 32, 44, 0.9)"),
    ]
  );
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);
  const backdrop = useTransform(scrollY, [0, 60], ["none", "blur(10px"]) as any;
  const canFetchCategories = useBreakpointValue({ base: isOpen, md: true });
  const { data } = useCategories({
    limit: 5,
    canFetch: canFetchCategories,
    hasPostsOnly: true,
  });
  const categories = data?.results;

  const resources = [
    { name: "Articles", href: "/articles" },
    { name: "Tutorials", href: "/resources/tutorials" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "About", href: "/about" },
  ];
  const router = useRouter();
  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search");
    router.push(`/search?q=${searchQuery}`);
  }
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchValue(value);
  }
  function isActiveUrl(url: string) {
    return pathname === url;
  }
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor,
      }}
    >
      <Box
        as={motion.header}
        style={{
          borderBottom: useTransform(borderOpacity, (opacity) =>
            opacity === 0 ? "none" : `1px solid ${borderColor}`
          ),
          backdropFilter: backdrop,
        }}
        transition="all 0.3s ease-in-out"
      >
        <Container maxW="container.2xl" py={"6px"}>
          <HStack justify="space-between" align="center">
            <HStack as={Link} href="/">
              <AppLogo src={siteConfig?.siteLogo?.value} size={"30px"} />
              <Text
                hideBelow={"md"}
                as={"span"}
                fontSize={{ base: "medium", lg: "large" }}
                fontWeight="medium"
              >
                {siteConfig?.siteName?.value}
              </Text>
            </HStack>

            <HStack
              align="center"
              spacing={4}
              display={{ base: "none", xl: "flex" }}
              py={"6px"}
            >
              <Link
                textTransform="capitalize"
                fontWeight={500}
                href={"/"}
                color={isActiveUrl("/") ? navLinkHoverColor : "inherit"}
                borderBottom={"2px solid"}
                borderBottomColor={
                  isActiveUrl("/") ? navLinkHoverColor : "transparent"
                }
                px={2}
                py={1}
                _hover={{
                  borderColor: navLinkHoverColor,
                  color: navLinkHoverColor,
                }}
              >
                Home
              </Link>

              {resources.map((resource) => (
                <Link
                  key={resource.name}
                  fontFamily={"var(--font-heading)"}
                  textTransform="capitalize"
                  fontWeight={500}
                  href={resource.href}
                  px={2}
                  py={1}
                  color={
                    isActiveUrl(resource.href) ? navLinkHoverColor : "inherit"
                  }
                  borderBottom={"2px solid"}
                  borderBottomColor={
                    isActiveUrl(resource.href)
                      ? navLinkHoverColor
                      : "transparent"
                  }
                  _hover={{
                    borderColor: navLinkHoverColor,
                    color: navLinkHoverColor,
                  }}
                >
                  {resource.name}
                </Link>
              ))}
              <Menu>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      as={Button}
                      rounded={"none"}
                      textTransform="capitalize"
                      fontWeight={500}
                      size="sm"
                      colorScheme="black"
                      variant="ghost"
                      _hover={{
                        borderColor: navLinkHoverColor,
                        color: navLinkHoverColor,
                      }}
                      borderBottom={"2px solid"}
                      borderBottomColor={"transparent"}
                    >
                      <HStack>
                        <Text>Categories</Text>
                        <Icon
                          as={LuChevronDown}
                          transition={"0.2s ease-out"}
                          transform={
                            isOpen ? "rotate(-180deg)" : "rotate(0deg)"
                          }
                        />
                      </HStack>
                    </MenuButton>
                    <MenuList rounded="lg">
                      {categories &&
                        categories?.length > 0 &&
                        categories.map((topic) => (
                          <MenuItem
                            key={topic.name}
                            as={Link}
                            href={`/category/${topic.slug}`}
                          >
                            {topic.name}
                          </MenuItem>
                        ))}
                    </MenuList>
                  </>
                )}
              </Menu>
            </HStack>

            <HStack spacing={4} align={"center"}>
              <IconButton
                display={{ base: "none", lg: "flex" }}
                as={Link}
                href="/search"
                aria-label="Search"
                colorScheme="gray"
                rounded={"full"}
                icon={<LuSearch size={16} />}
                variant="ghost"
              />

              <HStack spacing={2} display={{ base: "none", lg: "flex" }}>
                <Hide below="lg">
                  <LightDarkModeSwitch />
                </Hide>
                <AuthButtons />
              </HStack>
              <Hide above="lg">
                <AuthButtons />
              </Hide>

              <IconButton
                // colorScheme="black"
                display={{ base: "flex", xl: "none" }}
                aria-label="Open menu"
                icon={<LuMenu size={20} />}
                onClick={onOpen}
                variant="ghost"
                _hover={{ bg: hoverBgColor }}
              />
            </HStack>
          </HStack>
        </Container>

        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody>
              <VStack align="stretch" spacing={4}>
                <Text fontWeight="bold" color={textColor}>
                  Categories
                </Text>
                {categories &&
                  categories?.length > 0 &&
                  categories.map((topic) => (
                    <Button
                      key={topic.name}
                      rounded={"full"}
                      as={Link}
                      href={`/category/${topic.slug}`}
                      variant="ghost"
                      justifyContent="flex-start"
                      w="full"
                      onClick={onClose}
                    >
                      {topic.name}
                    </Button>
                  ))}

                <Divider />

                <Text fontWeight="bold" color={textColor}>
                  Resources
                </Text>
                {resources.map((resource) => (
                  <Button
                    key={resource.name}
                    rounded={"full"}
                    as={Link}
                    href={resource.href}
                    variant="ghost"
                    justifyContent="flex-start"
                    w="full"
                    onClick={onClose}
                  >
                    {resource.name}
                  </Button>
                ))}

                <Divider />

                <Button
                  rounded={"full"}
                  as={Link}
                  href="/search"
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                  onClick={onClose}
                >
                  Search
                </Button>

                <AuthButtons />
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </motion.div>
  );
};

export default Header;
