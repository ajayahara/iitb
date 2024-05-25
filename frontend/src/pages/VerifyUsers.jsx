import { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";

export const VerifyUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isVerifiedFilter, setIsVerifiedFilter] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useContext(authContext);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER}/users`, {
        params: {
          page,
          limit: 10,
          isVerified: isVerifiedFilter,
        },
        headers: { authorization: token },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast({
        title: "Error fetching users",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleVerifyToggle = async (userId, currentStatus) => {
    try {
      const {
        data: { message },
      } = await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/${userId}`,
        { userId, isVerified: currentStatus },
        {
          headers: {
            authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchUsers();
      toast({
        title: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating user verification status",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [page, isVerifiedFilter]);

  return (
    <Box p={8} pt="14" bg={"#082e3b"} minH={"100vh"} color={"white"}>
      <Heading mb={4} as="h3" fontSize="3xl" textAlign={"center"}>
        User verification dashboard &rarr;
      </Heading>
      <hr style={{ marginBottom: "10px" }} />
      <Flex mb={4} justifyContent={"end"} w="full" gap="4">
        <Flex justify="space-between" gap="2" alignItems={"center"}>
          <Button
            onClick={() => setPage(page - 1)}
            size="sm"
            isDisabled={page == 1}
          >
            Prev
          </Button>
          <Box>
            Page {page} of {totalPages}
          </Box>
          <Button
            onClick={() => setPage(page + 1)}
            isDisabled={page == totalPages}
            size="sm"
          >
            Next
          </Button>
        </Flex>
        <Select
          value={isVerifiedFilter}
          w="1/3"
          onChange={(e) => setIsVerifiedFilter(e.target.value)}
          color={"black"}
          bg={"white"}
          size="sm"
          rounded={"md"}
          fontWeight={"semibold"}
        >
          <option value={true}>Verified</option>
          <option value={false}>Not Verified</option>
        </Select>
      </Flex>
      <Table variant={"stripped"} colorScheme="teal">
        <Thead>
          <Tr>
            <Th pl={0}>Sl No.</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Date of Birth</Th>
            <Th>Verified</Th>
            <Th pr={0} textAlign={"right"}>
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, i) => (
            <Tr key={user._id}>
              <Td pl={0} py={1}>
                {(page - 1) * 10 + i + 1}
              </Td>
              <Td py={1}>{user.username}</Td>
              <Td py={1}>{user.email}</Td>
              <Td py={1}>{new Date(user.dateOfBirth).toLocaleDateString()}</Td>
              <Td py={1}>
                <Switch
                  isChecked={user.isVerified}
                  onChange={() =>
                    handleVerifyToggle(user._id, !user.isVerified)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </Td>
              <Td py={1} pr={0} textAlign={"right"}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/details/${user._id}`);
                  }}
                  size="sm"
                >
                  Details
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
