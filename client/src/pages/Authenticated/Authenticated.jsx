import VaultItem from "components/VaultItem/VaulItem";
import VaultHeader from "components/VaultHeader/VaultHeader";
import useEth from "hooks/useEth";
import { pools } from "data/fakePool";
import "./Authenticated.scss";
import { SimpleGrid, Box, Flex, Text } from "@chakra-ui/react";

function UserInformations({ address, balance, network }) {
  return (
    <Box borderWidth="1px" p={8} borderRadius="20">
      <Text>{address}</Text>
      <Text>{network}</Text>
      <Text>{balance} ETH</Text>
    </Box>
  );
}

export default function Authenticated() {
  const { state } = useEth();
  const { user, network } = state;

  return (
    <Flex direction="column" align="center">
      <Box h={10} />
      <UserInformations address={user.address} balance={user.balance} network={network} />
      <Box h={20} />
      <SimpleGrid columns={1} spacingY="20px" w={"70vw"}>
        <VaultHeader />
        {pools.map((pool) => (
          <VaultItem key={pool.id} name={pool.name} logo={pool.logo} apr={pool.apr} tvl={pool.tvl} />
        ))}
      </SimpleGrid>
    </Flex>
  );
}
