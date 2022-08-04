import Button from "components/Button/Button";
import { ToastContainer, Flip } from "react-toastify";
import { toastConnected, toastPleaseAddWebsite, toastInstallMetamask } from "../../helpers/toast";
import { Fragment, useEffect } from "react";
import useEth from "hooks/useEth";
import useWallet from "hooks/useWallet";

function ConnectButton(props) {
  return <Button onClick={props.onClick}>{props.children}</Button>;
}

export default function Connection() {
  const {
    dispatch,
    setUser,
    state: { web3 }
  } = useEth();
  const { askAccount, getAccount } = useWallet();

  useEffect(() => {
    if (!window.ethereum) return;

    if (web3) {
      getAccount()
        .then((account) => {
          if (account) {
            setUser(account).then(() => {});
          }
        })
        .catch(() => {})
        .finally(() => {});
    }
  }, [dispatch, getAccount, setUser, web3]);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const account = await askAccount();
        if (account) {
          await setUser();
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
    <Fragment>
      <ConnectButton onClick={handleConnect}>Connection</ConnectButton>
      <ToastContainer transition={Flip} />
    </Fragment>
  );
}
