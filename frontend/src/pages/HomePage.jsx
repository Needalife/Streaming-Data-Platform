import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Box p={{ base: 4, md: 8 }} className="bg-gray-50 min-h-screen">
      <Heading className="text-3xl md:text-4xl font-bold mb-4">Home Dashboard</Heading>
      <p className="text-lg md:text-xl text-gray-600">
        Welcome to the dashboard! This is the home page.
      </p>
    </Box>
  );
}