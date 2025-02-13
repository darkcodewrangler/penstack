import { Button } from "@chakra-ui/react";
import { PermissionGuard } from "../../../PermissionGuard";
import { PublishActionsProps } from "../types";

export const PublishActions = ({
  onDraft,
  onPublish,
  onDelete,
  isPublishing,
}: PublishActionsProps) => {
  return (
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
      <Button
        size="xs"
        flex={1}
        variant="outline"
        rounded="md"
        onClick={onDraft}
      >
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
};
