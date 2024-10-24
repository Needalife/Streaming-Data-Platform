import React from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SettingsPage from './pages/SettingsPage';
import DashBoard from './pages/DashBoard';
import HomePage from './pages/HomePage';

function App() {
    return (
        <ChakraProvider>
            <Box className="h-screen overflow-hidden">
                <Router>
                    <Flex className="h-full">
                        <Sidebar />
                        <Box className="flex-1 bg-gray-50">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/dashboard" element={<DashBoard />} />
                                <Route path="/settings" element={<SettingsPage />} />
                            </Routes>
                        </Box>
                    </Flex>
                </Router>
            </Box>
        </ChakraProvider>
    );
}

export default App;