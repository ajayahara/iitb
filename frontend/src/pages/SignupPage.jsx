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
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { Navigate,  Link } from "react-router-dom";
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
      toast({
        title: message,
        status: ok ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });
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
      bg={"#082e3b"}
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
        <Stack
          spacing={4}
          w={"full"}
          maxW={"2xl"}
          pt={6}
          pb={8}
          px={12}
          rounded={"md"}
        >
          <Heading fontSize={"3xl"}>Create an account &rarr;</Heading>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              <GridItem colSpan={1}>
                <FormControl id="username" isRequired>
                  <FormLabel>Username :</FormLabel>
                  <Input
                    type="text"
                    isRequired={true}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    p={1}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email :</FormLabel>
                  <Input
                    type="email"
                    isRequired={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    p={1}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl id="password" isRequired>
                  <FormLabel>Password :</FormLabel>
                  <Input
                    type="password"
                    isRequired={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    p={1}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={1}>
                <FormControl id="dateOfBirth" isRequired>
                  <FormLabel>Date of Birth :</FormLabel>
                  <Input
                    type="date"
                    isRequired={true}
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    p={1}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl id="photo" isRequired>
                  <FormLabel>Photo :</FormLabel>
                  <Input
                    type="file"
                    accept={["image/png", "image/jpeg"]}
                    isRequired={true}
                    onChange={handlePhotoChange}
                    p={1}
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl id="cv" isRequired>
                  <FormLabel>CV :</FormLabel>
                  <Input
                    type="file"
                    accept="application/pdf"
                    isRequired={true}
                    onChange={handleCvChange}
                    p={1}
                  />
                </FormControl>
              </GridItem>
            </Grid>
            <Stack spacing={4}>
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
            <Stack pt={2}>
              <Text align={"center"}>
                Already have an account ? <Link to={"/login"}>Login</Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </Stack>
  );
};
