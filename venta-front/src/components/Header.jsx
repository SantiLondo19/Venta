import {
  Flex,
  Button,
  useColorModeValue,
  Spacer,
  LinkBox,
  LinkOverlay,
  Heading,
  Box,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
export const Header = () => {
  const [balance, setBalance] = useState();
  const [currentAccount, setCurrentAccount] = useState();
  const [chainId, setChainId] = useState();
  const [chainname, setChainName] = useState();

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;
    //client side code
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result));
    });
    provider.getNetwork().then((result) => {
      setChainId(result.chainId);
      setChainName(result.name);
    });
  }, [currentAccount]);

  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      console.log("please install MetaMask");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    provider
      .send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0]);
      })
      .catch((e) => console.log(e));
  };

  const onClickDisconnect = () => {
    console.log("onClickDisConnect");
    setBalance(undefined);
    setCurrentAccount(undefined);
  };
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
          {currentAccount ? (
            <Button type="button" w="100%" onClick={onClickDisconnect}>
              Account:{currentAccount}
            </Button>
          ) : (
            <Button type="button" w="100%" onClick={onClickConnect}>
              Connect MetaMask
            </Button>
          )}
        </Box>
        {currentAccount ? (
          <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
            <Heading my={4} fontSize="xl">
              Account info
            </Heading>
            <Text>ETH Balance of current account: {balance}</Text>
            <Text>
              Chain Info: ChainId {chainId} name {chainname}
            </Text>
          </Box>
        ) : (
          <></>
        )}
        ...
      </VStack>
    </Flex>
  );
};
