import { useCustomEditorContext } from "@/src/context/AppEditor";
import { EDITOR_CONTEXT_STATE } from "@/src/types";
import { Box, Text } from "@chakra-ui/react";
import { FeaturedImageCard } from "../../FeaturedImageCard";

export const FeaturedImageSection = ({
  activePost,
}: {
  activePost: EDITOR_CONTEXT_STATE["activePost"];
}) => {
  const { updateField } = useCustomEditorContext();

  return (
    <Box>
      <Text as="span" fontWeight={500}>
        Featured Image:
      </Text>
      <FeaturedImageCard
        onChange={(imageId) => {
          updateField("featured_image_id", imageId);
        }}
        image={activePost?.featured_image || null}
      />
    </Box>
  );
};
