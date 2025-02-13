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

interface MonitoringPanelProps {
  settings: SiteSettings;
  handleInputChange: (key: string, value: string) => void;
  handleToggle: (key: string) => void;
}

export const MonitoringPanel = ({
  settings,
  handleInputChange,
  handleToggle,
}: MonitoringPanelProps) => {
  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Sentry DSN</FormLabel>
        <HStack mb={1}>
          <Text>{settings.sentryDsn.enabled ? "Enabled" : "Disabled"}</Text>
          <Switch
            isDisabled={!settings.sentryDsn.value}
            isChecked={settings.sentryDsn.enabled}
            onChange={() => handleToggle("sentryDsn")}
          />
        </HStack>
        <Input
          maxW={600}
          rounded="md"
          value={settings.sentryDsn.value}
          onChange={(e) => handleInputChange("sentryDsn", e.target.value)}
          placeholder="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel mb={0}>Enable Error Tracking</FormLabel>
        <Switch
          isChecked={settings.errorTracking.enabled}
          onChange={() => handleToggle("errorTracking")}
        />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel mb={0}>Enable Performance Monitoring</FormLabel>
        <Switch
          isChecked={settings.performanceMonitoring.enabled}
          onChange={() => handleToggle("performanceMonitoring")}
        />
      </FormControl>
    </VStack>
  );
};
