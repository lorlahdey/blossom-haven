import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useToast } from "@chakra-ui/react";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const {fetchUserData } = useAuthStore();
  const toast = useToast({
      position: "top-right",
      duration: 5000,
      isClosable: true,
    });

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        // Call fetchUserData from store
        const {success, message } = await fetchUserData(token);

        if (success) {
          setTimeout(() => {
            navigate("/");
          }, 500);
          toast({
            title: "Success",
            description: message,
            status: "success",
          });
        } else {
          navigate("/");
          toast({
            title: "Error",
            description: message,
            status: "error",
          });
        }
      } else {
        navigate("/"); // Redirect to homepage if no token is found
      }
    };

    fetchData();
  }, [navigate, fetchUserData]);

  return <p>Redirecting...</p>;
};

export default AuthSuccess;