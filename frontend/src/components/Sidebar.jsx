import React, { useState } from 'react';
import {
  Flex,
  IconButton,
  Divider,
  Avatar,
  Heading,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiSettings
} from 'react-icons/fi';

import { VscGraph } from 'react-icons/vsc';
import { RiMenuSearchLine, RiLogoutBoxLine } from 'react-icons/ri';
import { BsBoundingBox } from 'react-icons/bs';
import NavItem from './NavItem';

export default function Sidebar() {
  const [navSize, changeNavSize] = useState("large");

  return (
    <Flex
      pos="sticky"
      left="5"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius={navSize === "small" ? "15px" : "30px"}
      w={navSize === "small" ? "75px" : "200px"}
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        as="nav"
      >
        <IconButton
          background="none"
          mt={5}
          _hover={{ background: 'none' }}
          icon={<FiMenu />}
          onClick={() => {
            if (navSize === "small") changeNavSize("large");
            else changeNavSize("small");
          }}
        />
        <NavItem navSize={navSize} icon={VscGraph} title="Home" description="Home Dashboard" />
        <NavItem navSize={navSize} icon={RiMenuSearchLine} title="Query" description="Search and query" />
        <NavItem navSize={navSize} icon={BsBoundingBox} title="Metrics" description="View metrics" />
        <NavItem navSize={navSize} icon={FiSettings} title="Settings" description="Change your settings" />
        <NavItem navSize={navSize} icon={RiLogoutBoxLine} title="Log out" description="Log out from your account" />
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        mb={4}
      >
        <Divider display={navSize === "small" ? "none" : "flex"} />
        <Flex mt={4} align="center">
          <Avatar size="sm" src="avatar-1.jpg" />
          <Flex flexDir="column" ml={4} display={navSize === "small" ? "none" : "flex"}>
            <Heading as="h3" size="sm">User Name</Heading>
            <Heading as="h5" size="sm" color="gray">Admin</Heading>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
