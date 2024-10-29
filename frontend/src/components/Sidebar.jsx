import React, { useState, useEffect } from 'react';
import {
    Flex,
    Divider,
    Avatar,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { VscGraph } from 'react-icons/vsc';
import { RiMenuSearchLine, RiLogoutBoxLine } from 'react-icons/ri';
import { BsBoundingBox } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import NavItem from './NavItem';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sidebar() {
    const isLoggedIn = sessionStorage.getItem("token") !== null;
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            sessionStorage.removeItem('token');
            toast.success('Successfully logged out!');
            navigate('/');
        }
    };

    return (
        <Flex
            position="sticky"
            left="0"
            className="h-[100vh] mt-[2.5vh] shadow-lg"
            borderRadius="15px"
            minW="75px"
            maxW="75px"
            flexDir="column"
            justifyContent="space-between"
        >
            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems="center"
            >
                <Avatar size="sm" src="avatar-1.jpg" mb={5} />
            </Flex>

            <Flex
                flexDir="column"
                alignItems="center"
                justifyContent="center"
                flex="1"
            >
                <NavItem navSize="small" icon={VscGraph} title="Home" description="Home Dashboard" as={Link} to="/" />
                <NavItem navSize="small" icon={RiMenuSearchLine} title="Query" description="Search and query" as={Link} to="/queryboard" />
                <NavItem navSize="small" icon={BsBoundingBox} title="Metrics" description="View metrics" as={Link} to="/metrics" />
                <NavItem navSize="small" icon={FiSettings} title="Settings" description="Change your settings" as={Link} to="/settings" />

                {isLoggedIn && (
                    <NavItem
                        navSize="small"
                        icon={RiLogoutBoxLine}
                        title="Log out"
                        description="Log out from your account"
                        onClick={handleLogout}
                    />
                )}
            </Flex>

            <Flex p="5%" flexDir="column" w="100%" alignItems="center" mb={4}>
                <Divider />
            </Flex>
        </Flex>
    );
}
