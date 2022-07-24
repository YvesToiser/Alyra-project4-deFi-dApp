import ContainerCenter from "components/Containers/ContainerCenter/ContainerCenter";
import Box from "components/Box/Box";
import useEth from "hooks/useEth";
import { pools } from "data/fakePool";
import "./Authenticated.scss";
import VaultItem from "../../components/VaultItem/VaulItem";
import VaultHeader from "components/VaultHeader/VaultHeader";

function UserInformations({ address, balance, network }) {
  return (
    <Box className="box--shadow">
      <p>{address}</p>
      <p>{network}</p>
      <p>{balance} ETH</p>
    </Box>
  );
}

export default function Authenticated() {
  const { state } = useEth();
  const { user, network } = state;

  return (
    <ContainerCenter>
      <UserInformations address={user.address} balance={user.balance} network={network} />
      <VaultHeader />
      {pools.map((pool) => (
        <VaultItem key={pool.id} name={pool.name} logo={pool.logo} apr={pool.apr} tvl={pool.tvl} />
      ))}
    </ContainerCenter>
  );
}
