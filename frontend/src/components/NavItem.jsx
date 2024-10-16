import React, { useState } from 'react';
import {
  Flex,
  Text,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Box,
} from '@chakra-ui/react';
import NavHoverBox from '../components/NavHoverBox';

export default function NavItem({ icon, title, description, active, navSize }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPopover = () => setIsOpen(true);
  const closePopover = () => setIsOpen(false);

  return (
    <Flex
      mt={30}
      flexDir="column"
      w="100%"
      alignItems={navSize === "small" ? "center" : "flex-start"}
      onMouseEnter={openPopover}
      onMouseLeave={closePopover}
    >
      <Popover isOpen={isOpen} placement="right">
        <PopoverTrigger>
          <Box
            as="a"
            backgroundColor={active && "#AEC8CA"}
            p={3}
            borderRadius={8}
            _hover={{
              textDecor: 'none',
              background: "linear-gradient(to bottom, #a65ffc, #679cf6)",
              color: "white",
            }}
            w={navSize === "large" ? "100%" : "auto"}
            cursor="pointer"
          >
            <Flex>
              <Icon
                as={icon}
                fontSize={{ base: "lg", md: "xl", lg: "2xl", xl: "3xl" }}
                color="inherit"
              />
              <Text
                ml={5}
                display={navSize === "small" ? "none" : "flex"}
                color="inherit"
              >
                {title}
              </Text>
            </Flex>
          </Box>
        </PopoverTrigger>
        <PopoverContent
          py={0}
          border="none"
          w={200}
          h={200}
          ml={5}
          boxShadow="lg"
        >
          <NavHoverBox title={title} icon={icon} description={description} />
        </PopoverContent>
      </Popover>
    </Flex>
  );
}
