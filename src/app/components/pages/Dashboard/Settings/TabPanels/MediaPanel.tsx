import { VStack, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { SiteSettings } from "@/src/types";

interface MediaPanelProps {
  settings: SiteSettings;
  handleInputChange: (key: string, value: string) => void;
}

export const MediaPanel = ({
  settings,
  handleInputChange,
}: MediaPanelProps) => {
  return (
    <VStack spacing={6} align="stretch">
      <FormControl isRequired>
        <FormLabel>Cloudinary Cloud Name</FormLabel>
        <Input
          maxW={600}
          rounded="md"
          value={settings.cloudinaryName.value}
          onChange={(e) => handleInputChange("cloudinaryName", e.target.value)}
          placeholder="your-cloud-name"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Max Upload Size (MB)</FormLabel>
        <Input
          maxW={600}
          rounded="md"
          type="number"
          value={settings.maxUploadSize.value}
          onChange={(e) => handleInputChange("maxUploadSize", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Default Media Folder</FormLabel>
        <Input
          maxW={600}
          rounded="md"
          value={settings.defaultMediaFolder.value}
          onChange={(e) =>
            handleInputChange("defaultMediaFolder", e.target.value)
          }
          placeholder="uploads"
        />
      </FormControl>
    </VStack>
  );
};
