import React from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import AppRouter from './router/AppRouter';

function App() {
    return (
        <ChakraProvider>
            <Box className="h-screen overflow-hidden">
                <Router>
                    <Flex className="h-full">
                        <Sidebar />
                        <Box className="flex-1 bg-gray-50">
                            <AppRouter/>
                        </Box>
                    </Flex>
                </Router>
            </Box>
        </ChakraProvider>
    );
}

export default App;