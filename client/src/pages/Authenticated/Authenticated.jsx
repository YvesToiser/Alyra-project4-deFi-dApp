import Box from "components/Box/Box";
import useEth from "hooks/useEth";
import "./Authenticated.scss";

export default function Authenticated() {
  const {
    state: { user, network }
  } = useEth();
  return (
    <div className="authenticated-container">
      <Box>
        <h1>Authenticated</h1>
        <p>{user.address}</p>
        <p>{network}</p>
      </Box>
    </div>
  );
}
