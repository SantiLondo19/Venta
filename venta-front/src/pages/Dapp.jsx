import { ChakraProvider } from "@chakra-ui/react";
import { Layout } from "../components/Layout";

export const Dapp = () => {
  return (
    <ChakraProvider>
      <Layout />
    </ChakraProvider>
  );
};
