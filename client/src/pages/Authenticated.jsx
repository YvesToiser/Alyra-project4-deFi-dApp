import useEth from "../hooks/useEth";
export default function Authenticated() {
  const {
    state: { user }
  } = useEth();
  return (
    <div>
      <h1>Authenticated</h1>
      <p>{user.address}</p>
    </div>
  );
}
