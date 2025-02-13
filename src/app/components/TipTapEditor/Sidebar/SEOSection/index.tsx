// SEOSection.tsx
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { FeaturedImageCard } from "@/src/app/components/TipTapEditor/FeaturedImageCard";
import { EDITOR_CONTEXT_STATE, PostInsert } from "@/src/types";
import { SlugInput } from "../components/SlugInput";
import { SummaryInput } from "../components/SummaryInput";

import { encode } from "html-entities";

export const SEOSection = ({
  activePost,
  updateField,
}: {
  activePost: EDITOR_CONTEXT_STATE["activePost"];
  updateField: EDITOR_CONTEXT_STATE["updateField"];
}) => (
  <Stack p={4}>
    <Text as="span" fontWeight={500}>
      Featured Image:
    </Text>
    <FeaturedImageCard
      onChange={(imageId) => updateField("featured_image_id", imageId)}
      image={activePost?.featured_image || null}
    />
    <SlugInput
      slug={activePost?.slug || ""}
      onChange={(val) => updateField("slug", val)}
    />
    <SummaryInput
      summary={activePost?.summary || ""}
      onChange={(val) => updateField("summary", encode(val))}
    />
  </Stack>
);
