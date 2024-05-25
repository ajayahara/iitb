import { Box } from "@chakra-ui/react";
import { PageRoutes } from "./routes/PageRoutes";
import { Navbar } from "./components/Navbar";

const App = () => {
  return (
    <Box position={"relative"} w="full">
      <Navbar />
      <PageRoutes />
    </Box>
  );
};
export default App;
