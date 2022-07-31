import "./VaultItem.scss";
import { useState } from "react";
import { Grid, GridItem, Box, Avatar, Center, SimpleGrid, Flex, Text, Button, Link, Collapse } from "@chakra-ui/react";

import { ExternalLinkIcon } from "@chakra-ui/icons";

const VaultInfo = ({ children }) => {
  return (
    <Text my={4} fontSize={14} display="flex">
      {children}
    </Text>
  );
};

const VaultLink = ({ children, link }) => {
  return (
    <Link href={link} isExternal my={4} color="blue.500">
      {children} <ExternalLinkIcon mx="2px" />
    </Link>
  );
};

const VaultElement = ({ children }) => {
  return (
    <Flex>
      <Center>
        <Text fontSize={16}>{children}</Text>
      </Center>
    </Flex>
  );
};

export default function VaultItem({ logo, name, apr, tvl }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((_showDetails) => !_showDetails);
  };

  const TOTAL_LOCKED = "172,270,237 BYX";
  const AVERAGE_LOCK_DURATION = "3 weeks";
  const CONTRACT_ETHERSCAN = "https://etherscan.io/address/0x0";
  const REWARD_IN_CRYPTO = 27;
  const REWARD_IN_USD = 100;

  return (
    <Box borderWidth="2px" borderRadius="20" p={5}>
      <SimpleGrid columns={5} justify="center" align="center">
        <Avatar src={logo} />
        <VaultElement>{name || "?"}</VaultElement>
        <VaultElement>{apr || "?"}</VaultElement>
        <VaultElement>{tvl || "?"}</VaultElement>

        <Button colorScheme="teal" size="md" onClick={toggleDetails} my="auto">
          Details
        </Button>
      </SimpleGrid>
      <Collapse in={showDetails} animateOpacity>
        <Grid templateColumns="repeat(4, 1fr)" gap={2} h="100%">
          <GridItem w="100%" colSpan={1} py={5}>
            <VaultInfo>
              <Text>Total locked: </Text>
              <Text fontWeight="bold" ml={2}>
                {TOTAL_LOCKED}
              </Text>
            </VaultInfo>
            <VaultInfo>
              <Text>Average lock duration:</Text>
              <Text fontWeight="bold" ml={2}>
                {AVERAGE_LOCK_DURATION}
              </Text>
            </VaultInfo>
            <VaultLink link={CONTRACT_ETHERSCAN}>View Contract</VaultLink>
          </GridItem>
          <GridItem w="100%" colSpan={2}>
            <Flex width="100%" height="100%" justify={"center"} align="center">
              <Box borderWidth="1px" borderRadius="20" width="80%" height="80%" p={8}>
                <Text fontSize={16}>Rewards</Text>
                <Text fontSize={16}>
                  {REWARD_IN_CRYPTO} {name}
                </Text>
                <Text fontSize={16}>{REWARD_IN_USD} USD</Text>
              </Box>
            </Flex>
          </GridItem>
          <GridItem w="100%" colSpan={1}>
            <Flex width="100%" height="100%" justify={"center"} align="center">
              <Flex width="100%" height="80%" direction={"column"} p={10} justify={"center"} align="center">
                <Button
                  colorScheme="teal"
                  size="md"
                  w="80%"
                  my={4}
                  mx={"auto"}
                  py={3}
                  px={8}
                  onClick={() => console.log("On Stake")}
                >
                  Stake {name}
                </Button>
                <Button
                  colorScheme="teal"
                  size="md"
                  w="80%"
                  my={4}
                  mx={"auto"}
                  p={3}
                  onClick={() => console.log("On Stake")}
                >
                  Unstake
                </Button>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
      </Collapse>
    </Box>
  );
}
