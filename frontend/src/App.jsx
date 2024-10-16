import React from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <ChakraProvider>
      <Flex h="100vh">  {/* Make the Flex container fill the full viewport height */}
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Box flex="1" p="4">
          {/* Your main content goes here */}
          <h1>Main Content Area</h1>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;