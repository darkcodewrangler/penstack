import { Button, HStack, Icon, ListItem, Text } from "@chakra-ui/react";
import { LuEye } from "react-icons/lu";

export const VisibilityItem = ({ visibility }: { visibility: string }) => {
  return (
    <ListItem>
      <HStack justify="space-between">
        <HStack>
          <Text as="span" color="gray.500">
            <Icon as={LuEye} mr={1} />
            Visibility:
          </Text>
          <Text as="span" fontWeight="semibold" textTransform="capitalize">
            {visibility}
          </Text>
        </HStack>
        <Button variant="ghost" size="xs">
          Edit
        </Button>
      </HStack>
    </ListItem>
  );
};
