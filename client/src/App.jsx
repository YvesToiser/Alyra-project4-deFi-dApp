import Authenticated from "pages/Authenticated/Authenticated";
import Unauthenticated from "pages/Unauthenticated";
import useAuth from "./hooks/useAuth";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import useWallet from "hooks/useWallet";
import useEth from "hooks/useEth";
import Loader from "./components/Loader/Loader";

function App() {
  const { user } = useAuth();
  const { askAccount, getAccount } = useWallet();

  return (
    <div id="App">
      <div className="app-container">
        {user.address ? <Authenticated /> : <Unauthenticated getAccount={getAccount} askAccount={askAccount} />}
      </div>
    </div>
  );
}

export default App;
