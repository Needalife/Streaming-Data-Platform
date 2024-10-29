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
import NavHoverBox from '../components/NavHoverBox';

export default function NavItem({ icon, title, description, active, navSize, to, onClick }) {
    const [isOpen, setIsOpen] = useState(false);

    const openPopover = () => setIsOpen(true);
    const closePopover = () => setIsOpen(false);

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
                        backgroundColor={active ? "#AEC8CA" : undefined}
                        p={3}
                        borderRadius={8}
                        _hover={{
                            textDecor: 'none',
                            background: "linear-gradient(to bottom, #a65ffc, #679cf6)",
                            color: "white",
                        }}
                        _focus={{
                            outline: "none",
                        }}
                        w={navSize === "large" ? "100%" : "auto"}
                        cursor={onClick ? "pointer" : "default"}
                        className="transition-colors duration-300"
                    >
                        <Flex>
                            <Icon
                                as={icon}
                                fontSize={{ base: "lg", md: "xl", lg: "2xl", xl: "3xl" }}
                                color="inherit"
                                className="transition-transform duration-200"
                            />
                            <Text
                                ml={5}
                                display={navSize === "small" ? "none" : "flex"}
                                color="inherit"
                                className="text-base md:text-lg"
                            >
                                {title}
                            </Text>
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
                        <NavHoverBox title={title} icon={icon} description={description} />
                    </PopoverContent>
                </Portal>
            </Popover>
        </Flex>
    );
}
