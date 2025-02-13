import {
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { SiteSettings } from "@/src/types";
import { useState, useEffect } from "react";
interface EmailPanelProps {
  settings: SiteSettings;
  handleInputChange: (key: string, value: string) => void;
}

export const EmailPanel = ({
  settings,
  handleInputChange,
}: EmailPanelProps) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleShowApiKey = async () => {
    setShowApiKey(!showApiKey);
  };

  useEffect(() => {
    if (showApiKey) {
      const timer = setTimeout(() => {
        setShowApiKey(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showApiKey]);

  return (
    <VStack spacing={4} align="stretch">
      <FormControl isRequired>
        <FormLabel>Resend API Key</FormLabel>
        <FormHelperText>Your Resend API key for sending emails</FormHelperText>
        <InputGroup maxW={600}>
          <Input
            rounded="md"
            mt={2}
            type={showApiKey ? "text" : "password"}
            value={settings?.resendApiKey?.value}
            onChange={(e) => handleInputChange("resendApiKey", e.target.value)}
            placeholder="re_1234567890"
          />
          <InputRightElement width="4.5rem" mt={2}>
            <Button
              h="1.75rem"
              size="sm"
              variant={"ghost"}
              onClick={async () => await handleShowApiKey()}
            >
              {showApiKey ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>From Email</FormLabel>
        <FormHelperText>The address to send emails from</FormHelperText>
        <Input
          maxW={600}
          rounded="md"
          mt={2}
          type="email"
          value={settings.emailFrom.value}
          onChange={(e) => handleInputChange("emailFrom", e.target.value)}
          placeholder="noreply@example.com"
        />
      </FormControl>
      <FormControl>
        <FormLabel>From Name</FormLabel>
        <FormHelperText>
          The title to display in the from field of emails
        </FormHelperText>
        <Input
          mt={2}
          maxW={600}
          rounded="md"
          placeholder="My Blog"
          value={settings.emailFromName.value}
          onChange={(e) => handleInputChange("emailFromName", e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Newsletter From Email (optional)</FormLabel>
        <FormHelperText>
          The address to send newsletter emails from
        </FormHelperText>
        <Input
          maxW={600}
          mt={2}
          rounded="md"
          value={settings.newsletterEmailFrom.value}
          onChange={(e) =>
            handleInputChange("newsletterEmailFrom", e.target.value)
          }
          placeholder="newsletter@example.com"
        />
      </FormControl>
    </VStack>
  );
};
