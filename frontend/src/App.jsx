import { Box, useColorModeValue  } from '@chakra-ui/react'
import { Route, Routes } from "react-router-dom";

import HomePage from './pages/HomePage';
import CreatePage from "./pages/CreatePage";
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {

	return (
    <Box minH={"100vh"} bg={useColorModeValue("#D6C6F5", "#5B4279")}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute role={"superadmin" || "admin"}>
              <CreatePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Box>
  );
}

export default App