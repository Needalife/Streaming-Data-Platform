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
        <Flex
            p={{ base: 4, md: 8 }}
            flex="1"
            bg="gray.100"
            alignItems="center"
            justifyContent="center"
            minH="100vh"
            position="relative"
            className="bg-gray-100"
        >
            <Heading
                size="5xl"
                position="absolute"
                top={{ base: '20px', md: '40px' }}
                left={{ base: '20px', md: '40px' }}
                fontSize={{ base: '2xl', md: '3xl' }}
                className="text-gray-800"
            >
                Settings
            </Heading>
            <Box
                p={{ base: 4, md: 8 }}
                bg="white"
                borderRadius="lg"
                boxShadow="lg"
                maxW={{ base: '100%', md: '800px', lg: '1200px' }}
                w="90%"
                minH={{ base: '600px', md: '800px' }}
                position="relative"
                pt={10}
                className="shadow-md"
            >
                <Tabs variant="enclosed" colorScheme="blue">
                    <TabList>
                        <Tab
                            fontSize={{ base: 'md', md: 'lg' }}
                            _focus={{ boxShadow: 'none', outline: 'none' }}
                            className="text-lg md:text-xl"
                        >
                            Edit Profile
                        </Tab>
                        <Tab
                            fontSize={{ base: 'md', md: 'lg' }}
                            _focus={{ boxShadow: 'none', outline: 'none' }}
                            className="text-lg md:text-xl"
                        >
                            Preferences
                        </Tab>
                        <Tab
                            fontSize={{ base: 'md', md: 'lg' }}
                            _focus={{ boxShadow: 'none', outline: 'none' }}
                            className="text-lg md:text-xl"
                        >
                            Security
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Flex alignItems="center" mb={6} className="mb-6">
                                <Avatar size={{ base: 'lg', md: '2xl' }} src="avatar-1.jpg" />
                                <IconButton
                                    aria-label="Edit avatar"
                                    icon={<FiEdit2 />}
                                    ml={-12}
                                    mt={6}
                                    bg="white"
                                    borderRadius="full"
                                    boxShadow="md"
                                    size={{ base: 'md', md: 'lg' }}
                                    className="shadow-md"
                                />
                            </Flex>
                            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} className="p-4">
                                <FormControl id="name">
                                    <FormLabel className="text-lg md:text-xl">Your Name</FormLabel>
                                    <Input placeholder="John Doe" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="username">
                                    <FormLabel className="text-lg md:text-xl">User Name</FormLabel>
                                    <Input placeholder="johndoe123" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="email">
                                    <FormLabel className="text-lg md:text-xl">Email</FormLabel>
                                    <Input type="email" placeholder="johndoe@example.com" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="password">
                                    <FormLabel className="text-lg md:text-xl">Password</FormLabel>
                                    <Input type="password" placeholder="********" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="presentAddress">
                                    <FormLabel className="text-lg md:text-xl">Present Address</FormLabel>
                                    <Input placeholder="123 Main St" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="city">
                                    <FormLabel className="text-lg md:text-xl">City</FormLabel>
                                    <Input placeholder="New York" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="postalCode">
                                    <FormLabel className="text-lg md:text-xl">Postal Code</FormLabel>
                                    <Input placeholder="10001" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="country">
                                    <FormLabel className="text-lg md:text-xl">Country</FormLabel>
                                    <Input placeholder="United States" size="lg" className="border-gray-300" />
                                </FormControl>
                            </Grid>
                        </TabPanel>

                        <TabPanel>
                            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} className="p-4">
                                <FormControl>
                                    <FormLabel className="text-lg md:text-xl">Currency</FormLabel>
                                    <Select placeholder="Select Currency" size="lg" className="border-gray-300">
                                        <option>US Dollar</option>
                                        <option>Euro</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel className="text-lg md:text-xl">Time Zone</FormLabel>
                                    <Select placeholder="Select Time Zone" size="lg" className="border-gray-300">
                                        <option>(GMT+00:00) UTC</option>
                                        <option>(GMT-08:00) Pacific Time</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Stack spacing={6} mt={6} className="p-4">
                                <FormControl display="flex" alignItems="center">
                                    <FormLabel className="text-lg md:text-xl mb-0">Notification</FormLabel>
                                    <Switch colorScheme="blue" size="lg" />
                                </FormControl>
                            </Stack>
                        </TabPanel>

                        <TabPanel>
                            <Stack spacing={6} mt={6} className="p-4">
                                <Text className="text-lg md:text-xl font-bold">
                                    Two-factor Authentication
                                </Text>
                                <FormControl>
                                    <Flex alignItems="center" gap={4}>
                                        <Switch colorScheme="blue" size="lg" />
                                        <Text className="text-md text-gray-600">
                                            Enable or disable two-factor authentication
                                        </Text>
                                    </Flex>
                                </FormControl>
                            </Stack>

                            <Text className="text-lg md:text-xl font-bold mt-8 p-4">
                                Change Password
                            </Text>
                            <Grid templateColumns={{ base: '1fr', md: '1fr' }} gap={6} mt={4} className="p-4">
                                <FormControl id="currentPassword">
                                    <FormLabel className="text-lg md:text-xl">Current Password</FormLabel>
                                    <Input type="password" placeholder="********" size="lg" className="border-gray-300" />
                                </FormControl>
                                <FormControl id="newPassword">
                                    <FormLabel className="text-lg md:text-xl">New Password</FormLabel>
                                    <Input type="password" placeholder="********" size="lg" className="border-gray-300" />
                                </FormControl>
                            </Grid>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                <Flex justify="end" position="absolute" bottom="20px" right="20px">
                    <Button colorScheme="blue" size="lg" className="h-16 w-44">
                        Save
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}