import React, { useState } from 'react';
import {
  Flex,
  Text,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
  Portal,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function NavItem({ icon, title, description, active, navSize, to, onClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPopover = () => setIsOpen(true);
  const closePopover = () => setIsOpen(false);

  // Base styles for the highlight extension when active or hovered
  const extendedStyles = {
    width: "calc(100% + 20px)",
    marginLeft: "-10px",
  };

  return (
    <Flex
      mt={8}
      flexDir="column"
      w="100%"
      alignItems={navSize === "small" ? "center" : "flex-start"}
      onMouseEnter={openPopover}
      onMouseLeave={closePopover}
      className="transition-all duration-300"
    >
      <Popover isOpen={isOpen} placement="right">
        <PopoverTrigger>
          <Box
            as={onClick ? "div" : Link}
            to={to}
            onClick={onClick}
            bg={active ? "linear-gradient(to bottom, #a65ffc, #679cf6)" : undefined}
            color={active ? "white" : undefined}
            p={3}
            borderRadius={8}
            // Default width set by navSize; will extend on hover/active
            w={navSize === "large" ? "100%" : "auto"}
            cursor={onClick ? "pointer" : "default"}
            transition="all 0.3s"
            // Conditionally apply extended width styles if active
            {...(active && extendedStyles)}
            _hover={{
              textDecor: 'none',
              bg: "linear-gradient(to bottom, #a65ffc, #679cf6)",
              color: "white",
              ...extendedStyles,
            }}
          >
            <Flex
              w="100%"
              align="center"
              justify={navSize === "small" ? "center" : "flex-start"}
            >
              <Icon
                as={icon}
                fontSize={{ base: "lg", md: "xl", lg: "2xl", xl: "3xl" }}
                color="inherit"
                className="transition-transform duration-200"
              />
              {navSize !== "small" && (
                <Text
                  ml={5}
                  color="inherit"
                  className="text-base md:text-lg"
                >
                  {title}
                </Text>
              )}
            </Flex>
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            py={0}
            border="none"
            w={200}
            h={200}
            ml={5}
            boxShadow="lg"
            className="bg-white"
            _focusVisible={{ outline: "none" }}
          >
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
}
