import React from 'react';
import {
  Flex,
  Heading,
  Text,
  Icon,
} from '@chakra-ui/react';

export default function NavHoverBox({ title, icon, description }) {
  return (
    <>
      <Flex
        pos="absolute"
        top="50%" // Centers it vertically with respect to the parent element
        left="-10px" // Adjust this value to move the triangle closer to the NavItem
        transform="translateY(-50%)" // Centers the triangle with the hover box vertically
        width={0}
        height={0}
        borderTop="10px solid transparent"
        borderBottom="10px solid transparent"
        borderRight="10px solid #679cf6"
      />
      <Flex
        h={200}
        w={200}
        flexDir="column"
        alignItems="center"
        justify="center"
        background="linear-gradient(to bottom, #a65ffc, #679cf6)"
        borderRadius="10px"
        color="#fff"
        textAlign="center"
        boxShadow="md"
      >
        <Icon as={icon} fontSize="3xl" mb={4} />
        <Heading size="md" fontWeight="normal">{title}</Heading>
        <Text>{description}</Text>
      </Flex>
    </>
  );
}