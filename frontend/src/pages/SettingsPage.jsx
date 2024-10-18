import React from 'react';
import {
  Tabs, TabList, TabPanels, Tab, TabPanel,
  FormControl, FormLabel, Input, Select, Switch,
  Box, Button, Flex, Stack, Heading, Grid, Avatar, IconButton,
  Text,
} from '@chakra-ui/react';
import { FiEdit2 } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <Flex p={8} flex="1" bg="gray.50" alignItems="center" justifyContent="center" minH="100vh" position="relative">
      <Heading size="xl" position="absolute" top="20px" left="40px">
        Settings
      </Heading>
      <Box
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        maxW="1200px"
        w="90%"
        minH="800px"
        position="relative"
        pt={10}
      >
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab fontSize="lg">Edit Profile</Tab>
            <Tab fontSize="lg">Preferences</Tab>
            <Tab fontSize="lg">Security</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <Flex alignItems="center" mb={6}>
                <Avatar size="2xl" src="avatar-1.jpg" />
                <IconButton
                  aria-label="Edit avatar"
                  icon={<FiEdit2 />}
                  ml={-12} mt={6}
                  bg="white"
                  borderRadius="full"
                  boxShadow="md"
                  size="lg"
                />
              </Flex>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} p={4}>
                <FormControl id="name">
                  <FormLabel fontSize="lg">Your Name</FormLabel>
                  <Input placeholder="John Doe" size="lg" />
                </FormControl>
                <FormControl id="username">
                  <FormLabel fontSize="lg">User Name</FormLabel>
                  <Input placeholder="johndoe123" size="lg" />
                </FormControl>
                <FormControl id="email">
                  <FormLabel fontSize="lg">Email</FormLabel>
                  <Input type="email" placeholder="johndoe@example.com" size="lg" />
                </FormControl>
                <FormControl id="password">
                  <FormLabel fontSize="lg">Password</FormLabel>
                  <Input type="password" placeholder="********" size="lg" />
                </FormControl>
                <FormControl id="presentAddress">
                  <FormLabel fontSize="lg">Present Address</FormLabel>
                  <Input placeholder="123 Main St" size="lg" />
                </FormControl>
                <FormControl id="city">
                  <FormLabel fontSize="lg">City</FormLabel>
                  <Input placeholder="New York" size="lg" />
                </FormControl>
                <FormControl id="postalCode">
                  <FormLabel fontSize="lg">Postal Code</FormLabel>
                  <Input placeholder="10001" size="lg" />
                </FormControl>
                <FormControl id="country">
                  <FormLabel fontSize="lg">Country</FormLabel>
                  <Input placeholder="United States" size="lg" />
                </FormControl>
              </Grid>
            </TabPanel>
            
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} p={4}>
                <FormControl>
                  <FormLabel fontSize="lg">Currency</FormLabel>
                  <Select placeholder="Select Currency" size="lg">
                    <option>US Dollar</option>
                    <option>Euro</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="lg">Time Zone</FormLabel>
                  <Select placeholder="Select Time Zone" size="lg">
                    <option>(GMT+00:00) UTC</option>
                    <option>(GMT-08:00) Pacific Time</option>
                  </Select>
                </FormControl>
              </Grid>
              <Stack spacing={6} mt={6} p={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel fontSize="lg" mb="0">Notification</FormLabel>
                  <Switch colorScheme="blue" size="lg" />
                </FormControl>
              </Stack>
            </TabPanel>
            
            <TabPanel>
              <FormControl display="flex" alignItems="center" mb={6} p={4}>
                <FormLabel fontSize="lg">Two-factor Authentication</FormLabel>
                <Switch colorScheme="blue" size="lg" />
              </FormControl>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} p={4}>
                <FormControl id="currentPassword">
                  <FormLabel fontSize="lg">Current Password</FormLabel>
                  <Input type="password" placeholder="********" size="lg" />
                </FormControl>
                <FormControl id="newPassword">
                  <FormLabel fontSize="lg">New Password</FormLabel>
                  <Input type="password" placeholder="********" size="lg" />
                </FormControl>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Flex justify="end" position="absolute" bottom="20px" right="20px">
          <Button colorScheme="blue" size="lg" height="70px" width="180px">
            Save
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}