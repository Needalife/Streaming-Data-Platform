import { useState } from "react";
import {
    Box,
    Button,
    Input,
    Stack,
    FormControl,
    FormLabel,
    Heading,
    Text,
    Divider,
    IconButton,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import GoogleButton from "./GoogleButton";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from 'react-router-dom';
import { signup } from "../../api/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const result = await signup(email, password);

        if (result.success) {
            sessionStorage.setItem('token', result.token);
            toast.success("Successfully signed up!");
            navigate('/signin');
        } else {
            toast.error(result.message || 'Signup failed');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            maxW="md"
            mx="auto"
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            bg="white"
            mt={12}
        >
            <Heading as="h2" size="lg" textAlign="center" mb={6}>
                Sign Up
            </Heading>

            <GoogleButton text="Sign up with Google" />

            <Divider my={6} />

            <form onSubmit={handleSignUp}>
                <Stack spacing={4}>
                    <FormControl id="email">
                        <FormLabel>Email*</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email"
                            required
                        />
                    </FormControl>

                    <FormControl id="password">
                        <FormLabel>Password*</FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                required
                            />
                            <InputRightElement>
                                <IconButton
                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    onClick={togglePasswordVisibility}
                                    variant="ghost"
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl id="confirm-password">
                        <FormLabel>Confirm Password*</FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Enter your password again"
                                required />
                            <InputRightElement>
                                <IconButton
                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    onClick={togglePasswordVisibility}
                                    variant="ghost"
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <Divider my={6} />

                    <Button type="submit" bg="#4072EE" color="white" _hover={{ bg: "#305ACF" }} size="lg" width="full">
                        Sign Up
                    </Button>
                </Stack>
            </form>

            <Text textAlign="center" mt={6}>
                Already had an account?{" "}
                <a href="/signin" style={{ color: "blue" }}>
                    Sign In
                </a>
            </Text>
        </Box>
    );
};

export default SignUp;
