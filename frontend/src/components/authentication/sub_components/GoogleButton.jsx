import { FcGoogle } from 'react-icons/fc';
import { Button, Icon, Text } from '@chakra-ui/react';

const GoogleButton = ({ text }) => (
    <Button
        width="full"
        height="52px"
        variant="outline"
        borderColor="gray.300"
        _hover={{ bg: 'gray.100' }}
        leftIcon={<Icon as={FcGoogle} />}
        fontWeight="normal"
        fontSize="md"
    >
        <Text fontSize="md" color="gray.700">{text}</Text>
    </Button>
);

export default GoogleButton;
