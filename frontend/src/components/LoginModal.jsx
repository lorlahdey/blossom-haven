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
  email: "",
  password: "",
};
const LoginModal = ({ isOpen, onClose, }) => {
  const navigate = useNavigate();
  const { setUser, login, token, user, isLoggedIn } = useAuthStore();
  const [userData, setUserData] = useState(userInfo);

//   console.log(token, user, isLoggedIn, '00111');

  // Logging in
  const handleLogin = async () => {
    try {
        const { error, success, message, data } = await login(userData);
        setUser(data);
        onClose();
        setUserData(userInfo);
    } catch (err) {
      console.error(err.response.data.error);
    }
    
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome, please log in. </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
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
            // onClick={() => handleLogin()}
            onClick={handleLogin}
          >
            Log In
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
