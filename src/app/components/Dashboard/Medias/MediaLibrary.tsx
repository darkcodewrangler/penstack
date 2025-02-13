import React, { useEffect, useState } from "react";
import { MediaCard } from "./MediaCard";
import { MediaFilter } from "./MediaFilter";
import {
  Box,
  Button,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { FilterParams, MediaResponse, PaginatedResponse } from "@/src/types";
import axios from "axios";
import Loader from "../../Loader";
import { objectToQueryParams } from "@/src/utils";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../Pagination";

interface MediaLibraryProps {
  onSelect?: (media: MediaResponse | MediaResponse[]) => void;
  multiple?: boolean;
  defaultFilters?: Partial<FilterParams>;
  maxSelection?: number;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  multiple = false,
  defaultFilters = {},
  maxSelection,
}) => {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 12,
    ...defaultFilters,
  });
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse[]>([]);

  const { data: media, refetch } = useQuery({
    queryKey: ["media", filters],
    queryFn: fetchMedia,
    refetchOnWindowFocus: false,
  });
  const { data: folders } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const boxBgColor = useColorModeValue("white", "gray.700");

  async function fetchFolders() {
    try {
      const { data } = await axios<{ data: string[] }>(`/api/media/folders`);

      return data.data;
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  }
  async function fetchMedia() {
    setLoading(true);
    try {
      const { data: media } = await axios<PaginatedResponse<MediaResponse>>(
        `/api/media?${objectToQueryParams(filters || {})}`
      );

      return media;
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handleSelect = (media: MediaResponse) => {
    if (multiple) {
      setSelectedMedia((prev) => {
        const isSelected = prev.find((m) => m.id === media.id);
        if (isSelected) {
          return prev.filter((m) => m.id !== media.id);
        }
        if (maxSelection && prev.length >= maxSelection) {
          return [...prev.slice(1), media];
        }
        return [...prev, media];
      });
    } else {
      setSelectedMedia([media]);
      onSelect?.(media);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple) {
      onSelect?.(selectedMedia);
    } else {
      onSelect?.(selectedMedia[0]);
    }
  };
  useEffect(() => {
    setSelectedMedia([]);
  }, [filters]);
  return (
    <Box className="space-y-6" minH={400}>
      <MediaFilter
        onFilterChange={handleFilterChange}
        folders={folders as string[]}
        refetchMedia={refetch}
      />

      {loading && (
        <VStack justify={"center"} py={12}>
          <Loader />
        </VStack>
      )}

      {!loading && media && media?.data?.length === 0 && (
        <VStack justify={"center"} py={12}>
          <Text color={"gray.400"} fontWeight={500}>
            No medias found
          </Text>
        </VStack>
      )}
      {!loading && media && media?.data?.length > 0 && (
        <>
          <Grid
            rounded={"lg"}
            p={{ base: 3, md: 4 }}
            templateColumns={{
              base: "repeat(auto-fill, minmax(250px, 1fr))",
              md: "repeat(auto-fill, minmax(250px, 250px))",
            }}
            gap={4}
          >
            {media?.data.length > 0 &&
              media?.data.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  onSelect={handleSelect}
                  selected={!!selectedMedia.find((m) => m.id === item.id)}
                />
              ))}
          </Grid>
          <Pagination
            currentPage={media.meta.page}
            totalPages={media.meta.totalPages}
            onPageChange={(page) => {
              setFilters((prev) => ({
                ...prev,
                page,
              }));
            }}
            isLoading={loading}
          />
        </>
      )}
      {selectedMedia.length > 0 && (
        <Box
          bottom={"env(safe-area-inset-bottom,0px)"}
          pos={"sticky"}
          borderTop={"1"}
          bg={boxBgColor}
          shadow="lg"
          left={0}
          right={0}
          p={4}
          rounded={"md"}
        >
          <HStack
            direction={{ base: "column", md: "row" }}
            maxW={"7xl"}
            mx={"auto"}
            justify={"space-between"}
          >
            {multiple && (!maxSelection || maxSelection > 1) && (
              <Text>{selectedMedia.length} items selected</Text>
            )}
            <HStack
              gap={4}
              flex={1}
              justify={"end"}
              align={"stretch"}
              wrap={"wrap"}
            >
              <Button
                rounded={"md"}
                onClick={() => setSelectedMedia([])}
                colorScheme="red"
                leftIcon={<LuTrash2 />}
                variant="outline"
              >
                Clear
              </Button>
              <Button rounded={"md"} onClick={handleConfirmSelection}>
                Confirm Selection
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
};
