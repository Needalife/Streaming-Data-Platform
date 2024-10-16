import React from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <ChakraProvider>
      <Flex>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <Box flex="1" p="4">
          {/* You can put your main content here */}
          <h1>Main Content Area</h1>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;