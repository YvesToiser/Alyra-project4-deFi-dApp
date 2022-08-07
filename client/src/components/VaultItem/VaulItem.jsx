import "./VaultItem.scss";
import { useState } from "react";
import { Box, Collapse } from "@chakra-ui/react";
import Modal from "components/Modal/Modal";
import { StakeModal, WithdrawModal } from "components/StakeModal/StakeModal";

import useToken from "../../hooks/useToken";
import useTokenManager from "../../hooks/useTokenManager";
import React from "react";
import { tokenRound } from "../../helpers/calculation";
import { useEffect, useCallback } from "react";
import VaultDetails from "components/VaultDetails/VaultDetails";
import VaultMainInfo from "../VaultMainInfo/VaultMainInfo";
import { Big } from "big.js";

export default function VaultItem({ logo, name, user }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [tvl, setTvl] = useState(null);
  const [apr, setApr] = useState(null);
  const [pendingRewards, setPendingRewards] = useState(null);

  const token = useToken(name.toLowerCase());
  const sToken = useToken("sbyx");

  const manager = useTokenManager(name.toLowerCase());
  const sManager = useTokenManager("sbyx");

  const isAuth = !!user.address;

  const onToggleDetails = async () => {
    getPendingRewards();
    setShowDetails((_showDetails) => !_showDetails);
  };

  const onToggleModal = (type) => {
    setModalType(type);
    setIsOpen((_isOpen) => !_isOpen);
  };

  useEffect(() => {
    !manager.amountStaked && manager.getUserTotalStake();
  }, [manager]);

  useEffect(() => {
    !token.balance && token.getBalance();
  }, [token]);

  useEffect(() => {
    !sToken.balance && sToken.getBalance();
  }, [sToken]);

  // useEffect(() => {
  //   if (manager) {
  //     getPendingRewards();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [manager]);

  const getPendingRewards = useCallback(async () => {
    if (!manager || !sToken) return;

    const userSBYX = await sToken.balance;
    if (!userSBYX) {
      setPendingRewards(new Big(0));
      return;
    }

    const totalStokenSupply = await sToken.getTotalSupply();
    const tvl = await manager.getTVL();
    const onPlatformByx = userSBYX && totalStokenSupply && userSBYX.mul(tvl).div(totalStokenSupply);
    const valueStaked = manager.amountStaked;
    const pendingRewards = onPlatformByx && onPlatformByx.minus(valueStaked);

    pendingRewards && setPendingRewards(tokenRound(pendingRewards).toFixed());
  }, [manager, sToken]);

  useEffect(() => {
    if (manager && !tvl && manager.contractTokenManager) {
      manager.getPoolInfo().then((data) => {
        data && setTvl(new Big(data.tvl));
        data && setApr(new Big(data.apr));
      });
    }
  }, [tvl, manager.contractTokenManager, manager]);

  const updateInfo = useCallback(async () => {
    if (manager) {
      await token.getBalance();
      await sToken.getBalance();
      await manager.getUserTotalStake();
      manager.getPoolInfo().then((data) => {
        data && setTvl(new Big(data.tvl));
        data && setApr(new Big(data.apr));
      });
    }
  }, [manager, token, sToken]);

  const handleStake = async (percent) => {
    await manager.stake(token.balance.mul(percent / 100).round(), token);
    onToggleModal();
    await updateInfo();
  };

  const handleWithdraw = async (percent) => {
    await manager.withdraw(sToken.balance.mul(percent / 100).round(), token);
    onToggleModal();
    setPendingRewards(0);
    await updateInfo();
  };

  return (
    <Box borderWidth="2px" borderRadius="20" p={5}>
      <Modal isOpen={isOpen} onClose={onToggleModal} width={"50%"} height={"70%"}>
        {modalType === "stake" ? (
          <StakeModal
            token={name}
            tokenBalance={token.balance}
            getBalance={token.getBalance}
            getSBalance={sToken.getBalance}
            onToggleModal={onToggleModal}
            manager={manager}
            handleStake={handleStake}
          />
        ) : (
          <WithdrawModal
            token={"sbyx"}
            tokenBalance={token.balance}
            sTokenBalance={sToken.balance}
            getBalance={token.getBalance}
            getSBalance={sToken.getBalance}
            onToggleModal={onToggleModal}
            manager={manager}
            sManager={sManager}
            handleWithdraw={handleWithdraw}
          />
        )}
      </Modal>

      <VaultMainInfo logo={logo} name={name} apr={apr} tvl={tvl} isAuth={isAuth} onToggleDetails={onToggleDetails} />

      <Collapse in={showDetails} animateOpacity>
        <VaultDetails
          token={name}
          onToggleStake={onToggleModal}
          balance={token.balance}
          balanceSToken={sToken.balance}
          contractTokenAdress={token.contractTokenAdress}
          manager={manager}
          pendingRewards={pendingRewards}
        />
      </Collapse>
    </Box>
  );
}

//<Button onClick={() => setIsOpen((isOpen) => !isOpen)}>sqdqs</Button>
