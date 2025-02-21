import {
    Flex,
    Divider,
    Avatar,
    useToast,
    useBreakpointValue,
  } from '@chakra-ui/react';
  import { Link, useNavigate, useLocation } from 'react-router-dom';
  import { VscGraph } from 'react-icons/vsc';
  import { RiMenuSearchLine, RiLogoutBoxLine } from 'react-icons/ri';
  import { BsBoundingBox } from 'react-icons/bs';
  import { FiSettings } from 'react-icons/fi';
  import NavItem from './sub_components/NavItem';
  
  export default function Sidebar() {
    const isLoggedIn = sessionStorage.getItem("token") !== null;
    const navigate = useNavigate();
    const toast = useToast();
    const location = useLocation();
  
    // Responsive settings
    const navSize = useBreakpointValue({ base: "large", md: "small" });
    const sidebarWidth = useBreakpointValue({ base: "full", md: "75px" });
    const sidebarHeight = useBreakpointValue({ base: "auto", md: "100vh" });
    const marginTop = useBreakpointValue({ base: 0, md: "2.5vh" });
    const paddingValue = useBreakpointValue({ base: 4, md: "5%" });
  
    // Active background gradient for highlighting active NavItem
    const activeBg = "linear-gradient(to bottom, #a65ffc, #679cf6)";
  
    const handleLogout = () => {
      if (window.confirm("Are you sure you want to log out?")) {
        sessionStorage.removeItem('token');
        toast({
          title: "Success",
          description: "Successfully logged out!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }
    };
  
    return (
      <Flex
        position="sticky"
        left="0"
        h={sidebarHeight}
        mt={marginTop}
        boxShadow="lg"
        borderRadius="15px"
        w={sidebarWidth}
        flexDir="column"
        justifyContent="space-between"
      >
        <Flex p={paddingValue} flexDir="column" w="100%" alignItems="center">
          <Avatar size="sm" src="avatar-1.jpg" mb={5} />
        </Flex>
  
        <Flex flexDir="column" alignItems="center" justifyContent="center" flex="1">
          <NavItem 
            navSize={navSize} 
            icon={VscGraph} 
            title="Home" 
            description="Home Dashboard" 
            as={Link} 
            to="/"
            active={location.pathname === '/'}
            activeBg={activeBg}
          />
          <NavItem 
            navSize={navSize} 
            icon={RiMenuSearchLine} 
            title="Query" 
            description="Search and query" 
            as={Link} 
            to="/queryboard" 
            active={location.pathname === '/queryboard'}
            activeBg={activeBg}
          />
          {/*
            Uncomment these if needed:
            <NavItem 
              navSize={navSize} 
              icon={BsBoundingBox} 
              title="Metrics" 
              description="View metrics" 
              as={Link} 
              to="/metrics"
              active={location.pathname === '/metrics'}
              activeBg={activeBg}
            />
            <NavItem 
              navSize={navSize} 
              icon={FiSettings} 
              title="Settings" 
              description="Change your settings" 
              as={Link} 
              to="/settings"
              active={location.pathname === '/settings'}
              activeBg={activeBg}
            />
          */}
          {isLoggedIn && (
            <NavItem
              navSize={navSize}
              icon={RiLogoutBoxLine}
              title="Log out"
              description="Log out from your account"
              onClick={handleLogout}
            />
          )}
        </Flex>
  
        <Flex p={paddingValue} flexDir="column" w="100%" alignItems="center" mb={4}>
          <Divider />
        </Flex>
      </Flex>
    );
  }
  