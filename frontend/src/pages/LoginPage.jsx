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
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { Navigate } from "react-router-dom";
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
      const { ok, token, isAdmin } = data;
      if (ok) {
        login({ token, isAdmin });
        toast({
          title: "Login successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Server error",
        status: "error",
        duration: 5000,
        isClosable: true,
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
      bgColor={"black"}
      textColor={"white"}
      direction={{ base: "column", md: "row" }}
    >
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"3xl"}>Login to your account &rarr;</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="username">
              <FormLabel>Username :</FormLabel>
              <Input
                type="text"
                isRequired={true}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password :</FormLabel>
              <Input
                type="password"
                isRequired={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6} mt={"4"}>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                type="submit"
                isLoading={loading}
              >
                Login
              </Button>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_SECRET}
                size="invisible"
                ref={reRef}
              />
            </Stack>
          </form>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={"Login Image"}
          objectFit={"cover"}
          src={
            "https://media.istockphoto.com/id/981600810/photo/exiting-the-void.jpg?s=612x612&w=0&k=20&c=OFduMv4GTQQKqa-BdsFw3Om4HCnx5obaNnofTVMwNX8="
          }
        />
      </Flex>
    </Stack>
  );
};
