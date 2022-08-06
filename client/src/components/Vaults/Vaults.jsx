import VaultItem from "components/VaultItem/VaulItem";
import VaultHeader from "components/VaultHeader/VaultHeader";
import useEth from "hooks/useEth";
import { pools } from "data/fakePool";
import "./Vaults.scss";
import { SimpleGrid, Flex } from "@chakra-ui/react";
import ethLogo from "assets/logos/logo-eth.png";
import VaultEth from "../VaultEth/VaultEth";

export default function Vaults() {
  const { state } = useEth();
  const { user, web3 } = state;

  return (
    <Flex direction="column" align="center">
      <SimpleGrid columns={1} spacingY="20px" w={"70vw"}>
        <VaultHeader />
        {pools.map((pool) => (
          <VaultItem
            key={pool.id}
            name={pool.name}
            logo={pool.logo}
            apr={pool.apr}
            tvl={pool.tvl}
            web3={web3}
            user={user}
          />
        ))}
        <VaultEth key={"eth"} name={"eth"} logo={ethLogo} web3={web3} user={user} />
      </SimpleGrid>
    </Flex>
  );
}
