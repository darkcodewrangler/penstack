"use client";

import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Button,
  useToast,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { SiteSettings } from "@/src/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import DashHeader from "../../../Dashboard/Header";
import Loader from "@/src/app/components/Loader";
import { MediaModal } from "@/src/app/components/Dashboard/Medias/MediaModal";
import { GeneralPanel } from "./TabPanels/GeneralPanel";
import { AnalyticsPanel } from "./TabPanels/AnalyticsPanel";
import { MonitoringPanel } from "./TabPanels/MonitoringPanel";
import { MediaPanel } from "./TabPanels/MediaPanel";
import { EmailPanel } from "./TabPanels/EmailPanel";
import { AdvancedPanel } from "./TabPanels/AdvancedPanel";
import { PageTitleHeader } from "../../../Dashboard/PageTitleCard";
import { useSiteConfig } from "@/src/context/SiteConfig";

export default function DashboardSettingsPage() {
  const toast = useToast({ position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const settingsContext = useSiteConfig();
  const [settings, setSettings] = useState<SiteSettings>(settingsContext);
  const queryClient = useQueryClient();
  const [hasChanges, setHasChanges] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const tabHoverBg = useColorModeValue("gray.100", "gray.900");
  const tabActiveBg = useColorModeValue("brand.100", "brand.900");
  const tabActiveColor = useColorModeValue("brand.600", "brand.300");
  const tabActiveHoverBg = useColorModeValue("brand.200", "brand.800");

  const [originalSettings, setOriginalSettings] =
    useState<SiteSettings>(settingsContext);
  const [currentMediaField, setCurrentMediaField] = useState<
    "siteLogo" | "siteFavicon" | "siteOpengraph" | null
  >(null);

  const { data, isFetching } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  async function fetchSettings() {
    try {
      const { data } = await axios<{ data: SiteSettings; message?: string }>(
        "/api/settings"
      );
      const fetchedData = data.data;
      setSettings({ ...fetchedData });
      setOriginalSettings({ ...fetchedData });
      return data?.data;
    } catch (error) {
      toast({
        title: "Failed to load settings",
        status: "error",
        duration: 3000,
      });
    }
  }

  useEffect(() => {
    const settingsChanged =
      JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(settingsChanged);
  }, [settings, originalSettings]);

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const handleMediaSelect = (url: string) => {
    if (currentMediaField) {
      handleInputChange(currentMediaField, url);
    }
    onClose();
    setCurrentMediaField(null);
  };

  const openMediaModal = (
    field: "siteLogo" | "siteFavicon" | "siteOpengraph"
  ) => {
    setCurrentMediaField(field);
    onOpen();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { status } = await axios.post("/api/settings", settings);

      if (status < 200 || status >= 400)
        throw new Error("Failed to save settings");

      setOriginalSettings({ ...settings });
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Settings saved successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to save settings",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <Loader loadingText="Loading settings" />;
  }

  return (
    <Box>
      <DashHeader />
      <Container maxW="container.2xl" p={{ base: 4, md: 5 }}>
        <Card>
          <PageTitleHeader title={"Settings"}>
            <Button
              isLoading={isLoading}
              onClick={handleSave}
              rounded="md"
              isDisabled={!hasChanges}
            >
              Save Changes
            </Button>
          </PageTitleHeader>

          <CardBody>
            {hasChanges && (
              <Alert status="info" colorScheme="brand" mb={4} rounded="md">
                <AlertIcon />
                You have unsaved changes
              </Alert>
            )}

            <Tabs>
              <TabList overflowX="auto" className="no-scrollbar" pb={1} gap={3}>
                <Tab>General</Tab>
                <Tab>Analytics</Tab>
                <Tab>Monitoring</Tab>
                <Tab>Media</Tab>
                <Tab>Email</Tab>
                <Tab>Advanced</Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={2}>
                  <GeneralPanel
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleToggle={handleToggle}
                    openMediaModal={openMediaModal}
                  />
                </TabPanel>
                <TabPanel>
                  <AnalyticsPanel
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleToggle={handleToggle}
                  />
                </TabPanel>
                <TabPanel>
                  <MonitoringPanel
                    settings={settings}
                    handleInputChange={handleInputChange}
                    handleToggle={handleToggle}
                  />
                </TabPanel>
                <TabPanel>
                  <MediaPanel
                    settings={settings}
                    handleInputChange={handleInputChange}
                  />
                </TabPanel>
                <TabPanel>
                  <EmailPanel
                    settings={settings}
                    handleInputChange={handleInputChange}
                  />
                </TabPanel>
                <TabPanel>
                  <AdvancedPanel
                    settings={settings}
                    handleInputChange={handleInputChange}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>
      <MediaModal
        isOpen={isOpen}
        onClose={onClose}
        multiple={false}
        maxSelection={1}
        onSelect={(media) => {
          if (!Array.isArray(media)) handleMediaSelect(media.url);
        }}
      />
    </Box>
  );
}
