import ContainerCenter from "components/Containers/ContainerCenter/ConstainerCenter";
import Box from "components/Box/Box";
import useEth from "hooks/useEth";
import "./Authenticated.scss";

export default function Authenticated() {
  const {
    state: { user, network }
  } = useEth();
  return (
    <ContainerCenter>
      <Box className="box--shadow">
        <h1>Authenticated</h1>
        <p>{user.address}</p>
        <p>{network}</p>
      </Box>
    </ContainerCenter>
  );
}
