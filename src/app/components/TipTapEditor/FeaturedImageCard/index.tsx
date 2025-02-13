import {
  Box,
  Flex,
  Image,
  useColorModeValue,
  Text,
  Stack,
  IconButton,
  Tooltip,
  useDisclosure,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useState, useCallback, memo } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import isEmpty from "just-is-empty";
import { MediaResponse } from "@/src/types";
import { MediaModal } from "../../Dashboard/Medias/MediaModal";

export const FeaturedImageCard = ({
  image,
  onChange,
}: {
  image: { url: string; alt_text?: string; caption?: string } | null;
  onChange: (imageId: number | null) => void;
}) => {
  const borderColor = useColorModeValue("gray.400", "gray.700");
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.500", "gray.200");
  const [featuredImage, setFeaturedImage] =
    useState<Partial<MediaResponse | null>>(image);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleImageSelect = useCallback(
    (media: MediaResponse | MediaResponse[]) => {
      if (Array.isArray(media) && media.length > 0) {
        setFeaturedImage(media[0]);
        onChange(media[0]?.id);
      }
    },
    [onChange]
  );

  const handleImageRemove = useCallback(() => {
    setFeaturedImage(null);
    onChange(null);
  }, [onChange]);

  return (
    <Box mb={3}>
      <Flex
        mb={3}
        pos="relative"
        borderWidth={isEmpty(featuredImage?.url) ? "1px" : "0"}
        borderStyle={isEmpty(featuredImage?.url) ? "dashed" : "none"}
        borderColor={isEmpty(featuredImage?.url) ? borderColor : "transparent"}
        bg={bgColor}
        rounded="md"
        h="157.5px"
        w="full"
        aspectRatio="2:1"
        maxW="350px"
      >
        {!isEmpty(featuredImage?.url) ? (
          <>
            <Image
              src={featuredImage?.url}
              alt={featuredImage?.alt_text || "featured image"}
              h="100%"
              w="full"
              objectFit="cover"
            />
            <Tooltip label="Remove image" hasArrow placement="top" rounded="md">
              <IconButton
                zIndex={9}
                pos="absolute"
                top={1}
                right={2}
                aria-label="Remove featured image"
                size="sm"
                colorScheme="red"
                onClick={handleImageRemove}
              >
                <LuTrash2 />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Stack justify="center" align="center" h="100%" w="full">
            <Text
              px={2}
              as="span"
              color={textColor}
              fontSize="14px"
              fontWeight={500}
              textAlign="center"
            >
              (Recommended size: 1200x630)
            </Text>
          </Stack>
        )}
      </Flex>
      <HStack justify={"flex-end"}>
        <Button
          size="sm"
          onClick={onOpen}
          variant={"ghost"}
          rounded="full"
          leftIcon={!featuredImage?.url ? <LuPlus size={18} /> : undefined}
          // w="full"
        >
          <Text as="span">
            {featuredImage?.url ? "Change image" : "Add featured image"}
          </Text>
        </Button>
      </HStack>

      <MediaModal
        onClose={onClose}
        isOpen={isOpen}
        maxSelection={1}
        defaultFilters={{ type: "image" }}
        onSelect={handleImageSelect}
      />
    </Box>
  );
};

FeaturedImageCard.displayName = "FeaturedImageCard";
