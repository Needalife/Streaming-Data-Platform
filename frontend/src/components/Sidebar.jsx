import React from 'react';
import {
  Flex,
  Divider,
  Avatar,
} from '@chakra-ui/react';

import { VscGraph } from 'react-icons/vsc';
import { RiMenuSearchLine, RiLogoutBoxLine } from 'react-icons/ri';
import { BsBoundingBox } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import NavItem from './NavItem';

export default function Sidebar() {
  return (
    <Flex
      pos="sticky"
      left="0"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius="15px"
      minW="75px"  // Fix the sidebar size
      maxW="75px"
      flexDir="column"
      justifyContent="space-between"
    >
      {/* Top section with user Avatar */}
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems="center"  // Align Avatar to the center
      >
        <Avatar size="sm" src="avatar-1.jpg" mb={5} />  {/* Avatar at the top */}
      </Flex>

      {/* Middle section with Nav items centered */}
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"  // Center the navigation items vertically
        flex="1"  // Make this section take up the remaining space
      >
        <NavItem navSize="small" icon={VscGraph} title="Home" description="Home Dashboard" />
        <NavItem navSize="small" icon={RiMenuSearchLine} title="Query" description="Search and query" />
        <NavItem navSize="small" icon={BsBoundingBox} title="Metrics" description="View metrics" />
        <NavItem navSize="small" icon={FiSettings} title="Settings" description="Change your settings" />
        <NavItem navSize="small" icon={RiLogoutBoxLine} title="Log out" description="Log out from your account" />
      </Flex>

      {/* Bottom section with optional Divider */}
      <Flex p="5%" flexDir="column" w="100%" alignItems="center" mb={4}>
        <Divider />
      </Flex>
    </Flex>
  );
}