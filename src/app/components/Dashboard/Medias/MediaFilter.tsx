import React from "react";
import { LuRefreshCw, LuRotate3D, LuSearch } from "react-icons/lu";
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { FilterParams, MediaType } from "@/src/types";

interface MediaFilterProps {
  onFilterChange: (filters: Partial<FilterParams>) => void;
  folders: string[];
  refetchMedia: () => void;
}

export const MediaFilter: React.FC<MediaFilterProps> = ({
  onFilterChange,
  refetchMedia,
  folders,
}) => {
  return (
    <HStack
      py={4}
      gap={4}
      wrap={{ base: "wrap", xl: "nowrap" }}
      justify={"space-between"}
    >
      <InputGroup maxW={500}>
        <InputLeftAddon roundedLeft={"md"}>
          <LuSearch />
        </InputLeftAddon>
        <Input
          roundedRight={"md"}
          placeholder="Search media..."
          className="pl-10"
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </InputGroup>
      <HStack gap={4} wrap={{ base: "wrap", md: "nowrap" }}>
        <Select
          rounded={"md"}
          onChange={(e) =>
            onFilterChange({
              type: e.target.value as MediaType,
            })
          }
        >
          <>
            <option value="">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDF</option>
            <option value="doc">Documents</option>
          </>
        </Select>

        <Select
          rounded={"md"}
          onChange={(e) =>
            onFilterChange({ folder: e.target.value || undefined })
          }
        >
          <option value="">All folders</option>
          {folders?.length > 0 &&
            folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
        </Select>

        <Select
          rounded={"md"}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) return;
            onFilterChange({
              sortBy: value.split("-")[0] as "created_at" | "name" | "size",
              sortOrder: value.split("-")[1] as "asc" | "desc",
            });
          }}
        >
          <option value="">Sort by</option>
          <option value="created_at-desc">Newest first</option>
          <option value="created_at-asc">Oldest first</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="size-desc">Largest first</option>
          <option value="size-asc">Smallest first</option>
        </Select>
        <Button
          flexShrink={0}
          ml="auto"
          size={"sm"}
          rounded={"md"}
          leftIcon={<LuRefreshCw />}
          onClick={() => {
            refetchMedia?.();
          }}
        >
          Refresh
        </Button>
      </HStack>
    </HStack>
  );
};
