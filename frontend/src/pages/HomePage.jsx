import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, SimpleGrid, Text, VStack, Spinner, useColorModeValue, useDisclosure, Button } from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import useAuthStore from "../store/authStore";
import ProductCard from "../components/ProductCard";
import LoginModal from "../components/LoginModal";

const HomePage = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();
    const { fetchProducts, products } = useProductStore();
    const [loading, setloading] = useState(true)
    const loginModal = useDisclosure();

    const gradient = useColorModeValue(
          "linear(to-r, #FFF4E6, #FFDD4A,)", // Light mode gradient
          // "linear(to-r, #66CDAA, #2E8B57,)", // Light mode gradient
          "linear(to-r, #E56A77, #F7D6BA)" // Dark mode gradient
        );

    useEffect(() => {
        setloading(true)
        fetchProducts();
        setloading(false)
    }, [fetchProducts]);

    const handleCreateProductClick = () => {
      if (isLoggedIn) {
        navigate("/create");
      } else {
        loginModal.onOpen(); // Trigger login modal
      }
    };

    return (
      <Container maxW="container.xl" py={12}>
        <VStack spacing={8}>
          <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgGradient={gradient}
            bgClip={"text"}
            textAlign={"center"}
          >
            Current Products 🚀
          </Text>

          {loading || products.length === 0 ? (
            <Spinner size="xl" />
          ) : (
            <SimpleGrid
              columns={{
                base: 1,
                md: 2,
                lg: 3,
              }}
              spacing={10}
              w={"full"}
            >
              {products?.map((product) => (
                <ProductCard key={product?._id} product={product} />
              ))}
            </SimpleGrid>
          )}

          {products.length === 0 && (
            <Text
              fontSize="xl"
              textAlign={"center"}
              fontWeight="bold"
              color="gray.500"
            >
              No products found 😢{" "}
              {/* <Link to={"/create"}>
                <Text
                  as="span"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Create a product
                </Text>
              </Link> */}
              <Button
                variant="link"
                color="blue.500"
                _hover={{ textDecoration: "underline" }}
                onClick={handleCreateProductClick}
              >
                Create a product
              </Button>
            </Text>
          )}
        </VStack>

        {/* Login Modal */}
        <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.onClose} />
      </Container>
    );
};

export default HomePage;
