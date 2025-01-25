import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, SimpleGrid, Text, VStack, Spinner, useColorModeValue } from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
    const { fetchProducts, products } = useProductStore();
    const [loading, setloading] = useState(true)

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

          {loading ? (
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
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
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
              <Link to={"/create"}>
                <Text
                  as="span"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Create a product
                </Text>
              </Link>
            </Text>
          )}
        </VStack>
      </Container>
    );
};

export default HomePage;
