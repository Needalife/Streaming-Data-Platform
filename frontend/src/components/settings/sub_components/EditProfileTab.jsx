// settings/sub-components/EditProfileTab.jsx
import React from "react";
import {
  Flex,
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  IconButton,
} from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";

const EditProfileTab = ({ settings, setSettings }) => {
  return (
    <Flex alignItems="flex-start" mb={6}>
      <Avatar size={{ base: "lg", md: "2xl" }} src="avatar-1.jpg" mt={6} />
      <IconButton
        aria-label="Edit avatar"
        icon={<FiEdit2 color="white" />}
        ml={-12}
        mt={100}
        bg="blue.500"
        borderRadius="full"
        boxShadow="md"
        size={{ base: "md", md: "lg" }}
        _hover={{ bg: "blue.600" }}
      />
      <Box ml={4} flex="1">
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} p={4}>
          <FormControl id="name">
            <FormLabel>Your Name</FormLabel>
            <Input
              placeholder="Your name"
              size="lg"
              value={settings.name}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="username">
            <FormLabel>User Name</FormLabel>
            <Input
              placeholder="Your user name"
              size="lg"
              value={settings.username}
              onChange={(e) =>
                setSettings({ ...settings, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Your email"
              size="lg"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Your password"
              size="lg"
              value={settings.password}
              onChange={(e) =>
                setSettings({ ...settings, password: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="dob">
            <FormLabel>Date of Birth</FormLabel>
            <Input
              type="date"
              size="lg"
              value={settings.dob}
              onChange={(e) =>
                setSettings({ ...settings, dob: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="address">
            <FormLabel>Address</FormLabel>
            <Input
              placeholder="Your address"
              size="lg"
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="city">
            <FormLabel>City</FormLabel>
            <Input
              placeholder="Your city"
              size="lg"
              value={settings.city}
              onChange={(e) =>
                setSettings({ ...settings, city: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="country">
            <FormLabel>Country</FormLabel>
            <Input
              placeholder="Your Country"
              size="lg"
              value={settings.country}
              onChange={(e) =>
                setSettings({ ...settings, country: e.target.value })
              }
            />
          </FormControl>
        </Grid>
      </Box>
    </Flex>
  );
};

export default EditProfileTab;
