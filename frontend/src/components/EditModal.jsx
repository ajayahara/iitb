import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { authContext } from "../context/AuthContext";

export const EditModal = ({ user, isOpen, onClose, onSave }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [photo, setPhoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { token } = useContext(authContext);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setDateOfBirth(user.dateOfBirth);
    }
  }, [user]);

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);
  const handleCvChange = (e) => setCv(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("photo", photo);
      formData.append("cv", cv);
      await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/${user._id}`,
        formData,
        {
          headers: {
            authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onSave();
      toast({
        title: "User updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"#082e3b"} color="white">
        <ModalHeader>Edit User Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                p={1}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" mt={2}>
              <FormLabel>Email</FormLabel>
              <Input
                p={1}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                p={1}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl id="dateOfBirth" mt={2}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                p={1}
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </FormControl>
            <FormControl id="photo" mt={2}>
              <FormLabel>Photo</FormLabel>
              <Input
                p={1}
                type="file"
                accept={["image/png", "image/jpeg"]}
                onChange={handlePhotoChange}
              />
            </FormControl>
            <FormControl id="cv" mt={2}>
              <FormLabel>CV</FormLabel>
              <Input
                p={1}
                type="file"
                accept="application/pdf"
                onChange={handleCvChange}
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
