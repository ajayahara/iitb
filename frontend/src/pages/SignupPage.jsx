import {
  Box,
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

export const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photo, setPhoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const reRef = useRef();

  const { token } = useContext(authContext);

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);
  const handleCvChange = (e) => setCv(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recaptchaToken = await reRef.current.executeAsync();
      reRef.current.reset();
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("photo", photo);
      formData.append("cv", cv);
      formData.append("recaptchaToken", recaptchaToken);

      const {
        data: { ok, message },
      } = await axios.post(
        `${import.meta.env.VITE_SERVER}/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (ok) {
        toast({
          title: "Signup successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: message,
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
      <Flex flex={1}>
        <Image
          alt={"Signup Image"}
          objectFit={"cover"}
          src={
            "https://images.unsplash.com/photo-1637166185518-058f5896a2e9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZ1dHVyaXN0aWN8ZW58MHx8MHx8fDA%3D"
          }
        />
      </Flex>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"}>
          <Heading fontSize={"3xl"}>Sign up for an account &rarr;</Heading>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Box>
              <FormControl id="username">
                <FormLabel>Username :</FormLabel>
                <Input
                  type="text"
                  isRequired={true}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  p={1}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email :</FormLabel>
                <Input
                  type="email"
                  isRequired={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  p={1}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password :</FormLabel>
                <Input
                  type="password"
                  isRequired={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  p={1}
                />
              </FormControl>
              <FormControl id="dateOfBirth">
                <FormLabel>Date of Birth :</FormLabel>
                <Input
                  type="date"
                  isRequired={true}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  p={1}
                />
              </FormControl>
              <FormControl id="photo">
                <FormLabel>Photo :</FormLabel>
                <Input
                  type="file"
                  accept={["image/png", "image/jpeg"]}
                  isRequired={true}
                  onChange={handlePhotoChange}
                  p={1}
                />
              </FormControl>
              <FormControl id="cv">
                <FormLabel>CV :</FormLabel>
                <Input
                  type="file"
                  accept="application/pdf"
                  isRequired={true}
                  onChange={handleCvChange}
                  p={1}
                />
              </FormControl>
              <Stack spacing={6}>
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_SECRET}
                  size="invisible"
                  ref={reRef}
                />
                <Button
                  colorScheme={"blue"}
                  variant={"solid"}
                  type="submit"
                  isLoading={loading}
                >
                  Sign Up
                </Button>
              </Stack>
            </Box>
          </form>
        </Stack>
      </Flex>
    </Stack>
  );
};
