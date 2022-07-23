import Authenticated from "pages/Authenticated";
import Unauthenticated from "pages/Unauthenticated";
import useAuth from "./hooks/useAuth";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

function App() {
  const { user } = useAuth();

  return (
    <div id="App">
      <div className="app-container">{user.address ? <Authenticated /> : <Unauthenticated />}</div>
    </div>
  );
}

export default App;
