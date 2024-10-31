import React from 'react';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import SettingsPage from './pages/SettingsPage';
import QueryBoard from './pages/QueryBoard';
import HomePage from './pages/HomePage';
import MetricsPage from './pages/MetricsPage';
import SignIn from './components/settings/SignIn';
import SignUp from './components/settings/SignUp';

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
                                <Route path="/queryboard" element={<QueryBoard />} />
                                <Route path="/metrics" element={<MetricsPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                            </Routes>
                        </Box>
                    </Flex>
                </Router>
            </Box>
        </ChakraProvider>
    );
}

export default App;