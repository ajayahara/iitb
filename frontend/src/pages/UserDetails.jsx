import {
  Button,
  Center,
  Flex,
  Box,
  Text,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Profile } from "../components/Profile";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { authContext } from "../context/AuthContext";
import { EditModal } from "../components/EditModal";
import { Resume } from "../components/Resume";

export const UserDetails = () => {
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const toast = useToast();
  const { token } = useContext(authContext);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/users/${id}`,
        {
          headers: { authorization: token },
        }
      );
      setDetails(response.data.user);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching user details",
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", lg: "row" }}
      bg={"#082e3b"}
      color="white"
    >
      <Flex
        p={{ base: 4, md: 4, lg: 8 }}
        pt={{ base: 12, md: 4, lg: 8 }}
        flex={1}
        align={"center"}
        justify={"center"}
      >
        <Stack
          spacing={{ base: "2", lg: "6" }}
          w={"full"}
          maxW={{ base: "full", lg: "xl" }}
        >
          <Heading fontSize={{ base: "4xl", md: "5xl", lg: "5xl" }}>
            <Text color={"blue.400"} as={"p"}>
              Indian Institute
            </Text>
            <Text color={"blue.400"} as={"span"}>
              Of Technology And Nano Fabrication
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam enim
            dicta fugit. Tempore repudiandae doloremque eligendi porro
            reiciendis suscipit doloribus maxime! Obcaecati vero sapiente eius
            facilis mollitia molestias aperiam et?
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4} mt={4}>
            <Button
              rounded={"full"}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={() => setOpen(true)}
            >
              Update Profile
            </Button>
            <Button
              rounded={"full"}
              color={"blue.500"}
              _hover={{
                bg: "whitesmoke",
              }}
            >
              <Link to="/verify">Back to Verification</Link>
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex
        flex={1}
        minH={{ lg: "100vh" }}
        align={{ lg: "center" }}
        justify={{ lg: "center" }}
      >
        <Stack
          spacing={4}
          w={"full"}
          rounded={"xl"}
          maxW={{ base: "full", lg: "xl" }}
          p={{ base: "4", lg: "6" }}
        >
          <Box
            p={{ base: 4, md: 6 }}
            py={{ base: 8, lg: 10 }}
            border="1px solid"
            borderColor={"blue.400"}
            color="white"
            rounded={"md"}
          >
            <Box id="userName" p="4">
              <Heading
                as="h6"
                fontSize={{ base: "xl", md: "2xl" }}
                textAlign={{ base: "center", md: "left" }}
                mb={4}
              >
                User Details &rarr;
              </Heading>
              <Stack direction={{ base: "column", md: "row" }} spacing={6}>
                <Flex
                  w="full"
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: "2", md: 0 }}
                  justify={"space-between"}
                  alignItems="center"
                  textAlign={{ base: "center", md: "left" }}
                >
                  <Profile
                    data={details.photo?.data}
                    contentType={details.photo?.contentType}
                  />
                  <Flex direction={"column"} gap={2}>
                    <Box>
                      <Text color="gray.500">Username :</Text>
                      <Text>{details.username || "username"}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500">Email Address :</Text>
                      <Text>{details.email || "example@gmail.com"}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500">Date of Birth :</Text>
                      <Text>{details.dateOfBirth || "00/00/0000"}</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Stack>
            </Box>
            <Center w="full">
              <Resume
                data={details?.cv?.data}
                contentType={details?.cv?.contentType}
              />
            </Center>
          </Box>
        </Stack>
      </Flex>
      <EditModal
        user={details}
        isOpen={open}
        onClose={() => setOpen(false)}
        onSave={() => fetchUser(details._id)}
      />
    </Stack>
  );
};
