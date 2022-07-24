import useAuth from "../hooks/useAuth";
import useWallet from "hooks/useWallet";
import Button from "components/Button/Button";
import { ToastContainer, Flip } from "react-toastify";
import { toastConnected, toastPleaseAddWebsite, toastInstallMetamask } from "../helpers/toast";
import { Fragment, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import ContainerCenter from "../components/Containers/ContainerCenter/ConstainerCenter";

function ConnectButton(props) {
  return <Button onClick={props.onClick}>{props.children}</Button>;
}

export default function Unauthenticated() {
  const { askAccount, getAccount } = useWallet();
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuth();

  useEffect(() => {
    setLoading(true);
    getAccount().then((account) => {
      if (account) {
        dispatch({ type: "SET_USER", data: { address: account, balance: 0 } });
      }
      setLoading(false);
    });
  }, [dispatch, getAccount]);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const account = await askAccount();
        if (account) {
          dispatch({ type: "SET_USER", data: { address: account.address, balance: 0 } });
          toastConnected();
        }
      } catch (err) {
        toastPleaseAddWebsite();
      }
    } else {
      toastInstallMetamask();
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <ContainerCenter>
            <ConnectButton onClick={handleConnect}>Connection</ConnectButton>
          </ContainerCenter>
          <ToastContainer transition={Flip} />
        </Fragment>
      )}
    </div>
  );
}
