import { Button, Container, Flex, HStack, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";

const Navbar = () => {
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
            <Link to={"/create"}>
              <Button>
                <PlusSquareIcon fontSize={20} />
              </Button>
            </Link>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? (
                <IoMoon size="20" />
              ) : (
                <LuSun size="20" />
              )}
            </Button>
          </HStack>
        </Flex>
      </Container>
    );
};

export default Navbar;
