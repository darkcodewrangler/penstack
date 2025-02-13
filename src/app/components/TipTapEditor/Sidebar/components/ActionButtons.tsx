import { Button } from "@chakra-ui/react";
import { PermissionGuard } from "../../../PermissionGuard";

interface ActionButtonsProps {
  onDelete: () => void;
  onDraft: () => void;
  onPublish: () => void;
  isPublishing: boolean;
}

export const ActionButtons = ({
  onDelete,
  onDraft,
  onPublish,
  isPublishing,
}: ActionButtonsProps) => (
  <>
    <PermissionGuard requiredPermission="posts:delete">
      <Button
        size="xs"
        flex={1}
        rounded="md"
        variant="ghost"
        colorScheme="red"
        color="red.500"
        bg="red.100"
        onClick={onDelete}
      >
        Delete
      </Button>
    </PermissionGuard>
    <Button size="xs" flex={1} variant="outline" rounded="md" onClick={onDraft}>
      Save draft
    </Button>
    <PermissionGuard requiredPermission="posts:publish">
      <Button
        size="xs"
        isDisabled={isPublishing}
        isLoading={isPublishing}
        loadingText="Publishing..."
        flex={1}
        rounded="md"
        onClick={onPublish}
      >
        Publish
      </Button>
    </PermissionGuard>
  </>
);
