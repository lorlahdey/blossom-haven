import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import useAuthStore from "../store/authStore";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuthStore();
  const loginModal = useDisclosure(); // Separate state for login modal
  const signUpModal = useDisclosure(); // Separate state for signup modal
  
  const { colorMode, toggleColorMode } = useColorMode();
  const gradient = useColorModeValue(
    "linear(to-r, #FFF4E6, #FFDD4A,)", // Light mode gradient
    // "linear(to-r, #66CDAA, #2E8B57,)", // Light mode gradient
    "linear(to-r, #E56A77, #F7D6BA)" // Dark mode gradient
  );

  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{ base: "column", sm: "row" }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={gradient}
          bgClip={"text"}
        >
          <Link to={"/"}>Blossom Haven 🛒</Link>
        </Text>
        <HStack spacing={2} alignItems={"center"}>
          {isLoggedIn ? (
            (user.role === "superadmin" || user.role === "admin") && (
              <Link to={"/create"}>
                <Button>
                  <PlusSquareIcon fontSize={20} />
                </Button>
              </Link>
            )
          ) : (
            <>
              <Button
                onClick={loginModal.onOpen} // Open Login Modal
                variant={"outline"}
                borderColor={useColorModeValue("#5B4279", "#D6C6F5")}
                color={useColorModeValue("#5B4279", "#D6C6F5")}
                _hover={{
                  bg: useColorModeValue("#5B4279", "#D6C6F5"),
                  color: useColorModeValue("#ffffff", "#5B4279"),
                }}
              >
                Login
              </Button>
              <Button
                onClick={signUpModal.onOpen} // Open Sign-Up Modal
                variant={"outline"}
                borderColor={ useColorModeValue("#5B4279", "#D6C6F5")}
                bg={useColorModeValue("#5B4279", "#D6C6F5")}
                color={useColorModeValue("#ffffff", "#5B4279")}
                _hover={{
                  variant: "solid",
                  bg: useColorModeValue("transparent", "transparent"),
                  borderColor: useColorModeValue("#5B4279", "#D6C6F5"),
                  color: useColorModeValue("#5B4279", "#D6C6F5"),
                }}
              >
                Sign Up
              </Button>
            </>
          )}

          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon size="20" /> : <LuSun size="20" />}
          </Button>

          {isLoggedIn && (
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
              >
                <Avatar size={"sm"} name={user?.name || "User"} />
              </MenuButton>
              <MenuList>
                <Text px={3} py={2} fontSize={"sm"} fontWeight={"bold"}>
                  {user?.name || "User"}
                </Text>
                <Text px={3} fontSize={"sm"} color={"gray.500"}>
                  {user?.email}
                </Text>
                <Text px={3} pb={2} fontSize={"sm"} color={"gray.500"}>
                  Role: {user?.role}
                </Text>
                <Divider />
                <MenuItem
                  icon={
                    colorMode === "light" ? (
                      <FiLogOut size="16" />
                    ) : (
                      <IoLogOut size="16" />
                    )
                  }
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>

      <LoginModal
        isOpen={loginModal.isOpen}
        onClose={loginModal.onClose}
        signUpModal
      />
      <SignUpModal
        isOpen={signUpModal.isOpen}
        onClose={signUpModal.onClose}
        loginModal={loginModal}
      />
    </Container>
  );
};

export default Navbar;
