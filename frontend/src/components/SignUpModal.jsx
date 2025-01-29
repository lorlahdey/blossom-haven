import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  // useDisclosure,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";

import useAuthStore from "../store/authStore";


const userInfo = {
    name: "",
    email: "",
    password: "",
};
const SignUpModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setUser, register, token, user, isLoggedIn } = useAuthStore();
  const [userData, setUserData] = useState(userInfo);
  // console.log(token, user, isLoggedIn, "00111");

  // Registering a user
  const handleRegister = async () => {
    try {
        const { error, success, message, data } = await register(userData);
        setUser(data);
        onClose();
        setUserData(userInfo);
        console.log( "User registered successfully! 111111");
    } catch (err) {
        console.error(err.response.data.error);
        console.error("Registration error:", message);
    }
  };  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create an account.</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              placeholder="Enter your name"
              name="name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <Input
              placeholder="Enter your email"
              name="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <Input
              placeholder="Enter your password"
              name="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleRegister}
          >
            Sign Up
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
