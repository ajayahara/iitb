import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { useContext } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import { authContext } from "../context/AuthContext";

export const Navbar = () => {
  const { token, admin, logout } = useContext(authContext);

  return (
    <Box
      px={4}
      bg="#082e3b"
      boxShadow={"2xl"}
      color="white"
      position={"absolute"}
      top={0}
      left={0}
      w="full"
    >
      <Flex h={12} alignItems={"center"} justifyContent={"space-between"}>
        <Box>
          <Link as={RouterLink} p={2} fontWeight="bold">
            MyApp
          </Link>
        </Box>
        <Flex alignItems={"center"}>
          {token ? (
            <>
              <Link as={RouterLink} to="/" p={2}>
                Dashboard
              </Link>
              {admin && (
                <Link as={RouterLink} to="/verify" p={2}>
                  Verify
                </Link>
              )}
              <Button variant={"ghost"} color="white" onClick={logout} p={2}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link as={RouterLink} to="/login" p={2}>
                Login
              </Link>
              <Link as={RouterLink} to="/signup" p={2}>
                Signup
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
