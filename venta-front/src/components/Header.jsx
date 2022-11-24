import {
  Flex,
  Button,
  useColorModeValue,
  Spacer,
  LinkBox,
  LinkOverlay,
  Box,
  VStack,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Header = () => {
  return (
    <Flex
      as="header"
      bg={useColorModeValue("gray.100", "gray.900")}
      p={4}
      alignItems="center"
    >
      <LinkBox>
        <LinkOverlay>
          <Button color="black" bg="ButtonShadow">
            Agregar Producto
          </Button>
          <Button color="black" bg="ButtonShadow">
            Consultar Productos
          </Button>
          <Button color="black" bg="ButtonShadow">
            Pagar Productos
          </Button>
        </LinkOverlay>
      </LinkBox>
      <Spacer />
      <VStack>
        <Box w="100%" my={4}>
          <ConnectButton />
        </Box>
      </VStack>
    </Flex>
  );
};
