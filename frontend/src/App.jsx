import React from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SettingsPage from './pages/SettingsPage';
import QueryBoard from './pages/QueryBoard';
import HomePage from './pages/HomePage';
import MetricsPage from './pages/MetricsPage';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Flex className="h-screen">
                    <Sidebar />
                    <Box className="flex-1 bg-gray-50">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/queryboard" element={<QueryBoard />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/metrics" element={<MetricsPage />} />
                        </Routes>
                    </Box>
                </Flex>
            </Router>
        </ChakraProvider>
    );
}

export default App;