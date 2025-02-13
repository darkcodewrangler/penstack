import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
} from "@chakra-ui/react";
import { SiteSettings } from "@/src/types";

interface AdvancedPanelProps {
  settings: SiteSettings;
  handleInputChange: (key: string, value: string) => void;
}

export const AdvancedPanel = ({
  settings,
  handleInputChange,
}: AdvancedPanelProps) => {
  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>API Rate Limit</FormLabel>
        <Input
          maxW={600}
          rounded="md"
          type="number"
          value={settings.apiRateLimit.value}
          onChange={(e) => handleInputChange("apiRateLimit", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Cache Duration (minutes)</FormLabel>
        <Input
          maxW={600}
          rounded="md"
          type="number"
          value={settings.cacheDuration.value}
          onChange={(e) => handleInputChange("cacheDuration", e.target.value)}
        />
      </FormControl>
      <Box>
        <Button colorScheme="red" variant="outline">
          Clear Cache
        </Button>
      </Box>
    </VStack>
  );
};
