// settings/sub-components/PreferencesTab.jsx
import React from "react";
import { Grid, FormControl, FormLabel, Select, Stack, Switch } from "@chakra-ui/react";

const PreferencesTab = ({ settings, setSettings }) => {
  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} p={4}>
        <FormControl>
          <FormLabel>Currency</FormLabel>
          <Select
            placeholder="Select Currency"
            size="lg"
            value={settings.currency}
            onChange={(e) =>
              setSettings({ ...settings, currency: e.target.value })
            }
          >
            <option>US Dollar</option>
            <option>Euro</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Time Zone</FormLabel>
          <Select
            placeholder="Select Time Zone"
            size="lg"
            value={settings.timeZone}
            onChange={(e) =>
              setSettings({ ...settings, timeZone: e.target.value })
            }
          >
            <option>(GMT+00:00) UTC</option>
            <option>(GMT-08:00) Pacific Time</option>
          </Select>
        </FormControl>
      </Grid>
      <Stack spacing={6} mt={6} p={4}>
        <FormControl display="flex" alignItems="center">
          <FormLabel mb={0}>Notification</FormLabel>
          <Switch
            colorScheme="blue"
            size="lg"
            isChecked={settings.notification}
            onChange={(e) =>
              setSettings({ ...settings, notification: e.target.checked })
            }
          />
        </FormControl>
      </Stack>
    </>
  );
};

export default PreferencesTab;
