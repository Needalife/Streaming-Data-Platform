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
  Checkbox,
  Divider,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import GoogleSignInButton from "./GoogleSignInButton";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");

  const isEmailEmpty = email === "";
  const isPasswordEmpty = password === "";

  const handleSignIn = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add sigin logic
    console.log("Email:", email);
    console.log("Password:", password);
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
        Sign In
      </Heading>

      <GoogleSignInButton />

      <Divider my={6} />

      <form onSubmit={handleSignIn}>
        <Stack spacing={4}>
          <FormControl id="email" isInvalid={isEmailEmpty}>
            <FormLabel>Email*</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <Flex justify="space-between" align="center">
            <Checkbox defaultIsChecked>Keep me logged in</Checkbox>
            <Text color="blue.500" as="a" href="#" fontSize="sm">
              Forgot password?
            </Text>
          </Flex>

          <Button type="submit" colorScheme="blue" size="lg" width="full">
            Sign In
          </Button>
        </Stack>
      </form>

      <Text textAlign="center" mt={6}>
        Not registed yet?{" "}
        <a href="/signin" style={{ color: "blue" }}>
          Create an Account
        </a>
      </Text>
    </Box>
  );
};

export default SignIn;
