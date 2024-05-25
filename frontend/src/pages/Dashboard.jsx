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
import { useContext, useState } from "react";
import { authContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { EditModal } from "../components/EditModal";
import { Resume } from "../components/Resume";

export const Dashboard = () => {
  const { details, admin, token, updateDetails } = useContext(authContext);
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const fetchUser = async (id) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER}/users/${id}`,
        {
          headers: { authorization: token },
        }
      );
      updateDetails(data.user);
    } catch (error) {
      toast({
        title: "Error fetching users",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      bg={"#082e3b"}
      color="white"
    >
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"xl"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text color={"blue.400"} as={"p"}>
              Indian Institute
            </Text>
            <Text color={"blue.400"} as={"span"}>
              Of Techonology And Nano Fabrication
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam enim
            dicta fugit. Tempore repudiandae doloremque eligendi porro
            reiciendis suscipit doloribus maxime! Obcaecati vero sapiente eius
            facilis mollitia molestias aperiam et?
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={6} mt={4}>
            <Button
              rounded={"full"}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={() => setOpen(true)}
            >
              Update Profie
            </Button>
            {admin ? (
              <Link to="/verify">
                <Button
                  rounded={"full"}
                  color={"blue.500"}
                  _hover={{
                    bg: "whitesmoke",
                  }}
                >
                  See All The Users
                </Button>
              </Link>
            ) : null}
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1} minH={"100vh"} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} rounded={"xl"} maxW={"xl"} p={6}>
          <Box
            p="4"
            py="8"
            pb="10"
            border="1px solid"
            borderColor={"blue.400"}
            color="white"
            rounded={"md"}
          >
            <Box id="userName" p="4">
              <Heading as="h6" fontSize="2xl" mb="4">
                User Detail &rarr;
              </Heading>
              <Stack direction={["column", "row"]} spacing={6}>
                <Flex w="full" justify={"space-between"} alignItems="center">
                  <Profile
                    data={details?.photo.data}
                    contentType={details?.photo.contentType}
                  />
                  <Flex direction={"column"} gap="2">
                    <Box>
                      <Text color="gray.500">Username :</Text>
                      <Text>{details.username || "username"}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500">Email address</Text>
                      <Text>{details.email || "example@gmail.com"}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500">Date of birth</Text>
                      <Text>{details.dateOfBirth || "00/00/0000"}</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Stack>
            </Box>
            <Center w="full">
              <Resume
                data={details?.cv.data}
                contentType={details?.cv.contentType}
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
