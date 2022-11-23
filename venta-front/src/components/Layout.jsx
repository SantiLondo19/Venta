// src/components/layout.tsx
import { Text, Center, useColorModeValue } from "@chakra-ui/react";
import { AddProduct } from "./AddProduct";
import { Header } from "./Header";

export function Layout() {
  return (
    <div>
      <Header />
      <AddProduct />
      <Center as="footer" bg={useColorModeValue("gray.100", "gray.700")} p={6}>
        <Text fontSize="md">
          Dapp by Santiago Echavarria and Camilo Villa - 2022
        </Text>
      </Center>
    </div>
  );
}
