import React from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SettingsPage from './pages/SettingsPage';
import DashBoard from './pages/DashBoard';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Flex className="h-screen">
                    <Sidebar />
                    <Box className="flex-1 bg-gray-50">
                        <Routes>
                            <Route path="/" element={<DashBoard />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </Box>
                </Flex>
            </Router>
        </ChakraProvider>
    );
}

export default App;