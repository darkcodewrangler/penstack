import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  ChakraComponent,
  ComponentWithAs,
} from "@chakra-ui/react";
import React, {
  Component,
  FunctionComponent,
  JSX,
  ReactElement,
  ReactNode,
} from "react";

export const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,

  title = "Delete",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onConfirm: () => void;
}) => {
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  function handleActionConfirm() {
    onConfirm?.();
  }
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme="gray">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleActionConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
