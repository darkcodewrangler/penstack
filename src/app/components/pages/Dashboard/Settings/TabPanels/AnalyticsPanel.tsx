import {
  VStack,
  FormControl,
  FormLabel,
  HStack,
  Text,
  Switch,
  Input,
} from "@chakra-ui/react";
import { SiteSettings } from "@/src/types";

interface AnalyticsPanelProps {
  settings: SiteSettings;
  handleInputChange: (key: string, value: string) => void;
  handleToggle: (key: string) => void;
}

export const AnalyticsPanel = ({
  settings,
  handleInputChange,
  handleToggle,
}: AnalyticsPanelProps) => {
  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Google Analytics 4 Measurement ID</FormLabel>
        <HStack mb={1}>
          <Text>{settings.gaId.enabled ? "Enabled" : "Disabled"}</Text>
          <Switch
            isDisabled={!settings.gaId.value}
            isChecked={settings.gaId.enabled}
            onChange={() => handleToggle("gaId")}
          />
        </HStack>
        <Input
          maxW={600}
          rounded="md"
          value={settings.gaId.value}
          onChange={(e) => handleInputChange("gaId", e.target.value)}
          placeholder="G-XXXXXXXXXX"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Google Tag Manager ID</FormLabel>
        <HStack mb={1}>
          <Text>{settings.gtmId.enabled ? "Enabled" : "Disabled"}</Text>
          <Switch
            isDisabled={!settings.gtmId.value}
            isChecked={settings.gtmId.enabled}
            onChange={() => handleToggle("gtmId")}
          />
        </HStack>
        <Input
          maxW={600}
          rounded="md"
          value={settings.gtmId.value}
          onChange={(e) => handleInputChange("gtmId", e.target.value)}
          placeholder="GTM-XXXXXXX"
        />
      </FormControl>
      <FormControl>
        <FormLabel>PostHog API Key</FormLabel>
        <HStack mb={1}>
          <Text>{settings.posthogKey.enabled ? "Enabled" : "Disabled"}</Text>
          <Switch
            isDisabled={!settings.posthogKey.value}
            isChecked={settings.posthogKey.enabled}
            onChange={() => handleToggle("posthogKey")}
          />
        </HStack>
        <Input
          maxW={600}
          rounded="md"
          value={settings.posthogKey.value}
          onChange={(e) => handleInputChange("posthogKey", e.target.value)}
          placeholder="phc_XXXXXXXXXXXXXXXXXX"
        />
      </FormControl>
    </VStack>
  );
};
