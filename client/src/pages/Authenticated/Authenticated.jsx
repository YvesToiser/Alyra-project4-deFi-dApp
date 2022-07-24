import ContainerCenter from "components/Containers/ContainerCenter/ConstainerCenter";
import Box from "components/Box/Box";
import useEth from "hooks/useEth";
import "./Authenticated.scss";

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
    </ContainerCenter>
  );
}
