// settings/SettingsForm.jsx
import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Flex,
  Button,
  Heading,
} from "@chakra-ui/react";
import EditProfileTab from "./sub_components/EditProfileTab";
import PreferencesTab from "./sub_components/PreferencesTab";
import SecurityTab from "./sub_components/SecurityTab";
import { useSettings } from "./hooks/useSettings";

export default function SettingsForm() {
  const { settings, setSettings, saveSettings } = useSettings();

  const handleSave = async () => {
    // Optionally validate settings before saving using a utility function
    const success = await saveSettings();
    if (success) {
      console.log("Settings saved successfully!");
      // You might show a toast notification here
    }
  };

  return (
    <Flex
      p={{ base: 4, md: 8 }}
      flex="1"
      bg="gray.100"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      position="relative"
    >
      <Heading
        size="5xl"
        position="absolute"
        top={{ base: "20px", md: "40px" }}
        left={{ base: "20px", md: "40px" }}
        fontSize={{ base: "2xl", md: "3xl" }}
        color="gray.800"
      >
        Settings
      </Heading>
      <Box
        p={{ base: 4, md: 8 }}
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        maxW={{ base: "100%", md: "1000px", lg: "1200px" }}
        w="90%"
        minH={{ base: "600px", md: "800px" }}
        position="relative"
        pt={10}
      >
        <Tabs variant="unstyled">
          <TabList>
            <Tab
              fontSize={{ base: "md", md: "lg" }}
              borderRadius="0"
              mr="20px"
              color="gray.500"
              _focus={{ boxShadow: "none", outline: "none" }}
              _selected={{
                color: "blue.500",
                borderBottom: "4px solid",
                borderBottomColor: "blue.500",
              }}
              _hover={{ color: "blue.500", borderColor: "white" }}
            >
              Edit Profile
            </Tab>
            <Tab
              fontSize={{ base: "md", md: "lg" }}
              borderRadius="0"
              mr="20px"
              color="gray.500"
              _focus={{ boxShadow: "none", outline: "none" }}
              _selected={{
                color: "blue.500",
                borderBottom: "4px solid",
                borderBottomColor: "blue.500",
              }}
              _hover={{ color: "blue.500", borderColor: "white" }}
            >
              Preferences
            </Tab>
            <Tab
              fontSize={{ base: "md", md: "lg" }}
              borderRadius="0"
              mr="20px"
              color="gray.500"
              _focus={{ boxShadow: "none", outline: "none" }}
              _selected={{
                color: "blue.500",
                borderBottom: "4px solid",
                borderBottomColor: "blue.500",
              }}
              _hover={{ color: "blue.500", borderColor: "white" }}
            >
              Security
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <EditProfileTab settings={settings} setSettings={setSettings} />
            </TabPanel>
            <TabPanel>
              <PreferencesTab settings={settings} setSettings={setSettings} />
            </TabPanel>
            <TabPanel>
              <SecurityTab settings={settings} setSettings={setSettings} />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Flex justify="end" position="absolute" bottom="20px" right="20px">
          <Button colorScheme="blue" size="lg" onClick={handleSave}>
            Save
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
