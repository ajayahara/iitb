import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const reRef = useRef();

  const { token, login } = useContext(authContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recaptchaToken = await reRef.current.executeAsync();
      reRef.current.reset();
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/auth/login`,
        {
          username,
          password,
          recaptchaToken,
        }
      );
      const { ok, token, isAdmin, details } = data;
      if (ok) {
        login({ token, isAdmin, details });
        toast({
          title: "Login successful",
          status: "success",
        });
      } else {
        toast({
          title: data.message,
          status: "error",
        });
      }
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Server error",
        status: "error",
      });
    }
    setLoading(false);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", lg: "row" }}
      bg={"#082e3b"}
      textColor={"white"}
    >
      <Flex
        p={{ base: 0, md: 8 }}
        pt={{ base: "10", md: "8" }}
        flex={1}
        align={"center"}
        justify={"center"}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={{ base: "full", md: "full", lg:"xl" }}
          pt={{ base: 6, md: 8 }}
          pb={{ base: 6, md: 8 }}
          px={{ base: 4, md: 2 }}
          rounded={"lg"}
        >
          <Heading fontSize={{ base: "2xl", md: "3xl" }}>
            Login to your account &rarr;
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="username" isRequired>
              <FormLabel>Username :</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                p={2}
              />
            </FormControl>
            <FormControl id="password" isRequired mt={4}>
              <FormLabel>Password :</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                p={2}
              />
            </FormControl>
            <Stack spacing={4} mt={6}>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                type="submit"
                isLoading={loading}
                width={{ base: "full", sm: "auto" }}
              >
                Login
              </Button>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_SECRET}
                size="invisible"
                ref={reRef}
              />
            </Stack>
            <Stack pt={4}>
              <Text align={"center"}>
                Don&apos;t have an account?{" "}
                <Link to={"/signup"}>
                  <Text as="span" color="blue.400">Signup</Text>
                </Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1637166185518-058f5896a2e9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZ1dHVyaXN0aWN8ZW58MHx8MHx8fDA%3D"
          }
        />
      </Flex>
    </Stack>
  );
};
