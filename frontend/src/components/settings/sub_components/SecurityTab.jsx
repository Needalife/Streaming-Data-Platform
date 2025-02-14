// settings/sub-components/SecurityTab.jsx
import React from "react";
import { Stack, Text, FormControl, Flex, Switch, Grid, FormLabel, Input } from "@chakra-ui/react";

const SecurityTab = ({ settings, setSettings }) => {
  return (
    <>
      <Stack spacing={6} mt={6} p={4}>
        <Text fontWeight="bold" fontSize="lg">
          Two-factor Authentication
        </Text>
        <FormControl>
          <Flex alignItems="center" gap={4}>
            <Switch
              colorScheme="blue"
              size="lg"
              isChecked={settings.twoFactorAuth}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  twoFactorAuth: e.target.checked,
                })
              }
            />
            <Text fontSize="md" color="gray.600">
              Enable or disable two-factor authentication
            </Text>
          </Flex>
        </FormControl>
      </Stack>

      <Text fontWeight="bold" fontSize="lg" mt={8} p={4}>
        Change Password
      </Text>
      <Grid templateColumns={{ base: "1fr", md: "1fr" }} gap={6} mt={4} p={4}>
        <FormControl id="currentPassword">
          <FormLabel>Current Password</FormLabel>
          <Input
            type="password"
            placeholder="********"
            size="lg"
            value={settings.currentPassword}
            onChange={(e) =>
              setSettings({ ...settings, currentPassword: e.target.value })
            }
          />
        </FormControl>
        <FormControl id="newPassword">
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            placeholder="********"
            size="lg"
            value={settings.newPassword}
            onChange={(e) =>
              setSettings({ ...settings, newPassword: e.target.value })
            }
          />
        </FormControl>
      </Grid>
    </>
  );
};

export default SecurityTab;
