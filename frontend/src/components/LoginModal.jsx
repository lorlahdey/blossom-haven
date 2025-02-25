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
  email: "",
  password: "",
};
const LoginModal = ({ isOpen, onClose, }) => {
  const { setUser, login,  } = useAuthStore();
  const [userData, setUserData] = useState(userInfo);
  const toast = useToast({
        position: "top-right",
        duration: 5000,
        isClosable: true,
      });

  // Logging in
  const handleLogin = async () => {
    try {
        const { data, success,message } = await login(userData);
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
      return err
    }
  };

  const handleSocialLogin = (provider) => {
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
          <Divider my={4} />
          <VStack spacing={3}>
            <Button
              leftIcon={<FaGoogle />}
              colorScheme="red"
              variant="outline"
              width="full"
              onClick={() => handleSocialLogin("Google")}
            >
              Sign in with Google
            </Button>
            <Button
              leftIcon={<FaFacebook />}
              colorScheme="blue"
              variant="outline"
              width="full"
              // onClick={() => handleSocialLogin("Facebook")}
            >
              Sign in with Facebook
            </Button>
            <Button
              leftIcon={<FaPinterest />}
              colorScheme="red"
              variant="outline"
              width="full"
              // onClick={() => handleSocialLogin("Pinterest")}
            >
              Sign in with Pinterest
            </Button>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
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
