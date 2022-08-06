import { GridItem, Button, Link, Grid, Flex, Box, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { tokenRound } from "../../helpers/calculation";

const VaultInfo = ({ children, title }) => {
  return (
    <Box my={4} fontSize={14} display="flex">
      <Text>{title} </Text>
      <Text fontWeight="bold" ml={2}>
        {children}
      </Text>
    </Box>
  );
};

const VaultLink = ({ children, link }) => {
  return (
    <Link href={link} isExternal my={4} color="blue.500">
      {children} <ExternalLinkIcon mx="2px" />
    </Link>
  );
};

const VaultButton = ({ children, onClick }) => {
  return (
    <Button variant={"outline"} colorScheme="teal" size="sm" my={4} mx={"auto"} p={4} onClick={onClick}>
      {children}
    </Button>
  );
};

const VaultDetailsEth = ({ token, onToggleStake, balance, amountStaked, pendingRewards }) => {
  const roundedBalance = tokenRound(balance);

  const MY_BALANCE = balance && `${roundedBalance.toFixed()} ETH`;
  const TOTAL_LOCKED = amountStaked && `${amountStaked} ETH`;
  // const CONTRACT_ETHERSCAN = contractTokenAdress && `https://${NETWORK_SCAN}/address/${contractTokenAdress}`;

  const canWithDraw = amountStaked && amountStaked > 0;
  const canStake = balance && balance.gt(0);

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={2} h="100%">
      <GridItem w="100%" colSpan={1} py={5}>
        <VaultInfo title="MyBalance:">{MY_BALANCE}</VaultInfo>
        <VaultInfo title="Total staked:">{TOTAL_LOCKED}</VaultInfo>
        {/* <VaultLink link={CONTRACT_ETHERSCAN}>View Contract</VaultLink> */}
      </GridItem>

      <GridItem w="100%" colSpan={2}>
        <Flex width="100%" height="100%" justify={"center"} align="center">
          <Box borderWidth="1px" borderRadius="20" width="80%" height="80%" p={8}>
            <Text fontSize={16}>BIX Earned</Text>
            <Text fontSize={16} fontWeight="bold">
              {pendingRewards}
            </Text>
            {/* <Text fontSize={16}>{REWARD_IN_USD}</Text> */}
          </Box>
        </Flex>
      </GridItem>

      <GridItem w="100%" colSpan={1}>
        <Flex width="100%" height="100%" justify={"center"} align="center" p={10} direction={"column"}>
          <Fragment>
            {canStake && <VaultButton onClick={() => onToggleStake("stake")}>Stake {token}</VaultButton>}
            {canWithDraw && <VaultButton onClick={() => onToggleStake("withdraw")}>Withdraw {token}</VaultButton>}
          </Fragment>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default VaultDetailsEth;
