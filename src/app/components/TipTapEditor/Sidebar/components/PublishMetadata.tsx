import { useCustomEditorContext } from "@/src/context/AppEditor";
import { Box, List, Stack, useDisclosure } from "@chakra-ui/react";
import { CommentsToggle } from "./CommentsToggle";
import { MetricsItem } from "./MetricsItem";
import { PinnedToggle } from "./PinnedToggle";
import { ScheduleItem } from "./ScheduleItem";
import { StatusItem } from "./StatusItem";
import { VisibilityItem } from "./VisibilityItem";
import { EDITOR_CONTEXT_STATE } from "@/src/types";

export interface PublishMetadataProps {
  activePost: EDITOR_CONTEXT_STATE["activePost"];
}

export const PublishMetadata = ({ activePost }: PublishMetadataProps) => {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { updateField } = useCustomEditorContext();
  return (
    <Box p={4} pb={0}>
      <Stack as={List} fontSize={14} gap={2}>
        <StatusItem status={activePost?.status as string} />
        <VisibilityItem visibility={activePost?.visibility as string} />
        <ScheduleItem
          scheduledAt={activePost?.scheduled_at as Date}
          isOpen={isOpen}
          onClose={onClose}
          onToggle={onToggle}
        />
        <MetricsItem />
        <CommentsToggle
          allowComments={activePost?.allow_comments as boolean}
          onChange={() =>
            updateField("allow_comments", !activePost?.allow_comments)
          }
        />
        <PinnedToggle
          isSticky={activePost?.is_sticky as boolean}
          onChange={() => updateField("is_sticky", !activePost?.is_sticky)}
        />
      </Stack>
    </Box>
  );
};
