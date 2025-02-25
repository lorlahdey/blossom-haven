import { useState } from "react";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FaGoogle, FaFacebook, FaPinterest } from "react-icons/fa";
import useAuthStore from "../store/authStore";


const userInfo = {
    name: "",
    email: "",
    password: "",
};
const SignUpModal = ({ isOpen, onClose }) => {
  const { setUser, register, } = useAuthStore();
  const [userData, setUserData] = useState(userInfo);
  const toast = useToast({
    position: "top-right",
    duration: 5000,
    isClosable: true,
  });

  // Registering a user
  const handleRegister = async () => {
    try {
        const { success, message, data } = await register(userData);
        setUser(data);
        onClose();
        setUserData(userInfo);
        if (success) {
          toast({
            title: "Success",
            description: message,
            status: "success",
          });
        } else {
          toast({
            title: "Error",
            description: message,
            status: "error",
          });
        }
    } catch (err) {
        return err;
    }
  };  

  const handleSocialSignup = (provider) => {
    let authUrl = "";

    if (provider === "Google") {
      authUrl = "/api/auth/google";
    } else if (provider === "Facebook") {
      authUrl = "/api/auth/facebook";
    } else if (provider === "Pinterest") {
      authUrl = "/api/auth/pinterest";
    }

    // Redirect the user to the OAuth authentication page
    window.location.href = authUrl;
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
          <Divider my={4} />
          <VStack spacing={3}>
            <Button
              leftIcon={<FaGoogle />}
              colorScheme="red"
              variant="outline"
              width="full"
              onClick={() => handleSocialSignup("Google")}
            >
              Sign up with Google
            </Button>
            <Button
              leftIcon={<FaFacebook />}
              colorScheme="blue"
              variant="outline"
              width="full"
              // onClick={() => handleSocialSignup("Facebook")}
            >
              Sign up with Facebook
            </Button>
            <Button
              leftIcon={<FaPinterest />}
              colorScheme="red"
              variant="outline"
              width="full"
              // onClick={() => handleSocialSignup("Pinterest")}
            >
              Sign up with Pinterest
            </Button>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleRegister}>
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
