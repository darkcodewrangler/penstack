import { FilterParams, MediaResponse } from "@/src/types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { Heading } from "@react-email/components";
import { FC, PropsWithChildren } from "react";
import Medias from ".";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxSelection?: number;
  defaultFilters?: Partial<FilterParams>;multiple?:boolean;
  onSelect?: (media: MediaResponse | MediaResponse[]) => void;
}
export const MediaModal: FC<PropsWithChildren<MediaModalProps>> = ({
  isOpen,
  onClose,
  maxSelection,
  children,multiple,
  defaultFilters = {},
  onSelect,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      isCentered
      onClose={onClose}
      size={{ base: "md", md: "3xl", lg: "5xl", xl: "6xl" }}
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading>Select Media</Heading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody px={{ base: 0, md: undefined }}>
          {children ? (
            children
          ) : (
            <>
              <Medias multiple={multiple}
                defaultFilters={defaultFilters}
                maxSelection={maxSelection}
                onSelect={(media: MediaResponse | MediaResponse[]) => {
                  onSelect?.(media);
                  onClose();
                }}
              />
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
