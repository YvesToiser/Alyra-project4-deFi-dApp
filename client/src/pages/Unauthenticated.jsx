import Button from "components/Button/Button";
import { ToastContainer, Flip } from "react-toastify";
import { toastConnected, toastPleaseAddWebsite, toastInstallMetamask } from "../helpers/toast";
import { Fragment, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import ContainerCenter from "../components/Containers/ContainerCenter/ContainerCenter";
import useEth from "hooks/useEth";

function ConnectButton(props) {
  return <Button onClick={props.onClick}>{props.children}</Button>;
}

export default function Unauthenticated({ getAccount, askAccount }) {
  const [loading, setLoading] = useState(false);
  const {
    dispatch,
    setUser,
    state: { web3 }
  } = useEth();

  useEffect(() => {
    if (!window.ethereum) return;

    setLoading(true);
    if (web3) {
      getAccount()
        .then((account) => {
          if (account) {
            setUser(account).then(() => {});
          }
        })
        .catch(() => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
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
